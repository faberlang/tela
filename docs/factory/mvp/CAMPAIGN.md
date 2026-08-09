# Campaign: Tela Web UI Framework

**Created**: 2026-07-18
**Updated**: 2026-07-18 — moved into the initialized Tela repository after review reconciliation
**Status**: active — Stage 0 accepted, Stage 1 accepted, Stage 2 accepted — initial accept record corrected (fire-9 independent audit 2026-08-09 confirmed the closeout evidence; the original accept asserted a prior audit that did not exist); Stage 3 accepted (step-6 review + independent audit clean_pass 2026-08-09, audit-before-acceptance held); Stage 4 accepted (non-interactive proof U1–U5, independent audit clean_pass 2026-08-09, audit-before-acceptance held — verdict mail a7a89c12; interactive gate U6/U7 MET 2026-08-09 — verdict mail f9b616c0, scoped claim wording); Stage 5 (reference catalog) waits on the interactive seam closing
**Mode**: repository campaign routing artifact; do not implement directly from this file
**Target workspace**: `/Users/ianzepp/work/faberlang`
**Control-plane repo**: `/Users/ianzepp/work/faberlang/tela`
**Working name**: **Tela** — Latin *tela*, a web, warp, or loom
**Product shape**: local sibling Git repo initialized on `main`; package/provider working name `tela`; no remote or publication yet
**Current supporting repos**: `faber-web`, `faberlang.dev`, `faber`, `radix`, `examples`

## Summary

Create Tela as Faber's general-purpose Web UI framework: a reusable foundation
for applications and third-party client libraries to define their own view
shapes, styles, themes, behavior, and higher-level components in Faber.

Tela is broader than a fixed component catalog. It owns an extensible typed
view protocol, style and theme protocols, static and browser renderers, and a
reference component library. Client libraries should be able to build forms,
charts, dashboards, document systems, or application-specific design systems
without changing Tela, `faber-web`, Faber's compiler, or a closed registry of
component kinds.

The campaign starts with protocol and ownership design, proves one view through
both static and interactive renderers, then grows reference components and
proves third-party extensibility. Campaign stages lower through `delivery` and
`factory`; this artifact does not scaffold or implement the framework.

## Problem

Faber now has two complementary web proofs:

- `faber-web` provides browser application packaging contracts and a scoped DOM
  runtime for controllers, events, mutation, and fetch.
- `faberlang.dev`'s Speculum generator constructs a typed Faber `Node` /
  `Document` tree and serializes it to static HTML.

Neither is a general UI framework. `faber-web` attaches behavior to documents
whose HTML and CSS already exist. Speculum's view IR and chrome builders are
site-local, its stylesheet is externally authored, and its node union was not
designed as an extension contract for other packages.

Without a shared framework, each Faber client library must independently choose
HTML representation, escaping, SVG support, style ownership, token naming,
theme composition, accessibility rules, event attachment, state updates, and
static-versus-browser rendering. That creates incompatible component islands
instead of a Faber web ecosystem.

## Governing Invariant

> A Tela component is ordinary Faber code that produces shared typed UI values;
> static HTML/CSS and interactive browser behavior are renderings of those
> values, and new component libraries require no compiler or Tela-kernel edit.

## Desired End State

- Tela exists as a separately named sibling project rather than an
  application-local folder or an expansion of Radix.
- Faber packages import a stable `tela:*` protocol for views, styles, themes,
  accessibility, and behavior.
- Components are composable functions over typed props and data, not subclasses
  of a framework base class and not compiler-known component kinds.
- Client libraries can emit arbitrary valid HTML and SVG shapes through Tela's
  open element model while preserving escaping and namespace correctness.
- Client libraries can add namespaced theme tokens and component style bundles
  without widening Tela's standard theme record.
- One pure component tree can render to deterministic static HTML/CSS and mount
  with behavior through the browser host.
- Stateful browser applications have one canonical update seam; Tela does not
  ship competing controller, signal, hook, and message-loop models.
- Reference components cover layout, typography, panels, tables, forms,
  segmented controls, bars, legends, and process flows similar to the operator
  benchmark images.
- Accessibility is part of component correctness: semantic markup, names,
  keyboard behavior, focus behavior, reduced motion, and contrast are gates.
- Speculum consumes Tela's shared static rendering path instead of maintaining
  a second general document IR after the migration gate.
- A browser example consumes the same component source through `faber-web` and
  proves observable interactive behavior.
- At least one separate extension package defines a nontrivial component family
  and theme additions without modifying Tela or Radix.
- Radix continues to own language and TypeScript emission facts only. It gains
  no `@ web`, `@ component`, HTML-tag, CSS-property, theme, or widget builtins.

## Development Posture

- **Clean break at the shared seam.** Once Tela's static view protocol is
  accepted, migrate Speculum to it and delete the duplicated general IR. Do not
  maintain adapters between two permanent node models.
