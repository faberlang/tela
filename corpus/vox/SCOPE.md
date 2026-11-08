# Vox — scope of responsibility

Vox is a browser vocal-tract synthesizer written in Faber. Every sound comes
from simulating air through a throat, mouth and nose. It is modeled on the
public physics literature (Kelly-Lochbaum waveguide tract, LF / Rosenberg
glottal source, Pink Trombone lineage), **not** on any existing product's code
or assets. The point of building it is to find out what breaks in Faber,
tela and radix. A break is a finding to record and route, not something to
hide.

Plan of record: 2026-11-08. Lanes are git worktrees under
`/Users/ianzepp/work/faberlang/worktrees/`. Agents do not commit; the
orchestrator commits on the lane branch.

## Lanes

| Lane | Worktree | Branch | Repo | Owns |
|---|---|---|---|---|
| app | `worktrees/vox-app` | `vox/app` | tela | `corpus/vox/**` only |
| tela-audio | `worktrees/vox-tela-audio` | `vox/tela-audio` | tela | `tela:audio` (src, runtime, bindings, tests, exempla) |
| radix | `worktrees/vox-radix` | `vox/radix` | radix | browser-app audio-worklet output; compiler fixes routed from the app lane |

triga is not touched: Vox has no 3D view.

## Admitted scope

1. **Engine** (`corpus/vox/engine/`, Faber library, en locale). Target-neutral:
   no `tela:*` or browser imports. Compiles for `ts` and for a native target.
   - Glottal source: pitch (Hz), breath pressure, pressed/tenseness, vibrato
     (cents + rate), aspiration noise; modes voice / whisper / hold.
   - Tract: Kelly-Lochbaum waveguide, ~44 sections, 2× oversampled, losses,
     glottis and lip reflections; area function built from articulation
     (tongue position + height, lip opening, jaw, velum).
   - Nasal branch coupled at the velum.
   - Turbulence noise at narrow constrictions (fricatives).
   - Body presets: male, female, child (tract length, pitch range).
   - One engine state object; `render(frames)` returns mono samples; setters
     for every control; telemetry: area function, glottal flow, F1–F3.
   - Native tools: render a vowel set to WAV; check F1/F2 of /a i u/ against
     published adult ranges; report realtime factor for native and for
     TS under node.
2. **tela:audio** (tela-audio lane): audio context lifecycle, sample rate,
   main-thread block processing, AudioWorklet node by (module URL, processor
   name) with numeric param posting and message receipt, analyser (frequency
   and time-domain data), master gain.
3. **Audio-worklet product output** (radix lane): a browser-app declares a
   Faber worklet entry; `faber build` emits one self-contained ES module that
   runs in `AudioWorkletGlobalScope` (no DOM, no Node globals, no dynamic
   `import()`), registers the processor, and calls the entry per the contract
   below.
4. **App** (`corpus/vox/app/`, browser-app): Play mode. Midsagittal anatomy
   view with draggable tongue, lips, jaw and soft palate; tube view; glottal
   waveform; spectrum; F1/F2 vowel chart; controls for pitch, breath, pressed,
   vibrato and voice/whisper/hold; on-screen and computer-keyboard keys play
   pitches; body preset switch.
5. **Speak and Sing**: a phoneme-string sequencer with coarticulation
   (Speak) and a melody + syllable score (Sing), driving the same engine.

## Out of scope

Bestiary, Beatbox, Duet, the 3D view, Web MIDI, English text-to-phoneme.

## Worklet contract (fixed; lanes build to it)

Manifest (product surface on the radix lane; needs operator sign-off
before it reaches radix main):

```toml
[product.audio_worklet]
entry = "src/voice.fab"   # Faber module run inside the worklet
processor = "vox-voice"   # registerProcessor name
```

Output: `dist/worklets/<processor>.js`.

The worklet entry module exposes one public function and one public class
(amended 2026-11-08, gap 06: Faber has no module-level mutable state, so free
functions have nowhere to keep the voice between calls):

- `fn create() → V`, where `V` is a public class of the entry module with:
  - `process(int frames, f64 sample_rate) → list<f64>` — next `frames` mono
    samples.
  - `message(string key, f64 value) → void` — one control change.
  - `telemetry() → list<f64>` — a flat snapshot; the processor posts it to
    the main thread about every 1024 frames.

The generated processor calls `create()` once in its constructor and holds
the instance. It fills every output channel with the mono block, forwards
`port` messages of shape `{key, value}` to `message`, and posts `telemetry()`
results as a `Float64Array`. No part of the contract may rely on a `const`
instance holding state (gap 06b: that works on ts only).

The main-thread fallback (tela:audio block processing) creates and holds the
same instance, so the app runs with or without the worklet route.

## Gap protocol

When Faber, tela, norma or radix gets in the way:

1. Write the smallest program that shows it under `corpus/vox/gaps/` (or the
   lane's own test location) and add one line to `corpus/vox/GAPS.md`:
   number, symptom, repro path, owning repo.
2. If an equally plain formulation exists, use it and mark the spot with
   `# gap NN`. Never add a workaround layer, shim, or wrapper that hides the
   gap.
3. If no plain formulation exists, stop that piece and report it.

## Tooling

- Compiler: `/Users/ianzepp/work/faberlang/radix/target/debug/faber` (radix
  main). Never run cargo in the main radix checkout. The radix lane builds
  its own `faber` in its worktree.
- Load the Faber skill first:
  `/Users/ianzepp/work/faberlang/radix/skills/faber/SKILL.md`. Verify spellings
  with `faber check` against `radix/corpus/` exemplars; do not guess.
- `rm -rf` is banned; use `trash`. Put `/opt/homebrew/bin` first on `PATH`.
- State the expected duration before any command that may take over 30
  seconds, and run it under a timeout of about 3× that.
