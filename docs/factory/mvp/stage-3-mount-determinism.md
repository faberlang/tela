# Stage 3 U4 — Mount + Determinism Record (the package-test surface)

**Status**: active (evidence for `tela-s3-u4-harnesses-interaction-determinism` —
the Stage 3 final unit)
**Unit spec**: `tela/docs/factory/mvp/stage-3-delivery.md` U4 (wave 4;
depends on U1 `4ca331a` + U2 `9f23095` + U3 `27aa181`/`c182688`)
**Baseline**: the U3 segmented-control interaction proof (canary-app
`27aa181` + evidence `c182688`), the U2 dom-shim + driver surface
(`scripta/dom-shim.ts` — `parseFragment`/`executeMountPlan`/
`bindRegionSubscriptions`/`executeMountProof`), the Stage 1/2 harnesses
(`check-exempla`/`check-determinism`) + determinism records
(`stage-1-determinism.md`, `stage-2-determinism.md` R2 note)

---

## 1. What U4 delivers

1. **`check-exempla` extended** — the `behavior` (U1 carriers) + `browser`
   (U2 mount surface) wiring cases added; the `*)` default now has NO
   unknown cases. Every exempla runs `radix check` + TS emit + assemble +
   `tsc --noEmit` + **node** (the Stage 2 U5 runtime gate — assertions
   execute). The `browser` case binds the **dom-shim namespace** (export
   keywords removed) + the U2 mount-proof driver, so the assembled browser
   exempla executes the full mount proof under `node` (empty mount /
   hydration binds matching nodes / mismatch diagnose+replace / duplicate
   collapse / replace effects / dispose) — the harness-assembly path
   (`fix:g4` — the WARN014 export-skip does not apply at runtime).
2. **`check-mount` (new)** — assembles the interactive composition (kernel
   + browser module + dom-shim + extension + app) and executes the
   segmented-control **scripted interaction sequence** under `node`,
   fail-closed (any assertion failure or non-zero exit FAILS the gate).
3. **`check-determinism` extended** — the double-build input is now the
   Stage 3 static/mount-time serialization (the composition HTML + both
   theme cascades + the segmented control's initial HTML + the app-owned
   control cascade rule); byte-compared + sha256, fail-closed; the Rust
   primary path stays attempted + CODEGEN001 recorded; the R2 note
   restated.
4. **This evidence record**.

## 2. The determinism evidence (one closeout run)

Command (exactly once at the closeout, 2026-08-09, in-tree radix 0.80.0):

```text
./scripta/check-compile         # kernel + valida + both benchmark packages — green
./scripta/check-exempla         # every exempla: check + TS lane + node runtime gate — green
./scripta/check-mount           # the scripted interaction gate under node — green
./scripta/check-determinism     # Stage 3 static double-build + byte-compare — green
```

**All four runs green at the U4 closeout.**

### Hashes (build/hashes.txt)

```text
static-1 sha256: 775169163d3edbe1b538a38c4caa2fa16338b0f6bf1f131374a9330a737e5490
static-2 sha256: 775169163d3edbe1b538a38c4caa2fa16338b0f6bf1f131374a9330a737e5490
byte-identical: yes
```

