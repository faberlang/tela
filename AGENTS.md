# Tela Agent Instructions

Tela is the public Faber view-protocol package — typed HTML/SVG view values,
fail-closed validation, and deterministic HTML + initial CSS serialization
(the `tela:*` provider). The repo is the Stage 1 kernel + static renderer
surface: a real library package (`tela`, provider `tela`) with a flat kernel
module, a flat validation module, and (in later waves) benchmark packages and
package-test harnesses.

This file records the Stage 1 authoring/package conventions so later Hands and
reviewers hit a proven surface. The source of truth for policies and the
stage plan is `docs/factory/mvp/` (policies `stage-0-protocol-policies.md`,
delivery `stage-1-delivery.md`, closeout residuals `tela-closeout.md`). This
file is the operating summary; the docs are the contract.

## Layout

| Path | Role |
| --- | --- |
| `faber.toml` | Package `tela`, provider `tela`, `[paths] source = "src"`, `[build] kind = "lib"`, `targets = ["rust", "ts"]`, `[reader] locale = "en"`, edition 2026, version `0.0.0` (versioning is a Stage 8 decision) |
| `src/tela.fab` | The kernel — **one flat module** (imported as `tela:tela`), stdlib-only (no `norma`/`triga`/`faber-runtime` dependency); import-free through U1, U3 adds ONE same-package sibling import (`tela:validate`) for the fail-closed glue |
| `src/validate.fab` | Validation module (imported as `tela:validate`) — flat, import-free, public surface string/bool only |
| `src/browser.fab` | Browser module (imported as `tela:browser`) — mount/update/dispose lifecycle + hydration over the `tela:dom` host seam; pure planners `mount(Scope, View, Theme) → Mounted ∪ null`, `replace`, `dispose` |
| `src/reference.fab` | Reference catalog module (imported as `tela:reference`) — layout/typography + panel/badge/metric component families over typed props → `tela:View`, stable `ref-*` data-tela identities + namespaced `ref.*` tokens |
| `src/dom.fab` | Tela-owned browser DOM contracts + runtime binding surface (imported as `tela:dom`) — English-first conversion of faber-web `dom.fab`; import-free, `webDom*` symbols kept |
| `src/canvas2d.fab` | Tela-owned Canvas2D drawing-surface contract (imported as `tela:canvas2d`) — English-first conversion of faber-web `canvas2d.fab`; standalone imperative draw surface, `webCanvas2d*` symbols kept |
| `src/web.fab` | WebController annotation module (imported as `tela:web`) — the browser-app packaging entry contract; only the `WebController` annotation, import-free |
| `exempla/` | Exempla-mode tests (`+++` frontmatter, `locale = "en"`); one exempla file per unit surface (e.g. `validation.fab`, `serializer.fab`) |
| `scripta/` | Validation harnesses (Stage 1 U6: `check-compile`, `check-exempla`, `check-determinism`) |
| `docs/design/` | Design records (`identity-hydration.md`, `theme-protocol.md`, `browser-lifecycle.md`) |
| `docs/factory/mvp/` | Campaign + delivery + policy docs (machine-managed; do not hand-edit `README.md` if present — regenerate) |
| `spike/` | **Frozen Stage 0 evidence — no unit writes here** |
| `proof/benchmark/` | Stage 1 U5 benchmark packages (`extension-lib/`, `canary-app/`, `libhome/`) |

## Authoring constraints (recorded radix-lane workarounds — apply, don't fight)

These are the recorded D/G gaps from Stage 0 evidence
(`spike/stage-0-branch-a-b-evidence.md`, `docs/factory/mvp/stage-0-canary.md`)
and the stage-0 closeout residual ("Faber dialect / authoring notes"). They
constrain authoring surface until radix deliveries land; none are to be hidden
by framework-contract weakening.

- **Flat-module + flat-provider-module rule (G4).** A callable whose signature
  references an imported sibling type is skipped in the export snapshot
  (`WARN014.file_interface_export_skipped`). Provider modules must be **flat
  (single file)** so every referenced type is local to the module. The kernel
  is therefore **one flat module** (`tela/src/tela.fab`, `tela:tela`) —
  G4-safe and matching the proven spike single-file shape. It is stdlib-only
  plus ONE same-package sibling import (`tela:validate`, added by U3 for the
  fail-closed glue); no public signature references a `validate` type, so the
  G4-safe shape holds.
- **Enum-member top-level binding (G5).** Enum members bind as top-level
  module names — a `fn html()` collides with the `Space.html` member
  binding (`SEM005.duplicate_definition`). Prefix helpers that shadow members
  (`html_spatium`, `svg_spatium`). This is why the HTML renderer verb is
  **`html_visus`** (U3 recorded + escalated; the G5 radix-lane fix restores
  the exact `html` verb).
