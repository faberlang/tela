# Stage 2 U5 — Two-Theme Determinism Record

**Status**: active (evidence for `tela-s2-u5-harnesses-determinism`)
**Unit spec**: `tela/docs/factory/mvp/stage-2-delivery.md` U5 (wave 4; the
stage-final unit)
**Baseline**: two-theme composition runner (U3 `ee2abb0`), theme/assembly
kernel (U1 `e194621` + U2 `bd3130e`), Stage 1 harnesses + determinism record
(`stage-1-determinism.md`)

---

## 1. What U5 delivers

1. **check-exempla runtime gate (residual R1 closed)**: every exempla now
   executes its assembled TS under `node` in addition to `radix check` +
   `tsc --noEmit` — assertions run, so wrong expectations or real
   source/emitter defects fail the check instead of being
   implementer-claimed. The `thema` + `assemble` wiring cases were added to
   the assembly surface. **The gate immediately proved its value**: the
   first runtime run exposed a real U2 `assemble` fail-closed hole — the
   components/library bundles were not rule-shape validated (an
   empty-selector rule passed through), contradicting U2 done_when (d). The
   source was fixed (`assemble` now runs `stilum_validum` over the
   components and library bundles before emission) — the exact "fail
   honestly, fix the source or the assert" path the delivery anticipated.
2. **check-determinism two-theme double-build**: the double-build input is
   the two-theme composition runner (U3) — the single theme-independent HTML
   plus the full cascade CSS under both themes. The gate builds it twice on
   the TS lane (the proven lane), byte-compares (fail-closed — a diff FAILS
   the check), and writes the hashes.
3. **This evidence record**.

## 2. The determinism evidence (one closeout run)

Command (exactly once):

```text
./scripta/check-exempla        # radix check + TS lane + node runtime gate — green
./scripta/check-determinism    # two-theme double-build + byte-compare — green
```

**Both runs green at the U5 closeout** (2026-08-09, in-tree radix 0.80.0).

### Hashes (build/hashes.txt)

```text
static-1 sha256: 3d22b9c7d17cbc938e34e544458d931c3393ae1ee5711cf2221f85492048340a
static-2 sha256: 3d22b9c7d17cbc938e34e544458d931c3393ae1ee5711cf2221f85492048340a
byte-identical: yes
```

The two builds of the two-theme composition are **byte-identical**
(fail-closed: any diff exits non-zero and fails the check). Evidence files
under `build/` (gitignored): `static-1.txt`, `static-2.txt`, `hashes.txt`.

### Output description

The runner output (4 lines) is the double-build input:

```text
<div aria-label='metric panel' data-tela='canary-panelum'><dl>…</dl><div role='meter' …>…</div></div>
:root { --surface-canvas: #ffffff; … --chart-axis-muted: #6b7280; --chart-grid-muted: #e5e7eb; }\n…
:root { --surface-canvas: #0f172a; … --chart-axis-muted: #9ca3af; --chart-grid-muted: #1f2937; }\n…
two-theme static rendered (lumen vs tenebrae; tela-s2-u3)
```

1. The theme-independent HTML (byte-identical under both themes — asserted
   in-process by the runner: `html_a ≡ html_b`, node exit 0 in the U3 gate
   run).
2. The `lumen` (light) full cascade: `:root` token layer + extensionlib +
   canary-app rules.
3. The `tenebrae` (dark) full cascade — materially different token layer,
   identical component/library/application bundles.
4. The runner status line.

Note: the CSS bytes carry a literal `\n` between rules — the pre-existing
TS-emitter backslash double-escape observation (`fix:ts-emitter`); the
bytes are deterministic (identical on every build) and CSS-parseable;
recorded, not fought.

## 3. Lanes

- **Rust primary path: ATTEMPTED + BLOCKED (CODEGEN001, `fix:codegen001`)**.
  `radix emit -t rust` of the import-bearing canary-app fails the
  provider-module locale-propagation defect (`provider module tela failed
  analysis: PARSE030/PARSE001 …`). Recorded; the gate is NOT weakened to
  pass; the TS lane is the proven runtime lane.
- **TS lane (the proven lane)**: emit valida/tela/extension/canary, double-
  emit the kernel (byte-identical), assemble into one self-contained module,
  run twice under `node`, byte-compare, `tsc --noEmit` — all green.
- **R2 note (Rust-lane sha-equality, recorded for when CODEGEN001 lands)**:
  when the provider-module locale-propagation fix lands, check-determinism's
  Rust primary path activates automatically (no harness change) and the
  Rust-lane capture MUST equal the TS-lane capture
  (`3d22b9c7…8340a`) — sha equality (stage-1-determinism.md §6 pattern).
  The Stage 2 review re-checks this on the first post-fix run.

## 4. Escalation-path re-checks (the stage touched them)

| Defect | Marker | Stage 2 U5 status |
| --- | --- | --- |
| CODEGEN001 — Rust emit-across-imports | `fix:codegen001` | **Re-confirmed** (this unit's Rust-path attempt: provider-module analysis failure) |
| G5 — `html` verb collision | `fix:g5` | Re-checked: the theme verbs (`thema`, `scopulum`, `thema_css`) and `assemble` remain collision-free; `html_visus`/`css` unchanged |
| TS-emitter — backslash double-escape | `fix:ts-emitter` | Re-observed (literal `\n` in the CSS bytes; deterministic) |
| G4 — cross-package Visus-returning helper export skip | `fix:g4` | Re-checked: `bar_metrum` still WARN014-skipped; compose-without holds |
| NEW: snapshot nomen collision (U3) | `fix:snapshot-nomen-collision` | Re-checked: the extension's `Scopulus` rename + field-access-on-call consumption remain in place |

## 5. Harness mechanics

- `check-exempla`: `radix check` every `exempla/*.fab`; TS emit valida + tela
  + each exempla; assemble per the wiring case (validation/serializer/thema/
  assemble); `tsc --noEmit`; **then `node` on the assembled file (runtime
  gate — assertions execute)**. Assembly: `strip` (drop the 2-line radix
  header + import lines) + namespace const bindings (`valida`, `tela` — the
  full Stage 2 kernel surface; `ext` where needed).
- `check-determinism`: Rust primary path attempted (CODEGEN001 recorded) →
  TS-lane fallback: emit + double-emit kernel (byte-identity) + assemble +
  run twice + `cmp` fail-closed + sha256 → `build/hashes.txt`; `tsc
  --noEmit` on the assembled composition.
- `build/` is gitignored (Stage 1 U6); no `.gitignore` change needed.

## 6. Cargo discipline

All cargo runs in scratch dirs outside the shared workspace (the Rust-path
crate is a `mktemp` scratch); no workspace suites; the harnesses ran exactly
once at the closeout.

## 7. Residuals

- Stage 2 closeout inputs (Mind-routed): the CAMPAIGN.md Stage 2 status
  flip + step-6 review (consequences + correctness + independent audit —
  the auditor re-runs `check-determinism`); the Stage 2 → Stage 3 selection.
- `fix:snapshot-nomen-collision` → radix lane.
- CODEGEN001 / G4 / G5 / TS-emitter fixes stay on the radix lane.
- No CAMPAIGN.md edits by this unit; no radix-lane fixes.
