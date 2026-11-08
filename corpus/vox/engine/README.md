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
| `engine.fab` | `Engine`: setters, `render(frames)`, `telemetry()`, control-rate updates, resampler, and where the sequencer drives the controls |
| `voice.fab` | Worklet entry (`Voice`: `process`, `message`, `telemetry`); the message keys (including `seq_*`) and the telemetry layout are documented at the top |
| `phones.fab` | The phoneme set (ARPAbet, 41 ids): each row is articulator targets, a tip constriction, voicing and a nominal duration |
| `sequencer.fab` | `Sequencer`: loads items from messages, compiles them to segments, plays them on the engine's control tick (Speak and Sing) |
| `score.fab` | Text to messages: `speak(text, base_midi)` and `sing(text, transpose)` return a `Score` (the message stream, a label per item, the first problem) |
| `presets.fab` | The page's example phrases and tunes, as data |

Signal path, at the waveguide rate (88 kHz for the male tract, which is 2x
oversampling of 44.1 kHz; shorter tracts run faster, 106 kHz female, 134 kHz
child, because the section count stays 44): LF flow derivative plus pulsed
aspiration noise enter the glottis end, turbulence noise enters at the
narrowest oral section, the radiated pressure leaves the mouth (and nose),
then an anti-alias low-pass (only when the waveguide runs faster than the host
by more than 1x), a DC blocker, a Catmull-Rom resampler to the host rate, and a
soft clip.

## Speak and Sing

### Where the sequencer runs, and why

Inside the engine, on its control tick (every 32 waveguide steps, about 0.7 ms),
fed by the ordinary `message(key, value)` stream; the page only loads items and
sends `seq_play`. The alternative, a page timer that sends each articulation
change when it is due, cannot do the job: a stop is a closure of 30 to 60 ms
and a burst of a few milliseconds, and a main-thread timer plus the port's
latency jitters by 16 ms or more, so the burst would land where it likes.
In the engine the timing is the audio clock's, and the same sequence renders
the same samples on the worklet, on the main-thread block route and in the
native WAV tool. The worklet contract (`create()` returning a class with
`process`, `message`, `telemetry`; numeric messages only) carries a sequence
unchanged: an ordered stream of `{key, value}` pairs loads the items
(`seq_phone`, `seq_ms`, `seq_beats`, `seq_minus`, `seq_pitch`, `seq_glide`,
then `seq_item`), `seq_tempo` / `seq_rate` / `seq_level` are live, `seq_play`
and `seq_stop` start and end. Messages arrive in order, so a program is correct
however it is split. No contract change was needed.

### The model

An item (a phoneme, a duration, a pitch) compiles to one or more segments; a
segment is a target and a ramp time for each of twelve channels (tongue x and
height, lips, jaw, velum, tip place, tip area, voicing, noise, aspiration,
loudness, pitch). Playing is a follower: at each segment start every channel's
present value is the "from", the segment's value the "to", and the channel
moves by a smoothstep over its own ramp time. Coarticulation falls out of that
and of three rules (`sequencer.fab` has them in full): a consonant's tongue
body is transparent and takes the posture of the next vowel, glide or /r/; the
tip constriction is its own gesture and ramps in log area, so the turbulent
range (below 0.25 cm^2) is a fixed share of a release whatever the speed; the
velum starts lowering on the vowel before a nasal. A stop is closure, burst
and (voiceless) aspiration segments; an affricate a closure and a fricative
release; a diphthong two vowel segments. The engine has no air pressure, so the
burst and frication envelopes are channels the sequence shapes.

While a sequence plays the waveguide follows its targets with a 1.5 ms time
constant (the sequencer shapes the movement itself); Play mode keeps 25 ms.
`vibrato_*`, `pressed`, `aspiration`, `body` and `mode` keep their meaning
while a sequence plays (mode 1 whispers it); `tongue_x` .. `velum`, `pitch`,
`breath` and `tip_*` are overwritten by it each tick, and come back when it
ends. The telemetry grew to 233 values (layout version 2): a sequencer block
at 217 names the item sounding and the articulator values.