- **Framework meaning stays in packages.** Radix parses, types, lowers, and
  emits ordinary Faber values and closures. Tela and `faber-web` own web
  semantics.
- **Web-specific, not falsely universal.** Tela may support HTML, SVG, CSS, and
  browser behavior. Do not dilute the first protocol into a hypothetical native
  desktop/mobile UI abstraction.
- **Protocol before catalog.** Prove extension, rendering, accessibility, and
  behavior seams before producing dozens of reference widgets.
- **Pure components by default.** Component construction should be deterministic
  for the same props, model, and theme inputs. Effects belong at behavior and
  host boundaries.
- **No raw markup as the ordinary path.** Text and attributes escape centrally.
  A raw HTML/CSS escape hatch, if one is earned, must be explicit, quarantined,
  and absent from reference components.
- **Deterministic assets.** Static HTML, CSS, manifests, and stable mount
  identities must reproduce byte-for-byte from the same inputs.
- **No framework-shaped compatibility shims.** Existing controller behavior can
  remain a browser-host surface while Tela is proved, but it must not force a
  second permanent component API.
- **Minimize TS/JS; dogfood Faber for scripts that do things** (operator
  preference 2026-08-09; scope decision 2026-08-09: **Tela-first**). Tela's
  product source is pure Faber and stays that way. Harness/tooling that "does
  things" (fake DOM, assertion sequences, orchestration) should be Faber
  scripts, not TypeScript/Python, using the faberlang.dev generator as the
  complexity reference — the only unavoidable TS is the emitted web-target
  output and the `faber-web` browser-host runtime (TS by contract). The
  conversion folds into the **Stage 5 lowering as a named unit** (fake DOM +
  harness TS → Faber source, gates stay green; executed-orchestration rides
  the hardening executed lane); a workspace-wide version is a follow-on goal
  only if the Tela conversion earns it. Recorded here so no delivery invents
  a TS-first harness.

## Implementation Workflow

1. Select the first planned, unblocked campaign stage.
2. Lower the whole coherent stage into a repo-aware delivery spec.
3. Use `goal-check` on design/goal artifacts before implementation begins.
4. Execute implementation through `factory` in the owning repo or packet.
5. Validate the stage in every consumer named by its gate.
6. Review shared protocol changes with `consequences`, `correctness`, and an
   independent audit before accepting the stage.
7. Update this campaign with evidence, routing changes, residuals, and the next
   selected stage.

## Scope Routing

| Work family | Primary owner | Campaign rule |
| --- | --- | --- |
| View, style, theme, behavior, accessibility protocols | `tela` (this repo) | Framework-owned Faber packages; no Radix builtins. |
| Static HTML/CSS rendering | `tela` | Deterministic pure rendering with central escaping. |
| DOM scope, event subscription, browser services | `faber-web` | Browser host/runtime; Tela may consume it, not duplicate it. |
| Browser package graph and TypeScript/ESM build | `faber` | Product packaging only; consumes framework metadata and assets. |
| Language, type, closure, generic, and TS emission gaps | `radix` | Split out only when a minimized ordinary-Faber proof exposes a shared compiler defect. |
| Browser capability and reciprocity documentation | source-owning repo selected from history | Stage 0 traces the dangling citation, names the authoritative document, and routes the repair to `radix` or `faber-web`. |
| Static-site adoption proof | `faberlang.dev` | Consumer and migration oracle; not the owner of shared Tela protocols. |
| Interactive and extension proofs | `examples` or dedicated sibling packages | Product evidence; keep benchmark/application concepts out of Tela core. |

### Explicitly Out Of Scope

- A compiler `Target::Web`, HTML syntax, JSX-like grammar, CSS grammar, or
  compiler-owned component annotations.
- A general native/mobile/terminal UI abstraction in the first campaign.
- Canvas/WebGL/WebGPU rendering engines; they may later be client libraries or
  host adapters.
- Server routing, backend APIs, database state, authentication, or deployment.
- Pixel-perfect reproduction of the benchmark brand or use of its trademarks.
- A full React, Flutter, or browser-DOM compatibility layer.

## Batching And Split Policy

| Stage family | Posture | Split only when |
| --- | --- | --- |
| Protocol design | `discovery-first` | A language/codegen limitation makes the preferred behavior or style model impossible. |
| Core view and serializer | `batch-by-default` | HTML and SVG namespace/escaping rules require distinct internal serializers. |
| Style and theme | `discovery-first` | Typed values and open CSS extension cannot share one honest representation. |
| Browser behavior | `split-on-boundary` | Event attachment, update strategy, focus, or async effects expose different lifecycle risks. |
| Independent extension proof | `discovery-first` | Public package, theme, style, or behavior seams cannot support the two-package canary without framework edits. |
| Reference primitives | `batch-by-default` | Forms and composite widgets require behavior/a11y gates beyond static primitives. |
| Data display and charts | `batch-by-default` after one bar pattern | SVG, HTML layout, and responsive measurement require separate renderer contracts. |
| Consumer migration | `split-on-boundary` | Repo ownership, release timing, or live-site safety prevents one coordinated migration. |

