# Stage 4 U5 — Extension-Proof Record (the package test surface)

**Status**: active (evidence for `tela-s4-u5-tests-harness-determinism` —
the Stage 4 test-surface unit)
**Unit spec**: `tela/docs/factory/mvp/stage-4-delivery.md` U5 (wave 5;
depends on U4 `689e87d`)
**Baseline**: the formslib proof package (U2 `34e3890`, U3 `9335ad1`, U4
`689e87d`), the consumer assembly (the three-package cascade), the Stage 3
harnesses + determinism record (`stage-3-mount-determinism.md`, sha
`77516916…e5490`), the Stage 4 discovery record
(`stage-4-discovery.md` — the fire-9 consumer enumeration + the entry-gate
split + the G4 consumability split)

---

## 1. What U5 delivers

1. **`check-forms-proof` (new)** — the fire-9 package-test harness for the
   formslib proof package + the consumer: `radix check` the package src +
   the package exempla (exempla-mode, `+++` frontmatter) + the consumer
   under the benchmark libhome; then **two TS-lane runtime gates**:
   - **Lane A — the package exempla gate**: emit valida/tela/forms + the
     exempla, assemble ONE self-contained file (the strip + namespace-
     binding mechanics, mirroring `check-exempla`), `tsc --noEmit`, then
     `node` — the exempla's byte-exact static + ARIA assertions EXECUTE
     (fail-closed).
   - **Lane B — the consumer assembly gate**: emit valida/tela/extension/
     forms/main, assemble, `tsc --noEmit`, then `node` — the three-package
     assembly + ordering + dedup + fail-closed regressions + the U4 pure
     behavior-plan assertions EXECUTE (fail-closed).
   Any failure or non-zero exit FAILS the check.
2. **`check-determinism` extended** — the double-build input is now the
   **three-package composition** (extensionlib → formslib → canary-app, the
   U3/U4-extended runner output); the TS lane also double-emits the forms
   package (byte-identity, alongside the kernel); the sha is re-recorded
   (superseding `77516916…e5490`).
3. **This evidence record** — the package test surface, the assembly
   ordering, both determinism hashes, the exact commands, the cargo
   discipline, the fire-9 consumer enumeration confirmation.
4. **`docs/factory/README.md` regenerated** (the fire-12 auditor-2 P2-2
   fold — this record's document-count change is folded into the
   machine-managed inventory).

## 2. The package test surface (check-forms-proof — one closeout run)

Command (the official full-surface run, exactly once at this boundary,
2026-08-09, in-tree radix 0.80.0):

```text
./scripta/check-compile         # kernel + valida + extension + canary-app — green
./scripta/check-exempla         # every tela exempla: check + TS lane + node runtime gate — green
./scripta/check-mount           # the segmented-control interaction gate under node — green
./scripta/check-determinism     # the three-package static double-build + byte-compare — green
./scripta/check-forms-proof     # the formslib package exempla gate + the consumer assembly gate — green
```

`check-forms-proof` gate details (both green at the closeout, node exit 0):

