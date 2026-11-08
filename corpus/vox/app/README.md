# Vox app (Play mode)

A browser app: a vocal tract you can see and play. A midsagittal view with
draggable tongue, lips, jaw and soft palate; the tube (area function), glottal
waveform, spectrum and F1/F2 vowel chart; pitch, breath, pressed, vibrato,
aspiration, mode and body controls; on-screen and computer keys.

The voice is the engine (`../engine`). It runs in an AudioWorklet built from
`src/worklet.fab` (`[product.audio_worklet]`); if the worklet cannot load, the
page creates the same voice on the main thread and tela:audio calls it per
block (status line: "block route").

## Build and run

```text
./build.sh /path/to/faber         # faber build ., then the compiled runtime into dist/runtime
node serve.mjs dist 8790          # http://127.0.0.1:8790/pages/index.html
node serve.mjs dist 8791 --no-worklet    # same, worklet refused: tries the fallback
```

Press Start (or a key) to start the audio, which needs a user gesture. Keep the
volume slider low until you know what it does.

## Dependencies

`faber.lock` locks `tela` (this worktree's root) and `engine` (`../engine`) by
relative path, so the app builds against the tela it lives next to.

`faber build` of this package currently fails for one reason that is not the
app's (gaps/27): the product emits each library module on its own and resolves
`engine:body` and the like only through the library's own `[paths]
library_home`. `../engine/faber.toml` needs `library_home = ".."` under
`[paths]` (one line, the engine lane's file). Until then build a copy of the
engine with that line, e.g. rsync `engine/` to `<tmp>/engine/`, add the line,
and point `faber.lock`'s `engine` rows at the copy.

Gaps found building this are rows 20 to 31 of `../GAPS.md`.