- **Reserved-keyword spellings (G6).** Reserved `conversio` keywords are
  unavailable as identifiers — `fn tabula(...)` collides with the `tabula`
  type keyword (`PARSE001.retired_type_call_constructor`). Avoid the reserved
  spellings.
- **Field-name constraint (D2 → `nomen_tag`).** A field named `tag` collides
  with the TS emitter's discriminant (`type U = { tag: "V", tag: string }` →
  TS2300/TS2717). The working spelling is **`nomen_tag`**. (Re-checked clean
  at U1 against in-tree radix 0.80.0; keep the spelling.)
- **Nullable-identity routing (D3 → `new_identity`).** Direct non-null
  construction into a nullable union field misses the Rust `Some(...)` wrap
  (cargo E0308). Route non-null identity through the helper
  `new_identity(v) → Identity ∪ null`; keep the workaround until the radix
  D3 delivery lands.
- **Namespace-helper pattern (G1 → `html_spatium`/`svg_spatium`).** Enum
  member value access through an imported namespace fails
  (`ext.Space.html` → `SEM010`). Expose namespace values as helper functions
  even inside the kernel module.
- **Imported-union construction (G3 → kernel-owned constructors).** Variant
  construction of an imported union fails and the qualified cast does not
  parse (`variant Elementum {…}` → `SEM001.unknown_variant`; `∷ ext.Visus` →
  `PARSE030`). The kernel owns constructors (`textus_view`,
  `fragmentum_view`, `elementum_view`, `elementum_omne`) over the same public
  values; constructors are ordinary functions, not privileged syntax.
- **Named type imports (G2 → wildcard + qualified).** `importa ex "m" publica
  Visus` then bare `Visus` does not bind (`SEM002.unknown_type`). Use wildcard
  imports (`* ut ns`) + qualified references.
- **Dialect note (spike evidence §6).** Latin keywords (`discretio`, `finge`,
  `ordo`) partially diverge in the 0.80.0 in-tree build — `discretio` did not
  register a usable type name. Author with the spellings the kernel proves:
  `union`, `enum`, `class`, `fn`.

## Vocabulary policy (policy (b) — SUPERSEDED by the English-first convention, U0 2026-08-09)

**English-first, end to end** (operator decision + clarification 2026-08-09;
`CAMPAIGN.md` posture; the Stage 5 U0 convention). Tela uses the **EN keyword
locale** (English keyword spellings) AND English identifiers for types,
methods, fields, and plan types — the whole authoring surface is English.
Latin is NOT Tela's internal form: Latin is Radix's canonical (unbiased)
language form and the default surface for the standard library (norma).
Calling a Latin-named stdlib function from English Tela is a calling detail
(call sites keep their names). The former policy lock (stage-0-protocol-
policies.md (b) "Faber-Latin protocol spellings") is **SUPERSEDED**.

Convention locks (Stage 5 U0):

- **One vocabulary per identifier.** A name never mixes Latin and English
  stems (`error_regionum`-style mixed stems are banned). The identifier
  vocabulary is English; Latin survives only in Latin-named stdlib call
  sites (documented exception list).
- **Casing.** Types (`class`/`union`/`enum`): PascalCase, single token —
  multi-word types concatenate (`FieldProps`, `ElementNode`); Pascal_snake
  (`Props_campi`-style) is banned. Functions/fields: snake_case
  (`html_visus`, `binding_status`, `tag_name`). Theme tokens: dotted
  lowercase (`chart.axis.muted`). CSS custom properties: `--kebab-case`.
- **Identity strings are DATA.** kebab-case family-prefix `data-tela`
  identities (`form-field-<name>`, `tela-seg-N`, `ref-*`) are data —
  mixed spellings are allowed and never "fixed". One `-live` per family.
- **The kernel surface (U0-locked names).** `View` (union:
  `ElementNode`/`TextNode`/`Fragment`), `Space`, `Attribute`, `Property`,
  `Identity`, `Style`/`Rule`/`Declaration`, `Token` (the ONE token-carrier
  pattern), `Theme`, `Bundle`, `Order`, `EventName`, `Effect`
  (`Restore`/`Direct`/`Anchor`), `Update`; browser: `Mounted` (stays
  English), `RegionRoot`, `EventSubscription`, `Binding`.
- **`html_visus` is the v1.0 renderer verb (pinned).** The exact `html`
  verb collides with the `Space.html` enum-member binding (G5, `SEM005`);
  the v2 restoration is a named rename (`html_visus` → `html`, grep-replace
  predicate: `grep -rn 'html_visus'`), recorded, NOT done in v1.