## Ground Truth Researched

| Source | Current fact | Campaign consequence |
| --- | --- | --- |
| [`faber-web/README.md`](../../../../faber-web/README.md) and `src/` | Provider `web`; `WebController`; scoped DOM query/mutation/events/fetch; TypeScript binding shim. | Reuse it as browser host instead of putting DOM effects in Tela core. |
| [`browser-application-delivery.md`](../../../../radix/docs/factory/faber-hir-v1/browser-application-delivery.md) | Browser product H3 shipped around external documents and HIR-to-TypeScript. | Tela is a new framework layer, not a new compiler target. |
| [`web-build-target/goal.md`](../../../../radix/docs/factory/web-build-target/goal.md) | The first browser goal deliberately kept HTML/CSS external and deferred a full framework. | Tela explicitly reopens that deferral; it does not rewrite the historical first-delivery gate. |
| [`document_ir.fab`](../../../../faberlang.dev/generator/src/document_ir.fab) | Faber already expresses recursive `discretio Node`, attributes, fragments, escaping, and serialization. | Use as evidence and migration source, not as the permanent shared package location. |
| [`speculum-document-ir.md`](../../../../faberlang.dev/docs/design/speculum-document-ir.md) | Speculum moved chrome and Markdown from raw HTML toward typed values. | Static rendering is already proven enough to justify extraction pressure. |
| [`radix/EBNF.md`](../../../../radix/EBNF.md) | Generics, closures, genera, interfaces, tagged unions, lists, maps, and imported annotation contracts exist. | Stage 0 can express candidate protocols in ordinary Faber before asking for language changes. |
| [`target-capability-matrix.md`](../../../../radix/docs/design/target-capability-matrix.md) | Current file does not contain the browser-product section cited by `faber-web/README.md`. | Stage 0 must reconcile capability-document authority before making release claims. |
| [`CAMPAIGN-review-1.md`](../../../../docs/campaigns/tela/CAMPAIGN-review-1.md) | Verified source claims and identified hard Stage 0, identity, focus, ordering, async, and early-extension gates. | Accepted as campaign-maintenance input; Stage 0 must close the load-bearing items rather than carry them into Stage 1. |
| [`CAMPAIGN-review-2.md`](../../../../docs/campaigns/tela/CAMPAIGN-review-2.md) | Confirmed readiness and identified late extension sequencing plus missing product assembly and explicit identity surfaces. | Independent extension proof moves before the reference catalog; assembly and identity become protocol gates. |
| Operator benchmark images, 2026-07-18 | Repeated grammar: panels, tables, selected rows/columns, segmented controls, bars, legends, whiskers, process steps, semantic emphasis. | Reference catalog and visual acceptance fixtures should exercise these families without copying brand identity. |

## Current State

| Track | State | Next action |
| --- | --- | --- |
| Campaign | Ready for delivery | Lower Stage 0 as the selected protocol/ownership delivery. |
| Name and identity | Local `tela` repo exists on `main`; package/provider remain working names | Stage 0 locks package/provider and final public identity; remote publication remains gated. |
| View IR | Proven locally in Speculum, not reusable | Design and spike the minimal shared protocol. |
| Browser runtime | Minimal scoped DOM runtime shipped | Define Tela's consumption seam and update lifecycle. |
| Style/theme | External CSS only | Define open tokens, stylesheet bundles, and deterministic emission. |
| Components | Application/site-local builders | Defer catalog expansion until protocol gates and the Stage 4 independent extension proof close. |
| Extensibility | Unproved and load-bearing | Run a two-package canary in Stage 0 and a full independent proof immediately after browser lifecycle, before the catalog. |
| Capability docs | Browser citation mismatch | Reconcile in Stage 0; do not broaden claims meanwhile. |

## Campaign Path

### Stage 0 — Protocol And Ownership Contract

**Status**: accepted — Stage 0 delivered + closed out (2026-08-09); Stage 1 selected next
**Source**: this campaign's Protocol Design Pass 1
**Why now**: every repo boundary and later component depends on one accepted
view/style/theme/behavior contract.
**Batching**: `discovery-first`
**Lowers to**: `delivery`, then a bounded design/spike `factory` phase
**Overlap rule**: consume existing `faber-web` and Speculum evidence; do not
edit their public APIs during the design-only slice.

**Closeout evidence** (workflow step 6, `tela/docs/factory/mvp/tela-closeout.md`):
all five gates satisfied — C1 ownership+trace (`stage-0-ownership.md`,
`stage-0-capability-reconciliation.md`), C2 Branch B selected
(`spike/stage-0-branch-a-b-evidence.md`), C3 capability repaired (radix
`31b234671`, faber-web `0cd5a1a`), C4 two-package canary green
(`stage-0-canary.md`), C5 decisions closed (`stage-0-behavior-design.md`,
`stage-0-protocol-policies.md`). Step-6 review (consequences + correctness +
independent audit) passed with no blocking findings; **Stage 0 accepted**.
Residuals routed: D0–D3 + G1–G6 → radix lane; TS async gap → Stage 3; Branch A
re-spike on radix D1; determinism harness → Stage 1; capability truth → Stage 8.

