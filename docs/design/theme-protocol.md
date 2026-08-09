# Theme Protocol — design record (tela Stage 2 U4)

**Record**: `tela-s2-u4-docs` (stage-2-delivery.md U4) — the style/theme
protocol written down for later Hands, reviewers, and the Stage 4
independent-extension gate.
**Sources**: the landed Stage 2 U1 kernel (`src/tela.fab`, e194621), the
delivery spec U4, policies (b)/(c)/(e)
(`docs/factory/mvp/stage-0-protocol-policies.md`), campaign §4/§5/§7.
**Status**: the record reconciles against U1's landed emission. The
assembly/cascade record is U2's (in flight on hand-7); this record uses
the delivery's layer list and marks the reconciliation (below).

## Token rendering convention (locked)

A token `name` is a **dotted path** (`chart.axis.muted`). The rendered
CSS custom property is `--` + the name with `.` → `-`:

```text
chart.axis.muted  →  --chart-axis-muted
surface.canvas    →  --surface-canvas
form.field.invalid → --form-field-invalid
```

The conversion is a deterministic single-character scan
(`token_property_name`). `theme_css` emits the resolved tokens at a
**selected root**: one `Rule { selector = ":root" }` whose
`Declaration` values are the resolved tokens, serialized through the
existing `css(Style)` serializer (policy (b) verb). Multi-dot mapping
edge (`form.field.invalid`) is covered by the U1 exempla.

## Core token baseline

The **core baseline** is the required token set a theme must cover
(`core_tokens()`, pinned in the kernel header):

```text
surface.canvas   surface.panel   text.primary   text.muted
border.default   accent.primary  state.positive state.caution
```

Eight required tokens from the campaign §5 families `surface.*` /
`text.*` / `border.*` / `accent.*` / `state.*`. It is a **required set,
NOT a closed enum** (campaign §5, policy (c)): extension libraries add
namespaced tokens as ordinary `Token` values; the v1 subset
deliberately excludes the `space/radius/type/motion` families (small +
honest — future subsets add tokens, never widen a closed enum).

## Theme values

- `Token { name, value }` — one named token (dotted path + resolved
  CSS value).
- `Theme { name, tokens }` — a named theme: a token collection over
  the core baseline.
- Constructors are kernel-owned **ordinary functions**
  (`token(...)`, `theme(...)`). A free function may share a class
  name (G5's collision is enum-member-specific — probed on in-tree radix
  0.80.0), so no prefix workaround is applied.
- **Two materially different themes = two `Theme` values over the same
  component tree** — the two-theme composition contract (U3's proof seam:
  same tree, different token layers, no component changes, HTML
  byte-identity asserted).

## `theme_css` fail-closed semantics

`theme_css(Theme) → string ∪ null` — the public theme renderer verb:

- **Missing required core token** → `null` (no output): the theme's
  collection is checked against the 8-token baseline before emission.
- **Invalid token name** (fails the U2 attribute-name lexical predicate —
  `valida.valid_attribute_name`: letters/digits/`-`/`_`/`.`; rejects
  whitespace, `=`, quotes, `< > /`, control characters) → `null`.
- **Deterministic bytes** over author order (fixed iteration; no
  sorting, no RNG).

Fail-closed means: a theme that does not cover the baseline or carries an
invalid token name produces **no application artifact** — never a partial
or best-effort emission.

## Extension token surface

Extension libraries declare tokens under a **namespaced path**
(`chart.axis.muted`), consumed through token references (campaign §4/§5;
policy (c) open custom-property names). The surface is extension-local
token classes + zero-arg accessors, **collected app-side** — the
compose-without pattern, G4-independent (no provider-module export that
would trip `WARN014`). Extension tokens join the emitted `:root` layer as
ordinary `Declaration` values once the theme's required baseline is met.

## Cascade layer order

The **emission order is the cascade order** (the assembly's output order
is the cascade's precedence). The delivery's layer list (U4 done_when;
policy (c) growth):

```text
reset (opt-in only) → tokens → components → library packages → application
```

- Reset styles are **opt-in only** (no reset by default).
- `@layer` at-rules are **deferred** (policy (c) growth — the staged
  `Style`/`Rule`/`Declaration` model gains layer values as it grows;
  v1 emits the layers in declaration order, not `@layer` syntax).

**Reconciliation mark (U2/U3):** the authoritative cascade/assembly
record is U2's (in flight on hand-7); this record uses the delivery's
layer list above. When U2's record and U3's emission land, this record
must be reconciled against them (layer names, emission order) — the
reviewer cross-checks docs vs emission at the Stage 2 closeout. Any
deviation is reconciled within U4 scope or routed.

## Assembly contract (policy (e))

Product assembly (`assemble(...) → Style`, English verb — U2's
implementation) is a **pure function over explicit inputs**: the
package-order map (`list<`(package identity, dependencies)`>`), the
collected style bundles with stable identities, the selected theme, and
an optional reset bundle. Rules:

- **Dedup by stable identity** — repeated component instances do not
  repeat stylesheet text.
- **Topological order** — a package's dependencies precede it in the
  emitted cascade; where the graph does not impose an order, **stable
  package identity** is the deterministic tie-break.
- **Fail-closed reject set** — dependency cycles reject; duplicate
  stable identities with different content reject; invalid output
  rejects (policy (e): ambiguity that would change output fails closed).

## Determinism posture

The rendered output is **byte-deterministic** over the same inputs:
fixed iteration, no RNG, no hidden state (the assembly + `theme_css`
both hold). The deterministic double-build evidence (byte-identical
captures + sha256) is U5's harness work (`check-determinism`), not this
record's.

## `fix:<defect-id>` discipline

Radix-lane workarounds are recorded **at the site** with a
`fix:<defect-id>` marker; removal is a **grep-replace after each radix
fix lands**. Markers applied through U1:

- `fix:g5` — **none applied** in the theme surface: the theme verbs
  (`theme`, `token`, `theme_css`) were probed collision-free on
  in-tree radix 0.80.0 (G5's collision is enum-member-specific; a free
  fn may share a class name). The G5 rule still holds: a colliding verb
  is escalated, never silently renamed.
- `fix:codegen001` — Rust emit-across-imports remains blocked
  (provider-module locale propagation; `tela.fab` emit →
  CODEGEN001 `PARSE001`). The Rust lane is attempted + recorded; the
  import-free `valida.fab` is the proven Rust lane.

## TS-lane runtime posture

The **TS lane is the proven runtime lane**: TS emit + assemble +
`tsc --noEmit` is the compile surface (green for the theme surface), and
the Stage 1 assembled-runner mechanics (U5/U6) execute the assembled
output under `node` — the gate-owned runtime step is U5's
`check-exempla` extension. The **Rust lane is blocked** by CODEGEN001
(Rust emit-across-imports); when the fix lands, the Rust-lane capture
must equal the TS-lane capture (sha equality, stage-1-determinism.md §6)
and the Rust primary path activates without a harness change.
