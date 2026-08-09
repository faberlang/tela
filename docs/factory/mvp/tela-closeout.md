# Tela Stage 0 — Closeout Record

**Status**: accepted (Stage 0 closeout complete; Stage 1 selected next)
**Closeout owner**: hand-4, 2026-08-09 (fleet task 7579f2d0, workflow step 6)
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` Stage 0 — "Protocol And
Ownership Contract"
**Delivery spec**: `tela/docs/factory/mvp/stage-0-delivery.md`
**Input units**: U0–U6 (all landed; commits verified below)

This record closes Stage 0: it records the five gates as satisfied with cited
artifacts, performs the campaign workflow step-6 review (consequences +
correctness + independent audit) **before** accepting the stage, records the
disposition, and carries residuals with owners. It makes no Stage 1
implementation claim and does not re-open the Branch B decision.

---

## 1. Gate record (all five gates satisfied)

| Gate | After | Cited artifact(s) | Evidence at closeout |
|---|---|---|---|
| **C1** — ownership + trace | U0 + U1 | `stage-0-ownership.md` (commit `5aa1181`); `stage-0-capability-reconciliation.md` (commit `5f884e4`) | Identity locked: repo/package/provider `tela`, repo = Stage 1 cwd, publication gated, operator-override escape documented (U0). Dangling citation traced: `git log --all -S 'Browser Application Product Packaging'` → zero hits → section **never written**; authoritative doc named (`browser-application-delivery.md` § WEB6); repair routed to radix + faber-web (U1). |
| **C2** — branch decision | U3 | `spike/stage-0-branch-a-b-evidence.md` (commit `79fe2fb`); `spike/visus-b.fab`; `spike/defects/d1-d3` | Branch A attempted and **rejected** — generic view values cannot be constructed in current ordinary Faber (defect D1, SEM010, all targets). Branch B selected: pure non-generic recursive `Visus` + adjacent typed behavior plan `Vinculum`. Per-lane evidence: `radix check` ok; TS emit + `tsc --noEmit` clean; Rust emit + scratch `cargo check` finished. Spike-quality static representability proven structurally (hand-traced, correctly labeled not-executed). |
| **C3** — capability repaired | U2 | radix `31b234671` ("materialize Browser Application Product Packaging section"); faber-web `0cd5a1a` ("fix README citation anchors") | Matrix gains `## Browser Application Product Packaging` (line 199), claims ≤ WEB6 evidence, no `Target::Web`, no codegen peer. Both `faber-web/README.md` citations resolve: `#browser-application-product-packaging` and `#web6--product-claims-and-reciprocity` (WEB6 heading verified at line 74). No capability claims broadened. |
| **C4** — canary green | U4 | `spike/extension-lib/` + `spike/canary-app/` + `stage-0-canary.md` (commit `ca4b845`) | Two **separate packages** (own dirs + `faber.toml`; `extensionlib` provider alias symlink under `spike/libhome/`). Extension defines custom helper `bar_metrum` + namespaced token `chart.axis.muted`; app imports via `provider:module`, assembles panel + metric table + bar meter. `radix check` ok on both packages at the canary closeout; package boundary resolved through `FABER_LIBRARY_HOME`. No framework/compiler edits needed. |
| **C5** — decisions closed | U5 + U6 | `stage-0-behavior-design.md` (commit `cad1831`); `stage-0-protocol-policies.md` (commit `965abb2`) | Behavior design: segmented control contract without compiler-specific UI meaning; simple rerender/replace update strategy with host effects; TS async `@ futura` gap recorded as Stage 3 input; mount decision (Tela consumes `web:dom`/`WebController` via documented host seams). Policies locked: raw-markup posture, vocabulary split, CSS value openness, `Identitas` serialization (`data-tela`), deterministic extension ordering. No campaign Stage 0 gate bullet left carried open. |

Commit base verified in `tela/` git log: `5aa1181` (U0), `5f884e4` (U1),
`31b234671`/`0cd5a1a` (U2, cross-repo), `79fe2fb` (U3), `ca4b845` (U4),
`cad1831` (U5), `965abb2` (U6).

---

## 2. Workflow step-6 review (before accepting the stage)

Per the campaign workflow: "Review shared protocol changes with
`consequences`, `correctness`, and an independent audit before accepting the
stage." The shared protocol surface under review is the **Branch B `View`
shape** (non-generic, identity-keyed) plus the **five policy locks** and the
**compiler-gap routing**.

