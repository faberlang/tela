# Web-Surface-Import U6 — Evidence Record (the official post-flip boundary)

**Status**: active (evidence for `web-import-u6-evidence` — the official
web-surface-import evidence boundary)
**Unit spec**: `tela/docs/factory/web-surface-import/DELIVERY.md` U6 (the
final wave — depends on U4 `65b38e6` tela main + U5 `93470cd` faber-web main)
**Read scope consumed**: the U1–U5 emission (tela `a2c8a2c` … `65b38e6`;
faber-web `93470cd`), the seven harnesses + the two ported tests, the
Stage 5 U10 evidence pattern (`stage-5-evidence.md`), GOAL.md stop
conditions, DELIVERY.md §5.2 naming table + §12 residuals.
**Hand**: hand-5. **Date**: 2026-08-11 (in-tree radix 0.81.0).

## Verdict

**GREEN — the full tela surface runs green once post-flip** (the seven
harnesses + the two ported `tela:dom` tests, one official fail-closed run
at this boundary). The final composition double-builds **byte-identical**;
the official sha re-records to
`6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` —
**unchanged from the Stage 5 U9/U10 + WSI-U4 records** (the flip and this
evidence unit author no static-output change; DELIVERY §5.4 point 7 holds
— no supersession; the honest flag). The Rust primary path was
**attempted** and BLOCKED by the recorded CODEGEN001 defect (re-recorded;
`fix:codegen001`); the proven TS-lane composition lane carried the gate
(not weakened). The kernel's import-free Rust emit + scratch `cargo check`
stays red on `topological_order` E0382 (the Stage 5 U1 observation; never
the gate). `git diff --check` clean.

---

## 1. Units landed (U1–U5 — the conversion + flip + deprecation)

| Unit | Commit | Surface |
| --- | --- | --- |
| U1 `web-import-u1-tela-dom-source` | tela `a2c8a2c` | `src/dom.fab` (`tela:dom`, en conversion of faber-web `web:dom`) |
| U2 `web-import-u2-tela-dom-runtime-bindings` | tela `e67681d` | `runtime/dom.ts` + `bindings/ts.toml` + `faber.toml` `[target.ts] bindings` + ported `tests/contract-test.ts` + `tests/dom-runtime-test.ts` |
| U3 `web-import-u3-tela-canvas2d` | tela `9820a33` | `src/canvas2d.fab` + `runtime/canvas2d.ts` + bindings extend (+ later committed canvas2d runtime smoke `f18c496`) |
| U4 `web-import-u4-browser-flip-harness-rewire` | tela `65b38e6` | `browser.fab` import flip `web:dom` → `tela:dom`; harness rewires; canary flip (Q1 default) |
| U5 `web-import-u5-faber-web-deprecation` | faber-web `93470cd` | README deprecation banner + migration table; web-canvas2d goal Status `closed — superseded` |
| **U6 `web-import-u6-evidence`** | **this record** | **EVIDENCE.md + sha re-record + goal Status** |

As-landed sizes (2026-08-11):

| Path | Lines | Role |
| --- | --- | --- |
| `src/dom.fab` | 337 | `tela:dom` en contract (import-free, G4-safe flat) |
| `src/canvas2d.fab` | 243 | `tela:canvas2d` en contract (`import from "tela:dom" private dom`) |
| `src/browser.fab` | 587 | lifecycle; imports `tela:dom` (the flip) |
| `runtime/dom.ts` | 437 | host binding (`webDom*` symbols kept) |
| `runtime/canvas2d.ts` | 224 | host binding (`webCanvas2d*` symbols kept) |
| `bindings/ts.toml` | 315 | route → symbol (`tela:dom.*` / `tela:canvas2d.*`) |
| `tests/contract-test.ts` | 479 | route bijection (57 routes across dom + canvas2d) |
| `tests/dom-runtime-test.ts` | 511 | runtime behavior under node (en `identity` field) |

---

## 2. Naming table as-landed (DELIVERY §5.2 — probed, locked, shipped)

