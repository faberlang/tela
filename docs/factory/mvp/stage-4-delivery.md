# Stage 4 — Independent Extension Package Proof — Delivery Spec

**Status**: planned (delivery lowering complete)
**Planner**: planner-1
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` — Stage 4 "Independent
Extension Package Proof" (lines 304–320), the Stage 4 references (line 185:
"Defer catalog expansion until protocol gates and the Stage 4 independent
extension proof close"; line 766, Open Question 6: which independent
extension package provides the strongest Stage 4 proof), the governing
invariant (lines 53–55), the extension contract §9 (lines 633–644), the
batching table (independent extension proof = `discovery-first`, lines
156–158), and the Stage 0 two-package canary record
(`stage-0-canary.md`).
**Control-plane repo**: `/Users/ianzepp/work/faberlang/tela` (Stage 4 cwd)
**Baseline carried from Stage 3**: the landed Stage 3 surface — the kernel
behavior carriers (`src/tela.fab`, U1 `4ca331a`), the browser module
`src/browser.fab` (U2 `9f23095` — the pinned seam call shape
`mount(Scope, Visus, Thema)` / `replace(Mounted, Visus)` / `dispose(Mounted)`
with the opaque `Scope` handle standing in for the blocked `dom.Scope`, the
G4-safe hydration policy fns, `focus_tenet`/`focus_optata`), the dom-shim
harness family (`scripta/dom-shim.ts` — `parseFragment`/`executeMountPlan`/
`bindRegionSubscriptions`/`executeMountProof`), the benchmark's extension-lib
+ canary-app pattern (`proof/benchmark/` + libhome), the interaction gate
(`scripta/check-mount`, node exit 0 — scripted sequence), the determinism
gate (`scripta/check-determinism`, sha `775169163d3edbe1b538a38c4caa2fa16338b0f6bf1f131374a9330a737e5490`),
the design record `docs/design/browser-lifecycle.md` + `AGENTS.md` Stage 3
notes, and the Stage 3 closeout `stage-3-closeout.md` + evidence records
(`stage-3-segmented-control.md`, `stage-3-mount-determinism.md`).

> **Stage 3 acceptance (f0e6377, 2026-08-09)**: audit-backed clean_pass,
> audit-before-acceptance held; Stage 4 selected next. The Stage 4
> interactive-proof gate's hard conditions are **RECORDED NOT MET**
> (CTO10-3, `stage-3-closeout.md` §6): `fix:web-dom-locale` (a real en→la
> `web:dom` import) + `fix:g4` (the `tela:browser` lifecycle exported and
> consumable through the normal package interface). The
> `fix:sem001`/`fix:prim-nullable`/`fix:codegen001` markers are **NOT**
> Stage-4 blockers (the kernel accessor + call-null-check + TS-lane patterns
> hold). This delivery's KEY STRUCTURE (the entry-gate split, §Entry-Gate
> Split below) is built around that recorded gate.
**Mode**: planning artifacts only. This spec lowers the stage; it does not implement.
**Closeout owner**: the tela `CAMPAIGN.md` Stage 4 stage-line status update +
the leading-clause evolution + the acceptance flip are owned by the
**Mind-routed Stage 4 closeout** (workflow step 6), **not** by any unit in
this spec — decision D3 pattern carried from Stages 1/2/3
(stage-3-delivery.md Coordination Constraints §1). The factory README
regeneration at doc-creation time is done by this planning commit; the
closeout regenerates again for the evidence records.

---

## Phase Intent

Turn the Stage 4 campaign gate into discrete, one-Hand-per-unit implementable
units. Stage 4 proves the **public extension seam**: one separate package —
own directory, own `faber.toml`, own provider identity, imported through the
library-home machinery — adds a component family, styles, namespaced theme
tokens, behavior, product assembly input, and tests **without modifying
Tela, `faber-web`, `faber`, or Radix** (the campaign gate, verbatim). The
benchmark's `extension-lib` proved one helper + one token + one bundle
(Stage 1); the canary-app proved the segmented control over the *assembled*
lifecycle surface (Stage 3). Stage 4 is the **ecosystem proof**: a *nontrivial*
component family from a *third* package, consumed by the same benchmark app
through the public seam, with the assembly input flowing through `assemble`.

What Stage 4 is **not**: no Tela/faber-web/faber/radix edits (the overlap
rule is a hard gate); no reference catalog (Stage 5 — the Stage 4 proof is
the gate the catalog waits on, campaign line 185); no Speculum migration
(Stage 7); no publication/release (Stage 8); no real-browser driver (the
deferred campaign residual; the node host-binding fixture is the Stage 4
vehicle); no radix-lane defect fixes (the interactive seam depends on the
CTO-5 units landing — see §Escalation Path; the Stage 4 workarounds carry
`fix:<defect-id>` markers and are removed by the gated units' removal
predicates when the fixes land).

---

## Interpreted Scope

Per the Stage 4 gate, the campaign extension contract §9, the governing
invariant, and the Stage 0 two-package canary record, Stage 4 must deliver:

1. **A separate package** — own directory + `faber.toml` + provider identity,
   imported through the library-home machinery (the Stage 0 canary's package
   boundary: a same-file "extension" does not close the gate) — that depends
   **only on Tela public modules** (`tela:tela`, and `tela:browser` only if a
   surface needs it — default: kernel only) and documented `faber-web` host
   seams (the overlap rule).
2. **A component family** — ordinary Faber functions over typed props
   producing `tela.Visus` values with stable `data-tela` identities, the ARIA
   contract, and the declared keyboard/validation structure. Default family:
   **forms** (field / checkbox / select + error + live-region association) —
   campaign Open Question 6's strongest-proof candidate, §Open Questions Q1.
3. **Styles** — the family's component style bundles keyed on its identities
   (`[data-tela='form-…']` rules), referencing the family's tokens.
4. **Namespaced theme tokens** — `form.*`-path tokens (e.g. the campaign §5
   example `form.field.invalid`) added **without widening Tela's standard
   theme record**, exposed through the proven local-carrier accessor pattern.
5. **Behavior** — the family's documented event/identity/validation contract
   (what each component fires on which identity, the ARIA/validation
   semantics, the live-region policy) plus a **pure-level behavior proof**
   (concrete message type + plan + update/validation semantics asserted; the
   D1 app-typed boundary recorded — the concrete plan is never kernel-generic).
6. **Product assembly input** — the package's bundle(s) + package-identity
   entry consumed by the consumer app's `assemble` in a **three-package
   cascade** (extensionlib → formslib → canary-app) with ordering, dedup, and
   fail-closed assertions (the Stage 2 gate's assembly contract re-exercised
   with a third package).
7. **Tests** — the proof package's own test surface (exempla-mode tests
   asserting the exact static bytes + ARIA structure + the pure semantics)
   wired into the package test surface by a new harness.
8. **The interactive proof (the recorded CTO10-3 gate)** — the family's
   behavior exercised through the **real provider seam**: a real en→la
   `web:dom` import + the `tela:browser` lifecycle (mount/replace) exported
   and consumable through the **normal package interface**, the forms
   components composed from the consumer through normal qualified imports
   (no compose-without, no harness-assembly bypass, no tela-side shim), and
   the scripted interaction sequence run against the documented faber-web
   host binding. **This unit carries the recorded gate and executes ONLY when
   `fix:web-dom-locale` + `fix:g4` land** (§Entry-Gate Split; §Escalation
   Path names the CTO-5 units that deliver them — provider-locale +
   file-interface-exports — and the removal predicates).

Coordination constraints carried in (record, don't invent):

- **The entry-gate split is the delivery's spine.** The non-interactive proof
  surfaces (component family static, styles, namespaced tokens, product
  assembly input, tests, pure-level behavior) proceed on the landed Stage 3
  surface — **NOT gated** on web-dom-locale/G4. The interactive-claim
  units (U6 seam-restoration + U7 interactive-provider-seam) carry the
  recorded CTO10-3 gate and execute only when both radix fixes land. The
  dom-shim harness is **never** reused to claim the interactive proof (the
  shim = assembled-source/runtime proof, not provider-seam proof — head-cto
  CTO9-3/CTO10-3).
- **The overlap rule is a hard gate.** The proof package may depend only on
  Tela public modules + documented faber-web host seams; no Tela/
  faber-web/faber/radix modification by the proof package. The only tela
  `src/` delta in Stage 4 is U6's **workaround-removal** (the CTO-5 removal
  predicate: the browser.fab seam flips back to the spec-locked `dom.Scope`
  when the radix fix lands) — a radix-fix integration restoring the locked
  shape, not a framework modification (recorded, §Open Questions Q4).
- **The G4 consumability split (landed evidence) is the non-gated
  posture.** Per `stage-1-benchmark-static.md` §3: union-returning exports
  (`→ tela.Visus`, and the pinned seam fns `mount`/`replace`) are
  WARN014-skipped for consumers today; class-returning (`→ tela.Stilum`) and
  local-class accessors **resolve**. So the non-gated units prove: tokens +
  styles + assembly input consumable today; the component family + behavior
  self-proven in the package (same-package calls render + assert); the
  consumer's cross-package composition of the family stays behind the
  documented compose-without workaround until g4 lands — the seam is kept,
  never weakened. U6/U7 flip to normal consumption after the fixes.
- **Fire-9 batch norm (Stage 4 is a tela package — enumerate consumers).**
  The consumers of the Stage 4 deliverable: (1) the proof package itself (a
  consumer of tela public modules), (2) the consumer app (`canary-app` —
  consumes the proof package + `extension-lib` + tela), and (3) the check
  harnesses (`check-forms-proof` new; `check-exempla`/`check-mount`/
  `check-determinism` where the composition feeds them). Each unit proves the
  relevant package-test surface green at its boundary or flags honestly
  (§Coordination Constraints 5).
- **Determinism sha supersession.** The canary-app composition gains the
  forms package (U3) → the runner output changes → the Stage 3 sha
  (`77516916…e5490`) is superseded. `check-determinism` is RED between U3
  and U5 — **flagged honestly** (the Stage 3 U4 precedent: new inputs break
  the wiring case until the wiring unit lands). U5 re-records the official
  sha; determinism applies to static/mount-time serialization only
  (interactive state stays time-variant — the recorded posture).
- **Synchronous-only boundary** (the routed async-gap input, carried from
  Stage 3): every Stage 4 proof is synchronous — no `@ futura`, no
  `dom.fetch_text`, no fetch-driven/async update claim. The gated U7's
  interaction sequence is a scripted deterministic assertion sequence.
- **No CAMPAIGN.md edits by units** — the Stage 4 stage-line status +
  acceptance flip + the leading-clause evolution belong to the Stage 4
  closeout (decision D3, like Stages 1/2/3). The factory README regen at
  creation is this planning commit's job (sibling convention); the closeout
  regenerates again for the evidence records.
- **`fix:<defect-id>` anti-fossilization discipline continues** (CTO-6):
  every applied radix-lane workaround carries the marker at the site;
  removal = grep-replace after each radix fix (the gated units execute the
  removal predicates). A colliding locked verb is escalated, never silently
  renamed (the `html` → `html_visus` precedent).

---

## Entry-Gate Split (CTO10-3 — recorded, the delivery's spine)

The Stage 3 closeout (§6) recorded the Stage 4 interactive-proof gate:

> 1. **`fix:web-dom-locale`** — a real en→la `web:dom` import must land (the
>    harness-level DOM binding is the Stage 3 fallback, recorded);
> 2. **`fix:g4`** — the `tela:browser` lifecycle (mount/replace) must be
>    exported and consumable through the normal package interface.
>
> The `fix:sem001` / `fix:prim-nullable` / `fix:codegen001` markers are
> **NOT** Stage-4 blockers.

**This delivery lowers the split exactly:**

| Surface | Units | Gated? |
| --- | --- | --- |
| Discovery + seam probe (identity freeze, consumer enumeration, gate-status re-verification) | U1 | **No** (docs only) |
| Component family (static half — the package self-proves: check + lanes + byte-exact exempla) | U2 | **No** |
| Styles + namespaced `form.*` tokens + product assembly input (consumable today: class/local-carrier exports resolve; three-package assemble) | U3 | **No** |
| Behavior contract + pure-level behavior proof (the D1 app-typed plan, asserted) | U4 | **No** |
| Package test surface + harness + determinism re-record (check-forms-proof + the Stage 3 surface green once) | U5 | **No** |
| Seam restoration (browser.fab flips to the real `dom.Scope`; `fix:web-dom-locale`/`fix:g4` removal predicates executed) | U6 | **YES** — only when **both** cds-u5 (`provider-locale`) and cds-u6 (`file-interface-exports`) land (re-verified live, never assumed) |
| Interactive provider-seam proof (real en→la `web:dom` + exported `tela:browser` + forms composed through normal imports + the scripted interaction gate against the host binding) | U7 | **YES** — depends on U6 (the restored seam) |

The **non-interactive** surfaces are NOT gated: they ride the landed Stage 3
surface (kernel + browser module + dom-shim harness family + benchmark) and
the landed G4 consumability split (tokens/styles/assembly consumable today;
the family + behavior self-proven). The **interactive claim** (a separate
package's behavior exercised through the real provider seam) is the CTO10-3
gate: U6 + U7 execute only when both fixes land. **The dom-shim is never
reused to claim the interactive proof** — the shim proves the assembled
source runs, not that the provider seam (en→la import + export snapshot)
holds; the gated units prove the provider seam through the normal package
interface (U7's host binding is the documented faber-web seam, not a tela-side
re-implementation).

---

## Normalized Spec

Stage 4 produces, in the `tela` repo: a **third package** `proof/extension-forms/`
(provider `formslib`, flat single module `src/forms.fab` — the G4-safe shape,
own `faber.toml`, own exempla-mode test surface) contributing the forms
family + styles + namespaced `form.*` tokens + the behavior contract + the
assembly input; the **canary-app extended** to import `formslib`, assemble
the three-package cascade, and (in the gated U7) mount interactively through
the real seam; a **new harness** `scripta/check-forms-proof` + the
determinism extension; a **discovery record**, an **evidence record**, an
**interactive evidence record**; and (gated) the **seam restoration** in
`src/browser.fab`.

Locked decisions this spec freezes (from Stage 0/1/2/3 or recorded here; not
invented):

- **Proof-package identity**: directory `proof/extension-forms/`, package +
  provider `formslib` (alphanumeric — the `provider:module` import form
  requires it, the Stage 0 canary §3 record), `kind = "lib"`, `targets =
  ["rust", "ts"]`, `locale = "en"`, flat single module `src/forms.fab`
  (G4-safe: every public signature references local types + the kernel's
  `tela.Visus`/`tela.Stilum`; the WARN014 family is recorded per export, not
  fought). Library-home alias: `proof/benchmark/libhome/formslib` →
  `../../extension-forms` (the benchmark libhome grows one symlink). The
  package depends on **`tela:tela` only** (the overlap rule; `tela:browser`
  only if a surface needs it — default no). Consumer: the existing
  `canary-app` (the ecosystem proof: one app, three packages).
- **Family default — forms** (campaign Open Question 6; §Open Questions Q1
  for Mind's word): field (text input), checkbox, select, plus the
  error/live-region association. Ordinary component functions over typed
  props → `tela.Visus` (campaign §3 — no compiler-known component kind).
  Identity scheme: `form-`-prefixed stable `data-tela` identities
  (`form-control`, `form-field-<nomen>`, `form-error-<nomen>`, `form-live`,
  …) — exact spellings are the Hand's, probed collision-free (fix:g5) and
  avoiding kernel type names (fix:snapshot-nomen-collision).
- **ARIA/validation contract**: accessible names (labels/aria-label),
  `aria-invalid` true/false surface, `aria-describedby` → the error
  identity; the live-region policy extends the Stage 3 §1.5 pattern —
  announce on a validation-state change, silent on no-op. Keyboard contract:
  native field semantics (input/checkbox/select are natively focusable); the
  form-level focus-move/validation behavior belongs to the app-typed plan.
- **Token surface**: namespaced `form.*` paths (e.g. `form.field.invalid`,
  `form.field.valid`, `form.focus` — exact paths the Hand's, probed),
  exposed as zero-arg accessors returning a **local token carrier class**
  (the `Scopulus` precedent — consumers read fields on the call result;
  never a nameable qualified type; never a widened kernel `Scopulum` record).
  Token rendering is the kernel's (`thema_css` → `--form-field-invalid`).
- **Style + assembly surface**: the family's `tela.Stilum`-returning
  bundle(s) keyed on the identities, referencing `var(--form-*)`; the
  package contributes its bundle + its `ordo("formslib", …)` entry
  (dependency declaration) to the consumer's `assemble` (policy (e) input
  shape: package-order map + collected bundles + theme + optional reset).
  Three-package cascade order: extensionlib → formslib → canary-app
  (topological order + stable package-identity tie-break); dedup by stable
  identity; cycles / duplicate-identity-different-content / invalid output
  reject (the Stage 2 fail-closed contract re-asserted).
- **Behavior boundary (D1, recorded)**: the proof package owns the components'
  documented event/identity/validation **contract** (event names, identity
  scheme, ARIA/validation semantics, live-region policy) + the pure-level
  proof; the **concrete message-typed plan is app-typed in the consumer**
  (the Stage 3 U3 pattern — generic user-type construction is blocked, D1;
  never kernel-generic). Consumers read effect keys through
  `tela.effectus_identitas` (fix:sem001 — the kernel owns the only `Effectus`
  matcher).
- **Non-gated consumability posture (landed G4 evidence)**: tokens + styles +
  assembly input resolve from the consumer today; the component family +
  behavior are self-proven in the package until g4 lands; the consumer's
  cross-package family composition stays behind the documented
  compose-without workaround (the Stage 1 `bar_metrum_app` precedent — the
  package keeps its seam, the app composes the same DOM shape with tela
  constructors). U6/U7 remove the workaround when the fixes land.
- **The gated interactive proof (CTO10-3)**: real `importa ex "web:dom"` (the
  en→la provider seam — cds-u5's removal predicate), the `tela:browser`
  lifecycle exported + consumable (cds-u6's removal predicate), the forms
  components composed through normal qualified imports, and the scripted
  interaction sequence run against the **documented faber-web host binding**
  (`faber-web/runtime/dom.ts` + the WEB5 fixture precedent
  `examples/browser-app/tests/fake-dom.mjs`/`web-shim-dom.js` — the host
  side's own `webDom*` binding, read-only). Synchronous-only, scripted,
  deterministic — never a racy timing test; the dom-shim is NOT reused for
  this claim.
- **Seam restoration (U6, gated)**: when the radix fixes land, the
  browser.fab seam flips from the opaque `Scope` handle to the real
  `dom.Scope` (the spec-locked shape, browser-lifecycle.md §1) and the
  `fix:web-dom-locale`/`fix:g4` markers are removed at the sites where the
  fixes apply — the CTO-5 removal predicates executed in the tela repo. This
  is a workaround removal (radix-fix integration), never a framework
  modification.
- **Determinism posture**: determinism applies to static/mount-time
  serialization only; the three-package composition double-builds
  byte-identical (fail-closed); the interaction sequence is a scripted
  deterministic assertion sequence. R2 note restated (when CODEGEN001 lands,
  the Rust-lane capture must equal the TS-lane capture).
- **No `tela/spike/` writes** (frozen Stage 0 evidence — the Stage 3
  convention carried).

---

## Goal-check Summary (goal-check on the Stage 4 campaign section)

- **Artifact reviewed**: `tela/docs/factory/mvp/CAMPAIGN.md` § "Stage 4 —
  Independent Extension Package Proof" (lines 304–320) + the Stage 4
  references (line 185, line 766) + the governing invariant + the extension
  contract §9, with the Stage 3 closeout's recorded CTO10-3 gate conditions
  and the landed Stage 3 surface.
- **Evaluator mode**: self-contained cold pass (planner-1, the lowerer, also
  the checker — single-lane planning; the independent pass remains the
  auditor's at the stage closeout).
- **Intended next consumer**: `delivery` lowering (this spec) → `factory`
  (Mind files Hand units citing delivery unit ids).
- **Handoff bar used**: campaign delivery readiness — the gate must be
  specific, grounded, architecturally decided, bounded, and testable enough
  that a mid-tier implementing Hand can execute units without inventing scope.
- **Verdict**: **READY**.
- **Reasoning**: The gate's single sentence (a separate package adds a
  component family, styles, namespaced theme tokens, behavior, product
  assembly input, and tests without modifying Tela/faber-web/faber/Radix) is
  decomposed by the campaign extension contract §9 (the conformant-library
  steps) + the Stage 0 two-package canary (the package-boundary machinery) +
  the landed Stage 1/2/3 surfaces (the kernel constructors, the assembly
  contract, the token/bundle seams, the behavior-plan pattern) into concrete
  unit surfaces. The one genuinely open architectural item — the interactive
  proof's provider seam — is **already recorded, not open**: CTO10-3 names
  the two hard conditions (web-dom-locale + g4) and the non-blockers; this
  delivery resolves the *execution* question with the entry-gate split (the
  non-interactive proof is not gated; the interactive claim is a gated
  unit pair with named CTO-5 escalation + removal predicates). The
  non-gated surfaces have grounded evidence for today's consumability split
  (stage-1-benchmark-static.md §3). No material boundary, stop condition, or
  acceptance criterion is missing. The open items at check time (family
  choice, package placement, gated runtime vehicle, seam-removal ownership)
  are **non-blocking** because this delivery locks defaults for each
  (Open Questions for Mind carries only the ones needing Mind's word).
- **Key points**:
  - Gate → surface mapping is 1:1 (component family → U2; styles + tokens +
    assembly input → U3; behavior → U4 (+ U7 gated); tests → U5; the
    interactive claim → U6/U7 gated).
  - The recorded CTO10-3 gate is honored, not softened: the dom-shim is
    never reused for the interactive claim; the gated units re-verify the
    removal predicates against live radix before executing.
  - The overlap rule is a hard gate: the proof package depends on Tela
    public modules only; the only tela src delta is the gated workaround
    removal restoring the spec-locked seam.
  - Validation for every bullet is named (check + lanes + exempla node gate
    + assembly assertions + determinism double-build + the gated interaction
    gate) — testable without hidden chat context.

---

## Repo-Aware Baseline

Verified by planner-1 (2026-08-09):

- **`tela/`** — sibling git repo on `main`, clean at `f0e6377` (Stage 3
  acceptance flip). Contents (all Stage 0/1/2/3-landed, commit-verified):
  `faber.toml` (package `tela`, provider `tela`, `kind = "lib"`, targets
  `rust`+`ts`, locale `en`); `src/tela.fab` (the flat kernel: `Visus`/
  `Attributum`/`Proprietas`/`Identitas`/`Spatium`, `html_visus`/`css`
  serializers, `Stilum`/`Regula`/`Declaratio`/`Codicillus`/`Ordo`/`assemble`,
  `Scopulum`/`Thema`/`thema_css`/`thema_stilum`, the behavior carriers
  `Eventum`/`union Effectus`/`Renovatio` + `effectus_identitas`); `src/valida.fab`;
  `src/browser.fab` (the pinned seam call shape with the opaque `Scope`
  fallback carrier — `fix:web-dom-locale`; the G4-safe hydration policy fns;
  `focus_tenet`/`focus_optata`); `exempla/` (validation, serializer, thema,
  assemble, behavior, browser); `scripta/` (`check-compile`, `check-exempla`,
  `check-mount`, `check-determinism`, `dom-shim.ts`); `docs/design/`
  (`identity-hydration.md`, `theme-protocol.md`, `browser-lifecycle.md`);
  `AGENTS.md`; `proof/benchmark/` (`extension-lib/`, `canary-app/`,
  `libhome/` — symlinks `tela → ../../..`, `extensionlib → ../extension-lib`);
  `docs/factory/mvp/` (campaign + stage-0/1/2/3 records); `spike/` (frozen
  Stage 0 evidence — no unit writes); `build/` (gitignored evidence).
- **The extension seam the proof consumes (landed, commit-verified)** — the
  two-package benchmark (extension-lib + canary-app under the libhome), the
  kernel assembly surface (`assemble`/`codicillus`/`ordo` — the two-package
  cascade in `main.fab`), the token/bundle seams (the `Scopulus` local-carrier
  accessor pattern + `Stilum`-returning bundles), the `data-tela` identity
  seam, the behavior-plan pattern (the app-typed `union Nuntius`/`class
  Vinculum`/`update_controlli`/`nuntius_clavis`/`annuntium` in `main.fab`),
  the dom-shim harness family (`parseFragment`/`executeMountPlan`/
  `bindRegionSubscriptions`/`executeMountProof`), the interaction gate
  (`check-mount` — node exit 0), the determinism gate (sha
  `77516916…e5490`).
- **G4 consumability split (the non-gated posture's evidence)** —
  `stage-1-benchmark-static.md` §3: `ext.bar_metrum(...)` (`→ tela.Visus`,
  union-returning) → `WARN014.file_interface_export_skipped` (not resolvable
  from the app; the app composes with tela constructors — the recorded
  compose-without workaround); `ext.chart_stilum()` (`→ tela.Stilum`,
  class-returning) and `ext.chart_axis_muted()` (local class) **resolve**.
  Stage 3: the pinned seam fns `mount`/`replace` (imported `tela` union types
  in signatures) are export-skipped — the G4-safe policy fns (string/list
  signatures) stay exported; the harness consumes the emitted fns directly at
  runtime.
- **Host seam (faber-web, read-only)** — `faber-web/src/dom.fab` (provider
  `web`, `[reader] locale = "la"`, `[build] targets = ["ts"]`);
  `faber-web/runtime/dom.ts` binds the `webDom*` symbols;
  `bindings/ts.toml` maps routes → runtime symbols; the proven consumption
  path is the la dialect (the WEB5 fixture `examples/browser-app/` — the
  host-side `web-shim-dom.js`/`fake-dom.mjs` binding precedent). The en→la
  cross-package path is **blocked on in-tree radix 0.80.0** (`fix:
  web-dom-locale`, the browser.fab header probe matrix) — the gated U6/U7
  consume it only after cds-u5 lands.
- **Radix defect sprint (CTO-5, the interactive gate's delivery path)** —
  `radix/docs/factory/compiler-defect-sprint/goal.md` + the delivery:
  **`cds-u5-provider-locale`** (S1, P0, wave 2) delivers `fix:web-dom-locale`
  + `fix:codegen001`; **`cds-u6-file-interface-exports`** (S2, P0, wave 3)
  delivers `fix:g4` + `fix:snapshot-nomen-collision`. Removal predicates
  (cds delivery): after cds-u5 — an en-locale module imports the la-locale
  provider cleanly; the browser.fab seam flips to `dom.Scope`. After cds-u6
  — a `fn → tela.Visus`-shaped export appears in the snapshot (WARN014
  gone); the browser.fab seam fns export. The Stage 4 gated units re-verify
  these against live radix before executing (never assume).
- **Harness mechanics (Stage 1/2/3)** — `check-exempla`: radix check every
  tela exempla; TS emit + assemble per wiring case; `tsc --noEmit`; **node**
  runtime gate (assertions execute). `check-mount`: the scripted interaction
  gate (fail-closed). `check-determinism`: Rust primary path attempted +
  CODEGEN001 recorded; TS-lane double-build + byte-compare + sha256 →
  `build/hashes.txt`. The proof package's test surface is a **new** wiring
  surface (`check-forms-proof`, U5) — the tela exempla wiring is untouched.
- **Radix binary** — in-tree `radix/target/debug/radix` (0.80.0); `--locale
  en`; exempla-mode `+++` frontmatter (term/kind/category/locale).
- **Cargo discipline** — no workspace cargo suites in any unit; Rust-lane
  checks in scratch dirs outside the shared workspace (`/tmp/…`). Full radix
  ladder stages 4–6 / `--e2e` remain auditor-owned.
- **Concurrent workers** — none expected inside `tela/` during Stage 4
  (this stage owns the repo; Stages 1–3 are closed). `faber-web` and
  `examples` are read-only here (host consumed, not extended).
- **Speculum overlap rule** — unchanged: `faberlang.dev`'s `document_ir.fab`
  is not a copy source (Stage 7 migrates through public `tela:*` imports).

---

## Coordination Constraints (record, don't invent)

1. **D3 — CAMPAIGN.md stage-line + acceptance flip (closeout-owned, carried
   from Stages 1/2/3)**: the Stage 4 stage-line status update AND the
   leading-clause evolution AND the acceptance flip are owned by the
   **Mind-routed Stage 4 closeout** (workflow step 6: consequences +
   correctness + independent audit), not by any unit in this spec. Every unit
   leaves `CAMPAIGN.md` untouched. The factory README regeneration happens at
   doc-creation time (this planning commit) and again at the closeout (for
   the evidence records).
2. **The entry-gate split (CTO10-3, recorded — the delivery's spine)**: the
   non-interactive proof surfaces (U1–U5) proceed on the landed Stage 3
   surface, NOT gated on web-dom-locale/G4. The interactive-claim units (U6,
   U7) carry the recorded gate and execute ONLY when both `fix:web-dom-locale`
   + `fix:g4` land (re-verified against live radix — never assumed); the
   CTO-5 units that deliver them are named (§Escalation Path) with their
   removal predicates. **The dom-shim harness is never reused to claim the
   interactive proof** (the shim = assembled-source/runtime proof, not
   provider-seam proof — CTO9-3/CTO10-3). If either fix has not landed when
   the non-gated units finish, U6/U7 sit gated (recorded) — the non-
   interactive evidence stands on its own; the stage closeout records the
   gate status honestly.
3. **The overlap rule is a hard gate**: the proof package depends ONLY on Tela
   public modules (`tela:tela`; `tela:browser` only if a surface needs it —
   default no) + documented faber-web host seams. No Tela/faber-web/faber/
   radix modification by the proof package. The only tela `src/` delta in
   Stage 4 is U6's workaround-removal (the CTO-5 removal predicate restoring
   the spec-locked seam) — a radix-fix integration, not a framework
   modification (recorded; §Open Questions Q4 for Mind's word).
4. **The G4 consumability split is the non-gated posture's evidence** —
   union-returning exports are WARN014-skipped today; class-returning +
   local-class accessors resolve. The proof package's component fns (union-
   returning) keep their seam; the consumer composes-without until g4 lands
   (the Stage 1 `bar_metrum_app` precedent — never a duplicated `Visus` IN
   the package, never a weakened contract). U7 composes through normal
   imports after the fix.
5. **Fire-9 batch norm — enumerate the consumers + prove the package test
   surface green at each unit boundary, or flag honestly.** Stage 4's
   consumers: (1) the proof package itself (consumer of tela public modules),
   (2) the consumer app (`canary-app`), (3) the check harnesses
   (`check-forms-proof` new; `check-exempla`/`check-mount`/`check-determinism`
   where the composition feeds them). Each unit validates with the narrowest
   check that falsifies its change AND keeps the affected consumer surfaces
   green (or records the honest exception — e.g. `check-determinism` RED
   between U3 and U5, sha supersession). The official full-surface run is the
   U5 close and the stage closeout, exactly once.
6. **D1 generic-construction block persists** — the concrete behavior plan
   (message types + Vinculum-shaped bindings) is app-typed in the consumer
   (U4/U7), mirroring the Stage 3 U3 pattern; the proof package owns the
   non-generic contract surface only. Branch A re-spike is a campaign option
   gated on D1 landing — never a mid-stage switch.
7. **Escalation path — radix-lane defects**: web-dom-locale, g4, sem001,
   prim-nullable, codegen001, g5, ts-emitter, snapshot-nomen-collision are
   radix-lane work (the CTO-5 units for web-dom-locale/g4/snapshot-nomen-
   collision are named in §Escalation Path; repros under `tela/spike/
   defects/` where applicable). Stage 4 units apply the recorded workarounds
   with `fix:<id>` markers; removal = grep-replace after each radix fix (the
   gated units execute the removal predicates). Never weaken the Tela
   contract.
8. **Faber-web + examples are read-only in Stage 4** — the host seam is
   consumed through documented bindings (`faber-web/runtime/dom.ts`,
   `bindings/ts.toml`, the WEB5 fixture precedent); `examples/browser-app`'s
   `fake-dom.mjs`/`web-shim-dom.js` are the host-side binding *precedent*,
   not a copy source (U7's harness may mirror the pattern in the tela
   scripta/ as a host binding fixture — never a tela-side re-implementation
   of the `webDom*` surface for the interactive claim).
9. **Determinism sha supersession is recorded, not a failure** — the
   canary-app composition gains the forms package (U3), superseding the Stage
   3 sha (`77516916…e5490`); `check-determinism` is RED between U3 and U5;
   U5 re-records the official sha. Determinism applies to static/mount-time
   serialization only; interactive state is time-variant (recorded).
10. **Synchronous-only boundary** (the routed async-gap input, carried from
    Stage 3): no `@ futura`, no `dom.fetch_text`, no fetch-driven/async
    update claim in any Stage 4 proof; the interaction sequence is a scripted
    deterministic assertion sequence.

---

## Ordered Unit Graph

```
Wave 1:  U1 discovery-seam-probe (docs: stage-4-discovery.md — identity freeze,
         consumer enumeration, CTO10-3 gate-status re-verification)