### 2.1 Consequences lens

What accepting these decisions changes downstream:

1. **Branch B `View` shape** — Stage 1's kernel contract is a pure
   non-generic recursive tagged union; the kernel owns constructors. No
   generic-construction dependency is frozen into the contract. Branch A
   remains the ideal end-state and is re-spiked only when radix delivery D1
   lands (recorded below), not blocking.
2. **Policy locks gate later stages directly** — raw-markup posture and
   identity serialization (`data-tela`, one documented hydration-ready form)
   are Stage 1 gate inputs; CSS value openness feeds Stage 2; deterministic
   extension ordering is the rule Stage 2's gate enforces; the vocabulary
   split (Faber-Latin internals / English public) is a public-API discipline
   from Stage 1 onward.
3. **Compiler-gap routing is the honest path** — D0–D3 + G1–G6 are radix-lane
   minimized-delivery candidates. Stage 0 made **no** framework-contract
   weakening to hide them. The canary's flat-module authoring rule (G4
   workaround) becomes a Stage 1 authoring constraint until G4 lands — a
   bounded, documented cost, not a permanent design limitation.
4. **Capability truth** — the repaired matrix section must not be broadened
   beyond WEB6 evidence; any future browser-packaging claim re-opens the
   matrix (Stage 8 finalization). This is a constraint, and it is intended.
5. **Identity + publication** — repo/package/provider `tela`, remote
   publication still gated. No consequence for existing repos: `faber-web`
   and `radix` public surfaces were untouched by Stage 0 (U2 edits are
   documentation anchors only).

No accepted decision forces a later-stage rework; the two re-open conditions
(Branch A re-spike, capability-truth finalization) are explicitly scheduled.

### 2.2 Correctness lens

1. **Branch decision is evidence-faithful** — Branch A rejected only on the
   demonstrated D1 construction failure (repros on disk), not on preference;
   Branch B's candidate passed all three lanes; representability is labeled a
   structural assertion, not executed output — the correct epistemic claim.
2. **Capability determination matches history** — zero-hit `git log -S`,
   `f36a67b` WEB6 closeout, and the missing-heading anchor are all consistent
   with "section never written"; the authoritative doc is named; owners match
   source-of-record (radix owns the matrix, faber-web owns its README).
3. **No claim broadening** — matrix section restates WEB6 evidence only; U1
   explicitly records "no capability claim beyond WEB6"; canary record
   respects non-goals (no theme rendering, no behavior/mount).
4. **Canary closes the load-bearing gate honestly** — separate packages, real
   `provider:module` import resolution, custom helper + namespaced token
   consumed across the boundary; the G1–G6 seams are recorded as constraints,
   not hidden.
5. **Decisions, not deferrals** — every Stage 0 gate bullet and review-1
   load-bearing item (identity, focus, ordering, async, early-extension) has a
   recorded resolution; residuals below are routed work items, not open
   decisions.

### 2.3 Independent audit pass

