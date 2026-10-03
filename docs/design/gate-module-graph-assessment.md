# Remaining gate assembly: third-attempt assessment

2026-10-03 · Hand `9f8905b1` · need `78eebf9a`

## Disposition

Stop implementation in this unit. Recommend a shared module-graph assembly
helper, with host bindings kept explicit and separate. This is a recommendation
for the next design/lowering step, not an implemented helper or gate closeout.
No gate assertions, Tela source, or runtime implementation were changed.

The three gates need more than the static recipe copied three times. The five
previously green regression surfaces are also not all green at these pinned
tips, before any edit:

| Repo | Packet tip |
| --- | --- |
| tela | `5f380b1` |
| radix | `32ac8a457` |
| faber | `6572120` |
| norma | `6b070c7` |

## Recipe inspected in Git

`git show fde1e42 -- scripta/check-determinism scripta/check-forms-proof`
shows the first attempt's recipe: preserve the emitted imports; place modules
at their import-specifier paths; wrap intrinsic interfaces in `declare global`;
normalize the valor-tag type probe; append exports from emitted declarations;
provide `@faber/runtime`; compile with strict `tsc`, then run compiled ESM with
Node. The same diff corrects the Rust dependency key to `faber` and records
compile-failure fallback to the TS lane.

`git show 06d91f4` shows that the second attempt changes the three remaining
gates' compiler-build entry points, not their flattened assembly.

Do not copy the first attempt's arithmetic stand-in: the live gates now load
the authoritative sibling `faber/runtime/typescript/exact.ts` instead.

## Three reproductions

Run from this packet's `tela/`, with `/opt/homebrew/bin` first on `PATH`.
All three reach strict TypeScript checking and exit **2**, before and after
this documentation-only assessment. Node interaction assertions do not run.

| Command | Before | After |
| --- | --- | --- |
| `./scripta/check-mount` | 2 | 2 |
| `./scripta/check-reference` | 2 | 2 |
| `./scripta/check-forms-interactive` | 2 | 2 |

The reported TS2393 duplicate-implementation failure does **not** reproduce.
Every gate still strips imports and flattens declarations into const-object
namespaces. The observed errors include TS2503 (missing type namespaces),
TS2304 (`variant` removed with its import), TS2339 (`html_view` absent from the
stale `html_visus` object binding), and TS2307 (missing `@faber/runtime`).
Full raw stdout/stderr and exit-code files from this assessment are in
`/tmp/telagates-evidence/{before,after}-check-*.{log,exit}` on the execution
host; these are temporary evidence, not portable committed test artifacts.

## Why this is not one mechanical migration repeated three times

- `check-mount` binds `tela:dom` directly to the authored fake-DOM functions.
  Its scope/snapshot bindings capture the driver's installed document.
- `check-reference` and `check-forms-interactive` instead exercise the real
  `runtime/dom.ts` implementation against the authored fake DOM. Their
  provider binding must remain the real-runtime route, not the mount shim.
- The static graph in `check-forms-proof` and `check-determinism` uses emitted
  DOM stubs that are inert for their static entry. Reusing those stubs for the
  interaction gates would change what is proved.
- `check-exempla` already demonstrates a module-graph fake-DOM seam, but it is
  not a substitute for the real-runtime route the other two gates promise.
- Three already-migrated regression gates fail before edits. Their package
  stand-ins declare only display/exact; current emit imports valor/variant,
  and emitted DOM additionally imports result. The authoritative sibling
  runtime exports those namespaces.
- There is a separate emitted-symbol mismatch. `src/tela.fab` declares
  `fn order(...)`; `radix emit -t ts --locale en src/tela.fab` emits
  `function order_(...)`. Generated consumers still reference `tela.order`,
  producing TS2551 in `check-exempla` and `check-determinism`. This needs
  compiler/package-owner classification, not an invented harness alias that
  silently hides the discrepancy.

Recommendation: settle that symbol contract first, then lower a bounded shared
assembly helper using the established recipe and the current runtime package
surface. Keep fake-DOM and real-runtime provider modules explicitly distinct.
Give the helper its own check. Migrate the interaction drivers without changing
assertions or substituting one host route for another. Existing module-graph
regression gates must be included in the follow-up's scope explicitly; they
cannot honestly serve as a green baseline today.

## Regression reruns (unchanged code)

| Command | Exit | Observed result |
| --- | --- | --- |
| `./scripta/check-compile` | 0 | Compiler checks pass |
| `./scripta/check-locale-la` | 0 | Includes packet-local Faber product check |
| `./scripta/check-exempla` | 2 | TS2305 valor/variant; TS2551 order/order_ |
| `./scripta/check-forms-proof` | 2 | TS2305 valor/variant |
| `./scripta/check-determinism` | 2 | TS2305 valor/variant/result; TS2551 order/order_ |

The determinism gate attempts Rust, records a Cargo error, then fails in the TS
fallback; it does not establish byte-identical output in this run. Its generated
`build/` captures are not successful determinism evidence.

No helper was added. No broader ladder, stage 3–4 run, or e2e fleet was run.
This assessment does not claim the need, any campaign, or these gates complete.

## Representative raw diagnostics

`./scripta/check-mount` (exit 2):

```text
../../../../../../../var/folders/jb/3dn8vtk172l69k058t0gvctm0000gn/T/tela-u4-mount.GqybVN/mount.ts(82,21): error TS2304: Cannot find name 'variant'.
../../../../../../../var/folders/jb/3dn8vtk172l69k058t0gvctm0000gn/T/tela-u4-mount.GqybVN/mount.ts(765,13): error TS2503: Cannot find namespace 'dom'.
```

`./scripta/check-reference` (exit 2):

```text
../../../../../../../var/folders/jb/3dn8vtk172l69k058t0gvctm0000gn/T/tela-u2-reference.Ln46hn/assembled.ts(82,21): error TS2304: Cannot find name 'variant'.
../../../../../../../var/folders/jb/3dn8vtk172l69k058t0gvctm0000gn/T/tela-u2-reference.Ln46hn/assembled.ts(1006,59): error TS2503: Cannot find namespace 'result'.
```

`./scripta/check-forms-interactive` (exit 2):

```text
../../../../../../../var/folders/jb/3dn8vtk172l69k058t0gvctm0000gn/T/tela-u7-interactive.NvgTuW/interactive.ts(82,21): error TS2304: Cannot find name 'variant'.
../../../../../../../var/folders/jb/3dn8vtk172l69k058t0gvctm0000gn/T/tela-u7-interactive.NvgTuW/interactive.ts(1006,59): error TS2503: Cannot find namespace 'result'.
```
