/**
 * tela/tests/fake-web-audio.ts — hand-rolled fakes of the Web Audio objects
 * runtime/audio.ts drives (no npm dependencies). They record calls and make
 * no sound. tests/audio-runtime-test.ts drives the runtime against them
 * directly; scripta/check-exempla installs them under node to run
 * exempla/audio.fab through the real runtime.
 *
 * `installFakeWebAudio` puts the fake AudioContext and AudioWorkletNode on
 * globalThis, where the runtime looks them up when a context or worklet node
 * is created.
 */


/** Every connect/disconnect, in order, shared by all fake nodes. */
export const wiring: string[] = [];

let fakeNodeCount = 0;

export class FakeNode {
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

export class FakeGainNode extends FakeNode {
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

export class FakeScriptProcessorNode extends FakeNode {
  private handler: ((event: { outputBuffer: FakeOutputBuffer }) => void) | null = null;
  private lastHandler: ((event: { outputBuffer: FakeOutputBuffer }) => void) | null = null;
  readonly blockSize: number;
  readonly inputs: number;
  readonly outputs: number;
  constructor(blockSize: number, inputs: number, outputs: number) {
    super("block");
    this.blockSize = blockSize;
    this.inputs = inputs;
    this.outputs = outputs;
  }
  get onaudioprocess(): ((event: { outputBuffer: FakeOutputBuffer }) => void) | null {
    return this.handler;
  }
  set onaudioprocess(handler: ((event: { outputBuffer: FakeOutputBuffer }) => void) | null) {
    this.handler = handler;
    if (handler !== null) {
      this.lastHandler = handler;
    }
  }
  /** The browser's audio callback for one block. */
  fire(frames: number): FakeOutputBuffer {
    return this.run(this.handler, frames);
  }
  /** The same callback with the handler the node last had, even after close released it. */
  fireLast(frames: number): FakeOutputBuffer {
    return this.run(this.lastHandler, frames);
  }
  private run(handler: ((event: { outputBuffer: FakeOutputBuffer }) => void) | null, frames: number): FakeOutputBuffer {
    const outputBuffer = new FakeOutputBuffer(frames);
    if (handler === null) {
      throw new Error("fake script processor has no handler");
    }
    handler({ outputBuffer });
    return outputBuffer;
  }
}

export class FakeAnalyserNode extends FakeNode {
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

let lastWorkletMade: FakeAudioWorkletNode | null = null;

export class FakeAudioWorkletNode extends FakeNode {
  readonly port = new FakeMessagePort();
  readonly context: unknown;
  readonly processorName: string;
  readonly options: unknown;
  constructor(context: unknown, processorName: string, options: unknown) {
    super("worklet");
    this.context = context;
    this.processorName = processorName;
    this.options = options;
    lastWorkletMade = this;
  }
}

export class FakeAudioWorklet {
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

export class FakeAudioContext {
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

// The runtime reaches the live context through its handle map; a test
// reaches the fake behind a handle through the last context constructed.
let lastContextMade: FakeAudioContext | null = null;
class RecordingAudioContext extends FakeAudioContext {
  constructor() {
    super();
    lastContextMade = this;
  }
}

export function lastContext(): FakeAudioContext | null {
  return lastContextMade;
}

export function lastWorkletNode(): FakeAudioWorkletNode | null {
  return lastWorkletMade;
}

/** Install the fakes. `failLoad` makes every worklet module load reject. */
export function installFakeWebAudio(options: { failLoad?: boolean } = {}): void {
  const g = globalThis as unknown as Record<string, unknown>;
  class InstalledAudioContext extends RecordingAudioContext {
    constructor() {
      super();
      if (options.failLoad === true) {
        (this.audioWorklet as FakeAudioWorklet).failWith = new Error("fake worklet module failed to load");
      }
    }
  }
  g.AudioContext = InstalledAudioContext;
  g.AudioWorkletNode = FakeAudioWorkletNode;
}
