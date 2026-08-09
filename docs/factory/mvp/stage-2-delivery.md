# Stage 2 — Style And Theme Protocol — Delivery Spec

**Status**: planned (delivery lowering complete)
**Planner**: planner-1
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` (Stage 2 — "Style And Theme Protocol", lines 274–285)
**Control-plane repo**: `/Users/ianzepp/work/faberlang/tela` (Stage 2 cwd, locked by `stage-0-ownership.md` U0)
**Baseline carried from Stage 1**: landed kernel `tela/src/tela.fab` (U1 `5bc797e` + U3 `05909f7`), validation `tela/src/valida.fab` (U2 `836965c` + closeout repair `4c00192`), docs `tela/AGENTS.md` (U4 `20d9bfd` + reconcile `d4ad577`), benchmark packages `tela/proof/benchmark/` (U5 `d71e29f`), harnesses `tela/scripta/` (U6 `e8fb083`), determinism evidence `stage-1-determinism.md`; policy locks (a)–(e) from `stage-0-protocol-policies.md`; Stage 1 closeout residuals `stage-1-closeout.md` §3/§4 and `tela-closeout.md` §4.
**Mode**: planning artifacts only. This spec lowers the stage; it does not implement.
**Closeout owner**: the tela `CAMPAIGN.md` status lines (Stage 2 stage-line update + the leading-clause flip to accepted) are owned by the **Mind-routed Stage 2 closeout** (workflow step 6), **not** by any unit in this spec and **not** by Stage 2's first unit (decision recorded in Coordination Constraints §6).

---

## Phase Intent

Turn the Stage 2 campaign gate into discrete, one-Hand-per-unit implementable
units. Stage 2 adds the **style and theme protocol** to the landed Stage 1
kernel: theme/token values and rendering, namespaced-extension tokens, cascade
ordering, and deterministic product assembly — so Stage 3 (browser mount and
update lifecycle) and Stage 4 (independent extension package proof) start
against a resolved visual-role contract and a deterministic cascade.

What Stage 2 is **not**: no browser mount/behavior lifecycle (Stage 3), no
`@layer`-syntax CSS model beyond v1 scope, no reference component catalog
(Stage 5+), no Speculum migration (Stage 7), no `faber-web` / `radix` source
edits, no radix-lane defect fixes (this stage records workarounds with
`fix:<defect-id>` markers; the radix lane owns the fixes).

---

## Interpreted Scope

Per the Stage 2 gate and campaign §3/§4/§5/§7, Stage 2 must deliver:

1. **Theme protocol values** — a theme supplies semantic values, not component
   markup (campaign §5): kernel-owned token/theme value types, a small core
   token baseline, and theme resolution that renders CSS custom properties at
   a selected root. Two materially different themes render the same component
   tree with no component changes.
2. **Namespaced extension tokens** — extension libraries add namespaced tokens
   such as `chart.axis.muted` without widening a closed `Theme` genus
   (campaign §5). The U5-proven seam (extension-local token classes with
   zero-arg accessors) is the token surface; it is **not gated on radix G4**
   (decision D1, Coordination Constraints §1).
3. **Token rendering** — the declared token `chart.axis.muted` renders as the
   CSS custom property `--chart-axis-muted` at the selected root
   (`:root`), with the dotted-path → dashed-property mapping locked as the
   rendering convention (U5 already consumes `var(--chart-axis-muted)`).
4. **Fail-closed token/rule output** — duplicate token identities with
   different content, missing required tokens, invalid token names, invalid
   rule/declaration output, dependency cycles, and duplicate bundle identities
   with different content reject (no output); identical duplicates dedup
   (campaign §4/§5; policy (e)).
5. **Product assembly with cascade ordering** — `assemble(...)` (campaign §7
   renderer contract) deduplicates style bundles by stable identity and orders
   extension packages by dependency-graph topological order with stable
   package-identity tie-breaking (policy (e)); cascade layers emit in the
   campaign §4 order (reset / tokens / components / library packages /
   application). Deterministic output.
6. **Deterministic theme-rendered composition evidence** — the two-theme
   composition output builds twice and is byte-for-byte identical (fail-closed;
   extends the Stage 1 `check-determinism` gate).
7. **Gate-owned runtime verification** — exempla runtime verification becomes
   gate-owned in `check-exempla` (auditor residual R1, Coordination
   Constraints §3): the theme exempla execute, not just typecheck.

Coordination constraints carried in (not inventing new scope):

- **G4 compose-without (Mind decision, need `fe106e37`)** — Stage 2 composes
  WITHOUT cross-package Visus-returning helper export. The `bar_metrum_app`
  precedent (U5) is the extension seam: extension packages contribute tokens +
  style bundles; applications compose with `tela` constructors. G4's fix stays
  on the radix-lane defect sprint. The namespaced-extension token surface is
  NOT gated on G4 — token accessors (`ext.chart_axis_muted()`,
  `ext.chart_stilum()`) already resolve cross-package
  (`stage-1-benchmark-static.md` §3).
- **CTO-6 `fix:<defect-id>` anti-fossilization discipline** — every applied
  radix-lane workaround in Stage 2 authorship is marked `fix:<defect-id>` at
  the site (G4, G5, CODEGEN001, TS-emitter observations), so removal is a
  grep-replace after each radix fix lands (Coordination Constraints §2).
- **CODEGEN001 Rust-lane block persists** — `radix emit -t rust` of any
  import-bearing file fails the provider-module locale-propagation defect.
  Theme rendering is proven on the **TS lane (the proven runtime lane)**; the
  Rust path is attempted and recorded, never the gate.
- **The Rust-lane sha-equality check activates when CODEGEN001 lands**
  (stage-1-determinism.md §6) — the Rust-lane determinism capture must equal
  the TS-lane capture (Coordination Constraints §4).
- **No CAMPAIGN.md edits by units** — the acceptance flip belongs to the
  Stage 2 closeout (Coordination Constraints §6).

---

## Normalized Spec

Stage 2 produces, in the `tela` repo: kernel theme/token values + rendering +
product assembly (extending the one flat kernel module `tela/src/tela.fab` —
the G4-safe shape), theme/assembly exempla, a two-theme benchmark composition
(extension + application) rendered on the TS lane, a theme-protocol design
record + AGENTS.md updates, and extended package-test harnesses
(`check-exempla` gains a runtime gate; `check-determinism` extends to the
two-theme composition) with deterministic double-build evidence.

Locked decisions this spec freezes (from Stage 0/1, or recorded here; not
invented):

- **Kernel shape**: theme/token/assembly types live in the existing **one flat
  kernel module** `tela/src/tela.fab` (G4-safe shape, Stage 1 convention).
  `Stilum`/`Regula`/`Declaratio` are used **as-is** from U3's kernel — no
  shape change. No new provider module for theme/assembly: public signatures
  referencing `tela.*` types across a second module would re-expose the G4
  skip risk for no benefit.
- **Token type**: kernel-owned `Scopulum { nomen, valor }` — the U5-proven
  spelling (`proof/benchmark/extension-lib/src/extension.fab` declares the
  same shape locally). Kernel-owned constructors over the public values
  (G3 posture). The **core token baseline** is a small interoperable set from
  campaign §5 (`surface.*`, `text.*`, `border.*`, `accent.*`, `state.*`,
  `space.*`, `radius.*`, `type.*`, `motion.*`) — the v1 subset is pinned by
  the implementing Hand in the module header + design record (U4 reconciles),
  kept honest and small.
- **Theme value**: kernel-owned `Thema` (Faber-Latin protocol type) carrying a
  name + token collection (e.g. `Thema { nomen, scopuli }`). Two materially
  different themes = two `Thema` values over the same component tree. Theme
  constructors are kernel-owned ordinary functions.
- **Token rendering convention (locked)**: token `nomen` is a dotted path
  (`chart.axis.muted`); the CSS custom property is `--` + nomen with `.`
  → `-` (`--chart-axis-muted` — the U5-consumed spelling). Rendering emits
  custom properties at a **selected root**: the `:root` selector (campaign §5
  "emits CSS custom properties at a selected root"). Rendered as a
  `Regula { selector = ":root", … }` whose `Declaratio` values are the
  resolved tokens.
- **Missing required tokens reject** — theme resolution validates that the
  theme's token collection covers the core baseline's required tokens before
  emitting an application artifact; missing required tokens → fail-closed
  (no output), exercised by exempla.
- **Theme renderer verb**: English per policy (b), collision-checked against
  G5/G6 (enum-member bindings + reserved keywords). Default verb:
  `thema_css(Thema) → string` (emits the `:root` token layer). If the
  implementing Hand finds a cleaner verb that survives the collision check, it
  must be recorded and reconciled in U4; a colliding verb is **escalated,
  never silently renamed** (the G5/G6 rule).
- **Product assembly**: `assemble(...) → Stilum` (English verb, campaign §7) —
  a **pure function over explicit inputs**: the package-order map
  (`list<`(package identity, dependencies)`>`), the collected style bundles
  with stable identities, the selected theme, and an optional reset bundle.
  Output: one ordered `Stilum` whose `regulae` are grouped in cascade-layer
  order (reset → tokens → components → library packages → application). The
  existing `css(Stilum)` renders it; **layer ordering is emission order**
  (later rules win — the deterministic cascade guarantee). `@layer` at-rule
  syntax is **not** modeled in v1 (policy (c) "as the model grows"; recorded
  as deferred in the design record).
- **Assembly fail-closed surface**: dependency cycles reject; duplicate bundle
  identities with different content reject; duplicate token identities with
  different content reject; identical duplicates dedup (stable-identity
  dedup — campaign §3/§4, policy (e)); invalid token/rule/declaration output
  rejects before emission. All exercised by exempla.
- **Extension token surface (compose-without)**: extension packages declare
  tokens in their **own local token class** (G4-safe, U5-proven) and expose
  them through zero-arg accessors; the application collects them into kernel
  `Thema` values. No cross-package Visus-returning helper is called. The
  extension keeps its seams; no duplicated `Visus` exists in the extension.
- **Determinism posture**: assembly, theme resolution, and rendering are pure
  functions over ordered lists (author order preserved, no unordered/hash
  iteration, no timestamps). Proven empirically by the extended
  `check-determinism` (double-build, byte-identical, fail-closed).
- **Two-theme proof shape**: the extended canary runner prints the (theme-
  independent) HTML once and the full cascade CSS under each theme. The
  evidence record asserts: identical HTML under both themes (byte-compare) and
  materially different token layers. Proved on the **TS lane** (assembled
  single-module runner + `node` execution — the proven Stage 1 U5/U6 lane);
  the Rust lane is attempted and the CODEGEN001 block recorded (never the
  gate).

---

## Goal-check Summary (goal-check on the Stage 2 campaign section)

- **Artifact reviewed**: `tela/docs/factory/mvp/CAMPAIGN.md` § "Stage 2 —
  Style And Theme Protocol" (lines 274–285), with supporting policy locks
  `stage-0-protocol-policies.md` (c) + (e), the Stage 1 closeout residuals,
  and the landed Stage 1 kernel/harness baseline.
- **Evaluator mode**: self-contained cold pass (planner-1, the lowerer, also
  the checker — single-lane planning; the independent pass remains the
  auditor's at the stage closeout).
- **Intended next consumer**: `delivery` lowering (this spec).
- **Handoff bar used**: campaign delivery readiness — the gate must be
  specific, grounded, architecturally decided, bounded, and testable enough
  that a mid-tier implementing Hand can execute units without inventing scope.
- **Verdict**: **READY**.
- **Reasoning**: The gate's six bullets (two materially different themes on one
  component tree; namespaced extension tokens; fail-closed duplicate/invalid
  token and rule output; bundle dedup + topo-order + stable-identity
  tie-breaking assembly; cycle/conflict rejection; deterministic output) are
  concrete and map 1:1 to unit surfaces. The architecture is already decided
  by the campaign §4/§5/§7 contracts and the policy locks (c)/(e); the
  implementing surface is grounded in landed Stage 1 artifacts (`Stilum`/
  `Regula`/`Declaratio`, `Scopulum`-shape tokens in the benchmark, the
  `check-determinism`/`check-exempla` harnesses, the TS-lane runtime lane).
  The only open decisions at check time (token-name mapping, selected root,
  layer names, reset-by-default, theme renderer verb) are **non-blocking**
  because this delivery locks defaults for each (Normalized Spec; Open
  Questions for Mind carries only the ones needing Mind's word). No material
  boundary, stop condition, or acceptance criterion is missing.
- **Key points**:
  - Gate bullet → surface mapping is 1:1 and grounded in landed files (kernel
    module, benchmark packages, harnesses) — no new architecture guesswork.
  - The G4 compose-without default (Mind decision `fe106e37`) removes the one
    dependency that could have blocked the namespaced-token gate — the token
    surface already resolves cross-package today.
  - The only genuine residual risk (CODEGEN001 Rust-lane block) has a recorded
    workaround + fallback lane from Stage 1; the TS lane is the proven runtime
    lane and the gate's deterministic evidence runs there.
  - Validation for every bullet is named (exempla, harnesses, byte-identical
    double-build) — the stage is testable without hidden chat context.

---

## Repo-Aware Baseline

Verified by planner-1 (2026-08-09):

- **`tela/`** — sibling git repo on `main`, clean at `10e7b5b` (Stage 1
  closeout). Contents (all Stage 1-landed, commit-verified in
  `stage-1-closeout.md`): `faber.toml`; `src/tela.fab` (Branch B kernel +
  escaping + HTML/CSS serializers + `Stilum`/`Regula`/`Declaratio`);
  `src/valida.fab` (fail-closed string/bool predicates, `img` repair landed);
  `exempla/validation.fab` + `exempla/serializer.fab`; `scripta/check-compile`,
  `scripta/check-exempla`, `scripta/check-determinism`; `docs/design/
  identity-hydration.md`; `AGENTS.md`; `proof/benchmark/extension-lib/`,
  `proof/benchmark/canary-app/`, `proof/benchmark/libhome/` (U5); `spike/`
  (frozen Stage 0 evidence — no unit writes); `docs/factory/mvp/` (campaign +
  stage-0/1 records). `.gitignore` covers `build/`.
- **Kernel surface Stage 2 extends** — `tela.fab` currently: `Spatium`,
  `Attributum`, `Proprietas`, `Identitas`, `union Visus`, kernel constructors,
  `escapa`, `valida_arbor`, `seri_*`, `html_visus`, `css(Stilum)` with
  `Stilum { list<Regula> regulae }`, `Regula { selector, declarationes }`,
  `Declaratio { nomen, valor }`. The kernel imports `tela:valida` (one
  same-package sibling import; G4-safe surface). Theme/assembly extension
  keeps this shape.
- **Extension seam proven (U5 record §3)** — `ext.chart_axis_muted() → Scopulum`
  (extension-local type) and `ext.chart_stilum() → tela.Stilum` **resolve**
  cross-package; `ext.bar_metrum() → tela.Visus` is **skipped**
  (`WARN014.file_interface_export_skipped` — G4). The app composes the meter
  via `bar_metrum_app` with `tela` constructors (the G4 compose-without
  precedent). Token declared: `Scopulum { nomen = "chart.axis.muted",
  valor = "#6b7280" }`, consumed as `var(--chart-axis-muted)` by both bundles.
- **Harness mechanics (Stage 1 U6)** — `check-determinism`: Rust primary path
  attempted + recorded BLOCKED (CODEGEN001), TS-lane assembled composition
  runner as the proven fallback, `cmp` fail-closed, sha256 evidence in
  `build/hashes.txt` (current sha `a0f1b1cb…f8613b`). `check-exempla`: radix
  check + TS emit + assemble + `tsc --noEmit` per exempla (no runtime run —
  the auditor residual R1 makes the Stage 2 runtime gate explicit).
- **Radix binary** — in-tree `radix/target/debug/radix` (0.80.0); locale flag
  is `--locale en` (tela harnesses already use it; the renamed
  `--locale-pack` spelling errors on 0.80.0).
- **Cargo discipline** — no workspace cargo suites in any unit. Rust-lane
  checks/`cargo run` run in scratch dirs outside the shared workspace
  (`/tmp/…`), mirroring Stage 1 U6. Full radix ladder stages 4–6 / `--e2e`
  remain auditor-owned.
- **Concurrent workers** — none expected inside `tela/` during Stage 2 (this
  stage owns the repo; Stage 1 is closed). Sibling repos are read-only here;
  no cross-repo write scope in this stage.
- **Speculum overlap rule** — unchanged: `faberlang.dev`'s `document_ir.fab`
  is not a copy source (Stage 7 migration imports `tela:*` publicly). The
  style/theme contract derives from the campaign §4/§5 sketches, the policy
  locks, and Tela's own landed kernel.

---

## Coordination Constraints (record, don't invent)

1. **D1 — G4 compose-without default (Mind decision `fe106e37`)**: Stage 2
   composes WITHOUT cross-package Visus-returning helper export. Extension
   packages contribute tokens + style bundles (the proven
   `chart_axis_muted`/`chart_stilum` seam); applications compose with `tela`
   constructors (`bar_metrum_app` precedent). G4's fix (WARN014
   `file_interface_export_skipped`) stays on the **radix-lane defect sprint**.
   **The namespaced-extension token surface is NOT gated on G4.** A unit that
   hits a cross-package helper-export need records the workaround
   (`fix:g4` marker) and the escalation — it does not weaken the contract and
   does not wait for the radix fix.
2. **D2 — CTO-6 `fix:<defect-id>` workaround-marker discipline**: every applied
   radix-lane workaround in Stage 2 authorship carries a `fix:<defect-id>`
   marker at the workaround site and in the module header. Known markers for
   Stage 2: `fix:g4` (cross-package Visus-returning helper export skip),
   `fix:g5` (`html` verb collision → `html_visus`), `fix:codegen001`
   (provider-module locale propagation → Rust emit-across-imports block), and
   `fix:ts-emitter` (TS emitter observations: elif-chain ternary return,
   backslash double-escape). After each radix fix lands, removal is a
   grep-replace of the marker — the anti-fossilization contract (CTO-6
   finding; recorded in U4's AGENTS.md updates and every unit's module-header
   requirement). A workaround that touches a **contract surface** is recorded
   and escalated (never silently absorbed into the API).
3. **R1 — auditor residual: gate-owned runtime verification**: exempla runtime
   verification is currently implementer-claimed, not gate-owned
   (stage-1-determinism.md §5.2). Stage 2's theme rendering is runtime
   behavior on the proven TS lane, so `check-exempla` gains a **runtime
   execution gate**: the assembled theme/assembly exempla run under `node`
   (assertions execute) in addition to `tsc --noEmit`. This makes the Stage 2
   runtime claims gate-owned (U5).
4. **R2 — Rust-lane sha-equality when CODEGEN001 lands**: once the radix
   provider-module locale-propagation fix lands, `check-determinism`'s Rust
   primary path activates automatically; the Rust-lane capture must equal the
   TS-lane capture (sha equality) — stage-1-determinism.md §6. The Stage 2
   determinism record restates this and records the pre-fix status
   (Rust attempted + BLOCKED, TS-lane fallback evidence).
5. **Escalation path — radix-lane defects**: G4/G5/CODEGEN001/TS-emitter
   observations are radix-lane work, routed To mind (repros live under
   `tela/spike/defects/` where applicable; U3/U5/U6 Stage 1 records carry the
   evidence). Stage 2 units apply the recorded workarounds with `fix:<id>`
   markers and never weaken the Tela contract.
6. **D3 — CAMPAIGN.md acceptance flip (decided and recorded)**: the Stage 2
   stage-line status update AND the leading-clause flip to accepted are owned
   by the **Mind-routed Stage 2 closeout** (workflow step 6: consequences +
   correctness + independent audit), **not** by Stage 2's first unit. Every
   unit in this spec leaves `CAMPAIGN.md` untouched — consistent with the
   Stage 0/1 convention ("the closeout owns the status line"). Acceptance is a
   step-6 decision, not an implementation artifact.

---

## Ordered Unit Graph

```
Wave 1:  U1 theme-token-protocol (kernel: Scopulum/Thema/core baseline/rendering/fail-closed)
Wave 2:  U2 product-assembly-cascade (kernel: assemble + dedup + topo order + cascade layers + reject)  ∥  U4 docs (theme-protocol record + AGENTS.md)
Wave 3:  U3 two-theme-composition (benchmark: second theme + same-tree render under both, TS lane)
Wave 4:  U5 harnesses-determinism (check-exempla runtime gate + check-determinism extension + evidence)
```

Shared-file constraint: the kernel module `tela/src/tela.fab` is extended by
U1 (theme/token types + constructors + rendering), then extended by U2
(assembly + cascade ordering) — these two are **strictly sequential** (the
honest cost of the one-flat-kernel G4-safe shape, as in Stage 1's U1→U3).
Docs (U4) run parallel to U2, bound to the locked surface. The composition
(U3) needs both U1 and U2. Harnesses + determinism (U5) need the composition.
Waves give 2-way parallelism in wave 2 only; Mind may serialize further if
slot capacity prefers.

| # | Unit | Wave | Depends on |
|---|---|---|---|
| U1 | `tela-s2-u1-theme-token-protocol` | 1 | none (Stage 1 kernel baseline) |
| U2 | `tela-s2-u2-product-assembly-cascade` | 2 | U1 |
| U4 | `tela-s2-u4-docs` | 2 | U1 |
| U3 | `tela-s2-u3-two-theme-composition` | 3 | U1, U2 |
| U5 | `tela-s2-u5-harnesses-determinism` | 4 | U3 |

---

## Units

### U1 — `tela-s2-u1-theme-token-protocol`

| Field | Value |
|---|---|
| `id` | `tela-s2-u1-theme-token-protocol` |
| `outcome` | The kernel owns the theme/token protocol: token and theme value types, a small core token baseline, token rendering (dotted path → CSS custom property at a selected root), theme resolution with missing-required-token rejection — all fail-closed, deterministic, in the one flat kernel module. |
| `write_scope` | `tela/src/tela.fab` (extend — theme/token types + kernel-owned constructors + rendering + fail-closed pre-pass; module header gains the `fix:<id>` markers for any applied workaround); `tela/exempla/thema.fab` (new — exempla-mode, `+++` frontmatter, locale `en`) |
| `read_scope` | `tela/docs/factory/mvp/CAMPAIGN.md` §5 (theme protocol) + lines 274–285 (Stage 2 gate); `tela/docs/factory/mvp/stage-0-protocol-policies.md` policies (b)/(c)/(e); `tela/proof/benchmark/extension-lib/src/extension.fab` (proven `Scopulum` shape + accessor seam); `tela/proof/benchmark/canary-app/src/main.fab` (`var(--chart-axis-muted)` consumption); Stage 1 kernel `tela/src/tela.fab` (existing `Stilum`/`Regula`/`Declaratio`, `css`, G5/G6 collision notes) |
| `done_when` | (a) Kernel gains `Scopulum { nomen, valor }` (U5-proven spelling) and a `Thema` value type (Faber-Latin protocol type carrying a name + `list<Scopulum>` token collection), with kernel-owned ordinary-function constructors (G3 posture). (b) The **core token baseline** is defined as a small interoperable kernel-owned collection from campaign §5 (`surface.*`, `text.*`, `border.*`, `accent.*`, `state.*`, `space.*`, `radius.*`, `type.*`, `motion.*` — v1 subset pinned in the module header; no closed-enum widening by libraries). (c) **Token rendering convention locked**: `nomen` dotted path (`chart.axis.muted`) → CSS custom property `--` + nomen with `.` → `-` (`--chart-axis-muted`); rendering emits a `Regula { selector = ":root", … }` (the selected root) whose `Declaratio` values are the resolved tokens. (d) **Theme resolution + fail-closed**: `thema_css(Thema) → string ∪ null`-shaped renderer (or a cleaner verb that passes the G5/G6 collision check — English per policy (b); a colliding verb is escalated, never silently renamed); a theme missing a required core token → null (no output); invalid token name (not a valid dotted-path / custom-property lexical shape) → null. (e) Both-lane green: `radix check` on the extended `tela.fab` + `exempla/thema.fab`; TS emit + `tsc --noEmit` (import-free kernel emit + assembled exempla per the `check-exempla` wiring); Rust emit of the import-free kernel + scratch-dir `cargo check` (import-bearing Rust remains CODEGEN001-blocked — record the attempt with `fix:codegen001`, do not weaken). (f) Exempla `exempla/thema.fab` cover: a token renders as `--chart-axis-muted: #6b7280` under `:root`; a dotted-path → dashed mapping edge (multi-dot path); a theme missing a required core token rejects (fail-closed); an invalid token name rejects; two materially different `Thema` values (e.g. light/dark palettes) resolve against the same tree. (g) Module header + exempla header record the `fix:<id>` markers applied (G5 verb collision if the theme verb collides; TS-emitter observations if they bite) and the D2 discipline (record + escalate; never silently rename/weaken). |
| `validation` | `radix check` (`--locale en`) on the extended kernel + exempla; TS lane emit + assemble + `tsc --noEmit` (existing `check-exempla` wiring); Rust lane: import-free kernel emit + scratch `cargo check` outside the shared workspace (CODEGEN001 block recorded, `fix:codegen001`); `git diff --check` in `tela/`. |
| `depends_on` | none (Stage 1 kernel baseline) |
| `non_goals` | No product assembly / cascade ordering / bundle dedup (U2). No two-theme composition (U3). No harness changes (U5). No `@layer` at-rule model (policy (c) growth; recorded deferred). No theme variants beyond token collections (light/dark/high-contrast/reduced-motion variants are tokens, not new machinery). No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Medium.** Theme/token semantics are new surface but grounded in the U5-proven token shape; residual risk is verb collisions (G5/G6) and the CODEGEN001 Rust-lane block — both have recorded workarounds + escalation paths. The kernel module grows; keep the flat-module shape. |
| `est_work_tokens` | 6–10k |
| `test_owner` | Unit Hand (exempla + lanes); reviewer (token-rendering convention + fail-closed surface cross-check against campaign §5 and policy (c)). |

