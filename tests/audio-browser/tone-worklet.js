// Hand-written test processor following the Vox worklet contract: {key,value}
// messages in, Float64Array telemetry out about every 1024 frames.
class ToneTest extends AudioWorkletProcessor {
  constructor() {
    super();
    this.freq = 440;
    this.phase = 0;
    this.frames = 0;
    this.port.onmessage = (event) => {
      if (event.data.key === "pitch") this.freq = event.data.value;
    };
  }
  process(inputs, outputs) {
    const out = outputs[0];
    const n = out[0].length;
    for (let i = 0; i < n; i += 1) {
      const s = Math.sin(this.phase) * 0.5;
      this.phase += (2 * Math.PI * this.freq) / sampleRate;
      for (const ch of out) ch[i] = s;
    }
    this.frames += n;
    if (this.frames >= 1024) {
      this.port.postMessage(new Float64Array([this.freq, this.frames, out.length]));
      this.frames = 0;
    }
    return true;
  }
}
registerProcessor("tone-test", ToneTest);