**Stage 1 readiness**: `View` shape derives from **Branch B (non-generic)** —
pure recursive tagged union, open element model, typed `Identitas` serialized
as `data-tela`, adjacent typed behavior plan keyed to stable identities;
kernel owns constructors. D0–D3 compiler deliveries + G1–G6 canary gaps are
recorded as the **radix-lane input** (repros under `tela/spike/`).

**Gate**:

- a checked two-package Faber spike has one extension library define a custom
  view helper and namespaced token, and one application consume them in the
  benchmark panel/table/bar composition;
- the same generic-recursive view and message-bearing closure candidate is
  checked through both Rust and TypeScript lanes, producing evidence that
  selects Branch A or rejects it in favor of Branch B; Stage 1 cannot freeze a
  `View` shape before this decision;
- spike-quality static HTML/CSS is emitted only to prove representability; it
  is not counted as Stage 1's production serializer or determinism gate;
- the behavior design describes an interactive segmented control without
  compiler-specific UI meaning and records the existing TypeScript async
  `@ futura` inside `fac`/`cape` gap as an explicit Stage 3 input;
- local ownership is resolved: this repo is the Stage 1 cwd; final
  package/provider naming is locked before implementation, and no
  remote/publication action is implied;
- `git log` and WEB6 evidence determine whether the dangling browser-capability
  citation belongs to a missing Radix section, a renamed section, or a stale
  `faber-web` reference, and name the owning repair;
- raw-markup posture, public API vocabulary policy, CSS value openness, and the
  Tela-to-`WebController` mount relationship are decided rather than carried
  open.

### Stage 1 — Tela Kernel And Static Renderer

**Status**: delivered — Stage 1 closed out (2026-08-09); Stage 2 selected next
**Source**: Stage 0 delivery
**Why now**: establish the reusable package and deterministic output before
browser lifecycle complexity.
**Batching**: `batch-by-default`
**Lowers to**: `delivery` → `factory`
**Overlap rule**: copy no Speculum source wholesale; extract the accepted
contract and migrate through public package imports.
**Gate**: typed HTML/SVG view values; explicit stable identity serialized in a
documented hydration-ready form; central escaping; tag/attribute lexical and
namespace validation; deterministic HTML and initial CSS serialization;
deterministic double-build evidence; package tests; and the static half of the
two-package benchmark composition. Tela v1 has no raw-markup `View` variant.

**Closeout evidence** (workflow step 6, `docs/factory/mvp/stage-1-closeout.md`):
all six gates satisfied — CG1 kernel contract (U1 `5bc797e`), CG2 validation
(U2 `836965c`), CG3 serializer (U3 `05909f7`), CG4 docs + reconcile (U4
`20d9bfd` + `d4ad577`), CG5 benchmark static two-package composition (U5
`d71e29f`, `stage-1-benchmark-static.md`), CG6 tests + determinism (U6
`e8fb083`, `stage-1-determinism.md`). Determinism: the benchmark composition
static output builds twice byte-for-byte identical — sha256
`a0f1b1cb170eded36c2816011320399080c60644f3182b7bd0167300f1f8613b`, fail-closed
(diff fails). One correctness repair landed at the closeout (U2 `img` name-set
fix, `4c00192`). Independent auditor re-run of `scripta/check-determinism` is
routed by Mind (named test owner) before campaign acceptance. Residuals
routed: Rust provider-module locale propagation (CODEGEN001) + G4 + G5 +
emitter observations → radix lane; TS async gap → Stage 3; Branch A re-spike on
radix D1; versioning/capability truth → Stage 8. **Stage 2 selected next.**

### Stage 2 — Style And Theme Protocol

**Status**: accepted — Stage 2 closed out; acceptance record corrected (fire-9 independent audit 2026-08-09 confirmed the closeout evidence); Stage 3 selected next
**Source**: Stage 0 style decision
**Why now**: downstream component libraries need stable visual roles before a
catalog is authored.
**Batching**: `discovery-first`, then `batch-by-default`
**Lowers to**: `delivery` → `factory`
**Gate**: two materially different themes render the same component tree;
namespaced extension tokens work; duplicate/invalid token and rule output fails
closed; product assembly deduplicates bundles and orders extension packages by
dependency-graph topological order with stable package-identity tie-breaking;
cycles and ambiguous conflicts reject; output is deterministic.

### Stage 3 — Browser Mount And Update Lifecycle

