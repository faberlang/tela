# Browser Lifecycle — design record (tela Stage 3 U5)

**Record**: `tela-s3-u5-docs` (stage-3-delivery.md U5) — the browser
mount/update/dispose lifecycle + the Branch B behavior plan written down for
later Hands, reviewers, and the Stage 4 independent-extension gate.
**Sources**: the landed Stage 3 U1 kernel emission (`src/tela.fab`,
`4ca331a`), the Stage 3 delivery spec (Normalized Spec; Async-gap Routing;
Coordination Constraints; Escalation Path), `stage-0-behavior-design.md`
§1/§3/§4/§5, `docs/design/identity-hydration.md` §6/§7,
`stage-0-protocol-policies.md` policies (b)/(d), `CAMPAIGN.md` §6/§7, and
the Stage 1/2 records (`stage-2-determinism.md` R2 note; closeouts).
**Status**: active (Stage 3 U5 docs unit, reconciled against the landed U2
emission). U1 landed (`4ca331a`), U2 landed (`9f23095`) — see §12
(Reconciliation state) for the deviation ledger. U3 pending.

This record documents the Stage 3 lifecycle surface **as the delivery locks
it** and **as the U1/U2 emissions landed them** (the landed emission is the
authority; the spec-locked sketch governs only where no emission exists yet —
see §12 for the deviation ledger).

---

## 1. Pinned seam call shape

