# Stage 0 — Behavior Design Decision Record

**Status**: active (decision record for Stage 0 U5)
**Unit**: `tela-s0-u5-behavior-design`
**Hand**: hand-3, 2026-08-09
**Delivery spec**: `stage-0-delivery.md` U5
**Campaign**: `CAMPAIGN.md` Stage 0 gate bullet 4 ("the behavior design
describes an interactive segmented control without compiler-specific UI
meaning and records the existing TypeScript async `@ futura` inside
`fac`/`cape` gap as an explicit Stage 3 input"); §6 (Behavior And State
Branches, simple-update posture); §7 (Renderer Contracts); §8 (Accessibility
Contract); Open Q4.
**Spike evidence**: `tela/spike/stage-0-branch-a-b-evidence.md` (U3, Branch B).

This record **decides** behavior posture for Stage 1 and Stage 3. It makes no
implementation claim: no segmented-control code (Stage 3), no async-gap fix
(routed as compiler delivery), no `faber-web` host edits.

---

## 1. Segmented control — interaction description (campaign gate bullet 4)

The segmented control is described purely as an **interactive widget contract**
— observable behavior in a browser context — with **no compiler-specific UI
meaning** attached. Nothing here implies a Tela or Radix code construct;
Stage 3 maps this contract onto the decided view shape (§2) and update
strategy (§3).

### 1.1 Widget shape

A segmented control presents a horizontal group of mutually exclusive options;
exactly one option is selected at a time. It functions like a single-select
radio group rendered as a connected button bar.

### 1.2 Pointer interaction

- **Point** does nothing.
- **Click / primary activate** on an unselected segment selects it: the
  previously selected segment becomes unselected, the clicked segment becomes
  selected, and the control announces the change to assistive technology.
- **Click on the already-selected segment** is a no-op — selection does not
  change and nothing is re-announced.
- Pointer hover may show affordance styling but must never change selection or
  focus.

### 1.3 Keyboard interaction

- The control behaves as a **tab stop as a whole**, not one tab stop per
  segment. The selected segment holds the initial focus; if no segment is
  selected, the first segment holds it.
- **Arrow keys** (`Left` / `Up` move to the previous segment, `Right` / `Down`
  move to the next; wrapping at the ends is supported) move **focus only** —
  they do not change selection.
- **`Space` / `Enter`** on the focused segment selects it (same selection
  semantics as the pointer click in §1.2) and triggers the change announcement.
- **`Home` / `End`** move focus to the first / last segment.
- **`Tab`** moves focus out of the control as a single unit; focus leaves the
  group without traversing its individual segments.

### 1.4 Selected state

- The selected segment exposes `aria-selected="true"`; all other segments
  expose `aria-selected="false"`.
- The group itself carries a labeled role expressing single selection (the
  segmented-control reference component owns the concrete role mapping, e.g.
  `radiogroup` + `radio`, per the accessibility contract in campaign §8).
- Selection state is semantic, not styling-only: a segment that is merely
  visually highlighted but not selected never reports `aria-selected="true"`.

### 1.5 Declared live region

- Selection changes are announced through a **declared live region** — a
  region explicitly marked with a live-region policy (e.g. `aria-live` /
  `role="status"` semantics) owned by the control, not ambient page
  notifications.
- The announcement names the newly selected option (e.g. "N units selected"
  for a page-size control) and is issued **only** when selection actually
  changes — silent when a click or keypress lands on the already-selected
  segment.
- Update cycles that do not change selection remain silent per the live-region
  policy (campaign §8: "including when an update should remain silent").

---

## 2. Branch decision carried from U3 (Branch B)

`tela/spike/stage-0-branch-a-b-evidence.md` (hand-7, commit `79fe2fb`)
selects **Branch B**:

> **Branch decision (evidence-driven recommendation): select Branch B.**

Branch A (generic-recursive `Visus<Message>` + `Vinculum<Message>` message-
producing closures) declares and typechecks but **cannot be constructed** in
current ordinary Faber — a genuine shared-language defect (U3 evidence §4, D1)
blocks every construction spelling across both the TS and Rust lanes. Per the
campaign §6 fallback, the pure non-generic `View` tree is kept and behavior
sits in an **adjacent typed plan**.

Branch B shape carried forward:

- pure, closure-free, non-generic recursive tagged union `Visus` (open element
  model, typed `Identitas`, `Proprietas` separate from serialized `Attributa`);
- an adjacent typed behavior plan `Vinculum { identitas, eventus,
  (Eventum) → AppNuntius }` keyed to stable node identities;
- behavior carried by typed message-producing closures — not erased into
  strings.

Consequence for this record: the segmented-control contract (§1) and the
update strategy (§3) are specified against **typed messages keyed to stable
node identities**, never against closures embedded in the view tree. The
compiler-level defect (U3 D1) is filed separately; Branch A should be
re-spiked when the delivery lands, but Stage 1 freezes the Branch B shape.

---

## 3. Update strategy (review item 5; campaign §6)

### 3.1 The strategy: rerender/replace an explicit mounted region

The first update strategy is **deliberately simple** (campaign §6):

- After a message is processed, the new `View` is produced and the update
  **rerenders/replaces an explicitly mounted region** with it.