**Status**: accepted — Stage 3 closeout evidence + independent audit clean_pass (2026-08-09); audit-before-acceptance held; Stage 4 selected next
**Source**: Stage 0 behavior decision and `faber-web` runtime
**Why now**: prove the same component source can become an interactive client
without adding a second authoring model.
**Batching**: `split-on-boundary`
**Lowers to**: `delivery` → `factory`
**Overlap rule**: extend `faber-web` only for general host gaps; Tela owns
component lifecycle and state/update semantics.
**Gate**: a segmented control mounts, handles keyboard and pointer input,
updates selected state, ARIA state, and any declared live region; disposes
subscriptions; and executes explicit focus-restoration and scroll-anchor
effects across region replacement. The delivery must resolve or route the known
TypeScript async gap before claiming fetch-driven updates.

### Stage 4 — Independent Extension Package Proof

**Status**: accepted — non-interactive proof complete (U1–U5; independent
audit clean_pass 2026-08-09, audit-before-acceptance held, verdict mail
a7a89c12); interactive gate U6/U7 MET 2026-08-09 (independent audit PASS
with scoped claim wording — verdict mail f9b616c0, audit-before-acceptance
held; commits tela `b6050ea` + `1423666`, faber-web `c48f152`, radix
`e32397630` + `2103f8a7f`)
**Entry conditions**: MET — the Stage 4 interactive-proof gate (CTO10-3) is
closed. Claim, exactly as audited: real en→la `web:dom` import +
`tela:browser` public lifecycle (mount/replace/dispose) + formslib composed
through normal qualified imports; mount via `dom.scope` + `browser.mount`;
an 8-step scripted interaction sequence asserted under node (exit 0) crossing
the ACTUAL faber-web seam — emitted app/browser `dom.*` refs → emitted
web:dom provider module → `bindings/ts.toml` mapping → `runtime/dom.ts`
implementation (verbatim) — over a WEB5-precedent fake DOM; no tela-side
shim, no same-named webDom* globals; synchronous-only. Scope: hydration
fidelity = identity + tag name from `dom.snapshot` (tagName-only;
faber-web's namespace/local Nodus fields emitted but not yet consumed).
Residuals: CODEGEN001 (Rust path), `verum`→`b` workaround, 9 `dom.on*`
WARN014 skips.
**Source**: campaign governing invariant and Stage 0 two-package canary
**Why now**: the framework is not extensible merely because its own components
compile; prove the public seam before building the reference catalog.
**Batching**: `discovery-first`
**Lowers to**: `delivery` → `factory`
**Overlap rule**: the proof package may depend only on Tela public modules and
documented `faber-web` host seams.
**Gate**: a separate package adds a component family, styles, namespaced theme
tokens, behavior, product assembly input, and tests without modifying Tela,
`faber-web`, `faber`, or Radix.

### Stage 5 — Reference Primitives And Forms

**Status**: active — delivery admitted (2026-08-09, `stage-5-delivery.md`: 10 units/10 waves, SG1–SG10; U1 discovery pending the naming-review admission checkpoint)
**Source**: operator visual grammar and accessibility contract
**Why now**: validate that ordinary application UI is concise without baking
application concepts into the kernel, after the public extension seam is real.
**Batching**: `batch-by-default`; split forms on behavior/a11y boundary
**Lowers to**: `delivery` → `factory`
**Gate**: layout, typography, panel, table, button, field, segmented-control,
badge, and metric families work in static and browser proofs with accessibility
checks.

### Stage 6 — Data Display And Visualization

**Status**: planned; depends on Stage 5
**Source**: benchmark tables, bars, legends, whiskers, and process flows
**Why now**: pressure-test custom rendering shapes and SVG/HTML composition.
**Batching**: `batch-by-default` after one horizontal bar pattern
**Lowers to**: `delivery` → `factory`
**Gate**: data table, bar meter, stacked bar, whisker bar, legend, and process
flow reproduce the benchmark grammar responsively with accessible textual
equivalents and no benchmark-specific concepts in Tela core.

### Stage 7 — Consumer Migration And Duplicate-IR Removal

**Status**: planned; depends on Stages 4-6
**Source**: Speculum and browser application proofs
**Why now**: prove the framework against real consumers and establish one
canonical view truth.
**Batching**: `split-on-boundary` by repo; clean break inside each consumer
**Lowers to**: separate repo-aware `delivery` specs → `factory`
**Gate**: Speculum renders through Tela and deletes its duplicate general view
IR; the browser fixture renders and mounts Tela components; each repo's existing
product gates remain green.

### Stage 8 — Hardening, Documentation, And Release Decision

**Status**: planned; depends on Stage 7
**Source**: accepted protocol and consumer evidence
**Why now**: stabilize public contracts only after independent and real-consumer
pressure.
**Batching**: `batch-by-default`; split external publication/release effects
**Lowers to**: `delivery` → `factory`; release workflow only with operator
authorization
**Gate**: API and architecture docs, examples, accessibility matrix, target
capability truth, versioning decision, release notes, and explicit deferred
features are complete.

## Protocol Design Pass 1

This section is the first follow-up design pass. It selects a direction for
Stage 0 to pressure-test; illustrative type names are not yet a public API.

### 1. Architectural Center

Tela should standardize **values and transformations**, not a closed registry of
widgets:

```text
application model / library props
              │
              ▼
      pure Faber component functions
              │
              ▼
 View + StyleBundle + BehaviorPlan
              │
              ▼
      deterministic product assembly
              │
       ┌──────┴───────────┐
       ▼                  ▼
static renderer       browser renderer
HTML + CSS            DOM mount + updates
```

A table, date picker, chart, or editor is a library function that returns these
values. It does not require a new `View` variant named after the widget.

### 2. View Protocol

The lead shape is a small recursive tagged union with an open element model:

```fab
ordo Spatium {
    html,
    svg
}

genus Attributum {
    textus nomen
    textus valor
}

genus Proprietas {
    textus nomen
    textus valor
}

genus Identitas {
    textus valor
}

genus Eventum {
    textus nomen
}

typus Nuntius<Message> = (Eventum) → Message

genus Vinculum<Message> {
    textus eventus
    Nuntius<Message> nuntius
}

discretio Visus<Message> {
    Elementum {
        Identitas ∪ nihil identitas,
        Spatium spatium,
        textus tag,
        lista<Attributum> attributa,
        lista<Proprietas> proprietates,
        lista<Vinculum<Message>> vincula,
        lista<Visus<Message>> liberi
    },
    Textus { textus valor },
    Fragmentum { lista<Visus<Message>> liberi }
}
```

The Stage 0 spike may rename these types, but it must preserve these properties:

- arbitrary standard HTML and SVG tags do not widen a compiler or framework
  enum;
- text and attribute escaping occurs only in renderers;
- HTML and SVG namespace transitions are explicit;
- fragments are structural and emit no wrapper;
- void-element correctness is renderer-owned;
- stable identity has an explicit typed field, is not inferred from array
  position, and has one documented static serialization;
- DOM properties (`value`, `checked`, selection) are modeled separately from
  serialized attributes when their semantics differ;
- tag and attribute names are lexically and namespace validated, so `textus
  tag` cannot inject markup; standard helpers provide known HTML/SVG semantics,
  while syntactically valid custom elements and future-standard names remain
  extensible;
- Tela v1 has no unsafe raw-markup `View` variant. Typed elements, including
  SVG and `foreignObject`, remain the canonical construction path.

The generic `Message` parameter is provisional and belongs to the behavior
decision below. If current Faber target support cannot carry it honestly, keep
the pure non-generic `View` tree and place behavior in an adjacent typed plan;
do not erase behavior types into unvalidated strings merely to preserve the
sketch.

### 3. Component Contract

A component is a function, conventionally:

```text
Props → View<Message>
(Model, Props) → View<Message>
```

Tela should not require inheritance or registration. Higher-level libraries
compose child views and may map child messages into an application message
type. Standard constructors are ergonomic helpers over the same public view
values, not privileged compiler syntax.

Component output may carry or reference a deterministic style bundle. Styles
must be deduplicated by stable identity during product assembly so repeated
component instances do not repeat stylesheet text.

The first vertical proof crosses a real package boundary: an extension package
defines one custom helper and style/token contribution; the application imports
and assembles it. A same-file “extension” does not close the canary gate.

### 4. Style Protocol

The style model must balance correctness with CSS's intentionally open
ecosystem. The provisional split is:

- structured `StyleSheet`, `Rule`, `Declaration`, media/container condition,
  keyframe, and layer values;
- typed constructors for common colors, lengths, numbers, timing values, and
  token references;
- open custom-property names and namespaced library tokens;
- an explicit audited extension value for CSS features Tela does not yet model;
- no ordinary component API that accepts a whole raw stylesheet string.

Product assembly emits deterministic cascade layers in this order:

```text
tela.reset
tela.tokens
tela.components
library packages
application
```

Exact layer names and whether reset styles ship by default remain Stage 0
decisions. Ordering, duplicate identities, and conflicting definitions must be
observable and fail closed where ambiguity would change output. Extension
packages are ordered by dependency-graph topological order, then stable package
identity as the deterministic tie-break. Cycles and duplicate identities with
different content reject.

### 5. Theme Protocol

A theme supplies semantic values, not component markup:

```text
surface.canvas
surface.panel
surface.subtle
text.primary
text.muted
border.default
accent.primary
state.positive
state.caution
space.*
radius.*
type.*
motion.*
```

Core tokens form a small interoperable baseline. Extension libraries add
namespaced tokens such as `chart.axis.muted` or `form.field.invalid`; Tela does
not widen one closed `Theme` genus for every library. Theme resolution emits
CSS custom properties at a selected root and rejects missing required tokens
before emitting an application artifact.

Themes may provide light, dark, high-contrast, and reduced-motion variants.
They must not silently change DOM semantics or accessibility relationships.

### 6. Behavior And State Branches

Stage 0 must spike three approaches against both Rust static generation and
TypeScript browser output:

| Branch | Shape | Strength | Primary risk |
| --- | --- | --- | --- |
| **A — typed messages (lead)** | `View<Message>` events produce messages; `update(Model, Message)` returns next model; `view(Model)` rerenders | Pure component boundary, testable state, renderer separation | Generic recursive views and closure fields may expose current target gaps. |
| **B — adjacent behavior plan** | pure `View` plus `Binding<Message>` keyed to stable nodes | Static IR stays closure-free; explicit hydration plan | View/binding drift and key management. |
| **C — direct handlers** | view events store closures that mutate captured state or DOM | Closest to current `faber-web`; smallest browser step | Weak static story, hidden effects, difficult composition and disposal. |

Provisional decision: pursue **A**, retain **B** as the fallback if the
cross-target spike exposes a real language boundary, and keep **C** as a
low-level `faber-web` host capability rather than Tela's primary component
model.

The first update strategy should be deliberately simple: rerender or replace an
explicit mounted region after a message. The update result carries declarative
host effects for focus restoration, focus movement, and scroll anchoring so
region replacement does not silently destroy interaction state. A keyed
reconciliation engine, fine-grained signals, hooks, and concurrent rendering
are deferred until measured application pressure earns them.

The Stage 0 spike must include the known TypeScript backend limitation recorded
by `faber-web`: `@ futura` calls inside `fac`/`cape` blocks are not awaited. The
initial synchronous behavior proof may proceed, but fetch-driven or async
update claims remain blocked until the gap is fixed or a separate compiler
delivery is routed.

### 7. Renderer Contracts

Do not force unlike renderers behind a fake common return type. The conceptual
operations are:

```text
assemble(Product)                    → ProductAssets
html(View)                         → text
css(AssembledStyles, Theme)        → text
mount(Scope, Program, Theme)       → Mounted
replace(MountedRegion, next View)  → update result
dispose(Mounted)                   → vacuum
```

`assemble` owns dependency ordering, style-bundle deduplication, token
resolution, stable identity manifests, conflict diagnostics, and asset
selection. Per-bundle `css` rendering is insufficient as the product contract.

Static rendering ignores behavior but must emit stable identity and semantic
state required for later mounting. Browser mounting consumes an explicit root
scope and never performs descendant lookup through ambient global document
shortcuts. Hydration means attaching to matching Tela-rendered markup; mismatch
must diagnose or replace by declared policy rather than silently binding the
wrong tree.

### 8. Accessibility Contract

Tela core must support arbitrary semantic elements and ARIA attributes, but the
reference component library owns stronger widget contracts:

- accessible name and description relationships;
- keyboard operation matching the widget role;
- visible focus and deterministic focus restoration;
- semantic state (`aria-selected`, `aria-expanded`, `aria-invalid`, etc.);
- live-region policy for status and layout changes, including when an update
  should remain silent;
- table headers and textual equivalents for visual charts;
- reduced-motion and high-contrast theme behavior;
- no color-only communication of success, warning, or selection.

Static structure tests and browser behavior tests are both required. Snapshot
HTML alone cannot close an interactive accessibility gate.

### 9. Extension Contract

A client library is conformant when it can, using public Tela modules only:

1. define typed props and optional model/message types;
2. return HTML/SVG view values with stable identities;
3. publish a deduplicated style bundle;
4. declare required core and namespaced theme tokens;
5. expose accessible behavior and disposal;
6. render statically and mount in a browser application;
7. validate without editing Tela or Radix.

This is the load-bearing campaign gate. “Users can wrap our built-in widgets”
is not sufficient evidence of a general framework.

### 10. First Vertical Proof

The first proof should use two packages: one small extension library and one
dashboard application. Together they provide:

- an extension-owned custom view helper and namespaced theme token;
- a themed panel;
- a two-column metric table;
- a horizontal bar meter with label and textual value;
- a segmented control switching between one- and two-column layout;
- static HTML/CSS output from the initial model;
- browser mounting where keyboard or pointer input produces a typed message,
  updates the model, rerenders the selected state, and disposes cleanly.

This slice exercises package-boundary extension, generic composition, product
assembly, style collection, tokens, responsive layout, semantic selection,
state updates, accessibility, and both renderers without prematurely building
a large catalog.

## Dependency Rules

1. Do not start component-catalog implementation before Stage 0 selects one
   behavior model, Stage 1 establishes the shared view truth, and Stage 4 proves
   an independent extension package against the public seam.
2. Do not edit Radix for a Tela concept. File a separate minimized compiler
   delivery only when ordinary Faber code that should work fails a shared
   language/target gate.
3. Do not move Speculum to a transitional wrapper around its existing IR.
   Migrate only after Tela's static protocol is accepted, then delete the
   duplicate general model.
4. Do not make `faber-web` a second component framework. It remains the browser
   host and service boundary.
5. Do not publish or reserve external repository/package names until the
   operator confirms the final identity and publication action.
6. Do not claim SSR, hydration, reactive granularity, form framework, routing,
   animation, or chart completeness until a named stage provides evidence.
7. A browser-only component cannot prove the core protocol; a static-only
   component cannot prove behavior. Shared-source evidence is required.
8. Stage 1 cannot begin until Stage 0 records Rust and TypeScript evidence for
   Branch A or explicitly selects Branch B, and the local Tela owning cwd
   exists.
9. Unknown tag names are not rejected merely for being new: reject invalid
   lexical shape, namespace misuse, impossible void-element structure, and
   unsafe content. Preserve standards evolution and valid custom elements.

## First Useful Milestones

1. **Protocol proof** — one checked Faber source shape for view, style, theme,
   and behavior compiles through the required Rust and TypeScript lanes.
2. **Extension canary** — a second package contributes a custom helper and
   namespaced token without framework or compiler edits.
3. **Dual renderer proof** — one component tree emits static HTML/CSS and mounts
   interactively.
4. **Theme proof** — the same tree renders under two materially different
   themes with no component changes.
5. **Ecosystem proof** — a separate package extends view, style, theme,
   behavior, and product assembly through public contracts only.
6. **Visual grammar proof** — reference table/bar/process components cover the
   benchmark family accessibly and responsively.
7. **Adoption proof** — Speculum and a browser application share the canonical
   Tela protocol.

## Acceptance Criteria For This Campaign Artifact

- The desired framework outcome and non-goals are explicit.
- Repo and package ownership are routed without making Radix the UI framework.
- Existing `faber-web` and Speculum work are treated as evidence, not silently
  replaced or misrepresented.
- The minimal protocol design names view, style, theme, behavior, renderer,
  accessibility, and extension seams.
- The behavior decision has a lead branch, a bounded fallback, and a spike gate.
- Product assembly, stable identity serialization, deterministic package
  ordering, and focus/scroll effects are explicit protocol concerns.
- The extension seam has an early two-package canary and a full gate before the
  reference catalog.
- Campaign stages identify order, batching posture, dependencies, lowering
  path, and observable gates.
- Stage 0 is selected as the next delivery-sized campaign stage.
- External publication and release remain explicit authorization gates.

**Readiness**: **Ready for delivery** — lower Stage 0 as one coherent
protocol-and-ownership delivery, including the cross-target spike and capability
document reconciliation.

## Validation

Campaign maintenance checks:

- every linked local source exists;
- Stage 0 remains the first incomplete, unblocked stage until its delivery is
  accepted;
- no stage claims implementation evidence from this planning artifact;
- campaign status and current-state rows agree;
- capability claims are checked against live source before each stage closeout.

Downstream validation is stage-owned. Expected categories include:

- `radix check` and target-specific Rust/TypeScript emission for protocol
  exempla;
- an actual two-package import/build check for the extension canary;
- Tela serializer/style/theme unit and property tests;
- deterministic double-build comparison beginning in Stage 1;
- DOM/browser behavior and disposal tests;
- accessibility structure and keyboard/focus checks;
- consumer repo product gates;
- `git diff --check` in every changed Git repo.

## Open Questions

1. Does the final public identity remain **Tela**, and are repo/package/provider
   names all `tela`, or does the repository use a longer disambiguating name?
2. Can `View<Message>` and event-producing closures compile honestly across the
   required Rust and TypeScript lanes, or should behavior use an adjacent plan?
3. What is the smallest honest CSS value model that stays open to evolving web
   standards without making raw strings the default?
4. Does Tela mount directly through `web:dom`, or does `faber-web` gain one
   general renderer-host interface owned below component semantics?
5. Which public API vocabulary policy should Tela use: Faber-Latin type and
   field names, clear English web terms, or a documented split between project
   identity and protocol vocabulary?
6. Which independent extension package provides the strongest Stage 4 proof:
   charts, forms, or a documentation-layout library?

## Stop Conditions

- Stop if implementation begins from this campaign without a Stage 0 delivery
  spec and readiness check.
- Stop if the proposed protocol requires compiler-known HTML, CSS, component,
  theme, or behavior families.
- Stop if genericity is obtained by accepting unchecked raw HTML/CSS/event
  strings throughout the ordinary component API.
- Stop if a compatibility adapter would leave two permanent canonical view or
  component models.
- Stop if Tela starts absorbing browser packaging, compiler target truth, or
  site-specific content responsibilities owned by sibling repos.
- Stop before creating a public repository, publishing a package, deploying a
  consumer, or making release claims without fresh operator authorization.
- Stop and split a minimized compiler delivery if the Stage 0 spike exposes a
  genuine cross-target Faber defect; do not weaken the framework contract to
  hide it.
