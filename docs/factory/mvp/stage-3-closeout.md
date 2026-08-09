# Stage 3 — Closeout Record (browser mount + update lifecycle)

**Status**: active (closeout evidence production; the CAMPAIGN.md stage-line
status + acceptance flip + Stage-4 selection remain **Mind-routed** — D3)
**Closeout owner per the delivery**: workflow step 6 (consequences +
correctness + independent audit) — this record is the **evidence
production** pass (hand-7, the harness author), feeding that review.
**Sequence**: all Stage 3 units landed — U1 `4ca331a`, U2 `9f23095`,
U3 `27aa181`/`c182688`, U4 `91160c9`, docs `4373dc7` + `70c1fe6`; fire-10
integrated (auditor-4 residual — 3 closeout-owned P2s verified); this
record lands with the closeout commit (see the tela log).
**Sources**: the delivery spec `stage-3-delivery.md` (U1–U5 done_when;
Checkpoints And Gates SG1–SG5; Validation Summary), the landed emissions
(`src/browser.fab`, `src/tela.fab`, `proof/benchmark/canary-app/src/main.fab`,
`scripta/dom-shim.ts`), the design record `docs/design/browser-lifecycle.md`,
the unit evidence records (`stage-3-segmented-control.md`,
`stage-3-mount-determinism.md`), the U3 conformance notes (§8), and the
fire-9/auditor-4 residuals routed into this pass.

---

## 1. CTO9-3 conformance check — the emitted U2/U3 surface vs the design
record + delivery spec (item by item)

| # | Item | Verified | Evidence |
| --- | --- | --- | --- |
| 1 | **Seam call shape** — `mount(Scope, Visus, Thema) → Mounted ∪ null`; `replace(Mounted, Visus) → Renovatio ∪ null`; `dispose(Mounted) → void` | **Yes** | `src/browser.fab:405/468/484` (exact signatures); the `dom.Scope`→`Scope` fallback + `vacuum`→`void` deviations documented in browser-lifecycle.md §1 (landed shape is the authority) |
| 2 | **`Mounted` fields** — the landed Faber-Latin set | **Yes** | `src/browser.fab` `class Mounted` (12 fields: `scopus`/`radix`/`visus`/`thema`/`textus_markup`/`textus_css`/`identitates`/`diagnosia`/`ligamina`/`subscriptiones`/`identitas_focus`/`identitas_focus_optata`); documented in browser-lifecycle.md §1 |
| 3 | **Hydration behavior** — attach-to-matching / mismatch diagnose+replace / duplicate-identity diagnosis | **Yes** | The U2 driver scenarios in `scripta/dom-shim.ts` `executeMountProof` (empty mount, hydration binds matching nodes — not recreated, mismatch `muta:` diagnosed + replaced, duplicate `duplicata:` diagnosed + collapsed) run green under `check-exempla`'s browser case; the policy fns (`ligamen_status`/`diagnosia_hydrationis`) asserted in `exempla/browser.fab` |
| 4 | **Applied `fix:<id>` markers** — site + header + inventory | **Yes** | Sites/headers verified: `fix:web-dom-locale` (browser.fab header + §7/§11), `fix:g4` (browser.fab header + §11), `fix:g5` (NONE — probed), `fix:prim-nullable` (browser.fab header + §11), `fix:codegen001` (browser.fab header + re-confirmed by the determinism Rust-path), `fix:sem001` (`src/tela.fab:970` site + `:913` header + the delivery escalation table); the **browser-lifecycle.md §11 inventory now carries every marker** (P2-1 added the missing `fix:sem001` row) |
| 5 | **Synchronous-only boundary** | **Yes** | No `@ futura`, no `dom.fetch_text`, no fetch/async claim anywhere in the Stage 3 emission; stated in `browser.fab`/`dom-shim.ts`/`main.fab` headers + browser-lifecycle.md §6; the interaction gate is a scripted deterministic sequence (check-mount) |
| 6 | **Doc-vs-emission deviations** — U3 §8 conformance notes + auditor-4 P2-3 | **Resolved** | U3 §8's five notes: (1) `dispose → void`, (2) the `Scope` seam carrier, (3) `Mounted` field spellings, (4) `fix:sem001`/`fix:prim-nullable` inventory additions, (5) determinism supersession — all now recorded in browser-lifecycle.md (§1/§5/§11/§12) and/or `stage-3-mount-determinism.md`; the §8 note (4) inventory gap is closed by P2-1 |

**Verdict**: conformant. Every pinned surface matches the landed emission;
every deviation is recorded with the landed shape as authority.

## 2. auditor-4 P2 resolutions

