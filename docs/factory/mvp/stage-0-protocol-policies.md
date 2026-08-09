# Stage 0 — Protocol Policies Lock

**Status**: active (decision record for Stage 0 U6)
**Unit**: `tela-s0-u6-protocol-policies`
**Hand**: hand-6, 2026-08-09
**Delivery spec**: `stage-0-delivery.md` U6
**Campaign**: `CAMPAIGN.md` Stage 0 gate bullet 7 ("raw-markup posture, public
API vocabulary policy, CSS value openness, and the Tela-to-`WebController`
mount relationship are decided rather than carried open"); §2 View Protocol;
§4 Style Protocol; §5 Theme Protocol; Open Q3, Open Q5; dependency rules 3/9;
stop conditions 3/7.
**Review reconciliation**: `docs/campaigns/tela/CAMPAIGN-review-1.md` items
4 (identity serialization), 8 (extension ordering determinism), 9 (raw-hatch
quarantine), 10 (tag-name validation), 11 (Latin/English vocabulary split),
13 (determinism harness timing).
**U3 evidence**: `spike/stage-0-branch-a-b-evidence.md` — Branch B selected
(pure non-generic `Visus` + adjacent typed `Vinculum` plan keyed to stable
node identities); `spike/visus-b.fab` is the working candidate that passes
`radix check`, TS `tsc --noEmit`, and Rust scratch `cargo check`.

This record locks five protocol policies for Stage 1 (kernel + static
renderer) and Stage 2 (style and theme protocol). It makes **no**
implementation — no CSS engine, no theme, no serializer, no validation
registry (§7).

---

## 1. (a) Raw-markup posture

**Locked rule: Tela v1 has no raw-markup `View` variant.** Typed elements —
including SVG and `foreignObject` via the open element model — are the
canonical construction path (campaign §2; review item 9).

Three parts:

1. **No raw variant in v1.** The `Visus` union (campaign §2 sketch; U3
   `visus-b.fab` `union Visus`) contains only `Elementum`, `Textus`, and
   `Fragmentum`. There is no `RawHtml` / `RawCss`-style variant that accepts a
   pre-escaped blob as an ordinary path. Stop condition 3 ("genericity obtained
   by accepting unchecked raw HTML/CSS/event strings throughout the ordinary
   component API") is thereby observed.

2. **Tag and attribute names are lexically + namespace validated.** `textus
   tag` in the sketch means tag names are *strings*, not that they are raw
   holes (review item 10). Locked rule:
   - tag names must pass **lexical validation** (a valid HTML/SVG tag-name
     shape) before rendering;
   - namespace transitions are **explicit**: the `Spatium` enum
     (`html` / `svg`) marks each element's namespace (campaign §2; U3
     `visus-b.fab`);
   - attribute names are likewise lexically validated; attribute values and
     text are **escaped centrally in the renderer** (campaign §2: "text and
     attribute escaping occurs only in renderers");
   - unknown-but-valid names are **not** rejected merely for being new — only
     invalid lexical shape, namespace misuse, impossible void-element
     structure, and unsafe content fail closed (campaign dependency rule 9).
   The implementation of this validation is Stage 1 work; this policy locks
   the posture.

3. **Any future raw escape is quarantined.** If a raw escape is ever earned
   (review item 9), it must: be a distinct typed value added to the `View`
   union **so all renderers handle it uniformly** (not an ad-hoc string
   smuggled through a helper); be explicitly marked unsafe; and **remain
   absent from reference components**. Reference components use only the typed
   path. No raw escape exists in v1; nothing about it is deferred as a
   hidden default.

## 2. (b) Vocabulary policy (campaign Open Q5)

**Locked decision: a documented split.** Faber-Latin names for the protocol's
internal typed surface; clear English web terms for public-facing vocabulary
that touches CSS, DOM, and renderer/host seams. This resolves Open Q5 and the
review item 11 consistency call.

> **SUPERSEDED (operator decision + clarification 2026-08-09; Stage 5 U0).**
> The "Faber-Latin protocol spellings" split is **superseded** by the
> **English-first, end to end** posture: Tela uses the EN keyword locale AND
> English naming patterns for types, methods, fields, and plan types — the
> whole authoring surface is English. Latin's home is Radix canonical form +
> the Norma default surface; calling a Latin-named stdlib function from
> English Tela is a calling detail (call sites keep their names). The Stage 5
> U0 rename wave reworked the whole Tela surface (kernel/lifecycle/forms/
> canary/extension-lib/modules) to the English names; the convention statement
> is in `stage-5-delivery.md` §U0 + `AGENTS.md` (Vocabulary policy). The
> table below is retained as the historical decision record.

| Surface | Vocabulary | Locked examples | Rationale |
|---|---|---|---|
| Protocol types + fields (`tela:*`) | **Faber-Latin** | `Visus`, `Elementum`, `Textus`, `Fragmentum`, `Spatium`, `Attributum`, `Proprietas`, `Identitas`, `Eventum`, `Vinculum`, `Nuntius`; fields `nomen`, `valor`, `liberi`, `attributa`, `proprietates`, `vincula`, `eventus` | Matches the project identity (`tela`, Latin), the campaign §2 sketch, and the U3 spike that compiles through both lanes; keeps the typed protocol surface internally consistent and collision-free |
| Theme tokens | **English web terms** | `surface.canvas`, `text.primary`, `chart.axis.muted`, `form.field.invalid` | Tokens compose with the open CSS custom-property ecosystem; English reads naturally in CSS (campaign §5) |
| Renderer / host verbs | **English** | `mount`, `replace`, `dispose`, `css`, `html`, `assemble` | These are web/behavior seams; English matches `faber-web` and the campaign §7 contracts |
| Extension-contract verbs | **English** | define, return, publish, declare (campaign §9) | Extension authors are package/library authors; English matches their framing |

**The `liberi` vs `children` consistency call — locked: `liberi`.**
Rationale: the protocol's field vocabulary is Faber-Latin as a scheme
(`attributa`, `proprietates`, `vincula`, `liberi` are one consistent set), the
U3 spike compiles `liberi` through Rust and TypeScript without defect, and
deviating to `children` would introduce the only English field inside a Latin
protocol surface. Speculum's existing `Node` uses `children` today; the
Stage 7 migration maps `children` → `liberi` at the migration boundary — a
one-time documented field-name mapping, not a dual permanent vocabulary.

**Field-name constraint from U3:** the spike's D2 defect proved a field named
`tag` collides with the TS emitter's discriminant (`type U = { tag: "V", tag:
string }` → TS2300/TS2717). Protocol field names must therefore not collide
with emitted discriminants; the spike's working spelling is `nomen_tag`
(Stage 1 re-checks D2; the vocabulary policy is independent of which fix is
chosen).

## 3. (c) CSS value openness (campaign Open Q3)

**Locked rule: the smallest honest CSS value model** — typed constructors for
common values, open custom-property names, namespaced library tokens, and one
explicit audited extension value. No ordinary component API accepts a whole
raw stylesheet string.

Components:

1. **Structured style values.** `StyleSheet` / `Rule` / `Declaration`-shaped
   typed values, with media/container condition, keyframe, and layer values as
   the model grows (campaign §4). The U3 spike already proves a minimal
   structured shape (`Stilum` / `Regula` / `Declaratio` in `visus-b.fab`).

2. **Typed constructors for common values** — colors, lengths, numbers,
   timing values, and token references (campaign §4). Common values are
   constructed through typed helpers, not stringly concatenated.

3. **Open custom-property names.** Any syntactically valid CSS custom-property
   name (`--*`) is accepted without a closed enum; names are validated
   lexically, not enumerated. Tela does not widen one closed `Theme` genus for
   every library (campaign §5).

4. **Namespaced library tokens.** Extension libraries declare tokens under a
   namespaced path (e.g. `chart.axis.muted`), consumed through token
   references (campaign §4/§5). Core tokens remain a small interoperable
   baseline.

5. **One explicit audited extension value.** CSS features Tela does not yet
   model ride a single typed escape that carries an audit trail (an explicit
   marker requiring review/allowance) — **not** arbitrary raw strings as the
   default. This is the "explicit audited extension value" of campaign §4.

6. **No whole-raw-stylesheet API.** No ordinary component API accepts a
   complete raw CSS string (campaign §4: "no ordinary component API that
   accepts a whole raw stylesheet string"; stop condition 3). Raw stylesheet
   injection stays out of the ordinary path.

Out of this unit's scope (residual for the Stage 2 delivery): exact cascade
layer names and whether reset styles ship by default (campaign §4 leaves these
as decisions).

## 4. (d) Identity serialization (review item 4)

**Locked rule: stable identity is an explicit typed `Identitas` field,
serialized into static output in one documented hydration-ready form.** This
is a Stage 1 gate requirement (campaign Stage 1 gate: "explicit stable
identity serialized in a documented hydration-ready form"), so Stage 3 has a
contract to bind to.

1. **Typed field, not position.** `Identitas { valor }` is an explicit
   field on the element; identity is never inferred from array position
   (campaign §2; U3 `visus-b.fab`). Elements without identity carry
   `Identitas ∪ null`; only elements with an explicit value serialize identity.

2. **One documented serialization form.** The U3 spike fixes the form:
   identity serializes as a **`data-tela` attribute** carrying the escaped
   `Identitas.valor`:

   ```html
   <div data-tela='contator-app'>…</div>
   ```

   Static output emits `data-tela="<escaped valor>"` on exactly those elements
   whose `Identitas` is non-null. The `data-tela` attribute is the only
   identity serialization form in v1 (review item 4's "one documented,
   hydration-ready form").

3. **Stage 3 binds to this form.** The adjacent behavior plan keys
   `Vinculum.identitas` to `Identitas.valor` values; the browser mount reads
   `data-tela` on the rendered markup to attach bindings and to match on
   hydration (campaign §7: hydration attaches to matching Tela-rendered
   markup; mismatch diagnoses or replaces by declared policy, never silently
   binds the wrong tree). `data-tela` is a documented host seam Tela owns.

## 5. (e) Deterministic extension ordering (review item 8; campaign §4)

**Locked rule (the rule the Stage 2 gate enforces):** product assembly orders
extension packages by **dependency-graph topological order**, with **stable
package identity as the deterministic tie-break**. Cycles and duplicate
identities with different content **reject**. Output is deterministic
(campaign Stage 2 gate).

1. **Primary order: dependency-graph topological order.** Extension packages
   are ordered so a package's dependencies precede it in the emitted cascade.

2. **Tie-break: stable package identity.** Where the dependency graph does not
   impose an order, packages are ordered by stable package identity (the
   locked package name — the `tela` identity from U0 and each extension
   package's own name) as a deterministic, content-independent tie-break.

3. **Fail closed.** Dependency cycles reject. Duplicate stable identities with
   different content reject (ambiguity that would change output fails closed;
   campaign §4). Style bundles are deduplicated by stable identity during
   assembly so repeated component instances do not repeat stylesheet text
   (campaign §3/§4).

4. **Scope note.** This unit locks the ordering *rule*; the implementation
   lives in Stage 2 product assembly. Review item 13's determinism
   double-build harness remains assigned to Stage 1 (recorded as a residual in
   the delivery spec) — the ordering rule here is its pre-requisite
   determinism contract.

## 6. Coverage map (for the reviewer cross-check)

| Policy | Review item | Campaign | U3 evidence |
|---|---|---|---|
| (a) raw-markup posture | 9 (quarantine), 10 (tag validation) | §2; dep rule 9; stop 3 | `visus-b.fab` union has no raw variant; `Spatium` namespaces; `nomen_tag` |
| (b) vocabulary policy | 11 (Latin/English split; `liberi` vs `children`) | §2 sketch, §5 tokens, §7 verbs; Open Q5 | spike compiles `liberi`/`valor`/`nomen_tag` through both lanes; D2 (tag collision) |
| (c) CSS value openness | — (Open Q3) | §4 Style Protocol; Open Q3; stop 3 | `Stilum`/`Regula`/`Declaratio` structured proof |
| (d) identity serialization | 4 (Stage 1 gate) | §2 (typed identity), Stage 1 gate, §7 hydration | `data-tela` serialization form in the spike's structural assertion |
| (e) deterministic extension ordering | 8 (determinism hole) | §4 (topo + tie-break + reject), Stage 2 gate | — (rule record; implementation is Stage 2) |

## 7. Non-goals and scope guard

- No CSS engine, no theme implementation, no serializer, no validation
  registry — this unit records decisions only; implementation is Stages 1–2.
- No `faber-web` / `radix` edits; no scaffold; no behavior/mount decisions
  (U5 owns the mount relationship); no async-gap fix (routed compiler
  delivery).
- Cascade layer names and reset-by-default remain Stage 0/Stage 2 delivery
  decisions, not decided here (campaign §4).
- `CAMPAIGN.md` status line untouched — owned by the Stage 0 closeout.

## 8. Validation

- This doc covers all five policies (a)–(e) with the locked rules and their
  source anchors.
- Reviewer cross-checks against `CAMPAIGN-review-1.md` items 4/8/9/10/11/13
  and campaign §2/§4/§5 (coverage map §6).
- `git diff --check` in `tela/` passes.
