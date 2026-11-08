/**
 * tela/tests/audio-runtime-test.ts — the committed tela:audio runtime
 * execution test (the canvas2d-runtime-test precedent).
 *
 * The route bijection (every fn ↔ route ↔ runtime symbol) is proven by
 * tests/contract-test.ts. This test proves the behavior behind the routes:
 * it drives every `webAudio*` runtime function against hand-rolled fakes of
 * the Web Audio objects (no npm dependencies) and asserts how the runtime
 * calls them — handle resolution, node-kind checks, the block-processing
 * copy into every output channel, the worklet message plumbing
 * (`{key, value}` out, Float64Array in → plain number list), the analyser
 * reads, the connect graph, the async worklet load, and context close
 * releasing the node handles.
 *
 * Honest limit: the fakes record calls; they produce no sound and run no
 * audio thread. Behavior in a real browser (autoplay policy, the audio
 * thread's block cadence, a real AudioWorkletGlobalScope, FFT output) is NOT
 * covered here and needs a browser harness.
 *
 * Run (from the tela repo root):
 *   tsc --strict --module CommonJS --outDir <scratch> tests/audio-runtime-test.ts
 *   node <scratch>/audio-runtime-test.js
 */

import {
  webAudioClose,
  webAudioConnect,
  webAudioCreateAnalyser,
  webAudioCreateBlockNode,
  webAudioCreateContext,
  webAudioCreateGain,
  webAudioCreateWorkletNode,
  webAudioCurrentTime,
  webAudioDestination,
  webAudioDisconnect,
  webAudioFrequencyData,
  webAudioLoadWorklet,
  webAudioPostMessage,
  webAudioResume,
  webAudioSampleRate,
  webAudioSetFftSize,
  webAudioSetGain,
  webAudioSetMessageHandler,
  webAudioState,
  webAudioSuspend,
  webAudioTimeData,
} from "../runtime/audio";

// ---- hand-rolled fakes ---------------------------------------------------

/** Every connect/disconnect, in order, shared by all fake nodes. */
const wiring: string[] = [];

let fakeNodeCount = 0;

class FakeNode {
  readonly label: string;
  constructor(label: string) {
    fakeNodeCount += 1;
    this.label = `${label}#${fakeNodeCount}`;
  }
  connect(target: FakeNode): void {
    wiring.push(`connect ${this.label} -> ${target.label}`);
  }
  disconnect(target: FakeNode): void {
    wiring.push(`disconnect ${this.label} -> ${target.label}`);
  }
}

class FakeGainNode extends FakeNode {
  readonly gain = { value: 1 };
  constructor() {
    super("gain");
  }
}

class FakeOutputBuffer {
  readonly length: number;
  readonly numberOfChannels = 2;
  private readonly channels: Float32Array[];
  constructor(frames: number) {
    this.length = frames;
    this.channels = [new Float32Array(frames), new Float32Array(frames)];
  }
  getChannelData(channel: number): Float32Array {
    return this.channels[channel];
  }
}

class FakeScriptProcessorNode extends FakeNode {
  onaudioprocess: ((event: { outputBuffer: FakeOutputBuffer }) => void) | null = null;
  readonly blockSize: number;
  readonly inputs: number;
  readonly outputs: number;
  constructor(blockSize: number, inputs: number, outputs: number) {
    super("block");
    this.blockSize = blockSize;
    this.inputs = inputs;
    this.outputs = outputs;
  }
  /** The browser's audio callback for one block. */
  fire(frames: number): FakeOutputBuffer {
    const outputBuffer = new FakeOutputBuffer(frames);
    if (this.onaudioprocess === null) {
      throw new Error("fake script processor has no handler");
    }
    this.onaudioprocess({ outputBuffer });
    return outputBuffer;
  }
}