| Gate | What runs under node (fail-closed) | Exit |
| --- | --- | --- |
| Package exempla gate | The exempla's byte-exact serialized-bytes + ARIA-structure assertions (field / checkbox / select / error+live association / the `agmen_campi` association / the deterministic identity scheme) | 0 |
| Consumer assembly gate | The three-package `assemble` ordering + dedup + fail-closed regressions (cycle / duplicate-identity-different-content / invalid output reject) + the `--form-*` token-layer assertions + the U4 pure behavior-plan assertions (bindings' closures, update/validation semantics, the silent no-op cases) | 0 |

The package exempla cannot consume the `→ tela.Visus` component fns
through the provider interface (fix:g4 — WARN014 export-skip, recorded in
stage-4-discovery.md §6.1); the byte-exact proof rides the G4-safe
string-returning `*_html` helpers + the props constructors. The consumer
assembly is consumed through the harness-assembly path (fix:g4 — the
WARN014 skip does not apply at runtime).

### check-mount repair (honest flag — a U3/U4-introduced silent break)

`check-mount` was **RED** at this boundary: the U3/U4 canary-app runner
consumes `forms.*` (the three-package cascade + the forms static render +
the U4 behavior-plan assertions), but the check-mount assembly never gained
a forms namespace binding — a silent break introduced at `9335ad1`/`689e87d`
(check-mount was not run at those closeouts). Repaired in this unit with the
same namespace-binding mechanics used by `check-determinism`/`check-forms-
proof` (the forms emit + `FORMS_NS` const in the assembly); the interaction
gate itself is unchanged (the segmented-control driver consumes no forms
surface). The repair is noted in the `check-mount` header. The audit should
re-run `check-mount` as a named test owner (fire-9) and confirm the repair
against the post-U5 tip.

## 3. The determinism evidence (re-recorded — the three-package composition)

### Hashes (build/hashes.txt)

```text
static-1 sha256: 28f63f754ba93c90804cd97610161f7106281bc995346ad06512b4273dd1d39b
static-2 sha256: 28f63f754ba93c90804cd97610161f7106281bc995346ad06512b4273dd1d39b
byte-identical: yes
```

The two builds of the three-package composition are **byte-identical**
(fail-closed: any diff exits non-zero and fails the check). This sha
**supersedes** the Stage 3 record `775169163d3edbe1b538a38c4caa2fa16338b0f6bf1f131374a9330a737e5490`
(and, transitively, the Stage 2 `3d22b9c7…8340a` + the U3 informational
`d23a62bb…c74c`). Evidence files under `build/` (gitignored): `static-1.txt`,
`static-2.txt`, `hashes.txt`.

### Output description

The runner output (9 lines) is the double-build input — the three-package
composition:

1. The theme-independent composition HTML (panel + metrics + bar meter +
   the segmented control — the Stage 3 shared-source static half).
2. The `lumen` full cascade: `:root` token layer (the core 8 + the
   extension's `chart.*` tokens + the formslib `--form-*` tokens) +
   extensionlib + formslib bundle rules + canary-app rules.
3. The `tenebrae` full cascade — materially different token layer, identical
   component/library/application bundles.
4. The Stage 2 runner status line.
5. The segmented-control initial static render (the Stage 3 static half).
6. The Stage 3 runner status line.
7. The forms family static render (field/checkbox/select + error/live
   bytes, via the G4-safe `*_html` helpers).
8. The Stage 4 U3 runner status line.
9. The Stage 4 U4 behavior-plan marker.

Note: the CSS bytes carry a literal `\n` between rules — the pre-existing
TS-emitter backslash double-escape observation (`fix:ts-emitter`); the
bytes are deterministic (identical on every build) and CSS-parseable;
recorded, not fought.

## 4. Determinism posture (recorded, not claimed)

- Determinism applies to **static/mount-time serialization only** — the
  composition HTML + the full cascades + the segmented-control initial HTML
  + the forms static render (the double-build above). **Interactive state is
  time-variant** — recorded, not claimed: the interaction sequence is a
  scripted deterministic assertion sequence under `check-mount`, not a racy
  timing test.
- The gated interactive execution (U7, the dom-shim-is-not-the-interactive-
  claim boundary) is not a determinism input.

## 5. Assembly-ordering evidence (the three-package cascade)

The runner's `assemble` calls (Stage 4 U3, `9335ad1`/`689e87d`) declare the
ordo map `[tela.ordo("extensionlib", []), tela.ordo("formslib", [])]` with
the bundles `[ext_bundle, forms_bundle]` + the app bundle. Both extensionlib
and formslib depend on nothing (tela is the shared base), so the kernel's
topological tie-break (stable package identity) orders **extensionlib before
formslib** — the documented cascade order. The assertions:

- The `:root` token layer includes the namespaced `--form-field-invalid:
  #dc2626` / `--form-field-valid: #16a34a` / `--form-focus: #2563eb`
  values (the forms tokens flow through the kernel token rendering).
- The formslib component style bundle rides the cascade (rules keyed on
  `[data-tela^='form-field-']` / `[data-tela^='form-error-']` /
  `[data-tela='form-live']` / `[data-tela^='form-checkbox-']`, referencing
  `var(--form-field-invalid)` / `var(--form-focus)`).
- The extension bundle resolves before the forms bundle in the cascade (the
  `indice_in` assert: the `[data-tela='tela-chart-bar']` selector index <
  the `[data-tela^='form-field-']` selector index).
- The fail-closed regressions re-asserted: a cycle in the ordo map rejects
  (`assemble` → `null`); duplicate package identity with different content
  rejects; an invalid (empty-selector) output rejects.

All executed green under `node` (the consumer assembly gate, §2).

## 6. Lanes

- **Rust primary path: ATTEMPTED + BLOCKED (CODEGEN001, `fix:codegen001`)**.
  `radix emit -t rust` of the import-bearing canary-app fails the
  provider-module locale-propagation defect (`provider module tela failed
  analysis: PARSE030/PARSE001 …` — re-confirmed at this boundary). Recorded;
  the gate is NOT weakened to pass; the TS lane is the proven runtime lane.
- **TS lane (the proven lane)**: emit valida/tela/extension/forms/canary,
  **double-emit the kernel + the forms package** (byte-identical),
  assemble into one self-contained module, run twice under `node`,
  byte-compare, `tsc --noEmit` — all green.
- **R2 note (Rust-lane sha-equality, restated — `stage-2-determinism.md`
  §3)**: when the provider-module locale-propagation fix lands,
  check-determinism's Rust primary path activates automatically (no
  harness change) and the Rust-lane capture MUST equal the TS-lane capture
  (`28f63f75…d1d39b`) — sha equality (stage-1-determinism.md §6 pattern).
  The Stage 4 closeout re-checks this on the first post-fix run.

## 7. Fire-9 consumer enumeration — confirmed exercised (done_when (d))

Per `stage-4-discovery.md` §2 (the fire-9 enumeration), every consumer is
exercised or explicitly flagged at this boundary:

| Consumer | Exercised by | Status at this boundary |
| --- | --- | --- |
| The proof package itself (a consumer of tela public modules) | U2 exempla + U3 tokens/bundle/assembly-input + U4 behavior contract surface | **Exercised** — the package exempla gate (check + TS lane + node) |
| The consumer app `canary-app` (consumes `formslib` + `extensionlib` + tela) | U3 assembly cascade + U4 app-typed plan | **Exercised** — the consumer assembly gate (check + TS lane + node) + the `check-determinism` double-build |
| The check harnesses | `check-forms-proof` (this unit); `check-exempla`/`check-mount`/`check-determinism` where the composition feeds them | **Exercised** — the full tela package surface runs green once (§2) |

The gated interactive provider-seam proof (U7) is explicitly **flagged
gated** (CTO10-3: the cds-u5/u6 removal predicates are not met —
re-verified live in `stage-4-discovery.md` §4) — not a consumer gap.

## 8. Cargo discipline

No cargo in the development loop. The Rust-path crate lives in a `mktemp`
scratch outside the shared workspace (the harnesses' `SCRATCH` dirs); the
harnesses ran once at the closeout (one development run of the new
`check-forms-proof` + one of the extended `check-determinism` before the
single official full-surface run — the sha is deterministic and identical
across both).

## 9. Residuals

- The gated U6/U7 units re-verify the cds-u5/u6 removal predicates against
  live radix before executing (never assume); U7 re-records the final
  interactive-proof state.
- `fix:codegen001` / `fix:g4` / `fix:web-dom-locale` / `fix:sem001` /
  `fix:prim-nullable` / `fix:ts-emitter` / G5 /
  `fix:snapshot-nomen-collision` fixes stay on the radix lane.
- No CAMPAIGN.md edits by this unit; no radix-lane fixes; no writes to
  `tela/spike/`; no `src/` or `proof/*/src/` edits.