| Identifier | Latin (faber-web) | Locked en (tela) | As-landed |
| --- | --- | --- | --- |
| Snapshot node | `Nodus` | **`DomNode`** | `class DomNode { identity, tag, namespace, local }` in `src/dom.fab`; runtime `WebDomNode` with `identity` |
| Identity field | `identitas` | **`identity`** | `browser.fab` / exempla / harness fake DOM all read `.identity` |
| Value fn | `value` | **`input_value`** | SEM005 en type-keyword collision; route `tela:dom.input_value → webDomValue` |
| Context type | `Canvas2dContext` | **`Canvas2DContext`** | PascalCase concatenation (S5-U0) |
| Stub marker | `nota` | **`print`** | print-body stubs; runtime does the work (C8) |
| Optional marker | `sponte` | **`optional`** | en surface |
| Async annotation | `@ futura` | **`@ future`** | `fetch_text` keeps the `⇥` glyph |
| Annotatio | `@ annotatio` | **kept** | annotation *name*, not a keyword (`web:web` stayed frozen; not folded) |
| Runtime symbols | `webDomX` / `webCanvas2dX` | **kept** | Q4 default; harness + host-binding contract unchanged |
| `web:web` fold | `WebController` / `Mount` | **drop entirely** | Q6; `tela:browser.mount` supersedes `Mount`; `WebController` residual |
| Bindings shim split | — | **two shim paths** | `[shim]` dom + `[shims.canvas2d]` |
| Provider prefix | `web:` | **`tela:`** | route keys re-prefixed; symbols unchanged |
| Canary import | `web:dom` | **`tela:dom`** | Q1 default: flip (U4) |

Advisory `LOCALE002` spellings left as-landed (Q3 — leave; record): `local`,
`width`, `alt`, `shift`, `id`, `status`, `ok`, `require`, `on` (and the
broader keyword-like surface on converted modules). Parse + emit green;
never a gate.

---

## 3. The flip (U4) — cross-repo edge closed on tela's side

| Before | After |
| --- | --- |
| `import from "web:dom" public * ut dom` in `browser.fab` | `import from "tela:dom" public * ut dom` |
| `dom.Nodus` / `.identitas` | `dom.DomNode` / `.identity` |
| Harness emit source `$ROOT/../faber-web/src/dom.fab` (la) | `$ROOT/src/dom.fab` (en) |
| Harness runtime `$ROOT/../faber-web/runtime/dom.ts` | `$ROOT/runtime/dom.ts` |
| Canary `import from "web:dom"` | `import from "tela:dom"` |
| `fix:web-dom-locale` reason for the en→la edge | **permanently retired** (en→en) |

Public browser surface unchanged (C6): `mount` / `replace` / `dispose` /
`focus_held` / `focus_target` + the pure policy fns. The 9 `dom.on*`
WARN014 skips persist, now sourced from `tela:dom` (recorded-not-blocking).

---

## 4. The full-surface run — one official run, fail-closed

The seven harnesses + the two ported tests ran **once** at this boundary
(2026-08-11, in-tree radix **0.81.0**):

```
check-compile:           GREEN — radix check on src/{tela,validate,browser,reference,dom,canvas2d}.fab (container libhome) + the benchmark packages (canary shows the 9 dom.on* WARN014 skips from tela:dom)
check-exempla:           GREEN — every exempla/*.fab (incl. browser DomNode/identity fixtures + reference wiring): radix check + TS lane + node runtime gate
check-mount:             GREEN — the segmented-control interaction gate (scripted sequence; node exit 0)
check-determinism:       GREEN — the final composition double-built twice, byte-identical; tsc --noEmit on the assembled composition green; Rust primary path ATTEMPTED + CODEGEN001 recorded
check-forms-proof:       GREEN — package exempla gate + consumer assembly gate (node exit 0)
check-forms-interactive: GREEN — the real provider seam (tela:dom → bindings → runtime/dom.ts), scripted interaction sequence (node exit 0)
check-reference:         GREEN — layout + typography + panel + badge + metric + table + segmented-control + button + field mount + structure/a11y + field behavior + declared interaction cases (node exit 0)

ported contract-test:    GREEN — tsc --strict --module CommonJS; node — "contract-test: OK — 2 module(s), 57 route(s) verified"
ported dom-runtime-test: GREEN — tsc (test + runtime/dom.ts) --strict --module CommonJS; node exit 0 (assert suite; silent on success)
```

Any failure or non-zero exit FAILS the run (fail-closed). Runner tails,
verbatim:

