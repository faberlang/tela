/**
 * tela/runtime/audio.ts — the tela-owned Web Audio host runtime
 * (tela:audio).
 *
 * Mirrors src/audio.fab: every fn maps to one exported function
 * (`webAudio*`), and every route in bindings/ts.toml resolves to one of
 * these symbols (verified by tests/contract-test.ts). AudioContext and
 * AudioNode are lightweight numeric handles resolved through module-level
 * Maps — the same lifecycle pattern as the canvas2d context handle. There is
 * no explicit dispose beyond closing a context: node handles accumulate until
 * their context is closed (matches the canvas2d accumulation precedent), and
 * closing releases every node handle of that context.
 *
 * One handle type stands for every node kind. Each Map entry records the
 * node's kind, and a fn that needs a particular kind (a gain node, an
 * analyser, a worklet) throws when given another.
 *
 * Failure policy: a bad handle, a wrong node kind, a block handler returning
 * the wrong number of samples and a non-numeric worklet message all throw an
 * Error naming `tela:audio`. A failed worklet load rejects the promise. The
 * fire-and-forget context calls (resume, suspend, close) log a rejected
 * promise with console.error.
 */

export type WebAudioContext = { readonly id: number };
export type WebAudioNode = { readonly id: number };
export type WebAudioBlockHandler = (frames: number) => number[];
export type WebAudioMessageHandler = (data: number[]) => void;

type NodeKind = "destination" | "gain" | "block" | "worklet" | "analyser";

type NodeEntry = {
  readonly kind: NodeKind;
  readonly contextId: number;
  readonly node: AudioNode;
};

let nextContextId = 1;
const contexts = new Map<number, AudioContext>();

let nextNodeId = 1;
const nodes = new Map<number, NodeEntry>();

// One destination handle per context, so repeated destination() calls do not
// grow the node map.
const destinations = new Map<number, number>();

export function webAudioCreateContext(): WebAudioContext {
  const context = new AudioContext();
  const id = nextContextId;
  nextContextId += 1;
  contexts.set(id, context);
  return { id };
}

export function webAudioResume(ctx: WebAudioContext): void {
  settle(contextById(ctx).resume(), "resume");
}

export function webAudioSuspend(ctx: WebAudioContext): void {
  settle(contextById(ctx).suspend(), "suspend");
}

export function webAudioClose(ctx: WebAudioContext): void {
  const context = contextById(ctx);
  for (const [id, entry] of nodes) {
    if (entry.contextId === ctx.id) {
      releaseNode(entry);
      nodes.delete(id);
    }
  }
  destinations.delete(ctx.id);
  settle(context.close(), "close");
}

export function webAudioState(ctx: WebAudioContext): string {
  return contextById(ctx).state;
}

export function webAudioSampleRate(ctx: WebAudioContext): number {
  return contextById(ctx).sampleRate;
}

export function webAudioCurrentTime(ctx: WebAudioContext): number {
  return contextById(ctx).currentTime;
}

export function webAudioDestination(ctx: WebAudioContext): WebAudioNode {
  const known = destinations.get(ctx.id);
  if (known !== undefined) {
    return { id: known };
  }
  const handle = rememberNode(ctx, "destination", contextById(ctx).destination);
  destinations.set(ctx.id, handle.id);
  return handle;
}

export function webAudioCreateGain(ctx: WebAudioContext): WebAudioNode {
  return rememberNode(ctx, "gain", contextById(ctx).createGain());
}

export function webAudioSetGain(node: WebAudioNode, gain: number): void {
  (nodeOfKind(node, "gain", "set_gain") as GainNode).gain.value = gain;
}

export function webAudioCreateBlockNode(
  ctx: WebAudioContext,
  blockSize: number,
  handler: WebAudioBlockHandler,
): WebAudioNode {
  // One input channel that is never connected (silent), one mono output.
  const processor = contextById(ctx).createScriptProcessor(blockSize, 1, 1);
  processor.onaudioprocess = (event: AudioProcessingEvent): void => {
    const output = event.outputBuffer;
    const frames = output.length;
    const samples = handler(frames);
    if (samples.length !== frames) {
      throw new Error(
        `tela:audio block handler returned ${samples.length} samples for a block of ${frames} frames`,
      );
    }
    for (let channel = 0; channel < output.numberOfChannels; channel += 1) {
      output.getChannelData(channel).set(samples);
    }
  };
  return rememberNode(ctx, "block", processor);
}

