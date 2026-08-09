# Stage 3 U3 — Segmented-Control Interaction Record (the campaign gate)

**Status**: active (evidence for `tela-s3-u3-segmented-interactive`)
**Unit spec**: `tela/docs/factory/mvp/stage-3-delivery.md` U3 (wave 3;
depends on U1 `4ca331a` + U2 `9f23095`)
**Campaign gate** (verbatim, `CAMPAIGN.md` Stage 3): *"a segmented control
mounts, handles keyboard and pointer input, updates selected state, ARIA
state, and any declared live region; disposes subscriptions; and executes
explicit focus-restoration and scroll-anchor effects across region
replacement."*
**Baseline**: U1 behavior carriers (`Eventum`/`Effectus{Restitue,Dirige,
Ancora}`/`Renovatio` + `effectus_identitas`, `fix:sem001`), U2 browser mount
(`src/browser.fab` + `scripta/dom-shim.ts` + `exempla/browser.fab`), the
Stage 1/2 two-package benchmark (extension-lib + canary-app under
`proof/benchmark/libhome`).

This record documents the campaign-gate proof: the segmented control as
**shared-source evidence** — the same component function renders statically
through `html_visus` and mounts interactively through the `tela:browser`
surface + `web:dom` host seams, synchronously.

---

## 1. What U3 delivers

| Deliverable | Location | Content |
| --- | --- | --- |
| The segmented-control component | `proof/benchmark/canary-app/src/main.fab` | `Props_controlli` (typed props) → `segmentatum(props) → tela.Visus`: group + per-segment `data-tela` identities, `role='radiogroup'` / `role='radio'` + `aria-selected`, the roving `tabindex` (one tab stop), the control-owned declared live region |
| The app-typed behavior plan | same module | `union Nuntius { Electum, Motus }`, `class Vinculum` (eventus + message-producing closures keyed to the `data-tela` identities), `update_controlli`, `nuntius_clavis`, `annuntium` — app-side, never kernel-generic (D1 recorded) |
| The subscription wiring plan | same module | one `Vinculum` per segment identity (`eventus = "click"`, the closure maps the event → `Electum{nomen}`); the keyboard mapping (`nuntius_clavis`); the loop `update(message) → next Visus → replace` on the mounted region |
| The interactive runner | same module (`main`) + the dom-shim driver | `main` proves the plan + static half at the pure level; the assembled driver executes the scripted DOM-level sequence against the dom-shim |
| The evidence record | `docs/factory/mvp/stage-3-segmented-control.md` | This file |

## 2. The control shape

The component is an ordinary Faber function over typed props (no
compiler-known component kind — campaign §3):

```fab
class Props_controlli {
    list<string> optiones     # ["One", "Two", "Three"]
    string electum            # the selected segment identity ("tela-seg-N")
    string nomen              # the control's accessible name
}
fn segmentatum(Props_controlli props) → tela.Visus
```

- **Stable identities**: the group carries `data-tela='tela-control'`; the
  segments `data-tela='tela-seg-1'`…`tela-seg-N` (index-derived, stable per
  option count); the live region `data-tela='tela-live'` (§1.1; policy (d)
  seam — the values the plan keys to, identity-hydration.md §7).
- **Selected state (§1.4)**: the group carries `role='radiogroup'` + an
  `aria-label`; each segment carries `role='radio'` + `aria-selected`
  `true`/`false`.
- **Keyboard-contract structure (§1.3)**: the selected segment carries
  `tabindex='0'`, the others `tabindex='-1'` — the control is **one tab
  stop as a whole** (only the selected segment is in the tab sequence; Tab
  leaves the control as a unit). Arrows/Home/End move focus only (the
  driver rotates the roving tabindex); Space/Enter select.
- **Declared live region (§1.5)**: a control-owned
  `<div role='status' aria-live='polite' data-tela='tela-live'>` — not an
  ambient page notification.