Wave 2:  U2 component-family (proof/extension-forms scaffold + src/forms.fab
         family static + exempla + libhome alias)
Wave 3:  U3 tokens-styles-assembly (forms.fab extend: form.* tokens + style
         bundles + assembly input; canary-app main.fab extend: three-package
         cascade + assertions)
Wave 4:  U4 behavior-semantics (forms.fab extend: the contract surface;
         main.fab extend: the app-typed plan + pure proof)
Wave 5:  U5 tests-harness-determinism (check-forms-proof + check-determinism
         extend + stage-4-extension-proof.md evidence)
Wave 6:  U6 seam-restoration — GATED on cds-u5 + cds-u6 (browser.fab seam
         flips to dom.Scope; fix:web-dom-locale/fix:g4 removal predicates)
Wave 7:  U7 interactive-provider-seam — GATED on U6 (real web:dom import +
         exported tela:browser + forms composed via normal imports + the
         scripted interaction gate vs the host binding + evidence)
```

Shared-file constraints: the proof package's flat single module
`proof/extension-forms/src/forms.fab` is written by U2, extended by U3, then
U4 — **strictly sequential** (the flat single-module G4-safe shape: one file
owns the package's public surface). The consumer `proof/benchmark/canary-app/
src/main.fab` is extended by U3, then U4, then U7 — strictly sequential.
`src/browser.fab` is touched by **U6 only** (workaround removal). Harnesses
(`scripta/`) are extended by U5 (and U7 may extend the interactive harness).
Docs (`docs/factory/mvp/`, `docs/design/`) are written by U1 (discovery),
U5 (evidence), U6 (browser-lifecycle reconciliation), U7 (interactive
evidence). **No unit overlaps another unit's write_scope.** Waves 2–5 are
sequential by file ownership (the flat module + the shared consumer); Mind
may serialize further if slot capacity prefers. Waves 6–7 are the gated
interactive-claim workstream — they run only when the CTO10-3 gate opens.

| # | Unit | Wave | Depends on |
|---|---|---|---|
| U1 | `tela-s4-u1-discovery-seam-probe` | 1 | none (Stage 3 landed baseline) |
| U2 | `tela-s4-u2-component-family` | 2 | U1 |
| U3 | `tela-s4-u3-tokens-styles-assembly` | 3 | U2 |
| U4 | `tela-s4-u4-behavior-semantics` | 4 | U3 |
| U5 | `tela-s4-u5-tests-harness-determinism` | 5 | U4 |
| U6 | `tela-s4-u6-seam-restoration` | 6 (GATED) | U5; cds-u5 + cds-u6 landed (re-verified live) |
| U7 | `tela-s4-u7-interactive-provider-seam` | 7 (GATED) | U6 |

---

## Units

### U1 — `tela-s4-u1-discovery-seam-probe`

| Field | Value |
|---|---|
| `id` | `tela-s4-u1-discovery-seam-probe` |
| `outcome` | The discovery-first gate: the proof-package identity + family choice locked (default forms), the consumers + package-test surface enumerated (fire-9 norm), the CTO10-3 gate status **re-verified against live radix** (the removal predicates checked, never assumed), the entry-gate split frozen, and the authoring-surface probe recorded — all in a docs-only discovery record. |
| `write_scope` | `tela/docs/factory/mvp/stage-4-discovery.md` (new) |
| `read_scope` | `CAMPAIGN.md` (Stage 4 section lines 304–320; the governing invariant; the extension contract §9; Open Question 6 line 766; line 185; the batching table); `stage-3-closeout.md` §6 (CTO10-3 recorded conditions); `stage-0-canary.md`; `stage-1-benchmark-static.md` §3 (the G4 consumability split); `docs/design/browser-lifecycle.md` §1/§7/§11; the landed `src/tela.fab` + `src/browser.fab`; `radix/docs/factory/compiler-defect-sprint/goal.md` + the delivery (the CTO-5 units + removal predicates) |
| `done_when` | (a) **Identity frozen**: directory `proof/extension-forms/`, package/provider `formslib`, `kind = "lib"`, locale `en`, flat single module `src/forms.fab`, libhome alias `formslib → ../../extension-forms`; family default = **forms** (field/checkbox/select + error + live-region association) with the rationale (campaign §5's named namespaced-token example `form.field.invalid`; the strongest interactive-behavior stress test for the CTO10-3 seam; feeds Stage 5's field/form gate) and the alternatives recorded (charts, documentation-layout — campaign Open Question 6). (b) **Consumers enumerated (fire-9)**: the proof package (consumer of tela public modules), the consumer app `canary-app`, and the check harnesses (`check-forms-proof` new; `check-exempla`/`check-mount`/`check-determinism` where the composition feeds them); the per-unit-boundary package-test-surface rule recorded (each unit proves the affected surface green or flags honestly). (c) **Entry-gate split frozen**: the non-interactive surfaces (family static, styles, tokens, assembly input, tests, pure behavior) proceed on the landed Stage 3 surface; the interactive-claim surfaces (real en→la `web:dom` import + exported `tela:browser` consumable through the normal package interface + cross-package family composition) are GATED (CTO10-3); the dom-shim-is-not-the-interactive-proof statement recorded. (d) **Gate status re-verified live**: re-attempt the browser.fab probe matrix (en→la `web:dom` at real use — call sites, construction, class-field types) + the WARN014 export-consumability probe (a `→ tela.Visus`-shaped export from a consumer); record whether cds-u5 (provider-locale) / cds-u6 (file-interface-exports) have landed; record their removal predicates verbatim (from the cds delivery). (e) **Dependency boundary verified**: the proof package depends on `tela:tela` only (default) + documented faber-web host seams at most; the overlap rule restated (no Tela/faber-web/faber/radix edits by the proof package). (f) The discovery record documents the authoring-surface constraints: the G4 consumability split, the local-carrier token pattern, the exempla-mode mechanics for a separate package (probed), the `fix:snapshot-nomen-collision` naming rule (new identifiers avoid kernel type names), the G5 probe discipline, the `fix:<id>` marker inventory for Stage 4. (g) `git diff --check` in `tela/`. |
| `validation` | No cargo. In-tree radix probes (check + emit attempts) recorded in the discovery record; `git diff --check`. Reviewer cross-check: identity freeze vs the campaign naming + the entry-gate split vs CTO10-3 (stage-3-closeout.md §6). |
| `depends_on` | none (Stage 3 landed baseline) |
| `non_goals` | No product code. No package scaffold (U2). No tokens/styles/assembly (U3). No behavior (U4). No harness (U5). No seam changes (U6, gated). No interactive proof (U7, gated). No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Low–Medium.** Docs + probes only; the one open risk is the CTO10-3 gate status shifting when cds units land — the unit re-verifies, never assumes. |
| `est_work_tokens` | 3–5k |
| `test_owner` | Unit Hand (probes + record); reviewer (split + identity cross-check vs CTO10-3 + the campaign). |

### U2 — `tela-s4-u2-component-family`

| Field | Value |
|---|---|
| `id` | `tela-s4-u2-component-family` |
| `outcome` | The proof package exists and defines the forms family's **static half**: ordinary Faber component functions over typed props → `tela.Visus` with stable `data-tela` identities, the ARIA contract, and the declared keyboard/validation structure — each rendering deterministically through `tela.html_visus` (byte-exact assertions in the package's exempla/test surface). The package passes check + lanes under the benchmark libhome. |
| `write_scope` | `tela/proof/extension-forms/faber.toml` (new — package/provider `formslib`, `kind = "lib"`, `targets = ["rust", "ts"]`, locale `en`); `tela/proof/extension-forms/src/forms.fab` (new — the family: field (text input), checkbox, select, + the error/live-region association; the identity scheme + ARIA/kbd contract; all over tela public constructors, flat single module — the G4-safe shape); `tela/proof/extension-forms/exempla/forms.fab` (new — exempla-mode tests asserting the exact static bytes + ARIA structure); `tela/proof/benchmark/libhome/formslib` (new symlink → `../../extension-forms`) |
| `read_scope` | U1 discovery record (identity freeze + authoring constraints); `CAMPAIGN.md` §3 (component contract) + §8 (accessibility contract) + §9 (extension contract) + the Stage 4 gate; `stage-0-canary.md` (authoring constraints — G1/G2/G3 workarounds); `stage-1-benchmark-static.md` §3 (the G4 consumability split); `tela/AGENTS.md` (vocabulary policy (b); authoring constraints); the landed kernel surface (`src/tela.fab` — constructors, serializer emission order: attributa in author order, then `data-tela`) |
| `done_when` | (a) The package passes `radix check` under the benchmark libhome (`formslib` resolves; the U1-locked identity holds). (b) The family covers the four surface groups: field (text input), checkbox, select, and the error/live-region association — each an ordinary component fn over typed props → `tela.Visus` with stable `form-`-prefixed `data-tela` identities, accessible names (labels/aria-label), the `aria-invalid` true/false surface, and `aria-describedby` → the error identity (campaign §8); the keyboard/validation structure declared (native field semantics; the form-level focus-move contract belongs to the app-typed plan — U4). (c) Each component renders deterministically through `tela.html_visus`; the exempla assert the exact bytes (serializer emission order: attributa in author order, then `data-tela`) + the ARIA structure — fail-closed. (d) The G4 consumability status recorded per export: the union-returning component fns are WARN014-skipped for consumers today — the package KEEPS its seam (never a duplicated `Visus` in the package); the consumer's cross-package composition stays behind the documented compose-without workaround until g4 lands (recorded in the module header). (e) New identifiers probed collision-free (fix:g5 — a colliding verb is escalated, never silently renamed); no identifier collides with kernel type names (fix:snapshot-nomen-collision). (f) The libhome alias works (the app-side import probe: a minimal consumer import of `formslib:forms` resolves — the tokens/bundles consumption is U3's; this probe proves the package boundary). (g) `git diff --check` in `tela/`. |
| `validation` | `radix check` on the package (benchmark libhome); TS lane emit + assemble + `tsc --noEmit`; the exempla assembled + run under `node` (assertions execute — the runtime gate); a minimal consumer import probe; `git diff --check`. Narrow — the official harness wiring is U5 (fire-9 per-boundary rule). |
| `depends_on` | U1 |
| `non_goals` | No styles/tokens/assembly input (U3). No behavior plan (U4). No harness wiring (U5). No seam changes (U6). No interactive proof (U7). No `extension-lib` edits. No framework edits. No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Medium.** The exempla-mode mechanics for a separate package are probed in U1 and exercised here; the G4 skip on union-returning exports is recorded (not a blocker — the package self-proves statically); identifier collisions (probe + escalate, the G5/G6 rule). |
| `est_work_tokens` | 6–10k |
| `test_owner` | Unit Hand (exempla + lanes + import probe); reviewer (family-vs-extension-contract-§9 cross-check). |

### U3 — `tela-s4-u3-tokens-styles-assembly`

| Field | Value |
|---|---|
| `id` | `tela-s4-u3-tokens-styles-assembly` |
| `outcome` | The forms package adds the namespaced `form.*` theme tokens (local-carrier accessors — consumable today), the family's component style bundles (Stilum-returning — consumable today), and the product assembly input (bundle + package-identity entry) — consumed by the canary-app's `assemble` in a **three-package cascade** (extensionlib → formslib → canary-app) with ordering, dedup, and fail-closed assertions. |
| `write_scope` | `tela/proof/extension-forms/src/forms.fab` (extend — the namespaced `form.*` tokens via the local token-carrier class + zero-arg accessors (the `Scopulus` pattern), the component style bundles keyed on the family's `data-tela` identities referencing `var(--form-*)`, the assembly-input surface); `tela/proof/benchmark/canary-app/src/main.fab` (extend — import `formslib:forms`, compose the forms tokens + bundle into the themes + the `assemble` call (the three-package ordo + bundles), the ordering/dedup/fail-closed assertions, the static-render runner output extended) |
| `read_scope` | `CAMPAIGN.md` §4 (style protocol) + §5 (theme protocol — namespaced tokens; `form.field.invalid` as the example) + the Stage 2 gate (assembly ordering); `stage-2-delivery.md`/`stage-2-closeout.md` + `docs/design/theme-protocol.md` (assembly input shape (policy (e)): package-order map + collected bundles + theme + optional reset; topological order + stable package-identity tie-break; cycles / duplicate-identity-different-content / invalid output reject); U2 emission; the landed kernel assembly surface + the current `main.fab` assemble call |
| `done_when` | (a) **Namespaced tokens**: `form.*` paths (e.g. `form.field.invalid`, `form.field.valid`, `form.focus` — exact paths the Hand's, probed) exposed as zero-arg accessors returning the local token-carrier class (field access from the consumer — never a nameable qualified type, never a widened kernel theme record). (b) **Style bundles**: the family's `tela.Stilum`-returning bundle(s) keyed on the identities referencing the `--form-*` tokens; class-returning exports resolve from the consumer today (the stage-1 evidence: `→ tela.Stilum` resolves). (c) **Product assembly input**: the package contributes its bundle + its `ordo("formslib", …)` entry to the canary-app's `assemble`; the three-package cascade orders extensionlib → formslib → canary-app (topological order + stable package-identity tie-break); the `:root` token layer includes the `--form-*` values; dedup by stable identity (no repeated bundle text); the Stage 2 fail-closed regressions re-asserted (cycles / duplicate-identity-different-content / invalid output reject). (d) The runner output extends (the composition now renders the forms composition + the forms bundle + the `--form-*` tokens) — the Stage 3 determinism sha (`77516916…e5490`) is **superseded, recorded** (U5 re-records the official sha; `check-determinism` is RED between U3 and U5 — flagged honestly, not a failure). (e) The G4 posture recorded: the consumer's cross-package family composition stays behind compose-without until g4 lands (the seam kept, never weakened — the module header + the evidence carry the note). (f) `git diff --check` in `tela/`. |
| `validation` | `radix check` both packages (benchmark libhome); TS lane + assemble + `tsc --noEmit`; the assembled runner's assembly + ordering + dedup + fail-closed assertions execute under `node` (the runtime gate); `git diff --check`. |
| `depends_on` | U2 |
| `non_goals` | No behavior plan (U4). No harness wiring (U5). No seam changes (U6). No interactive proof (U7). No `extension-lib` edits. No framework edits. No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Medium.** The three-package assembly ordering + dedup assertions ride the proven Stage 2 kernel surface (regression risk low); the runner-output change supersedes the Stage 3 sha (recorded — the honest flag). |
| `est_work_tokens` | 6–10k |
| `test_owner` | Unit Hand (assembly assertions + lanes); reviewer (assembly-ordering cross-check vs the Stage 2 gate + policy (e)). |

### U4 — `tela-s4-u4-behavior-semantics`

| Field | Value |
|---|---|
| `id` | `tela-s4-u4-behavior-semantics` |
| `outcome` | The forms package adds **behavior**: the components' documented event/identity/validation contract (the semantics the consumer's plan relies on) + the pure-level behavior proof — a concrete message type + Vinculum-shaped bindings keyed to the forms identities + update/validation semantics asserted (the D1 app-typed boundary recorded), shared-source (the same components that render statically in U2 carry the behavior contract; the interactive execution is U7, gated). |
| `write_scope` | `tela/proof/extension-forms/src/forms.fab` (extend — the behavior-semantics contract surface: the event-name constants (`"input"`/`"change"`/`"submit"`/`"click"`), the validation-state mapping fns (pure string/bool signatures — G4-safe), the identity/event contract documented in the module header); `tela/proof/benchmark/canary-app/src/main.fab` (extend — the app-typed plan mirroring the Stage 3 U3 pattern: a concrete message type + Vinculum-shaped bindings keyed to the forms identities + update/validation semantics + the pure assertions in `main`) |
| `read_scope` | `CAMPAIGN.md` §8 (accessibility — keyboard, focus, live region) + the Stage 4 gate (behavior); `stage-0-behavior-design.md` (the Branch B plan; the D1 app-typed boundary; §1.5 live-region policy); the Stage 3 U3 plan pattern (`main.fab` — `union Nuntius`/`class Vinculum`/`update_controlli`/`annuntium`); `docs/design/identity-hydration.md` §7 (the binding attach point); U2/U3 emission |
| `done_when` | (a) **The contract documented** (module header + the evidence trail): per component — its event surface (which events it fires on which identities), the identity scheme, the ARIA/validation semantics (`aria-invalid` mapping, `aria-describedby` → the error identity), the live-region policy (announce on a validation-state change, silent on no-op — the Stage 3 §1.5 pattern extended to form validation). (b) **Pure-level behavior proof** (in `main`, app-typed — D1): a concrete message type (field input / checkbox toggle / select change / submit), Vinculum-shaped bindings keyed to the forms identities, update/validation semantics (invalid → `aria-invalid` + error text; valid → cleared; the no-op rule), the assertions green (invoke bindings' closures, the update semantics, the silent-no-op case). (c) **fix:sem001 held** — consumers read effect keys through `tela.effectus_identitas`, never matching an imported union (recorded). (d) **Shared-source statement recorded**: the same components render statically (U2) and carry the behavior contract (this unit); the interactive execution is U7 (gated — the dom-shim is not the interactive claim). (e) `git diff --check` in `tela/`. |
| `validation` | `radix check` both packages (benchmark libhome); TS lane + assemble + `tsc --noEmit`; node — the assembled pure-behavior assertions execute (fail-closed); `git diff --check`. |
| `depends_on` | U3 |
| `non_goals` | No interactive execution (U7, gated). No harness wiring (U5). No seam changes (U6). No kernel-generic plan (D1 — app-typed, recorded). No framework edits. No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Low–Medium.** The app-typed plan pattern is proven (Stage 3 U3); the new surface is the validation semantics + live-region policy extension — asserted at the pure level. |
| `est_work_tokens` | 4–7k |
| `test_owner` | Unit Hand (pure proof + lanes); reviewer (contract vs campaign §8 + behavior-design §1.5). |

### U5 — `tela-s4-u5-tests-harness-determinism`

| Field | Value |
|---|---|
| `id` | `tela-s4-u5-tests-harness-determinism` |
| `outcome` | The package test surface is official (fire-9 norm honored): a new `check-forms-proof` harness validates the proof package (check + lanes + node exempla gate) + the consumer assembly; `check-determinism` extends to the three-package composition and re-records the sha (superseding `77516916…e5490`); the full tela package test surface runs green once at this boundary; the evidence is on disk. |
| `write_scope` | `tela/scripta/check-forms-proof` (new — the fire-9 harness: `radix check` the proof package + the consumer under the benchmark libhome; TS emit + assemble + `tsc --noEmit`; node — the package exempla assertions + the assembly assertions execute, fail-closed); `tela/scripta/check-determinism` (extend — the double-build input is now the three-package composition (the U3-extended runner output); Rust primary path attempted + `fix:codegen001` recorded; the R2 note restated); `tela/docs/factory/mvp/stage-4-extension-proof.md` (new evidence record — the package test surface runs, the assembly ordering evidence, the new determinism sha, the fire-9 consumer enumeration confirmation) |
| `read_scope` | the U2–U4 emission; the existing harness mechanics (`check-exempla`/`check-mount`/`check-determinism` — the strip + namespace-binding + wiring-case patterns); `stage-3-mount-determinism.md` (the sha + lane records + the R2 note); `stage-1-benchmark-static.md` (the composition evidence pattern) |
| `done_when` | (a) **`check-forms-proof` green**: the proof package's exempla run (check + TS lane + node — the runtime gate, fail-closed); the consumer's assembly + ordering + dedup + fail-closed assertions run under node; any failure or non-zero exit FAILS the check. (b) **`check-determinism` re-recorded**: the three-package composition double-builds byte-identical (the new sha in `build/hashes.txt` — superseding `77516916…e5490`, recorded); determinism applies to static/mount-time serialization only (recorded); the Rust primary path attempted + `fix:codegen001` recorded; the R2 note restated. (c) **The full tela package surface green once at this boundary**: `check-compile` + `check-exempla` (Stage 3 wiring unchanged) + `check-mount` (the segmented-control interaction gate still green) + `check-determinism` (new input) + `check-forms-proof`. (d) **Fire-9 honored**: every consumer enumerated in U1 (the proof package, the consumer app, the check harnesses) is exercised or explicitly flagged. (e) The evidence record documents: the package test surface, the assembly ordering, both determinism hashes (superseded + new), the exact commands, cargo discipline (scratch dirs only). (f) `git diff --check` in `tela/`. |
| `validation` | Run the five harnesses once at this boundary; reviewer/auditor re-runs `check-forms-proof` + `check-determinism` as named test owners (the fire-9 norm); `git diff --check`. |
| `depends_on` | U4 |
| `non_goals` | No interactive proof (U7, gated). No real-browser suite. No radix ladder stages 4–6 / `--e2e` / release-gate (auditor-owned). No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Medium.** The determinism sha churn is recorded (supersession — the honest flag); the new harness mechanics mirror the proven `check-mount` assembly (strip + namespace bindings + appended driver). |
| `est_work_tokens` | 5–8k |
| `test_owner` | Unit Hand (harness runs); closeout auditor (re-runs). |

### U6 — `tela-s4-u6-seam-restoration` (GATED — the CTO10-3 interactive-claim workstream)

| Field | Value |
|---|---|
| `id` | `tela-s4-u6-seam-restoration` |
| `outcome` | The interactive seam is restored to its **spec-locked shape** once the radix fixes land: the browser.fab seam flips from the opaque `Scope` handle to the real `dom.Scope`, the `fix:web-dom-locale`/`fix:g4` workaround markers are removed at the sites where the fixes apply, and the exported `tela:browser` lifecycle (mount/replace) + a `→ tela.Visus` export from the proof package are verified consumable through the normal package interface. This is the **radix-fix integration** (the CTO-5 removal predicates executed in the tela repo) — a workaround removal restoring the locked shape, never a Stage-4 framework modification. |
| `write_scope` | `tela/src/browser.fab` (workaround-removal only — the seam flips to `dom.Scope`; the module consumes `web:dom` through the documented host seam; the opaque fallback carriers/notes removed; `fix:web-dom-locale`/`fix:g4` markers grep-replaced where the fixes apply); `tela/docs/design/browser-lifecycle.md` (the §1/§7/§11 reconciliation — the seam restores to the spec-locked shape; the marker-inventory rows flip to removed) |
| `read_scope` | the cds delivery (`radix/docs/factory/compiler-defect-sprint/compiler-defect-sprint-delivery.md` — the cds-u5/cds-u6 removal predicates verbatim); `docs/design/browser-lifecycle.md` §1/§7/§11 (the recorded fallback posture to reverse); the landed `src/browser.fab` |
| `done_when` | (a) **Gate (CTO10-3, recorded — re-verified live)**: this unit executes ONLY when BOTH removal predicates hold — cds-u5 (`provider-locale`) landed: an en-locale module importing the la-locale `web:dom` provider passes check + TS emit at real use (the browser.fab probe matrix — call sites, construction, class-field types — green); AND cds-u6 (`file-interface-exports`) landed: a `fn → tela.Visus`-shaped export appears in the export snapshot (WARN014 gone) and the tela:browser seam fns export. If either fix has not landed, the unit records the not-met status and does NOT execute (no weakening, no workaround-replacement). (b) **The seam flips**: `mount(dom.Scope, Visus, Thema)` / `replace(Mounted, Visus)` — the module imports `web:dom` through the documented host seam; the opaque `Scope`/`Radiculum`/`Subscriptio` fallback carriers are removed or reduced to the locked shape; the harness-level-binding notes removed (the dom-shim stays as the node-runtime fixture, but the MODULE no longer depends on the harness to supply its seam). (c) **Markers removed**: `grep -rn 'fix:web-dom-locale'` and `grep -rn 'fix:g4'` find no live site in `tela/src` (the removal predicates); the marker-inventory rows in browser-lifecycle.md flip to removed. (d) **Consumability verified**: `tela.browser.mount`/`replace` + a `→ tela.Visus` export from the proof package appear on the exported file interface and typecheck from a consumer through normal qualified imports (no harness-assembly bypass). (e) **No framework modification**: the flip is a workaround removal restoring the spec-locked shape (browser-lifecycle.md §1), not a contract change. (f) `git diff --check` in `tela/`. |
| `validation` | `radix check` + TS emit on the restored browser.fab; a minimal consumer import probe (mount/replace consumable through normal qualified imports); the grep-replace verification; `git diff --check`. |
| `depends_on` | U5; cds-u5 + cds-u6 landed (re-verified against live radix — never assumed) |
| `non_goals` | No interactive proof (U7). No other `src/` changes beyond the workaround removal. No `CAMPAIGN.md` edits. No radix-lane fixes (the fixes are the cds units' work). No real-browser driver. |
| `risk` | **Medium–High (gated)**. The seam flip is the reversal of the recorded fallback — the spec-locked shape is documented (browser-lifecycle.md §1), so the reversal is deterministic; the residual risk is the fixes' exact semantics at the site — re-verify + record, never assume. |
| `est_work_tokens` | 4–6k |
| `test_owner` | Unit Hand (restoration + probes); reviewer (seam-pin vs browser-lifecycle.md §1 + the cds removal predicates). |

### U7 — `tela-s4-u7-interactive-provider-seam` (GATED — the CTO10-3 interactive-claim workstream)

| Field | Value |
|---|---|
| `id` | `tela-s4-u7-interactive-provider-seam` |
| `outcome` | The campaign gate's interactive half through the **real provider seam** (the CTO10-3 proof): the canary-app imports `web:dom` (real en→la) + `tela:browser` (exported, consumable) + the forms components (composed through normal qualified imports — no compose-without, no harness-assembly bypass, no tela-side shim), mounts a forms composition, and executes the scripted interaction sequence (field input → message → model → replace; checkbox toggle; select change; validation `aria-invalid` + error text; focus behavior; live-region announcement on validation change; dispose) against the documented faber-web host binding — proving the provider seam end-to-end. |
| `write_scope` | `tela/proof/benchmark/canary-app/src/main.fab` (extend — the real `web:dom` import + the normal-import composition of the forms components + the `tela.browser.mount`/`replace` consumption + the interactive runner mode); `tela/scripta/check-forms-proof` (extend — the interactive gate: assemble the real-import composition + the host binding fixture + the scripted sequence under node, fail-closed) or a new `tela/scripta/check-forms-interactive`; `tela/docs/factory/mvp/stage-4-interactive.md` (new evidence record); `tela/proof/benchmark/libhome/web` (symlink → `../../../faber-web` if the benchmark libhome shadows provider resolution — probe) |
| `read_scope` | `docs/design/browser-lifecycle.md` (the restored seam, post-U6); the cds delivery (removal predicates); the U4 behavior contract + the U2–U4 emission; `faber-web/src/dom.fab` + `faber-web/runtime/dom.ts` + `faber-web/bindings/ts.toml` + the WEB5 fixture precedent `examples/browser-app/tests/fake-dom.mjs`/`web-shim-dom.js` (the documented host binding, read-only) |
| `done_when` | (a) **Gate (CTO10-3, recorded — re-verified live)**: executes ONLY when both fixes landed AND U6 restored the seam (re-verified, never assumed). (b) The app imports `web:dom` (en→la, real) + `tela:browser` + the forms package through the NORMAL package interface; no harness-assembly namespace binding for these imports (the recorded fallbacks are gone). (c) A forms composition mounts through `tela.browser.mount(...)` (exported, consumable — the cds-u6 condition exercised) with a real `web:dom` scope (the cds-u5 condition exercised); the mount returns a `Mounted` plan; hydration attaches to matching `data-tela` nodes. (d) The interaction sequence (scripted, deterministic, **synchronous-only** — the async-gap boundary held): field input → message → update → `replace`; checkbox toggle flips `aria-checked`; select change updates the model; a validation transition flips `aria-invalid` + writes the error text + announces the live region (once, silent on no-op); a replace across the region restores focus by identity + declares the scroll anchor; dispose unsubscribes (a post-dispose dispatch no-ops). Every assertion executes under node — fail-closed. (e) The host binding is the **documented faber-web host seam** (the runtime binding + the WEB5 fixture precedent) — never a tela-side re-implementation of the `webDom*` surface; the Stage 3 dom-shim is NOT reused for this claim (it remains the Stage 3 fixture — CTO9-3/CTO10-3). (f) **The overlap rule held end-to-end**: no Tela/faber-web/faber/radix modification by the proof package; the only tela `src/` delta since Stage 3 is U6's workaround removal. (g) The evidence record documents: the real import chain, the exercised host seams, the scripted sequence + assertions (node exit 0), the synchronous-only boundary, the gate-status verification. (h) `git diff --check` in `tela/`. |
| `validation` | `radix check` + TS emit on the real-import composition; `tsc --noEmit`; node — the scripted interaction gate (fail-closed); the full tela package surface once at the closeout; `git diff --check`. |
| `depends_on` | U6 (gated) |
| `non_goals` | No real-browser driver (deferred — the host binding fixture is the node vehicle; layout/scroll/pointer fidelity beyond the state-level surface stays deferred). No fetch/async claims (the routed gap). No framework edits. No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **High (gate-critical)**. The provider-seam integration is the risk (the fixes' exact semantics at the site — re-verified); the interaction contract is proven at the pure level (U4), so the interactive gate's risk is the seam integration, not the semantics. Fail honestly: a wrong expectation or a real defect fails the gate — fix the source or the assert; an emitter defect escalates. |
| `est_work_tokens` | 8–12k |
| `test_owner` | Unit Hand (interaction runner + checks); reviewer (seam + contract cross-check); closeout auditor (independent interactive-gate re-run). |

---

## Checkpoints And Gates

| Gate | After | Check |
|---|---|---|
| **SG1 — discovery + seam probe** | U1 | Identity frozen (`proof/extension-forms`, provider `formslib`, family default forms); consumers + package test surface enumerated (fire-9); the entry-gate split frozen; the CTO10-3 gate status re-verified against live radix (removal predicates recorded — not assumed); the dependency boundary (overlap rule) verified. |
| **SG2 — component family** | U2 | The package exists and passes check under the libhome; the family (field/checkbox/select + error/live-region) renders deterministically through `html_visus` (byte-exact exempla assertions, fail-closed); ARIA + keyboard/validation structure declared; identifiers probed collision-free (fix:g5) + avoiding kernel type names (fix:snapshot-nomen-collision); the G4 consumability status recorded per export. |
| **SG3 — tokens/styles/assembly** | U3 | Namespaced `form.*` tokens (local-carrier accessors) + the family's style bundles consumable from the consumer today; the three-package cascade orders extensionlib → formslib → canary-app with dedup + the Stage 2 fail-closed regressions green; the Stage 3 determinism sha supersession recorded (check-determinism RED between U3 and U5 — the honest flag). |
| **SG4 — behavior semantics** | U4 | The event/identity/validation contract documented; the app-typed pure behavior proof green under node (D1 recorded); fix:sem001 held (effects read through `effectus_identitas`); the shared-source statement recorded (the interactive execution is U7, gated). |
| **SG5 — tests + harness + determinism** | U5 | `check-forms-proof` green (the package exempla + the assembly assertions, fail-closed); the full tela package surface green once (check-compile + check-exempla + check-mount + check-determinism + check-forms-proof); the three-package determinism double-build re-recorded (byte-identical, new sha); the fire-9 consumer enumeration honored. |
| **SG6 — seam restoration (GATED — CTO10-3)** | U6 | Both removal predicates verified against live radix (cds-u5 + cds-u6 landed) before executing; the browser.fab seam flips to `dom.Scope`; `fix:web-dom-locale`/`fix:g4` grep-replace leaves no live site in tela/src; `tela.browser.mount`/`replace` + a `→ tela.Visus` export consumable through normal qualified imports; no framework modification (workaround removal only). |
| **SG7 — interactive provider-seam (GATED — CTO10-3)** | U7 | The app imports `web:dom` (real en→la) + `tela:browser` + the forms package through the normal package interface; a forms composition mounts through the exported `tela.browser.mount` with a real `web:dom` scope; the scripted interaction sequence (input/checkbox/select/validation/focus/live-region/dispose) executes under node against the documented faber-web host binding — node exit 0, fail-closed; the dom-shim is NOT the interactive claim; the overlap rule held end-to-end. |
| **Stage closeout** | all | Campaign workflow step 6: review shared protocol changes with `consequences`, `correctness`, and an independent audit **before** accepting the stage (audit-before-acceptance held — the Stage 3 precedent). The closeout owns the Stage 4 stage-line status update + the leading-clause evolution + the acceptance flip (decision D3) + the factory README regeneration (the evidence records). The closeout records the CTO10-3 gate status honestly: if the gated units have not executed (fixes not landed), the non-interactive evidence is accepted + the interactive gate is recorded not-met — never softened. |

The Stage 4 gate bullets map to the gates above (component family → SG2;
styles + namespaced tokens → SG3; behavior → SG4 (+ SG7 gated); product
assembly input → SG3 (+ SG5); tests → SG5; the interactive proof → SG6/SG7
gated; the overlap rule → SG1 + every unit's non_goals + SG7).

---

## Validation Summary

| Layer | Command / Flow | Covers |
|---|---|---|
| Package semantics | `radix check` on `proof/extension-forms/src/*.fab` + `proof/benchmark/canary-app/src/main.fab` (`--locale en`, benchmark libhome) | The proof package + the consumer typecheck across the package boundary |
| TS lane | `radix emit -t ts` + assemble + `tsc --noEmit` (proof package + consumer + the real-import composition in U7) | Typed values valid in TypeScript; the proven runtime lane |
| Node runtime gate | The proof package's exempla + the consumer assembly assertions run under `node` (fail-closed) | Package-owned verification (the R1 pattern); static renders + assembly + pure behavior |
| Interactive gate (gated) | `check-forms-proof` extended (U7) — the real-import scripted sequence under `node` with the documented faber-web host binding | The CTO10-3 provider-seam proof (fail-closed); the dom-shim is NOT this claim |
| Determinism | `check-determinism` — the three-package composition built twice, byte-compare (sha256 → `build/hashes.txt`) | Byte-identical static/mount-time serialization (fail-closed); sha supersession recorded; R2 + CODEGEN001 noted |
| Package test surface | `check-compile` + `check-exempla` (Stage 3 wiring unchanged) + `check-mount` (interaction gate) + `check-determinism` + `check-forms-proof` | The tela package test surface (the fire-9 norm — consumers enumerated + exercised at each boundary or flagged) |
| Assembly contract | The three-package cascade assertions (ordering, dedup, fail-closed reject) under `node` | The Stage 2 gate's assembly contract with a third package |
| Rust lane | `radix emit -t rust` + scratch-dir `cargo check` (import-free surfaces only; import-bearing paths attempted + `fix:codegen001` recorded) | Import-free surfaces green; CODEGEN001 recorded; the R2 note |
| Doc hygiene | `git diff --check` in `tela/` | Whitespace/conflict hygiene |
| Cargo discipline | No workspace cargo suites; scratch dirs only | Lock ownership (operator rule 2026-08-07) |
| Radix ladder | Not run by Stage 4 units (tela changes do not touch radix); stages 4–6 / `--e2e` auditor-owned | Boundary: no whole-workspace suites |

---

## Escalation Path (radix-lane defects — recorded, not fixed here; the CTO-5 units named)

| Defect | Marker | CTO-5 delivery | Stage 4 posture | Removal predicate |
|---|---|---|---|---|
| **`web:dom` locale/dialect gap (en→la)** — the en-locale tela module importing the la-locale `web:dom` provider fails provider-module re-analysis (PARSE001/SEM002 at real use — the browser.fab probe matrix) | `fix:web-dom-locale` | **`cds-u5-provider-locale`** (S1, P0, defect-sprint wave 2) — delivers `fix:web-dom-locale` + `fix:codegen001` | Non-gated units record the fallback (never re-author a `web:dom` copy in tela; the dom-shim is the Stage 3 fixture, not the interactive claim). **U6** executes the removal (the seam flips to `dom.Scope`) when the fix lands; **U7** consumes the real seam. Both gated units re-verify the predicate live. | An en-locale module imports the la-locale `web:dom` provider cleanly at real use; `grep -rn 'fix:web-dom-locale'` finds no live site; the browser.fab seam flips to `dom.Scope` |
| **G4 — WARN014 snapshot skip on public signatures referencing imported sibling/union types** (the forms components' `→ tela.Visus` fns; the pinned seam fns `mount`/`replace`) | `fix:g4` | **`cds-u6-file-interface-exports`** (S2, P0, defect-sprint wave 3) — delivers `fix:g4` + `fix:snapshot-nomen-collision` | Non-gated units keep the package's seam + the compose-without workaround (never a duplicated `Visus` in the package, never a weakened contract). **U6** verifies consumability; **U7** composes through normal qualified imports. | A `fn → tela.Visus`-shaped export appears in the snapshot (WARN014 gone); the browser.fab seam fns export; `grep -rn 'fix:g4'` finds no live site |
| **Imported-union matching (G3-family)** — a consumer-side `match` over an imported union's variants does not bind (SEM001.unknown_variant); the kernel owns the only `Effectus` matcher | `fix:sem001` | radix lane (Mind routes) | **NOT a Stage-4 blocker** (recorded) — consumers read effect keys through `tela.effectus_identitas`; removal = grep-replace after the fix | — |
| **Primitive nullable bindings in fn bodies (NEW parser observation)** | `fix:prim-nullable` | radix lane (Mind routes) | **NOT a Stage-4 blocker** (recorded) — null checks against the call + `coalesce ""` hold | — |
| **CODEGEN001 — Rust emit-across-imports / provider-module locale propagation** | `fix:codegen001` | `cds-u5-provider-locale` (same unit as web-dom-locale) | **NOT a Stage-4 blocker** (recorded) — the TS lane is the proven lane; Rust path attempted + recorded; the R2 sha-equality note restated | — |
| **G5/G6 — verb/identifier collisions** | `fix:g5` | radix lane (Mind routes) | New identifiers probed collision-free; a colliding locked verb is escalated, never silently renamed (the `html` → `html_visus` precedent) | — |
| **snapshot-nomen-collision — extension-local class names sharing kernel type names** | `fix:snapshot-nomen-collision` | `cds-u6-file-interface-exports` (same unit as g4) | New identifiers avoid kernel type names (the `Scopulus` precedent); the forms token carrier is a distinct local name | The extension-local rename revert when the fix lands (grep-replace) |
| **TS emitter observations** (elif-chain ternary, backslash double-escape, E0382 move) | `fix:ts-emitter` | radix lane (Mind routes) | Workarounds held; fragile against emitter changes | — |

**The CTO10-3 gate — both fixes, both units, re-verified live.** The
interactive Stage 4 claim (U6 + U7) is gated on **`cds-u5-provider-locale`
AND `cds-u6-file-interface-exports`** both landing (defect-sprint waves 2 +
3, both P0). Neither gated unit executes until the predicates are verified
against live radix (never assumed). The `fix:sem001`/`fix:prim-nullable`/
`fix:codegen001` markers are NOT Stage-4 blockers. Removal after each radix
fix = grep-replace, executed by the gated units' removal predicates.

---

## Open Questions For Mind

| # | Question | Default | Who |
|---|---|---|---|
| Q1 | Component-family choice (campaign Open Question 6, line 766): forms vs charts vs documentation-layout. Forms is recommended — campaign §5 names `form.field.invalid` as the namespaced-token example; it is the strongest interactive/behavior stress test for the CTO10-3 seam (focus, validation, live regions); and it feeds Stage 5's field/form gate directly. Charts would extend the benchmark's `chart.*` tokens + SVG; documentation-layout is static-heavy (thin interactive surface). | **Forms** (`proof/extension-forms/`, provider `formslib`) | Mind (confirm) |
| Q2 | Proof-package placement: `tela/proof/extension-forms/` + the benchmark libhome + the canary-app consumer (one repo, one commit, the Stage 1–3 pattern) vs the `examples/` repo (true repo-boundary independence; cross-repo libhome + commit coordination). The campaign scope table routes extension proofs to "examples or dedicated sibling packages" — a later routing option. | Keep in `tela/proof/` for Stage 4; `examples/` migration is a later routing option (the Stage 3 Q2 precedent) | Mind (confirm) |
| Q3 | Gated interactive runtime vehicle: node + the documented faber-web host binding (`faber-web/runtime/dom.ts` + the WEB5 fixture precedent — real provider seam, no new tooling; real-browser layout/scroll/pointer fidelity stays deferred) vs a real-browser driver (playwright/puppeteer — new tooling, racy, out of the current harness family). | Node + the host binding fixture (the provider seam is the claim, not the browser) | Mind (confirm) |
| Q4 | U6 seam-restoration ownership: the workaround-removal (browser.fab flips to `dom.Scope`; `fix:web-dom-locale`/`fix:g4` grep-replace) executes in the tela repo when the fixes land — the CTO-5 removal predicates; a workaround removal restoring the spec-locked shape, not a framework modification. Confirm the gated U6 owns it (vs a separate radix-integration step routed by Mind). | U6 owns the removal pass (declared write_scope: `src/browser.fab` workaround removal only) | Mind (confirm) |
| Q5 | Consumer composition scope: the canary-app gains the forms composition (superseding the Stage 3 determinism sha — re-recorded in U5) vs keeping the Stage 3 composition stable and adding a separate forms consumer. One consumer app exercising all three packages is the stronger ecosystem proof (assembly ordering across three packages, one runner). | The canary-app gains the forms composition; the sha supersession is recorded + re-recorded | Mind (confirm) |

## Residuals (routed, not Stage 4 work)

- **The interactive Stage 4 claim (U6/U7) remains GATED** on `cds-u5-
  provider-locale` + `cds-u6-file-interface-exports` landing (the CTO10-3
  gate, recorded — `stage-3-closeout.md` §6). The stage closeout accepts the
  non-interactive evidence and records the gate status honestly; the gated
  units re-verify the removal predicates against live radix before executing.
- **Radix-lane fixes** (Mind routes minimized deliveries; removal =
  grep-replace after each fix lands): `fix:web-dom-locale` + `fix:g4`
  (CTO-5: `cds-u5-provider-locale`, `cds-u6-file-interface-exports` — the
  interactive gate's delivery path), `fix:sem001`, `fix:prim-nullable`,
  `fix:codegen001`, `fix:g5`, `fix:ts-emitter`,
  `fix:snapshot-nomen-collision`. Repros under `tela/spike/defects/` where
  applicable.
- **Real-browser verification** (layout/scroll/pointer fidelity beyond the
  shim/host-fixture's state-level surface) → deferred (the campaign
  residual); the node host-binding fixture is the Stage 4 vehicle.
- **Renderer-host interface** → deferred until a second consumer asks
  (behavior-design §5).
- **Branch A re-spike** → campaign option gated on radix D1 landing.
- **Reference catalog** → Stage 5 (consumes the proven Stage 4 extension
  seam; the catalog waits on this gate, campaign line 185).
- **Speculum migration + duplicate-IR removal** → Stage 7.
- **Capability-truth finalization, versioning, publication** → Stage 8.
- **CAMPAIGN.md Stage 4 stage-line update + the acceptance flip + the
  leading-clause evolution + the closeout factory README regen** → the
  Mind-routed Stage 4 closeout (decision D3, workflow step 6 — audit-
  before-acceptance held).
