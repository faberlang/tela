# Stage 0 — Protocol And Ownership Contract — Delivery Spec

**Status**: planned (delivery lowering complete)
**Planner**: planner-1
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` (Stage 0 — "Protocol And Ownership Contract", lines 191–225)
**Control-plane repo**: `/Users/ianzepp/work/faberlang/tela` (empty repo, `main` only)
**Mode**: planning artifacts only. This spec lowers the stage; it does not implement.
**Closeout owner**: the tela CAMPAIGN.md status line is owned by the stage closeout, not by any unit in this spec.

---

## Phase Intent

Turn the Stage 0 campaign gate into discrete, one-Hand-per-unit implementable
units. Stage 0 is the **design/spike slice**: it locks ownership and identity,
decides the protocol contract seams, runs the two-package extension canary, and
closes every load-bearing `CAMPAIGN-review-1` item so Stage 1 (kernel + static
renderer) starts with a decided `View` shape and no carried-open decisions.

What Stage 0 is **not**: no kernel, no production serializer, no reference
catalog, no browser lifecycle implementation, no remote/publication action.

---

## Interpreted Scope

Stage 0 must, per the campaign readiness table and gate:

1. **Lock ownership + final public naming** — working names `tela`/`tela`
   remain unless the operator overrides before implementation; remote
   publication stays gated; this repo is the Stage 1 cwd.
2. **Design the protocol contract** — extensible typed view protocol,
   style/theme protocols, static/browser renderer split; decided, not carried
   open.
3. **Run the two-package canary** — campaign line 186: "Run a two-package
   canary in Stage 0"; one extension library + one application, custom helper +
   namespaced token, benchmark panel/table/bar composition.
4. **Reconcile the capability docs** — the `faber-web/README.md` citation of a
   `target-capability-matrix.md` "Browser Application Product Packaging"
   section that does not exist; trace, name the authoritative doc, route the
   repair (campaign line 133, lines 218–220).
5. **Close the `CAMPAIGN-review-1` load-bearing items** — identity, focus,
   ordering, async, early-extension gates — in Stage 0, not carried into
   Stage 1.

Non-goals (from campaign §Explicitly Out Of Scope + Stage 0 gate): no
`Target::Web`, no HTML/CSS grammar, no compiler component annotations, no
reference catalog, no production serializer/determinism gate, no
remote/publication, no `faber-web` public-API edits.

---

## Normalized Spec

Stage 0 produces, in the `tela` repo: one ownership/identity contract, one
capability-reconciliation record, one cross-target protocol spike with a Branch
A/B evidence decision, one two-package extension canary, one behavior design,
and one protocol-policies lock. Two coupled doc repairs land in `radix` and
`faber-web` (capability section + README anchors). Every campaign Stage 0 gate
bullet maps to a unit done_when below.

The deliverable shape is **decisions + spike evidence**, not framework code.
The spike's Faber sources are throwaway-quality proof living under
`tela/spike/`; they are the first vertical evidence for Stage 1's kernel
contract but are not the kernel.

---

## Repo-Aware Baseline

Verified by planner-1 (2026-08-08/09):

- **`tela/`** — empty repo on `main`; contains only
  `docs/factory/mvp/CAMPAIGN.md`. It is the Stage 1 cwd. No scaffold exists.
- **`faber-web/README.md`** — citations added in commit `f36a67b`
  ("docs: WEB6 delivery status", 2026-07-17). Two citations:
  1. `radix/docs/design/target-capability-matrix.md` § *Browser Application
     Product Packaging* — **dangling**: the section does not exist.
  2. `radix/docs/factory/faber-hir-v1/browser-application-delivery.md`
     § *Delivery Evidence* — **dangling anchor**: the file exists but has no
     "Delivery Evidence" heading; the correct anchor is the
     `### WEB6 — Product Claims And Reciprocity` section (line 74).