- **`focus_held`/`focus_target`** are the browser focus-model fns (the
  pre-replacement focused identity / the declared focus-movement target).
- **Latin-named stdlib call sites keep their names** (the documented
  exception list): `longitudo()`, `sectio()`, `continet()`, `appende()`,
  `ordinata()`, `coalesce`, `vacua`, `∪`, `∷`, `∴`, `§`(…). Never rename a
  stdlib call.
- **Seam types keep faber-web's spellings** (`dom.Scope`, `dom.DomNode`, …) —
  consumed, never re-declared; `dom.DomNode.identity` is the seam field.

## No raw markup (policy (a))

Tela v1 has no raw-markup `View` variant. The `Visus` union contains exactly
`ElementNode`, `TextNode`, `Fragment` — no `RawHtml`/`RawCss`-style escape in
the ordinary path. Tag/attribute names are lexically + namespace validated at
the serializer boundary; text and attribute values are escaped centrally in
the renderer only. Unknown-but-valid names are **not** rejected for being new
(campaign dependency rule 9).

## Identity serialization (policy (d))

`Identity` serializes as the `data-tela` attribute — the only identity
serialization form in v1, documented in
[`docs/design/identity-hydration.md`](docs/design/identity-hydration.md).
Non-null `Identity` only; quote style and escape set follow the spike
baseline (single quotes). `Property` values are carried in the tree but **not**
serialized into static HTML in Stage 1 (the `data-prop:` marker is
superseded).

## `FABER_LIBRARY_HOME` mechanics

- The container root `/Users/ianzepp/work/faberlang` is the default library
  home (walks up to the directory containing `norma/src`). Provider `tela`
  resolves from the container root once `tela/faber.toml` + `tela/src/` exist
  (directory name == provider, as with `triga`).
- The benchmark composition (U5) additionally needs `extensionlib` to resolve:
  a benchmark-local `libhome/` (`tela/proof/benchmark/libhome/`) with symlinks
  (`tela → ../../..`, `extensionlib → ../extension-lib`) mirrors the proven
  Stage 0 spike mechanism and keeps the benchmark isolated.
- `FABER_LIBRARY_HOME=<libhome> radix check <package>/src/*.fab` for package
  imports.

## Validation (three lanes)

Use the **in-tree** radix binary `radix/target/debug/radix` (0.80.0) — the
installed `~/.cargo/bin/radix` (0.78.0) predates corpus exempla-mode sugar.
Rust-lane cargo checks run in **scratch dirs outside the shared workspace**
(`/tmp/…`). No workspace cargo suites (Cargo discipline, operator rule
2026-08-07); full radix ladder stages 4–6 / `--e2e` are auditor-owned.

```text
R=radix/target/debug/radix
$R check src/tela.fab --locale en                         # kernel check
$R check src/validate.fab --locale en                       # validate check
$R check exempla/*.fab --locale en                        # exempla-mode check
$R emit -t ts src/tela.fab > <scratch>/x.ts && tsc --noEmit   # TS lane
$R emit -t rust src/tela.fab > /tmp/x.rs                  # Rust lane:
# scratch crate { Cargo.toml, src/main.rs } in /tmp, then cargo check --offline
FABER_LIBRARY_HOME=<libhome> $R check <package>/src/*.fab  # package imports
git diff --check                                          # hygiene in tela/
```

## Stage 1 wave ordering + shared-file constraint

```
Wave 1:  U1 kernel-contract (package scaffold + Branch B types + constructors)
Wave 2:  U2 validation (validate.fab)  ∥  U4 docs (identity + authoring notes)
Wave 3:  U3 serializer (escaping + HTML/CSS serializers + identity emission)
Wave 4:  U5 benchmark-static (two-package composition importing tela:*)
Wave 5:  U6 package-tests + determinism (harnesses + double-build evidence)
```

The kernel module `src/tela.fab` is written by U1 (types + constructors),
then extended by U3 (escaping + serializers) — **strictly sequential**.
`validate.fab` is written by U2 (U3 imports it). Docs (U4) run parallel to U2,
bound to the policy-locked surface. Benchmark (U5) needs the serializer;
tests + determinism (U6) need the composition.

## Stage 2 authoring notes (style and theme protocol)

Design record: [`docs/design/theme-protocol.md`](docs/design/theme-protocol.md).
The kernel's theme/token surface lives in the same flat module
(`src/tela.fab` — `Scopulum`/`Thema` + `thema_css`, Stage 2 U1 e194621);
exempla: `exempla/thema.fab`.