The two builds of the Stage 3 static composition are **byte-identical**
(fail-closed: any diff exits non-zero and fails the check). This sha
**supersedes** both the Stage 2 record (`3d22b9c7…8340a`) and the U3
informational sha (`d23a62bb…c74c` — U3 §7 recorded it as informational
pending U4's official record). Evidence files under `build/` (gitignored):
`static-1.txt`, `static-2.txt`, `hashes.txt`.

### Output description

The runner output (6 lines) is the double-build input:

```text
<div aria-label='metric panel' data-tela='canary-panelum'><dl>…</dl><div role='meter' …>…</div><div role='radiogroup' aria-label='segmented control' data-tela='tela-control'><button role='radio' aria-selected='true' tabindex='0' data-tela='tela-seg-1'>One</button>…<div role='status' aria-live='polite' data-tela='tela-live'></div></div></div>
:root { --surface-canvas: #ffffff; … --chart-axis-muted: #6b7280; --chart-grid-muted: #e5e7eb; }\n[data-tela='tela-chart-bar'] { … }\n[data-tela='canary-panelum'] { … }\n[data-tela='tela-control'] { display: flex; gap: 0.25rem; border-radius: 0.375rem; }\n
:root { --surface-canvas: #0f172a; … --chart-axis-muted: #9ca3af; --chart-grid-muted: #1f2937; }\n… \n
two-theme static rendered (lumen vs tenebrae; tela-s2-u3)
<div role='radiogroup' aria-label='segmented control' data-tela='tela-control'><button role='radio' aria-selected='true' tabindex='0' data-tela='tela-seg-1'>One</button><button role='radio' aria-selected='false' tabindex='-1' data-tela='tela-seg-2'>Two</button><button role='radio' aria-selected='false' tabindex='-1' data-tela='tela-seg-3'>Three</button><div role='status' aria-live='polite' data-tela='tela-live'></div></div>
segmented control static rendered (initial selection tela-seg-1; tela-s3-u3)
```

1. The theme-independent composition HTML — now **including the segmented
   control** (the Stage 3 shared-source static half).
2. The `lumen` (light) full cascade: `:root` token layer + extensionlib +
   canary-app rules + the app-owned `[data-tela='tela-control']` rule.
3. The `tenebrae` (dark) full cascade — materially different token layer,
   identical component/library/application bundles.
4. The Stage 2 runner status line.
5. The segmented-control **initial static render** (role=radiogroup /
   role=radio / aria-selected / the roving tabindex / the declared live
   region) — deterministic bytes over author order.
6. The Stage 3 runner status line.

Note: the CSS bytes carry a literal `\n` between rules — the pre-existing
TS-emitter backslash double-escape observation (`fix:ts-emitter`); the
bytes are deterministic (identical on every build) and CSS-parseable;
recorded, not fought.

## 3. Determinism posture (recorded, not claimed)

- Determinism applies to **static/mount-time serialization only** — the
  composition HTML + the full cascade + the segmented control's initial
  HTML (the double-build above). **Interactive state is time-variant** —
  recorded, not claimed: the interaction sequence is a scripted
  deterministic assertion sequence under `check-mount`, not a racy timing
  test.
- The Stage 3 campaign gate's interactive half (selected state / ARIA /
  live region / subscription disposal / focus-restoration + scroll-anchor)
  is evidenced by the scripted sequence, not by determinism.

## 4. The interaction-gate evidence (check-mount)

`check-mount` assembles the interactive composition (valida + tela +
browser + dom-shim + extension + canary-app) into ONE self-contained file
and runs the scripted sequence under `node` — **node exit 0**, every
assertion executed, fail-closed. The scripted sequence (U3 evidence §5):

| # | Step | Assertions (all green) |
| --- | --- | --- |
| 1 | Pointer click on the unselected seg-2 | model → `tela-seg-2`; seg-2 `aria-selected` flips `true`; seg-1 flips `false`; announcement fires **once**; live region reads "Two selected"; one click reached the binding |
| 2 | Click on the already-selected seg-2 | **silent no-op**: model unchanged; no announcement; live region unchanged |
| 3 | Arrow keys | `ArrowRight` from seg-2 → focus moves to seg-3 (DOM focus asserted); selection unchanged; silent. `ArrowLeft` from seg-1 **wraps** to the last segment |
| 4 | Space on the focused seg-3 | model → `tela-seg-3`; seg-3 `aria-selected` `true`, seg-2 `false`; announcement fires; live region "Three selected" |
| 5 | Home / End | focus moves to first / last; selection unchanged; silent |
| 6 | Enter on the focused seg-1 | model → `tela-seg-1`; announcement fires; live region "One selected" |
| 7 | Replace across the region | `focus_tenet(m, "tela-seg-2")` → `replace` derives `[Restitue{seg-2}, Ancora{#root}]`; after replacement focus is restored to seg-2 **by identity**; the scroll-anchor intent is declared for `#root` |
| 7b | Declared focus movement (Dirige) | `focus_optata(…, "tela-seg-3")` → `replace` derives `[Restitue{seg-2}, Dirige{seg-3}, Ancora{#root}]`; focus lands on the declared target |
| 8 | Dispose | subscriptions live before dispose (a click fires); `dispose` + unsubscribe + region clear → a **post-dispose dispatch does nothing**; the region is cleared |

Runner tail line: `segmented control interaction gate green (scripted
sequence; tela-s3-u4)` — **node exit 0**.

The gate is **synchronous only**: no `@ futura`, no `dom.fetch_text`, no
async event sources, no fetch-driven/async update claim (the routed
async-gap boundary, stage-3-segmented-control.md §6).

## 5. Lanes

