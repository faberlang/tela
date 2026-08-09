# Stage 4 U1 — Discovery Record (identity freeze + consumer enumeration + gate re-verification)

**Status**: active (evidence for `tela-s4-u1-discovery-seam-probe`)
**Unit spec**: `tela/docs/factory/mvp/stage-4-delivery.md` U1 (wave 1 —
the discovery-first gate)
**Entry gate**: MET — Stage 3 ACCEPTED (`f0e6377`, audit-backed clean_pass,
audit-before-acceptance held) + Stage 4 lowered (`6a7215e`).
**Hand**: hand-7 (U2 author + U4 harnesses + closeout + acceptance flip).
**Date**: 2026-08-09 (in-tree radix 0.80.0).

This record freezes the proof-package identity, enumerates the consumers
(fire-9), freezes the entry-gate split, **re-verifies the CTO10-3 gate
status against live radix** (never assumed), verifies the dependency
boundary, and documents the authoring-surface constraints — all docs-only.

---

## 1. Identity freeze (done_when (a))

| Identity | Value |
| --- | --- |
| Directory | `proof/extension-forms/` |
| Package / provider | `formslib` (alphanumeric — the `provider:module` import form requires it, the Stage 0 canary §3 record) |
| Kind / targets / locale | `kind = "lib"`, `targets = ["rust", "ts"]`, `locale = "en"` |
| Module shape | Flat single module `src/forms.fab` (G4-safe: every public signature references local types + the kernel's `tela.Visus`/`tela.Stilum`; the WARN014 family is recorded per export, not fought) |
| Libhome alias | `proof/benchmark/libhome/formslib` → `../../extension-forms` (the benchmark libhome grows one symlink; the U2 unit creates it) |
| Dependencies | `tela:tela` only (the overlap rule; `tela:browser` only if a surface needs it — default no) |

**Family default — forms** (campaign Open Question 6; delivery §Open
Questions Q1): field (text input), checkbox, select, plus the error/
live-region association. **Rationale**:
1. **Campaign §5 names `form.field.invalid` as the namespaced-token
   example** — the forms family exercises the documented token path
   directly.
2. **The strongest interactive-behavior stress for the CTO10-3 seam** —
   forms carry focus, validation state (`aria-invalid`),
   `aria-describedby` → error identity, and the live-region policy; the
   gated U7 interaction sequence (input → message → model → replace;
   checkbox toggle; select change; validation transition; live-region
   announcement) is the richest proof of the provider seam.
3. **Feeds Stage 5's field/form gate** directly (the catalog's field/form
   surfaces consume this family's proven shape).

**Alternatives recorded** (campaign Open Question 6): **charts** would
extend the benchmark's `chart.*` tokens + SVG (overlaps the existing
two-package evidence rather than adding a new family axis); **documentation-
layout** is static-heavy (a thin interactive surface — a weaker CTO10-3
stress test). Forms is the locked default.

## 2. Consumers enumerated (fire-9 norm, done_when (b))

| Consumer | Role | Exercised by |
| --- | --- | --- |
| The proof package itself | A consumer of tela public modules (`tela:tela`; its own module imports through the provider interface) | U2 (self-probe + exempla), U3 (tokens/styles/assembly), U4 (behavior), U5 (`check-forms-proof`) |
| The consumer app `canary-app` | Consumes `formslib` + `extensionlib` + tela — the three-package ecosystem proof | U3 (assembly cascade), U4 (app-typed plan), U5, U7 (gated interactive) |
| The check harnesses | `check-forms-proof` (new, U5); `check-exempla`/`check-mount`/`check-determinism` where the composition feeds them | U5 (full package surface green once) |