class FakeAnalyserNode extends FakeNode {
  fftSize = 2048;
  get frequencyBinCount(): number {
    return this.fftSize / 2;
  }
  constructor() {
    super("analyser");
  }
  getFloatFrequencyData(out: Float32Array): void {
    for (let i = 0; i < out.length; i += 1) {
      out[i] = -100 + i; // a deterministic dB ramp
    }
  }
  getFloatTimeDomainData(out: Float32Array): void {
    for (let i = 0; i < out.length; i += 1) {
      out[i] = i % 2 === 0 ? 0.5 : -0.5;
    }
  }
}

class FakeMessagePort {
  readonly posted: unknown[] = [];
  onmessage: ((event: { data: unknown }) => void) | null = null;
  postMessage(message: unknown): void {
    this.posted.push(message);
  }
}

let lastWorkletNode: FakeAudioWorkletNode | null = null;

class FakeAudioWorkletNode extends FakeNode {
  readonly port = new FakeMessagePort();
  readonly context: unknown;
  readonly processorName: string;
  readonly options: unknown;
  constructor(context: unknown, processorName: string, options: unknown) {
    super("worklet");
    this.context = context;
    this.processorName = processorName;
    this.options = options;
    lastWorkletNode = this;
  }
}

class FakeAudioWorklet {
  readonly modules: string[] = [];
  failWith: Error | null = null;
  async addModule(url: string): Promise<void> {
    await Promise.resolve();
    if (this.failWith !== null) {
      throw this.failWith;
    }
    this.modules.push(url);
  }
}

class FakeAudioContext {
  state = "suspended";
  readonly sampleRate = 48000;
  currentTime = 0;
  readonly destination = new FakeNode("destination");
  audioWorklet: FakeAudioWorklet | undefined = new FakeAudioWorklet();
  readonly created: FakeNode[] = [];
  async resume(): Promise<void> {
    await Promise.resolve();
    this.state = "running";
  }
  async suspend(): Promise<void> {
    await Promise.resolve();
    this.state = "suspended";
  }
  async close(): Promise<void> {
    await Promise.resolve();
    this.state = "closed";
  }
  createGain(): FakeGainNode {
    const node = new FakeGainNode();
    this.created.push(node);
    return node;
  }
  createScriptProcessor(blockSize: number, inputs: number, outputs: number): FakeScriptProcessorNode {
    const node = new FakeScriptProcessorNode(blockSize, inputs, outputs);
    this.created.push(node);
    return node;
  }
  createAnalyser(): FakeAnalyserNode {
    const node = new FakeAnalyserNode();
    this.created.push(node);
    return node;
  }
}

// The runtime reaches the live context through its handle map; the test
// reaches the fake behind a handle through the last context constructed.
let lastContext: FakeAudioContext | null = null;
class RecordingAudioContext extends FakeAudioContext {
  constructor() {
    super();
    lastContext = this;
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`audio-runtime-test assert failed: ${message}`);
  }
}

async function rejects(promise: Promise<unknown>, fragment: string): Promise<boolean> {
  try {
    await promise;
  } catch (e) {
    return (e as Error).message.includes(fragment);
  }
  return false;
}

function throwsWith(action: () => void, fragment: string): boolean {
  try {
    action();
  } catch (e) {
    return (e as Error).message.includes(fragment);
  }
  return false;
}