- A *mounted region* is an explicit, named boundary created by `mount(Scope,
  Program, Theme) → Mounted` (campaign §7 renderer contract). Replacement
  operates on that region, not on the document at large, and never performs
  descendant lookup through ambient global document shortcuts.
- The contract surface is the campaign §7 operation: `replace(MountedRegion,
  next View) → update result`.
- No keyed reconciliation engine, fine-grained signals, hooks, or concurrent
  rendering — those are deferred until measured application pressure earns
  them (campaign §6).

### 3.2 Declarative host effects

Region replacement must not **silently destroy interaction state**. The update
**result** carries declarative host effects, executed by the host after
replacement:

- **Focus restoration** — if focus was inside the replaced region, focus is
  restored to the node that held it before replacement (by stable identity),
  so a control does not lose keyboard interaction after its own update.
- **Focus movement** — the update may explicitly declare where focus should
  land (e.g. the newly selected segment in §1), supporting keyboard flows
  across updates.
- **Scroll anchoring** — the update declares scroll-preservation intent so
  replacing a region mid-scroll does not jump the viewport.

The effects are **declarative on the update result**, not imperative
post-update host calls in user code — this keeps the component boundary pure
(campaign §6 Branch A strength preserved inside the Branch B plan: testable
state, renderer separation).

### 3.3 Static/hydration interaction

Static rendering ignores behavior but must emit stable identity and semantic
state required for later mounting (campaign §7): the Branch B `Identitas`
field, serialized in one documented hydration-ready form, is what the
`Vinculum` plan keys to. Hydration attaches to matching Tela-rendered markup;
mismatch must diagnose or replace by declared policy rather than silently
binding the wrong tree (campaign §7).

---

## 4. TypeScript async gap — quoted and routed to Stage 3 (review item 7)

The known TypeScript backend limitation recorded by `faber-web` is
acknowledged verbatim (`faber-web/README.md`, "Known gap" note):

> Known gap: the Radix TS backend does not await `@ futura` calls inside
> `fac`/`cape` blocks, so `dom.fetch_text` is exercised at the runtime-bridge
> level in the WEB5 fixture until the async codegen gap closes.

Campaign §6 routing language:

> The initial synchronous behavior proof may proceed, but fetch-driven or
> async update claims remain blocked until the gap is fixed or a separate
> compiler delivery is routed.

**Decision recorded here:**

- The gap is an **explicit Stage 3 input** (Stage 3 — Browser Mount And Update
  Lifecycle). Stage 3 must treat `@ futura` calls inside `fac`/`cape` blocks
  as **not awaited** until the compiler gap closes or a separate radix compiler
  delivery (a minimized proof) lands.
- **No async-gap fix in this record** — it is routed as compiler delivery
  (radix), not Tela work.
- **Consequence for the update strategy (§3):** the Stage 1–2 synchronous
  rerender/replace posture is not blocked; fetch-driven or async update claims
  (async event sources, `fetch_text`-backed controllers) remain **blocked**
  until the gap resolves.
- This unit's delivery spec records the same routing as a residual:
  "TS async `@ futura`/`fac`/`cape` codegen gap → Stage 3 input (U5 records
  it; radix compiler delivery when a minimized proof exists)."

---

## 5. Mount relationship decision (campaign Open Q4)

**Decision: default — Tela consumes `web:dom` / `WebController` through
documented host seams.**

- `faber-web` provides the browser host meaning: provider `web`, `web:web`
  exporting `WebController { selector: textus }`, and `web:dom` exporting
  scoped DOM types/helpers (query/require/all, text/attribute/class mutation,
  event subscription, input/submit, frame/resize/keyboard/pointer/focus
  subscriptions, prevent-default, controlled text fetch) — DOM operations flow
  through an explicit `Scope`, no global document shortcuts for descendant
  lookup (`faber-web/README.md`).
- Tela mounts **into** that host: a Tela mount consumes the `web:dom` scope /
  `WebController` surface through **documented host seams** — the seam is
  named here, and Stage 3 pins the exact seam call shape.
- **Deferred:** a **general renderer-host interface** (one abstraction owned
  below component semantics, so any renderer can drive any host) is **not
  created now**. It is deferred until a **second consumer asks** — i.e. until
  a concrete non-`faber-web` host or non-browser consumer exists. This honors
  the governing invariant "second caller before abstraction": the 
  `faber-web` host is the first and only consumer today, so Tela consumes it
  directly through seams rather than inventing a premature interface.
- `faber-web` is not a Radix `Target::Web`; this decision does not change the
  architecture law that browser apps use HIR → TypeScript emit plus `faber`
  packaging.

---

## 6. What this record does NOT decide or do

- **No segmented-control implementation** — the contract in §1 is a Stage 3
  input, not Stage 0/1 code.
- **No async-gap fix** — §4 routes it as a radix compiler delivery with a
  minimized proof.
- **No `faber-web` host edits** — §5 consumes the existing seams only.
- **No renderer-host interface** — deferred until a second consumer asks
  (§5).
- **No live-region engine, focus manager, or effect runtime** — §1.5 and §3.2
  are contracts for Stage 3 to implement against the Branch B view shape.

Nothing here is carried open into Stage 1 (campaign gate last bullet): the
behavior posture, update strategy, async-gap routing, and mount relationship
are all decided.
