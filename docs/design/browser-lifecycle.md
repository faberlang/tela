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
**Status**: active (Stage 3 U5 docs unit). U1 landed (`4ca331a`); U2/U3 were
in flight at writing — see §12 (Reconciliation state) for the boundary.

This record documents the Stage 3 lifecycle surface **as the delivery locks
it** and the behavior carriers **as U1 landed them**. It makes no
implementation claim beyond the landed kernel emission and the spec-locked
browser surface.

---

## 1. Pinned seam call shape

The browser module `tela:browser` (`src/browser.fab`, U2) owns the
mount/update/dispose lifecycle + hydration over the `web:dom` host seam.
The **pinned seam call shape** (behavior-design §5 "Stage 3 pins the exact
seam call shape"; policy (b) renderer/host verbs English; campaign §7):

```text
mount(dom.Scope, Visus, Thema) → Mounted ∪ null
replace(Mounted, Visus)        → Renovatio ∪ null
dispose(Mounted)               → vacuum
```

- **`Mounted`** — the host-state carrier (U2): scope, mounted root, current
  `Visus`, active theme, subscription list. Its fields reference `web:dom`
  types — module-local; the cross-package snapshot-skip risk is recorded
  `fix:g4`.
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

- The browser module consumes `web:dom` **through documented host seams**
  (behavior-design §5): `Scope`-scoped query/mutation/subscription —
  `scope(selector)`, `query`/`require`/`all`, `text_set`/`attr_set`/
  `class_add`, `on`/`unsubscribe`, `on_input`/`on_keyboard`/`on_pointer`/
  `on_focus`/`on_submit`, `prevent_default`. The `@ futura` `fetch_text`
  surface is out of scope (the async gap, §6).
- **No ambient global document shortcuts** for descendant lookup
  (behavior-design §5; `faber-web/README.md`) — DOM operations flow through
  an explicit `Scope`.
- **`faber-web` is read-only in Stage 3** — consumed through documented
  host seams, not edited. Extended only for general host gaps per the
  campaign overlap rule; no general host gap is known at lowering time
  (recorded).
- **Dialect/locale gap (NEW named escalation)**: `faber-web` is authored in
  the Latin dialect (`faber.toml` `[reader] locale = "la"`), targets **ts
  only**, and its proven consumer path is la (WEB5 fixture). The en-locale
  tela package importing `web:dom` cross-package is **unproven** and may
  hit the provider-module locale-propagation family (PARSE001 — the
  CODEGEN001 mechanism) at `radix check` — marker `fix:web-dom-locale`.
  Posture: **attempt the import**; on failure record + escalate; fall back
  to the harness-level DOM binding (the assembled runner + dom-shim bind
  the `webDom*` surface, mirroring `web-shim-dom.js`); **never re-author a
  `web:dom` copy inside tela**, never weaken the contract.

## 8. DOM-shim proof vehicle + bounded fidelity

The mount/update proofs ride the **node runtime gate** (Stage 2 residual R1
convention) through a **DOM shim** (`tela/scripta/dom-shim.ts`, U2): a
minimal in-memory DOM implementing the `webDom*` runtime-binding surface —
the WEB5 fixture precedent (`examples/browser-app/tests/fake-dom.mjs` + the
`web-shim-dom.js` binding facade).

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
| `web:dom` locale/dialect gap (en→la) | `fix:web-dom-locale` | ATTEMPTED at check/emit; on failure record + escalate; fallback = harness-level DOM binding; never re-author a `web:dom` copy inside tela |
| G4 — WARN014 snapshot skip on public signatures referencing imported sibling types | `fix:g4` | Compose-without + harness-assembly workaround (the snapshot does not apply at runtime); app-local consumption |
| CODEGEN001 — Rust emit-across-imports | `fix:codegen001` | Rust path attempted + recorded; `web:dom` is ts-only so Rust emit of a browser module is doubly out; TS lane is the proven lane; R2 sha-equality |
| G5/G6 — verb/identifier collisions (`mount`/`replace`/`dispose` + new identifiers) | `fix:g5` | Probed collision-free; a colliding verb is escalated, never silently renamed |
| TS-emitter observations | `fix:ts-emitter` | Workarounds held; fragile against emitter changes |
| snapshot-nomen-collision | `fix:snapshot-nomen-collision` | Stage 2 workaround held; new identifiers avoid kernel type names |

## 12. Reconciliation state (U1 landed; U2/U3 pending)

- **U1 emission (`4ca331a`) — verified, no deviation.** The behavior-carrier
  spellings in §2 (`Eventum { nomen }`, `union Effectus` with
  `Restitue`/`Dirige`/`Ancora`, `Renovatio { Visus visus, list<Effectus>
  effectus }`) are the **landed** spellings from `src/tela.fab`, not the
  delivery's sketches. The delivery left "exact variant/field spellings are
  the Hand's" — the landed spelling is authoritative and this record
  documents it.
- **U2 (browser module + dom-shim) and U3 (segmented-interactive) were in
  flight at the completion of this unit.** This record writes the browser
  surface against the **spec-locked** seam call shape (§1) and hydration
  policy (§3). If the U2/U3 emission differs by the time it lands,
  reconcile within U5 scope or route the deviation to Mind — recorded as a
  residual, not blocking (done_when (c) path).

## Non-goals

- No API reference beyond the locked surfaces (the pinned seam call shape,
  the landed behavior carriers, the kernel/assembly/theme surfaces).
- No Stage 4+ docs (independent extension proof, reference catalog).
- No website/marketing docs.
- No `CAMPAIGN.md` edits (closeout-owned, decision D3).
- No radix-lane fixes.
