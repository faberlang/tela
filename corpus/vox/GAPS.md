# Vox gaps

Findings from building the engine (item 1 of SCOPE.md). One row per gap: what
broke, the smallest repro under `gaps/`, who owns it. Source spots that work
around a gap carry `# gap NN`.

Measured 2026-11-08 with `faber 1.18.1` (`radix/target/debug/faber`, built
08:20; radix checkout HEAD `a17f12068a`), macOS on Apple M5 Max, node v24.22.1,
cargo/rustc 1.99.1, go 1.27.3, tsc 6.0.3. Every row was reproduced against that
binary; the repro file header has the exact commands and output. Repos named in
the last column: `radix` is the compiler and product repo (including its Norma
standard library and runtimes).

| # | Symptom (exact text where there is one) | Repro | Owner |
|---|---|---|---|
| 01 | `faber check` SEM020 names a binding that does not exist: ``message: `step` changes `value` in place, but `value` is an immutable binding`` (the binding is `t`). | `gaps/01-sem020-receiver-name.fab` | radix, diagnostics |
| 02 | `faber build <lib> -t ts` exits 1: `error: package has no entry unit for TypeScript assembly`, although the manifest says `kind = "lib"`, `targets = ["rust", "ts"]`. `-t rust` builds the `.rlib`. A library cannot be built for ts on its own; here the engine is built for ts through a bin package that imports it. | `gaps/02-lib-ts-build/` | radix, build |
| 03 | Rust target: a method that only calls a mutating method on one of its fields is emitted as `pub fn go(&self, ..)` and rustc fails: ``error[E0596]: cannot borrow `self.cell` as mutable, as it is behind a `&` reference``. (The checker itself knows `go` mutates: on a `let` receiver it is SEM020.) Worked around in `engine/src/voice.fab` (`Voice.message` counts messages so it has a store of its own). | `gaps/03-field-delegate-mut.fab` | radix, rust backend |
| 03b | Across modules a class loses its method mutability. For a class imported from another module, calling a mutating method on a `let` binding is accepted (in one file it is SEM020, "declare `value` with `mut`"), and the `mut` binding that is needed draws `WARN013 unnecessary_varia` ("unnecessary mut: binding is never reassigned"), so no spelling is clean. Every `mut eng.Engine e` and `mut voice.Voice v` in the tools draws it; they keep `mut` (rust needs it) and carry `# gap 03`. | `gaps/03b-imported-class-mut/` | radix, analysis (file interface) |
| 04 | `norma:math` does not link on ts: `faber run -t ts` gives ``src/..ts(7,31): error TS2552: Cannot find name 'math'. Did you mean 'Math'?`` (`math.sin(..)` is emitted and `math` is never defined). The runner prints the right answer. Worked around everywhere with the built-in float methods (`x.sin()`, `.cos()`, `.exp()`, `.sqrt()`, `.power()`), which run on the runner, JIT, rust and ts. | `gaps/04-norma-math-ts.fab` | radix, Norma + ts backend |
| 05 | The clock and process leaves are not available on ts: ``error: the clock leaf is not supported on the ts target (route `tempus:nunc`)`` and the same for `norma:process` argv (route `processus:genera`). The route names are Latin in an en program. `tools/bench-realtime` has no clock and no arguments; `bench.sh` times every target from outside. | `gaps/05-time-ts.fab` | radix, Norma + ts backend |
| 06 | No way to keep state between calls of free functions. 06a: `mut int g ← 0` at module level is `SEM062 top_level_binding` ("top-level `g`: module-level mutable state does not exist"). 06b: a `const` class instance with `mut` fields checks with no warning but keeps its state on one target only (runner, JIT and `--device reference` print `1 1`; ts prints `1 2`). So the SCOPE.md worklet contract (free functions `process`, `message`, `telemetry`) cannot be written. `engine/src/voice.fab` exposes the same three operations as methods of a `Voice` the host creates and holds. **The contract needs an amendment.** | `gaps/06a-module-state-toplevel.fab`, `gaps/06b-module-state-const-instance.fab` | language decision (radix); 06b is also a bug |
| 07 | en diagnostics contain Latin: ``warning[WARN028]: `@ publica` on a member is redundant`` (en spells `@ public`); ``error[SEM011]: failable conversion from f64 to numerus requires a '⊥' default, a ⇥ declaring context, a local handler, or a trap trap`` (en spells `int`; "trap trap" is doubled). | `gaps/07-diagnostic-locale-leak.fab` | radix, diagnostics |
| 08 | Rust target: `for from` over a local alias of a nested list field. The alias is emitted as a borrow and the loop borrows again, ``error[E0277]: `&&Vec<f64>` is not an iterator`` at `for i0 in &(l_area)`. Worked around in `Engine.telemetry` by iterating the field expression. | `gaps/08-rust-for-alias.fab` | radix, rust backend |
| 09 | Rust target: `for from ["a", "b"] let name` then `f(name)` with `f(string s)`: ``error[E0308]: mismatched types ... expected `String`, found `&str```. Worked around in `tools/render-wav` by binding the list to a typed name first. | `gaps/09-rust-for-string-list.fab` | radix, rust backend |
| 10 | **llvm-host miscompile**: a mutation made through a nested object's method is lost. `h.go(1.0); h.go(1.0); print h.cell.v` prints `1.0 1.0 0.0` on llvm-host and `1.0 2.0 2.0` on runner, JIT, ts and go. No diagnostic, exit 0. The engine has this shape (Engine holds Tract), so it cannot run on llvm-host. | `gaps/10-llvm-host-nested-mutation.fab` | radix, llvm-host |
| 11 | A package that imports a library provider through `library_home` runs on the runner, JIT, ts and rust only. go: ``main.go:7:8: invalid import path: mini:mini``. llvm-host: ``llvm_runtime_symbol_unavailable: no ABI row for `__faber_runtime_provider_2_3_6_1_i64_to_i64` ``. c: ``error[PKG001:package_c_export_home_missing]`` (no message, no span). All three run a hello-world. | `gaps/11-provider-import-targets/` | radix, go / llvm-host / c backends |
| 12 | Any call to a norma provider function takes the whole program off the JIT: ``info[ENGINE001]: running on the MIR interpreter (slow): clif-jit declined: provider call package:norma:fs::fs::write_bytes``. `norma:math::sin` and `norma:time::monotonic` decline the same way. A tool that renders and then writes a file runs on the interpreter under `faber run` (about 5 s for 5 s of audio) and is built for rust for speed. | `gaps/12-jit-declines-norma-calls.fab` | radix, clif-jit |
| 13 | A class field default that names a module constant is rejected with no code, no span and no field name: ``error[uncoded] ... public export `Counter` ... cannot be represented in a file interface: FieldDefaultUnsupported``. A literal default works (`engine.fab`, `tick = 32`). | `gaps/13-field-default-const.fab` | radix, analysis |
| 14 | A runtime index trap has no location: ``error: array index out of bounds`` (exit 70; on ts a bare JS stack with no Faber function or line). It cost a bisection to find a table read before it was built. | `gaps/14-index-trap-no-location.fab` | radix, runner + runtimes |
| 15 | `print (a) and (b)` is parsed as a call to `print`: ``SEM001 scribe_callee: unknown identifier ... `print` is the output statement, not a function``. `print (x ÷ 3.0).truncate()` fails the same way. | `gaps/15-print-paren.fab` | radix, parser |
| 16 | One library module imported under different aliases by two modules is an error: ``error[PKG001:library_conflicting_aliases]`` with `span: 0..25` in the library file and no message (`faber run`: ``library module `mini` is imported under conflicting aliases `mini` and `m` ``). An alias should be local to its module. Worked around by using one alias per module package-wide. | `gaps/16-conflicting-aliases/` | radix, module resolution |
| 17 | The ts target emits slow shapes for the hot loop: a BigInt induction variable converted by `Number()` each iteration (`const s1 = 0n; ... n1 += d1`), a fresh closure per list read (`((__o, __i) => { if (!(__i in __o)) throw ...})(this.l, exact.add(l_i, 1))`), and an `exact.add`/`exact.sub` call for every integer `+`/`-`. `Tract.step` is 74% of node time; the engine runs 9.6x realtime on node against 108x on rust. The 44-section ladder microbenchmark (2,000,000 steps) is 1.57 s on node, 0.056 s on rust --release. | `gaps/17-ts-emission-shape.fab` | radix, ts backend |
| 18 | `faber format` refuses a library module that imports a sibling of its own package: ``error[PKG001:unknown_library_module] ... span: <none>`` then `0 of 1 files would be reformatted, 1 header-formatted (program refused)`. (`check` resolves the same import.) Engine modules with sibling imports were put into the formatter's style (Stroustrup braces) by hand. | `gaps/18-format-sibling-import/` | radix, format |
| 19 | Not found by the engine, found on the way: tela's own `src/web.fab` does not parse with this compiler, so `faber check` and `faber build` of the tela package exit 65. ``error[PARSE018:wrong_locale_annotation] ... @ annotatio { target = fn }  message: annotation `@ annotatio` is not declared on this reader surface  help: use `@ annotation` for this file's reader locale``, plus 16 x ``PARSE060:invalid_comment_placement`` ("comment is not in a legal attachment position [locale pack missing row: PARSE060.invalid_comment_placement]") for the file's header comments, and PARSE001/PARSE010/PARSE011/PARSE030 as a result. Same at `corpus/vox`'s worktree root (`faber check .` in `worktrees/vox-app`). The `corpus/vox` packages are unaffected (their own manifests). | `faber check .` in `tela/` | tela (`src/web.fab`) |

## Measurements that are not gaps

Taken 2026-11-08 on AC power (`pmset`: "Now drawing from 'AC Power'"), best of 3,
whole process. Audio is 20 s at 44.1 kHz in 128-frame blocks with a telemetry
snapshot every 1024 frames (`tools/bench-realtime/bench.sh`).

| Route | Wall time for 20 s of audio | Realtime factor |
|---|---|---|
| `faber build -t rust --release`, native binary | 0.185 s | 108x |
| `faber build -t ts`, `node` | 2.077 s | 9.6x |
| `faber run` (clif-jit in the debug-built `faber`), 3 s of audio | 4.07 s | 0.74x |

The checksums agree to 12 digits between native and node
(`57635.39102453685` and `57635.39102453672`), so the engine renders the same
audio on both. The JIT figure is for a debug-built `faber` binary, whose runtime
helpers are unoptimised; it says little about a release `faber`.
