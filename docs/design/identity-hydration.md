# Tela Identity Hydration — Design Record

**Status**: active (Stage 1 U4 docs unit — `tela-s1-u4-docs`; documents the
Stage 1 gate bullet "explicit stable identity serialized in a documented
hydration-ready form")
**Sources**: `docs/factory/mvp/stage-0-protocol-policies.md` policy (d);
`docs/factory/mvp/stage-0-behavior-design.md` §3.3/§4;
`docs/factory/mvp/stage-1-delivery.md` (Normalized Spec; U3/U4);
`docs/factory/mvp/CAMPAIGN.md` §2/§7; `spike/visus-b.fab` (accepted spike
baseline).

This record documents the one hydration-ready identity form that Stage 1
serializes and Stage 3 binds to. It makes no implementation claim beyond what
the landed kernel (`src/tela.fab`, U1 + U3) defines. The serializer has
landed (U3, commit `05909f7`); this record is reconciled to that emission
(§2, §5, §10).

---

## 1. The one form

**`Identity` serializes as the `data-tela` attribute — the only identity
serialization form in v1 (policy (d)2).**

```html
<div data-tela='contator-app'>…</div>
```

The `data-tela` attribute is a documented host seam Tela owns. It is emitted
by the static renderer, read by the browser mount (Stage 3) to attach
bindings, and matched on hydration.

## 2. Quote style

The serializer's quote style is **single quotes** for attribute values —
the spike baseline (`spike/visus-b.fab`, `seri_*` helpers emit
`name='value'`; policy (d)'s locked example uses the same single-quoted
spelling). The identity attribute therefore serializes as
`data-tela='<escaped value>'`.

Policy (d)2's prose spells the form `data-tela="<escaped value>"` with double
quotes; that is the generic markdown spelling of "an attribute value". The
canonical emitted form is single-quoted per the spike baseline and the Stage 1
delivery spec (U3 done_when (b): "`Attributa` serialize as `name='value'`
(quote style per the spike baseline — single quotes — and documented)").

Reconciliation (U3 landed, commit `05909f7`): the serializer emits
attribute values with single quotes exactly as documented here —
`serialize_attributes` emits `name='value'` and `serialize_identity` emits
`data-tela='<escaped value>'`. **No quote-style deviation.**

## 3. Which elements carry it

Only elements whose `Identity` is **non-null** serialize identity.

- The `ElementNode` variant carries `Identity ∪ null identity` — identity is
  an optional explicit field on the element.
- Elements without identity carry `null` and emit **no** `data-tela`
  attribute.
- `TextNode` and `Fragment` have no identity field and never emit identity.

The serializer emits `data-tela='<escaped value>'` on exactly those elements
whose `Identity` is non-null (policy (d)2).

## 4. Identity is a typed field, never position-derived

`Identity { value }` is an explicit typed field on the element. Identity is
**never** inferred from array position — no "the third child is this element"
implicit identity. This is locked by policy (d)1 and the kernel shape
(`src/tela.fab`, U1): the field exists on the element, and elements without an
explicit value simply carry `null`.

## 5. Escaping rules for the value

The identity `value` is an attribute value and flows through the **same
central attribute-escape path** as every other attribute value (policy (d)3;
U3 done_when (a)). There is no separate, weaker escape for identity.

The escape set (locked by U3 done_when (a)):

| Context | Escaped characters |
| --- | --- |
| Text | `&`, `<`, `>` |
| Attribute values (incl. the `data-tela` value) | `&`, `<`, `>`, plus `"` and `'` |

The landed emission (`escape`, commit `05909f7`) maps each character through
one single-pass scan; the concrete spellings are:

| Character | Text | Attribute value (incl. `data-tela` value) |
| --- | --- | --- |
| `&` | `&amp;` | `&amp;` |
| `<` | `&lt;` | `&lt;` |
| `>` | `&gt;` | `&gt;` |
| `"` | — | `&quot;` |
| `'` | — | `&#39;` |

Because each input character is consumed exactly once (single-character scan,
sequential branches), no emitted entity is re-scanned — an already-escaped
sequence is never double-escaped.

Because the quote style is single quotes, a single quote inside the value is
escaped — a value cannot break out of its attribute.

## 6. Uniqueness / duplicates — deferred to Stage 3

Duplicate values and uniqueness expectations are **not** Stage 1 concerns.
Stage 1 emits identity faithfully; it does not diagnose or reject duplicate
`Identity.value` values.

Stage 3 hydration matching owns the behavior (campaign §7):

> Hydration means attaching to matching Tela-rendered markup; mismatch must
> diagnose or replace by declared policy rather than silently binding the
> wrong tree.

A duplicate value is a hydration-match ambiguity and is therefore a Stage 3
diagnosis/replacement decision — never a Stage 1 or Stage 3 silent bind of
the wrong tree.

## 7. Stage 3 binding contract

Stage 3's typed behavior plan keys to these values:

- `EventBinding.identity` keys to `Identity.value` values (policy (d)3;
  `stage-0-behavior-design.md` §2).
- The browser mount reads `data-tela` on the rendered markup to attach
  bindings and to match on hydration.
- The `data-tela` attribute is the documented host seam this stage binds to;
  nothing else in v1 serializes identity.

This record is the Stage 3 input for the seam: Stage 3 binds
`EventBinding.identity` to the `data-tela` values emitted here.

## 8. Stage 1 is synchronous; the TS async gap is a Stage 3 input

Stage 1's static renderer is **synchronous** and makes **no async or fetch
claim**. The TS async gap — the Radix TS backend does not await `@ futura`
calls inside `fac`/`cape` blocks — is recorded verbatim in
`stage-0-behavior-design.md` §4 and is an explicit **Stage 3 input**:

- Stage 3 must treat `@ futura` calls inside `fac`/`cape` blocks as **not
  awaited** until the compiler gap closes or a separate radix compiler
  delivery lands.
- The Stage 1–2 synchronous rerender/replace posture is not blocked;
  fetch-driven or async update claims remain blocked until the gap resolves.

Nothing in this record implies asynchronous identity matching in Stage 1.

## 9. Property static posture

`Property` (DOM properties — value, checked, selection) are typed view-tree
fields carried for the browser lane (Stage 3) and are **not** serialized into
static HTML in Stage 1. The spike's provisional `data-prop:` marker is
**superseded**. Static output carries `Attributa` + `Identity` + text +
structure only — DOM properties are not HTML attributes, and static HTML stays
honest. This posture is recorded in the kernel header and here; Stage 3
defines any static/hydration presence for properties.

## 10. Reconciliation state (DONE — U3 landed, commit `05909f7`)

The serializer reconciliation item (U4 done_when (c)) is **DONE**. The U3
emission (`05909f7`) was verified against this record:

- **Quote style**: single quotes — confirmed, no deviation (§2).
  `serialize_attributes` emits `name='value'`; `serialize_identity` emits
  `data-tela='<escaped value>'`.
- **Escape set**: text `& < >`; attribute values additionally `" '` —
  confirmed, no deviation (§5). Landed spellings `&amp;` / `&lt;` / `&gt;` /
  `&quot;` / `&#39;`.
- **data-tela through the same attribute-escape path**: confirmed —
  `serialize_identity` calls `escape(identity?.value coalesce "", true)`
  (policy (d)).
- **Serializer verb**: the HTML renderer verb is **`html_visus`**, not
  `html` — the exact `html` verb collides with the `Space.html`
  enum-member top-level binding (G5, `SEM005.duplicate_definition`;
  recorded + escalated by U3). The `html_` prefix keeps the locked English
  stem (policy (b)); `css` is verbatim (verified not reserved). See
  `AGENTS.md` vocabulary.
- **Fail-closed mechanism**: `html_visus(View) → string ∪ null` — null when
  the `validate_tree` pre-pass rejects; invalid input never emits markup.

No deviations required a doc change beyond this reconciliation; the U4
record's Stage 1 closeout residual for this item is closed.

---

## Non-goals

- No API reference beyond the locked surfaces (kernel types + constructors,
  `valida` predicates, serializer verbs).
- No docs for Stage 2+ surfaces (style/theme protocol, product assembly,
  browser lifecycle).
- No `CAMPAIGN.md` edits.
- No code changes.