```
check-compile: green
check-exempla: green
segmented control interaction gate green (scripted sequence; tela-s3-u4)
check-mount: green (segmented-control interaction gate; node exit 0)
check-determinism: green (byte-identical double build; build/ has the evidence)
check-forms-proof: green (package exempla gate + consumer assembly gate; node exit 0)
forms interactive provider-seam gate green (scripted sequence; tela-s4-u7)
check-forms-interactive: green (real provider seam; scripted sequence; node exit 0)
reference catalog mount gate green (layout + typography + panel + badge + metric + table + segmented-control + button + field mount + structure/a11y + field behavior + declared interaction; tela-s5-u2/u3/u4/u5/u6/u7/u8)
check-reference: green (real provider seam; … ; node exit 0)
contract-test: OK — 2 module(s), 57 route(s) verified
```

---

## 5. Determinism — re-recorded at the official WSI boundary

### Hashes (build/hashes.txt — re-recorded by this run)

```text
static-1 sha256: 6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194
static-2 sha256: 6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194
byte-identical: yes
```

The two builds of the **final composition** — tela kernel (valida + tela) +
reference + formslib + extension-lib + canary-app, incl. the emitted
`tela:dom` seam + the `tela:browser` binding — are **byte-identical**
(fail-closed: any diff exits non-zero and fails the gate).

### The supersession chain (honest record)

| Record | sha | Note |
| --- | --- | --- |
| Stage 4 U7 (`stage-4-interactive.md`) | `8dfcb1430e44758df824bc8b68943915caac499dfb7a110d6bf4800dccb50a04` | pre-Stage-5 |
| Stage 5 U9/U10 (official Stage 5) | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | U9 rewire superseded `8dfcb143…`; U10 ratified |
| WSI-U4 flip (`65b38e6`) | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | static output **unchanged** by the flip (DELIVERY §5.4 point 7) |
| **WSI-U6 (official, this record)** | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | composition **unchanged** since Stage 5 U9; U6 authored no product code — evidence record + determinism header + goal Status only. **No supersession.** Sha re-recorded at this boundary; stands as the post-WSI baseline. |

### The Rust primary path — attempted + the defect re-recorded

The Rust lane is the **primary** determinism path and is **attempted first**
by `check-determinism` (no code path skips it). At this boundary it fired
the recorded defect:

```
Rust path: BLOCKED — error[CODEGEN001]:
  proof/benchmark/canary-app/src/main.fab: code generation failed:
  internal: definition id 4117 could not be resolved during code generation
```

Standalone confirmation (same boundary, in-tree radix 0.81.0):

```
$ radix emit -t rust --locale en proof/benchmark/canary-app/src/main.fab
→ error[CODEGEN001]: … definition id 4117 could not be resolved …
→ exit 1 (empty stdout)
```

**`fix:codegen001`** — the recorded radix-lane defect (provider modules
re-analyzed without the en reader locale; the import-bearing Rust emit
fails at codegen). The gate **falls back to the proven TS-lane composition
lane** — it is NOT weakened. **R2 sha-equality note restated**: when
CODEGEN001 lands, the Rust-lane capture must equal the TS-lane capture
(sha equality), and the Rust primary path activates automatically — no
harness change.

**Kernel scratch path (import-free surface)** — also attempted at this
boundary per done_when (c):

```
$ radix emit -t rust --locale en src/tela.fab   # exit 0; ~26kB emitted
$ cargo check --offline (scratch crate /tmp, outside shared workspace)
→ error[E0382]: borrow of moved value: `chosen`
  (topological_order — the Stage 5 U1 refined observation)
```

Never the gate. No shared-workspace cargo suites (operator rule 2026-08-07).

---

## 6. Residuals (routed — none new at this boundary)

1. **The 9 `dom.on*` WARN014 skips** — persist on importers of `tela:dom`
   (`on`, `on_focus`, `on_frame`, `on_input`, `on_keyboard`, `on_pointer`,
   `on_pointer_lock`, `on_resize`, `on_submit`). Live-confirmed on
   `src/browser.fab` + the canary at this boundary. Host-binding read at
   the harness boundary (`fix:g4` host-side). Removal = grep-replace after
   the radix fix lands. Recorded-not-blocking.
2. **`fix:codegen001`** — Rust primary determinism path (provider-module
   locale propagation). Re-recorded §5. Not a WSI blocker (TS lane proven;
   R2 restated). Also the kernel `topological_order` E0382 on the
   import-free scratch compile.
3. **`LOCALE002` advisories** — keyword-like spellings on the converted
   modules (`local`, `width`, `alt`, `shift`, `id`, `status`, `ok`,
   `require`, `on`, …). Left as-landed (Q3). Non-blocking.