The exact serialized static bytes (the shared-source static half; asserted
in `main` — serializer emission order is attributa in author order, then
`data-tela`):

```html
<div role='radiogroup' aria-label='segmented control' data-tela='tela-control'><button role='radio' aria-selected='true' tabindex='0' data-tela='tela-seg-1'>One</button><button role='radio' aria-selected='false' tabindex='-1' data-tela='tela-seg-2'>Two</button><button role='radio' aria-selected='false' tabindex='-1' data-tela='tela-seg-3'>Three</button><div role='status' aria-live='polite' data-tela='tela-live'></div></div>
```

The control's styles are **app-owned**, keyed on its `data-tela` identity:
`[data-tela='tela-control'] { display: flex; gap: 0.25rem; border-radius: 0.375rem; }` — the extension already proved the token/bundle seam.

## 3. The app-typed behavior plan (D1 boundary, recorded)

- **`union Nuntius`** — the concrete app message type (app-local, never
  kernel-generic — radix D1 blocks generic user-type construction;
  recorded): `Electum { identitas }` (select — pointer click, Space, Enter)
  and `Motus { identitas }` (focus movement only — arrows, Home, End).
- **`class Vinculum { identitas, eventus, (tela.Eventum) → Nuntius nuntius }`**
  — the Branch B plan carrier (spike shape, app-side): one binding per
  segment identity carrying a **typed message-producing closure**
  (`nuntius = (tela.Eventum eventus) → Nuntius ∴ electum(eventus.nomen)`),
  never erased into strings. The app invokes the closures directly in
  `main`'s pure proof.
- **`update_controlli(string electum, Nuntius) → string`** — an ordinary
  app function over the concrete message type: `Electum` returns the target
  identity; `Motus` returns the current one unchanged (focus-only,
  live-region-silent).
- **`nuntius_clavis(string identitas_focus, string clavis) → Nuntius`** —
  the keyboard semantics (§1.3), app-owned: ArrowRight/Down →
  `Motus{next}` (wrap supported), ArrowLeft/Up → `Motus{prev}`, Home →
  `Motus{first}`, End → `Motus{last}`, Space/Enter → `Electum{focus}`,
  anything else → a focus no-op. Tab is unhandled (the single tab stop
  leaves as a unit).
- **`annuntium(props, electum) → string`** — the live-region announcement
  naming the newly selected option ("One selected", …), issued **only**
  when the selection changes (§1.5; campaign §8).

The kernel owns only the non-generic carriers (`Eventum`/`Effectus`/
`Renovatio`); the concrete plan is the application's surface — the
`data-tela` seam is the attach point (identity-hydration.md §7).

## 4. Exercised host seams

| Seam | Posture | What the proof exercises |
| --- | --- | --- |
| `tela:browser` mount/replace/dispose | **Harness-assembly path** — U2's `mount`/`replace` carry imported sibling types in their public signatures and are WARN014 export-skipped for consumers (`fix:g4`); the assembled driver calls the emitted functions directly (the snapshot does not apply at runtime). **No duplicated `web:dom` contract.** | `browser.mount(browser.scopus("#root", ""), segmentatum(props), thema)` → `Mounted`; `browser.focus_tenet` / `browser.focus_optata` (the modeled before/after focus state); `browser.replace(m, nextVisus)` → `Renovatio`; `browser.dispose(m)` |
| `web:dom` event subscription | **Harness-level binding** — the `webDom*` surface binds at the dom-shim level (fix:web-dom-locale; the en→la `web:dom` import is blocked on in-tree radix 0.80.0). Subscriptions attach **by identity** (`data-tela` nodes) — never ambient document shortcuts (behavior-design §5). | `webDomOn(node, "click", …)` per `Vinculum` binding; `webDomOnKeyboard(node, "keydown", …)` per segment; `webDomUnsubscribe` on dispose |
| The app-typed plan | The plan maps events → messages; the loop applies `update(message)` → next `Visus` → `replace` on the mounted region. | The driver dispatches events → the binding's closure produces the message → `update_controlli` → `segmentatum(props_electi(props, model))` → `replace` → the harness executes the replacement + the declarative effects |
| The declarative effects (behavior-design §3.2) | `Renovatio.effectus` keyed by stable identity; the kernel's `effectus_identitas` accessor reads the key (`fix:sem001` — the kernel owns the only imported-union matcher). | `Restitue` (focus restoration), `Dirige` (focus movement), `Ancora` (scroll-anchor intent) derived by `replace` from the modeled state and executed after replacement |

