# Vox engine

The Vox voice engine: a Faber library (provider `engine`, en locale) that turns
articulation controls into mono audio by simulating air through a throat, mouth
and nose. No `tela:*`, no browser, no host imports; the same source runs on the
runner, the JIT, `ts` (Node) and `rust`.

## Modules (`src/`)

| Module | Role |
| --- | --- |
| `body.fab` | Body presets (male, female, child): tract length, pitch range; waveguide rate `c * 44 / length` |
| `noise.fab` | White noise (32-bit LCG, identical on every target) |
| `glottis.fab` | LF glottal source; Rd (0.3 pressed .. 2.7 breathy) rebuilds a 512-point flow-derivative table |
| `articulation.fab` | Area function of 44 oral sections and the 29-section nasal tract from tongue x/h, lips, jaw, velum, and a tip constriction |
| `tract.fab` | Kelly-Lochbaum waveguide: junction losses, three-port velum junction to the nose, radiation low-pass at mouth and nostril, noise injection |
| `formants.fab` | F1 to F3 of an area function by a lossless chain-matrix scan (telemetry) |
| `vowels.fab` | Articulation presets for a e i o u and schwa |
| `engine.fab` | `Engine`: setters, `render(frames)`, `telemetry()`, control-rate updates, resampler |
| `voice.fab` | Worklet entry (`Voice`: `process`, `message`, `telemetry`); the message keys and the telemetry layout are documented at the top |

Signal path, at the waveguide rate (88 kHz for the male tract, which is 2x
oversampling of 44.1 kHz; shorter tracts run faster, 106 kHz female, 134 kHz
child, because the section count stays 44): LF flow derivative plus pulsed
aspiration noise enter the glottis end, turbulence noise enters at the
narrowest oral section, the radiated pressure leaves the mouth (and nose),
then an anti-alias low-pass (only when the waveguide runs faster than the host
by more than 1x), a DC blocker, a Catmull-Rom resampler to the host rate, and a
soft clip.

## Decisions and deviations from SCOPE.md

- `voice.fab` exposes `Voice` with the three operations as methods, plus
  `create()`; SCOPE.md asks for free functions. Faber has no module-level
  mutable state, so free functions cannot hold the engine (gap 06).
- Mode `hold` (2) closes the glottis: no new excitation, the tract rings down.
  `whisper` (1) holds the glottis open and drives it with noise only. SCOPE.md
  does not define the three modes further; if `hold` should mean something
  else (a latched note), say so.
- Extra controls beyond the SCOPE.md list, needed for consonants: `tip_place`
  and `tip_area` (a second, narrow constriction), `turbulence` (fricative noise
  gain), `gain` (master).
- The area function in the telemetry is the engine's current (smoothed) one;
  `F1..F3` are a closed-velum, lossless estimate from it.
- Loudness across vowels is balanced with an exponent on the mouth opening in
  `tract.fab`; it is a fitted compensation, not physics.

## Tools (`tools/`, each a bin package with `library_home = "../../.."`)

```text
# F1/F2 of /a i u/ from rendered audio against published adult-male ranges;
# exit 0 pass, 1 fail. About 3.5 s on `faber run` (debug faber, JIT).
faber run tools/check-formants

# Five 1 s vowels to WAV (mono, 16-bit, 44.1 kHz). Needs norma:fs, so build native:
faber build tools/render-wav -t rust --release -o /tmp/vox-bin
/tmp/vox-bin/vox-render-wav /tmp/vox-wav       # vowel-a.wav ... vowel-u.wav

# Realtime factors, native and node, 20 s of audio through the worklet entry:
tools/bench-realtime/bench.sh
```

`faber build ... -t rust` leaves a `target/` directory inside each package; it
is build output, not source.

## Measured (2026-11-08, Apple M5 Max, AC power, faber 1.18.1 debug build)

| Check | Result |
| --- | --- |
| /a/ audio F1 / F2 | 694 / 1068 Hz (range 642-860 / 959-1493) |
| /i/ audio F1 / F2 | 263 / 2331 Hz (range 238-383 / 2015-2601) |
| /u/ audio F1 / F2 | 325 / 886 Hz (range 264-423 / 766-1117) |
| Realtime factor, native (`rust --release`) | about 108x |
| Realtime factor, node (ts build) | about 9.6x |
| Realtime factor, `faber run` (JIT in the debug faber) | about 0.74x |

Gaps found while building this are in `../GAPS.md`, with repros in `../gaps/`.
