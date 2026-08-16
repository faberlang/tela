# Tela test coverage — delivery spec

**Status**: planned — delivery READY for audit; clean-slate scope (0/7 modules)
**Date**: 2026-08-16
**Repository**: `/Users/ianzepp/work/faberlang/tela`
**Locale**: `en` (`tela/faber.toml` `[reader] locale = "en"`)
**Source**: operator memo 805fb2c4; planner assignment 02af9793
**Scope**: discovery and delivery lowering only; no product, test, host, or Radix edits in this unit

---

## 1. Interpreted theme

Tela needs an executable coverage plan for its complete public view/UI package.
The live package has seven Faber modules and no co-located `.proba` source. The
plan must separate pure value semantics from browser-host behavior, use the
current `proba` grammar and runner honestly, and give each live module one
coverage unit plus one explicit executed-proba gate row.

This is not a claim that all seven modules can be proved by MIR proba. A host
binding, a Canvas2D handle, or an annotation contract needs a host/package gate
in addition to (or instead of) runner assertions. The delivery records those
boundaries rather than making a structural check look like runtime coverage.

### Non-goals

- No `.proba` files, exempla, harnesses, source modules, host bindings, or Radix
  code are authored by this planning unit.
- No attempt to repair the current Tela parser/visibility baseline.
- No real-browser, pixel, layout, or Canvas2D fidelity claim from the MIR runner.
- No Rust/TypeScript target-parity claim from `faber test`; target emission stays
  a separate gate.
- No migration of the existing `exempla/` suite into `.proba`; existing
  exempla/TS/Node evidence remains complementary evidence.

---

## 2. Repo-aware baseline: live module census

The census was run against Tela `e32ef5f2ecfb6a51e82f1530dfd652320059c7f1`
(2026-08-16), not against the stale campaign prose. `find src -maxdepth 1
-name '*.fab'` returns exactly seven files. There are zero `src/**/*.proba`
files, so the executed-proba baseline is **0/7**. The future coverage wave has
seven module units, but the annotation-only `tela:web` unit is structural rather
than a fabricated executable proba case.

| # | Module | Live path | Lines | Classes | Unions/enums | Public function surface (count) | Imports | Current complementary evidence |
|---:|---|---|---:|---:|---:|---:|---:|---|
| 1 | kernel / view, style, theme, assembly, behavior carriers | `src/tela.fab` | 991 | 12 | 2 unions + 1 enum | 41 | `tela:validate` | `exempla/serializer.fab`, `exempla/thema.fab`, `exempla/assemble.fab`, `exempla/behavior.fab`, `exempla/browser.fab`, `proof/benchmark/canary-app/src/main.fab` |
| 2 | validation predicates | `src/validate.fab` | 150 | 0 | — | 7 | — | `exempla/validation.fab`, serializer fail-closed assertions |
| 3 | browser lifecycle and hydration planners | `src/browser.fab` | 587 | 4 | — | 20 | `tela:tela`, `tela:dom` | `exempla/browser.fab`, `scripta/check-mount`, `scripta/harness_dom.fab`, Node fake-DOM driver |
| 4 | reference component families | `src/reference.fab` | 1811 | 15 | — | 101 | `tela:tela` | `exempla/reference.fab`, `scripta/check-reference`, benchmark/canary composition |
| 5 | scoped DOM host contract | `src/dom.fab` | 337 | 14 | — | 29 | — | Tela's host-facing consumers; browser and form interaction gates; DOM shim/fake-DOM evidence |
| 6 | Canvas2D host contract | `src/canvas2d.fab` | 243 | 2 | — | 29 | `tela:dom` | `examples/web-canvas2d-smoke`, `examples/canvas2d-interactive`, Playwright smoke/interactive harnesses |
| 7 | WebController annotation contract | `src/web.fab` | 21 | 1 | — | 0 | — | browser-app package/controller discovery and consumer examples |

The module order above matches the live compile loop in
`scripta/check-compile`:

```text
for mod in tela validate reference dom canvas2d web browser
```

That loop is a seven-module census, not executed coverage. It currently runs
`radix check` for each module and then checks the benchmark packages.

The seven existing top-level exempla are useful reference examples, but they
are not `.proba` cases. They are `assemble`, `behavior`, `browser`,
`reference`, `serializer`, `thema`, and `validation` under `exempla/`.

---

## 3. Proba framework triage

### 3.1 Grammar and runner capability confirmed live

