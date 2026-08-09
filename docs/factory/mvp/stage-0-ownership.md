# Stage 0 — Ownership And Identity Lock

**Status**: active (decision record for Stage 0 U0)
**Unit**: `tela-s0-u0-ownership-identity`
**Hand**: hand-6, 2026-08-09
**Delivery spec**: `stage-0-delivery.md` U0
**Campaign**: `CAMPAIGN.md` Stage 0 gate bullet 5 ("local ownership is
resolved … final package/provider naming is locked before implementation, and
no remote/publication action is implied"); Current State row "Name and
identity"; dependency rule 5.
**Review reconciliation**: `docs/campaigns/tela/CAMPAIGN-review-1.md` item 2
(Stage 1 has no cwd) — resolved here as a Stage 0 precondition.

This record locks local ownership and public identity for Stage 1. It makes
**no** remote, publication, or release claim (see §3).

---

## 1. Repo = Stage 1 cwd

- The local Git repo at **`/Users/ianzepp/work/faberlang/tela`** (sibling
  control-plane repo, `main` branch, existing) is the **Stage 1 working cwd**.
- Stage 1 ("Tela Kernel And Static Renderer") lowers into this repo and
  produces its package tests here. No temporary home is needed.
- This resolves `CAMPAIGN-review-1.md` item 2 ("Stage 1 has no cwd — repo
  existence is unresolved"): the repo already exists and is now the named
  Stage 1 home.
- No scaffold is created by this unit; this record only names ownership.

## 2. Locked identity table

The working names `tela` / `tela` are **locked as final** for Stage 1
implementation:

| Surface | Working name | Final identity |
|---|---|---|
| Repository | `tela` | `tela` (this repo, `/Users/ianzepp/work/faberlang/tela`) |
| Package | `tela` | `tela` (product/package name used in spike sources and later package tests) |
| Provider | `tela` | `tela` (Tela's own provider surface, analogous to `web` in `faber-web`) |

**Operator-override escape (explicit):** these names remain final **unless the
operator overrides them before Stage 1 implementation begins**. No identity
bikeshedding happens beyond recording this escape; if the operator changes any
name, this table is updated by the stage closeout, not re-litigated per unit.

## 3. Publication gate

External publication and release effects stay **gated** (campaign dependency
rule 5: "Do not publish or reserve external repository/package names until the
operator confirms the final identity and publication action"):

- **No remote creation** — no git remote is added to this repo.
- **No external package-name reservation** — no external registry name is
  claimed, reserved, or registered.
- **No release claims** — no versioning, release notes, or product-release
  claims are made anywhere by this unit or Stage 0.
- A release/publication decision is a **Stage 8** gate ("Hardening,
  Documentation, And Release Decision") requiring operator authorization.

## 4. Disposition of campaign Open Q1 and Q2

| Campaign Open Q | Disposition | Chosen default |
|---|---|---|
| **Q1** — Does the final public identity remain **Tela**, and are repo/package/provider names all `tela`, or does the repository use a longer disambiguating name? | **Closed by this unit.** Final public identity remains **Tela**; repo/package/provider are all `tela` (table in §2). No longer disambiguating name. Escape: operator override before Stage 1 implementation (§2). | **Tela; all three surfaces `tela`** — matches the campaign "Working name: Tela" and the already-initialized `tela` repo. |
| **Q2** — Can `View<Message>` and event-producing closures compile honestly across the required Rust and TypeScript lanes, or should behavior use an adjacent plan? | **Deferred to U3 (`tela-s0-u3-protocol-spike-branch`)** as a hard Stage 0 gate, per campaign Stage 0 gate bullet 2 and `CAMPAIGN-review-1.md` item 1. Not decided here. Stage 1's `View` shape is blocked on U3's cross-target evidence. | **Branch A (typed messages) as lead**, Branch B (adjacent behavior plan) as fallback if the spike exposes a real language boundary, Branch C as a low-level `faber-web` host capability only (campaign §6 provisional decision). U3 records the evidence-based decision; the framework contract is never weakened to hide a cross-target defect. |

## 5. Non-goals and scope guard

- No remote/publish action (see §3).
- No identity bikeshedding beyond the operator-override escape.
- No scaffold creation.
- `CAMPAIGN.md` status line untouched — owned by the Stage 0 closeout, not by
  any Stage 0 unit.

## 6. Validation

- Reviewer re-reads the §2 decision table against campaign Open Q1/Q2 and the
  Current State "Name and identity" row ("Local `tela` repo exists on `main`;
  package/provider remain working names → Stage 0 locks package/provider and
  final public identity; remote publication remains gated").
- `git diff --check` in `tela/` passes.
