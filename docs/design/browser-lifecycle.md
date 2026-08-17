# Browser Lifecycle — design record (tela Stage 3 U5 + Stage 4 U6)

**Record**: `tela-s3-u5-docs` + `tela-s4-u6-seam-restoration` — the browser
mount/update/dispose lifecycle + the Branch B behavior plan written down for
later Hands, reviewers, and the Stage 4 independent-extension gate.
**Status**: active (Stage 4 U6 seam restoration and the WSI U4
`tela:dom` flip are reconciled; the current seam is `dom.Scope` with
snapshot-based hydration — see §12).
**Sources**: the landed Stage 3 U1 kernel emission (`src/tela.fab`,
`4ca331a`), the landed browser seam (`src/browser.fab`, `1423666`), the
Tela-owned DOM conversion (`src/dom.fab`, `a2c8a2c`), the Stage 3 delivery
spec (Normalized Spec; Async-gap Routing; Coordination Constraints;
Escalation Path), `stage-0-behavior-design.md` §1/§3/§4/§5,
`docs/design/identity-hydration.md` §6/§7, `stage-0-protocol-policies.md`
policies (b)/(d), `CAMPAIGN.md` §6/§7, and the Stage 1/2 records
(`stage-2-determinism.md` R2 note; closeouts).

This record documents the Stage 3 lifecycle surface **as the delivery locks
it** and **as the U1/U2 emissions landed them** (the landed emission is the
authority; the spec-locked sketch governs only where no emission exists yet —
see §12 for the deviation ledger).

---

## 1. Pinned seam call shape

