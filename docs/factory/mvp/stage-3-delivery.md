# Stage 3 — Browser Mount And Update Lifecycle — Delivery Spec

**Status**: planned (delivery lowering complete)
**Planner**: planner-1
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` (Stage 3 — "Browser Mount And Update Lifecycle", lines 288–303; the gate's async-gap sentence at lines 302–303)
**Control-plane repo**: `/Users/ianzepp/work/faberlang/tela` (Stage 3 cwd)
**Baseline carried from Stage 2**: landed kernel `tela/src/tela.fab` (U1 `e194621` theme/token + U2 `bd3130e` assembly), docs `docs/design/theme-protocol.md` + `AGENTS.md` (U4 `3b0b8c4`), two-theme composition `proof/benchmark/` (U3 `ee2abb0`), harnesses `scripta/` (U5 `c8f1c91`), determinism evidence `stage-2-determinism.md`, Stage 2 closeout `stage-2-closeout.md` (`080f695`) + step-6 acceptance flip (`4f85d04`, Stage 3 selected next); policy locks (a)–(e) from `stage-0-protocol-policies.md`; behavior posture from `stage-0-behavior-design.md` (segmented-control contract §1, update strategy §3, async-gap routing §4, mount relationship §5); Stage 0/1/2 closeout residuals (`tela-closeout.md` §4, `stage-1-closeout.md`, `stage-2-closeout.md` §3/§7).
**Mode**: planning artifacts only. This spec lowers the stage; it does not implement.
**Closeout owner**: the tela `CAMPAIGN.md` Stage 3 stage-line status update + the leading-clause evolution are owned by the **Mind-routed Stage 3 closeout** (workflow step 6), **not** by any unit in this spec — decision D3 pattern carried from Stages 1/2 (stage-2-delivery.md Coordination Constraints §6). The factory README regeneration also belongs to the closeout.

---

## Phase Intent

Turn the Stage 3 campaign gate into discrete, one-Hand-per-unit implementable
units. Stage 3 adds the **interactive layer over the locked static renderer**:
the Branch B typed behavior plan (keyed to the `data-tela` seam), the browser
mount/update/dispose lifecycle over the `faber-web` host, the hydration
contract, and the campaign gate's segmented-control proof — so the same
component source that renders static HTML/CSS (Stages 1–2) mounts and updates
in a browser context without a second authoring model.

What Stage 3 is **not**: no new authoring model (the component function stays
ordinary Faber over the shared `Visus` values), no reference component
catalog (Stage 5), no independent extension-package proof (Stage 4), no
Speculum migration (Stage 7), no `faber-web` source edits (consumed through
documented host seams; extended only for general host gaps per the campaign
overlap rule), no radix-lane defect fixes (workarounds carry `fix:<defect-id>`
markers; the radix lane owns the fixes), no fetch-driven/async update claims
(the TS async gap is a named Stage 3 input — see §Async-gap Routing).

---

## Interpreted Scope

Per the Stage 3 gate, the campaign §6/§7 renderer contracts, and the Stage 0
behavior design, Stage 3 must deliver:

1. **Typed behavior plan (Branch B)** — behavior keyed to stable node
   identities (`Vinculum.identitas` binds to the `data-tela` values the
   static renderer emits; `identity-hydration.md` §7), carried by typed
   message-producing closures, **not** erased into strings. The kernel owns
   only the non-generic carriers it can own (`Eventum`); the concrete
   message-typed plan is app-typed (radix D1 blocks generic user-type
   construction — recorded, not fought).
2. **Browser mount + update lifecycle** — `mount(Scope, …) → Mounted`,
   `replace(Mounted, next View) → update result`, `dispose(Mounted) →
   vacuum` (campaign §7). Rerender/replace of an **explicit mounted region**
   (behavior-design §3.1); declarative host effects on the update result
   (focus restoration, focus movement, scroll anchoring — §3.2); never
   ambient global document shortcuts; scoped DOM through the `faber-web`
   `web:dom` host seam (campaign §7, behavior-design §5).
3. **Hydration contract** — attach to matching Tela-rendered markup;
   mismatch diagnoses or replaces by declared policy, never silently binds
   the wrong tree (campaign §7; `identity-hydration.md` §6/§7). Duplicate
   `data-tela` values are a hydration-match ambiguity → diagnosed per the
   Stage 3 policy, not a silent bind.
4. **The segmented-control proof** — a segmented control **mounts, handles
   keyboard and pointer input, updates selected state, ARIA state, and its
   declared live region; disposes subscriptions; and executes explicit
   focus-restoration and scroll-anchor effects across region replacement**
   (campaign gate, verbatim) — as **shared-source** evidence (dependency
   rule 7: the same component function renders statically and mounts).
5. **The TS async gap, routed** — the delivery must **resolve or route** the
   known gap (CAMPAIGN.md Stage 3 gate; `stage-0-behavior-design.md` §4;
   `faber-web/README.md` "Known gap") **before claiming fetch-driven
   updates**. This delivery routes it: Stage 3 proofs are **synchronous
   only**; no fetch-driven/async update claim is made; the escalation path to
   a radix compiler delivery is named (§Async-gap Routing below).
6. **The runtime proof surface** — the mount/update proofs ride the **node
   runtime gate** (Stage 2 residual R1 convention) through a **DOM harness**
   (a minimal in-memory DOM simulating the `web:dom` runtime-binding surface,
   mirroring the WEB5 fixture precedent `examples/browser-app/tests/
   fake-dom.mjs` + `web-shim-dom.js`).

Coordination constraints carried in (record, don't invent):

- **TS async gap is a named Stage 3 input, resolved by routing.** Stage 3's
  behavior proofs are synchronous; `@ futura` calls inside `fac`/`cape`
  blocks are treated as **not awaited** until the compiler gap closes or a
  separate radix delivery lands. No unit claims async/fetch behavior; a unit
  that hits a `dom.fetch_text`-shaped need records the workaround + escalation
  and does not weaken the contract (§Async-gap Routing).
- **G4 compose-without precedent extends.** The benchmark app keeps composing
  with `tela` constructors + consuming extension tokens/bundles. The new
  risk: the browser module's public signatures reference `web:dom` types
  (imported sibling types) — the WARN014 snapshot-skip family. Recorded with
  a harness-assembly workaround; never a duplicated `web:dom` contract inside
  tela.
- **The `web:dom` dialect/locale gap is a NEW named escalation.** `faber-web`
  is authored in the Latin dialect (`faber.toml` `[reader] locale = "la"`;
  `genus`/`functio`/`textus`/`redde`/`nihil`/`fixum`/`bivalens`/`lista`/
  `typus`), targets **ts only**, and its proven consumer path is the la
  dialect (WEB5 fixture). The en-locale tela package importing `web:dom`
  cross-package is **unproven** and may hit the provider-module locale-
  propagation family (PARSE001 — the CODEGEN001 mechanism) at `radix check`.
  Primary posture: attempt the import; on failure record + escalate
  (`fix:web-dom-locale`), fall back to the harness-level DOM binding
  (assembled runner + shim) — never re-author a `web:dom` copy inside tela,
  never weaken the contract.
- **CODEGEN001 Rust-lane block persists** — and `web:dom` is ts-only, so
  Rust emit of a `web:dom`-importing module is doubly out; the TS lane is
  the proven runtime lane; the R2 Rust-sha-equality check activates when
  CODEGEN001 lands (stage-2-determinism.md §3).
- **D1 (generic user-type construction) blocks a kernel-generic `Vinculum`/
  `Nuntius`/`Program`.** The concrete behavior plan is app-typed in the
  benchmark. Branch A re-spike stays a campaign option gated on D1, never a
  mid-stage switch.
- **`fix:<defect-id>` anti-fossilization discipline continues** (CTO-6):
  every applied radix-lane workaround carries the marker at the site;
  removal = grep-replace after each radix fix.
- **No CAMPAIGN.md edits by units** — the acceptance flip + stage-line update
  belong to the Stage 3 closeout (decision D3, like Stages 1/2).

---

## Async-gap Routing (named Stage 3 input — resolved by routing, recorded)

The known TypeScript backend limitation (`stage-0-behavior-design.md` §4,
quoted from `faber-web/README.md`):

> Known gap: the Radix TS backend does not await `@ futura` calls inside
> `fac`/`cape` blocks, so `dom.fetch_text` is exercised at the runtime-bridge
> level in the WEB5 fixture until the async codegen gap closes.

Campaign routing language (§6): *"The initial synchronous behavior proof may
proceed, but fetch-driven or async update claims remain blocked until the gap
is fixed or a separate compiler delivery is routed."*

**This delivery routes it as follows (recorded, never silently assumed):**

- **Stage 3 scope is synchronous by construction.** Every unit's `non_goals`
  and the interpreted scope exclude async event sources, `@ futura`, and
  `dom.fetch_text`-backed controllers. The segmented-control proof
  (keyboard/pointer → message → model → rerender) is fully synchronous — the
  exact claim the campaign gate permits.
- **The stage makes no fetch-driven or async update claim.** The gate's
  condition ("resolve or route the known TypeScript async gap before claiming
  fetch-driven updates") is satisfied by **recording the routing and not
  claiming** — the evidence records (U3, U4) state the synchronous-only
  boundary explicitly.
- **Escalation path is named.** A minimized radix compiler delivery (a
  `@ futura`-in-`fac`/`cape` repro under `tela/spike/defects/`) is the
  pre-requisite for any future async Stage. A Stage 3 unit that hits an
  async-shaped need records the workaround + escalation To mind; it never
  weakens the Tela contract and never waits on the fix.
- **The boundary is documented.** U5's design record + AGENTS.md restate the
  gap, the routing, and the not-claimed posture, so Stage 4+ Hands and
  reviewers see it without re-reading the campaign.

---

## Normalized Spec

Stage 3 produces, in the `tela` repo: kernel-owned pure behavior carriers
(`Eventum`/`Effectus`/`Renovatio`) extending the one flat kernel module; a new
flat **browser module** `tela/src/browser.fab` owning the mount/update/dispose
lifecycle + hydration over the `web:dom` host seam; a **DOM shim** for the
node runtime gate; the segmented-control interactive proof in the two-package
benchmark; extended package-test harnesses (`check-exempla` new wiring cases,
new `check-mount`, `check-determinism` extension) with deterministic evidence;
and a browser-lifecycle design record + AGENTS.md updates.

Locked decisions this spec freezes (from Stage 0/1/2, or recorded here; not
invented):

- **Kernel shape unchanged in spirit**: the kernel stays one flat, **stdlib-
  only** module (`tela/src/tela.fab`). Stage 3 extends it with **pure value
  carriers only** — no `web:dom` references, no closures (G4-safe shape
  preserved; the browser-touching surface is a separate module).
- **Behavior carriers (U1, kernel)**: `Eventum { nomen }` — the typed
  event-name carrier (campaign §2 sketch + policy (b) locked example);
  `union Effectus` — the three declarative host effects from behavior-design
  §3.2 (focus restoration by the pre-replacement focused node's stable
  identity; focus movement to a declared target identity; scroll anchoring /
  scroll-preservation intent), each keyed by identity string; `Renovatio {
  Visus visus, list<Effectus> effectus }` — the update result carried by
  `replace` ("declarative on the update result", §3.2). Kernel-owned
  ordinary-function constructors (G3 posture). Exact variant/field spellings
  are the Hand's, **probed collision-free** (G5/G6); a colliding spelling is
  escalated, never silently renamed.
- **The kernel explicitly does NOT own `Vinculum`/`Nuntius`/`Program`.** Their
  closure fields require a concrete application message type
  (`stage-1-delivery.md` U1 record) and generic user-type construction is
  blocked (D1). The concrete plan is **app-typed in the benchmark** (U3).
- **Browser module (U2, new `tela:browser`)**: one flat module importing
  `web:dom` through the documented host seam. Public verbs per policy (b) +
  campaign §7: **`mount(dom.Scope, Visus, Thema) → Mounted ∪ null`**,
  **`replace(Mounted, Visus) → Renovatio ∪ null`**, **`dispose(Mounted) →
  vacuum`**; hydration attaches-to-matching / diagnoses-or-replaces. This is
  the **pinned seam call shape** (behavior-design §5 "Stage 3 pins the exact
  seam call shape"): the campaign's conceptual `mount(Scope, Program, Theme)`
  decomposes at the app boundary — the Program's message-typed parts (plan,
  update) are app-typed and attach through the `data-tela` seam (D1
  constraint, recorded). A colliding verb (mount/replace/dispose) is
  escalated, never silently renamed.
- **Hydration policy (locked)**: on mount into a scope whose root already
  contains Tela-rendered markup, bindings attach to the matching `data-tela`
  nodes instead of recreating them; a mismatch (missing/extra/out-of-shape
  node at a `data-tela` key) **diagnoses + replaces the mismatched region
  from the View** — the declared policy (campaign §7). Duplicate `data-tela`
  values in the rendered markup are a hydration-match ambiguity →
  **diagnosed** per `identity-hydration.md` §6, never a silent bind.
- **Update strategy (locked)**: rerender/replace the explicitly mounted
  region after a message (behavior-design §3.1); effects are **declarative
  on the update result** and executed by the host after replacement (§3.2);
  no keyed reconciliation, signals, hooks, or concurrent rendering (campaign
  §6 deferral).
- **Host consumption (locked)**: the browser module consumes the `web:dom`
  scope/mutation/subscription surface through documented seams; no ambient
  global document shortcuts for descendant lookup (behavior-design §5;
  `faber-web/README.md`). `faber-web` is not edited in Stage 3. No
  renderer-host interface (deferred until a second consumer asks — §5).
- **Runtime proof vehicle (locked)**: the node runtime gate runs the mount/
  update proofs through a **DOM shim** (`tela/scripta/dom-shim.ts`) that
  implements the `webDom*` runtime-binding surface over a minimal in-memory
  DOM — the WEB5 fixture precedent (`examples/browser-app/tests/fake-dom.mjs`,
  the `web-shim-dom.js` binding facade). Bounded fidelity: assertions at the
  state level (selection/ARIA/live-region/subscription/focus/scroll intent),
  not real layout. A real-browser driver is out of scope (recorded).
- **Determinism posture**: interactive state is time-variant, so the
  determinism gate applies to the **static/mount-time serialization** (the
  segmented control's initial HTML + full cascade — byte-identical double-
  build, fail-closed); the interaction sequence is a **scripted deterministic
  assertion sequence**, not a racy timing test.
- **Benchmark shape**: the two-package composition (extension-lib + canary-
  app, benchmark libhome) gains the segmented control + the app-typed
  behavior plan + the interactive runner mode. The segmented control's
  styles are app-owned (keyed on the control's `data-tela` identity; the
  extension already proved the token/bundle seam). `web` provider resolution
  via the container library home or a benchmark-libhome symlink
  (`web → ../../../faber-web`).
- **New exempla break `check-exempla`'s `*)` default case until U4 wires
  them** (the Stage 2 U5 pattern: `thema`/`assemble` cases were added by the
  harness unit). U1/U2 units validate new exempla via local assembly +
  `tsc`/`node`; U4 owns the official wiring; the stage closeout runs the
  full harness surface exactly once after U4.

---

## Goal-check Summary (goal-check on the Stage 3 campaign section)

- **Artifact reviewed**: `tela/docs/factory/mvp/CAMPAIGN.md` § "Stage 3 —
  Browser Mount And Update Lifecycle" (lines 288–303), with the supporting
  Stage 0 behavior design (`stage-0-behavior-design.md` §1/§3/§4/§5), the
  policy locks (a)–(e), the hydration record (`docs/design/
  identity-hydration.md`), the landed Stage 1+2 kernel/harness baseline, and
  the Stage 2 closeout residuals.
- **Evaluator mode**: self-contained cold pass (planner-1, the lowerer, also
  the checker — single-lane planning; the independent pass remains the
  auditor's at the stage closeout).
- **Intended next consumer**: `delivery` lowering (this spec).
- **Handoff bar used**: campaign delivery readiness — the gate must be
  specific, grounded, architecturally decided, bounded, and testable enough
  that a mid-tier implementing Hand can execute units without inventing scope.
- **Verdict**: **READY**.
- **Reasoning**: The gate's single long sentence (segmented control mounts +
  keyboard + pointer + selected state + ARIA state + declared live region +
  subscription disposal + focus-restoration and scroll-anchor across region
  replacement) is fully decomposed by the Stage 0 behavior design §1 (the
  interactive widget contract) + §3 (the update strategy + effects) into
  concrete unit surfaces. The architecture is already decided: Branch B
  behavior plan keyed to `data-tela` (§2, policy (d)3), the rerender/replace
  strategy (§3), the async-gap routing (§4 — the gate's "resolve or route"
  condition is resolvable by routing + not claiming), the mount relationship
  (§5 — consume `web:dom` through documented seams). The implementing
  surface is grounded in landed artifacts (the `data-tela` seam, the kernel
  `Visus`/theme/assembly surfaces, the benchmark, the node runtime gate +
  determinism harness). The open items at check time (exact seam call shape,
  hydration mismatch policy, DOM-shim proof vehicle, `web:dom` dialect gap)
  are **non-blocking** because this delivery locks defaults for each
  (Normalized Spec; Open Questions for Mind carries only the ones needing
  Mind's word). No material boundary, stop condition, or acceptance criterion
  is missing.
- **Key points**:
  - Gate → surface mapping is 1:1 and grounded in the behavior design's
    segmented-control contract + update strategy — no new architecture
    guesswork.
  - The one genuine risk (the en→la `web:dom` cross-package import is
    unproven) has a recorded fallback (harness-level DOM binding) + an
    escalation path (`fix:web-dom-locale`); it does not block the gate's
    synchronous proof.
  - The async-gap input is routed, not assumed: synchronous-only proofs,
    no fetch claims, escalation named.
  - Validation for every bullet is named (exempla + runtime gate +
    interaction gate + determinism double-build) — testable without hidden
    chat context.

---

## Repo-Aware Baseline

Verified by planner-1 (2026-08-09):

- **`tela/`** — sibling git repo on `main`, clean at `4f85d04` (Stage 2
  step-6 acceptance). Contents (all Stage 1/2-landed, commit-verified):
  `faber.toml` (package `tela`, provider `tela`, `kind = "lib"`, targets
  `rust`+`ts`, locale `en`); `src/tela.fab` (Branch B kernel + escaping +
  HTML/CSS serializers + `Stilum`/`Regula`/`Declaratio` + `Scopulum`/`Thema`/
  `thema_css`/`thema_stilum` + `Codicillus`/`Ordo`/`assemble`); `src/valida.fab`;
  `exempla/{validation,serializer,thema,assemble}.fab`; `scripta/
  {check-compile,check-exempla,check-determinism}`; `docs/design/
  {identity-hydration,theme-protocol}.md`; `AGENTS.md`; `proof/benchmark/
  {extension-lib,canary-app,libhome}`; `docs/factory/mvp/` (campaign +
  stage-0/1/2 records); `spike/` (frozen Stage 0 evidence — no unit writes);
  `build/` (gitignored evidence).
- **Kernel surface Stage 3 extends** — `tela.fab` currently has no
  `Eventum`/`Effectus`/`Renovatio` (the behavior-plan carriers); the kernel
  is stdlib-only + one same-package sibling import (`tela:valida`). The
  `data-tela` seam + `Proprietas` carriers are landed (the browser-lane
  contract). `html_visus` is the G5 workaround spelling; `css`/`assemble`/
  `thema_css` are the locked English verbs.
- **Host seam (faber-web, read-only)** — `faber-web/src/dom.fab` (provider
  `web`, `[reader] locale = "la"`, `[build] targets = ["ts"]`): `genus Scope`,
  `genus Element`, `functio scope(selector)`, `query`/`require`/`all`,
  `text_set`/`attr_set`/`class_add`/`on`/`unsubscribe`/`value`/`on_input`/
  `on_keyboard`/`on_pointer`/`on_focus`/`on_submit`, `prevent_default`,
  and the `@ futura` `fetch_text`. `faber-web/runtime/dom.ts` binds the
  `webDom*` symbols; `bindings/ts.toml` maps routes → runtime symbols. The
  proven consumption path is the **la dialect** (WEB5 fixture
  `examples/browser-app/`, `tests/fake-dom.mjs` + `web-shim-dom.js`); the
  en→la cross-package path is **unproven** (named escalation).
- **Harness mechanics (Stage 1/2)** — `check-exempla`: radix check every
  exempla; TS emit valida+tela+each exempla; assemble per wiring case
  (validation/serializer/thema/assemble — `*)` default fails unknown cases);
  `tsc --noEmit`; **node runtime gate** (assertions execute — residual R1
  closed). `check-determinism`: Rust primary path attempted + CODEGEN001
  recorded; TS-lane assembled composition built twice + byte-compared
  (fail-closed) + sha256 → `build/hashes.txt`. Current two-theme sha
  `3d22b9c7…8340a`.
- **Radix binary** — in-tree `radix/target/debug/radix` (0.80.0); `--locale
  en`; exempla-mode `+++` frontmatter (term/kind/category/locale).
- **Cargo discipline** — no workspace cargo suites in any unit; Rust-lane
  checks in scratch dirs outside the shared workspace (`/tmp/…`). Full radix
  ladder stages 4–6 / `--e2e` remain auditor-owned.
- **Concurrent workers** — none expected inside `tela/` during Stage 3
  (this stage owns the repo; Stages 1–2 are closed). `faber-web` is
  read-only here (host consumed, not extended).
- **Speculum overlap rule** — unchanged: `faberlang.dev`'s `document_ir.fab`
  is not a copy source (Stage 7 migrates through public `tela:*` imports).

---

## Coordination Constraints (record, don't invent)

1. **D3 — CAMPAIGN.md stage-line + acceptance flip (closeout-owned, carried
   from Stages 1/2)**: the Stage 3 stage-line status update AND the leading-
   clause evolution are owned by the **Mind-routed Stage 3 closeout**
   (workflow step 6: consequences + correctness + independent audit), not by
   any unit in this spec. Every unit leaves `CAMPAIGN.md` untouched; the
   factory README regeneration also belongs to the closeout.
2. **Async-gap routing (named input)**: Stage 3 proofs are synchronous only;
   no fetch-driven/async update claim; a unit hitting an async-shaped need
   records + escalates (§Async-gap Routing). Never silently assumed.
3. **`fix:<defect-id>` workaround-marker discipline (CTO-6)**: every applied
   radix-lane workaround carries the marker at the site and in the module
   header. Known markers for Stage 3: `fix:g4` (WARN014 snapshot skip on
   public `web:dom`-typed signatures / union-returning signatures),
   `fix:web-dom-locale` (NEW — en→la provider-module locale/dialect
   propagation at `radix check`, PARSE001-family), `fix:codegen001` (Rust
   emit-across-imports; `web:dom` is ts-only, so Rust emit of a browser.fab
   is doubly out), `fix:g5` (verb collisions — mount/replace/dispose + new
   identifiers probed), `fix:ts-emitter` (TS-emitter observations),
   `fix:snapshot-nomen-collision` (Stage 2 workaround held; new identifiers
   avoid kernel type names). A workaround touching a contract surface is
   recorded + escalated, never silently absorbed into the API.
4. **G4 compose-without extends** — the benchmark app composes with `tela`
   constructors and consumes extension tokens/bundles (proven seam). The new
   G4-family risk (browser.fab public signatures referencing `web:dom` types)
   has the recorded harness-assembly workaround (the assembled runner binds
   the `webDom*` surface directly — the snapshot does not apply at runtime);
   never a duplicated `web:dom` contract inside tela.
5. **CODEGEN001 Rust-lane block persists** — TS lane is the proven runtime
   lane; the R2 Rust-lane sha-equality check activates when the fix lands
   (stage-2-determinism.md §3); Rust emit of a `web:dom`-importing module is
   additionally out (faber-web targets ts only) — recorded, never the gate.
6. **D1 generic-construction block** — the concrete behavior plan
   (`Vinculum`/`Nuntius`/message types) is app-typed in the benchmark; the
   kernel owns only non-generic carriers. Branch A re-spike is a campaign
   option gated on D1 landing — never a mid-stage switch.
7. **Escalation path — radix-lane defects**: G4/G5/CODEGEN001/TS-emitter/
   snapshot-nomen-collision + the NEW `web:dom` locale/dialect observations
   are radix-lane work, routed To mind (repros under `tela/spike/defects/`
   where applicable). Stage 3 units apply the recorded workarounds with
   `fix:<id>` markers and never weaken the Tela contract.
8. **Faber-web is read-only in Stage 3** — consumed through documented host
   seams; extended only for general host gaps (campaign Stage 3 overlap
   rule), and no general host gap is known at lowering time (recorded).

---

## Ordered Unit Graph

```
Wave 1:  U1 behavior-carriers (kernel: Eventum/Effectus/Renovatio + constructors)
Wave 2:  U2 browser-mount (browser.fab + dom-shim + mount exempla)  ∥  U5 docs (browser-lifecycle record + AGENTS.md)
Wave 3:  U3 segmented-interactive (benchmark: segmented control + app-typed plan + interaction runner)
Wave 4:  U4 harnesses-interaction-determinism (check-exempla wiring + check-mount + check-determinism extension + evidence)
```

Shared-file constraint: the kernel module `tela/src/tela.fab` is extended by
U1 only (pure carriers — G4-safe shape preserved). The new browser module
`tela/src/browser.fab` + `tela/scripta/dom-shim.ts` are written by U2 only.
The benchmark app `proof/benchmark/canary-app/src/main.fab` is extended by U3
only. Harnesses (`scripta/`) are extended by U4 only. Docs (`docs/design/`,
`AGENTS.md`) are written by U5 only. **No unit overlaps another unit's
write_scope.** Wave 2 gives 2-way parallelism; Mind may serialize further if
slot capacity prefers (U5 binds to the spec-locked surface and reconciles
against U3 emission, mirroring Stage 2's U4 pattern).

| # | Unit | Wave | Depends on |
|---|---|---|---|
| U1 | `tela-s3-u1-behavior-carriers` | 1 | none (Stage 1+2 kernel baseline) |
| U2 | `tela-s3-u2-browser-mount` | 2 | U1 |
| U5 | `tela-s3-u5-docs` | 2 | U1 |
| U3 | `tela-s3-u3-segmented-interactive` | 3 | U1, U2 |
| U4 | `tela-s3-u4-harnesses-interaction-determinism` | 4 | U3 |

---

## Units

### U1 — `tela-s3-u1-behavior-carriers`

| Field | Value |
|---|---|
| `id` | `tela-s3-u1-behavior-carriers` |
| `outcome` | The kernel owns the pure behavior-plan carriers for the Branch B adjacent plan: `Eventum { nomen }` (typed event-name carrier), the `Effectus` union (declarative host effects keyed by stable identity), and the `Renovatio` update result (`{ Visus visus, list<Effectus> effectus }`) — closure-free, `web:dom`-free, deterministic, in the one flat kernel module. |
| `write_scope` | `tela/src/tela.fab` (extend — behavior carriers + kernel-owned constructors; module header gains the Stage 3 section + `fix:<id>` markers); `tela/exempla/behavior.fab` (new — exempla-mode, `+++` frontmatter, locale `en`) |
| `read_scope` | `tela/docs/factory/mvp/stage-0-behavior-design.md` §3 (update strategy + declarative effects); §2 (Branch B plan keyed to stable identities); `tela/docs/factory/mvp/stage-0-protocol-policies.md` policy (b) (`Eventum` locked example; renderer/host verbs English); `tela/docs/factory/mvp/CAMPAIGN.md` §6/§7 + Stage 3 gate; Stage 1+2 kernel `tela/src/tela.fab` (existing surface, G5/G6 collision notes, `fix:` marker inventory) |
| `done_when` | (a) Kernel gains `Eventum { nomen }` (policy (b) locked spelling) with a kernel-owned `eventum(nomen)` constructor. (b) Kernel gains `union Effectus` with exactly the three declarative host effects from behavior-design §3.2 — focus restoration (by the pre-replacement focused node's stable identity), focus movement (to a declared target identity), scroll anchoring (scroll-preservation intent) — each variant keyed by identity (concrete variant + field spellings are the Hand's, probed collision-free on the in-tree radix; a colliding spelling is escalated, never silently renamed). (c) Kernel gains `Renovatio { Visus visus, list<Effectus> effectus }` (the update result `replace` carries) + constructor. (d) The kernel stays **closure-free and `web:dom`-free** (G4-safe flat stdlib-only shape; the kernel explicitly does NOT own `Vinculum`/`Nuntius`/`Program` — D1 + the concrete-message-type constraint, recorded in the module header). (e) Exempla `exempla/behavior.fab` cover: event-name construction; every effect variant; an update result carrying a view + effects; pure-carrier composition (asserts construct + combine); the no-closure property exercised (carriers are plain values). `radix check` green. (f) Three-lane check per the established pattern: TS lane emit + assemble + `tsc --noEmit`; Rust lane import-free kernel emit + scratch-dir `cargo check` (import-bearing paths attempted + CODEGEN001 recorded `fix:codegen001`). New-exempla wiring note: `check-exempla`'s `*)` default case fails until U4 wires `behavior.fab` — the unit Hand validates via local assembly (the established strip+namespace-binding mechanics) and records it; the official wiring is U4. (g) Module header records the Stage 3 carriers section + all `fix:<id>` markers applied (verb/collision probes; TS-emitter observations if they bite). (h) `git diff --check` in `tela/`. |
| `validation` | `radix check` (`--locale en`) on the extended kernel + `exempla/behavior.fab`; TS lane emit + assemble + `tsc --noEmit`; Rust lane import-free kernel emit + scratch `cargo check` (CODEGEN001 recorded); `git diff --check`. |
| `depends_on` | none (Stage 1+2 kernel baseline) |
| `non_goals` | No closures/vincula in the kernel. No `web:dom` references. No browser lifecycle (U2). No segmented control / app-typed plan (U3). No harness wiring (U4). No docs (U5). No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Low–Medium.** Pure value carriers over the proven kernel shape; residual risk is identifier collisions (G5/G6 — probe + escalate) and the D1 constraint surfacing again (recorded, not fought). |
| `est_work_tokens` | 4–6k |
| `test_owner` | Unit Hand (exempla + lanes); reviewer (carrier-vs-policy-(b) + behavior-design §3.2 cross-check). |

### U2 — `tela-s3-u2-browser-mount`

| Field | Value |
|---|---|
| `id` | `tela-s3-u2-browser-mount` |
| `outcome` | The browser lifecycle module `tela:browser` owns the mount/update/dispose lifecycle + hydration over the `web:dom` host seam (behavior-design §5), the `Mounted` host-state carrier, the pinned seam call shape, declarative-effect execution, and the hydration mismatch/duplicate policy — Tela's component lifecycle + state/update mechanics, host-touching only. |
| `write_scope` | `tela/src/browser.fab` (new — flat module importing `web:dom` through the documented host seam); `tela/scripta/dom-shim.ts` (new — the node host simulation implementing the `webDom*` runtime-binding surface over a minimal in-memory DOM; WEB5 precedent `examples/browser-app/tests/fake-dom.mjs` + `web-shim-dom.js`); `tela/exempla/browser.fab` (new) |
| `read_scope` | `tela/docs/factory/mvp/stage-0-behavior-design.md` §3 (rerender/replace + declarative effects), §3.3 (hydration contract), §5 (mount relationship — consume `web:dom`/`WebController` through documented seams; no ambient document shortcuts); `tela/docs/design/identity-hydration.md` §6/§7 (duplicate-identity ambiguity; the binding contract); `tela/docs/factory/mvp/CAMPAIGN.md` §7 (renderer contract) + Stage 3 gate; `faber-web/src/dom.fab` + `faber-web/runtime/dom.ts` + `faber-web/bindings/ts.toml` (host surface, read-only); U1 kernel carriers |
| `done_when` | (a) **Seam call shape pinned**: `mount(dom.Scope, Visus, Thema) → Mounted ∪ null`, `replace(Mounted, Visus) → Renovatio ∪ null`, `dispose(Mounted) → vacuum` — English verbs per policy (b) + campaign §7; the campaign's conceptual `mount(Scope, Program, Theme)` decomposes at the app boundary (the Program's message-typed parts are app-typed in U3 — D1; recorded in the module header + design record). A colliding verb is escalated, never silently renamed. (b) `Mounted` carries host state: scope, mounted root, current `Visus`, active theme, subscription list (fields reference `web:dom` types — module-local; the cross-package snapshot-skip risk recorded `fix:g4`). (c) **mount**: renders the View into the scope through the host mutation surface (scoped, never ambient document shortcuts), applies the theme cascade, and **hydrates** — when the scope's root already contains Tela-rendered markup, bindings attach to matching `data-tela` nodes instead of recreating them; mismatch **diagnoses + replaces the mismatched region from the View** (declared policy — campaign §7); duplicate `data-tela` values are diagnosed (identity-hydration.md §6), never a silent bind. (d) **replace**: rerenders/replaces the explicitly mounted region with the next View (behavior-design §3.1) and returns a `Renovatio` whose declarative effects are derived from the before/after state (pre-replacement focused identity, declared focus movement, scroll-anchor intent). (e) **effect execution**: after replacement the host executes the declared effects (focus restore / focus move by stable identity; scroll anchoring) — declarative on the update result, never imperative post-update user-code calls (§3.2). (f) **dispose**: unsubscribes all active subscriptions + clears the region (campaign gate "disposes subscriptions"). (g) Exempla `exempla/browser.fab` (under the dom-shim, assembled + executed under `node`): mount onto an empty scope; **hydration** onto pre-rendered Tela markup (matching `data-tela` nodes bound — asserted); mismatch → diagnose + replace (never silent bind — asserted); duplicate-identity diagnosis (asserted); replace with focus-restoration + scroll-anchor effects (asserted at the shim level); dispose unsubscribes (asserted). (h) **Cross-package import of `web:dom` (la provider) from the en module**: ATTEMPTED at `radix check` + TS emit (container library home so `web` resolves). If the en→la provider-analysis path fails (PARSE001-family — the CODEGEN001 mechanism): record + escalate (`fix:web-dom-locale`), and the fallback posture holds — the DOM surface binds at the harness level (assembled runner + dom-shim bind the `webDom*` surface, mirroring `web-shim-dom.js`), **never** re-authoring a `web:dom` copy inside tela and **never** weakening the contract. (i) `git diff --check` in `tela/`. |
| `validation` | `radix check` on `browser.fab` + `exempla/browser.fab` (container library home); TS lane emit + assemble + `tsc --noEmit`; the mount exempla assembled + run under `node` with the dom-shim (runtime gate — assertions execute); Rust lane: out for `web:dom`-importing files (faber-web targets ts only) — recorded, never the gate; `git diff --check`. |
| `depends_on` | U1 |
| `non_goals` | No component catalog. No segmented control / app-typed plan / message loop (U3). No harness wiring (U4). No real-browser driver (node shim is the proof vehicle; browser-only layout/scroll/pointer fidelity deferred — recorded). No fetch/async claims (the async gap). No `faber-web` edits. No renderer-host interface (deferred until a second consumer asks). No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **High** (the stage's hardest surface). Named risks: (1) en→la `web:dom` import unproven (PARSE001-family — fallback + escalation `fix:web-dom-locale`); (2) G4 snapshot skip on public `web:dom`-typed signatures (recorded; harness assembly + app-local consumption bypass it); (3) verb collisions on mount/replace/dispose (probe + escalate, never silently rename); (4) dom-shim fidelity bounded (state-level assertions, no real layout). Fail honestly: a blocked import is recorded + escalated, never worked around by duplicating the host contract. |
| `est_work_tokens` | 8–12k |
| `test_owner` | Unit Hand (exempla + lanes + shim) + reviewer (seam-pin cross-check vs campaign §7 + behavior-design §3.3/§5). |

### U3 — `tela-s3-u3-segmented-interactive`

| Field | Value |
|---|---|
| `id` | `tela-s3-u3-segmented-interactive` |
| `outcome` | The campaign gate proof: a segmented control mounts, handles keyboard + pointer input, updates selected state + ARIA state + its declared live region, disposes subscriptions, and executes focus-restoration + scroll-anchor effects across region replacement — in the two-package benchmark, through the `tela:browser` surface + `web:dom` host seams, synchronously, as shared-source evidence (same component function renders statically and mounts). |
| `write_scope` | `tela/proof/benchmark/canary-app/src/main.fab` (extend — the segmented control component + the app-typed behavior plan + subscription wiring + the interactive runner mode); `tela/docs/factory/mvp/stage-3-segmented-control.md` (new evidence record) |
| `read_scope` | `tela/docs/factory/mvp/stage-0-behavior-design.md` §1 (the segmented-control contract: widget shape §1.1, pointer §1.2, keyboard §1.3, selected state §1.4, declared live region §1.5) + §3 (update strategy); U1/U2 surfaces; `tela/proof/benchmark/canary-app/src/main.fab` + `extension-lib/src/extension.fab` (the two-theme composition runner + G4-safe seam); `tela/docs/design/identity-hydration.md` §7 (the binding contract) |
| `done_when` | (a) **Static half**: the segmented control is a component function over typed props (ordinary Faber; no compiler-known component kind) producing a `Visus` with stable `data-tela` identities on the group + per segment; `role='radiogroup'` on the group, `role='radio'` + `aria-selected` true/false on segments (§1.4); the control-owned declared live region (`aria-live`/`role='status'`-shaped, §1.5); the keyboard-contract structure (one tab stop; arrows move focus only; `Space`/`Enter` select; `Home`/`End` to first/last; `Tab` leaves as a unit — §1.3). The static half renders deterministically through `html_visus` (feeding U4's determinism gate). (b) **App-typed behavior plan**: a concrete message type + `Vinculum`-shaped bindings (eventus + message-producing closures) keyed to the `data-tela` identities, built app-side (D1 constraint: not kernel-generic — recorded); the update function is an ordinary app function over the concrete message type. (c) **Subscription wiring through documented host seams** (behavior-design §5): `web:dom` pointer + keyboard subscriptions attach to the control by identity (never ambient document shortcuts); the plan maps events → messages; the loop applies `update(message)` → next `Visus` → `replace` on the mounted region. (d) **Behavioral contract green under node (the interaction gate, via the dom-shim)**: scripted sequence — pointer click on an unselected segment selects it (its `aria-selected` flips, the previous unselects, the announcement fires once); click on the already-selected segment is a no-op (silent); arrow keys move focus only (selection unchanged); `Space`/`Enter` select + announce; `Home`/`End` move focus; a replace across the region restores focus to the pre-replacement focused node by identity + executes the declared scroll-anchor (asserted at the shim level); dispose removes subscriptions (a post-dispose event dispatch does nothing). (e) **Async-gap boundary**: the proof is fully synchronous — no `@ futura`, no `dom.fetch_text`, no fetch-driven update claim; the evidence record states this explicitly (the gate's "resolve or route the async gap before claiming fetch-driven updates" is satisfied by recording + not claiming). (f) Both benchmark packages pass `radix check` under the benchmark libhome (`web` resolves via the container home or a libhome symlink `web → ../../../faber-web`). (g) Evidence record `stage-3-segmented-control.md` documents: the control shape, the exercised host seams, the scripted interaction sequence + assertions (node exit 0), the synchronous-only boundary, and the U4 hooks (check-mount + determinism static render). (h) `git diff --check` in `tela/`. |
| `validation` | `radix check` both benchmark packages (benchmark libhome); TS lane assembled interactive runner under `node` with the dom-shim (the scripted interaction sequence executes — assertions run, fail-closed); reviewer cross-check of the behavior-design §1 contract vs the proof; `git diff --check`. |
| `depends_on` | U1, U2 |
| `non_goals` | No reference catalog (Stage 5). No kernel-generic `Vinculum`/`Program` (D1). No fetch/async behavior (the gap). No real-browser driver. No third theme. No `faber-web` edits. No `CAMPAIGN.md` edits. No radix-lane fixes. No writes to `tela/spike/` (frozen Stage 0 evidence). |
| `risk` | **High** (gate-critical). Residual risks: interaction semantics vs the shim's fidelity (bounded by state-level assertions + scripted sequence); the en→la `web:dom` import path (U2's escalation carries); the D1 app-typed plan shape (recorded). Fail honestly: a wrong expectation or a real source defect fails the gate — fix the source or the assert; an emitter defect escalates. |
| `est_work_tokens` | 8–12k |
| `test_owner` | Unit Hand (interaction runner + checks) + reviewer (behavior-design §1 contract cross-check) + closeout auditor (independent interaction-gate re-run). |

### U4 — `tela-s3-u4-harnesses-interaction-determinism`

| Field | Value |
|---|---|
| `id` | `tela-s3-u4-harnesses-interaction-determinism` |
| `outcome` | The package-test surface extends: `check-exempla` wires the new exempla (`behavior` + `browser` cases, with the dom-shim binding), a new `check-mount` runs the segmented-control interaction gate, `check-determinism` extends to the interactive composition's static render, and the deterministic double-build + interaction evidence is on disk. |
| `write_scope` | `tela/scripta/check-exempla` (extend — `behavior` + `browser` wiring cases with the dom-shim namespace binding); `tela/scripta/check-mount` (new — assembles the interactive composition (kernel + browser module + dom-shim + extension + app) and runs the scripted interaction sequence under `node`, fail-closed); `tela/scripta/check-determinism` (extend — double-build the segmented-control static render (initial HTML + full cascade), byte-compare + sha256, fail-closed; keep the Rust primary-path attempt + CODEGEN001 record); `tela/docs/factory/mvp/stage-3-mount-determinism.md` (new evidence record) |
| `read_scope` | U3 runner + U2 dom-shim + U1 exempla; existing `check-exempla`/`check-determinism` wiring (the strip + namespace-binding mechanics; the wiring-case switch); `tela/docs/factory/mvp/stage-1-determinism.md` + `stage-2-determinism.md` (lane records, R2 note) |
| `done_when` | (a) `check-exempla`: the `behavior` + `browser` wiring cases added (the `*)` default now has no unknown cases); every exempla runs radix check + TS emit + assemble + `tsc --noEmit` + **node** (runtime gate — assertions execute). (b) `check-mount`: assembles the interactive composition and executes the scripted gate sequence (pointer select / pointer no-op / keyboard focus-only / `Space`-`Enter` select / `Home`-`End` / replace + focus-restoration + scroll-anchor / dispose) — any assertion failure or non-zero exit FAILS the gate (fail-closed). (c) `check-determinism`: the segmented-control **static render** (initial HTML + full cascade) builds twice and is byte-identical (sha256 → `build/hashes.txt`); the record states that determinism applies to static/mount-time serialization only (interactive state is time-variant — recorded, not claimed); Rust primary path attempted + CODEGEN001 recorded (`fix:codegen001`); the R2 note restated (Rust-lane capture must equal the TS-lane capture when the fix lands). (d) `stage-3-mount-determinism.md` records: both hashes, the exact commands, the output description, the interaction-gate evidence (scripted sequence + assertions, node exit 0). (e) Cargo discipline: all cargo in scratch dirs outside the shared workspace; no workspace suites; the harnesses run exactly once at closeout. (f) `git diff --check` in `tela/`. |
| `validation` | Run `scripta/check-compile` + `scripta/check-exempla` + `scripta/check-mount` + `scripta/check-determinism` once at closeout; reviewer/auditor re-runs `check-mount` + `check-determinism` as named test owners; `git diff --check`. |
| `depends_on` | U3 |
| `non_goals` | No real-browser suite. No radix ladder stages 4–6 / `--e2e` / release-gate (auditor-owned). No `@layer` at-rules. No release claims. No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Medium.** The interaction gate's scripted assertions must match the shim's capabilities (bounded by design + the WEB5 precedent); the exempla runtime gate extends again (the Stage 2 U5-caught-defect precedent — fail honestly, fix the source or the assert, escalate an emitter defect). CODEGEN001 Rust-lane block persists (`fix:codegen001`). |
| `est_work_tokens` | 5–8k |
| `test_owner` | Unit Hand (harness runs) + closeout auditor (re-runs `check-mount` + `check-determinism`). |

### U5 — `tela-s3-u5-docs`

| Field | Value |
|---|---|
| `id` | `tela-s3-u5-docs` |
| `outcome` | The browser lifecycle + behavior plan is documented for later Hands, reviewers, and the Stage 4 independent-extension gate: a browser-lifecycle design record + AGENTS.md authoring updates (including the async-gap boundary and the `fix:<defect-id>` discipline inventory). |
| `write_scope` | `tela/docs/design/browser-lifecycle.md` (new); `tela/AGENTS.md` (extend — Stage 3 authoring surface) |
| `read_scope` | U1/U2/U3 landed surface (carriers, browser module, seam call shape, interaction proof); `tela/docs/factory/mvp/stage-0-behavior-design.md` §1/§3/§4/§5; `tela/docs/design/identity-hydration.md` §6/§7; `tela/docs/factory/mvp/stage-0-protocol-policies.md` policies (b)/(d); `tela/docs/factory/mvp/CAMPAIGN.md` §6/§7; Stage 1/2 records (closeouts, determinism) |
| `done_when` | (a) `browser-lifecycle.md` documents: the pinned seam call shape (`mount`/`replace`/`dispose` + the app-typed behavior-plan boundary — D1 rationale); the hydration contract (attach-to-matching; mismatch diagnose+replace policy; duplicate-identity diagnosis); the update strategy (rerender/replace + declarative effects: focus restoration / focus movement / scroll anchoring); the live-region policy (§1.5 — silent when selection does not change); the **async-gap boundary** (Stage 3 proofs synchronous-only; no fetch-driven claims until the compiler delivery lands — the named Stage 3 input, §4 restated); the host-seam consumption (`web:dom` through documented seams; no ambient document shortcuts; `faber-web` read-only); the DOM-shim proof vehicle + its bounded fidelity; the deferred renderer-host interface. (b) `AGENTS.md` gains the Stage 3 authoring notes: browser-module conventions (`web:dom` import + G4/dialect escalation markers `fix:g4`, `fix:web-dom-locale`), the dom-shim + `check-mount` harness, the `fix:<id>` discipline inventory (grep-replace removal after each radix fix), the interaction-gate proof shape, the synchronous-only posture. (c) Docs agree with the U1–U3 emission after it lands (verb names, seam call shape, hydration policy); deviations reconciled within U5 scope or routed. (d) `git diff --check` in `tela/`. |
| `validation` | Reviewer cross-checks docs against policies (b)/(d), behavior-design §1/§3/§4/§5, campaign §6/§7, and the landed emission; `git diff --check`. |
| `depends_on` | U1 |
| `non_goals` | No API reference beyond locked surfaces. No Stage 4+ docs. No website/marketing docs. No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Low.** Doc-only; the reconciliation item (c) against U2/U3 emission is the small drift risk. |
| `est_work_tokens` | 3–5k |
| `test_owner` | Reviewer (doc-vs-emission cross-check; `fix:<id>` marker inventory check). |

---

## Checkpoints And Gates

| Gate | After | Check |
|---|---|---|
| **SG1 — behavior carriers** | U1 | Kernel owns `Eventum`/`Effectus`/`Renovatio` + constructors; closure-free + `web:dom`-free (G4-safe flat shape); no `Vinculum`/`Nuntius` in the kernel (D1 recorded); exempla green through check + lanes; identifier collisions escalated (never silently renamed); `fix:<id>` markers in place. |
| **SG2 — browser mount** | U2 | `tela:browser` mounts/hydrates/replaces/disposes over the `web:dom` seam; seam call shape pinned (`mount(dom.Scope, Visus, Thema)`); hydration mismatch = diagnose + replace (never silent bind); duplicate-identity diagnosis; declarative effects execute; mount exempla runs under `node` with the dom-shim; escalations recorded (`fix:g4`, `fix:web-dom-locale` if raised, verb collisions). |
| **SG3 — segmented control (the campaign gate)** | U3 | Segmented control mounts + handles keyboard + pointer + updates selected state + ARIA state + declared live region; disposes subscriptions; executes focus-restoration + scroll-anchor across region replacement; synchronous-only (no fetch/async claim); interaction sequence runs under `node` (assertions green); evidence record on disk. |
| **SG4 — docs** | U5 | `browser-lifecycle.md` + AGENTS.md document the Stage 3 surface; the async-gap boundary restated; `fix:<id>` inventory recorded; docs agree with the U1–U3 emission. |
| **SG5 — harnesses + interaction + determinism** | U4 | `check-exempla` green with the new wiring cases (no `*)` default hits); `check-mount` green (scripted interaction gate, fail-closed); `check-determinism` byte-identical static-render double-build on disk with hashes (fail-closed); R2 note recorded. |
| **Stage closeout** | all | Campaign workflow step 6: review shared protocol changes with `consequences`, `correctness`, and an independent audit **before** accepting the stage. The closeout owns the Stage 3 stage-line status update + the leading-clause evolution (decision D3) + the factory README regeneration + the Stage 3 → Stage 4 selection. |

The Stage 3 gate bullets map 1:1 to the gates above (segmented control mounts
+ keyboard + pointer → SG3; selected state + ARIA state + declared live
region → SG3 (+ SG1 carriers); disposes subscriptions → SG2 + SG3; focus-
restoration + scroll-anchor across region replacement → SG2 + SG3; async gap
resolved-or-routed → SG3 + SG5 + the Async-gap Routing section).

---

## Validation Summary

| Layer | Command / Flow | Covers |
|---|---|---|
| Kernel semantics | `radix check` on `tela/src/*.fab` (`--locale en`, container library home) | Behavior carriers + existing kernel typecheck |
| Browser module | `radix check` on `tela/src/browser.fab` + `exempla/browser.fab` (container library home — `web` resolves) | Mount/update/dispose/hydration typecheck across the host seam |
| TS lane | `radix emit -t ts` + assemble + `tsc --noEmit` (kernel + browser module + exempla + composition) | Typed values + lifecycle valid in TypeScript; the proven runtime lane |
| Node runtime gate | Assembled exempla + the interactive composition run under `node` with the dom-shim (assertions execute) | Gate-owned runtime verification (R1 pattern); hydration/mount/replace/dispose/effects; the scripted interaction sequence |
| Interaction gate | `scripta/check-mount` — the segmented-control scripted sequence (pointer/keyboard/select/ARIA/live-region/replace+effects/dispose) | The campaign Stage 3 gate (fail-closed) |
| Rust lane | `radix emit -t rust` + scratch-dir `cargo check`/`cargo run` (import-free kernel only; `web:dom`-importing files are ts-only — recorded) | Import-free kernel green; CODEGEN001 recorded (`fix:codegen001`); R2 sha-equality documented for when the fix lands |
| Package tests | `scripta/check-compile` + `scripta/check-exempla` (with the new wiring cases) | The tela package test surface |
| Determinism | `scripta/check-determinism` — segmented-control static render built twice, byte-compare (sha256) | Byte-identical static/mount-time serialization (fail-closed); interaction state recorded time-variant |
| Benchmark | `radix check` both benchmark packages under the benchmark libhome + the assembled interactive runner | The two-package composition interactive proof (shared-source — dependency rule 7) |
| Doc hygiene | `git diff --check` in `tela/` | Whitespace/conflict hygiene |
| Cargo discipline | No workspace cargo suites; scratch dirs only | Lock ownership (operator rule 2026-08-07) |
| Radix ladder | Not run by Stage 3 units (tela changes do not touch radix); stages 4–6 / `--e2e` auditor-owned | Boundary: no whole-workspace suites |

---

## Escalation Path (radix-lane defects — recorded, not fixed here)

| Defect | Marker | Stage 3 posture | Owner |
|---|---|---|---|
| **`web:dom` locale/dialect gap (NEW)** — en-locale tela module importing the la-locale `web:dom` provider may fail provider-module re-analysis (PARSE001-family — the CODEGEN001 mechanism) | `fix:web-dom-locale` | ATTEMPTED at check/emit; on failure record + escalate; fallback = harness-level DOM binding (assembled runner + dom-shim bind the `webDom*` surface); never re-author a `web:dom` copy inside tela | radix lane (Mind routes; repro under `tela/spike/defects/`) |
| **G4** — WARN014 snapshot skip on public signatures referencing imported sibling types (the browser module's `web:dom`-typed signatures; the union-returning signature family) | `fix:g4` | Compose-without + harness-assembly workaround (the snapshot does not apply at runtime); app-local consumption; the token/bundle seam stays G4-independent | radix defect sprint |
| **CODEGEN001** — provider-module locale propagation (Rust emit-across-imports) | `fix:codegen001` | Rust path attempted + recorded; `web:dom` is ts-only so Rust emit of a browser.fab is doubly out; TS lane is the proven lane; R2 sha-equality documented | radix lane |
| **D1** — generic user-type construction blocked | — | The concrete behavior plan is app-typed (U3); the kernel owns non-generic carriers only; Branch A re-spike is a campaign option gated on D1 landing | radix lane |
| **G5/G6** — verb/identifier collisions (`mount`/`replace`/`dispose` + new identifiers) | `fix:g5` | Probed collision-free; colliding verbs escalated, never silently renamed (the `html` → `html_visus` precedent) | radix lane |
| **TS emitter observations** — elif-chain ternary, backslash double-escape, E0382 move | `fix:ts-emitter` | Workarounds held (sequential-independent-ifs + ascii-literal interpolation); fragile against emitter changes | radix lane |
| **snapshot-nomen-collision** — local class names sharing kernel type names | `fix:snapshot-nomen-collision` | Stage 2 workaround held; new Stage 3 identifiers avoid kernel type names | radix lane |

Every Stage 3 unit that applies a workaround marks it `fix:<defect-id>` at
the site (decision D2); removal after each radix fix is a grep-replace, and
the Stage 3 closeout re-check records the re-confirmed status.

---

## Open Questions For Mind

| # | Question | Default | Who |
|---|---|---|---|
| Q1 | Seam call shape: the campaign's conceptual `mount(Scope, Program, Theme)` decomposes, under the D1 constraint, into `mount(dom.Scope, Visus, Thema)` with the message-typed behavior plan attaching app-side through the `data-tela` seam. Acceptable as the pinned Stage 3 seam call shape? | Pin the decomposed shape; record the D1 rationale | Mind (confirm) |
| Q2 | Interactive proof location: keep the segmented-control proof in the two-package benchmark (`tela/proof/benchmark/canary-app`, the Stage 1/2 pattern) vs a dedicated `examples` package (the campaign scope table routes "interactive proofs → examples"). | Keep in the benchmark for Stage 3; `examples` migration is a later routing option | Mind (confirm) |
| Q3 | Proof vehicle: the node dom-shim (the WEB5 fake-dom precedent) as the mount/update runtime gate vs a real-browser driver (browser automation — new tooling, racy, out of the current harness family). | Node dom-shim; bounded state-level assertions | Mind (confirm) |
| Q4 | `web:dom` dialect gap: if the en→la cross-package check fails, route a radix/faber-web repair delivery vs record + work around at the harness level. This delivery defaults to record + escalate (never weaken, never duplicate the host contract). Acceptable? | Record + escalate; no `web:dom` copy in tela | Mind (confirm) |

## Residuals (routed, not Stage 3 work)

- **D1 / G4 / G5 / CODEGEN001 / TS-emitter / snapshot-nomen-collision fixes
  + the NEW `web:dom` locale/dialect observation** → radix lane (Mind routes
  minimized deliveries; repros under `tela/spike/defects/`). Stage 3 applies
  the recorded workarounds with `fix:<id>` markers; removal is grep-replace
  after each fix; the Stage 3 closeout re-check records the re-confirmed
  status.
- **TS async `@ futura`/`fac`/`cape` codegen gap** → routed (this delivery's
  Async-gap Routing): synchronous-only Stage 3 proofs; fetch-driven/async
  update claims remain **blocked** until a minimized radix compiler delivery
  lands. Not assumed, not claimed.
- **Real-browser verification** (layout, scroll fidelity, pointer fidelity
  beyond the shim's state-level surface) → deferred; the node dom-shim is the
  Stage 3 proof vehicle.
- **Renderer-host interface** (one abstraction below component semantics) →
  deferred until a second consumer asks (behavior-design §5).
- **Branch A re-spike** → campaign option, gated on radix D1 landing.
- **Independent extension-package proof** → Stage 4 (consumes the locked
  theme/assembly/token surfaces + the Stage 3 lifecycle through public
  contracts only).
- **Reference catalog, theme variants beyond tokens** → Stage 5+.
- **Speculum migration + duplicate-IR removal** → Stage 7.
- **Capability-truth finalization, versioning, publication** → Stage 8.