Auditor: hand-4 (independent of the implementing hands hand-6/hand-7). Desk
verification only — no workspace cargo suites, no re-run of the units'
validation commands (they are recorded in each unit's closeout sections).

- **Commits match the unit manifest** — all seven unit commits verified in
  `tela/` git log; U2's cross-repo commits verified in `radix/` and
  `faber-web/`.
- **Artifact existence** — all six `stage-0-*.md` records present under
  `tela/docs/factory/mvp/`; spike sources + defect repros present under
  `tela/spike/`; `extension-lib` and `canary-app` are separate packages
  (distinct `faber.toml`); `libhome/extensionlib` symlink resolves.
- **Anchor resolution (C3)** — matrix section heading at line 199 matches the
  README link anchor; WEB6 heading at line 74 of
  `browser-application-delivery.md` matches the second anchor.
- **Canary package boundary (C4)** — `extension-lib` declares
  `[library] provider = "extensionlib"`, `[build] kind = "lib"`; `canary-app`
  declares `[build] kind = "app"` and imports through the provider alias —
  same-file "extension" does not close the gate; the gate is closed.
- **Repo hygiene** — `tela/` git status clean at review time; `git diff
  --check` clean at closeout (recorded below); no foreign staged paths in
  this commit.
- **Factory inventory** — `tela/docs/factory/README.md` does not exist, so
  there is nothing to regenerate. The radix goal-status audit run against
  `tela/docs/factory` reports **0 findings** (goals_scanned 0 — the tool
  discovers `*/goal.md`/`*/GOAL.md` only; tela's inventory is per-stage
  `CAMPAIGN.md`, see observation O1 in §3).
- **Cargo discipline** — no cargo invocation by this closeout; validation is
  doc/command-level only.

### 2.4 Disposition

**Stage 0 is ACCEPTED.** All five gates satisfied with cited artifacts; the
step-6 review found no blocking finding. Observation O1 (§3) is informational,
no owner action required.

---

## 3. Findings and observations

| # | Severity | Item | Owner |
| --- | --- | --- | --- |
| F1 | none | No blocking findings from the consequences, correctness, or independent audit passes. | — |
| O1 | info | The radix factory goal-status tooling discovers `*/goal.md`/`GOAL.md` only; tela's stage inventory lives in per-stage `CAMPAIGN.md` sections, so the tool reports 0 goals / 0 findings for `tela/docs/factory`. `tela/docs/factory/README.md` does not exist, so no README regeneration applies. Informational — no action required at closeout; Mind may route a tela-scoped inventory convention later. | Mind (route only) |

---

## 4. Residuals and owners

| Residual | Routed to | Notes |
| --- | --- | --- |
| D0–D3 compiler deliveries (generic type alias binding, generic construction, TS `tag` discriminant, Rust nullable-`Some` wrap) | **radix lane** (Mind routes; repros under `tela/spike/defects/`) | None block Branch B; D1 is the Branch A re-spike precondition. |
| G1–G6 canary gaps (imported enum member access, named type imports, imported-union variant construction, export-snapshot skip, enum member name binding, reserved keyword collisions) | **radix lane** (Mind routes minimized deliveries) | Constrain extension-package authoring surface; flat-module rule is the Stage 1 safe shape until G4 lands. |
| TS async `@ futura` in `fac`/`cape` not awaited | **Stage 3 input** (recorded in `stage-0-behavior-design.md`) | Explicit Stage 3 contract input, not a Stage 1 fix. |
| Branch A re-spike | **Stage 1 kernel decision point** (after radix D1 lands) | Branch B is frozen for Stage 1; re-spike only on D1 delivery. |
| Determinism double-build harness | **Stage 1** | Campaign validation; out of Stage 0 non-goals. |
| Capability-truth finalization | **Stage 8** | Matrix section stays WEB6-bounded until then. |
| Reference catalog, theme rendering, browser lifecycle | **Stages 1–5** | By campaign ordering. |
| Faber dialect / authoring notes (flat provider modules, enum-member top-level binding, reserved keyword spellings, exempla-mode surface) | **Stage 1 docs/AGENTS.md** | Carried from U3/U4 evidence so Stage 1 authors hit a proven surface. |

## 5. Stage 1 readiness note

Stage 1 ("Tela Kernel And Static Renderer") is selected next and is ready to
lower. Inputs frozen by this closeout:

- **`View` shape** derives from **Branch B** — pure non-generic recursive
  tagged union, open element model, typed `Identitas` serialized as
  `data-tela`, `Proprietas` separate from serialized `Attributa`, behavior
  carried by typed `(Eventum) → Nuntius` closures keyed to stable identities.
  **Non-generic**; kernel owns constructors.
- **D0–D3 compiler deliveries** (generic type alias binding, generic user-type
  construction, TS `tag` discriminant collision, Rust nullable-`Some` wrap)
  are recorded as the **radix-lane input**, each with a minimized repro under
  `tela/spike/defects/`.
- **G1–G6 canary gaps** are recorded as the radix-lane input for
  extension-authoring surface; the flat-module provider rule is the safe
  Stage 1 authoring shape.

## 6. Closeout validation (one run)

```text
grep -n '^\*\*Status\*\*' docs/factory/mvp/CAMPAIGN.md   # status lines machine-parseable (Stage 0 accepted; Stage 1 selected next)
# this file present with the three review lenses (consequences / correctness / independent audit) + disposition
git diff --check                                        # clean
```

Results at closeout: status lines present and machine-parseable; review
record present with all three lenses and disposition; `git diff --check`
clean. Commit: see closeout commit message for the validation claim.