async function main(): Promise<void> {
  const g = globalThis as unknown as Record<string, unknown>;
  g.AudioContext = RecordingAudioContext;
  g.AudioWorkletNode = FakeAudioWorkletNode;

  // --- context lifecycle --------------------------------------------------
  const ctx = webAudioCreateContext();
  assert(typeof ctx.id === "number" && ctx.id >= 1, "a context handle is a positive number");
  const fake = lastContext as unknown as FakeAudioContext;
  assert(webAudioState(ctx) === "suspended", "a new context is suspended");
  assert(webAudioSampleRate(ctx) === 48000, "sample rate reads the context");
  fake.currentTime = 1.5;
  assert(webAudioCurrentTime(ctx) === 1.5, "current time reads the context");
  webAudioResume(ctx);
  await Promise.resolve();
  await Promise.resolve();
  assert(webAudioState(ctx) === "running", "resume starts the context");
  webAudioSuspend(ctx);
  await Promise.resolve();
  await Promise.resolve();
  assert(webAudioState(ctx) === "suspended", "suspend stops the context");
  assert(throwsWith(() => webAudioState({ id: 9999 }), "unknown context handle id"), "an unknown context handle is rejected");

  // --- destination --------------------------------------------------------
  const out = webAudioDestination(ctx);
  assert(webAudioDestination(ctx).id === out.id, "destination returns one handle per context");

  // --- master gain --------------------------------------------------------
  const gain = webAudioCreateGain(ctx);
  const gainFake = fake.created[0] as FakeGainNode;
  assert(gainFake.gain.value === 1, "a new gain node is at unity");
  webAudioSetGain(gain, 0.25);
  assert(gainFake.gain.value === 0.25, "set_gain writes the gain value");
  assert(throwsWith(() => webAudioSetGain(out, 0.5), "set_gain needs a node of kind gain"), "set_gain rejects a non-gain node");

  // --- main-thread block processing ----------------------------------------
  const seen: number[] = [];
  const block = webAudioCreateBlockNode(ctx, 1024, (frames: number): number[] => {
    seen.push(frames);
    const samples: number[] = [];
    for (let i = 0; i < frames; i += 1) {
      samples.push(i / frames);
    }
    return samples;
  });
  const blockFake = fake.created[1] as FakeScriptProcessorNode;
  assert(blockFake.blockSize === 1024 && blockFake.outputs === 1, "the processor is made with the block size and one output");
  const filled = blockFake.fire(1024);
  assert(seen.length === 1 && seen[0] === 1024, "the handler receives the frame count");
  assert(filled.getChannelData(0)[512] === 0.5 && filled.getChannelData(1)[512] === 0.5, "the mono block fills every output channel");
  assert(filled.getChannelData(0)[1023] === Math.fround(1023 / 1024), "samples are stored as float32");

  const badBlock = webAudioCreateBlockNode(ctx, 256, (): number[] => [0, 0, 0]);
  const badFake = fake.created[2] as FakeScriptProcessorNode;
  assert(
    throwsWith(() => badFake.fire(256), "returned 3 samples for a block of 256 frames"),
    "a block handler returning the wrong sample count is rejected",
  );
  assert(throwsWith(() => webAudioPostMessage(badBlock, "k", 1), "post_message needs a node of kind worklet"), "post_message rejects a non-worklet node");

  // --- AudioWorklet route ----------------------------------------------------
  const worklet = fake.audioWorklet as FakeAudioWorklet;
  await webAudioLoadWorklet(ctx, "/worklets/vox-voice.js");
  assert(worklet.modules.length === 1 && worklet.modules[0] === "/worklets/vox-voice.js", "load_worklet adds the module by URL");
  worklet.failWith = new Error("addModule failed");
  assert(await rejects(webAudioLoadWorklet(ctx, "/bad.js"), "addModule failed"), "a failed load rejects the promise");
  worklet.failWith = null;
  fake.audioWorklet = undefined;
  assert(await rejects(webAudioLoadWorklet(ctx, "/x.js"), "AudioWorklet is unavailable"), "a missing audioWorklet rejects with a clear message");
  fake.audioWorklet = worklet;

  const voice = webAudioCreateWorkletNode(ctx, "vox-voice");
  assert(lastWorkletNode !== null, "the worklet node was constructed");
  const node = lastWorkletNode as unknown as FakeAudioWorkletNode;
  assert(node.processorName === "vox-voice", "the worklet node names its processor");
  assert(node.context === fake, "the worklet node is made on the context");
  assert(JSON.stringify(node.options) === JSON.stringify({ numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [1] }), "the worklet node is a mono source");

  webAudioPostMessage(voice, "pitch", 220);
  assert(JSON.stringify(node.port.posted) === JSON.stringify([{ key: "pitch", value: 220 }]), "post_message posts {key, value} to the port");

  const received: number[][] = [];
  webAudioSetMessageHandler(voice, (data: number[]): void => {
    received.push(data);
  });
  assert(node.port.onmessage !== null, "set_message_handler listens on the port");
  (node.port.onmessage as (event: { data: unknown }) => void)({ data: new Float64Array([1.5, 2.5, 3.5]) });
  assert(received.length === 1 && Array.isArray(received[0]), "a Float64Array message reaches the handler as a plain list");
  assert(received[0].join(",") === "1.5,2.5,3.5", "the message numbers arrive intact");
  assert(
    throwsWith(() => (node.port.onmessage as (event: { data: unknown }) => void)({ data: "hello" }), "not a Float64Array"),
    "a non-numeric message is rejected",
  );
  const second: number[][] = [];
  webAudioSetMessageHandler(voice, (data: number[]): void => {
    second.push(data);
  });
  (node.port.onmessage as (event: { data: unknown }) => void)({ data: new Float64Array([9]) });
  assert(received.length === 1 && second.length === 1, "a later handler replaces the earlier one");

  // --- analyser ----------------------------------------------------------------
  const analyser = webAudioCreateAnalyser(ctx);
  const analyserFake = lastOfKind<FakeAnalyserNode>(fake, FakeAnalyserNode);
  webAudioSetFftSize(analyser, 4096);
  assert(analyserFake.fftSize === 4096, "set_fft_size writes the size");
  const spectrum = webAudioFrequencyData(analyser);
  assert(Array.isArray(spectrum) && spectrum.length === 2048, "frequency data has fft/2 bins as a plain list");
  assert(spectrum[0] === -100 && spectrum[2047] === 1947, "frequency data carries the analyser's dB values");
  const wave = webAudioTimeData(analyser);
  assert(Array.isArray(wave) && wave.length === 4096, "time data has fft-size samples as a plain list");
  assert(wave[0] === 0.5 && wave[1] === -0.5, "time data carries the analyser's samples");
  assert(throwsWith(() => webAudioSetFftSize(gain, 512), "set_fft_size needs a node of kind analyser"), "analyser reads reject a non-analyser node");

  // --- graph wiring ------------------------------------------------------------
  wiring.length = 0;
  webAudioConnect(block, gain);
  webAudioConnect(gain, out);
  webAudioConnect(gain, analyser);
  webAudioDisconnect(gain, analyser);
  assert(wiring.length === 4, `four wiring calls recorded (got ${wiring.length})`);
  assert(wiring[0].startsWith("connect block#") && wiring[0].includes("-> gain#"), "connect routes source to target");
  assert(wiring[1].includes("-> destination#"), "a node connects to the destination");
  assert(wiring[3].startsWith("disconnect gain#") && wiring[3].includes("-> analyser#"), "disconnect routes source to target");
  assert(throwsWith(() => webAudioConnect({ id: 9999 }, out), "unknown node handle id"), "an unknown node handle is rejected");

  // --- close releases the context's nodes --------------------------------------
  webAudioClose(ctx);
  await Promise.resolve();
  await Promise.resolve();
  assert(webAudioState(ctx) === "closed", "close closes the context");
  assert(blockFake.onaudioprocess === null, "close drops the block handler");
  assert(node.port.onmessage === null, "close drops the worklet message handler");
  assert(throwsWith(() => webAudioConnect(gain, out), "unknown node handle id"), "close releases the node handles");

  // A second context is independent of the first one's close.
  const other = webAudioCreateContext();
  const otherGain = webAudioCreateGain(other);
  webAudioSetGain(otherGain, 0.5);
  assert(webAudioState(other) === "suspended", "a later context is unaffected by an earlier close");

  console.log("audio-runtime-test: green (node fakes — handle resolution, kind checks, block copy, worklet messages, analyser reads, wiring, close)");
}

function lastOfKind<T extends FakeNode>(context: FakeAudioContext, kind: new (...args: never[]) => T): T {
  for (let i = context.created.length - 1; i >= 0; i -= 1) {
    if (context.created[i] instanceof kind) {
      return context.created[i] as T;
    }
  }
  throw new Error("audio-runtime-test: no node of the requested kind was created");
}

main().catch((e: unknown): void => {
  console.error(e);
  process.exitCode = 1;
});

declare const process: { exitCode: number | undefined };