- **Rust primary path: ATTEMPTED + BLOCKED (CODEGEN001, `fix:codegen001`)**.
  `radix emit -t rust` of the import-bearing canary-app fails the
  provider-module locale-propagation defect (`provider module tela failed
  analysis: PARSE030/PARSE001 …`). Recorded; the gate is NOT weakened to
  pass; the TS lane is the proven runtime lane.
- **TS lane (the proven lane)**: emit valida/tela/extension/canary,
  double-emit the kernel (byte-identical), assemble into one self-contained
  module, run twice under `node`, byte-compare, `tsc --noEmit` — all green.
- **R2 note (Rust-lane sha-equality, restated — `stage-2-determinism.md`
  §3)**: when the provider-module locale-propagation fix lands,
  check-determinism's Rust primary path activates automatically (no
  harness change) and the Rust-lane capture MUST equal the TS-lane capture
  (`77516916…e5490`) — sha equality (stage-1-determinism.md §6 pattern).
  The Stage 3 closeout re-checks this on the first post-fix run.

## 6. Harness mechanics

- `check-exempla`: `radix check` every `exempla/*.fab`; TS emit valida +
  tela + browser + each exempla (exempla emits use a name-suffixed scratch
  file so `exempla/browser.fab` does not clobber the `src/browser.fab`
  module emit); assemble per the wiring case (validation/serializer/thema/
  assemble/behavior/browser); `tsc --noEmit`; **then `node` (runtime gate —
  assertions execute)**. The `browser` case appends the dom-shim (export
  keywords removed) + the mount-proof driver (the U2 `executeMountProof`
  with the assembled exempla's scenario inputs). The `*)` default has NO
  unknown cases.
- `check-mount`: benchmark `radix check` under the benchmark libhome; emit
  + assemble the interactive composition + the dom-shim + the interaction
  driver; `tsc --noEmit`; `node` — the scripted gate, fail-closed.
- `check-determinism`: Rust primary path attempted (CODEGEN001 recorded) →
  TS-lane fallback: emit + double-emit kernel (byte-identity) + assemble +
  run twice + `cmp` fail-closed + sha256 → `build/hashes.txt`; `tsc
  --noEmit` on the assembled composition.
- `build/` is gitignored (Stage 1 U6); no `.gitignore` change needed.

## 7. Cargo discipline

All cargo runs in scratch dirs outside the shared workspace (the Rust-path
crate is a `mktemp` scratch); no workspace suites; the harnesses ran
exactly once at the closeout (one fix iteration on `check-mount`'s driver
typing during development, then the single green closeout runs).

## 8. Escalation-path re-checks (this unit touched them)

| Defect | Marker | Stage 3 U4 status |
| --- | --- | --- |
| CODEGEN001 — Rust emit-across-imports | `fix:codegen001` | **Re-confirmed** (this unit's Rust-path attempt: provider-module analysis failure) |
| G4 — WARN014 export-skip on mount/replace | `fix:g4` | The harnesses consume the emitted fns directly at runtime (the harness-assembly path); the G4-safe policy fns stay on the exported interface for the check-time exempla |
| web:dom locale/dialect gap (en→la) | `fix:web-dom-locale` | The `webDom*` surface binds at the dom-shim level in every harness assembly (export keywords removed); no `web:dom` copy in tela |
| prim-nullable (NEW parser observation) | `fix:prim-nullable` | Re-observed at the exempla/plan level; the call-null-check + coalesce workaround holds |
| TS-emitter — backslash double-escape | `fix:ts-emitter` | Re-observed (literal `\n` in the CSS bytes; deterministic) |

## 9. Residuals

- Stage 3 closeout inputs (Mind-routed): the CAMPAIGN.md Stage 3 stage-line
  status + acceptance flip + factory README regeneration (decision D3,
  closeout-owned — no unit edits); the step-6 review (consequences +
  correctness + independent audit — the auditor re-runs `check-mount` +
  `check-determinism` as named test owners).
- The U3 conformance notes (stage-3-segmented-control.md §8) are closeout
  inputs: `dispose → void`, the `Scope` seam carrier, `Mounted` field
  spellings, the `fix:sem001`/`fix:prim-nullable` inventory additions, and
  the determinism supersession (this record).
- `fix:web-dom-locale` / `fix:g4` / `fix:prim-nullable` / CODEGEN001 /
  G5 / TS-emitter / snapshot-nomen-collision fixes stay on the radix lane.
- No CAMPAIGN.md edits by this unit; no radix-lane fixes; no writes to
  `tela/spike/`.
