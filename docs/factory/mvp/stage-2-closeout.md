# Tela Stage 2 — Closeout Record

**Status**: delivered (Stage 2 closeout complete; Stage 3 selected next)
**Closeout owner**: hand-7, 2026-08-09 (fleet task d0175e1a, workflow step 6)
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` Stage 2 — "Style And Theme
Protocol"
**Delivery spec**: `tela/docs/factory/mvp/stage-2-delivery.md`
**Input units**: U1–U5 (all landed; commits verified below), plus the
U5-caught U2 assemble fail-closed repair (same commit `c8f1c91`)

This record closes Stage 2: it records the five gates as satisfied with cited
artifacts, records the escalations routed to the radix lane (and the one
fail-closed hole the Stage 2 runtime gate caught and closed at the source),
and hands the independent verification to the reviewer/auditor (the named
test owner for `check-determinism`). The campaign's own acceptance remains
the campaign's step-6 decision; this record prepares it. It makes no Stage 3
implementation claim.

---

## 1. Gate record (all five gates satisfied)

| Gate | After | Cited artifact(s) | Evidence at closeout |
|---|---|---|---|
| **SG1** — theme/token protocol | U1 (`e194621`) | `src/tela.fab` (`Scopulum`/`Thema` + core baseline + `thema_css`/`thema_stilum`); `exempla/thema.fab` | Kernel-owned token/theme values (`Scopulum { nomen, valor }` U5-proven spelling, `Thema { nomen, scopuli }`, ordinary-function constructors); the 8-token core baseline pinned in the module header (required set, not a closed enum — policy (c)); rendering convention locked (dotted path → `--dashed` custom property at the `:root` selected root); fail-closed (`thema_css`/`thema_stilum` → `∪ null`: missing required token / invalid token name / duplicate-identity-different-content reject); deterministic bytes. Verbs collision-free (probed on in-tree radix 0.80.0). |
| **SG2** — assembly + cascade | U2 (`bd3130e`) | `src/tela.fab` (`assemble` + `Codicillus`/`Ordo`); `exempla/assemble.fab` | `assemble(...) → Stilum ∪ null` pure over explicit inputs; cascade layers in §4 order (reset opt-in → tokens → components → libraries topo → application); bundle dedup by stable identity (identical dedup / different-content reject); topo order + stable-identity tie-break (policy (e)); fail-closed rejects (cycles, unknown deps, duplicate identities, invalid rule shape). Exercised by the assemble exempla (dedup, topo, tie-break, cycle, dup-diff-content, layer order with/without reset, invalid rule). |
| **SG3** — two-theme composition | U3 (`ee2abb0`) | `proof/benchmark/{extension-lib,canary-app}/`; `stage-2-two-theme-composition.md` | The **same component tree** (the Stage 1 U5 arbor — unchanged) renders under two materially different themes (`lumen`/`tenebrae`) with no component changes; namespaced extension tokens (`chart.axis.muted`, `chart.grid.muted`) collected app-side + rendered (gate bullet 2, G4-independent). The TS-lane runner **executed under `node` (exit 0)**: `html_a ≡ html_b` byte-identity asserted, `css_lumen ≠ css_tenebrae` asserted. Outputs captured in the evidence record. |
| **SG4** — docs | U4 (`3b0b8c4`) | `docs/design/theme-protocol.md`; `AGENTS.md` | Theme/token/assembly protocol documented (rendering convention, core baseline, `Thema` contract, extension seam, cascade layers, `fix:<id>` discipline); docs reconciled against the landed U1 emission. |
| **SG5** — harnesses + determinism | U5 (`c8f1c91`) | `scripta/{check-exempla,check-determinism}`; `stage-2-determinism.md` | **Runtime gate closed (residual R1)**: every exempla executes its assembled TS under `node` — assertions run. `check-determinism`: the two-theme composition builds **twice and is byte-for-byte identical** — sha256 `3d22b9c7d17cbc938e34e544458d931c3393ae1ee5711cf2221f85492048340a` on both captures; a diff FAILS the check (fail-closed); `build/hashes.txt` recorded. Commands + output description in the evidence record. |

Commit base verified in `tela/` git log: `e194621` (U1), `bd3130e` (U2),
`ee2abb0` (U3), `3b0b8c4` (U4), `c8f1c91` (U5 + the assemble repair).

---

## 2. The U5-caught U2 repair (fail-closed hole closed at source)

The Stage 2 runtime gate (U5) immediately proved its value: the first
runtime run of the assemble exempla exposed a **real U2 `assemble`
fail-closed hole** — the components/library bundles were not rule-shape
validated, so a bundle carrying an empty selector passed through to
emission, contradicting U2 done_when (d) ("invalid rule/declaration output
rejects before emission"). The fix (same commit `c8f1c91`): `assemble` now
runs `stilum_validum` over the components and library bundles before
emission (the reset and application bundles were already validated). The
exempla assertions were runtime-correct; the source was the defect — the
"fail honestly, fix the source or the assert" path the delivery anticipated.
All four exempla (validation / serializer / thema / assemble) pass the
runtime gate.

## 3. Escalation statuses (radix lane — recorded, not fixed here)

| Defect | Marker | Status at Stage 2 closeout |
| --- | --- | --- |
| File-interface snapshot nomen collision (extension-local class sharing a kernel type name → WARN014 cascade; local class names not nameable qualified types) | `fix:snapshot-nomen-collision` | **New (U3)**, routed to the radix lane; workaround in place (extension class renamed `Scopulus`; field-access-on-call consumption) — removal = grep-replace after the fix |
| CODEGEN001 — Rust emit-across-imports (provider-module locale propagation) | `fix:codegen001` | Re-confirmed at U5; the Rust lane is attempted + recorded each unit; the TS lane is the proven lane; R2 (Rust-sha-equality) activates when the fix lands |
| G4 — cross-package Visus-returning helper export skip (WARN014) | `fix:g4` | **Compose-without held** throughout Stage 2: the extension contributes tokens + style bundles; the app composes with `tela` constructors; the token surface is G4-independent (gate bullet 2 closed without the fix) |
| G5 — `html` verb collision (Spatium.html binding) | `fix:g5` | Workaround held (`html_visus`); Stage 2 verbs (`thema`, `scopulum`, `thema_css`, `assemble`) verified collision-free — no new marker |
| TS-emitter — backslash double-escape (+ U3's elif/ownership observations) | `fix:ts-emitter` | Re-observed (literal `\n` in the CSS bytes; deterministic); workarounds held |

## 4. Reviewer / auditor handoff

The independent verification belongs to the Stage 2 review (Mind routes the
auditor, per the workflow step-6 gate):

- **`check-determinism` re-run** (the named test owner): re-run once; both
  builds must be byte-identical and the sha must equal
  `3d22b9c7…8340a`; a diff FAILS the check.
- **`check-exempla` re-run**: the runtime gate (all four exempla execute
  their assertions under `node`).
- **Step-6 review lenses**: consequences (the theme/assembly protocol is now
  the Stage 3/4 authoring surface), correctness (the gates vs the delivery
  spec + the U5-caught repair), and the independent audit.
- Acceptance flips the leading clause (currently `active`, pending step-6)
  and selects Stage 3.

## 5. README + audit state

- `docs/factory/README.md` regenerated (generator idempotent; `--check`
  green).
- Factory goal-status audit (`--factory-root docs/factory`): **0 findings**
  (the tool scans `*/goal.md`/`GOAL.md`; tela's inventory is the per-stage
  `CAMPAIGN.md`, which this closeout updated — informational, consistent with
  the Stage 0 closeout observation O1).
- `git diff --check` clean.

## 6. Closeout validation (one run)

```text
python3 ../radix/scripta/generate-factory-readme.py --factory-root docs/factory  # regenerated
../radix/scripta/check-factory-goal-status --factory-root docs/factory           # 0 findings
python3 ../radix/scripta/generate-factory-readme.py --factory-root docs/factory --check  # green (not stale)
grep -n '^\*\*Status\*\*' docs/factory/mvp/CAMPAIGN.md   # Stage 2 delivered; Stage 3 selected next
git diff --check                                        # clean
```

## 7. Residuals and owners

| Residual | Routed to | Notes |
| --- | --- | --- |
| `fix:snapshot-nomen-collision` | **radix lane** (Mind routes) | NEW (Stage 2 U3); grep-replace removal after the fix |
| CODEGEN001 + G4 + G5 + TS-emitter fixes | **radix lane** (Mind routes) | Workaround markers held; the R2 Rust-sha-equality check activates on the CODEGEN001 fix |
| Step-6 acceptance + the leading-clause flip | **Stage 2 review** (Mind routes the auditor) | `check-determinism` re-run + `check-exempla` re-run + consequences/correctness/audit lenses |
| Stage 3 lowering | **Stage 3** (planner; next per the campaign stage list) | Browser mount + update lifecycle — consumes the locked theme/assembly/token surfaces through public contracts |
| Independent-extension proof | **Stage 4** | Consumes the locked Stage 2 surfaces through public contracts only |
| Stage 2 → 3 selection | **Mind** | Per the campaign stage list (Stage 3 "Browser Mount And Update Lifecycle" is next) |

No Stage 3 implementation is claimed here; no CAMPAIGN.md leading-clause
game (the clause stays `active` pending step-6); no goal archive moves
(Mind owns).