- **`fix:<defect-id>` workaround-marker discipline.** Radix-lane
  workarounds are marked at the site (`fix:g4`, `fix:g5`,
  `fix:codegen001`, TS-emitter markers); **removal = grep-replace after
  each radix fix lands** (e.g. `grep -rn 'fix:codegen001' src/` →
  remove the markers once CODEGEN001 is fixed). A colliding locked verb is
  **escalated, never silently renamed** (the G5/G6 rule — the `html` →
  `html_visus` precedent).
- **Theme/token authoring constraints.** Token `nomen` is a dotted path;
  the 8-token core baseline is pinned in the kernel header (U1) — a theme
  must cover it or `thema_css` returns `null` (fail-closed). The theme
  verbs (`thema`, `scopulum`, `thema_css`) are collision-free (probed on
  in-tree radix 0.80.0). Renderer verbs stay English (policy (b));
  protocol types stay Faber-Latin. Extension tokens use namespaced paths
  (`chart.axis.muted`) and are collected app-side (the compose-without /
  G4-independent pattern — never a provider export that trips
  `WARN014`).
- **Assembly input shape (policy (e)).** `assemble(...) → Stilum` is a
  pure function over: the package-order map
  (`list<`(package identity, dependencies)`>`), collected style bundles
  with stable identities, the selected theme, an optional reset bundle.
  Dedup by stable identity; topological order with stable-identity
  tie-break; cycles / duplicate-identity-different-content / invalid
  output reject.
- **Two-theme benchmark seam.** The two-theme proof (U3) renders the
  SAME component tree under two materially different `Thema` values (no
  component changes) and asserts byte-identical HTML under both; the
  theme CSS cascades are the two token layers.
- **Cascade order.** Emission order is the cascade order: reset
  (opt-in only) → tokens → components → library packages → application;
  `@layer` at-rules are deferred (policy (c) growth). U2's assembly/cascade
  record is the authoritative reconciliation point when it lands.

## Stage 3 authoring notes (browser lifecycle)

Design record: [`docs/design/browser-lifecycle.md`](docs/design/browser-lifecycle.md).
Stage 3 adds the interactive layer over the locked static renderer: the pure
behavior carriers in the kernel (`Eventum`/`Effectus`/`Renovatio`, U1
`4ca331a`), a new flat browser module owning the mount/update/dispose
lifecycle + hydration over the `web:dom` host seam, a DOM shim for the node
runtime gate, and the segmented-control interaction proof.

- **Browser-module conventions.** The browser module `src/browser.fab`
  (`tela:browser`, U2 `9f23095`) owns the mount/update/dispose lifecycle.
  The **pinned seam call shape** (policy (b) English renderer/host verbs;
  behavior-design §5) as landed: `mount(Scope, Visus, Thema) → Mounted ∪
  null`, `replace(Mounted, Visus) → Renovatio ∪ null`, `dispose(Mounted) →
  void`. The spec sketch's `dom.Scope` is carried by tela:browser's own
  `Scope { selector, textus_praesens }` handle: the en→la `web:dom` import
  is **blocked** on in-tree radix 0.80.0 (PARSE001/SEM002 —
  `fix:web-dom-locale`), so the module does **not** import `web:dom` and
  the DOM surface binds at the **harness level** (the dom-shim binds the
  `webDom*` surface). `void` is the en void type (the reader pack maps
  `vacuum = "void"`), not `vacua`. `Mounted` carries host state (scope,
  mounted root, current `Visus`, active theme, render plan
  `textus_markup`/`textus_css`, identity index, hydration diagnostics,
  binding plan, subscription list, modeled focus). The module-local
  carriers are `Scope`/`Radiculum`/`Subscriptio`/`Ligamen`; the hydration
  policy lives in exported G4-safe pure fns (`parse_identitates`,
  `elementum_tag`, `quotiens`, `identitates_duplicatae`,
  `ligamen_status`, `diagnosia_hydrationis`). The kernel owns the pure
  carriers only — Faber-Latin protocol spellings `Eventum { nomen }`,
  `union Effectus` (`Restitue`/`Dirige`/`Ancora`, each keyed by
  `identitas`), `Renovatio { Visus visus, list<Effectus> effectus }`, with
  kernel-owned constructors (`eventum`, `restitue`, `dirige`, `ancora`,
  `renovatio`) and the `effectus_identitas` accessor. The message-typed
  behavior plan is **app-typed** (radix D1 blocks generic user-type
  construction — never kernel-generic; the campaign's conceptual
  `mount(Scope, Program, Theme)` decomposes at the app boundary, attaching
  through the `data-tela` seam). Never ambient global document shortcuts —
  DOM operations flow through the `Scope`.