The browser module `tela:browser` (`src/browser.fab`, U2) owns the
mount/update/dispose lifecycle + hydration over the `web:dom` host seam.
The **pinned seam call shape** (behavior-design §5 "Stage 3 pins the exact
seam call shape"; policy (b) renderer/host verbs English; campaign §7) as
**landed by U2 (`9f23095`)**:

```text
mount(Scope, Visus, Thema) → Mounted ∪ null
replace(Mounted, Visus)    → Renovatio ∪ null
dispose(Mounted)           → void
```

- The English verbs (`mount`/`replace`/`dispose`), the three-argument shape,
  and the fail-closed nullable returns are unchanged from the spec sketch.
- **`dom.Scope` → tela:browser's `Scope`** (reconciled deviation): the
  spec-locked sketch read `mount(dom.Scope, Visus, Thema)`. The en→la
  `web:dom` import is **blocked** on in-tree radix 0.80.0 (PARSE001/SEM002
  at any real use — `fix:web-dom-locale`, §11), so per delivery U2 done_when
  (h) the seam carries the blocked `dom.Scope` type as tela:browser's own
  opaque `Scope` handle (`{ selector, textus_praesens }`). The DOM surface
  binds at the harness level (the dom-shim binds the `webDom*` surface, §7
  /§8); web:dom is never re-authored inside tela and the contract is never
  weakened. After the radix fix lands, the seam flips back to `dom.Scope`
  (grep-replace, §11).
- **`dispose(Mounted) → void`** (reconciled deviation): the spec/U5 sketch
  read `→ vacuum`. `void` is the en-locale void type (the reader pack maps
  `vacuum = "void"`); `vacua` is the empty-collection value, not a type.
- **`Mounted`** — the host-state carrier (landed fields):

```fab
class Mounted {
    Scope scopus                    # the scoped host region handle
    Radiculum radix                 # the mounted region root handle
    tela.Visus visus                # current View
    tela.Thema thema                # active theme
    string textus_markup            # serialized View (the render plan)
    string textus_css               # theme cascade CSS (the render plan)
    list<string> identitates        # data-tela identity index (document order)
    list<string> diagnosia          # hydration diagnostics (empty list = clean)
    list<Ligamen> ligamina          # per-identity binding plan ("ligare"/"creare")
    list<Subscriptio> subscriptiones # region-bind subscription descriptors
    string identitas_focus          # modeled pre-replacement focused identity
    string identitas_focus_optata   # modeled declared focus-movement target
}
```

  The module-local host carriers are `Scope { selector, textus_praesens }`,
  `Radiculum { identitas }`, `Subscriptio { identitas, nomen_eventi }`,
  `Ligamen { identitas, status }` (kernel-owned constructors `scopus`,
  `radiculum`, `subscriptio`, `ligamen`). `textus_praesens` is the region's
  current markup as the state model knows it ("" = empty); the harness
  mirrors it onto the actual DOM at execution time.
- **`Renovatio`** — the update result `replace` returns: the next view plus
  the declarative effects (`{ Visus visus, list<Effectus> effectus }`).
- **Fail-closed returns** — a mount/replace that cannot complete returns
  `null` (no partial binding, never a silent wrong tree).

### App-typed behavior-plan boundary (D1 rationale)

The campaign's conceptual `mount(Scope, Program, Theme)` (campaign §7)
**decomposes at the app boundary**. The Program's message-typed parts — the
`Vinculum`-shaped bindings (eventus + message-producing closures) and the
`update(message) → next Visus` function — are **app-typed in the benchmark**
(U3), not kernel-generic. Reason, recorded, not fought: radix defect **D1**
blocks generic user-type construction, so the kernel owns only the
non-generic carriers it can own (`Eventum`); the concrete message-typed plan
is the application's surface. The app plan attaches through the `data-tela`
seam (identity-hydration.md §7): `Vinculum.identitas` keys to the
`Identitas.valor` values the static renderer emits. Branch A re-spike is a
campaign option gated on D1 landing — never a mid-stage switch.

## 2. Behavior carriers (U1 landed emission — `4ca331a`)

The kernel's pure behavior-plan carriers — policy (b) Faber-Latin protocol
spellings, verified against the landed `src/tela.fab` (the spellings below
**are** the landed spellings, not the delivery's sketches):

```fab
class Eventum { string nomen }                    # constructor: eventum(nomen)
union Effectus {
    Restitue { string identitas }                 # constructor: restitue(identitas)
    Dirige   { string identitas }                 # constructor: dirige(identitas)
    Ancora   { string identitas }                 # constructor: ancora(identitas)
}
class Renovatio { Visus visus, list<Effectus> effectus }   # constructor: renovatio(visus, effectus)
```

Map to behavior-design §3.2 — each effect keyed by a stable identity (the
`data-tela` value the Stage 1 hydration seam binds to):

| §3.2 effect | Landed variant | Semantics |
| --- | --- | --- |
| Focus restoration | `Restitue { identitas }` | restore focus to the node that held it before replacement, by its stable identity |
| Focus movement | `Dirige { identitas }` | move focus to a declared target identity |
| Scroll anchoring | `Ancora { identitas }` | scroll-preservation intent for the region |

Kernel-owned ordinary-function constructors (`eventum`, `restitue`,
`dirige`, `ancora`, `renovatio` — the G3 posture) plus one **total
accessor** `effectus_identitas(Effectus) → string` that the host reads to
execute an effect by its key. The kernel is the only place a
consumer-imported union's variants can be matched (the G3-family
imported-union pattern does not bind from a consumer; recorded in the
kernel header), so consumers read effect keys through the accessor.

The carriers are **closure-free and `web:dom`-free** — plain values
(construct, combine, read fields, render; no behavior smuggled in) — so the
kernel's G4-safe flat stdlib-only shape is preserved. The kernel explicitly
does **NOT** own `Vinculum`/`Nuntius`/`Program` (D1 + the concrete-message-
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

### Hydration policy functions (landed — U2 `9f23095`)

The policy lives in exported G4-safe pure functions (string/list signatures
only — they stay on the exported file interface, unlike the WARN014-skipped
`mount`/`replace`, §11) that `mount` composes and the check-time exempla
asserts directly:

```fab
parse_identitates(string markup) → list<string>        # data-tela identities in document order
elementum_tag(string markup, string identitas) → string ∪ null  # the identity node's open-tag shape
quotiens(list<string> collatio, string nomen) → int    # occurrence count
identitates_duplicatae(list<string> collatio) → list<string>    # distinct identities appearing > once
ligamen_status(identitas, identitates_view, identitates_praesentes, markup, praesens) → string  # "ligare" | "creare"
diagnosia_hydrationis(markup, praesens, identitates_view, identitates_praesentes) → list<string>
```

- `ligamen_status` returns **`"ligare"`** (bind the existing matching node —
  hydration) only when the identity is unique in both markups and the
  open-tag shapes match; **`"creare"`** (create/replace from the View)
  otherwise — including every ambiguous/mismatched case.
- `diagnosia_hydrationis` emits the deterministic diagnostic prefixes:
  `duplicata:<id>` (identity appears more than once in either markup),
  `extranea:<id>` (a pre-existing identity absent from the View), and
  `muta:<id>` (present in both, unique in both, but the open-tag shapes
  differ).

## 4. Update strategy

- **Rerender/replace the explicitly mounted region** (behavior-design
  §3.1): after a message, the new `Visus` is produced and the update
  replaces the explicitly mounted region — `replace(Mounted, next Visus)`.
  Replacement operates on that region, not the document at large, and never
  performs descendant lookup through ambient global document shortcuts.
- **Declarative effects on the update result** (§3.2): `replace` returns a
  `Renovatio` whose `effectus` derive from the before/after state
  (pre-replacement focused identity, declared focus movement, scroll-anchor
  intent); the host executes the declared effects **after** replacement
  (`Restitue` restore by identity, `Dirige` move to a declared target,
  `Ancora` scroll anchoring). Never imperative post-update host calls in
  user code — the component boundary stays pure.
- **Modeled focus state (landed — U2 `9f23095`)**: the before/after state
  rides `Mounted` as data, set through two model functions —
  `focus_tenet(Mounted, identitas) → Mounted` (the pre-replacement focused
  identity → `Restitue` on replace) and
  `focus_optata(Mounted, identitas) → Mounted` (a declared focus-movement
  target → `Dirige` on replace). The harness mirrors the model onto the
  actual DOM focus at execution time; `replace` always adds `Ancora`
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
  (the `regio_viva()` component, a direct child of the control group).
- The announcement mapping is the app-owned
  `annuntium(props, electum) → string` — names the newly selected option
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

- **`web:dom` binds at the harness level (landed posture — `fix:web-dom-locale`).** The en→la `web:dom` import is **blocked** on in-tree radix
  0.80.0 (PARSE001/SEM002 at any real use — calls, type inference,
  construction, class-field types), so `tela:browser` does **not** import
  `web:dom`; the DOM surface binds at the **harness level** — the dom-shim
  (`tela/scripta/dom-shim.ts`) implements the `webDom*` runtime-binding
  surface (`webDomScope`/`webDomQuery`/`webDomRequire`/`webDomAll`/
  `webDomTextSet`/`webDomAttrSet`/`webDomClassAdd`/`webDomOn`/
  `webDomUnsubscribe`/… — mirroring `faber-web/runtime/dom.ts`), and the
  assembled runner binds it. The spec's listed seam functions
  (`scope(selector)`, `query`/`require`/`all`, `text_set`/`attr_set`/
  `class_add`, `on`/`unsubscribe`, `on_input`/`on_keyboard`/`on_pointer`/
  `on_focus`/`on_submit`, `prevent_default`) are the **web:dom surface the
  harness exposes**, not `tela:browser`'s own surface. The `@ futura`
  `fetch_text` surface is out of scope (the async gap, §6). web:dom is
  NEVER re-authored inside tela.
- **No ambient global document shortcuts** for descendant lookup
  (behavior-design §5; `faber-web/README.md`) — DOM operations flow through
  an explicit `Scope`.
- **`faber-web` is read-only in Stage 3** — consumed through documented
  host seams, not edited. Extended only for general host gaps per the
  campaign overlap rule; no general host gap is known at lowering time
  (recorded).
- **Dialect/locale gap (NEW named escalation — landed)**: `faber-web` is
  authored in the Latin dialect (`faber.toml` `[reader] locale = "la"`),
  targets **ts only**, and its proven consumer path is la (WEB5 fixture).
  The en-locale tela package importing `web:dom` cross-package was
  **ATTEMPTED at `radix check` + TS emit** and **failed** with the
  provider-module locale-propagation family (PARSE001 — the CODEGEN001
  mechanism; SEM002 at qualified class-field types) — marker
  `fix:web-dom-locale`. The fallback posture **landed**: the DOM surface
  binds at the harness level (assembled runner + dom-shim bind the
  `webDom*` surface, mirroring `web-shim-dom.js`); **never re-author a
  `web:dom` copy inside tela**, never weaken the contract. The seam's
  `Scope` handle carries the blocked `dom.Scope` type (see §1).

## 8. DOM-shim proof vehicle + bounded fidelity

The mount/update proofs ride the **node runtime gate** (Stage 2 residual R1
convention) through a **DOM shim** (`tela/scripta/dom-shim.ts`, U2
`9f23095`): a minimal in-memory DOM implementing the `webDom*`
runtime-binding surface — the WEB5 fixture precedent
(`examples/browser-app/tests/fake-dom.mjs` + the `web-shim-dom.js` binding
facade). Landed driver surface (U4 `check-mount` builds on these):

- `parseFragment(markup)` — the bounded HTML parser for the serializer's
  markup shape (elements + single-quoted attributes + `data-tela`
  identities + nested children + void elements).
- `executeMountPlan(document, selector, mounted, stamp)` — executes a mount
  plan at node level: `"ligare"` identities bind to the existing matching
  node (stamped `"original"` when `stamp` is set), `"creare"` identities
  are created/replaced from the View, extra/duplicated identity nodes are
  removed.
- `bindRegionSubscriptions(document, selector, mounted, handler)` — binds a
  `webDomOn` subscription per `Mounted.subscriptiones` descriptor.
- `executeMountProof(api)` — the full Stage 3 U2 mount proof: drives the
  emitted `mount`/`replace`/`dispose` against the fake DOM and asserts the
  done_when (g) DOM outcomes (empty mount; hydration binds matching nodes —
  not recreated; mismatch diagnose+replace; duplicate collapse; replace
  effects `Restitue`/`Dirige`/`Ancora`; dispose unsubscribes + clears).

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
  capture (sha equality); Rust emit of a `web:dom`-importing module is
  doubly out (`web:dom` is ts-only) — recorded, never the gate.

## 11. `fix:<id>` discipline inventory

The Stage 3 marker inventory (from the delivery's Escalation Path +
Coordination Constraint 3). This is the inventory record; the authoritative
markers applied per file live **at the site** in the module headers.
**Removal = grep-replace after each radix fix lands**; the Stage 3 closeout
re-check records the re-confirmed status.

| Defect | Marker | Stage 3 posture |
| --- | --- | --- |
| `web:dom` locale/dialect gap (en→la) | `fix:web-dom-locale` | **ATTEMPTED and FAILED** at check/emit on in-tree radix 0.80.0 (PARSE001/SEM002 — probe matrix in the `browser.fab` header). Landed fallback: harness-level DOM binding (dom-shim binds the `webDom*` surface); the seam carries `dom.Scope` as tela:browser's `Scope` handle; never re-author a `web:dom` copy inside tela |
| imported-union variant matching from a consumer | `fix:sem001` | **Landed (U1, `4ca331a`; row added at the Stage 3 closeout)**: a consumer-side `match` over an imported union's variants does not bind — the kernel owns the only `Effectus` matcher (`effectus_identitas`, `src/tela.fab:970` + module-header marker `src/tela.fab:913`); consumers read effect keys through the accessor. Removal = grep-replace after the radix fix lands |
| G4 — WARN014 snapshot skip on public signatures referencing imported sibling types | `fix:g4` | **Landed observation**: the pinned seam fns `mount`/`replace` (imported `tela` sibling types in signatures) are export-skipped for consumers. Workaround: the G4-safe pure policy fns (string/list signatures) stay exported for check-time exempla; the harness-assembly workaround covers the skipped fns (the snapshot does not apply at runtime — the driver calls the emitted `mount`/`replace` directly) |
| **primitive nullable bindings in fn bodies (NEW parser observation)** | **`fix:prim-nullable`** | **Landed, new**: a primitive `∪ null` const/var annotation and a `!` unwrap of a primitive nullable do not parse inside named function bodies on in-tree radix 0.80.0 (PARSE030/PARSE001; the same forms work in `main`, and class `∪ null` works in fn bodies — the kernel's `thema_css` pattern). Workaround: null checks run against the call (`if f(x) is null then …`), then the value binds via `coalesce ""`; shape comparisons carry a boolean `habet` flag |
| CODEGEN001 — Rust emit-across-imports | `fix:codegen001` | Rust path attempted + recorded; `web:dom` is ts-only so Rust emit of a browser module is doubly out; TS lane is the proven lane; R2 sha-equality |
| G5/G6 — verb/identifier collisions (`mount`/`replace`/`dispose` + new identifiers) | `fix:g5` | Probed collision-free (U2: `scopus`/`radiculum`/`subscriptio`/`ligamen`/`focus_tenet`/`focus_optata`/`parse_identitates`/`elementum_tag` — NONE); a colliding verb is escalated, never silently renamed |
| TS-emitter observations | `fix:ts-emitter` | Workarounds held; fragile against emitter changes |
| snapshot-nomen-collision | `fix:snapshot-nomen-collision` | Stage 2 workaround held; new identifiers avoid kernel type names |

## 12. Reconciliation state (U1 + U2 + U3 landed; all reconciled)

- **U1 emission (`4ca331a`) — verified, no deviation.** The behavior-carrier
  spellings in §2 (`Eventum { nomen }`, `union Effectus` with
  `Restitue`/`Dirige`/`Ancora`, `Renovatio { Visus visus, list<Effectus>
  effectus }`) are the **landed** spellings from `src/tela.fab`, not the
  delivery's sketches. The delivery left "exact variant/field spellings are
  the Hand's" — the landed spelling is authoritative and this record
  documents it.
- **U2 emission (`9f23095`) — reconciled, deviations recorded.** This unit
  is the U5 reconciliation residual (U5 done_when (c)): the record now
  documents the **landed** browser surface. Every spec-locked sketch
  deviation, with the authoritative landed shape:
  1. **Seam call shape** — landed `mount(Scope, Visus, Thema) →
     Mounted ∪ null`, `replace(Mounted, Visus) → Renovatio ∪ null`,
     `dispose(Mounted) → void` (§1). The spec sketch's `dom.Scope` is
     carried by tela:browser's own `Scope` handle (the blocked en→la
     `web:dom` import, `fix:web-dom-locale`); `vacuum` is the en `void`
     type (the reader-pack mapping), not `vacua`.
  2. **`Mounted` fields** — landed spellings in §1 (incl. the render-plan
     fields `textus_markup`/`textus_css`, the identity index, the
     diagnostics, the binding plan, the subscription list, and the modeled
     focus state).
  3. **Hydration fn names** — landed `parse_identitates`/`elementum_tag`/
     `quotiens`/`identitates_duplicatae`/`ligamen_status`/
     `diagnosia_hydrationis` (§3), exposed as G4-safe exported pure fns.
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
     node, the `annuntium(props, electum)` announcement mapping, and the
     silent-on-no-op/focus-only behavior — asserted by the interaction
     gate (U4 `check-mount`).
  2. **The interaction-gate statements (§8/§10)** — the scripted sequence
     executes under `check-mount` (pointer select / no-op / keyboard
     focus-only / Space-Enter / Home-End / replace + effects / dispose);
     determinism applies to the static/mount-time serialization only
     (`stage-3-mount-determinism.md`, sha `77516916…e5490`).
  3. **The app-typed plan (D1 boundary)** — `union Nuntius` /
     `class Vinculum` (eventus + message-producing closures) /
     `update_controlli` / `nuntius_clavis` / `annuntium` are app-side in
     the benchmark, never kernel-generic — the campaign's conceptual
     `mount(Scope, Program, Theme)` decomposes at the app boundary
     (identity-hydration.md §7 attach point).
  4. **`fix:<id>` inventory (§11)** — gained `fix:sem001` (the kernel owns
     the only `Effectus` matcher, `effectus_identitas`) at the closeout
     (auditor-4 P2-1).

## Non-goals

- No API reference beyond the locked surfaces (the pinned seam call shape,
  the landed behavior carriers, the kernel/assembly/theme surfaces).
- No Stage 4+ docs (independent extension proof, reference catalog).
- No website/marketing docs.
- No `CAMPAIGN.md` edits (closeout-owned, decision D3).
- No radix-lane fixes.