## 5. The scripted interaction sequence + assertions (node exit 0)

The interaction gate runs the assembled composition (dom-shim + kernel +
browser module + extension + app + driver) under `node`; **every assertion
executes, fail-closed** (a wrong expectation or a real defect throws, node
exits non-zero). Scripted sequence (deterministic, not a racy timing test):

| # | Step | Assertions (all green) |
| --- | --- | --- |
| 1 | Pointer click on the unselected seg-2 | model → `tela-seg-2`; seg-2 `aria-selected` flips `true`; seg-1 flips `false`; the announcement fires **once**; the live region reads "Two selected" |
| 2 | Click on the already-selected seg-2 | **silent no-op**: model unchanged; no announcement (live region unchanged) — §1.2/§1.5 |
| 3 | Arrow keys | `ArrowRight` from seg-2 → focus moves to seg-3; selection unchanged; silent. `ArrowLeft` from seg-1 **wraps** to the last segment (§1.3) |
| 4 | Space on the focused seg-3 | model → `tela-seg-3`; seg-3 `aria-selected` `true`, seg-2 `false`; announcement fires once; live region "Three selected" |
| 5 | Home / End | focus moves to first / last; selection unchanged (§1.3) |
| 6 | Enter on the focused seg-1 | model → `tela-seg-1`; announcement once; live region "One selected" |
| 7 | Replace across the region (the gate bullet) | `focus_tenet(m, "tela-seg-2")` → `replace` derives `[Restitue{seg-2}, Ancora{#root}]`; after replacement focus is restored to seg-2 **by identity**; the scroll-anchor intent is declared for the mounted region (`#root`) — asserted at the shim level |
| 7b | Declared focus movement (Dirige) | `focus_optata(…, "tela-seg-3")` → `replace` derives `[Restitue{seg-2}, Dirige{seg-3}, Ancora{#root}]`; focus lands on the declared target after replacement |
| 8 | Dispose | subscriptions are live before dispose; `dispose` + unsubscribe + region clear → a **post-dispose dispatch does nothing** (no listener fires); the region is cleared — the gate's "disposes subscriptions" |

Runner tail line: `segmented control interaction gate green (scripted
sequence; tela-s3-u3)` — **node exit 0**.

## 6. The synchronous-only boundary

