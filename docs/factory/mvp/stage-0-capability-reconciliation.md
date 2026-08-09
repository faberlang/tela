# Stage 0 — Capability Citation Trace And Determination

**Status**: active (evidence/decision record for Stage 0 U1)
**Unit**: `tela-s0-u1-capability-trace`
**Hand**: hand-7, 2026-08-09
**Delivery spec**: `stage-0-delivery.md` U1
**Campaign**: `CAMPAIGN.md` line 133 and Stage 0 gate bullet 4 ("reconcile the
capability docs"); Current State row "Capability truth" ("the
`faber-web/README.md` cites a `target-capability-matrix.md` section that does
not exist — reconcile in Stage 0; do not broaden claims meanwhile").

This record traces the dangling `faber-web/README.md` citation, determines how
the missing Radix capability section came to be absent, names the authoritative
browser-product capability document, and routes the repair. It makes **no**
capability claim beyond what the WEB6 evidence already records (§5).

---

## 1. Trace commands and real outputs

All commands re-run by this Hand on 2026-08-09 against the live repos. No
output below is paraphrased from the planner; each is a fresh run.

### 1.1 `git log --all -S 'Browser Application Product Packaging'` (in `radix/`)

```bash
$ git log --all -S 'Browser Application Product Packaging' --oneline
(no output — 0 commits)
```

**Result: zero hits across all of radix history.** The exact heading string
`Browser Application Product Packaging` has never appeared in any commit in the
radix repository — never in the current tree, never in any reachable branch or
tag. The section that `faber-web/README.md` cites was **never written**.

### 1.2 Context trace: `git log --all -S 'Browser Application'` (in `radix/`)

```bash
$ git log --all -S 'Browser Application' --oneline
1f339134a docs(hir-v1): prebuild implementation delivery queue
```

The single hit `1f339134a` is the **faber-hir-v1 campaign header** `## G10 —
Browser Application Product Proof` in `IMPLEMENTATION-GOALS.md`, not a
target-capability-matrix section. It confirms the only "Browser Application"
wording in radix history is the goal header, not the cited matrix section.

### 1.3 WEB6 closeout commit `f36a67b` (in `faber-web/`)

```bash
$ git show --stat f36a67b --format='%H%n%an%n%ad%n%s'
f36a67b5f8bfe53ea4d57fdfba3e93fc68ea5a50
Ian Zepp
Fri Jul 17 19:50:54 2026 -0400
docs: WEB6 delivery status — per-stage table, evidence links, known gap

 README.md | 21 +++++++++++++++++++++
 1 file changed, 21 insertions(+)
```

Commit `f36a67b` ("docs: WEB6 delivery status", authored 2026-07-17) is the
WEB6 closeout record in `faber-web/`. Its `README.md` diff adds the
`## Delivery status (G10 WEB1–WEB6)` section and the two citations:

1. `radix/docs/design/target-capability-matrix.md` **§ Browser Application
   Product Packaging**
2. `radix/docs/factory/faber-hir-v1/browser-application-delivery.md`
   **§ Delivery Evidence**

### 1.4 Second README anchor: `§ Delivery Evidence` dangles

The cited file
`radix/docs/factory/faber-hir-v1/browser-application-delivery.md` **exists**
(126 lines, WEB1–WEB6 stage graph), but it has **no heading containing
"Delivery Evidence"** — verified by `grep -n 'Delivery Evidence'` → exit 1 (no
match). The **correct anchor** is the WEB6 stage-section heading:

```bash
$ grep -n 'WEB6 — Product Claims' docs/factory/faber-hir-v1/browser-application-delivery.md
74:### WEB6 — Product Claims And Reciprocity
```

So the `§ Delivery Evidence` fragment is a **dangling anchor**: the file it
points to exists, but the section it names does not. The intended anchor is the
WEB6 section `### WEB6 — Product Claims And Reciprocity` (line 74), which is
the closestable evidence section for the WEB6 delivery-status row.

### 1.5 Current matrix state (in `radix/`)

```bash
$ grep -n 'Browser Application' docs/design/target-capability-matrix.md
(no output — exit 1)
```

The current `target-capability-matrix.md` has **no** `Browser Application
Product Packaging` section. The only "browser" mentions in the file are
WGSL/WebGPU-related rows (`wgsl-text` contract, WebGPU device-route Proof
rungs), not a browser-product-packaging policy section.

---

## 2. Determination: missing Radix section, never written

**Determination: the cited `target-capability-matrix.md` § "Browser
Application Product Packaging" was never written — it was not renamed and not
deleted.**

Evidence for never-written (as opposed to renamed/deleted):

- `git log --all -S 'Browser Application Product Packaging'` returns **zero
  hits** across all of radix history (all branches, all tags). A renamed or
  deleted section would still surface in history via `-S` on the distinctive
  heading string. Nothing was ever added, moved, or removed under that name.
- The WEB6 stage spec (`browser-application-delivery.md`, lines 76–78)
  instructs: "Update target capability/evidence docs, classify Rust/Go
  effects, and record navigation/router/SSR/Wasm deferrals with reopen rules."
  That WEB6 "Update target capability/evidence docs" step **never landed a
  matrix section**.
- The `f36a67b` WEB6 closeout README entry (2026-07-17) wrote the citation
  **aspirationally** at closeout — pointing at a matrix section it assumed
  would exist, while the actual WEB6 evidence (the delivery doc) was recorded
  in a different file than the citation points to for the *second* link, and
  the *first* link's target section was never created.
- The matrix's own Purpose blockquote (line 27) claims the matrix holds the
  "policy and contract layer (… browser packaging)" — i.e., the matrix *should*
  have held this section per its own charter, but the section was never
  materialized there.

---

## 3. Authoritative doc named

The **authoritative browser-product capability document** is:

> **`radix/docs/factory/faber-hir-v1/browser-application-delivery.md`**
> **§ WEB6 — Product Claims And Reciprocity** (line 74)

This is the G10 "Browser Application Product H3" delivery doc (source goal
[`IMPLEMENTATION-GOALS.md#G10`](../../../radix/docs/factory/faber-hir-v1/IMPLEMENTATION-GOALS.md#g10--browser-application-product-proof),
line 303). Its WEB6 section is the stage gate that records product claims,
reciprocity intent (update target capability/evidence docs, classify Rust/Go
effects), and deferrals (navigation/router/SSR/Wasm) with reopen rules. It is
the **only** browser-product capability claims record that actually exists.

**Matrix Purpose note:** `target-capability-matrix.md`'s Purpose statement
(line 27) claims the matrix is the home of the "policy and contract layer
(erase/warn/defer verbs, pipeline routing, per-target runtime contracts,
browser packaging)". That charter gives the *matrix* a policy-authority claim
over browser packaging — which is exactly why the missing section is a real
gap, not a cosmetic link break. The repair must reconcile the matrix's claimed
authority with the WEB6 evidence (U2). Until then, WEB6 in the delivery doc is
the authoritative *content*, and the matrix's Purpose line is the authoritative
*place* where that content is supposed to live.

---

## 4. Repair route

Two owners, one repair each. **This unit does not execute the repair — U2
(`tela-s0-u2-capability-repair`) does**, after this trace lands.

| # | Owner | Repair |
|---|---|---|
| 1 | **radix** | Materialize a `Browser Application Product Packaging` section in `radix/docs/design/target-capability-matrix.md` (matching the README citation), stating **no more than WEB6 evidence**: `web` package product ships HIR→TypeScript via faber packaging; provider `web` + `web:dom` live in the `faber-web` package; `ts` target stays `run=no`/`package=no`; browser behavior claims limited to WEB5 fixture evidence; deferrals (navigation/router/SSR/Wasm) recorded with reopen rules. |
| 2 | **faber-web** | Fix the two README citations in `faber-web/README.md` (lines 39–40): point the first link at the new (radix-materialized) matrix section, and fix the second link's anchor from the dangling `§ Delivery Evidence` to the real `§ WEB6 — Product Claims And Reciprocity` (or a whole-doc link). |

Both repair surfaces are constrained to **no new capability claims beyond WEB6
evidence** — the same limit this trace observes.

---

## 5. Non-goals and scope guard

- **No repair executed here** — the matrix section and README citation fixes
  are U2's write scope (`radix/docs/design/target-capability-matrix.md`,
  `faber-web/README.md`).
- **No edits to radix or faber-web by this unit** — this doc is written only
  into `tela/` (read-only access to the other two repos).
- **No capability claims broadened** — nothing in this trace asserts browser
  product capability beyond what the WEB6 delivery doc already records.
- `CAMPAIGN.md` status line untouched — owned by the Stage 0 closeout.

---

## 6. Validation

- Reviewer re-runs the two `git log -S` trace commands and reproduces the
  zero-hit result (§1.1) and the `f36a67b` WEB6 closeout commit (§1.3).
- This doc's content verified against `browser-application-delivery.md` WEB6
  section (line 74) — the authoritative doc named in §3.
- `git diff --check` in `tela/` passes.