### U2 — `tela-s2-u2-product-assembly-cascade`

| Field | Value |
|---|---|
| `id` | `tela-s2-u2-product-assembly-cascade` |
| `outcome` | Product assembly in the kernel: `assemble(...)` deduplicates style bundles by stable identity, orders extension packages by dependency-graph topological order with stable package-identity tie-breaking (policy (e)), emits the cascade in the campaign §4 layer order, and rejects cycles / duplicate-identity-different-content / invalid output fail-closed — deterministic. |
| `write_scope` | `tela/src/tela.fab` (extend — `assemble` + cascade-layer grouping + fail-closed assembly pre-pass; module header workaround markers); `tela/exempla/assemble.fab` (new) |
| `read_scope` | `tela/docs/factory/mvp/CAMPAIGN.md` §4 (style protocol: layer order, dedup, topo order, tie-break, reject) + §7 (`assemble(Product) → ProductAssets`); `tela/docs/factory/mvp/stage-0-protocol-policies.md` policy (e) (the locked ordering rule); U1 kernel surface (theme/token types) |
| `done_when` | (a) `assemble(...) → Stilum` — a pure function over explicit inputs: the package-order map (`list<`(package identity, dependency list)`>`), the collected style bundles with stable identities (including the theme's rendered token layer and any reset bundle), and the selected theme. Output: one ordered `Stilum` grouped in cascade-layer order — `tela.reset` (only when a reset bundle is provided — **v1 ships no reset by default**; decided here per campaign §4 "whether reset styles ship by default"), `tela.tokens` (the rendered `:root` token layer), `tela.components`, then extension/library packages in topo order, then `application` last. Layer names recorded in the module header + design record. (b) **Bundle dedup by stable identity** (repeated component instances do not repeat stylesheet text — campaign §3/§4). (c) **Extension-package ordering**: dependency-graph topological order, then stable package identity as the deterministic tie-break (policy (e)); the topo algorithm is ordinary Faber over the explicit package-order map (stdlib-only — no import introspection). (d) **Fail-closed**: dependency cycles reject; duplicate bundle identities with different content reject; duplicate token identities with different content reject; identical duplicates dedup; invalid rule/declaration output (invalid selector/name/valor lexical shape) rejects before emission. (e) The existing `css(Stilum)` renders the assembled product; **layer ordering is emission order** (later wins — the deterministic cascade guarantee; `@layer` at-rule syntax not modeled in v1, recorded deferred). (f) Exempla `exempla/assemble.fab` cover: dedup (two identical bundles → one); topo order (a depends-on-b → b precedes a); tie-break (unrelated packages ordered by stable identity); cycle rejection; duplicate-identity-different-content rejection; layer order (reset → tokens → components → libraries → application) with and without a reset bundle; invalid rule rejection. (g) Both-lane green per the U1 pattern; Rust import-bearing emit attempted + CODEGEN001 recorded (`fix:codegen001`). (h) Module header records the `fix:<id>` markers applied (G5/G6 collision check on `assemble` verb — `assemble` is not reserved; TS-emitter observations if they bite). |
| `validation` | `radix check` (`--locale en`) on the extended kernel + `exempla/assemble.fab`; TS lane emit + assemble + `tsc --noEmit`; Rust lane import-free kernel emit + scratch `cargo check` (CODEGEN001 recorded); `git diff --check`. |
| `depends_on` | U1 |
| `non_goals` | No two-theme composition (U3). No harness changes (U5). No `@layer` at-rules. No package-graph introspection beyond the explicit input map. No real multi-package ordering proof beyond the exempla + benchmark (the benchmark is two packages; the general algorithm is proven by exempla). No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Medium–High.** The topo-sort + dedup + fail-closed algorithm is the most algorithmic surface in the stage; residual risk is expressing the general ordering rule in ordinary Faber (stdlib lists) — mitigated by exempla-first development (small honest algorithm, exercised cases). CODEGEN001 Rust-lane block persists (`fix:codegen001`). |
| `est_work_tokens` | 6–10k |
| `test_owner` | Unit Hand (exempla + lanes); reviewer (assembly fail-closed surface + policy (e) rule cross-check — ordering, tie-break, reject semantics). |

### U3 — `tela-s2-u3-two-theme-composition`

| Field | Value |
|---|---|
| `id` | `tela-s2-u3-two-theme-composition` |
| `outcome` | The benchmark composition renders the **same component tree under two materially different themes** with no component changes: the extension contributes a second theme's tokens, the app assembles two `Thema` values (light + dark) and renders the full cascade under each on the TS lane — the campaign gate bullet 1 + 2 proof. |
| `write_scope` | `tela/proof/benchmark/extension-lib/src/extension.fab` (extend — a second, materially different token collection, e.g. dark/`tenebrae`, extension-local token class, zero-arg accessor per the G4-safe seam); `tela/proof/benchmark/canary-app/src/main.fab` (extend — build two `Thema` values from the core baseline + extension tokens, render the same arbor's HTML once and the full cascade CSS under each theme); `tela/docs/factory/mvp/stage-2-two-theme-composition.md` (new evidence record) |
| `read_scope` | U1 kernel (theme/token types + rendering); U2 kernel (assembly); `tela/proof/benchmark/extension-lib/src/extension.fab` + `tela/proof/benchmark/canary-app/src/main.fab` (Stage 1 composition + `bar_metrum_app` precedent); `tela/docs/factory/mvp/stage-1-benchmark-static.md` (seams + G4 record) |
| `done_when` | (a) The extension defines a second materially different token collection (e.g. dark palette: different `chart.axis.muted` value + any additional namespaced tokens the Hand deems honest for "materially different") as extension-local tokens with zero-arg accessors (`fix:g4` marker only if a cross-package helper-export need surfaces — the token surface must NOT wait on G4). (b) The app builds two `Thema` values — light + dark — each from the core baseline + the extension's tokens, collected app-side into kernel values (compose-without; no cross-package Visus-returning helper call; the extension keeps its `bar_metrum` seam unused by the app, as in Stage 1). (c) The **same arbor** renders: HTML is theme-independent (one render, or two renders byte-identical in the HTML section); the full cascade CSS renders under each theme via `assemble` + `css` — the token layer differs materially between themes, component/library/application bundles are identical. (d) The runner prints: the HTML, theme-A CSS, theme-B CSS (the U5/U6 runner shape). Primary path: TS-lane assembled single-module runner + `node` execution (the proven runtime lane). Rust path: `radix emit -t rust` on the app attempted + CODEGEN001 recorded (`fix:codegen001`); never the gate, never weakened. (e) Evidence record `stage-2-two-theme-composition.md` documents: the two themes, the byte-identical HTML under both (byte-compare asserted), the materially different token layers, the exercised extension-token seam (namespaced tokens collected + rendered — gate bullet 2), the G4 compose-without outcome (tokens resolved; no helper-export dependency), and the U5 double-build hook. (f) Both packages pass `radix check` under the benchmark libhome (`FABER_LIBRARY_HOME=tela/proof/benchmark/libhome`). (g) `git diff --check` in `tela/`. |
| `validation` | `radix check` both benchmark packages under the benchmark libhome; TS-lane assembled run under `node` (actual rendered output — not a hand-trace); reviewer package-boundary + seam check (extension is separate; tokens resolved cross-package without G4); `git diff --check`. |
| `depends_on` | U1, U2 |
| `non_goals` | No behavior/mount/interactive (Stage 3). No catalog. No `@layer` at-rules. No third theme. No reset-bundle authorship (reset ships by default = no). No writes to `tela/spike/` (frozen Stage 0 evidence). No radix-lane fixes. No `CAMPAIGN.md` edits. |
| `risk` | **Medium.** Two-theme rendering is the gate-critical surface; the runtime proof runs on the proven TS lane. Residual risks: the HTML-under-both-themes byte-compare assertion (if the runner prints HTML once, the evidence records it as theme-independent by construction — recorded, not hidden) and the CODEGEN001 Rust-lane block (recorded, never the gate). |
| `est_work_tokens` | 4–7k |
| `test_owner` | Unit Hand (checks + TS-lane runtime) + reviewer (two-theme gate cross-check: same tree, materially different token layers, no component changes). |

### U4 — `tela-s2-u4-docs`

| Field | Value |
|---|---|
| `id` | `tela-s2-u4-docs` |
| `outcome` | The style/theme protocol is documented for later Hands, reviewers, and the Stage 4 independent-extension gate: theme-protocol design record + AGENTS.md authoring updates (including the `fix:<defect-id>` discipline). |
| `write_scope` | `tela/docs/design/theme-protocol.md` (new); `tela/AGENTS.md` (extend — Stage 2 authoring surface) |
| `read_scope` | U1/U2 landed kernel (token/theme/assembly surface, verbs); `tela/docs/factory/mvp/stage-0-protocol-policies.md` policies (b)/(c)/(e); `tela/docs/factory/mvp/stage-0-ownership.md` (identity); `tela/docs/factory/mvp/CAMPAIGN.md` §4/§5/§7 (style/theme/renderer contracts); Stage 1 records (`stage-1-closeout.md`, `stage-1-determinism.md`) |
| `done_when` | (a) `theme-protocol.md` documents: the token rendering convention (dotted path → `--dashed` custom property; the `:root` selected root); the core token baseline subset (from U1); theme values (`Thema` shape, constructors) and the two-materially-different-themes contract; the extension token surface (extension-local token classes + zero-arg accessors, collected app-side — compose-without, G4-independent); the cascade-layer order (reset [opt-in only] → tokens → components → library packages → application) and the emission-order-is-cascade guarantee (`@layer` at-rules deferred — policy (c) growth); the assembly contract (dedup by stable identity, topo order + stable-identity tie-break, fail-closed reject set — policy (e)); the determinism posture. (b) `AGENTS.md` gains the Stage 2 authoring notes: the `fix:<defect-id>` workaround-marker discipline (G4/G5/CODEGEN001/TS-emitter markers; removal = grep-replace after each radix fix), the theme/token authoring constraints, the assembly input shape, and the two-theme benchmark seam. (c) Docs agree with the U1/U2/U3 emission after they land (verb names, layer names, token mapping); deviations are reconciled within U4 scope or routed. (d) `git diff --check` in `tela/`. |
| `validation` | Reviewer cross-checks docs against policies (b)/(c)/(e), campaign §4/§5/§7, and the landed emission; `git diff --check`. |
| `depends_on` | U1 |
| `non_goals` | No API reference beyond locked surfaces. No Stage 3+ docs. No website/marketing docs. No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Low.** Doc-only; the reconciliation item (c) against U2/U3 emission is the small drift risk. |
| `est_work_tokens` | 3–5k |
| `test_owner` | Reviewer (doc-vs-emission cross-check; `fix:<id>` marker inventory check). |

### U5 — `tela-s2-u5-harnesses-determinism`

| Field | Value |
|---|---|
| `id` | `tela-s2-u5-harnesses-determinism` |
| `outcome` | The package-test surface extends: `check-exempla` gains a **gate-owned runtime execution step** (auditor residual R1), `check-determinism` extends to the two-theme composition, and the deterministic double-build evidence for the theme-rendered composition is on disk (byte-identical, fail-closed). |
| `write_scope` | `tela/scripta/check-exempla` (extend — runtime execution of the assembled theme/assemble exempla under `node`, in addition to `tsc --noEmit`; wiring for `exempla/thema.fab` + `exempla/assemble.fab`); `tela/scripta/check-determinism` (extend — double-build the two-theme composition runner from U3; keep the Rust primary path attempt + CODEGEN001 record); `tela/docs/factory/mvp/stage-2-determinism.md` (new evidence record); `tela/docs/factory/mvp/stage-2-closeout-preparation.md` (optional — only if a closeout-preparation note is needed; otherwise the closeout record itself) |
| `read_scope` | U3 composition runner; U1/U2 exempla; `tela/scripta/check-exempla` + `check-determinism` (Stage 1 wiring — assembly/`node`/`cmp`/sha256 mechanics); `tela/docs/factory/mvp/stage-1-determinism.md` §5/§6 (escalation-path record + Rust-lane sha-equality note) |
| `done_when` | (a) `check-exempla` runs each exempla through `radix check` + TS emit + assemble + `tsc --noEmit` (existing) AND executes the assembled theme/assemble exempla under `node` (assertions run — gate-owned runtime verification, residual R1 closed). (b) `check-determinism` builds the U3 two-theme composition output twice (TS-lane assembled runner; Rust primary path attempted + CODEGEN001 recorded `fix:codegen001`) and byte-compares — a diff FAILS the check (fail-closed); sha256 hashes written to `build/hashes.txt`. (c) `stage-2-determinism.md` records: both hashes, the exact commands, the output description (HTML + two theme CSS cascades), byte-identical required, the two-theme HTML-byte-identity assertion, and the R2 note — when CODEGEN001 lands, the Rust-lane capture must equal the TS-lane capture (sha equality; stage-1-determinism.md §6) and the Rust primary path activates automatically (no harness change). (d) Escalation-path record: CODEGEN001 re-confirmed (radix lane); G4/G5/TS-emitter observations re-checked where the stage touched them (`fix:<id>` markers). (e) Cargo discipline: all cargo in scratch dirs outside the shared workspace; no workspace suites; the closeout runs the harnesses exactly once. (f) `git diff --check` in `tela/`. |
| `validation` | Run `scripta/check-compile` + `scripta/check-exempla` + `scripta/check-determinism` once at closeout; reviewer/auditor re-runs `check-determinism` as the named test owner for the determinism gate (Stage 1 pattern); `git diff --check`. |
| `depends_on` | U3 |
| `non_goals` | No radix ladder stages 4–6 / `--e2e` / release-gate (auditor-owned). No faber packaging. No release claims. No `@layer` at-rules. No `CAMPAIGN.md` edits. No radix-lane fixes. |
| `risk` | **Medium.** The runtime gate (executing exempla under `node`) extends gate scope beyond the Stage 1 typecheck-only surface — the assembled-runner mechanics are proven (U5/U6), so the residual risk is exempla writing runtime-assertions that mismatch emitter behavior (the Stage 1 `img` incident pattern); fail honestly, fix the source or the assert, escalate if it is an emitter defect. CODEGEN001 Rust-lane block persists (`fix:codegen001`). |
| `est_work_tokens` | 4–7k |
| `test_owner` | Unit Hand (harness runs) + closeout auditor (re-runs `check-determinism`; independent audit of the runtime gate). |

---

## Checkpoints And Gates

| Gate | After | Check |
|---|---|---|
| **SG1 — theme/token protocol** | U1 | Kernel owns `Scopulum`/`Thema` + core baseline + rendering (dotted path → `:root` custom properties); missing-required-token and invalid-token reject fail-closed; exempla green through check + lanes; verb collision escalated (not silently renamed); `fix:<id>` markers in place. |
| **SG2 — assembly + cascade** | U2 | `assemble` dedups by stable identity, topo-orders with stable-identity tie-break, emits cascade layers in the §4 order (reset opt-in), rejects cycles / duplicate-identity-different-content / invalid output fail-closed; exempla green; policy (e) honored. |
| **SG3 — two-theme composition** | U3 | Same component tree renders under two materially different themes with no component changes; namespaced extension tokens work (collected + rendered — not gated on G4); TS-lane runtime evidence on disk; HTML byte-identity under both themes asserted. |
| **SG4 — docs** | U4 | `theme-protocol.md` + AGENTS.md document the Stage 2 surface; `fix:<id>` discipline recorded; docs agree with the U1–U3 emission. |
| **SG5 — harnesses + determinism** | U5 | `check-exempla` runtime gate green (gate-owned exempla runtime verification); `check-determinism` byte-identical two-theme double-build evidence on disk with hashes; fail-closed (diff fails); R2 note recorded. |
| **Stage closeout** | all | Campaign workflow step 6: review shared protocol changes with `consequences`, `correctness`, and an independent audit **before** accepting the stage. The closeout owns the Stage 2 stage-line status update AND the leading-clause flip to accepted (decision D3), plus the Stage 2 → Stage 3 selection. |

The Stage 2 gate bullets map 1:1 to the gates above (two materially different
themes render the same tree → SG3; namespaced extension tokens work → SG1 +
SG3; duplicate/invalid token and rule output fails closed → SG1 + SG2;
assembly deduplicates + topo-order + stable tie-break → SG2; cycles and
ambiguous conflicts reject → SG2; output deterministic → SG5).

---

## Validation Summary

| Layer | Command / Flow | Covers |
|---|---|---|
| Kernel semantics | `radix check` on `tela/src/*.fab` (`--locale en`, `FABER_LIBRARY_HOME`) | Theme/token/assembly types + rendering typecheck |
| TS lane | `radix emit -t ts` + assemble + `tsc --noEmit` (import-free kernel; assembled exempla + composition) | Typed values + renderers valid in TypeScript; the proven runtime lane |
| TS-lane runtime | Assembled theme/assemble exempla + the two-theme composition run under `node` (assertions execute) | Gate-owned runtime verification (residual R1 closed); actual rendered output |
| Rust lane | `radix emit -t rust` + scratch-dir `cargo check`/`cargo run` (outside shared workspace) | Import-free kernel green; import-bearing paths attempted + CODEGEN001 recorded (`fix:codegen001`); Rust-lane sha-equality check documented for when the fix lands (R2) |
| Package tests | `scripta/check-compile` + `scripta/check-exempla` (with the new runtime gate) | The tela package test surface |
| Determinism | `scripta/check-determinism` — two-theme composition built twice, byte-compare (sha256) | Byte-identical double-build evidence (fail-closed) |
| Benchmark two-theme | `radix check` both benchmark packages under the benchmark libhome + TS-lane rendered output | Two-materially-different-themes gate (SG3) |
| Doc hygiene | `git diff --check` in `tela/` | Whitespace/conflict hygiene |
| Cargo discipline | No workspace cargo suites; scratch dirs only | Lock ownership (operator rule 2026-08-07) |
| Radix ladder | Not run by Stage 2 units (tela changes do not touch radix); stages 4–6 / `--e2e` auditor-owned | Boundary: no whole-workspace suites |

---

## Escalation Path (radix-lane defects — recorded, not fixed here)

| Defect | Marker | Stage 2 posture | Owner |
|---|---|---|---|
| **G4** — WARN014 `file_interface_export_skipped` for cross-package Visus-returning helpers | `fix:g4` | Compose-without (decision D1): extension tokens + style bundles consumed app-side; no cross-package Visus-returning helper call; token surface NOT gated on G4 | radix defect sprint (Mind routes; repro `tela/spike/defects/`) |
| **G5** — `html` verb collides with `Spatium.html` enum-member binding | `fix:g5` | `html_visus` workaround kept; theme/assembly verbs collision-checked; colliding verbs escalated, never silently renamed | radix lane |
| **CODEGEN001** — provider modules re-analyzed without the en reader locale (Rust emit-across-imports) | `fix:codegen001` | Rust path attempted + recorded each unit; TS-lane assembled runner is the proven lane; Rust-lane sha-equality check documented (R2) | radix lane |
| **TS emitter observations** — elif-chain ternary return, backslash double-escape, Rust E0382 move | `fix:ts-emitter` | Sequential-independent-ifs + ascii-literal interpolation workarounds (Stage 1 records) kept where they bite; fragile against emitter changes | radix lane |

Every Stage 2 unit that applies a workaround marks it `fix:<defect-id>` at the
site (decision D2); removal after each radix fix is a grep-replace, and a
Stage 2 closeout re-check records the re-confirmed status.

---

## Open Questions For Mind

| # | Question | Default | Who |
|---|---|---|---|
| Q1 | Reset styles: does the v1 cascade ship any `tela.reset` bundle by default? This spec decides **no** — the `tela.reset` layer emits only when the assembled product provides a reset bundle (Tela authors no reset stylesheet in this stage). Acceptable? | No reset by default; opt-in layer slot | Mind (confirm) |
| Q2 | Theme variants: campaign §5 names light/dark/high-contrast/reduced-motion. This spec treats all variants as **token collections** (no new machinery) and proves light vs dark in U3. Acceptable as the v1 theme proof? | Variants are tokens; light/dark proof | Mind (confirm) |
| Q3 | Assembly input: this spec makes `assemble` a pure function over an **explicit package-order map** (the app supplies packages + dependencies; stdlib-only; no import introspection). The general ordering rule is proven by exempla; the benchmark stays two-package. Acceptable? | Explicit map; exempla-proven algorithm | Mind (confirm) |
| Q4 | Kernel module growth: theme/assembly extend the single flat `tela/src/tela.fab` (G4-safe shape). A separate provider module would re-expose the cross-module signature-skip risk. Acceptable to keep one flat kernel module for Stage 2? | Extend `tela.fab` | Mind (confirm) |
| Q5 | Wave scheduling: U1 → U2∥U4 → U3 → U5, or serialize when slot capacity is thin? | Waves as written; Mind schedules | Mind |

## Residuals (routed, not Stage 2 work)

- **G4/G5/CODEGEN001/TS-emitter fixes** → radix lane (Mind routes minimized
  deliveries; repros under `tela/spike/defects/`). Stage 2 applies the
  recorded workarounds with `fix:<id>` markers; removal is grep-replace after
  each fix; a Stage 2 closeout re-check records the re-confirmed status.
- **Rust-lane sha-equality check** → activates when CODEGEN001 lands
  (stage-1-determinism.md §6); recorded in `stage-2-determinism.md` (U5).
- **Browser mount, segmented control, behavior plan (`Vinculum`/`Eventum`),
  hydration matching, host effects** → Stage 3 (binds to the `data-tela` seam
  and the resolved cascade).
- **Independent extension package proof** → Stage 4 (consumes the locked
  theme/assembly/token surfaces through public contracts only).
- **Reference catalog, theme variants beyond tokens** → Stage 5+.
- **Speculum migration + duplicate-IR removal** → Stage 7.
- **Capability-truth finalization, versioning, publication** → Stage 8.
