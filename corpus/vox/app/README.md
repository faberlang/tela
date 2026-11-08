# Vox app (Play, Speak, Sing)

A browser app: a vocal tract you can see, play, make speak and make sing. A
midsagittal view with draggable tongue, lips, jaw and soft palate; the tube
(area function), glottal waveform, spectrum and F1/F2 vowel chart; pitch,
breath, pressed, vibrato, aspiration, mode and body controls. The header
switches the strip along the bottom between three activities, and the views
and controls run in all of them:

| Activity | Bottom strip | What it does |
|---|---|---|
| Play | on-screen and computer keys, octave, sustain | keys set pitch and breath; drag the handles to shape the tract |
| Speak | phoneme text, preset phrases, rate, notation help | the text is spoken with coarticulation: stops with closure and burst, fricatives, nasals, voiced and voiceless |
| Sing | score text, preset tunes, register, tempo, notation help | notes with a syllable each, legato pitch glides, vibrato from the voice controls |

The voice is the engine (`../engine`). It runs in an AudioWorklet built from
`src/worklet.fab` (`[product.audio_worklet]`); if the worklet cannot load, the
page creates the same voice on the main thread and tela:audio calls it per
block (status line: "block route").

Speak and Sing time nothing on the page. The page turns the text into one
program of numeric messages (`../engine/src/score.fab`), sends it to the voice
in order, and the engine's sequencer plays it on the audio clock
(`../engine/src/sequencer.fab`; `../engine/README.md` has the notations and the
reason). The page then follows the telemetry: which item sounds, where the
articulators are, so the handles and the jaw line move with the sound.

## Build and run

```text
faber build .                     # the product: pages, modules, worklet; dist/
node serve.mjs dist 8790          # http://127.0.0.1:8790/pages/index.html
node serve.mjs dist 8791 --no-worklet    # same, worklet refused: tries the fallback
```

Press Start (or a key, or Speak or Sing) to start the audio, which needs a user
gesture. Keep the volume slider low until you know what it does.

## Source (`src/`)

| Module | Role |
|---|---|
| `main.fab` | the controller: one `App`, every handler, the frame loop |
| `state.fab` | `App`: everything the page remembers; `Surfaces` |
| `layout.fab` | where each panel sits for a window size and activity |
| `ui.fab` | placement, the frame loop, controls, keys, the anatomy pointer, the activity switch |
| `speech.fab` | the Speak and Sing panels: presets, sending a program, following the sequence |
| `synth.fab` | the audio graph, the worklet and block routes, `post` of one message |
| `telemetry.fab` | reading the voice's snapshot, the sequencer block, a preview before the audio runs |
| `anatomy.fab`, `geometry.fab`, `views.fab`, `ink.fab`, `style.fab` | the drawings |
| `notes.fab` | key and pitch tables |

## Dependencies

`faber.lock` locks `tela` (this worktree's root) and `engine` (`../engine`) by
relative path, so the app builds against the tela it lives next to.

Gaps found building this are rows 20 to 35 of `../GAPS.md`.