export async function webAudioLoadWorklet(ctx: WebAudioContext, moduleUrl: string): Promise<void> {
  const worklet = contextById(ctx).audioWorklet as AudioWorklet | undefined;
  if (worklet === undefined || typeof worklet.addModule !== "function") {
    throw new Error("tela:audio AudioWorklet is unavailable (it needs a secure context)");
  }
  await worklet.addModule(moduleUrl);
}

export function webAudioCreateWorkletNode(ctx: WebAudioContext, processorName: string): WebAudioNode {
  const worklet = new AudioWorkletNode(contextById(ctx), processorName, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [1],
  });
  return rememberNode(ctx, "worklet", worklet);
}

export function webAudioPostMessage(node: WebAudioNode, key: string, value: number): void {
  (nodeOfKind(node, "worklet", "post_message") as AudioWorkletNode).port.postMessage({ key, value });
}

export function webAudioSetMessageHandler(node: WebAudioNode, handler: WebAudioMessageHandler): void {
  const worklet = nodeOfKind(node, "worklet", "set_message_handler") as AudioWorkletNode;
  worklet.port.onmessage = (event: MessageEvent): void => {
    if (!(event.data instanceof Float64Array)) {
      throw new Error("tela:audio worklet message is not a Float64Array");
    }
    handler(Array.from(event.data));
  };
}

export function webAudioCreateAnalyser(ctx: WebAudioContext): WebAudioNode {
  return rememberNode(ctx, "analyser", contextById(ctx).createAnalyser());
}

export function webAudioSetFftSize(analyser: WebAudioNode, size: number): void {
  (nodeOfKind(analyser, "analyser", "set_fft_size") as AnalyserNode).fftSize = size;
}

export function webAudioFrequencyData(analyser: WebAudioNode): number[] {
  const node = nodeOfKind(analyser, "analyser", "frequency_data") as AnalyserNode;
  const data = new Float32Array(node.frequencyBinCount);
  node.getFloatFrequencyData(data);
  return Array.from(data);
}

export function webAudioTimeData(analyser: WebAudioNode): number[] {
  const node = nodeOfKind(analyser, "analyser", "time_data") as AnalyserNode;
  const data = new Float32Array(node.fftSize);
  node.getFloatTimeDomainData(data);
  return Array.from(data);
}

export function webAudioConnect(source: WebAudioNode, target: WebAudioNode): void {
  nodeById(source).node.connect(nodeById(target).node);
}

export function webAudioDisconnect(source: WebAudioNode, target: WebAudioNode): void {
  nodeById(source).node.disconnect(nodeById(target).node);
}

function contextById(handle: WebAudioContext): AudioContext {
  const context = contexts.get(handle.id);
  if (context === undefined) {
    throw new Error(`tela:audio unknown context handle id ${handle.id}`);
  }
  return context;
}

function nodeById(handle: WebAudioNode): NodeEntry {
  const entry = nodes.get(handle.id);
  if (entry === undefined) {
    throw new Error(`tela:audio unknown node handle id ${handle.id}`);
  }
  return entry;
}

function nodeOfKind(handle: WebAudioNode, kind: NodeKind, operation: string): AudioNode {
  const entry = nodeById(handle);
  if (entry.kind !== kind) {
    throw new Error(`tela:audio ${operation} needs a node of kind ${kind}, node ${handle.id} is of kind ${entry.kind}`);
  }
  return entry.node;
}

function rememberNode(ctx: WebAudioContext, kind: NodeKind, node: AudioNode): WebAudioNode {
  const id = nextNodeId;
  nextNodeId += 1;
  nodes.set(id, { kind, contextId: ctx.id, node });
  return { id };
}

// Drop the closures a node holds so a closed context lets them go.
function releaseNode(entry: NodeEntry): void {
  if (entry.kind === "block") {
    (entry.node as ScriptProcessorNode).onaudioprocess = null;
  } else if (entry.kind === "worklet") {
    (entry.node as AudioWorkletNode).port.onmessage = null;
  }
}

function settle(promise: Promise<void>, operation: string): void {
  promise.catch((error: unknown): void => {
    console.error(`tela:audio ${operation} failed:`, error);
  });
}