The canonical grammar is in `radix/crates/radix-parser/src/decl.rs` and the
freshest executable examples are:

- `radix/corpus/proba/proba.fab` — one `proba "name" { ... }` case;
- `radix/corpus/probandum/probandum.fab` — nested `probandum` suites;
- `radix/crates/radix/src/proba/mod_test.rs` — pass/fail/skip, nested suites,
  name/suite/tag selection, and inventory behavior;
- `radix/crates/faber/src/package/proba_runner_test.rs` — package discovery,
  inline cases, `.proba` inclusion, and MIR execution;
- `examples/fixtures/exempla-boundary/proba/packages/passing` — the known-green
  package canary.

The live `faber 1.7.0` canary passes:

```text
faber test --locale la examples/fixtures/exempla-boundary/proba/packages/passing
ok   arithmetic passes
ok   text passes
test result: ok. 2 passed; 0 failed; 0 skipped
```

The runner is target-neutral MIR interpretation. It inventories source-level
proba cases, lowers the containing unit, and executes each case with a
`BufferHost`; it is not a Cargo, Rust, TypeScript, browser, or Canvas2D test
harness. The package command supports `faber test <package>`, co-located
`src/**/*.proba`, `--include`/`--exclude`, case/suite/tag filters, and
`omitte`/`futurum` skips. A `.proba` file may import a product `.fab` helper,
but `.fab` and `.proba` files cannot import a `.proba` file. Package execution
lowers units independently; the live command comments state that cross-unit
imports needing package MIR linking fail closed.

### 3.2 What proba can prove for Tela

**Good fit.** The MIR runner can prove deterministic, host-independent value
semantics with `adfirma`, including:

- `tela:tela`: View constructors, identity and attribute values, escaping,
  fail-closed serializer results, CSS/style/theme/token/assembly ordering, and
  behavior carriers/accessors when the imported-module path is available;
- `tela:validate`: lexical, namespace, and void-structure predicates;
- pure `tela:browser` helpers: identity parsing, duplicate detection, tag
  extraction, binding status, and hydration diagnostics;
- `tela:reference`: props normalization, clamping, accessible text/state
  helpers, component output structure, style/token carriers, and negative
  input behavior where the result is a pure value;
- carrier construction in `tela:dom` and `tela:canvas2d` where no host call is
  claimed.

**Not a fit.** The runner cannot establish browser-host behavior:

- `tela:dom` query/mutation/event/fetch/pointer-lock/frame/resize functions
  require the DOM host binding;
- `tela:canvas2d` context and Path2D operations require a real Canvas2D runtime;
- `tela:browser` `mount`, `replace`, and `dispose` plan against a host seam and
  must be exercised through the existing TypeScript/Node fake-DOM gate;
- `tela:web` contains only an annotation contract. Annotation origin and
  controller discovery are packaging semantics, not executable MIR behavior.

The host boundary is therefore explicit in every unit. A pure proba case is
required where the module has a meaningful MIR slice. Host-backed behavior is
covered by the existing TS/Node/Playwright/package gates, not by dummy runner
assertions.

### 3.3 Radix/framework gaps and routes

The following are live findings, not assumed compatibility:

| Finding | Evidence | Effect on Tela coverage | Route |
|---|---|---|---|
| **Current parser/source baseline is not green.** `radix 0.82.0` reports `PARSE050.import_privata_removed` for the `private` imports at `src/tela.fab:111` and `src/canvas2d.fab:47`; direct checks also report repeated `PARSE060.invalid_comment_placement` on the long `#` comment headers. | `for f in tela/src/*.fab; do radix check --locale en "$f"; done` on Radix `8dc6b69dde1eb5bb6f899085c6efc5d0c7c7c608` | Coverage Hands cannot start from a green compile baseline. This is a source/parser compatibility prerequisite, not evidence of a proba assertion failure. | Named shared prerequisite: normalize Tela sources to the live import/comment contract or route a minimized parser/reader defect to Radix. Do not weaken the check gate. |
| **Package proba cannot currently load the Tela kernel interface.** A scratch package with a pure `tela:tela` proba fails before execution: `library interface ... tela/src/tela.fab failed to parse: PARSE050.import_privata_removed`. | `faber test --locale en` scratch package with `FABER_LIBRARY_HOME=/Users/ianzepp/work/faberlang` | The executed-proba gate is blocked even for pure View/serializer cases until the package interface path is green. | Named Radix/Faber shared unit: package-test analysis must consume the same current English import/reader contract as direct `radix check`, then prove a `.proba` importing a Tela `.fab` helper/module. |
| **MIR runner has no browser host.** The runner executes with `BufferHost`; no DOM or Canvas2D host class is available. | `radix/crates/radix/src/proba/mod.rs` `execute_case`; `faber` test CLI documentation | DOM, browser lifecycle, and Canvas2D behavior cannot be promoted to executed-proba evidence. | Shared host-backed runner extension is **not required for this Tela delivery**. If policy later requires host probas, route a separate Radix MIR host-adapter goal; keep TS/Node/Playwright as the current authority. |
| **Imported handler-typed DOM exports still produce `WARN014.file_interface_export_skipped` in `browser.fab`.** | `radix check --locale en tela/src/browser.fab` warns for `dom.on*` exports | Consumer/proba imports must not silently treat skipped handler exports as covered. | Named Radix file-interface export unit: close the warning or record the stable export contract before claiming imported browser-handler coverage. Existing browser/DOM gates remain the fallback. |
| **Cross-unit package MIR linking is fail-closed when required.** | `faber/src/commands/test.rs` and `radix` package proba runner comments | A `.proba` unit that calls an imported Tela module may analyze but still fail to lower/link. | Named Radix package-MIR-linking unit; coverage units must keep a pure single-unit fallback and retain host/TS evidence until that unit lands. |
| **Rust emit/import `CODEGEN001` remains a separate target gap.** | Tela source headers and Stage 1–5 evidence; not used by `faber test` | Executed proba cannot substitute for Rust/TS parity; Rust status must remain explicit. | Existing Radix codegen route; not a blocker for MIR-only pure assertions once package analysis is fixed. |

These findings do not authorize a framework-contract weakening. In particular,
no host operation is replaced with a no-op merely to make proba green.

---

## 4. Normalized coverage outcome

The delivery outcome is one coverage unit per live module, with a truthful
proof split:

1. six co-located `.proba` units for the modules with a meaningful pure/value
   slice, plus one structural/package unit for the annotation-only `web`
   module;
2. the existing Tela exempla and TS/Node/Playwright/package gates retained as
   complementary proof for host/UI behavior;
3. a shared Radix prerequisite for the current parser/package-proba baseline;
4. a gate table that reports executed-proba status per module and does not
   collapse `structural`, `executed-proba`, and `browser-host` evidence.

The seven units are intentionally independent at the planning level. A unit
may use the shared prerequisite as a dependency before its executed-proba
assertions can be run.

---

## 5. Hand unit graph — seven module coverage units

All units are additive test sources and narrow evidence updates. No unit edits
Tela product `.fab` modules. `src/<module>.proba` is the preferred co-located
path because the live package loader discovers it under `src/` with
`include_proba=true`.

### `tel-tc-01` — kernel View/style/theme/assembly coverage

| Field | Value |
|---|---|
| `id` | `tel-tc-01-kernel` |
| `outcome` | Add executed-proba coverage for the pure `tela:tela` public surface: View constructors and escaping/identity serialization; CSS/style and theme/token fail-closed behavior; bundle/order/assembly semantics; EventName/Effect/Update carriers and accessors. |
| `write_scope` | `tela/src/tela.proba` (new) |
| `read_scope` | `tela/src/tela.fab`; `tela/exempla/{serializer,thema,assemble,behavior,browser}.fab`; `tela/proof/benchmark/canary-app/src/main.fab` |
| `depends_on` | `radix-proba-package-interface` prerequisite; no Tela unit dependency |
| `done_when` | The proba inventory has named positive and fail-closed cases for text/fragment/element construction, escaping/identity, at least one HTML/SVG serializer result, theme core-token acceptance/rejection, deterministic assembly order/dedup/rejection, and effect/update accessors. It executes through `faber test tela --include tela.proba` once the shared prerequisite is green. No host call is used as the assertion target. |
| `sanity` | `radix check --locale en src/tela.fab`; `faber test --locale en tela --include tela.proba` |
| `non_goals` | Generic `View<Message>` (Branch A/D1); browser DOM execution; Rust target parity; editing `src/tela.fab`. |
| `risk` | high — large imported kernel surface and current parser/package-interface blockers. |
| `integrable` | yes |

### `tel-tc-02` — validation coverage