The proof is **fully synchronous**: no `@ futura`, no `dom.fetch_text`, no
async event sources, no fetch-driven/async update claim. The routed
async-gap input (`stage-0-behavior-design.md` §4; the faber-web "Known
gap") is satisfied by **recording the routing and not claiming**: fetch-
driven or async update claims remain **blocked** until the TS async codegen
gap is fixed or a separate radix compiler delivery lands. The interaction
sequence is a scripted deterministic assertion sequence under `node`.

## 7. Validation (one run, narrow)

```text
R=radix/target/debug/radix
export FABER_LIBRARY_HOME=tela/proof/benchmark/libhome
$R check --locale en proof/benchmark/extension-lib/src/extension.fab   # ok (pre-existing WARN003 unused fns)
$R check --locale en proof/benchmark/canary-app/src/main.fab           # ok (the recorded WARN014 G4 seam ext.bar_metrum)
```

- **TS lane**: emit valida/tela/browser/extension/main; assemble ONE
  self-contained file (strip + namespace const bindings) with the dom-shim
  (export keywords removed) + the U3 driver appended; `tsc --noEmit
  --strict` — **clean**.
- **Interaction gate**: `node` on the assembled file — the scripted
  sequence executes; **exit 0** (the assertions in §5 all pass).
- **Static render double-build**: the runner output (composition HTML +
  both theme cascades + the control's static render + the gate line) builds
  twice **byte-identical** — sha256
  `d23a62bbb07bea7480093b1d89759c21f9c06cbc108c4053de7368554583c74c`
  (informational here; U4's `check-determinism` owns the official record).
- **Cargo discipline**: no cargo run; the in-tree radix binary only.

Note: the CSS bytes carry a literal `\n` between rules — the pre-existing
TS-emitter backslash double-escape observation (`fix:ts-emitter`);
deterministic and recorded, not fought.

## 8. Doc-vs-emission conformance notes (for the Stage 3 closeout)

The U3 emission (and the U2 emission it consumes) vs the U5 spec-locked
surface (`docs/design/browser-lifecycle.md`) — recorded here so the Stage 3
closeout conformance pass owns the reconciliation:

1. **`dispose(Mounted) → void`** — the U2 emission returns `void`, not the
   spec-locked `vacuum` (browser-lifecycle.md documented `vacuum`). The
   emission is the authority.
2. **`mount(Scope, …)` — the scope carrier**: the en→la `web:dom` import is
   blocked (`fix:web-dom-locale`), so U2's `Scope` is tela:browser's own
   opaque carrier (with `textus_praesens` as the state model), not
   `dom.Scope`. The pinned seam call shape is preserved with the
   browser-local handle standing in; the DOM surface binds at the harness
   level (dom-shim). browser-lifecycle.md's `mount(dom.Scope, …)` is the
   spec-locked shape, not the emission.
3. **`Mounted` field spellings** — the landed fields are the Faber-Latin
   set `scopus`/`radix`/`visus`/`thema`/`textus_markup`/`textus_css`/
   `identitates`/`diagnosia`/`ligamina`/`subscriptiones`/
   `identitas_focus`/`identitas_focus_optata` (browser-lifecycle.md
   documented the spec-level description).
4. **New `fix:<id>` markers not in the U5 inventory**: `fix:sem001`
   (U1 — the kernel owns the only Effectus matcher,
   `effectus_identitas`) and `fix:prim-nullable` (U2 — primitive-nullable
   annotations/unwraps do not parse in fn bodies). The U5 §11 inventory
   should gain both at the closeout.
5. **Determinism evidence superseded**: the Stage 2 sha
   `3d22b9c7…8340a` is historical; the Stage 3 composition (control in the
   arbor + the control cascade rule) changes the runner output. U4
   re-records the determinism evidence.

## 9. U4 hooks

- **`check-mount`** (new harness, U4): assemble the interactive composition
  (kernel + browser module + dom-shim + extension + app) and run the
  scripted interaction sequence under `node`, fail-closed — the driver
  pattern in §5 (this unit's scratch assembly is the reference mechanics:
  strip + namespace const bindings + dom-shim + appended driver).
- **`check-determinism`** (extend, U4): double-build the composition static
  render — the runner output now includes the segmented control's static
  HTML + the `[data-tela='tela-control']` cascade rule; the new sha
  supersedes `3d22b9c7…8340a`.
- **`check-exempla`**: the `behavior` + `browser` wiring cases are still
  U4's; the `*)` default remains RED until then (this unit validated via
  local assembly).

## Non-goals

- No reference catalog (Stage 5). No kernel-generic `Vinculum`/`Program`
  (D1 — the plan is app-typed, recorded). No fetch/async behavior (the
  routed gap). No real-browser driver (the node dom-shim is the proof
  vehicle; layout/scroll/pointer fidelity beyond the state-level surface is
  deferred). No third theme. No `faber-web` edits. No `CAMPAIGN.md` edits
  (closeout-owned). No radix-lane fixes. No writes to `tela/spike/`.
