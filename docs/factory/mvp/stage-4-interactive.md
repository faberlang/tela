# Stage 4 U7 — Interactive Provider-Seam Record (the CTO10-3 interactive claim)

**Status**: active (evidence for `tela-s4-u7-interactive-provider-seam` —
the final Stage 4 unit)
**Unit spec**: `tela/docs/factory/mvp/stage-4-delivery.md` U7 (the CTO10-3
interactive claim — depends on U6, gated)
**Baseline**: U6 `1423666` (the seam restored: `dom.Scope` + snapshot
hydration), cds-u5 `e32397630` (en→la locale propagation), cds-u6
`2103f8a7f` (file-interface exports), the faber-web hydration snapshot op
`0d79f5b` (`web:dom.snapshot` → `webDomSnapshot`), the U4 behavior contract
(`union Nuntius_Formae` / `update_campi` / `annuntium_formae`), the WEB5
host-binding fixture precedent (`examples/browser-app/tests/fake-dom.mjs` +
`web-shim-dom.js` — read-only references)

---

## 1. The gate status (re-verified live, never assumed)

| Condition | Verified at this boundary |
| --- | --- |
| cds-u5 (en→la cross-package locale propagation) landed | radix tip `e32397630`; the en-locale `web:dom` import checks + emits clean at real use (call sites, construction, class-field types, fn signatures, the snapshot route) |
| cds-u6 (file-interface exports) landed | radix tip `2103f8a7f`; the forms `→ tela.Visus` component fns (`campum`/`boxum`/`selego`/`agmen_campi`/`regio_viva_forma`) compose through NORMAL qualified imports — no WARN014 on the tela/forms surface (the only remaining skips are the la provider's own `dom.on*` handler-typed exports) |
| faber-web snapshot op landed | faber-web `0d79f5b` — `web:dom.snapshot` → `webDomSnapshot` (four-artifact bijection re-verified: `src/dom.fab` genus+functio, `bindings/ts.toml` route, `runtime/dom.ts` implementation, `tests/contract-test.ts`) |
| U6 restored the seam | tela tip `1423666` — `tela:browser` consumes `dom.Scope` + `dom.snapshot` (the consumed surface, verified in `src/browser.fab`) |

## 2. The real import chain + the host-binding route crossed

The canary-app (`proof/benchmark/canary-app/src/main.fab`) imports the seam
through the NORMAL package interface:

```fab
import from "tela:browser" public * ut browser
import from "web:dom" public * ut dom
```

The forms components compose through normal qualified imports (`forms.agmen_campi(...)` /
`forms.boxum(...)` / `forms.selego(...)` / `forms.regio_viva_forma(...)` —
the cds-u6 condition exercised: no compose-without, no `*_html` helper
route, no harness-assembly bypass). The seam call goes through the app's
OWN imports (`montium_formae`): `dom.scope(selector)` + `browser.mount(...)`.

The interactive gate (`scripta/check-forms-interactive`) crosses the ACTUAL
host-binding route:

```text
web:dom import (the emitted app/browser code references dom.scope /
  dom.snapshot / …)
  → the generated provider reference (the emitted faber-web web:dom module —
     the bare Scope/Nodus/… type declarations, la emit, included verbatim
     with its preamble + `Element` genus renamed to avoid the tela preamble
     / DOM-lib collisions)
  → the bindings/ts.toml mapping (web:dom.snapshot → webDomSnapshot, … — the
     DOM_NS const binds each Faber fn name to the mapped runtime symbol)
  → the runtime/dom.ts implementation (faber-web's ACTUAL runtime source,
     included verbatim, export keywords stripped — tsc type-checks it against
     the DOM lib; node runs it against the installed fake DOM)
```

The node host environment is a fake DOM modeled on the WEB5 fixture
precedent (`fake-dom.mjs` + `web-shim-dom.js`) — the documented host
binding. **No same-named `webDom*` globals and NO tela-side shim is used
for this claim** (head-cto fire-13): the web:dom surface is faber-web's own
`runtime/dom.ts` implementation, and the driver mounts + subscribes through
the runtime's exported functions.

## 3. The scripted interaction sequence + assertions (node exit 0)

Synchronous-only (the routed async-gap boundary: no `@ futura`, no fetch
claims — `webDomFetchText` is never exercised). The sequence executes under
node, fail-closed (every assertion runs; any failure or non-zero exit FAILS
the gate):

| # | Step | Assertions (all green) |
| --- | --- | --- |
| 1 | **Hydration** — the region is pre-rendered with the SAME composition bytes; `montium_formae("#root")` mounts | mount returns a `Mounted` plan; **seven** binding-plan entries (forma + field group + field + error + checkbox + select + live); **every identity `ligare`** — the pre-existing identity set + tag names read via `dom.snapshot` (the bind-vs-create decision); the field node present from the praesens |
| 2 | **Field input (empty) → invalid transition** | the message → `update_campi` → model invalid; the re-render + `replace`; `aria-invalid` flips `true`; `aria-describedby` wired to `form-error-name`; the error node's text "Required"; the live region announces **once** ("form-field-name invalid: Required") |
| 3 | **Field input (valid) → cleared** | `aria-invalid` flips `false`; `aria-describedby` removed; the error text cleared; the live region announces **once** ("form-field-name valid") |
| 4 | **No-op input (same value)** | the update is a state no-op; the announcement is **silent** (`""` — the no-op rule); no announce count change |
| 5 | **Checkbox toggle** | `update_campi` (the model semantics) + the re-render; the checkbox's `aria-checked` flips `true`; the app model tracks the toggle; announced once |
| 6 | **Select change** | `update_campi` (the model semantics); the model's `valor` updates to "Dark"; the app model tracks the select |
| 7 | **Replace across the region (focus + scroll anchor)** | `focus_tenet(m, "form-field-name")` → `replace` derives `[Restitue{form-field-name}, Ancora{#root}]` (effect keys read via `tela.effectus_identitas`); the host restores focus by identity (the DOM `activeElement` is the field) |
| 8 | **Dispose** | a `web:dom` subscription (the runtime's `webDomOn`) is live before dispose (a click dispatch fires); `dispose` + `webDomUnsubscribe` → a post-dispose dispatch **no-ops** (unsubscribed) |

Runner tail line: `forms interactive provider-seam gate green (scripted
sequence; tela-s4-u7)` — **node exit 0**.

## 4. The full package surface at this boundary (one official run)

```text
./scripta/check-compile             # kernel + valida + the benchmark packages — green
./scripta/check-exempla             # every tela exempla: check + TS lane + node runtime gate — green
./scripta/check-mount               # the segmented-control interaction gate under node — green
./scripta/check-determinism         # the three-package static double-build + byte-compare — green
./scripta/check-forms-proof         # the formslib exempla gate + consumer assembly gate — green
./scripta/check-forms-interactive   # the U7 interactive provider-seam gate — green (this unit)
```

The canary-app's U7 runner output (the new plan-surface print) changes the
determinism double-build input: the sha re-records to
`8dfcb1430e44758df824bc8b68943915caac499dfb7a110d6bf4800dccb50a04`
(superseding `28f63f75…d1d39b`; byte-identical, fail-closed). The Rust
primary path remains BLOCKED on the U6-noted CODEGEN001 manifestation
(`definition id … could not be resolved during code generation` — a further
radix codegen fix is required; recorded, never the gate).

## 5. Overlap rule (held end-to-end)

No Tela/faber-web/faber/radix modification by the proof package. The only
tela `src/` delta since Stage 3 is U6's workaround removal; this unit
touches the benchmark app (`main.fab`), the harness surface
(`check-forms-interactive` new; `check-forms-proof`/`check-determinism`/
`check-mount` wiring propagation for the app's new imports), and this
evidence record. The faber-web snapshot op was routed as a separate host
extension (`0d79f5b`), never a tela-campaign edit.

## 6. Residuals

- The Stage 4 closeout flip (interactive gate → MET) is Mind-owned after
  this unit lands.
- `fix:codegen001` — the Rust-path CODEGEN001 (definition-id resolution)
  remains on the radix lane; the R2 sha-equality re-check happens on the
  first post-fix run.
- `fix:prim-nullable` — the nullable-list method-call workaround (the
  `not is null` narrow) was re-observed at the seam; recorded in
  browser-lifecycle.md §11.
- The la-locale bool keyword `verum` is not usable as a Faber identifier in
  en modules (the TS emitter substitutes the literal `true`) — observed +
  worked around (renamed to `b`); recorded for the radix lane's awareness.
- No CAMPAIGN.md edits; no radix changes; no real-browser driver (deferred —
  the host-binding fixture is the node vehicle).