| Field | Value |
|---|---|
| `id` | `tel-tc-02-validate` |
| `outcome` | Add executed-proba coverage for every public validation predicate, including valid/invalid lexical names, namespace context, HTML void membership, and child-bearing void rejection. |
| `write_scope` | `tela/src/validate.proba` (new) |
| `read_scope` | `tela/src/validate.fab`; `tela/exempla/validation.fab`; serializer invalid-input cases |
| `depends_on` | none for source authoring; shared parser gate for execution |
| `done_when` | Every public function in `validate.fab` has at least one positive and one negative/edge assertion where the contract has both sides. The cases run under `faber test tela --include validate.proba` and remain independent of host bindings. |
| `sanity` | `radix check --locale en src/validate.fab`; `faber test --locale en tela --include validate.proba` |
| `non_goals` | Serializer implementation tests; new validation rules; source edits to `validate.fab`. |
| `risk` | low — flat, import-free, scalar-only module; parser baseline still gates execution. |
| `integrable` | yes |

### `tel-tc-03` — browser planner/hydration coverage

| Field | Value |
|---|---|
| `id` | `tel-tc-03-browser` |
| `outcome` | Add proba coverage for pure browser identity/hydration policy helpers and carrier/accessor values; retain mount/update/dispose behavior under the existing fake-DOM TypeScript gate. |
| `write_scope` | `tela/src/browser.proba` (new) |
| `read_scope` | `tela/src/browser.fab`; `tela/exempla/browser.fab`; `tela/scripta/check-mount`; `tela/scripta/harness_dom.fab` |
| `depends_on` | `tel-tc-01-kernel` read-only surface; Radix package-interface and imported-handler export prerequisites for execution |
| `done_when` | Proba cases cover identity marker parsing, tag extraction, occurrence/duplicate detection, binding status, hydration diagnostics, and carrier constructors/accessors. The unit explicitly marks `mount`, `replace`, `dispose`, and DOM snapshot calls as host-gated, with `scripta/check-mount` remaining the required Node/fake-DOM proof. |
| `sanity` | `radix check --locale en src/browser.fab`; `faber test --locale en tela --include browser.proba`; `scripta/check-mount` for host behavior |
| `non_goals` | A fake no-op DOM inside MIR; real browser layout or focus/scroll fidelity; changes to `browser.fab`. |
| `risk` | high — imported `tela`/`dom` types, handler export warnings, and host boundary. |
| `integrable` | yes |

### `tel-tc-04` — reference component-family coverage

| Field | Value |
|---|---|
| `id` | `tel-tc-04-reference` |
| `outcome` | Add coverage for the complete reference module family map: layout (stack/grid/prose), typography (heading/prose/emphasis/scale), panel/badge/metric, table, segmented control, button, and field input/error/live-region helpers, plus style/token bundles. |
| `write_scope` | `tela/src/reference.proba` (new) |
| `read_scope` | `tela/src/reference.fab`; `tela/exempla/reference.fab`; `tela/scripta/check-reference`; benchmark canary composition |
| `depends_on` | `tel-tc-01-kernel` read-only surface; Radix package-interface prerequisite |
| `done_when` | Every named family has a normal case and a boundary/negative case where the live API exposes one (heading level clamp, selected/unselected segmentation, button state/variant, field invalid/valid/disabled, table rows, and token/style bundle identity). Proba checks pure returned values/serialized views only; `check-reference` remains the host/browser gate. |
| `sanity` | `radix check --locale en src/reference.fab`; `faber test --locale en tela --include reference.proba`; `scripta/check-reference` |
| `non_goals` | Adding component families; changing accessibility policy; browser interaction replacement for `check-reference`. |
| `risk` | high — 101 public functions, imported kernel types, and broad family count. |
| `integrable` | yes |

### `tel-tc-05` — DOM contract/carrier coverage