The browser module `tela:browser` (`src/browser.fab`, U2) owns the
mount/update/dispose lifecycle + hydration over the Tela-owned `tela:dom`
seam.
The **pinned seam call shape** (behavior-design §5 "Stage 3 pins the exact
seam call shape"; policy (b) renderer/host verbs English; campaign §7) as
**landed by U2 (`9f23095`)**:

```text
mount(Scope, View, Theme) → Mounted ∪ null
replace(Mounted, View)    → Update ∪ null
dispose(Mounted)           → void
```

- The English verbs (`mount`/`replace`/`dispose`), the three-argument shape,
  and the fail-closed nullable returns are unchanged from the spec sketch.
- **`dom.Scope` is the real Tela-owned seam** (restored in Stage 4 U6,
  then carried through the WSI U4 `tela:dom` flip). The current
  `tela:browser` module imports `tela:dom` and uses
  `mount(dom.Scope, View, Theme)`. The removed opaque `Scope` carrier and its
  `textus_praesens` field are not part of the live API. Callers construct a
  scope through `dom.scope(selector)`; pre-existing hydration state is read
  through the typed `dom.snapshot(scope)`, never carried in `Mounted`.
  The former `fix:web-dom-locale` and browser `fix:g4` marker sites were
  removed; the current source headers and §11 record the remaining provider
  handler-export and code-generation boundaries.
- **`dispose(Mounted) → void`** (reconciled deviation): the spec/U5 sketch
  read `→ vacuum`. `void` is the en-locale void type (the reader pack maps
  `vacuum = "void"`); `vacua` is the empty-collection value, not a type.
- **`Mounted`** — the host-state carrier (landed fields):

```fab
class Mounted {
    dom.Scope scope               # the scoped host region handle (real seam)
    RegionRoot root                # the mounted region root handle
    tela.View view               # current View
    tela.Theme theme               # active theme
    string markup           # serialized View (the render plan)
    string css_text              # theme cascade CSS (the render plan)
    list<string> identities       # data-tela identity index (document order)
    list<string> diagnostics         # hydration diagnostics (empty list = clean)
    list<Binding> bindings         # per-identity binding plan ("bind"/"create")
    list<EventSubscription> subscriptions # region-bind subscription descriptors
    string focused_identity         # modeled pre-replacement focused identity
    string target_identity  # modeled declared focus-movement target
}
```

  The module-local value carriers are `RegionRoot { identity }`,
  `EventSubscription { identity, event_name }`, `Binding { identity, status }`
  (kernel-owned constructors `region_root`, `event_subscription`, `binding`); the
  scope is constructed by the CALLER through the provider seam
  (`dom.scope(selector)` — the U6 flip removed the tela-local `scope`
  constructor). The `textus_praesens` carrier is GONE (U6): the region's
  current markup is read from the DOM via the typed hydration snapshot.
- **`Update`** — the update result `replace` returns: the next view plus
  the declarative effects (`{ View view, list<Effect> effects }`).
- **Fail-closed returns** — a mount/replace that cannot complete returns
  `null` (no partial binding, never a silent wrong tree).

### App-typed behavior-plan boundary (D1 rationale)

The campaign's conceptual `mount(Scope, Program, Theme)` (campaign §7)
**decomposes at the app boundary**. The Program's message-typed parts — the
`EventBinding`-shaped bindings (event_name + message-producing closures) and the
`update(message) → next View` function — are **app-typed in the benchmark**
(U3), not kernel-generic. Reason, recorded, not fought: radix defect **D1**
blocks generic user-type construction, so the kernel owns only the
non-generic carriers it can own (`EventName`); the concrete message-typed plan
is the application's surface. The app plan attaches through the `data-tela`
seam (identity-hydration.md §7): `EventBinding.identity` keys to the
`Identity.value` values the static renderer emits. Branch A re-spike is a
campaign option gated on D1 landing — never a mid-stage switch.

## 2. Behavior carriers (U1 landed emission — `4ca331a`)

The kernel's pure behavior-plan carriers — policy (b) Faber-Latin protocol
spellings, verified against the landed `src/tela.fab` (the spellings below
**are** the landed spellings, not the delivery's sketches):

```fab
class EventName { string name }                    # constructor: event_name(name)
union Effect {
    Restore { string identity }                 # constructor: restore(identity)
    Direct   { string identity }                 # constructor: direct(identity)
    Anchor   { string identity }                 # constructor: anchor(identity)
}
class Update { View view, list<Effect> effects }   # constructor: update(view, effects)
```

Map to behavior-design §3.2 — each effect keyed by a stable identity (the
`data-tela` value the Stage 1 hydration seam binds to):

| §3.2 effect | Landed variant | Semantics |
| --- | --- | --- |
| Focus restoration | `Restore { identity }` | restore focus to the node that held it before replacement, by its stable identity |
| Focus movement | `Direct { identity }` | move focus to a declared target identity |
| Scroll anchoring | `Anchor { identity }` | scroll-preservation intent for the region |

Kernel-owned ordinary-function constructors (`event_name`, `restore`,
`direct`, `anchor`, `update` — the G3 posture) plus one **total
accessor** `effect_identity(Effect) → string` that the host reads to
execute an effect by its key. The kernel is the only place a
consumer-imported union's variants can be matched (the G3-family
imported-union pattern does not bind from a consumer; recorded in the
kernel header), so consumers read effect keys through the accessor.

The carriers are **closure-free and host-seam-free** — plain values
(construct, combine, read fields, render; no behavior smuggled in) — so the
kernel's G4-safe flat stdlib-only shape is preserved. The kernel explicitly
does **NOT** own `EventBinding`/`Message`/`Program` (D1 + the concrete-message-
type constraint; recorded in the module header). Exempla:
`exempla/behavior.fab` (event-name construction; every effect variant; an
update result carrying a view + effects; pure-carrier composition; the
no-closure property).

## 3. Hydration contract

On mount into a scope whose root already contains Tela-rendered markup
(campaign §7; identity-hydration.md §6/§7):

- **Attach-to-matching** — bindings attach to the matching `data-tela`
  nodes instead of recreating them. The `data-tela` attribute is the one
  hydration-ready identity form in v1 (policy (d)2) — the documented host
  seam the browser mount reads to attach bindings and match on hydration.
- **Mismatch → diagnose + replace** — a missing/extra/out-of-shape node at a
  `data-tela` key **diagnoses + replaces the mismatched region from the
  View**: the declared policy (campaign §7), never a silent bind of the
  wrong tree.
- **Duplicate identity → diagnose** — duplicate `data-tela` values in the
  rendered markup are a hydration-match ambiguity (identity-hydration.md
  §6) → **diagnosed** per the Stage 3 policy, never a silent bind.

### Hydration policy functions (landed — U2 `9f23095` + U6 `tela-s4-u6`)

The policy lives in exported G4-safe pure functions (string/list signatures
only — they stay on the exported file interface) that `mount` composes and
the check-time exempla asserts directly. **Stage 4 U6 plus the WSI U4 seam
flip**: the pre-existing identity set + per-identity tag names come from the
Tela-owned typed hydration snapshot (`tela:dom.snapshot`, one
`DomNode { identity, tag }` per data-tela descendant), so the policy fns'
present input is the **aligned tag-index** (`present_tags`) — the
`textus_praesens` markup string is gone (no textual DOM parse):

```fab
parse_identities(string markup) → list<string>        # VIEW markup: data-tela identities in document order
element_tag(string markup, string identity) → string ∪ null  # the identity node's open-tag shape (VIEW)
tag_name(string tag) → string                        # open-tag → tag name ("<button …>" → "button")
count_occurrences(list<string> collection, string name) → int    # occurrence count
duplicate_identities(list<string> collection) → list<string>    # distinct identities appearing > once
identities_from_nodes(list<dom.DomNode> ∪ null) → list<string>     # snapshot → the present identity set
tags_from_nodes(list<dom.DomNode> ∪ null) → list<string>            # snapshot → the aligned tag names
tag_at(identity, present_identities, present_tags) → string  # the present tag for an identity
binding_status(identity, view_identities, present_identities, markup, present_tags) → string  # "bind" | "create"
hydration_diagnostics(markup, view_identities, present_identities, present_tags) → list<string>
```

- `binding_status` returns **`"bind"`** (bind the existing matching node —
  hydration) only when the identity is unique in both markups AND the VIEW
  element's tag name equals the PRAESENS node's typed tag name;
  **`"create"`** (create/replace from the View) otherwise — including every
  ambiguous/mismatched case.
- **The tag-name comparison (the U6 quote-normalization resolution)**: both
  sides normalize to TAG NAMES — the view side extracts the tag name from
  the serializer's open tag (`tag_name`), the present side uses the
  snapshot's typed tag. Tag names carry no quotes, so the serializer's
  single-quote vs the real DOM's double-quote serialization never enters
  the comparison (the U6 discovery's quote-style finding, resolved at the
  comparison level).
- `hydration_diagnostics` emits the deterministic diagnostic prefixes:
  `duplicate:<id>` (identity appears more than once in either markup),
  `foreign:<id>` (a pre-existing identity absent from the View), and
  `changed:<id>` (present in both, unique in both, but the element TAG NAMES
  differ). **Fidelity narrowing (recorded honestly)**: the landed
  `tela:dom.snapshot` carries identity + tag NAME only, so `changed` fires on
  a tag-name mismatch, not on an attribute-level open-tag shape difference.
  The U2-era attribute-shape `changed` (e.g. a same-tag class change) is
  superseded; the mismatch proof fixtures moved to tag-name mismatches. The
  full open-tag shape comparison would require the snapshot to carry
  attributes, which remains outside the current seam contract.

## 4. Update strategy

- **Rerender/replace the explicitly mounted region** (behavior-design
  §3.1): after a message, the new `View` is produced and the update
  replaces the explicitly mounted region — `replace(Mounted, next View)`.
  Replacement operates on that region, not the document at large, and never
  performs descendant lookup through ambient global document shortcuts.
- **Declarative effects on the update result** (§3.2): `replace` returns a
  `Update` whose `effects` derive from the before/after state
  (pre-replacement focused identity, declared focus movement, scroll-anchor
  intent); the host executes the declared effects **after** replacement
  (`Restore` restore by identity, `Direct` move to a declared target,
  `Anchor` scroll anchoring). Never imperative post-update host calls in
  user code — the component boundary stays pure.
- **Modeled focus state (landed — U2 `9f23095`)**: the before/after state
  rides `Mounted` as data, set through two model functions —
  `focus_held(Mounted, identity) → Mounted` (the pre-replacement focused
  identity → `Restore` on replace) and
  `focus_target(Mounted, identity) → Mounted` (a declared focus-movement
  target → `Direct` on replace). The harness mirrors the model onto the
  actual DOM focus at execution time; `replace` always adds `Anchor`
  (scroll-anchor intent) keyed to the region identity.
- **No keyed reconciliation, signals, hooks, or concurrent rendering**
  (campaign §6 deferral) — deferred until measured application pressure
  earns them.

## 5. Live-region policy (§1.5)

The segmented control owns a **declared live region** — a region explicitly
marked with a live-region policy (`aria-live` / `role="status"` semantics),
owned by the control, not ambient page notifications. The announcement names
the newly selected option and is issued **only when selection actually
changes** — silent when a click or keypress lands on the already-selected
segment. Update cycles that do not change selection remain silent per the
live-region policy (campaign §8: "including when an update should remain
silent").

### Landed emission (U3 `27aa181`/`c182688` — reconciled)

- The control's live region is a control-owned
  `<div role='status' aria-live='polite' data-tela='tela-live'></div>`
  (the `live_region()` component, a direct child of the control group).
- The announcement mapping is the app-owned
  `announcement(props, selected) → string` — names the newly selected option
  ("One selected", "Two selected", "Three selected"); the driver writes it
  into the live region via `webDomTextSet` **only** when the selection
  changes (the interaction gate asserts the live region reads the new
  option after a select and is unchanged after a no-op click / a focus-only
  arrow move — §5 sequence steps 1–6 in stage-3-segmented-control.md).

## 6. Async-gap boundary

The named Stage 3 input (`stage-0-behavior-design.md` §4, quoted from
`faber-web/README.md` "Known gap"), restated here so Stage 4+ Hands and
reviewers see it without re-reading the campaign:

> Known gap: the Radix TS backend does not await `@ futura` calls inside
> `fac`/`cape` blocks, so `dom.fetch_text` is exercised at the runtime-bridge
> level in the WEB5 fixture until the async codegen gap closes.

**Routing (this delivery — recorded, never silently assumed):**

- **Stage 3 proofs are synchronous only**: no `@ futura`, no
  `dom.fetch_text`, no async event sources, no fetch-driven/async update
  claim. The campaign gate's "resolve or route" condition is satisfied by
  **recording the routing and not claiming**.
- **Fetch-driven or async update claims remain blocked** until the gap is
  fixed or a separate radix compiler delivery lands. The escalation path is
  named: a minimized radix compiler delivery (a `@ futura`-in-`fac`/`cape`
  repro under `tela/spike/defects/`) is the pre-requisite for any future
  async stage.
- A Stage 3 unit that hits an async-shaped need records the workaround +
  escalation To mind; it never weakens the Tela contract and never waits on
  the fix.

## 7. Host-seam consumption

- **`tela:dom` is consumed directly through the documented host seam
  (Stage 4 U6 restoration plus WSI U4 flip).** `tela:browser` imports
  `tela:dom` (`import from "tela:dom" public * as dom`) and consumes the
  real seam: `dom.Scope` in signatures and fields, `dom.scope(selector)` for
  caller-side construction, and the typed hydration snapshot
  `dom.snapshot(scope)`. The old en→la `web:dom` blocker and its
  `fix:web-dom-locale` marker are historical; the current Tela package owns
  the English `tela:dom` conversion. The runtime binding names remain
  `webDom*`, so the dom-shim and the assembled runner provide those names at
  the host boundary. The seam types are `Scope`/`DomNode`, not tela's old
  opaque carriers, and the package does not import or re-author a `web:dom`
  provider.
- **No ambient global document shortcuts** for descendant lookup
  (behavior-design §5) — DOM operations flow through an explicit `Scope`.
- **`faber-web` remains a read-only source reference for the conversion**;
  Tela owns the live `tela:dom` source and its host-binding contract. The
  typed snapshot route is part of `tela:dom`; the runtime implements it as
  `webDomSnapshot`.
- **Locale/dialect posture**: the live Tela browser modules are authored in
  the English reader surface and the browser lane is TypeScript-only. The
  earlier cross-package locale-propagation blocker was cleared by the radix
  delivery and then superseded by the WSI conversion to `tela:dom`; current
  checks and emits use the Tela-owned English seam at real call sites,
  constructors, class-field types, function signatures, and the snapshot
  route.

## 8. DOM-shim proof vehicle + bounded fidelity

The mount/update proofs ride the **node runtime gate** (Stage 2 residual R1
convention) through a **DOM shim** (`tela/scripta/dom-shim.ts`, U2
`9f23095`): a minimal in-memory DOM implementing the `webDom*`
runtime-binding surface — the WEB5 fixture precedent
(`examples/browser-app/tests/fake-dom.mjs` + the `web-shim-dom.js` binding
facade). **Stage 4 U6 plus the WSI U4 flip**: the shim implements the typed
hydration snapshot read (`webDomSnapshot`) and the `Scope`/`DomNode` seam
shape the emitted module references. Mount reads the planted pre-existing
markup through the snapshot; the driver constructs the scope through the
provider binding and mount derives the hydration state from
`tela:dom.snapshot`. Landed driver surface (U4 `check-mount` builds on
these):

- `parseFragment(markup)` — the bounded HTML parser for the serializer's
  markup shape (elements + single-quoted attributes + `data-tela`
  identities + nested children + void elements).
- `executeMountPlan(document, selector, mounted, stamp)` — executes a mount
  plan at node level: `"bind"` identities bind to the existing matching
  node (stamped `"original"` when `stamp` is set), `"create"` identities
  are created/replaced from the View, extra/duplicated identity nodes are
  removed.
- `bindRegionSubscriptions(document, selector, mounted, handler)` — binds a
  `webDomOn` subscription per `Mounted.subscriptions` descriptor.
- `executeMountProof(api)` — the full Stage 3 U2 mount proof: drives the
  emitted `mount`/`replace`/`dispose` against the fake DOM and asserts the
  done_when (g) DOM outcomes (empty mount; hydration binds matching nodes —
  not recreated; mismatch diagnose+replace; duplicate collapse; replace
  effects `Restore`/`Direct`/`Anchor`; dispose unsubscribes + clears).

- **Bounded fidelity**: assertions at the **state level** (selection / ARIA
  / live-region / subscription / focus / scroll intent), not real layout.
- A **real-browser driver is out of scope** (recorded); layout/scroll/
  pointer fidelity beyond the shim's state-level surface is deferred.
- **Determinism posture** (§10): interactive state is time-variant, so the
  determinism gate applies to static/mount-time serialization only; the
  interaction sequence is a scripted deterministic assertion sequence, not a
  racy timing test.

## 9. Deferred renderer-host interface

No **general renderer-host interface** (one abstraction owned below
component semantics, so any renderer can drive any host) is created now. It
is deferred until a **second consumer asks** — a concrete non-`faber-web`
host or non-browser consumer (behavior-design §5; the governing invariant
"second caller before abstraction"). `faber-web` is the first and only
consumer today, so Tela consumes it directly through seams rather than
inventing a premature interface.

## 10. Determinism posture

- **Static/mount-time serialization is the determinism-gated surface**: the
  segmented control's initial HTML + full cascade build twice and are
  byte-identical (fail-closed double-build, sha256 → `build/hashes.txt`).
- **Interactive state is time-variant** — recorded, not claimed: the
  interaction sequence is a scripted deterministic assertion sequence under
  `node` (U4 `check-mount`), fail-closed on any assertion failure or
  non-zero exit.
- **R2 note** (`stage-2-determinism.md` §3): when the CODEGEN001
  Rust-lane fix lands, the Rust-lane capture must equal the TS-lane
  capture (sha equality); Rust emit of a `tela:dom`-importing module is
  doubly out (the Tela browser seam is TypeScript-only) — recorded, never
  the gate. **Stage 4
  U6 observation (recorded honestly)**: cds-u5 fixed the provider-module
  locale-propagation half, but the Rust lane remains BLOCKED on a NEW
  CODEGEN001 manifestation (`definition id … could not be resolved during
  code generation` — observed at the U6 check-determinism run; the
  three-package TS-lane sha `28f63f75…d1d39b` is unchanged). The R2
  activation is re-checked on the first post-fix run (a further radix
  codegen fix is required, not a harness change).

## 11. `fix:<id>` discipline inventory

The marker inventory (from the delivery's Escalation Path + Coordination
Constraint 3). This is the inventory record; the authoritative markers
applied per file live **at the site** in the module headers.
**Removal = grep-replace after each radix fix lands**; the Stage 3 closeout
re-check records the re-confirmed status. **Stage 4 U6**: the two removal
predicates (cds-u5 + cds-u6) are executed — the rows below flip to REMOVED.

| Defect | Marker | Posture |
| --- | --- | --- |
| historical `web:dom` locale/dialect gap (en→la) | `fix:web-dom-locale` | **REMOVED** — the radix propagation fix cleared the original blocker, and the WSI U4 flip moved the live browser seam to the Tela-owned English `tela:dom` module; the marker has no live site in `tela/src` (grep-verified) |
| imported-union variant matching from a consumer | `fix:sem001` | **Landed (U1, `4ca331a`; row added at the Stage 3 closeout)**: a consumer-side `match` over an imported union's variants does not bind — the kernel owns the only `Effect` matcher (`effect_identity`, `src/tela.fab:970` + module-header marker `src/tela.fab:913`); consumers read effect keys through the accessor. Removal = grep-replace after the radix fix lands |
| G4 — WARN014 snapshot skip on public signatures referencing imported sibling types | `fix:g4` | **REMOVED (Stage 4 U6)** — cds-u6 (file-interface exports, radix `2103f8a7f`) landed; `tela:browser`'s `mount`/`replace` export cleanly (no WARN014 on the tela-side surface; the remaining `dom.*` WARN014s at the import belong to the DOM provider's own handler-typed exports, not Tela's — the seam surface Tela consumes resolves). The marker has no live site in `tela/src` (grep-verified) |
| **primitive nullable bindings in fn bodies (NEW parser observation)** | **`fix:prim-nullable`** | **Extended (Stage 4 U6)**: a `lista<X> ∪ nihil` cannot call methods directly in an en fn body on this radix (the non-null / optional chain Member resolution does not route to list methods). Workaround (landed): bind the `∪ null`, check `is null`, then narrow inside `if nodes not is null { … }` to a non-null copy (the triga `vp_result![k]` precedent extended); method calls run on the copy |
| CODEGEN001 — Rust emit-across-imports | `fix:codegen001` | **PARTIAL**: the provider-module locale-propagation half is fixed; the Rust lane remains blocked on the recorded imported-definition manifestation, and the `tela:dom` browser seam is TypeScript-only, so Rust emit of a browser module is doubly out; the TS lane is the proven lane |
| G5/G6 — verb/identifier collisions (`mount`/`replace`/`dispose` + new identifiers) | `fix:g5` | Probed collision-free (U2: `scope`/`region_root`/`subscription`/`binding`/`focus_held`/`focus_target`/`parse_identities`/`element_tag` — NONE; U6: `tag_name`/`tag_at`/`identities_from_nodes`/`tags_from_nodes` — NONE); a colliding verb is escalated, never silently renamed |
| TS-emitter observations | `fix:ts-emitter` | Workarounds held; fragile against emitter changes |
| snapshot-name-collision | `fix:snapshot-name-collision` | Stage 2 workaround held; new identifiers avoid kernel type names (the seam types `Scope`/`DomNode` are imported from `tela:dom`, never re-declared in `tela:browser`) |

## 12. Reconciliation state (U1 + U2 + U3 landed; all reconciled)

- **U0 — English-first rename wave (2026-08-09, Stage 5 pre-admission) —
  reconciled, the whole surface renamed.** The operator's English-first
  policy (CAMPAIGN.md) + the head-cto naming review reworked the entire
  landed surface to EN keywords + English identifiers BEFORE the reference
  catalog (U2–U8) authors against it. Every section above reads the
  POST-U0 names unless explicitly marked pre-U0; the full rename table is
  in `stage-5-delivery.md` §U0. Key reconciliations recorded here:
  1. **Seam call shape** — unchanged verbs (`mount`/`replace`/`dispose`),
     types renamed: `mount(dom.Scope, View, Theme) → Mounted ∪ null`,
     `replace(Mounted, View) → Update ∪ null`, `dispose(Mounted) → void`.
  2. **`Mounted` fields** — English names (§1 landed block): `scope`,
     `root` (was `radix`), `view`, `theme`, `markup`, `css_text`,
     `identities`, `diagnostics`, `bindings`, `subscriptions`,
     `focused_identity` (was `identitas_focus`), `target_identity` (was
     `identitas_focus_optata`). `Mounted` itself STAYS English (operator).
  3. **Value carriers** — `RegionRoot` (was `Radiculum`),
     `EventSubscription` (was `Subscriptio` — NOT `Subscription`, which
     collides with the Tela DOM seam type in the TS assembly),
     `Binding` (was `Ligamen`); status strings `"bind"`/`"create"` (was
     `"ligare"`/`"creare"`); diagnostic prefixes `duplicate:`/`foreign:`/
     `changed:` (was `duplicata:`/`extranea:`/`muta:`); the tela-owned
     event `tela:binding` (was `tela:ligamen`).
  4. **Focus model** — `focus_held`/`focus_target` (was
     `focus_tenet`/`focus_optata`).
  5. **Hydration fns** — `parse_identities`/`element_tag`/
     `count_occurrences`/`duplicate_identities`/`binding_status`/
     `hydration_diagnostics`/`identities_from_nodes`/`tags_from_nodes`/
     `tag_name` (was `parse_identitates`/`elementum_tag`/`quotiens`/
     `identitates_duplicatae`/`ligamen_status`/`diagnosia_hydrationis`/
     `identitates_ex_nodis`/`tags_ex_nodis`/`nomen_tagi`).
  6. **Kernel carriers** — `EventName`/`Effect`/`Update` (was
     `Eventum`/`Effectus`/`Renovatio`), effect variants `Restore`/
     `Direct`/`Anchor`; `effect_identity` (was `effectus_identitas`).
  7. **`fix:g4` REMOVED** — the exempla-mode consumption of `→ tela.View`
     fns was re-verified live (green); the `*_html` helpers are retired.
- **U1 emission (`4ca331a`) — verified, no deviation.** The behavior-carrier
  spellings in §2 (`EventName { name }`, `union Effect` with
  `Restore`/`Direct`/`Anchor`, `Update { View view, list<Effect>
  effects }`) are the **landed** spellings from `src/tela.fab`, not the
  delivery's sketches. The delivery left "exact variant/field spellings are
  the Hand's" — the landed spelling is authoritative and this record
  documents it.
- **U2 emission (`9f23095`) — reconciled, deviations recorded.** This unit
  is the U5 reconciliation residual (U5 done_when (c)): the record now
  documents the **landed** browser surface. Every spec-locked sketch
  deviation, with the authoritative landed shape:
  1. **Seam call shape** — landed `mount(Scope, View, Theme) →
     Mounted ∪ null`, `replace(Mounted, View) → Update ∪ null`,
     `dispose(Mounted) → void` (§1). The spec sketch's `dom.Scope` is
     carried by tela:browser's own `Scope` handle (the blocked en→la
     `web:dom` import, `fix:web-dom-locale`); `vacuum` is the en `void`
     type (the reader-pack mapping), not `vacua`.
  2. **`Mounted` fields** — landed spellings in §1 (incl. the render-plan
     fields `markup`/`css_text`, the identity index, the
     diagnostics, the binding plan, the subscription list, and the modeled
     focus state).
  3. **Hydration fn names** — landed `parse_identities`/`element_tag`/
     `count_occurrences`/`duplicate_identities`/`binding_status`/
     `hydration_diagnostics` (§3), exposed as G4-safe exported pure fns.
  4. **`fix:<id>` inventory** — gained `fix:prim-nullable` (NEW parser
     observation) and the landed g4/web-dom-locale observations (§11).
  5. **Synchronous-only + shim-boundary statements** — verified unchanged;
     §7/§8 now record the harness-level `webDom*` binding as the landed
     posture and the landed dom-shim driver entry points.
- **U3 emission (`27aa181`/`c182688`) — reconciled, deviations recorded.**
  The segmented-control interaction proof + the app-typed plan landed and
  this record's §5 (live-region policy) and the interaction-gate
  statements now document the landed emission (the stage-3 closeout
  residual path, auditor-4 P2-3):
  1. **The live-region policy (§5)** — the control-owned
     `<div role='status' aria-live='polite' data-tela='tela-live'>`
     node, the `announcement(props, selected)` announcement mapping, and the
     silent-on-no-op/focus-only behavior — asserted by the interaction
     gate (U4 `check-mount`).
  2. **The interaction-gate statements (§8/§10)** — the scripted sequence
     executes under `check-mount` (pointer select / no-op / keyboard
     focus-only / Space-Enter / Home-End / replace + effects / dispose);
     determinism applies to the static/mount-time serialization only
     (`stage-3-mount-determinism.md`, sha `77516916…e5490`).
  3. **The app-typed plan (D1 boundary)** — `union Message` /
     `class EventBinding` (event_name + message-producing closures) /
     `update_control` / `key_message` / `announcement` are app-side in
     the benchmark, never kernel-generic — the campaign's conceptual
     `mount(Scope, Program, Theme)` decomposes at the app boundary
     (identity-hydration.md §7 attach point).
  4. **`fix:<id>` inventory (§11)** — gained `fix:sem001` (the kernel owns
     the only `Effect` matcher, `effect_identity`) at the closeout
     (auditor-4 P2-1).
- **U6 emission (`tela-s4-u6`) — the seam restoration, reconciled; WSI U4
  is the current provider ownership.** The CTO10-3 gate opened (cds-u5
  `e32397630` + cds-u6 `2103f8a7f`). The later WSI U4 flip moved the live
  browser seam from the historical `web:dom` provider to Tela's `tela:dom`
  source; this record and `browser.fab` now use the current names:
  1. **Seam call shape restored** — `mount(dom.Scope, View, Theme)`, the
     spec-locked shape (§1). The opaque `Scope { selector,
     textus_praesens }` carrier + the `scope` constructor are REMOVED; the
     scope is constructed by the caller through the provider seam.
  2. **Snapshot-based hydration** — `mount` reads the pre-existing identity
     set + per-identity tag names from `dom.snapshot(scope)` (the typed
     read; no textual DOM parse); the policy fns take the aligned tag-index
     (`present_tags`) instead of the present markup string (§3).
  3. **Tag-name shape comparison** — both sides normalize to tag names; the
     `changed` diagnostic fires on a tag-name mismatch (the landed snapshot's
     fidelity — attribute-level open-tag shape comparison superseded,
     recorded honestly in §3).
  4. **Markers flipped (§11)** — the removal predicates executed
     (grep-verified: no live marker site in `tela/src`); the R2 note records
     the separate Rust-lane CODEGEN001 manifestation (§10).
  5. **Harness surface** — the dom-shim implements `webDomSnapshot` and the
     `Scope`/`DomNode` seam shape; the driver constructs scopes through the
     provider binding and mount reads the planted pre-existing markup through
     the snapshot (§8).

## Non-goals

- No API reference beyond the locked surfaces (the pinned seam call shape,
  the landed behavior carriers, the kernel/assembly/theme surfaces).
- No Stage 4+ docs (independent extension proof, reference catalog).
- No website/marketing docs.
- No `CAMPAIGN.md` edits (closeout-owned, decision D3).
- No radix-lane fixes.
