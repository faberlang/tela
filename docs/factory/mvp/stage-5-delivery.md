# Stage 5 — Reference Primitives And Forms — Delivery Spec

**Status**: planned (delivery lowering complete; goal-check READY)
**Planner**: planner-2
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` — Stage 5 "Reference
Primitives And Forms" (lines 349–358), the batching table (reference
primitives = `batch-by-default`; "Forms and composite widgets require
behavior/a11y gates beyond static primitives", lines 160–162), the
dependency rules (lines 689–714), the accessibility contract §8 (lines
638–654), the component contract §3 (lines 513–527), the no-raw-markup
posture §3 (lines 486–499), the reference catalog wait condition (line 185:
"Defer catalog expansion until protocol gates and the Stage 4 independent
extension proof close"), and the dogfooding posture (lines 112–121: minimize
TS/JS; harness/tooling that "does things" should be Faber scripts; the
conversion folds into the Stage 5 lowering as a named unit; the
faberlang.dev generator is the complexity reference).
**Authoritative brief**: Vivi task 067785ba (planner-2; Stage 5 lowering +
the DOGFOODING unit).
**Control-plane repo**: `/Users/ianzepp/work/faberlang/tela` (Stage 5 cwd)
**Baseline carried from Stage 4**: Stage 4 accepted (interactive gate U6/U7
MET 2026-08-09, verdict mail f9b616c0; commits tela `b6050ea` + `1423666`,
faber-web `c48f152` + `0d79f5b`, radix `e32397630` + `2103f8a7f`); the
landed seam — `tela:browser` consuming `dom.Scope` + `dom.snapshot` through
the NORMAL package interface (real en→la `web:dom` import); the formslib
proof package (field/checkbox/select + error/live-region) consumable through
normal qualified imports (the cds-u6 `fix:g4` predicate landed — union-
returning exports resolve; the only remaining WARN014 skips are the la
provider's own `dom.on*` handler-typed exports); the six-harness package
surface (`check-compile` / `check-exempla` / `check-mount` /
`check-determinism` / `check-forms-proof` / `check-forms-interactive`); the
determinism sha `8dfcb1430e44758df824bc8b68943915caac499dfb7a110d6bf4800dccb50a04`
(`build/hashes.txt`, re-recorded by Stage 4 U7); the dogfooding posture
committed (tela `f7c8647` + `af9d5ff`).
**Mode**: planning artifacts only. This spec lowers the stage; it does not
implement.
**Closeout owner**: the tela `CAMPAIGN.md` Stage 5 stage-line status update
+ the leading-clause evolution + the acceptance flip are owned by the
**Mind-routed Stage 5 closeout** (workflow step 6), not by any unit in this
spec — decision D3, carried from Stages 1/2/3/4. The factory README
regeneration at doc-creation time is done by the planning commit (Mind's
commit; this planner does not commit); the closeout regenerates again for
the evidence records.

---

## Planning Stages (the lowering sequence this artifact completed)

1. **goal-forge** — the Stage 5 campaign section (lines 349–358) + the
   governing invariant + §3/§8 + dependency rule 1 + the batching table +
   the dogfooding posture (lines 112–121) + the task brief 067785ba were
   forged into a coherent stage scope: nine reference families, static AND
   browser proofs, accessibility checks, forms split on the behavior/a11y
   boundary, the DOGFOODING unit as a named graph node.
2. **goal-check** — the forged scope was checked for READY-ness (§Goal-Check
   below): gate specificity, grounding in the landed Stage 4 surface, the
   architectural decisions (catalog home, proof shape, dogfooding split),
   boundedness (no gated units, no radix-lane blockers, synchronous-only),
   and testability (every unit names its check + lanes + node runtime
   gate). Verdict: **READY**.
3. **Delivery lowering** — this spec: the implementation DAG, per-unit
   done_when + evidence gates, checkpoints, the tela/faber-web ownership
   split, the Stage-4 residuals as work-around/escalation notes, and the
   DOGFOODING unit placement.

---

## Phase Intent

Turn the Stage 5 campaign gate into discrete, one-Hand-per-unit implementable
units. Stage 5 ships Tela's **reference component catalog**: layout,
typography, panel, table, button, field, segmented-control, badge, and
metric families — ordinary Faber component functions over typed props
producing `tela.Visus` (campaign §3: no compiler-known component kinds), each
working in **static AND browser proofs with accessibility checks** (the gate,
verbatim). The Stage 4 extension proof (formslib) proved the public seam; the
catalog now occupies it: Tela's own reference library, authored in the tela
package, consumed by the benchmark app through the normal package interface,
with the Stage 3/4 interactive seam (real `web:dom` + `tela:browser`) as the
browser-proof vehicle. In parallel with the catalog work, the **DOGFOODING
unit** converts the harness fake DOM (`scripta/dom-shim.ts` + the embedded
copy in `check-forms-interactive`) to Faber source via the provider-module
emit pattern (authored `.fab` → emitted TS), keeping all six harness gates
green; the assertion/orchestration drivers ride the hardening executed lane
(not in Stage 5 scope).

What Stage 5 is **not**: no Speculum migration (Stage 7); no charts/
visualization (Stage 6); no publication/release (Stage 8); no real-browser
driver (the node host-binding fixture remains the vehicle — the campaign
residual); no radix-lane defect fixes (the carried residuals apply recorded
workarounds; removal = grep-replace after each fix lands); no new
faber-web host surface except through the documented seam (a genuine host gap
is routed as a separate faber-web extension, never a tela-campaign edit); no
new TS-first harness authoring (the posture's point).

---

## Interpreted Scope

Per the Stage 5 gate, the campaign §3/§8, the batching table, and the task
brief, Stage 5 must deliver:

1. **The nine reference families** in the tela package — layout,
   typography, panel, table, button, field, segmented-control, badge, metric
   — as ordinary component functions over typed props → `tela.Visus` with
   stable `data-tela` identities and documented event/identity/a11y
   contracts (campaign §3, §8). Field and segmented-control already have
   proven predecessors (formslib field/checkbox/select, the Stage 3
   segmented control); the catalog re-homes them as tela-owned reference
   components.
2. **Static proofs** — byte-exact static HTML/CSS + accessibility-structure
   assertions (roles, names, states) per family, in the exempla surface,
   executed under `node` (the check-exempla runtime gate).
3. **Browser proofs** — each family mounts through `tela:browser` against the
   documented faber-web host binding (the Stage 4 interactive-seam vehicle),
   with structure/a11y assertions and, for the behavior families (table,
   segmented-control, button, field), scripted interaction sequences.
4. **Accessibility checks** — the campaign §8 contract: accessible names,
   keyboard operation per role, visible focus + deterministic focus
   restoration, semantic state, live-region policy, table headers, and
   reduced-motion/high-contrast theme behavior (no color-only
   communication). Static structure AND browser behavior are both required.
5. **The DOGFOODING unit** (named input, MUST be in the delivery) — the
   harness fake DOM converted to Faber source (`scripta/dom-shim.ts` +
   the embedded fake DOM in `check-forms-interactive` → authored `.fab`
   emitting to TS via the provider-module pattern already proven by
   `faber-web/src/dom.fab` → emitted TS); all six harness gates stay green
   through the conversion; harness assertion/orchestration rides the
   hardening executed lane and does NOT block Stage 5 units.
6. **Tests + determinism** — the full tela package surface green once at the
   evidence boundary; the three-package (+ reference module) composition
   double-builds byte-identical; the determinism sha re-records.

Explicitly NOT in scope: `faber-web/runtime/dom.ts` (browser host = TS by
contract), the emitted TS output (generated), real-browser layout/scroll/
pointer fidelity, the executed-orchestration hardening lane, and any
compiler/Radix edit.

---

## Goal-Check

- **Artifact reviewed**: `tela/docs/factory/mvp/CAMPAIGN.md` § "Stage 5 —
  Reference Primitives And Forms" (lines 349–358) + the batching table
  (lines 160–162) + the accessibility contract §8 (lines 638–654) + the
  component contract §3 + dependency rule 1 (lines 689–694) + the governing
  invariant + the dogfooding posture (lines 112–121), checked against the
  landed Stage 4 surface (the real seam, the G4-fixed consumability, the
  six-harness surface, the determinism record) and the task brief 067785ba.
- **Evaluator mode**: self-contained cold pass (planner-2, the lowerer, also
  the checker — single-lane planning; the independent pass remains the
  auditor's at the stage closeout, the established Stages 1–4 pattern).
- **Intended next consumer**: `delivery` lowering (this spec) → `factory`
  (Mind files Hand units citing delivery unit ids).
- **Handoff bar used**: campaign delivery readiness — the gate must be
  specific, grounded, architecturally decided, bounded, and testable enough
  that a mid-tier implementing Hand can execute units without inventing
  scope.
- **Verdict**: **READY**.
- **Reasoning**: The gate names nine concrete families and requires static +
  browser proofs with a11y checks — a bounded, enumerable surface. Every
  decision the gate leaves open is grounded in landed evidence, not
  speculation:
  - **Catalog home** — `tela:reference`, one flat sibling module in the tela
    package (the kernel's proven flat shape + the formslib flat-module
    precedent; the post-g4 surface means `→ tela.Visus` exports compose
    through normal imports — re-verified by the U1 probe, never assumed).
  - **Browser-proof vehicle** — the Stage 4 interactive seam (real `web:dom`
    + `tela:browser` + the documented faber-web host binding) is MET and
    landed; Stage 5 has **no gated units** (unlike Stage 4's CTO10-3 gate),
    and the carried residuals (CODEGEN001, prim-nullable, `verum`→`b`, the 9
    `dom.on*` WARN014 skips) are all recorded-not-blocking with work-around
    notes.
  - **Forms split** — the campaign's split-on-boundary rule maps to two
    sequential units: field/forms static half (U7) then behavior/a11y half
    (U8), matching "split forms on behavior/a11y boundary" verbatim.
  - **Dogfooding unit** — placed in the graph (U9) with a hard done_when
    (fake DOM + embedded harness TS → Faber source via the provider-module
    emit pattern; all six harness gates stay green; executed-orchestration
    rides the hardening executed lane). The conversion's authoring surface
    is grounded in the EBNF (genus records + functions, `varia`, `tabula`,
    `copia`, function-typed params — verified against `radix/EBNF.md`
    lines 88–96, 394–395) and the faberlang.dev generator as the complexity
    reference (multi-module, multi-locale Faber scripts, 2094 lines —
    evidence that non-trivial logic authors in Faber today).
  - **Batching** — batch-by-default for the simple families (U2 layout+
    typography, U3 panel+badge+metric), composite/behavior families split
    on their a11y/behavior boundaries (U4 table, U5 segmented-control,
    U6 button, U7/U8 forms). Small units, serial-friendly, one committing
    lane (tela only).
  - **Boundaries and stop conditions** — no compiler-known component kinds,
    no raw markup as the ordinary path, no faber-web/radix edits by units,
    no external gating; each unit names its non_goals.
- **Key points**:
  - Gate → surface mapping is 1:1: families → U2–U8; static proofs → the
    exempla surface under the check-exempla node runtime gate; browser
    proofs → the new `check-reference` harness (Stage 4 interactive-seam
    mechanics); a11y checks → both layers (structure asserts in the
    exempla, behavior asserts in the browser drivers); tests+determinism →
    U10; dogfooding → U9.
  - Stage 5 is NOT gated on any radix/faber-web delivery. The seam is real;
    the residuals are recorded work-around notes with `fix:<id>` markers.
  - The dogfooding posture's scope boundary is honored: the fake DOM
    (DOM *behavior*) converts in U9; the assertion/orchestration drivers
    (the *executed* lane) stay TS and ride the hardening lane — recorded
    per unit, never a Stage-5 blocker.
  - Validation for every bullet is named (check + lanes + node runtime gate
    + determinism double-build + the interactive seam) — testable without
    hidden chat context.

---

## Repo-Aware Baseline

Verified by planner-2 (2026-08-09):

- **`tela/`** — sibling git repo on `main`, clean at `af9d5ff` (the
  dogfooding scope-decision commit). Contents (Stage 0–4-landed,
  commit-verified): `faber.toml` (package `tela`, provider `tela`, `kind =
  "lib"`, targets `rust`+`ts`, `[reader] locale = "en"`); `src/tela.fab`
  (the flat kernel — Visus/serializers/Stilum/assemble/Thema/behavior
  carriers); `src/valida.fab`; `src/browser.fab` (the restored seam:
  `dom.Scope` + `dom.snapshot`, exported `mount`/`replace`/`dispose`/
  `focus_tenet`/`focus_optata`); `exempla/` (validation, serializer, thema,
  assemble, behavior, browser); `scripta/` (`check-compile`,
  `check-exempla`, `check-mount`, `check-determinism`, `check-forms-proof`,
  `check-forms-interactive`, `dom-shim.ts`); `proof/benchmark/`
  (`extension-lib/`, `canary-app/`, `libhome/` — symlinks `tela → ../../..`,
  `extensionlib → ../extension-lib`, `formslib → ../../extension-forms`);
  `proof/extension-forms/` (provider `formslib` — the Stage 4 proof package,
  flat `src/forms.fab` + `exempla/forms.fab`); `docs/design/`
  (`identity-hydration.md`, `theme-protocol.md`, `browser-lifecycle.md`);
  `docs/factory/mvp/` (campaign + stage-0/1/2/3/4 records);
  `spike/` (frozen — no unit writes); `build/` (gitignored evidence:
  `static-1.txt`/`static-2.txt`/`hashes.txt`).
- **The seam (landed, the Stage 5 browser-proof vehicle)** — the canary-app
  imports `web:dom` (real en→la) + `tela:browser` through the NORMAL package
  interface; `check-forms-interactive` assembles the real route
  (emitted app/browser `dom.*` refs → the emitted `web:dom` provider module
  → `bindings/ts.toml` mapping → `faber-web/runtime/dom.ts` verbatim) over a
  fake DOM modeled on the WEB5 fixture precedent; no tela-side shim, no
  same-named `webDom*` globals. This is the exact vehicle the new
  `check-reference` harness mirrors.
- **The G4-fixed consumability (Stage 4 evidence)** — `fix:g4` landed
  (radix `2103f8a7f`, cds-u6): formslib's `→ tela.Visus` component fns
  compose through normal qualified imports; the only remaining WARN014
  skips are the la provider's own `dom.on*` handler-typed exports. Stage 5's
  reference module exports (`→ tela.Visus` fns) are expected consumable;
  the U1 probe re-verifies against live radix (never assumed).
- **The harness mechanics (Stage 1–4)** — `check-exempla`: radix check every
  exempla; TS emit + assemble (strip + namespace consts); `tsc --noEmit`;
  node runtime gate (assertions execute; the `browser` case binds the
  dom-shim + the mount-proof driver). `check-mount`: the segmented-control
  interaction gate (node, fail-closed; binds the dom-shim). `check-forms-
  interactive`: the forms interactive gate over the real host binding
  (embedded fake DOM in its host-driver heredoc + `faber-web/runtime/dom.ts`
  verbatim). `check-forms-proof`: the formslib exempla gate + the consumer
  assembly gate. `check-determinism`: the three-package composition
  double-build (byte-compare + sha256 → `build/hashes.txt`; Rust primary
  path attempted + CODEGEN001 recorded; TS lane the proven lane).
  `check-compile`: radix check of src + benchmark packages under the
  libhome.
- **The fake-DOM conversion targets** — `scripta/dom-shim.ts` (35.7KB; the
  webDom* runtime-binding surface over an in-memory DOM + `parseFragment` +
  `executeMountPlan` + `bindRegionSubscriptions` + `executeMountProof` +
  the `MountedLike`/`RenovatioLike`/`MountProofApi` interfaces), consumed by
  `check-mount` + `check-exempla` (browser case); the embedded fake DOM in
  `check-forms-interactive`'s host-driver (FakeClassList/FakeEvent/
  FakeElement/FakeDocument/`parseFragment`/`installFakeDom`).
- **The provider-module emit pattern (the conversion precedent)** —
  `faber-web/src/dom.fab` (authored Faber, la locale) → `radix emit -t ts
  --locale la` → emitted TS assembled by the harnesses (strip + rename the
  preamble/`Element` via `strip_dom`). The fake DOM `.fab` authors the same
  shape in the en locale and emits to TS the same way.
- **The authoring surface (probed for the conversion)** — `radix/EBNF.md`:
  `fixum` (immutable) / `varia` (mutable) bindings (lines 88–96); `tabula<K,V>`
  (map) / `copia<T>` (set) (lines 394–395); function-typed params (`typus
  EventHandler = (DomEvent) → vacuum`, proven in faber-web); genus → emitted
  `class X { field!: T }` (definite-assignment fields; no methods — the
  conversion models behavior as functions over records, and the drivers'
  method-syntax call sites are rewritten to the emitted function surface);
  recursion + `si`/`ergo`/`vel` proven (the kernel, the generator). Global
  state (`globalThis.document`) is NOT expressible in Faber — the document
  instance flows as an explicit parameter, and the global installation stays
  at the driver boundary (orchestration TS, the hardening lane).
- **The complexity reference** — `faberlang.dev/generator/` (`src/*.fab`,
  2094 lines across 12 modules; multi-locale, `@ cli "speculum-gen"`,
  `norma:solum` reads, string/list ops) — evidence that non-trivial
  orchestration authors in Faber today; the U9 probe + the hardening lane
  cite its shapes.
- **The dogfooding posture (committed)** — tela `f7c8647` (record the
  posture) + `af9d5ff` (scope decided: Tela-first; conversion folds into the
  Stage 5 lowering as a named unit; executed-orchestration rides the
  hardening executed lane).
- **Radix binary** — in-tree `radix/target/debug/radix` (0.80.0);
  `--locale en`; exempla-mode `+++` frontmatter.
- **Cargo discipline** — no workspace cargo suites in any unit; Rust-lane
  checks in scratch dirs outside the shared workspace (`/tmp/…`); the tela
  harnesses are cheap node runs (fine once at closeout). Full radix ladder
  stages 4–6 / `--e2e` remain auditor-owned.
- **Concurrent workers** — none expected inside `tela/` during Stage 5 (the
  repo owns this stage; Stages 0–4 are closed). `faber-web` and `examples`
  are read-only here (the host binding is consumed, not extended).

---

## Entry Posture (no gated units; residuals as work-around notes)

Unlike Stage 4 (whose interactive claim carried the CTO10-3 gate), **Stage 5
has no gated units**: the seam is real and landed, and the Stage-4 residuals
are recorded-not-blocking. Each residual applies a recorded work-around with
a `fix:<id>` marker at the site; removal = grep-replace after the radix
fix lands (the Stage 1–4 discipline):

| Residual (Stage 4) | Stage 5 posture | Marker |
| --- | --- | --- |
| **CODEGEN001** — Rust emit-across-imports / provider-module locale propagation (Rust path for import-bearing files fails `definition id … could not be resolved during code generation`) | The TS lane stays the proven lane; the Rust static path is attempted + recorded per unit boundary; the R2 sha-equality note is restated. Never the gate. | `fix:codegen001` |
| **prim-nullable** — nullable-list method-call workaround (the `not is null` narrow) re-observed at the seam | Units use the recorded narrow pattern where nullables appear; a wrong expectation fails honestly. | `fix:prim-nullable` |
| **`verum`→`b`** — the la-locale bool keyword `verum` is not usable as a Faber identifier in en modules (the TS emitter substitutes the literal `true`) | Naming note carried: en-locale authoring never names an identifier `verum`/`falsum`; the tela catalog is en — unaffected, recorded. | `fix:verum-b` |
| **9 `dom.on*` WARN014 skips** — the la provider's own handler-typed exports (`web:dom.on*`) are export-skipped | tela consumers read `dom.on*` through the documented host binding (`bindings/ts.toml` → `runtime/dom.ts`) at the harness boundary (the DOM_NS assembly — the proven pattern); no tela authoring impact beyond the existing seam. | `fix:g4` (partial, host-side) |

No Stage 5 unit waits on any of these. If a unit's probe surfaces a NEW
shared language/target gap, it records a minimized repro (under
`tela/spike/defects/` where applicable) with a `fix:<id>` marker and the
work-around — it never weakens the framework contract (dependency rule 2).

---

## Normalized Spec

Stage 5 produces, in the `tela` repo: a **reference catalog module**
(`src/reference.fab`, provider `tela:reference` — the working spelling; the
U1 identity freeze may Latinize per the vocabulary policy, the `valida`
precedent), the **nine families** as ordinary component functions over typed
props → `tela.Visus` with stable identities + style bundles + namespaced
tokens; the **exempla surface** extended (static byte-exact + a11y-structure
assertions per family, executed under node); the **canary-app** extended to
compose the reference families (the runner output grows per unit); a **new
browser-proof harness** `scripta/check-reference` (the Stage 4
interactive-seam mechanics: real imports assembled against the documented
faber-web host binding; per-family mount + structure/a11y + interaction
cases); the **DOGFOODING conversion** (the harness fake DOM → authored
`scripta/harness_dom.fab` emitting to TS, rewiring `check-mount` /
`check-exempla` / `check-forms-interactive` / `check-reference`; the
hand-written `dom-shim.ts` deleted); and the **stage evidence record**.

Locked decisions this spec freezes (from Stages 0–4 or recorded here; not
invented — the U1 probe re-verifies the two probed items):

- **Reference-catalog home**: a NEW tela package module `src/reference.fab`
  (`tela:reference`), one flat module mirroring the kernel (the G4-safe flat
  shape + the formslib precedent). **Probed in U1**: the module's `→
  tela.Visus`-shaped exports are consumable through normal qualified imports
  post-`fix:g4` (re-verified against live radix — never assumed), and the
  module passes check + emit under the container library home. Props are
  **local carrier classes** (the `Scopulus` pattern — consumers read fields
  on the call result; never a widened kernel record).
- **Identity scheme**: `ref-`-prefixed stable `data-tela` identities
  (`ref-layout-*`, `ref-panel-*`, `ref-table-*`, `ref-button-*`,
  `ref-badge-*`, `ref-metric-*`, `ref-seg-*`); the field/forms identities
  continue the established `form-*` scheme (the Stage 3/4 precedent);
  collision-free per the G5 probe discipline, avoiding kernel type names
  (the snapshot-nomen-collision rule).
- **Component contract**: ordinary functions over typed props (campaign §3)
  — `Props → tela.Visus`; no compiler-known component kinds; no raw markup
  (the central-escaping serializer is the only renderer). Style bundles
  `→ tela.Stilum` keyed on the identities; namespaced tokens `ref.*`
  (e.g. `ref.panel.surface`, `ref.button.focus` — exact paths the Hand's,
  probed) as local-carrier accessors, consumed through `assemble` (the Stage
  2 assembly contract: ordering, dedup, fail-closed).
- **Accessibility contract (campaign §8)**: per family — accessible names
  (labels/aria-label/caption), keyboard operation matching the role
  (table: sort/keyboard; segmented-control: roving tabindex + arrows/Home/
  End; button: Space/Enter; field: native semantics + the validation/live-
  region contract), visible focus + `focus_tenet`/`focus_optata` restoration,
  semantic state (`aria-selected`/`aria-expanded`/`aria-invalid`),
  live-region policy (announce on state change, silent on no-op — the Stage
  3 §1.5 pattern), table headers + `scope`, reduced-motion/high-contrast
  theme behavior, no color-only communication.
- **Behavior boundary (D1, carried)**: the reference module owns the
  components' documented event/identity/a11y **contract** + the pure-level
  behavior surface; the concrete message-typed plan is **app-typed in the
  consumer** (the Stage 3/4 pattern — never kernel-generic). Consumers read
  effect keys through `tela.effectus_identitas` (`fix:sem001` held).
- **Browser-proof vehicle**: the Stage 4 interactive seam — real `web:dom`
  (en→la) + `tela:browser` + the documented faber-web host binding
  (`runtime/dom.ts` verbatim + `bindings/ts.toml`), node + the WEB5-modeled
  fake DOM, fail-closed, synchronous-only. The new `check-reference` harness
  mirrors `check-forms-interactive`'s assembly; per-family drivers run the
  mount/structure/a11y cases + the behavior interaction sequences.
- **The DOGFOODING conversion (U9)**: the fake DOM (both copies) →
  authored `scripta/harness_dom.fab` (self-contained, import-free, en
  locale; **probed in U1**: standalone `radix check`/`emit` on a scripta/
  `.fab` — the package-context fallback is a `proof/harness-dom/` package
  with its own `faber.toml`, the provider-module pattern's exact home),
  emitted to TS, assembled by the harnesses (the strip + preamble-rename
  mechanics carried from `check-forms-interactive`). The drivers' DOM-call
  sites are rewritten to the emitted function surface (methods → functions;
  the fake DOM models behavior as functions over genus records — Faber has
  no methods). `dom-shim.ts` is deleted; the embedded copy in
  `check-forms-interactive` is removed. The assertion/orchestration drivers
  stay TS (the hardening executed lane — a follow-on, never a Stage-5
  blocker).
- **Determinism posture**: the canary-app runner output extends per unit
  (the reference families join the composition) → the Stage 4 sha
  (`8dfcb143…`) is superseded per unit; `check-determinism` is RED between
  U2 and U10 — flagged honestly (the Stage 4 precedent); U10 re-records the
  official sha. Determinism applies to static/mount-time serialization only.
- **No `tela/spike/` writes** (frozen Stage 0 evidence — carried); no
  `CAMPAIGN.md` edits by units (decision D3 — closeout-owned); no
  faber-web/radix edits.

---

## Coordination Constraints (record, don't invent)

1. **D3 — CAMPAIGN.md stage-line + acceptance flip (closeout-owned)**: the
   Stage 5 stage-line status update AND the leading-clause evolution AND the
   acceptance flip are owned by the Mind-routed Stage 5 closeout (workflow
   step 6: consequences + correctness + independent audit,
   audit-before-acceptance — the Stages 3/4 precedent), not by any unit in
   this spec. Every unit leaves `CAMPAIGN.md` untouched. The factory README
   regeneration happens at the planning commit (Mind's commit; this planner
   does not commit) and again at the closeout (for the evidence records).
2. **One committing lane**: `tela/` is the only committing repo in Stage 5.
   `faber-web`, `examples`, `radix` are read-only; a genuine host gap is
   routed as a separate faber-web extension (the `0d79f5b` precedent), never
   a tela-campaign edit.
3. **Shared-file strict sequence**: `src/reference.fab` is written by U2 and
   extended by U3–U8 — **strictly sequential** (one flat module owns the
   catalog's public surface). The consumer `proof/benchmark/canary-app/src/
   main.fab` is extended by U2–U8 — strictly sequential. The harnesses are
   extended by U2–U8 (`check-exempla` wiring cases, `check-reference`
   cases, `check-compile` module list, `check-determinism` runner input) and
   **rewired by U9** (the fake-DOM conversion). `scripta/dom-shim.ts` is
   touched by **U9 only** (deleted). No unit overlaps another unit's
   write_scope; the graph is serial by design.
4. **Fire-9 batch norm — enumerate the consumers**: the Stage 5 deliverable's
   consumers: (1) the reference module itself (consumer of tela kernel
   modules), (2) the consumer app (`canary-app` — consumes `tela:reference`
   + formslib + extension-lib + tela), (3) the check harnesses
   (`check-reference` new; `check-exempla`/`check-compile`/`check-determinism`/
   `check-mount`/`check-forms-interactive` where the composition feeds them).
   Each unit proves the affected consumer surface green at its boundary or
   flags honestly (the determinism sha-supersession flag, the Stage 4
   precedent). The official full-surface run is U10's close and the stage
   closeout, exactly once.
5. **The D1 generic-construction block persists**: the concrete behavior
   plans (message types + bindings) are app-typed in the consumer; the
   reference module owns the non-generic contract surface only (the Stage
   3/4 pattern).
6. **Synchronous-only boundary** (the routed async-gap input, carried from
   Stage 3): no `@ futura`, no `dom.fetch_text`, no fetch-driven/async
   claims in any Stage 5 proof; the interaction sequences are scripted
   deterministic assertion sequences.
7. **The dogfooding scope boundary (the posture, committed f7c8647 +
   af9d5ff)**: U9 converts the fake DOM (DOM behavior) to Faber source; the
   assertion/orchestration drivers stay TS and ride the hardening executed
   lane — recorded per unit, never a Stage-5 blocker. No unit authors new
   TS-first harness tooling that "does things" beyond the recorded
   orchestration surface; a future workspace-wide conversion is a follow-on
   goal only if the Tela conversion earns it.
8. **Determinism sha supersession is recorded, not a failure**: the
   canary-app composition grows the reference families (U2–U8) → the Stage 4
   sha (`8dfcb143…`) is superseded; `check-determinism` is RED between units
   (flagged honestly); U10 re-records the official sha. Determinism applies
   to static/mount-time serialization only.
9. **The carried residuals apply recorded work-arounds** (`fix:<id>`
   markers; removal = grep-replace after each radix fix). Never weaken the
   Tela contract to hide a gap; a new gap records a minimized repro and
   escalates (dependency rule 2).

---

## Ordered Unit Graph

```
Wave 1:  U1 discovery-reference-posture        (docs: catalog home + naming + probes +
         residuals + dogfooding split locked)
Wave 2:  U2 layout-typography                  (reference.fab start + exempla + browser mount)
Wave 3:  U3 panel-badge-metric                 (reference.fab extend + exempla + browser mount)
Wave 4:  U4 table                              (composite: headers/caption/scope a11y + browser)
Wave 5:  U5 segmented-control-reference        (re-home the Stage 3 control + browser)
Wave 6:  U6 button                             (behavior/a11y: click + keyboard + focus)
Wave 7:  U7 field-forms-static                 (forms split half 1: field + form primitives, static + structure)
Wave 8:  U8 field-forms-behavior-a11y          (forms split half 2: validation + live region + keyboard)
Wave 9:  U9 dogfooding-harness-dom             (fake DOM + embedded harness TS → Faber source; six gates green)
Wave 10: U10 tests-determinism-evidence        (full surface green once + sha + evidence record)
```

Shared-file constraints: the catalog's flat single module `src/reference.fab`
is written by U2 and extended by U3–U8 — **strictly sequential** (one file
owns the catalog's public surface, the G4-safe flat shape). The consumer
`proof/benchmark/canary-app/src/main.fab` is extended by U2–U8 — strictly
sequential. The harnesses (`scripta/`) are extended by U2–U8
(`check-exempla` wiring cases, `check-reference` cases, `check-compile`
module list, `check-determinism` input) and rewired by U9 (the conversion);
`scripta/dom-shim.ts` is touched by U9 only (deleted); the embedded fake DOM
in `check-forms-interactive` is touched by U9 only. Docs are written by U1
(discovery) and U10 (evidence) + the U9 conversion evidence. **No unit
overlaps another unit's write_scope.**

| # | Unit | Wave | Depends on |
|---|---|---|---|
| U1 | `tela-s5-u1-discovery-reference-posture` | 1 | none (Stage 4 landed baseline) |
| U2 | `tela-s5-u2-layout-typography` | 2 | U1 |
| U3 | `tela-s5-u3-panel-badge-metric` | 3 | U2 |
| U4 | `tela-s5-u4-table` | 4 | U3 |
| U5 | `tela-s5-u5-segmented-control-reference` | 5 | U4 |
| U6 | `tela-s5-u6-button` | 6 | U5 |
| U7 | `tela-s5-u7-field-forms-static` | 7 | U6 |
| U8 | `tela-s5-u8-field-forms-behavior-a11y` | 8 | U7 |
| U9 | `tela-s5-u9-dogfooding-harness-dom` | 9 | U8 (any catalog wave; placed last-but-one so the conversion lands on the final harness surface) |
| U10 | `tela-s5-u10-tests-determinism-evidence` | 10 | U9 |

The DOGFOODING unit (U9) is placed after the catalog units so that (a) no
catalog unit depends on it — the posture's "do NOT block Stage 5 units on the
executed lane" is satisfied structurally; (b) it converts the FINAL harness
surface once (the fake DOM surface is stable; the drivers it rewires have
reached their Stage 5 size); (c) its verdict (can Faber express a 35.7KB fake
DOM today?) feeds the Stage 6+ planning before any future delivery invents a
TS-first harness (the posture's prohibition); (d) the U10 evidence wave
re-runs all six gates after the conversion — the conversion's green-gate
claim is re-verified at the official boundary. If the U9 authoring probe
surfaces a hard language gap, U9 records + escalates with a minimized repro
(the `fix:<id>` discipline) and completes with the authorable subset +
recorded workarounds; the stage closeout records the outcome honestly — the
conversion never weakens a harness gate to pass.

---

## Units

### U1 — `tela-s5-u1-discovery-reference-posture`

| Field | Value |
|---|---|
| `id` | `tela-s5-u1-discovery-reference-posture` |
| `outcome` | The discovery-first record: the reference-catalog home + naming locked (default `src/reference.fab`, `tela:reference`), the post-g4 authoring surface probed against live radix (union-returning exports consumable through normal imports; a scripta/ `.fab` checks + emits standalone — the DOGFOODING home), the consumers enumerated (fire-9), the Stage-4 residuals re-verified with work-around notes, the dogfooding split (fake DOM vs executed orchestration) frozen, and the unit wave plan confirmed — all in a docs-only discovery record. |
| `write_scope` | `tela/docs/factory/mvp/stage-5-discovery.md` (new) |
| `read_scope` | `CAMPAIGN.md` (Stage 5 lines 349–358; the batching table lines 160–162; §3 component contract; §8 accessibility contract; §4/§5 style/theme; the dogfooding posture lines 112–121; dependency rules); `stage-4-interactive.md` (the seam record + the 9 `dom.on*` skips); `stage-4-delivery.md` (the residuals + escalation table); `stage-4-extension-proof.md`; `AGENTS.md` (vocabulary policy (b); authoring constraints; the G4-safe flat rule); `radix/EBNF.md` (authoring surface: `varia`/`tabula`/`copia`/function-typed params); the landed kernel + browser.fab + the formslib flat shape; `faberlang.dev/generator/` (the complexity reference — skim the multi-locale modules); `faber-web/src/dom.fab` (the provider-module emit pattern) |
| `done_when` | (a) **Catalog home locked**: `src/reference.fab` (`tela:reference`), one flat module mirroring the kernel; the working spelling + the Latin alternative recorded (the `valida` precedent); the module's exports are the nine families over kernel `tela.Visus`/`Stilum`/`Scopulum` surfaces; props are local carrier classes. (b) **Probes recorded**: (i) a minimal `→ tela.Visus`-shaped export from a `tela:reference`-shape module resolves through NORMAL qualified imports from a consumer (post-g4 — re-verified against live radix, never assumed; if WARN014 persists, the G4 split posture applies and the discovery records the compose-without scope); (ii) a self-contained `.fab` in `scripta/` passes `radix check --locale en` + `radix emit -t ts --locale en` standalone (the DOGFOODING home probe — the `proof/harness-dom/` package fallback recorded if a package context is required). (c) **Consumers enumerated (fire-9)**: the reference module (consumer of tela kernel), the canary-app (consumes `tela:reference` + formslib + extension-lib + tela), the harnesses (`check-reference` new; `check-exempla`/`check-compile`/`check-determinism`/`check-mount`/`check-forms-interactive` where the composition feeds them); the per-unit-boundary package-test-surface rule recorded. (d) **Residuals re-verified + work-around notes recorded**: CODEGEN001 (Rust path attempted + recorded; TS lane proven), prim-nullable (the `not is null` narrow), `verum`→`b` (en-locale naming rule), the 9 `dom.on*` WARN014 skips (host-binding read — the DOM_NS pattern). (e) **The dogfooding split frozen**: the fake DOM (DOM behavior: node records, parser, webDom* surface, executeMountPlan/bindRegionSubscriptions) converts in U9; the assertion/orchestration drivers (assert sequences, mount proofs, the install-globals wiring) ride the hardening executed lane — recorded. (f) **The wave plan + identity scheme confirmed**: the U2–U10 graph, the `ref-*`/`form-*` identity scheme, the naming rule (no kernel-type-name collisions, G5 probe discipline). (g) `git diff --check` in `tela/`. |
| `validation` | No cargo. In-tree radix probes (check + emit attempts) recorded in the discovery record; `git diff --check`. Reviewer cross-check: catalog-home freeze vs the campaign scope table (reference primitives → tela) + the dogfooding split vs the posture (f7c8647/af9d5ff). |
| `depends_on` | none (Stage 4 landed baseline) |
| `non_goals` | No product code. No reference module (U2). No harnesses. No conversion (U9). No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Low–Medium.** Docs + probes only; the two probed items (post-g4 consumability, standalone scripta/ `.fab` emit) could surface a work-around need — the fallbacks are recorded (the G4 split posture; the `proof/harness-dom/` package home). |
| `est_work_tokens` | 3–5k |
| `test_owner` | Unit Hand (probes + record); reviewer (freeze vs campaign scope + the posture). |

### U2 — `tela-s5-u2-layout-typography`

| Field | Value |
|---|---|
| `id` | `tela-s5-u2-layout-typography` |
| `outcome` | The reference catalog starts: `src/reference.fab` with the **layout** (e.g. stacked rows / two-column grid / prose measures — exact surface the Hand's, probed) and **typography** (headings, prose, emphasis, scale — no color-only communication) families as ordinary component functions over typed props → `tela.Visus` with stable `ref-layout-*`/`ref-typography-*` identities, plus their style bundles + namespaced `ref.*` tokens; static byte-exact + a11y-structure exempla; a browser mounting proof (mount + structure/a11y asserts via `tela:browser`). |
| `write_scope` | `tela/src/reference.fab` (new — the flat catalog module start: layout + typography families, style bundles, tokens); `tela/exempla/reference.fab` (new — static byte-exact + a11y-structure assertions); `tela/proof/benchmark/canary-app/src/main.fab` (extend — compose the layout/typography reference composition into the runner); `tela/scripta/check-reference` (new — the Stage 4 interactive-seam browser-proof harness: real `web:dom` + `tela:browser` + the host binding; the layout/typography mount + structure cases); `tela/scripta/check-exempla` (extend — the `reference` wiring case); `tela/scripta/check-compile` (extend — the reference module + the extended exempla) |
| `read_scope` | U1 discovery record (home + naming + probes + identity scheme); `CAMPAIGN.md` §3 (component contract) + §8 (accessibility — accessible names, semantic structure, focus) + §4/§5 (style/theme); the landed kernel surface + the formslib flat pattern; `check-forms-interactive` (the seam assembly the new harness mirrors); `check-exempla` (the wiring-case mechanics); `stage-2-delivery.md`/`docs/design/theme-protocol.md` (assembly + tokens) |
| `done_when` | (a) `src/reference.fab` passes `radix check --locale en` under the container library home; the layout + typography families are ordinary fns over typed props → `tela.Visus` (no compiler-known kinds, no raw markup). (b) Stable `ref-*` identities + documented a11y structure (headings hierarchy for typography; semantic containers + prose semantics for layout); no color-only communication. (c) Style bundles `→ tela.Stilum` keyed on the identities referencing the `ref.*` tokens; the tokens are local-carrier accessors (the `Scopulus` pattern). (d) The exempla assert the exact static bytes (serializer emission order) + the a11y structure — fail-closed, executed under node. (e) `check-reference` green: each family mounts through `tela.browser.mount` against the host binding; the structure/a11y asserts hold (node exit 0, fail-closed, synchronous-only). (f) The canary-app composes the layout/typography families (normal qualified imports); the runner output extends — the Stage 4 determinism sha is **superseded, recorded** (U10 re-records; `check-determinism` RED between units — the honest flag). (g) The G4 consumability re-verified (the U1 probe holds at real use — a `→ tela.Visus` export resolves). (h) `git diff --check` in `tela/`. |
| `validation` | `radix check` on the reference module + the consumer; TS lane emit + assemble + `tsc --noEmit`; node — the exempla assertions + the `check-reference` mount cases execute (fail-closed); `git diff --check`. Narrow — the official full surface is U10 (fire-9 per-boundary rule). |
| `depends_on` | U1 |
| `non_goals` | No other families (U3–U8). No behavior interaction beyond mount/structure (U6/U8). No conversion (U9). No `CAMPAIGN.md` edits. No faber-web/radix edits. |
| `risk` | **Low–Medium.** The catalog module shape is the U1-probed surface; the new harness mirrors the proven `check-forms-interactive` assembly; the determinism sha churn is recorded (the honest flag). |
| `est_work_tokens` | 6–9k |
| `test_owner` | Unit Hand (exempla + lanes + the reference harness cases); reviewer (families vs §8 + the extension-contract §9 cross-check). |

### U3 — `tela-s5-u3-panel-badge-metric`

| Field | Value |
|---|---|
| `id` | `tela-s5-u3-panel-badge-metric` |
| `outcome` | The **panel** (surface/container with the theme-surface semantics), **badge** (status/label — no color-only communication), and **metric** (label + value + optional delta — the benchmark grammar's metric pattern) families join the catalog with static + browser proofs + a11y checks. |
| `write_scope` | `tela/src/reference.fab` (extend — panel/badge/metric families + bundles + tokens); `tela/exempla/reference.fab` (extend — static byte-exact + a11y-structure assertions); `tela/proof/benchmark/canary-app/src/main.fab` (extend — the families join the runner composition); `tela/scripta/check-reference` (extend — the mount + structure cases); `tela/scripta/check-exempla` (the wiring case absorbs the extended exempla) |
| `read_scope` | U1 discovery; `CAMPAIGN.md` §8 (a11y) + §4/§5 (style/theme — `surface.panel`, `state.positive` token families); the U2 emission; `docs/design/theme-protocol.md` |
| `done_when` | (a) The three families are ordinary fns over typed props → `tela.Visus` with `ref-panel-*`/`ref-badge-*`/`ref-metric-*` identities; panel uses the theme-surface semantics (no hardcoded color), badge carries a textual label + an ARIA `role="status"`/`aria-label` shape (no color-only communication — a badge's meaning is never color alone), metric renders label + value (+ optional delta) with the textual form preserved. (b) Style bundles + tokens extend (`ref.panel.*`, `ref.badge.*`, `ref.metric.*` — exact paths the Hand's, probed). (c) Exempla assert exact bytes + a11y structure (fail-closed, node). (d) `check-reference` green: the families mount + the structure/a11y asserts hold. (e) Runner output extends → sha superseded (recorded). (f) `git diff --check` in `tela/`. |
| `validation` | `radix check` both modules; TS lane + assemble + `tsc --noEmit`; node — exempla + reference cases (fail-closed); `git diff --check`. |
| `depends_on` | U2 |
| `non_goals` | No table/segmented/button/forms (U4–U8). No conversion (U9). No `CAMPAIGN.md` edits. No faber-web/radix edits. |
| `risk` | **Low.** Batch of simple static families on the U2-proven surface. |
| `est_work_tokens` | 5–8k |
| `test_owner` | Unit Hand; reviewer (badge/metric vs the benchmark grammar + §8). |

### U4 — `tela-s5-u4-table`

| Field | Value |
|---|---|
| `id` | `tela-s5-u4-table` |
| `outcome` | The **table** family (the benchmark's table grammar: headers, rows, cells, optional caption) as a composite component with the §8 table accessibility contract — headers + `scope`, caption, accessible summaries, keyboard/navigation structure — proven statically AND in the browser (mount + structure asserts; a scripted navigation/keyboard interaction where the table declares it). |
| `write_scope` | `tela/src/reference.fab` (extend — the table family: props (columns/rows/caption), identity scheme `ref-table-*`, the a11y contract surface, bundle + tokens); `tela/exempla/reference.fab` (extend — byte-exact + a11y-structure assertions: header cells, `scope`, caption); `tela/proof/benchmark/canary-app/src/main.fab` (extend — the table joins the runner); `tela/scripta/check-reference` (extend — the table mount + structure + declared interaction case) |
| `read_scope` | `CAMPAIGN.md` §8 (table headers + textual equivalents); the benchmark grammar evidence (`stage-1-benchmark-static.md`); the U3 emission; the Stage 3/4 interaction-driver patterns (`check-mount`, `check-forms-interactive`) |
| `done_when` | (a) The table family is ordinary fns over typed props → `tela.Visus` with `ref-table-*` identities; semantic `<table>`/`<thead>`/`<th>`/`<tbody>`/`<td>` structure; header cells carry `scope`; a caption (or a recorded equivalent) provides the accessible name. (b) The a11y contract is documented in the module header (headers/caption/keyboard semantics; the D1 app-typed plan boundary recorded — a declared keyboard/sort interaction stays in the consumer plan). (c) Exempla assert the exact static bytes + the structure (fail-closed, node). (d) `check-reference` green: the table mounts; the structure/a11y asserts hold; the declared interaction case (e.g. row navigation or focus movement) runs scripted, fail-closed, synchronous-only. (e) Runner output extends → sha superseded (recorded). (f) `git diff --check` in `tela/`. |
| `validation` | `radix check`; TS lane + assemble + `tsc --noEmit`; node — exempla + reference cases (fail-closed); `git diff --check`. |
| `depends_on` | U3 |
| `non_goals` | No data-viz/whisker/process-flow (Stage 6). No conversion (U9). No `CAMPAIGN.md` edits. |
| `risk` | **Medium.** The table is the first composite; its a11y contract (headers/scope/caption) is the new surface — asserted both statically and in the browser. |
| `est_work_tokens` | 6–10k |
| `test_owner` | Unit Hand; reviewer (table contract vs §8). |

### U5 — `tela-s5-u5-segmented-control-reference`

| Field | Value |
|---|---|
| `id` | `tela-s5-u5-segmented-control-reference` |
| `outcome` | The Stage 3 segmented control is **re-homed into the reference catalog**: the canary-app's app-typed segmented control shape becomes a `tela:reference` component (typed props → `tela.Visus` with the roving-tabindex/`aria-selected` structure), the app keeps its behavior plan (D1) and composes the reference control; the catalog's segmented control has its own static + browser proofs (the check-mount gate keeps proving the app composition; `check-reference` gains the catalog's segmented-control case). |
| `write_scope` | `tela/src/reference.fab` (extend — the segmented-control family: typed props, the `ref-seg-*`/established identity scheme, the a11y contract: role=radiogroup/radio, roving tabindex, `aria-selected`, the live-region policy); `tela/proof/benchmark/canary-app/src/main.fab` (extend — compose the reference control through normal imports; the app-typed plan + bindings re-target the reference identities); `tela/exempla/reference.fab` (extend — byte-exact + structure assertions); `tela/scripta/check-reference` (extend — the segmented-control mount + interaction case: pointer select, keyboard arrows/Home/End/Space/Enter, live-region announce/no-op) |
| `read_scope` | `stage-3-segmented-control.md` + `stage-3-mount-determinism.md` (the landed control + the interaction sequence); `stage-4-interactive.md` (the seam); the U4 emission; the canary-app's current segmented plan |
| `done_when` | (a) The segmented control exists as a `tela:reference` component (ordinary fns over typed props → `tela.Visus`) with the a11y contract documented (radiogroup/radio, roving tabindex, `aria-selected`, live-region policy — the §1.5 no-op rule). (b) The canary-app composes the reference control through normal qualified imports; its behavior plan (union Nuntius/update/annuntium) re-targets the reference identities — `check-mount` stays green (the app composition gate). (c) Exempla assert the exact bytes + structure (fail-closed, node). (d) `check-reference` green: the catalog segmented control mounts + the scripted interaction case runs (pointer, arrows, Home/End, Space/Enter, silent no-op, focus restoration) against the host binding. (e) Runner output extends → sha superseded (recorded). (f) `git diff --check` in `tela/`. |
| `validation` | `radix check`; TS lane + assemble + `tsc --noEmit`; node — exempla + `check-mount` (the app gate) + `check-reference` (the catalog case), fail-closed; `git diff --check`. |
| `depends_on` | U4 |
| `non_goals` | No new segmented behavior beyond the Stage 3 contract. No conversion (U9). No `CAMPAIGN.md` edits. |
| `risk` | **Medium.** The re-home touches the app's plan (identity re-target); the interaction contract is proven (Stage 3), so the risk is the identity seam, not the semantics. |
| `est_work_tokens` | 5–8k |
| `test_owner` | Unit Hand; reviewer (a11y contract vs §8 + the Stage 3 record). |

### U6 — `tela-s5-u6-button`

| Field | Value |
|---|---|
| `id` | `tela-s5-u6-button` |
| `outcome` | The **button** family as a behavior component: typed props (label, variant, state, event surface) → `tela.Visus` with the a11y contract (accessible name, native button semantics or the declared role, keyboard Space/Enter operation, visible focus + `focus_tenet` restoration, disabled state semantics), proven statically AND in the browser (scripted click/keyboard/focus interaction). |
| `write_scope` | `tela/src/reference.fab` (extend — the button family + bundle + tokens); `tela/exempla/reference.fab` (extend — byte-exact + structure assertions); `tela/proof/benchmark/canary-app/src/main.fab` (extend — the button joins the runner + the app-typed button plan); `tela/scripta/check-reference` (extend — the button mount + interaction case: click dispatch, Space/Enter keydown select, disabled no-op, focus restoration) |
| `read_scope` | `CAMPAIGN.md` §8 (keyboard + focus); the Stage 3/4 interaction-driver patterns; the U5 emission |
| `done_when` | (a) The button family is ordinary fns over typed props → `tela.Visus` with `ref-button-*` identities; accessible name (label/aria-label); the keyboard contract (Space/Enter activate — the native or declared role semantics); visible focus + the `focus_tenet` restoration pattern; disabled state semantics (no activation, the state exposed). (b) Exempla assert the exact bytes + the a11y structure (fail-closed, node). (c) `check-reference` green: the button mounts; the scripted interaction case runs (click activates the message; Space/Enter activate; disabled click no-ops; focus restores across a replace) — fail-closed, synchronous-only. (d) Runner output extends → sha superseded (recorded). (e) `git diff --check` in `tela/`. |
| `validation` | `radix check`; TS lane + assemble + `tsc --noEmit`; node — exempla + reference cases (fail-closed); `git diff --check`. |
| `depends_on` | U5 |
| `non_goals` | No form validation/live-region (U8). No conversion (U9). No `CAMPAIGN.md` edits. |
| `risk` | **Medium.** The first catalog behavior component authored in `tela:reference`; the interaction contract rides the proven seam + driver patterns. |
| `est_work_tokens` | 5–8k |
| `test_owner` | Unit Hand; reviewer (keyboard/focus contract vs §8). |

### U7 — `tela-s5-u7-field-forms-static`

| Field | Value |
|---|---|
| `id` | `tela-s5-u7-field-forms-static` |
| `outcome` | The **field/forms** split, half 1 (static): the field family (text input — the Stage 4 formslib contract re-homed as a tela reference component) with typed props → `tela.Visus`, the stable `form-*` identities, the `aria-invalid`/`aria-describedby` surface, the error/live-region association structure, labels, style bundles + `form.*` tokens — proven statically (byte-exact + a11y structure). The behavior half (validation transitions, live-region announcements, keyboard) is U8. |
| `write_scope` | `tela/src/reference.fab` (extend — the field family static: props (label, value, error, disabled, nomen), identities, the ARIA surface, bundles + tokens); `tela/exempla/reference.fab` (extend — byte-exact + structure assertions: label wiring, `aria-invalid` surface, `aria-describedby` → the error identity, the live region present); `tela/proof/benchmark/canary-app/src/main.fab` (extend — the field joins the runner) |
| `read_scope` | `stage-4-extension-proof.md` + `proof/extension-forms/src/forms.fab` (the landed field contract — a11y/validation structure, identity scheme); `CAMPAIGN.md` §8; the U6 emission |
| `done_when` | (a) The field family exists in `tela:reference` (ordinary fns over typed props → `tela.Visus`, `form-` identities) with the documented structure: accessible name (label/aria-label), `aria-invalid` true/false surface, `aria-describedby` wired to the error identity, the declared live-region node — the Stage 4 contract, re-homed (formslib stays the frozen proof package; no code duplication — the catalog's field is tela-owned). (b) Style bundles + `form.*` tokens (the Stage 4 namespaced-token surface). (c) Exempla assert the exact bytes + the a11y structure (fail-closed, node). (d) Runner output extends → sha superseded (recorded). (e) The behavior split recorded: validation transitions + announcements + keyboard are U8. (f) `git diff --check` in `tela/`. |
| `validation` | `radix check`; TS lane + assemble + `tsc --noEmit`; node — exempla (fail-closed); `git diff --check`. |
| `depends_on` | U6 |
| `non_goals` | No validation behavior/live-region transitions/keyboard (U8). No conversion (U9). No `CAMPAIGN.md` edits. No formslib edits (frozen proof package). |
| `risk` | **Low–Medium.** The static half rides the proven Stage 4 field contract; the new surface is the re-homing (tela-owned identity + module placement). |
| `est_work_tokens` | 5–8k |
| `test_owner` | Unit Hand; reviewer (field structure vs §8 + the Stage 4 contract). |

### U8 — `tela-s5-u8-field-forms-behavior-a11y`

| Field | Value |
|---|---|
| `id` | `tela-s5-u8-field-forms-behavior-a11y` |
| `outcome` | The **field/forms** split, half 2 (behavior + a11y): the validation semantics (invalid → `aria-invalid` true + error text; valid → cleared), the live-region policy (announce on a validation-state change, silent on no-op), the keyboard/native-input contract, and focus restoration — proven in the browser through a scripted interaction sequence (the Stage 4 interactive-gate sequence shape, re-run against the catalog field). |
| `write_scope` | `tela/src/reference.fab` (extend — the field behavior contract surface: validation-state mapping fns (pure), the event-name constants, the live-region policy — the D1 app-typed boundary recorded); `tela/proof/benchmark/canary-app/src/main.fab` (extend — the app-typed field plan: message type, bindings, update/validation semantics, announcements); `tela/scripta/check-reference` (extend — the field interaction case: input → invalid → valid → no-op → focus restoration → dispose, the Stage 4 sequence shape) |
| `read_scope` | `stage-4-interactive.md` (the forms interactive sequence + the seam); `stage-4-extension-proof.md` (the U4 behavior contract); `docs/design/identity-hydration.md` §7; the U7 emission; `CAMPAIGN.md` §8 (live region, focus, no-op) |
| `done_when` | (a) The validation semantics are documented + proven at the pure level (the mapping fns; invalid → `aria-invalid` true + error; valid → cleared; the no-op rule). (b) The live-region policy is the established pattern (announce once on a validation-state change, silent on no-op — the §1.5 rule extended to the catalog field). (c) `check-reference` green: the field interaction case runs against the host binding — input dispatch → message → update → `replace`; `aria-invalid` flips true/false; `aria-describedby` wired/removed; the error text written/cleared; the live region announces once (silent on the no-op); focus restores across the replace (`focus_tenet`); dispose unsubscribes (a post-dispose dispatch no-ops). Fail-closed, synchronous-only. (d) `fix:sem001` held (effects read through `tela.effectus_identitas`). (e) Runner output extends → sha superseded (recorded). (f) `git diff --check` in `tela/`. |
| `validation` | `radix check`; TS lane + assemble + `tsc --noEmit`; node — the interaction case (fail-closed); `git diff --check`. |
| `depends_on` | U7 |
| `non_goals` | No fetch/async claims (the routed gap). No conversion (U9). No `CAMPAIGN.md` edits. No formslib edits. |
| `risk` | **Medium.** The interaction semantics are proven (Stage 4 U4/U7); the new surface is the catalog re-home + the fresh identity seam — asserted fail-closed. |
| `est_work_tokens` | 6–10k |
| `test_owner` | Unit Hand; reviewer (validation/live-region contract vs §8 + the Stage 4 record). |

### U9 — `tela-s5-u9-dogfooding-harness-dom` (the DOGFOODING unit)

| Field | Value |
|---|---|
| `id` | `tela-s5-u9-dogfooding-harness-dom` |
| `outcome` | The dogfooding posture is executed on the Stage 5 harness surface: the harness fake DOM — `scripta/dom-shim.ts` (35.7KB) + the embedded fake DOM in `check-forms-interactive` — is **authored as Faber source** (`scripta/harness_dom.fab`, self-contained, en locale) that **emits to TypeScript** via the provider-module emit pattern (the `faber-web/src/dom.fab` → emitted TS precedent), and the harnesses consume the emitted module. All six harness gates stay green through the conversion. The assertion/orchestration drivers (assert sequences, mount proofs, the global-install wiring) stay TS and ride the hardening executed lane — recorded, not a Stage-5 blocker. |
| `write_scope` | `tela/scripta/harness_dom.fab` (new — the authored Faber fake DOM: node records (FakeClassList/FakeEvent/FakeElement/FakeDocument equivalents as genus records + functions over records — Faber has no methods), the bounded parser (`parseFragment` equivalent over string ops), the `webDom*` runtime-binding surface (scope/query/require/all/snapshot/text_set/attr_set/attr_remove/class_add/class_remove/class_toggle/on/unsubscribe/value/value_set/on_input/on_submit/on_keyboard/on_pointer/on_focus/prevent_default), `executeMountPlan` + `bindRegionSubscriptions` equivalents); `tela/scripta/dom-shim.ts` (deleted — replaced by the emitted module); `tela/scripta/check-mount` (rewire — assemble the emitted fake DOM instead of the hand-written shim; the driver's DOM-call sites rewritten to the emitted function surface); `tela/scripta/check-exempla` (rewire the `browser` case the same way); `tela/scripta/check-forms-interactive` (rewire — the embedded fake DOM in the host-driver heredoc is removed; the emitted module is assembled; the driver's DOM-call sites rewritten); `tela/scripta/check-reference` (rewire the same); `tela/docs/factory/mvp/stage-5-dogfooding.md` (new evidence record) |
| `read_scope` | `faber-web/src/dom.fab` (the provider-module emit pattern); `faber-web/runtime/dom.ts` (the webDom* surface the fake DOM mirrors); `radix/EBNF.md` (the authoring surface: genus records + functions, `varia`, `tabula`/`copia`, function-typed params, recursion); `faberlang.dev/generator/src/*.fab` (the complexity reference — string/list ops, recursion, `si`/`ergo`/`vel`); `scripta/dom-shim.ts` + `check-forms-interactive` (the conversion targets, read-only); the U1 probe record (the scripta/ `.fab` standalone check/emit probe + the fallback package home) |
| `done_when` | (a) **Authoring probe**: a minimal Faber probe confirms the fake DOM surface is expressible (genus records + functions over records; `tabula`/`copia` for the Map/Set state; `varia` for mutable locals; function-typed params; recursion over the tree; the bounded parser over string ops — no regexes beyond what Faber expresses, or the parser is re-authored with string scanning). Any genuine gap is recorded with a minimized repro + a `fix:<id>` marker (the escalation discipline — never a weakened conversion target). The probe outcome is in the evidence record. (b) **Authoring**: `scripta/harness_dom.fab` authors the full fake DOM surface (the U1-locked home; the `proof/harness-dom/` package fallback if the standalone probe failed). The document instance flows as an explicit parameter (Faber has no global state) — the global installation stays at the driver boundary (orchestration TS, the hardening lane). (c) **Emission + assembly**: `radix emit -t ts --locale en` produces the module; the harnesses assemble it with the established strip + preamble-rename mechanics (the `strip_dom` precedent — the emitted module's `FaberDisplayHint`/`__faberDisplay*` preamble must not collide with the tela module's). (d) **Rewire**: `check-mount`, `check-exempla` (browser case), `check-forms-interactive`, and `check-reference` consume the emitted fake DOM; the drivers' DOM-call sites are rewritten from method syntax to the emitted function surface (orchestration semantics unchanged); `scripta/dom-shim.ts` is deleted; the embedded copy in `check-forms-interactive` is removed. (e) **All six harness gates stay green** at this boundary — one official run, fail-closed: `check-compile`, `check-exempla`, `check-mount`, `check-determinism`, `check-forms-proof`, `check-forms-interactive`. (f) **The executed-lane split recorded**: what converted (fake DOM behavior) vs what rides the hardening lane (assertion/orchestration drivers, the global-install wiring, `executeMountProof`-shaped drivers) is explicit in the evidence record. (g) **Determinism**: if the canary-app runner output is unchanged by the rewire, the current sha stands; any runner change is recorded and re-recorded at U10. (h) `git diff --check` in `tela/`. |
| `validation` | `radix check --locale en scripta/harness_dom.fab` + `radix emit -t ts`; the six-harness official run once at this boundary (node, fail-closed); `tsc --noEmit` on the assembled compositions; `git diff --check`. No cargo beyond the existing radix binary (narrow; the radix-ladder stages 4–6 / `--e2e` are auditor-owned). |
| `depends_on` | U8 (any catalog wave; placed last-but-one so the conversion lands on the final harness surface) |
| `non_goals` | NO conversion of the assertion/orchestration drivers (the hardening executed lane — a follow-on, never this unit). NO faber-web runtime/dom.ts changes (TS by contract). NO emitted-TS authoring (the emit output is generated). NO new harness behavior. NO `CAMPAIGN.md` edits. NO radix-lane fixes. |
| `risk` | **Medium–High.** The conversion is the posture's proof: Faber must express a 35.7KB mutable-DOM simulation honestly. The authoring surface is probed in U1 + this unit's (a); genuine gaps are recorded + escalated (never a weakened harness); the driver-call-site rewrite is mechanical but touches every interactive harness — the six-gate green run is the fail-closed proof. |
| `est_work_tokens` | 10–16k |
| `test_owner` | Unit Hand (authoring + rewire + the six-gate run); reviewer (conversion-fidelity cross-check: the emitted surface vs the pre-conversion behavior; the posture split vs f7c8647/af9d5ff); closeout auditor (independent re-run of the six-gate surface). |

### U10 — `tela-s5-u10-tests-determinism-evidence`

| Field | Value |
|---|---|
| `id` | `tela-s5-u10-tests-determinism-evidence` |
| `outcome` | The official Stage 5 evidence boundary: the full tela package surface runs green once (the six harnesses + `check-reference`); the final composition double-builds byte-identical and the determinism sha re-records (superseding `8dfcb143…`); the stage evidence record documents the catalog, the proofs, the dogfooding verdict, the residuals, and the exact commands. |
| `write_scope` | `tela/docs/factory/mvp/stage-5-evidence.md` (new — the stage evidence record: the family coverage, the static + browser proof gates, the a11y matrix, the six-gate + check-reference runs, the final sha, the dogfooding verdict (the U9 evidence), the residuals, the exact commands, cargo discipline); `tela/scripta/check-determinism` (extend — the runner input is the final composition; re-record the official sha into `build/hashes.txt`) |
| `read_scope` | the U2–U9 emission; the existing harness mechanics; `stage-4-extension-proof.md` + `stage-4-interactive.md` (the evidence-record pattern + the previous sha records); `stage-5-discovery.md` (the frozen plan) |
| `done_when` | (a) **Full surface green once**: `check-compile` + `check-exempla` + `check-mount` + `check-determinism` + `check-forms-proof` + `check-forms-interactive` + `check-reference` — one official run, fail-closed. (b) **Determinism re-recorded**: the final composition (tela kernel + reference + formslib + extension-lib + canary-app) double-builds byte-identical; the new sha in `build/hashes.txt` (superseding `8dfcb143…`, recorded); the Rust primary path attempted + `fix:codegen001` recorded; the R2 sha-equality note restated. (c) **Fire-9 honored**: every consumer enumerated in U1 is exercised or explicitly flagged. (d) The evidence record documents the family coverage (all nine), the static + browser proof gates, the a11y matrix per family, the dogfooding verdict, the residuals, the exact commands. (e) `git diff --check` in `tela/`. |
| `validation` | Run the seven harnesses once at this boundary; reviewer/auditor re-runs as named test owners (the fire-9 norm); `git diff --check`. |
| `depends_on` | U9 |
| `non_goals` | No real-browser suite. No radix ladder stages 4–6 / `--e2e` / release-gate (auditor-owned). No `CAMPAIGN.md` edits (the closeout owns the flip). No radix-lane fixes. |
| `risk` | **Medium.** The sha churn is recorded (supersession — the honest flag); the full-surface run is the official boundary (one run, then done). |
| `est_work_tokens` | 4–7k |
| `test_owner` | Unit Hand (the official run + record); closeout auditor (independent re-runs). |

---

## Checkpoints And Gates

| Gate | After | Check |
|---|---|---|
| **SG1 — discovery + posture** | U1 | Catalog home + naming locked (`src/reference.fab`, `tela:reference`); the post-g4 consumability + the scripta/ `.fab` standalone emit probed against live radix; consumers enumerated (fire-9); the Stage-4 residuals re-verified with work-around notes; the dogfooding split (fake DOM vs executed orchestration) frozen. |
| **SG2 — layout + typography** | U2 | The two families render deterministically (byte-exact exempla, fail-closed) with the a11y structure asserted; the browser mount proofs green (`check-reference`); the runner output extends (sha supersession recorded). |
| **SG3 — panel + badge + metric** | U3 | The three families prove statically + in the browser; no color-only communication (badge carries a textual label); the a11y structure asserted. |
| **SG4 — table** | U4 | The composite table: headers + `scope` + caption structure asserted statically and in the browser; the declared interaction case runs scripted (fail-closed, synchronous-only). |
| **SG5 — segmented-control reference** | U5 | The Stage 3 control re-homed in `tela:reference`; the app composition gate (`check-mount`) stays green; the catalog's segmented-control interaction case green. |
| **SG6 — button** | U6 | The button's keyboard/focus/disabled contract proven in the browser (click, Space/Enter, disabled no-op, focus restoration); the a11y structure asserted. |
| **SG7 — field/forms static** | U7 | The field's static half: structure + ARIA surface + error/live-region association asserted byte-exact; the behavior split (U8) recorded. |
| **SG8 — field/forms behavior + a11y** | U8 | The validation transitions + live-region no-op policy + focus restoration proven through the scripted interaction case (fail-closed, synchronous-only); `fix:sem001` held. |
| **SG9 — dogfooding conversion** | U9 | The fake DOM (both copies) authored as Faber source and emitted to TS; `dom-shim.ts` deleted; the embedded copy removed; the drivers' DOM-call sites on the emitted surface; **all six harness gates stay green** at this boundary (one official run); the executed-lane split recorded. |
| **SG10 — evidence + determinism** | U10 | The full tela package surface green once (the seven harnesses); the final composition double-builds byte-identical (new sha recorded); the evidence record documents the catalog, the proofs, the a11y matrix, the dogfooding verdict, the residuals. |
| **Stage closeout** | all | Campaign workflow step 6: review with `consequences`, `correctness`, and an independent audit **before** accepting (audit-before-acceptance — the Stages 3/4 precedent). The closeout owns the Stage 5 stage-line status update + the leading-clause evolution + the acceptance flip (decision D3) + the factory README regeneration. The closeout records the dogfooding verdict honestly. |

The Stage 5 gate bullets map to the gates above (families → SG2–SG8;
static proofs → the exempla node runtime gate in each SG; browser proofs →
`check-reference` in each SG; accessibility checks → the a11y structure +
behavior asserts in each SG; the dogfooding unit → SG9; tests + determinism
→ SG10; the forms split → SG7/SG8).

---

## Validation Summary

| Layer | Command / Flow | Covers |
|---|---|---|
| Package semantics | `radix check --locale en` on `src/reference.fab` + the exempla + the canary-app (container + benchmark libhome) | The catalog + the consumer typecheck across the module boundary |
| TS lane | `radix emit -t ts` + assemble + `tsc --noEmit` (reference module, exempla, the canary-app composition, the fake-DOM module in U9) | Typed values valid in TypeScript; the proven runtime lane |
| Node runtime gate | The exempla assertions + the `check-reference` cases run under `node` (fail-closed) | Static renders + a11y structure + the browser proofs |
| Interactive seam | `check-reference` (new; the Stage 4 mechanics — real `web:dom` + `tela:browser` + the host binding, node, fail-closed, synchronous-only) + `check-mount` + `check-forms-interactive` (the landed gates stay green) | The catalog's browser proofs; the interaction sequences |
| Determinism | `check-determinism` — the final composition built twice, byte-compare (sha256 → `build/hashes.txt`) | Byte-identical static/mount-time serialization (fail-closed); sha supersession recorded; R2 + CODEGEN001 noted |
| Package test surface | `check-compile` + `check-exempla` + `check-mount` + `check-determinism` + `check-forms-proof` + `check-forms-interactive` + `check-reference` | The tela package surface (the fire-9 norm — consumers enumerated + exercised at each boundary or flagged) |
| Dogfooding | U9's six-gate green run + the emitted fake-DOM assembly (strip + preamble-rename) | The posture's conversion proof (Faber-authored fake DOM, gates stay green) |
| Assembly contract | The canary-app assembly assertions (ordering, dedup, fail-closed) under `node` | The Stage 2 contract with the reference module in the cascade |
| Rust lane | `radix emit -t rust` + scratch-dir `cargo check` (import-free surfaces only; import-bearing paths attempted + `fix:codegen001` recorded) | Import-free surfaces green; CODEGEN001 recorded; the R2 note |
| Doc hygiene | `git diff --check` in `tela/` | Whitespace/conflict hygiene |
| Cargo discipline | No workspace cargo suites; scratch dirs only | Lock ownership (operator rule 2026-08-07) |
| Radix ladder | Not run by Stage 5 units (tela changes do not touch radix); stages 4–6 / `--e2e` auditor-owned | Boundary: no whole-workspace suites |

---

## Ownership Split (tela vs faber-web host seams)

| Surface | Owner | Stage 5 posture |
| --- | --- | --- |
| The reference catalog (`src/reference.fab` — the nine families, bundles, tokens, contracts) | `tela` | Authored + owned in this repo; the flat sibling-module shape; the app-typed behavior plans stay in the consumer (D1). |
| The static proofs (exempla) + the browser-proof harness (`check-reference`) | `tela` | The exempla under the check-exempla node runtime gate; the browser proofs via the Stage 4 interactive-seam mechanics. |
| The dogfooding conversion (`scripta/harness_dom.fab` → emitted TS, the harness rewires) | `tela` | Authored in tela; emits to TS (generated); the orchestration drivers stay TS (the hardening lane). |
| The browser host runtime (`faber-web/runtime/dom.ts`) + the bindings (`bindings/ts.toml`) + the la provider module (`faber-web/src/dom.fab`) | `faber-web` | **Read-only in Stage 5** — consumed through the documented host binding (the DOM_NS assembly over the verbatim runtime, the Stage 4 precedent). TS by contract. A genuine host gap is routed as a separate faber-web extension (the `0d79f5b` precedent), never a tela-campaign edit. |
| The emitted TS output (the fake-DOM emit, the reference emit, the composition) | generated | Generated by `radix emit` into scratch/harness assembly — never hand-authored TS. |
| Language/emission facts + the carried residuals (CODEGEN001, prim-nullable, `verum`→`b`, the 9 `dom.on*` skips) | `radix` | Stage 5 applies the recorded work-arounds (`fix:<id>` markers; removal = grep-replace after each fix lands); a new gap records a minimized repro + escalates (dependency rule 2). |

**One committing lane**: `tela/` only. `faber-web`, `examples`, `radix` are
read-only for every unit; the seam is consumed, never edited.

---

## Escalation Path (radix-lane residuals — recorded, not fixed here)

| Defect | Marker | Stage 5 posture | Removal predicate |
| --- | --- | --- | --- |
| **CODEGEN001** — Rust emit-across-imports / provider-module locale propagation (Rust path fails `definition id … could not be resolved during code generation`) | `fix:codegen001` | The TS lane is the proven lane; the Rust path is attempted + recorded per unit boundary; the R2 sha-equality note is restated. Never the gate. | Rust-lane capture equals the TS-lane capture; `grep -rn 'fix:codegen001'` finds no live site |
| **prim-nullable** — nullable-list method-call workaround (the `not is null` narrow) | `fix:prim-nullable` | Units use the recorded narrow pattern where nullables appear; a wrong expectation fails honestly. | The fix lands; `grep -rn 'fix:prim-nullable'` finds no live site |
| **`verum`→`b`** — the la-locale bool keyword not usable as an identifier in en modules | `fix:verum-b` | Naming note carried (en authoring never names an identifier `verum`/`falsum`); the tela catalog is en — unaffected. | — (radix-lane awareness) |
| **9 `dom.on*` WARN014 skips** — the la provider's own handler-typed exports are export-skipped | `fix:g4` (partial, host-side) | tela consumers read `dom.on*` through the documented host binding at the harness boundary (the DOM_NS assembly); no tela authoring impact beyond the existing seam. | The provider's handler-typed exports appear on the snapshot (a faber-web/radix-lane item) |

**Stage 5 is NOT gated on any of these.** A NEW gap surfaced by a unit's
probe records a minimized repro (under `tela/spike/defects/` where
applicable) + a `fix:<id>` marker + the work-around — it never weakens the
framework contract (dependency rule 2). The U9 authoring probe's verdict
(Faber's expressiveness for the fake DOM) is the unit's own record; a gap
escalates with a minimized repro, and the stage closeout records the outcome
honestly.

---

## Open Questions For Mind

| # | Question | Default | Who |
|---|---|---|---|
| Q1 | Reference-catalog module naming: `tela:reference` (English working name) vs a Latin spelling (`tela:refero`, the `valida` precedent). Vocabulary policy (b) types are Faber-Latin; module names have been Latin (`tela`, `valida`). | `tela:reference` (U1's identity freeze may Latinize) | Mind (confirm) |
| Q2 | Consumer scope: extend the existing canary-app with the reference families (one app, all packages — the ecosystem story; the runner grows; the sha supersedes per unit) vs a new `proof/reference-app/` consumer (cleaner separation from the Stage 4 proof; a second assembly surface + a second libhome consumer). | Extend the canary-app (the U3/U4 precedent; one runner; the sha churn is recorded) | Mind (confirm) |
| Q3 | DOGFOODING home: `scripta/harness_dom.fab` (self-contained, colocated with the harnesses — probed in U1) vs a `proof/harness-dom/` package (own `faber.toml`, the provider-module pattern's exact home). | `scripta/harness_dom.fab` if the standalone check/emit probe passes; else the package fallback | Mind (confirm if the probe fails) |
| Q4 | The executed-lane follow-on: after U9 proves the fake DOM in Faber, the assertion/orchestration drivers → executed Faber scripts rides the hardening executed lane (a dedicated hardening goal, not Stage 5). Confirm the hardening lane is a Stage 8/separate-goal input (the posture: "a workspace-wide version is a follow-on goal only if the Tela conversion earns it"). | Hardening lane = a follow-on goal (recorded in the U9 evidence + the stage residuals) | Mind (confirm) |

---

## Residuals (routed, not Stage 5 work)

- **The executed-orchestration hardening lane** — the assertion/orchestration
  drivers (assert sequences, mount proofs, the global-install wiring) stay TS
  in Stage 5 (the posture's boundary: U9 converts the fake DOM; the executed
  lane hardens later). A workspace-wide TS→Faber harness conversion is a
  follow-on goal only if the Tela conversion earns it (posture lines
  118–121).
- **Radix-lane fixes** (Mind routes minimized deliveries; removal =
  grep-replace after each fix lands): `fix:codegen001`, `fix:prim-nullable`,
  `fix:verum-b` (awareness), the host-side `fix:g4` remainder (the 9
  `dom.on*` skips). Repros under `tela/spike/defects/` where applicable.
- **Real-browser verification** (layout/scroll/pointer fidelity beyond the
  host-binding fixture's state-level surface) → deferred (the campaign
  residual; the node host-binding fixture is the Stage 5 vehicle).
- **Data display and visualization** (tables' visual-viz extension, bars,
  legends, whiskers, process flows) → Stage 6 (consumes the reference
  catalog; the campaign gate).
- **Speculum migration + duplicate-IR removal** → Stage 7.
- **Capability-truth finalization, versioning, publication, the executed
  lane, documentation/release** → Stage 8.
- **CAMPAIGN.md Stage 5 stage-line update + the acceptance flip + the
  leading-clause evolution + the closeout factory README regen** → the
  Mind-routed Stage 5 closeout (decision D3, workflow step 6 —
  audit-before-acceptance held). The factory README doc-count update at
  doc-creation time is Mind's planning-commit job (this planner does not
  commit).