| Field | Value |
|---|---|
| `id` | `tel-tc-05-dom` |
| `outcome` | Add the runner-compatible contract slice for DOM carrier classes and immutable option/state values, while proving actual query, mutation, event, fetch, and pointer-lock behavior through the existing host-facing examples/harnesses. |
| `write_scope` | `tela/src/dom.proba` (new) |
| `read_scope` | `tela/src/dom.fab`; `tela/exempla/browser.fab`; `tela/scripta/harness_dom.fab`; `examples/browser-app`; current Tela DOM consumers |
| `depends_on` | shared parser/package-interface prerequisite; no kernel unit dependency for carrier cases |
| `done_when` | Proba cases cover constructible `Scope`, `Element`, `DomNode`, event/state, `Subscription`, submit/fetch option/response carriers without claiming host effects. The gate also names the complementary DOM-shim/consumer proof for `scope`, `require`, `all`, `snapshot`, mutation, subscriptions, and event state. No host-backed function is made green by asserting a stub return. |
| `sanity` | `radix check --locale en src/dom.fab`; `faber test --locale en tela --include dom.proba`; relevant Node/consumer DOM harness |
| `non_goals` | A MIR DOM host; real browser event/layout behavior; changes to `dom.fab` or `harness_dom.fab`. |
| `risk` | medium-high — host-heavy public surface and handler types; carrier-only proba can overclaim if the row is not reviewed. |
| `integrable` | yes |

### `tel-tc-06` — Canvas2D contract coverage

| Field | Value |
|---|---|
| `id` | `tel-tc-06-canvas2d` |
| `outcome` | Add runner-compatible handle/argument contract coverage for `Canvas2DContext` and `Path2D`; keep all actual drawing, transform, path, and text behavior under the current Canvas2D smoke/interactive host gates. |
| `write_scope` | `tela/src/canvas2d.proba` (new) |
| `read_scope` | `tela/src/canvas2d.fab`; `examples/web-canvas2d-smoke`; `examples/canvas2d-interactive`; their test harnesses and Tela bindings |
| `depends_on` | shared parser/package-interface prerequisite; DOM contract surface read-only |
| `done_when` | Proba cases cover handle construction and pure shape/argument paths that do not invoke a browser context. The gate records all `canvas2d_*` draw operations as host-backed and requires the existing smoke and interactive harnesses for runtime behavior; it does not assert against the stub body output. |
| `sanity` | `radix check --locale en src/canvas2d.fab`; `faber test --locale en tela --include canvas2d.proba`; `examples/web-canvas2d-smoke/tests/smoke-test.mjs`; `examples/canvas2d-interactive/tests/interactive-test.mjs` |
| `non_goals` | MIR Canvas2D implementation; pixel equivalence from proba; changes to Canvas2D bindings or examples. |
| `risk` | high — host-only operations, imported DOM seam, and current `private` import/parser baseline. |
| `integrable` | yes |

### `tel-tc-07` — WebController packaging coverage

| Field | Value |
|---|---|
| `id` | `tel-tc-07-web` |
| `outcome` | Close the annotation-only module with a structural/package proof of `WebController` origin, selector field, controller signature, and browser-product discovery. |
| `write_scope` | `tela/src/web.proba` is **not required** unless a future Radix runner gains annotation introspection; the unit's durable coverage evidence is a new package fixture or scoped update to the existing Tela/browser packaging proof, as decided by the implementing Hand. |
| `read_scope` | `tela/src/web.fab`; `radix/crates/faber/src/package/product/controllers.rs`; existing browser-app/controller fixtures; `examples/browser-app` and Canvas2D examples |
| `depends_on` | shared parser/source baseline; tela package/controller origin support |
| `done_when` | The module is checked in English and a browser-product fixture accepts `@ WebController` from `tela:web`, accepts `tela:dom.Scope`, rejects local shadowing, and still enforces at least one controller. The gate row explicitly records executed-proba as `N/A` because annotations are compile/package metadata, not MIR-executable behavior. |
| `sanity` | `radix check --locale en src/web.fab`; the narrow Faber controller-origin/package test; a browser-app package check |
| `non_goals` | Inventing a fake annotation assertion; deleting legacy web-origin compatibility; changing controller semantics in this coverage unit. |
| `risk` | medium — packaging origin is owned by Faber/Radix, not the Tela module body. |
| `integrable` | yes |

---

## 6. Per-module executed-proba gate

This table is the acceptance contract for the seven-unit wave. `required`
means a failing or missing `.proba` case fails the row. `partial` means the
pure slice is executed by MIR, while the named host behavior must pass its
separate gate. `N/A` is intentional and only applies to metadata/annotation
surfaces; it must not be counted as executed runtime coverage.