4. **Canvas2D Unit 3 deferral** — gradients, `draw_image` / `ImageData`,
   patterns. Carried into `tela:canvas2d` as a deferred residual (Q5);
   file when a real consumer asks. (HTML-in-Canvas / Unit 4 stays PARKED
   on the faber-web record.)
5. **`WebController`** — not folded (Q6). Stays in frozen faber-web for its
   two example consumers (`examples/web-canvas2d-smoke`,
   `examples/canvas2d-interactive`). `Mount`/`mount` superseded by
   `tela:browser.mount`.
6. **Consumer migration** (`web:*` → `tela:*` across faber-web's
   examples/exempla) — Stage 7 territory; faber-web archives only after
   its consumers migrate (a future goal). C1 held: faber-web consumers
   were not rewritten by this goal.

---

## 7. Exact commands (the official run)

From the tela repo root (`/Users/ianzepp/work/faberlang/tela`), with the
in-tree radix binary (`../radix/target/debug/radix`, 0.81.0) and
`PATH` carrying `tsc` + `node` (no npm deps for the ported tests):

```bash
# Seven harness gates (fail-closed; any non-zero exits the gate)
./scripta/check-compile
./scripta/check-exempla
./scripta/check-mount
./scripta/check-determinism      # writes build/{static-1,static-2,hashes}.txt
./scripta/check-forms-proof
./scripta/check-forms-interactive
./scripta/check-reference

# Two ported tests (tela:dom route bijection + runtime behavior)
SCRATCH=$(mktemp -d /tmp/tela-wsi-u6.XXXXXX)
tsc --strict --module CommonJS --esModuleInterop --outDir "$SCRATCH" \
  tests/contract-test.ts
node "$SCRATCH/contract-test.js"
# → contract-test: OK — 2 module(s), 57 route(s) verified

tsc --strict --module CommonJS --esModuleInterop --outDir "$SCRATCH" \
  tests/dom-runtime-test.ts runtime/dom.ts
node "$SCRATCH/tests/dom-runtime-test.js"
# → exit 0 (assert suite; silent on success)

# Rust primary path (attempted; expected BLOCKED — never the gate)
../radix/target/debug/radix emit -t rust --locale en \
  proof/benchmark/canary-app/src/main.fab
# → error[CODEGEN001]: definition id 4117 could not be resolved …

# Hygiene
git diff --check
```

Cargo discipline: no workspace cargo suites; scratch dirs only for the
kernel E0382 probe (`/tmp/…`); the prebuilt in-tree radix binary only.

---

## 8. faber-web freeze (U5 — carried)

faber-web `93470cd` landed the deprecation banner + migration table and
flipped the web-canvas2d goal Status to
`closed — superseded by tela web-surface-import (2026-08-09)`. Source /
runtime / tests in faber-web are **frozen** (critical fixes only until a
future archival goal). Mapping (as on the banner):

| Former (`web:*`) | Replacement (`tela:*`) |
| --- | --- |
| `web:dom` | `tela:dom` (en; `Nodus`→`DomNode`, `identitas`→`identity`, `value`→`input_value`) |
| `web:canvas2d` | `tela:canvas2d` (en; imports `tela:dom`; `Canvas2dContext`→`Canvas2DContext`) |
| `web:web` (`Mount`/`mount`) | `tela:browser.mount` |
| `web:web` (`WebController`) | *(none — not folded; frozen examples)* |

---

## 9. What this boundary does NOT claim

- No real-browser suite (out of scope; harness/node fidelity only).
- No radix ladder stages 4–6 / `--e2e` (auditor-owned).
- No `CAMPAIGN.md` edits (Mind/campaign-owned).
- No faber-web product edits beyond U5's docs.
- No re-flip of U1–U4 product (FORBIDDEN on this unit).
- No claim that the Rust primary path is green (`fix:codegen001` held).
- Interactive state is time-variant — determinism applies to
  **static/mount-time serialization only**; interaction gates are scripted
  deterministic assertion sequences under node, not racy timing tests.

---

## 10. Closeout posture

U6 is the goal's evidence boundary (Rule 6: one official harness closeout —
this run). Goal Status flips to a classifier-parseable completed state on
`GOAL.md` (DONE bucket via `closed` / `completed`). Factory README
regeneration is Mind-owned at goal closeout (DELIVERY §5.4 point 4 /
§8 Goal closeout). Independent auditor re-run of the seven gates + ported
tests is the fire-9 norm for goal acceptance — not this unit's work.