**Per-unit package-test-surface rule (recorded)**: each unit proves the
relevant consumer surface green at its boundary or flags honestly — the
narrowest check that falsifies the change + keeps the affected consumers
green (the fire-9 norm; the delivery's Coordination Constraint 5). The
official full-surface run is the U5 close and the stage closeout, exactly
once.

## 3. Entry-gate split frozen (done_when (c))

| Surface | Units | Gated? |
| --- | --- | --- |
| Discovery + seam probe (this record) | U1 | **No** (docs only) |
| Component family (static half — the package self-proves) | U2 | **No** |
| Styles + namespaced `form.*` tokens + product assembly input | U3 | **No** |
| Behavior contract + pure-level behavior proof (D1 app-typed) | U4 | **No** |
| Package test surface + harness + determinism re-record | U5 | **No** |
| Seam restoration (browser.fab flips to the real `dom.Scope`) | U6 | **YES** — only when both cds-u5 + cds-u6 land (re-verified live) |
| Interactive provider-seam proof | U7 | **YES** — depends on U6 |

**The dom-shim-is-not-the-interactive-proof statement (recorded)**: the
dom-shim harness proves the assembled source runs; it does **not** prove
the provider seam (en→la import + export snapshot). The gated U6/U7 prove
the provider seam through the normal package interface (U7's host binding
is the documented faber-web seam, never a tela-side re-implementation).
The non-interactive surfaces ride the landed Stage 3 surface + the G4
consumability split — NOT gated.

## 4. Gate status re-verified LIVE (done_when (d) — never assumed)

Probes re-run against the in-tree radix 0.80.0 on 2026-08-09 (scratch
files under `/tmp/tela-s4-probe/`).

### 4.1 The en→la `web:dom` probe matrix (the browser.fab matrix, re-run)

| Probe | Result today | Conclusion |
| --- | --- | --- |
| Call sites (`const s ← dom.scope("")` + inference) | **PARSE001** at the call/inference lines | The provider-module locale-propagation failure at real use — unchanged |
| Construction (`dom.Scope { selector = … }`) | **SEM002.unknown_qualified_type** | Unchanged |
| Class-field types (`class Cista { dom.Scope scopus }`) | **SEM002.unknown_qualified_type** | Unchanged |
| Fn-signature-only (`fn keepe(dom.Scope s) → dom.Scope`) | Parses (no error) | Signature names resolve; any real use fails |

**`fix:web-dom-locale` NOT landed** — the en→la `web:dom` import remains
blocked at every real-use surface.

### 4.2 The WARN014 export-consumability probe (the G4 split, re-run)

A consumer (`d-consumer.fab`) imports `extensionlib:extension`:
- `ext.bar_metrum(...)` (`→ tela.Visus`, union-returning) →
  **WARN014.file_interface_export_skipped** + SEM010 (return type not
  resolvable from the consumer).
- `ext.chart_stilum()` (`→ tela.Stilum`, class-returning) and
  `ext.chart_axis_muted()` (local token carrier) — **resolve** (no error).

**`fix:g4` NOT landed** — the union-returning/imported-sibling-type export
skip holds; the class-returning + local-carrier consumability split is
confirmed live (the delivery's non-gated posture evidence).

### 4.3 The cds units' status + removal predicates (verbatim)

The CTO-5 defect sprint (`radix/docs/factory/compiler-defect-sprint/goal.md`):
goal Status **"planning (2026-08-09) — CTO-5 consolidation lowered"** —
**cds-u5 and cds-u6 have NOT landed** (they are in the defect-sprint queue,
waves 2 + 3). Recorded honestly: the interactive gate stays **not-met**.

Removal predicates (verbatim from
`radix/docs/factory/compiler-defect-sprint/compiler-defect-sprint-delivery.md`):

- **cds-u5-provider-locale** (delivers `fix:web-dom-locale` +
  `fix:codegen001`), done_when (a)/(c): *"en→la cross-package `radix check`
  green (the tela/faber-web shape)"*; *"The browser.fab seam flip predicate
  (dom.Scope direct consumption) documented"*. Outcome: *"The `web:dom`
  seam flips to `dom.Scope`; the R2 Rust-sha-equality check activates."*
- **cds-u6-file-interface-exports** (delivers `fix:g4` +
  `fix:snapshot-nomen-collision` + G1b), done_when (a)/(d): *"A `fn →
  tela.Visus`-shaped export (imported sibling type) appears in the snapshot
  (WARN014 gone)"*; *"`fix:g4` + `fix:snapshot-nomen-collision` removal
  predicates documented (browser.fab seam fns exportable; `Scopulus` rename
  revert)"*.

The gated U6/U7 units re-verify these predicates against live radix before
executing (never assume) — and the live re-verification above shows both
predicates **not yet met**.

## 5. Dependency boundary verified (done_when (e))

- The proof package depends on **`tela:tela` only** (default) + documented
  `faber-web` host seams at most; `tela:browser` only if a surface needs it
  (default no).
- **Overlap rule restated**: no Tela / `faber-web` / `faber` / radix
  modification by the proof package. The only tela `src/` delta in Stage 4
  is U6's **workaround-removal** (the seam flips back to the spec-locked
  `dom.Scope` when the fixes land) — a radix-fix integration, not a
  framework modification.

## 6. Authoring-surface constraints documented (done_when (f) — probed)

1. **The G4 consumability split (probed live, §4.2 + the package-shape
   probe below)**: union-returning exports whose signatures reference
   imported sibling types (`→ tela.Visus` component fns) are
   WARN014-skipped for consumers — **including the package's own exempla
   importing through the provider interface** (probed: `probe:forms` →
   `forms.campum(...) → tela.Visus` → SEM010 from the exempla).
   Class-returning (`→ tela.Stilum`) + local-carrier accessors resolve.
   The package KEEPS its component seam (never a duplicated `Visus` in the
   package); the consumer's cross-package family composition stays behind
   compose-without until g4 lands.
2. **The local-carrier token pattern (probed)**: namespaced `form.*` tokens
   are exposed as zero-arg accessors returning a local token-carrier class
   (the `Scopulus` precedent) — consumers read fields on the call result
   (`ext.chart_axis_muted().nomen`); never a nameable qualified type, never
   a widened kernel `Scopulum` record. This is consumable today.
3. **Exempla-mode mechanics for a separate package (probed)**: a
   `+++`-frontmatter exempla in a separate package under the benchmark
   libhome checks green (`radix check --locale en <pkg>/exempla/…` with the
   provider resolving). **Critical probe result**: the exempla CANNOT
   consume the package's own `→ tela.Visus` component fns through the
   provider interface (WARN014 skip — SEM010). The proven path for the
   byte-exact static proof is a **G4-safe string-returning render helper**
   in the package module (e.g. `campum_html(identitas, nomen) → string`
   rendering internally via `tela.html_visus`; a string signature stays on
   the file interface). Probed green end-to-end (package check ok; exempla
   check ok). **U2's exempla should route the byte-exact assertions through
   such helpers** (recorded for the U2 hand; the `→ tela.Visus` component
   fns remain the real seam for the app/compose-without + the gated U7).
4. **The `fix:snapshot-nomen-collision` naming rule**: new identifiers
   avoid kernel type names (the `Scopulus` precedent) — the forms token
   carrier + props classes use distinct local names (`Forma_scopulus`/
   `Props_campi`-style, probed collision-free by the U2 hand per fix:g5).
5. **The G5 probe discipline**: every new identifier probed
   collision-free on the in-tree radix before use; a colliding locked verb
   is escalated, never silently renamed (the `html` → `html_visus`
   precedent).
6. **The `fix:<id>` marker inventory for Stage 4** (applied at the site
   when a workaround is used; removal = grep-replace after the radix fix):
   `fix:web-dom-locale` (gated — the seam flips in U6), `fix:g4` (gated —
   the consumability split holds until cds-u6), `fix:sem001` (NOT a
   Stage-4 blocker — effect keys read via `tela.effectus_identitas`),
   `fix:prim-nullable` (NOT a blocker — call-null-check + `coalesce ""`),
   `fix:codegen001` (NOT a blocker — TS lane proven), `fix:g5`,
   `fix:ts-emitter`, `fix:snapshot-nomen-collision`.

## 7. Non-goals of this unit (recorded)

No product code; no package scaffold (U2); no tokens/styles/assembly (U3);
no behavior (U4); no harness (U5); no seam changes (U6, gated); no
interactive proof (U7, gated); no `CAMPAIGN.md` edits (D3 closeout-owned);
no radix-lane fixes.

## 8. Validation

- No cargo (in-tree radix probes + `git diff --check` only).
- The probes above are recorded with their results (the live gate status,
  never assumed).
- `git diff --check`: clean (verified at the unit close).