| Module | Unit | Executed-proba status | Required runner command after prerequisites | Complementary gate required | Gate interpretation |
|---|---|---|---|---|---|
| `tela:tela` | `tel-tc-01` | `required` | `FABER_LIBRARY_HOME=$WORKSPACE faber test --locale en tela --include tela.proba` | `scripta/check-exempla`, `scripta/check-determinism` | Pure kernel semantics must execute; target/serializer evidence remains separate. |
| `tela:validate` | `tel-tc-02` | `required` | `faber test --locale en tela --include validate.proba` | `scripta/check-exempla` serializer/validation cases | Scalar predicate assertions are the direct authority. |
| `tela:browser` | `tel-tc-03` | `partial` | `faber test --locale en tela --include browser.proba` | `scripta/check-mount` | Pure hydration policy runs in MIR; host lifecycle runs in Node/fake DOM. |
| `tela:reference` | `tel-tc-04` | `required` for pure family helpers | `faber test --locale en tela --include reference.proba` | `scripta/check-reference`, `scripta/check-determinism` | Component values/styles are runner-tested; UI/DOM behavior stays complementary. |
| `tela:dom` | `tel-tc-05` | `partial` | `faber test --locale en tela --include dom.proba` | DOM shim/consumer interaction gate | Carrier facts run in MIR; host query/mutation/events do not. |
| `tela:canvas2d` | `tel-tc-06` | `partial` | `faber test --locale en tela --include canvas2d.proba` | `web-canvas2d-smoke` + `canvas2d-interactive` harnesses | Handle/value shape may run in MIR; drawing requires browser host. |
| `tela:web` | `tel-tc-07` | `N/A` | No fake annotation proba; report structural command instead | Faber controller-origin/package fixture | Annotation discovery is package metadata, not executable MIR behavior. |

The gate must fail closed on any row marked `required` or `partial` when its
required `.proba` source is missing, not discovered, not executed, or has a
failed case. `partial` rows also fail when their complementary host gate is
omitted. The `N/A` row fails if its structural/package proof is absent; it is
never silently promoted to a passing proba count.

### Gate order and ownership

1. **Shared prerequisite / Radix route**: repair or explicitly close the
   parser, package-interface, imported-handler export, and package-MIR-linking
   findings above. This is outside the Tela coverage Hands.
2. **Tela compile gate**: `tela/scripta/check-compile` must enumerate all seven
   modules and pass in `en`; this is a source/package baseline, not coverage
   evidence by itself.
3. **Executed-proba gate**: `faber test --locale en tela` discovers all seven
   co-located unit files, applies no accidental `--exclude`, and reports the
   required/partial rows with zero failures. A warning for no discovered cases
   is a failure for this delivery.
4. **Existing pure/UI gates**: `scripta/check-exempla`,
   `scripta/check-determinism`, `scripta/check-mount`,
   `scripta/check-reference`, and the forms gates remain authoritative for
   their current surfaces.
5. **Host/package gates**: browser-app controller discovery plus Canvas2D
   smoke/interactive checks close host behavior and annotation packaging.
6. **Target lanes**: TypeScript emit/runtime and the separately recorded Rust
   `CODEGEN001` status remain target evidence; no `faber test` result is
   relabeled as target parity.
7. **Hygiene**: `git diff --check` in Tela and path-limited commits for every
   unit.

No child Hand owns the workspace `./scripta/test --stage`, `--e2e`, or full
suite. Those remain lint/test/auditor-owned gates under the workspace ladder.

---

## 7. Open questions for Mind / audit

1. **Shared prerequisite ownership.** Default: route the current parser/source
   and package-proba interface findings to Radix/Faber before executing any
   `required` or `partial` row. Tela Hands must not weaken source or runner
   semantics to bypass them.
2. **Host-backed proba policy.** Default: do not add a MIR DOM/Canvas2D host.
   The existing TS/Node/Playwright harnesses are the correct authority. A
   future requirement for host probas is a separate Radix goal.
3. **`tela:web` artifact shape.** Default: no empty `.proba` file. Keep the
   annotation module's row `N/A` and prove it through controller-origin and
   browser-product packaging tests.
4. **Package linking.** If the Radix package runner cannot execute an
   imported-module proba after the parser baseline is repaired, preserve the
   pure single-module fallback and route the minimal package-MIR-linking proof
   to Radix. Do not claim executed coverage from `radix check` alone.

---

## 8. READY verdict

**READY for audit.** The live module set is verified at seven, the clean-slate
executed-proba baseline is verified at 0/7, the current grammar/runner and
known-green canary are grounded in live Radix source/tests, host/UI limits are
explicit, Radix/package gaps are named and routed, and the delivery contains
seven bounded module units plus a per-module executed-proba gate. No product
implementation is included in this planner artifact.