- **`radix/docs/design/target-capability-matrix.md`** — **no** browser-product
  section in the current file (only WGSL-related "browser" mentions). Its
  Purpose statement (line 27) explicitly claims the matrix holds the "policy
  and contract layer (… browser packaging)". `git log --all -S 'Browser
  Application Product Packaging'` across all radix history → **zero hits**.
  `git log --all -S 'Browser Application'` → one hit, `1f339134a`, which is the
  faber-hir-v1 campaign "G10 — Browser Application Product Proof" header, not a
  matrix section.
  **Trace determination: the section was never written** (not renamed, not
  deleted). The WEB6 stage spec (`browser-application-delivery.md` WEB6) says
  "Update target capability/evidence docs … record navigation/router/SSR/Wasm
  deferrals" — that matrix update never landed; the README citation was written
  aspirationally at WEB6 closeout.
- **`radix/docs/factory/faber-hir-v1/browser-application-delivery.md`** — the
  authoritative browser-product claims doc (G10 "Browser Application Product
  H3"); WEB6 section records product claims, reciprocity intent, and deferrals.
- **`docs/campaigns/tela/CAMPAIGN-review-1.md`** — verdict: ready to lower
  Stage 0; three load-bearing items (generic-closure spike, repo existence,
  capability-doc owner) plus sequencing tensions (4–7) and smaller gaps (8–13)
  must resolve in Stage 0.
- **Concurrent worker**: hand-3 implements `faber-web` canvas2d Unit 0
  concurrently. Its write scope (`bindings/ts.toml`, `runtime/`, `src/`,
  `tests/`, `examples/`) does **not** include `README.md`, so U2's faber-web
  README edit does not collide — but both edits land in the same repo, so U2's
  Hand must path-limit commits and check for foreign staged paths before
  committing.

**Cargo discipline note**: no unit in this stage runs workspace cargo suites.
Validation is `radix check` / `radix emit` / `tsc --noEmit` / scratch-dir
`cargo check` (outside the shared workspace) / `git diff --check` only. Full
stages 4–6 and `--e2e` remain auditor-owned.

---

## Ordered Unit Graph

```
Wave 1 (parallel):  U0 ownership-identity   ∥   U1 capability-trace
Wave 2 (parallel):  U2 capability-repair (after U1)   ∥   U3 protocol-spike-branch (after U0)
Wave 3 (parallel):  U4 two-package-canary ─┐
                    U5 behavior-design     ├─ (all after U3)
                    U6 protocol-policies ──┘
```

No unit shares a write path with another. Waves enable 2-way then 2-way then
3-way parallelism; Mind may serialize if slot capacity prefers.

| # | Unit | Wave | Depends on |
|---|---|---|---|
| U0 | `tela-s0-u0-ownership-identity` | 1 | none |
| U1 | `tela-s0-u1-capability-trace` | 1 | none |
| U2 | `tela-s0-u2-capability-repair` | 2 | U1 |
| U3 | `tela-s0-u3-protocol-spike-branch` | 2 | U0 |
| U4 | `tela-s0-u4-two-package-canary` | 3 | U3 |
| U5 | `tela-s0-u5-behavior-design` | 3 | U3 |
| U6 | `tela-s0-u6-protocol-policies` | 3 | U3 |

---

## Units

### U0 — `tela-s0-u0-ownership-identity`

| Field | Value |
|---|---|
| `id` | `tela-s0-u0-ownership-identity` |
| `outcome` | Local ownership and identity locked: the `tela` repo is the Stage 1 cwd; working names `tela`/`tela` are the final package/provider identity unless the operator overrides before implementation; remote publication stays gated. Decision record written. |
| `write_scope` | `tela/docs/factory/mvp/stage-0-ownership.md` (new) |
| `read_scope` | `tela/docs/factory/mvp/CAMPAIGN.md` (Open Q1/Q2, Current State "Name and identity", line 185–186); `docs/campaigns/tela/CAMPAIGN-review-1.md` (item 2) |
| `done_when` | `stage-0-ownership.md` records: (a) `tela` repo = Stage 1 cwd; (b) locked identity table — repo `tela`, package `tela`, provider `tela` — with the explicit escape: working names remain final **unless** the operator overrides before implementation; (c) publication gate: no remote creation, no external package-name reservation, no release claims (campaign dependency rule 5); (d) disposition of campaign Open Q1 and Q2 with the chosen default. `CAMPAIGN.md` status line untouched. |
| `validation` | Reviewer re-reads the decision table against campaign Open Q1/Q2 and Current State "Name and identity" row; `git diff --check` in `tela/`. |
| `depends_on` | none |
| `non_goals` | No remote/publish action. No identity bikeshedding beyond the operator-override escape. No scaffold creation. |
| `risk` | **Low.** Only risk is an operator identity change, which the escape hatch covers by construction. |
| `est_work_tokens` | 1–3k |
| `test_owner` | Reviewer (stage closeout audit) — doc cross-check only. |

### U1 — `tela-s0-u1-capability-trace`

| Field | Value |
|---|---|
| `id` | `tela-s0-u1-capability-trace` |
| `outcome` | Dangling citation traced via `git log` + WEB6 evidence; determination recorded; authoritative browser-product capability document named; owning repair routed. (Planner trace, re-verified by the Hand.) |
| `write_scope` | `tela/docs/factory/mvp/stage-0-capability-reconciliation.md` (new) |
| `read_scope` | `radix/docs/design/target-capability-matrix.md` (read-only); `radix/docs/factory/faber-hir-v1/browser-application-delivery.md` (read-only); `faber-web/README.md` (read-only); read-only git history of `radix/` and `faber-web/` |
| `done_when` | Reconciliation doc records: (a) trace commands with real outputs — `git log --all -S 'Browser Application Product Packaging'` (zero hits → **never written**), WEB6 closeout commit `f36a67b` in `faber-web` (citation added 2026-07-17), and the second README anchor `§ Delivery Evidence` (file exists, no such heading; correct anchor = WEB6 section); (b) determination: missing Radix section, never written (not renamed, not deleted) — the WEB6 stage spec's "Update target capability/evidence docs" step never landed a matrix section; (c) authoritative doc named: `radix/docs/factory/faber-hir-v1/browser-application-delivery.md` § WEB6 "Product Claims And Reciprocity", with the matrix's Purpose statement (line 27) noted as claiming browser-packaging policy authority; (d) repair route named: **radix** owns materializing the "Browser Application Product Packaging" section in `target-capability-matrix.md`; **faber-web** owns fixing the two README citations. No capability claims broadened anywhere. |
| `validation` | Reviewer re-runs the two `git log -S` trace commands and reproduces zero-hit + `f36a67b`; doc content verified against `browser-application-delivery.md` WEB6. |
| `depends_on` | none |
| `non_goals` | Do not execute the repair here (that is U2). Do not edit radix/faber-web. Do not invent browser capability claims. |
| `risk` | **Low.** Pure evidence + decision artifact. |
| `est_work_tokens` | 1–3k |
| `test_owner` | Reviewer (re-runs trace commands); stage closeout audit. |

### U2 — `tela-s0-u2-capability-repair`

| Field | Value |
|---|---|
| `id` | `tela-s0-u2-capability-repair` |
| `outcome` | The mismatch is repaired: the matrix gains the missing browser-product packaging section (radix-owned, materializing WEB6 claims only), and both `faber-web/README.md` citations resolve to real anchors. |
| `write_scope` | `radix/docs/design/target-capability-matrix.md` (add one section); `faber-web/README.md` (fix the two citation anchors only) |
| `read_scope` | U1 reconciliation doc; `radix/docs/factory/faber-hir-v1/browser-application-delivery.md` WEB6 section |
| `done_when` | (a) `target-capability-matrix.md` gains a "Browser Application Product Packaging" section (or equivalently named section matching the README citation) stating, no more than WEB6 evidence: `web` package product ships HIR→TypeScript via faber packaging; provider `web` + `web:dom` live in the `faber-web` package; `ts` target stays `run=no`/`package=no`; browser behavior claims limited to WEB5 fixture evidence; deferrals (navigation/router/SSR/Wasm) recorded with reopen rules; (b) `faber-web/README.md` citations point at the new matrix section and at `browser-application-delivery.md` § WEB6 (or whole-doc link), both resolving; (c) `git diff --check` passes in `radix/` and `faber-web/`; no other edits. |
| `validation` | Both README links resolve to existing files + anchors; matrix section content cross-checked against the WEB6 delivery doc; `git diff --check` in both repos; radix stage-1 static gates still green (docs freshness — section is additive, no factory README/generator impact). |
| `depends_on` | U1 |
| `non_goals` | No new capability claims beyond WEB6 evidence. No radix code changes. No faber-web surface changes beyond README anchors. |
| `risk` | **Medium.** Cross-repo docs writes; must not broaden claims; must not break radix static gates; `faber-web` is concurrently edited by hand-3 — path-limit commits and never commit a foreign staged path. |
| `est_work_tokens` | 2–4k |
| `test_owner` | Reviewer (link resolution + claim-vs-evidence check); radix stage-1 gate is the automated backstop. |

### U3 — `tela-s0-u3-protocol-spike-branch`

| Field | Value |
|---|---|
| `id` | `tela-s0-u3-protocol-spike-branch` |
| `outcome` | Candidate protocol spike: the generic-recursive view values + a message-bearing closure component are checked through **both** the Rust and TypeScript lanes; evidence selects Branch A or rejects it in favor of Branch B; spike-quality static HTML/CSS proves representability. This is the hard gate that blocks Stage 1's `View` shape. |
| `write_scope` | `tela/spike/` (candidate Faber sources + `stage-0-branch-a-b-evidence.md`) |
| `read_scope` | Campaign §2–§4 sketches; `radix/EBNF.md` (generics/closures/genera/annotations); `radix/docs/design/target-capability-matrix.md` TS + Rust rows (what must survive); `faber-web/runtime/dom.ts` (read-only seam context) |
| `done_when` | (a) Candidate view values (recursive tagged union, open element model, typed `Identitas`, `Proprietas` separate from serialized `Attributa`, `Vinculum<Nuntius<Message>>` — names may differ, properties preserved per campaign §2) compile via `radix check`; (b) same source emits through the TS lane and emitted TS passes `tsc --noEmit`; (c) same source emits through the Rust lane and emitted Rust typechecks via a narrow scratch-dir `cargo check` outside the shared workspace (Cargo discipline); (d) spike-quality static HTML/CSS serialization proves representability (structural assertion only — not Stage 1's determinism gate); (e) `stage-0-branch-a-b-evidence.md` records per-lane results and the decision: Branch A retained, or Branch B selected with concrete reasons; (f) if the spike exposes a genuine cross-target Faber defect, a minimized compiler delivery is filed and the framework contract is NOT weakened to hide it (campaign stop condition 7). |
| `validation` | `radix check` green on spike sources; `radix emit -t ts` + `tsc --noEmit` green; `radix emit -t rust` + scratch-dir `cargo check` green; evidence doc reviewed for the Branch decision; no workspace cargo suites. |
| `depends_on` | U0 (spike package naming uses the locked identity) |
| `non_goals` | No production serializer, no determinism/double-build gate (Stage 1), no reference components, no `faber-web` or `radix` source edits, no async/fetch claims. |
| `risk` | **High.** The campaign's own biggest risk (generic recursive views + closure fields across targets). Everything downstream — Stage 1 `View` shape, U4–U6 — depends on this decision. |
| `est_work_tokens` | 6–10k |
| `test_owner` | Spike Hand runs the narrow checks; **independent audit owns the Branch decision** (campaign workflow step 6 requires review before accepting the stage). |

### U4 — `tela-s0-u4-two-package-canary`

| Field | Value |
|---|---|
| `id` | `tela-s0-u4-two-package-canary` |
| `outcome` | Two-package extension canary: an extension library package defines a custom view helper + namespaced theme token; an application package imports and consumes them in the benchmark panel/table/bar composition; the cross-package seam is proven without framework or compiler edits. |
| `write_scope` | `tela/spike/extension-lib/` (new Faber package), `tela/spike/canary-app/` (new Faber package), `tela/docs/factory/mvp/stage-0-canary.md` (record) |
| `read_scope` | Campaign §3/§9/§10 (first vertical proof must be two-package); U3's decided view shape |
| `done_when` | (a) `extension-lib` defines one custom view helper (returns the decided view values) + one namespaced token (e.g., `chart.axis.muted`) using public shape only — no Tela/radix/faber-web edits; (b) `canary-app` imports `extension-lib`, assembles the panel + two-column metric table + horizontal bar meter with label and textual value using the extension helper + token; (c) both packages pass `radix check`; (d) the actual two-package import/build check resolves the package boundary (campaign downstream validation: "an actual two-package import/build check for the extension canary"); (e) `stage-0-canary.md` records which extension seams were exercised and any gaps. |
| `validation` | `radix check` on both packages; import-resolution check; reviewer confirms `extension-lib` is a separate package (a same-file "extension" does not close the canary gate — campaign §3). |
| `depends_on` | U3 |
| `non_goals` | No behavior/mount in the canary (static composition only; interactivity is Stage 3). No catalog. No theme rendering. No `faber-web` or `radix` changes. |
| `risk` | **Medium.** This is the load-bearing early extension gate (review item 6). If the extension seam requires framework edits, that is the cheap failure this unit exists to catch — escalate to Mind, do not patch around it. |
| `est_work_tokens` | 5–8k |
| `test_owner` | Canary Hand (checks) + reviewer (package-boundary verification). |

### U5 — `tela-s0-u5-behavior-design`

| Field | Value |
|---|---|
| `id` | `tela-s0-u5-behavior-design` |
| `outcome` | Behavior design decided and recorded: an interactive segmented control described without compiler-specific UI meaning; the simple update strategy with first-class focus/scroll effects; the TS async gap recorded as an explicit Stage 3 input; the Tela→`WebController` mount relationship decided. |
| `write_scope` | `tela/docs/factory/mvp/stage-0-behavior-design.md` |
| `read_scope` | Campaign §6 (A/B/C branches + simple-update posture) and §7 (renderer contracts); `faber-web/README.md` (async gap note); U3 evidence (Branch decision) |
| `done_when` | Doc records: (a) segmented control interaction description — pointer + keyboard, selected state, `aria-selected`, declared live region — with no compiler-specific UI meaning (campaign gate bullet 4); (b) Branch decision carried from U3; (c) update strategy: rerender/replace an explicit mounted region after a message, with declarative host effects for focus restoration, focus movement, and scroll anchoring (review item 5); (d) the TS async gap — `@ futura` calls inside `fac`/`cape` blocks are not awaited — quoted and routed as an explicit Stage 3 input (review item 7; campaign §6); (e) mount relationship decision: default — Tela consumes `web:dom`/`WebController` through documented host seams; a general renderer-host interface is deferred until a second consumer asks (campaign Open Q4). |
| `validation` | Doc covers all five; reviewer cross-checks against campaign §6 branches and the `faber-web/README.md` gap note. |
| `depends_on` | U3 |
| `non_goals` | No segmented-control implementation (Stage 3). No async-gap fix (routed as compiler delivery). No `faber-web` host edits. |
| `risk` | **Low.** Design record only. |
| `est_work_tokens` | 2–4k |
| `test_owner` | Reviewer (cross-check). |

### U6 — `tela-s0-u6-protocol-policies`

| Field | Value |
|---|---|
| `id` | `tela-s0-u6-protocol-policies` |
| `outcome` | Protocol policies locked, not carried open: raw-markup posture, public API vocabulary policy, CSS value openness, stable-identity serialization decision, deterministic extension-ordering rule. |
| `write_scope` | `tela/docs/factory/mvp/stage-0-protocol-policies.md` |
| `read_scope` | Campaign §2/§4/§5; `docs/campaigns/tela/CAMPAIGN-review-1.md` items 4/8/9/10/11/13; U3 evidence |
| `done_when` | Doc records: (a) **raw-markup posture** — no raw `View` variant in v1; tag/attribute names lexically + namespace validated so `textus tag` cannot inject markup; any future raw escape is quarantined and absent from reference components (review items 9/10); (b) **vocabulary policy** — the documented split decision for campaign Open Q5 (Faber-Latin protocol internals vs English public vocabulary; `liberi` vs `children` consistency call); (c) **CSS value openness** — smallest honest CSS value model: typed constructors for common values, open custom-property names, namespaced library tokens, an explicit audited extension value; no ordinary component API accepting a whole raw stylesheet string (campaign Open Q3); (d) **identity serialization** — explicit typed `Identitas` field, serialized into static output in one documented hydration-ready form so Stage 3 has a contract to bind to (review item 4; feeds Stage 1 gate); (e) **deterministic extension ordering** — extension packages ordered by dependency-graph topological order, then stable package identity as tie-break; cycles and duplicate identities with different content reject — recorded as the locked rule the Stage 2 gate enforces (review item 8; campaign §4). |
| `validation` | Doc covers all five; reviewer cross-checks against review-1 items 4/8/9/10/11/13 and campaign §2/§4/§5. |
| `depends_on` | U3 |
| `non_goals` | No CSS engine, no theme implementation, no serializer, no validation registry. |
| `risk` | **Low.** Decision record only. |
| `est_work_tokens` | 2–4k |
| `test_owner` | Reviewer (cross-check). |

---

## Checkpoints And Gates

| Gate | After | Check |
|---|---|---|
| C1 — ownership + trace | U0 + U1 | Identity locked (operator-override escape documented); capability mismatch determined (never-written), authoritative doc named, repair routed. Stage 0 ready to spike. |
| C2 — branch decision | U3 | Cross-target evidence on disk; Branch A retained or B selected; spike-quality static representability proven. **Stage 1 `View` shape is blocked on this gate** (review item 1). |
| C3 — capability repaired | U2 | Matrix has the browser-product packaging section; both `faber-web/README.md` citations resolve; no claims broadened. |
| C4 — canary green | U4 | Two-package extension seam proven (custom helper + namespaced token consumed by a separate app package). |
| C5 — decisions closed | U5 + U6 | Behavior design + all protocol policies locked; nothing carried open into Stage 1 (campaign gate last bullet + review items 4/5/7/8/9/10/11). |
| Stage closeout | all | Campaign workflow step 6: review shared protocol changes with `consequences`, `correctness`, and an independent audit before accepting the stage. Closeout owns the `CAMPAIGN.md` status line and Stage 0 → Stage 1 selection. |

---

## Validation Summary

| Layer | Command / Flow | Covers |
|---|---|---|
| Spike semantics | `radix check` on `tela/spike/` sources | Candidate view values typecheck |
| TS lane | `radix emit -t ts` + `tsc --noEmit` | Branch A/B viability in TypeScript |
| Rust lane | `radix emit -t rust` + scratch-dir `cargo check` (outside shared workspace) | Branch A/B viability in Rust; no workspace lock |
| Canary | `radix check` both packages + two-package import/build check | Extension seam across package boundary |
| Capability repair | Link-resolution check; matrix section vs WEB6 evidence | Citation mismatch closed |
| Doc hygiene | `git diff --check` in `tela/`, `radix/`, `faber-web/` | Whitespace/conflict hygiene |
| Cargo discipline | No workspace cargo suites in any unit | Lock ownership (operator rule 2026-08-07) |

---

## Open Questions For Mind

| # | Question | Default | Who |
|---|---|---|---|
| Q1 | Should U2 (capability-repair execution) run in Stage 0, or defer the matrix section to Stage 8 ("target capability truth")? | Run in Stage 0 — cheap, and the campaign Current State row says "reconcile in Stage 0; do not broaden claims meanwhile" | Mind |
| Q2 | Identity: keep working names `tela`/`tela` as final unless the operator overrides? | Yes — U0 records the escape, no remote action | Mind (operator word) |
| Q3 | If the Branch spike exposes a genuine TS closure/generic defect, file the minimized compiler delivery to radix per campaign stop condition 7? | Yes — file the minimized delivery; do not weaken the framework contract | Mind |
| Q4 | Spike package naming/prefix convention under `tela/spike/` (e.g., `extension-lib` / `canary-app`)? | Follow locked `tela` identity; U3's Hand picks the prefix and states it | Hand |
| Q5 | Wave scheduling: run U0∥U1 then U2∥U3 then U4∥U5∥U6, or serialize when slot capacity is thin? | Waves as written; Mind schedules | Mind |

## Residuals (routed, not Stage 0 work)

- TS async `@ futura`/`fac`/`cape` codegen gap → Stage 3 input (U5 records it; radix compiler delivery when a minimized proof exists).
- Determinism double-build harness → Stage 1 (review item 13; campaign Validation).
- Capability-truth finalization → Stage 8 ("target capability truth" gate).
- Reference catalog, theme rendering, browser lifecycle → Stages 1–5.