- **Escalation markers (G4/dialect).** `fix:g4` — WARN014 snapshot skip on
  public signatures referencing imported sibling types; **landed
  observation**: the pinned seam fns `mount`/`replace` (imported `tela`
  types in signatures) are export-skipped for consumers — the G4-safe pure
  policy fns (string/list signatures) stay exported for the check-time
  exempla, and the harness-assembly workaround binds the `webDom*` surface
  directly, so the snapshot does not apply at runtime. `fix:web-dom-locale`
  — en→la provider-module locale/dialect propagation at `radix check`
  (PARSE001-family, the CODEGEN001 mechanism): **attempted and failed** on
  in-tree radix 0.80.0; the landed fallback is the harness-level DOM
  binding (dom-shim binds the `webDom*` surface); **never re-author a
  `web:dom` copy inside tela**. `fix:prim-nullable` (NEW) — a primitive
  `∪ null` const/var annotation and a `!` unwrap of a primitive nullable do
  not parse in named fn bodies (PARSE030/PARSE001); workaround = null
  checks against the call + `coalesce ""`.
- **DOM shim + check-mount harness.** The node runtime gate runs the
  mount/update proofs through `scripta/dom-shim.ts` (U2) — a minimal
  in-memory DOM implementing the `webDom*` runtime-binding surface (the
  WEB5 `fake-dom.mjs`/`web-shim-dom.js` precedent). **Bounded fidelity**:
  state-level assertions (selection / ARIA / live-region / subscription /
  focus / scroll intent), not real layout; a real-browser driver is out of
  scope. `scripta/check-mount` (U4) is the interaction gate: it assembles
  the interactive composition and runs the scripted sequence under `node`,
  fail-closed.
- **Interaction-gate proof shape.** The segmented-control scripted sequence
  (U3/U4): pointer click on an unselected segment selects (previous
  unselects, the announcement fires once); click on the already-selected
  segment is a no-op (silent); arrow keys move focus only (selection
  unchanged); `Space`/`Enter` select + announce; `Home`/`End` move focus;
  a replace across the region restores focus to the pre-replacement focused
  node by identity + executes the declared scroll-anchor; dispose removes
  subscriptions (a post-dispose event dispatch does nothing). Assertions
  execute under `node` — any failure or non-zero exit FAILS the gate.
- **Synchronous-only posture.** Stage 3 proofs are synchronous only: no
  `@ futura`, no `dom.fetch_text`, no async event sources, no
  fetch-driven/async update claim (the TS async gap is a named Stage 3
  input, routed — see the design record §6). A unit that hits an
  async-shaped need records the workaround + escalation To mind; it never
  weakens the contract and never waits.
- **`fix:<id>` discipline inventory (Stage 3).** Markers: `fix:web-dom-locale`
  (NEW, landed — attempt failed, harness-level fallback), `fix:g4`,
  `fix:g5`, `fix:prim-nullable` (NEW — primitive nullable bindings in fn
  bodies), `fix:codegen001`, `fix:ts-emitter`,
  `fix:snapshot-nomen-collision`. Every applied workaround is marked at the
  site in the module header; **removal = grep-replace after each radix fix
  lands** (e.g. `grep -rn 'fix:web-dom-locale' src/`). A colliding locked
  verb is **escalated, never silently renamed** (the G5/G6 rule).
- **Determinism posture.** Determinism applies to **static/mount-time
  serialization only** (the segmented control's initial HTML + full cascade
  — byte-identical double-build, fail-closed); interactive state is
  time-variant, so the interaction gate is a scripted deterministic
  assertion sequence, not a racy timing test. R2 note: when CODEGEN001
  lands, the Rust-lane capture must equal the TS-lane capture
  (stage-2-determinism.md §3).
- **Hydration + the app-typed plan.** The concrete message type +
  `Vinculum`-shaped bindings are built app-side in the benchmark (U3),
  keyed to the `data-tela` identities the static renderer emits
  (identity-hydration.md §7). Hydration attaches to matching `data-tela`
  nodes; a mismatch diagnoses + replaces the mismatched region from the
  View; duplicate `data-tela` values are diagnosed — never a silent bind
  (identity-hydration.md §6).

## Branch B (frozen for Stage 1)

The kernel is the Branch B shape — pure non-generic recursive `Visus` +
adjacent typed behavior plan (Stage 3). Branch A (generic `Visus<Message>`)
is the ideal end-state blocked only by radix defect D1; if D1 lands, the
Branch A re-spike is a decision point for a future stage — **never a
mid-stage switch**.