| P2 | Resolution | Commit/evidence |
| --- | --- | --- |
| **P2-1** — `fix:sem001` row absent from browser-lifecycle.md §11 | **Added**: the imported-union-matching row (kernel owns the only `Effectus` matcher, `effectus_identitas`; site `src/tela.fab:970` + header `:913`) | browser-lifecycle.md §11 (this commit) |
| **P2-2** — factory README stale (the two Stage 3 evidence records added without a regen) | **Regenerated** via `generate-factory-readme.py --factory-root docs/factory`; the `other` document count 12 → 14; `--check` fresh after | `docs/factory/README.md` (this commit) |
| **P2-3** — U3 reconciliation of browser-lifecycle.md §12/§5 pending | **Completed**: §5 gains the landed live-region emission (the `data-tela='tela-live'` node, `annuntium` mapping, silent-on-no-op) and §12's ledger moves U3 to **reconciled** | browser-lifecycle.md §5/§12 (this commit) |

## 3. The 4f85d04-echo residual

`stage-3-delivery.md` cited `4f85d04` as the Stage 2 step-6 acceptance
flip (lines 7 + 295–296). The true sequence (recorded by `5cbc184`): the
accept ran **ahead** of any independent audit; the fire-9 independent
audit (auditor-2, 2026-08-09) confirmed the Stage 2 closeout evidence
after the fact, and `5cbc184` corrected the record. Both delivery citations
now carry that correction (a note at the baseline + the repo-baseline
line). No CAMPAIGN.md edit (the Stage 3 stage-line/acceptance is D3-owned).

## 4. Deviation ledger — final state

| Emission | Ledger state | Notes |
| --- | --- | --- |
| U1 (`4ca331a`) | **Verified, no deviation** | Behavior-carrier spellings are the landed ones (browser-lifecycle.md §2) |
| U2 (`9f23095`) | **Reconciled** | Seam shape (Scope handle + `void`), `Mounted` fields, hydration fn names, inventory, sync-only — recorded (browser-lifecycle.md §12) |
| U3 (`27aa181`/`c182688`) | **Reconciled** | Live-region policy + interaction-gate statements + the app-typed plan (browser-lifecycle.md §5/§12) |

## 5. Harness re-verification (named test owner — the closeout auditor's
re-runs, one shot)

```text
./scripta/check-mount          # green — interaction gate, node exit 0
./scripta/check-determinism    # green — byte-identical double build
```

- **`check-mount`**: assembled the interactive composition; the scripted
  segmented-control sequence (pointer select / pointer no-op / keyboard
  focus-only incl. wrap / Space-Enter select / Home-End / replace +
  focus-restoration + scroll-anchor / dispose) executed under `node` —
  **exit 0**; tail line `segmented control interaction gate green (scripted
  sequence; tela-s3-u4)`.
- **`check-determinism`**: Rust primary path attempted + **BLOCKED**
  (CODEGEN001 — provider-module locale propagation, `fix:codegen001`,
  recorded, gate not weakened); TS-lane double-build **byte-identical**:
  `static-1/2 sha256 775169163d3edbe1b538a38c4caa2fa16338b0f6bf1f131374a9330a737e5490`
  (unchanged from the U4 record — deterministic), `tsc --noEmit` clean.
- Cargo discipline: no cargo in the shared workspace (the Rust-path crate
  is a scratch `mktemp`); the harnesses use the in-tree radix binary +
  `tsc`/`node`.

## 6. Residuals routed (to Mind / the radix lane — not Stage 3 work)

- **D3 (Mind)**: the `CAMPAIGN.md` Stage 3 stage-line status update + the
  leading-clause evolution + the acceptance flip + the Stage 4 selection —
  the closeout-owned steps this record feeds. The factory README status
  bucket (`active`) is unchanged by this pass.
- **Stage-4 entry conditions (CTO10-3, recorded — NOT met yet)**:
  1. **`fix:web-dom-locale`** — a real en→la `web:dom` import must land
     (the harness-level DOM binding is the Stage 3 fallback, recorded);
  2. **`fix:g4`** — the `tela:browser` lifecycle (mount/replace) must be
     exported and consumable through the normal package interface.
  The `fix:sem001` / `fix:prim-nullable` / `fix:codegen001` markers are
  **NOT** Stage-4 blockers (the kernel accessor + call-null-check +
  TS-lane patterns hold).
- **Radix-lane fixes** (Mind routes minimized deliveries; removal =
  grep-replace after each fix lands): `fix:web-dom-locale`, `fix:g4`,
  `fix:prim-nullable`, `fix:sem001`, `fix:codegen001`, `fix:g5`,
  `fix:ts-emitter`, `fix:snapshot-nomen-collision`.
- **Real-browser verification** (layout/scroll/pointer fidelity beyond the
  shim's state-level surface) — deferred; the node dom-shim is the Stage 3
  proof vehicle.
- **Renderer-host interface** — deferred until a second consumer asks
  (behavior-design §5).
- **Branch A re-spike** — a campaign option gated on radix D1 landing.
- **Independent extension-package proof** → Stage 4 (consumes the locked
  theme/assembly/token surfaces + the Stage 3 lifecycle through public
  contracts only).

## Non-goals (of this pass)

- No `CAMPAIGN.md` stage-line/acceptance flip (D3, Mind-owned).
- No Stage-4 lowering. No radix-lane fixes. No `src/` code changes. No
  `faber-web` edits.
- No real-browser suite; no radix ladder stages 4–6 / `--e2e`
  (auditor-owned).