### Speak notation (`score.speak`)

ARPAbet as CMUdict writes it, symbols separated by spaces, any case.

| Kind | Symbols |
|---|---|
| vowels | IY beet, IH bit, EH bed, AE cat, AA father, AO thought, UH book, UW boot, AH cut, ER bird, AX about |
| diphthongs | EY say, OW go, AY my, AW cow, OY boy |
| stops, affricates | P B T D K G, CH church, JH judge |
| fricatives | F V, TH thin, DH this, S Z, SH ship, ZH measure, HH hat |
| nasals, liquids, glides | M N NG, L R, W Y |
| marks | a digit after a vowel: 1 stressed, 2 medium (the default), 0 unstressed; `,` a pause that goes on; `.` a pause that falls; `?` a pause that rises; `!` falls hard; `/` or `|` a word break (no sound) |

Intonation is made from the stress digits and the marks: a declining line, a
2.5 semitone accent on stressed vowels, longer stressed vowels, a longer last
vowel in a phrase, and a fall or rise on the last vowel. The line sits at the
pitch the page's pitch slider shows. `HH AH0 L OW1 , / W ER1 L D .` is "hello,
world."

### Sing notation (`score.sing`)

Notes separated by spaces, each `NOTE:BEATS:SYLLABLE`: a pitch name (A to G, `#`
or `b`, the octave; C4 is middle C) or `R` for a rest; the length in beats; the
syllable's sounds joined by dots. `C4:1:T.W.IH.NG G4:2:S.T.AA.R R:1`. The
first vowel is the nucleus and takes the note's length; the consonants before it
start ahead of the beat (borrowing from the previous note's tail), so the vowel
lands on the beat; those after it take the end of the note. Pitch glides
between notes. Tempo is `seq_tempo` and applies to the notes still to come.
`presets.fab` holds four public-domain tunes: Twinkle, Twinkle, Little Star;
Ode to Joy on "la"; Mary Had a Little Lamb; a vowel scale.

### What was checked, and what was not

Checked by measurement, on the rendered WAVs (`tools/render-wav`): that the
phoneme timeline is as compiled (envelope), that stop closures are silent and
bursts and aspiration sit at the right place and about 14 dB under the vowel,
that sibilants have their energy high and /sh/ lower, that the sung pitches
are the written notes (autocorrelation per 125 ms, Twinkle is C C G G A A G F
F E E D D C to within 0.3 semitone) and glide between them, that nasals and
voiced fricatives carry voicing, and that a scan for sample-to-sample jumps
finds them only at bursts and onsets out of silence. Not checked: how it sounds. Nobody has listened to these files as this
was written; the levels (`FRIC_SCALE`, the nasal and liquid loudness, the
aspiration level) were set from measured rms against the vowel, not by ear.
Known weak spots: /r/ has no low F3 (the tract model gets 2.0 kHz where /r/
wants 1.7), the low front vowels EH and AE are close together, and there is no
lateral path for /l/.

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

# Vowels, then every Speak and Sing preset, to WAV (mono, 16-bit, 44.1 kHz).
# Needs norma:fs, so build native:
faber build tools/render-wav -t rust --release -o /tmp/vox-bin
/tmp/vox-bin/vox-render-wav /tmp/vox-wav       # vowel-a.wav .. vowel-u.wav,
                                               # speech-0..7.wav, song-0..3.wav
/tmp/vox-bin/vox-render-wav /tmp/vox-wav "HH AH0 L OW1 ." 0.8   # speech-custom.wav, rate 0.8

# The grid search that fitted the vowels of phones.fab (5 s):
faber run tools/fit-vowels

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
| Realtime factor, native (`rust --release`) | about 97x (108x before the sequencer) |
| Realtime factor, node (ts build) | about 8.5x (9.6x before) |
| Speak and Sing presets, native, 12 files (about 70 s of audio) | 0.75 s in all |
| Realtime factor, `faber run` (JIT in the debug faber) | about 0.74x |

Gaps found while building this are in `../GAPS.md`, with repros in `../gaps/`.
