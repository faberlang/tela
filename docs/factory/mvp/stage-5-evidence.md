# Stage 5 U10 — Evidence Record (the full surface + determinism + the stage record)

**Status**: active (evidence for `tela-s5-u10-tests-determinism-evidence` —
the official Stage 5 evidence boundary)
**Unit spec**: `tela/docs/factory/mvp/stage-5-delivery.md` U10 (lines
768–782; the final wave — depends on U9 `b1d7d4d`, GREEN)
**Read scope consumed**: the U2–U9 emission (commits `51f4741` … `b1d7d4d`),
the harness mechanics (scripta/), `stage-4-extension-proof.md` +
`stage-4-interactive.md` (the evidence-record pattern + the prior sha
records), `stage-5-discovery.md` (the frozen plan), `stage-5-dogfooding.md`
(the U9 record).
**Hand**: hand-7. **Date**: 2026-08-09 (in-tree radix 0.80.0).

## Verdict

**GREEN — the full tela package surface runs green once** (the six
harnesses + `check-reference`, one official fail-closed run at this
boundary). The final composition double-builds **byte-identical**; the
official sha re-records to `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` —
**unchanged from the U9 record** (U10 authored no product code; the
supersession chain `8dfcb143…` → `6927187ec0…` holds, and the U9 sha is
**ratified as the official Stage 5 sha** — the honest flag). The Rust
primary path was **attempted** and BLOCKED by the recorded CODEGEN001
defect (re-recorded; `fix:codegen001`); the proven TS-lane composition lane
carried the gate (not weakened). `git diff --check` clean.

---

## 1. The catalog — family coverage (all nine)

The reference catalog (`src/reference.fab`, provider `tela:reference` — the
U1-locked home) ships **all nine families** as ordinary component functions
over typed props → `tela.View`, stable `ref-*` / `form-*` `data-tela`
identities, no raw markup (the `html_visus` central-escaping serializer is
the only renderer), style bundles → `tela.Style` keyed on the identities,
`ref.*` namespaced tokens consumed through `assemble`.

| # | Family | Surface (reference.fab exports) | Authored |
| --- | --- | --- | --- |
| 1 | **layout** | `layout_stack` / `layout_grid` / `layout_prose` + `stack_props`/`grid_props`/`layout_prose_props` + `layout_style` + `ref_layout_*` tokens | U2 `51f4741` |
| 2 | **typography** | `typography_heading` / `typography_prose` / `typography_emphasis` / `typography_scale` + `heading_props`/`prose_props`/`emphasis_props`/`scale_props` + `clamped_level` + `typography_style` + `ref_type_*` tokens | U2 `51f4741` |
| 3 | **panel** | `panel` + `panel_props` + `panel_style` + `ref_panel_*` tokens | U3 `4b97bfb` |
| 4 | **badge** | `badge` + `badge_props` + `badge_style` + `ref_badge_*` tokens | U3 `4b97bfb` |
| 5 | **metric** | `metric` + `metric_props` + `metric_style` + `ref_metric_*` tokens | U3 `4b97bfb` |
| 6 | **table** | `table` / `table_row` + `table_props` + `table_style` + `ref_table_*` tokens | U4 `756dd97` |
| 7 | **segmented-control** | `segmented_control` / `segmented_option` / `segmented_options` / `segmented_live_region` + `segmented_props` + `selected_text` / `active_tabindex` + `segmented_style` + `ref_seg_*` tokens (the Stage 3 control re-homed) | U5 `6861455` |
| 8 | **button** | `button` + `button_props` + `button_event` + `button_style` + `ref_button_*` tokens | U6 `fbd7010` (+ `8cebfd7` prop-spelling probe verdict) |
| 9 | **field** | `field_input` / `field_input_props` / `field_invalid` / `field_error_region` / `field_live_region` / `field_control` + `field_style` + `field_input_event` / `field_error_for_value` / `field_announcement` (the pure behavior surface, U8) + `field_*` tokens (the Stage 4 formslib field contract re-homed) | U7 `be02ba3` + U8 `e2e5d82` |

Every family appears in the **final composition runner output** (36 lines,
`build/static-1.txt`): layout (line 10–11), typography (12–13), panel
(15–16), badge (17–18), metric (19–20), table (22–23), segmented-control
(5–6 and 25–26 — the re-homed render + the family render), button (28–29),
field (31–32) — plus the forms-family legacy render + the behavior-plan +
two-theme + forms-interactive status lines (lines 1–9, 34–36).

## 2. The proof gates — static + browser

| Proof layer | Vehicle | What it proves |
| --- | --- | --- |
| **Static (byte-exact)** | `check-exempla` (the `exempla/reference.fab` wiring case) + `check-forms-proof` Lane A + the canary runner (per-family `… static rendered` lines) | Exact serialized bytes: structure, identities, ARIA surface, style bundles, token values — every family, fail-closed, executed under `node` |
| **Browser mount + structure/a11y** | `check-reference` — the real seam (web:dom en→la + `tela:browser` + `tela:reference` + formslib + extensionlib through the NORMAL package interface), the documented faber-web host binding (the actual `runtime/dom.ts`), each family mounted through `tela.browser.mount` | mount plan, identity/tag-name bindings, structure + a11y asserts per family, node exit 0, synchronous-only |
| **Behavior (interaction)** | `check-reference` (table / segmented-control / button / field cases) + `check-mount` (segmented-control gate) + `check-forms-interactive` (the forms provider-seam sequence) | scripted deterministic interaction sequences — fail-closed, synchronous-only (the routed async-gap boundary: no fetch claims) |
| **Package surface** | `check-compile` + `check-forms-proof` Lane B + `check-determinism` | `radix check` green across the packages; the consumer assembly + ordering + dedup + fail-closed regressions; the final-composition determinism |

## 3. The a11y matrix (per family — campaign §8, delivery §3)

| Family | Accessible name | Role / semantic structure | State | Keyboard / focus | Live region / no-color rule |
| --- | --- | --- | --- | --- | --- |
| layout | — (structural) | semantic layout containers (`ref-layout-*`) | — | — | — |
| typography | native heading text | native `h1..h6` hierarchy, `p` prose, `strong`/`em`/`code` semantic emphasis; the scale is decorative sizing — never color-only | — | — | — |
| panel | `aria-label` = title when present; otherwise the content names the region | `role='region'` (named landmark) | — | — | — |
| badge | `aria-label` = `<status>: <text>` + the visible label text | `role='status'` | — | — | meaning is TEXTUAL (the status word rides the name AND is visible) — no color-only communication |
| metric | `dt` label | `dl`/`dt`/`dd` definition list (label + value + optional delta) | — | — | — |
| table | never fabricated — the app supplies the recorded equivalent (caption/aria-label is an app choice, documented) | native `table`/`caption`/`thead`/`th[scope='col']`/`tbody`/`tr`/`td`; no caption → no `<caption>` element | — | declared consumer-plan interaction: ArrowDown/ArrowUp row navigation, unmapped keys silent no-op, focus restored by identity | — |
| segmented-control | `aria-label` on the group | `role='radiogroup'`; segments `role='radio'` + `aria-selected` + the roving tabindex (ONE tab stop; selected = `tabindex='0'`, others `-1`) | `aria-selected` true/false follows the selection | arrows/Home/End focus-only (silent), Space/Enter select, focus restoration across a replace (effects via `tela.effect_identity`), scroll anchor | control-owned declared live region (`role='status'` `aria-live='polite'`, `ref-seg-live`); no-op rule: silent on a no-op |
| button | native label text or the declared `aria-label` override | native `<button>` — NO ARIA role (would duplicate native semantics) | native `disabled` (no activation, the state exposed) | native Space/Enter activation; `:focus-visible` rule (visible focus); focus restoration across a replace | — |
| field | `label`/`aria-label` | native `<input type='text'>` — NO ARIA role | `aria-invalid` true/false; native `disabled` | native input keyboard contract; focus restoration across a replace (`focus_held`) | `aria-describedby` → the error identity when invalid; `role='alert'` error region; `role='status'` `aria-live='polite'` live region — announces ONCE on a validation-state change, SILENT on a no-op (the §1.5 rule) |

The browser behavior cases are proven through scripted sequences under
`check-reference` / `check-mount` / `check-forms-interactive`: field
input-dispatch → message → update → replace (the U8 interaction case);
segmented pointer/keyboard/Home-End + replace + focus restoration + dispose;
button click + Space/Enter + disabled no-op; table row-navigation focus
plan. All synchronous-only, fail-closed, node exit 0.

## 4. The full-surface run — one official run, fail-closed

The seven harnesses ran **once** at this boundary (2026-08-09, in-tree
radix 0.80.0):

```
check-compile:           GREEN — radix check on src/tela.fab + src/validate.fab + src/reference.fab (container libhome) + the benchmark packages
check-exempla:           GREEN — every exempla/*.fab (incl. the reference wiring case): radix check + TS lane + node runtime gate
check-mount:             GREEN — the segmented-control interaction gate (scripted sequence; node exit 0)
check-determinism:       GREEN — the final composition double-built twice, byte-identical; tsc --noEmit on the assembled composition green
check-forms-proof:       GREEN — package exempla gate + consumer assembly gate (node exit 0)
check-forms-interactive: GREEN — the real provider seam, scripted interaction sequence (node exit 0)
check-reference:         GREEN — layout + typography + panel + badge + metric + table + segmented-control + button + field mount + structure/a11y + field behavior + declared interaction cases (node exit 0)
```

Any failure or non-zero exit FAILS the run (fail-closed). Runner tails,
verbatim:

```
segmented control interaction gate green (scripted sequence; tela-s3-u4)
check-mount: green (segmented-control interaction gate; node exit 0)
forms interactive provider-seam gate green (scripted sequence; tela-s4-u7)
check-forms-interactive: green (real provider seam; scripted sequence; node exit 0)
reference catalog mount gate green (layout + typography + panel + badge + metric + table + segmented-control + button + field mount + structure/a11y + field behavior + declared interaction; tela-s5-u2/u3/u4/u5/u6/u7/u8)
check-reference: green (real provider seam; … ; node exit 0)
```

## 5. Determinism — re-recorded at the official boundary

### Hashes (build/hashes.txt — re-recorded by this run)

```text
static-1 sha256: 6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194
static-2 sha256: 6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194
byte-identical: yes
```

The two builds of the **final composition** — tela kernel (valida + tela) +
reference + formslib + extension-lib + canary-app, incl. the emitted
web:dom seam + the `tela:browser` binding — are **byte-identical**
(fail-closed: any diff exits non-zero and fails the gate).

### The supersession chain (honest record)

| Record | sha | Note |
| --- | --- | --- |
| Stage 4 U7 (`stage-4-interactive.md`) | `8dfcb1430e44758df824bc8b68943915caac499dfb7a110d6bf4800dccb50a04` | the pre-Stage-5 record |
| U9 (`stage-5-dogfooding.md`) | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | the U9 rewire changed the runner output → **superseded** `8dfcb143…` |
| **U10 (official)** | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | the composition is **unchanged** since U9 (U10 authored no product code — the evidence record + the determinism script header only). The U9 sha **STANDS and is ratified as the official Stage 5 sha**; `build/hashes.txt` is re-recorded at this boundary. |

The spec's "sha churn" expectation (a new hash at U10) did not materialize
because the runner output did not change between U9 and U10 — the honest
flag is recorded here: no product code, no runner change, same byte output,
same sha. The U9 record's sha is the official Stage 5 sha.

### The Rust primary path — attempted + the defect re-recorded

The Rust lane is the **primary** determinism path and is **attempted first**
by `check-determinism` (no code path skips it). At this boundary it fired
the recorded defect:

```
Rust path: BLOCKED — error[CODEGEN001]:
  proof/benchmark/canary-app/src/main.fab: code generation failed:
  internal: definition id 4117 could not be resolved during code generation
```

**`fix:codegen001`** — the recorded radix-lane defect (provider modules
re-analyzed without the en reader locale; the import-bearing Rust emit
fails at codegen). The gate **falls back to the proven TS-lane composition
lane** — it is NOT weakened. **R2 sha-equality note restated**: when
CODEGEN001 lands, the Rust-lane capture must equal the TS-lane capture
(sha equality), and the Rust primary path activates automatically — no
harness change. The U10 run's Rust-path attempt used no shared-workspace
cargo (the emit fails before any scratch crate runs; the scratch crate
lives in `/tmp` when it does).

## 6. Dogfooding verdict (the U9 evidence, carried)

The U9 record (`stage-5-dogfooding.md`, commit `b1d7d4d`) stands: **GREEN
with two recorded radix-lane gaps** — the harness fake DOM (both copies) is
authored as Faber source (`scripta/harness_dom.fab`, en locale,
self-contained, 1118 lines) and emits to TS via the provider-module emit
pattern; `scripta/dom-shim.ts` is deleted; the embedded copies in
`check-forms-interactive` / `check-reference` are removed; the four
interactive harnesses consume the emitted module. The assertion/orchestration
drivers ride the hardening executed lane (recorded, not a Stage-5 blocker).
The U9 boundary's six-gate run was green; the U10 official run (this
record, §4) confirms the full seven-gate surface stays green together —
including `check-reference`, which U9's six-gate list did not include.

## 7. Fire-9 honored — every U1-enumerated consumer exercised or flagged

| Consumer (stage-5-discovery.md §3) | At this boundary |
| --- | --- |
| **The reference module** (`tela:reference`) | **Exercised** — parsed by `check-compile`; emitted + assembled by `check-determinism`; mounted by `check-reference` |
| **The consumer app** (`canary-app`) | **Exercised** — the final-composition runner (check-determinism), `check-mount`, `check-forms-proof` Lane B, `check-forms-interactive`, `check-reference` |
| **The exempla** (tela `exempla/*.fab` + the forms exempla) | **Exercised** — `check-exempla` + `check-forms-proof` Lane A (node runtime gates execute the asserts) |
| **The check harnesses** | **Exercised** — all seven run green at this boundary (the official run, §4) |
| **Any third-party package** | **Flagged + the shape-proven route** — the U1 probe (i) proved a `tela:reference`-shape module is consumable through NORMAL qualified imports; the **extension-lib** is the live in-repo package consumer, exercised at this boundary (emitted + assembled in check-determinism, Lane B in check-forms-proof). No other third-party consumer exists today. |

## 8. Residuals (carried — none new at this boundary)

1. **`fix:codegen001`** — the Rust primary determinism path (provider-module
   locale propagation); re-recorded at this boundary (§5). Not a Stage-5
   blocker (the TS-lane composition is the proven lane; R2 sha-equality
   note restated).
2. **`fix:copia-iteration`** — radix-lane gap (copia read-back); the
   tabula-backed work-around is in the authored fake DOM (U9).
3. **`fix:codegen002`** — the TS-emitter helper-name collision (RHS variable
   named `value`); the `attr_value` spelling is in the authored module (U9).
4. **`fix:prim-nullable`** — the nullable-list method-call work-around (the
   `not is null` narrow pattern), pervasive in `browser.fab` + the authored
   module.
5. **`fix:verum-b`** — en naming rule: no `verum`/`falsum` identifiers
   (enforced; zero hits).
6. **`fix:g4`** (partial, host-side) — the 9 `dom.on*` WARN014 export skips
   on the la provider's own handler-typed exports; tela consumers read the
   seam through the documented host binding at the harness boundary. The
   tela/forms surface has 0 skips.
7. **The hardening executed lane** — the assertion/orchestration drivers,
   the global-install wiring, the provider-type declarations stay TS (the
   U9 posture split; a follow-on wave, not a Stage-5 blocker).
8. **The routed async-gap** — no fetch/async claims; synchronous-only
   interaction gates.
9. **U9's reference-staleness repairs** (check-mount/check-forms-interactive/
   check-forms-proof/check-determinism binding `tela:reference` + the
   canary's `reference_theme`) are pre-existing repairs folded into U9 —
   the full-surface run confirms them green together.
10. **faber-lane tooling items** (the CLI reader-pack path + the stale
    `~/.cargo/bin/faber` symlink + the cross-package `-t faber` exempla
    emit edge) — recorded in the U1 record; faber-lane, not tela defects.
    The CTO caveat applies: `-t faber`/`format` locale commands are
    probe-verification only, never a source-conversion tool.

## 9. Exact commands

```
cd tela
./scripta/check-compile
./scripta/check-exempla
./scripta/check-mount
./scripta/check-determinism
./scripta/check-forms-proof
./scripta/check-forms-interactive
./scripta/check-reference
git diff --check
```

Each gate: `radix check` (where it runs), TS-lane emit + assemble +
`tsc --noEmit --strict`, `node` (fail-closed — every assertion executes).
`check-determinism` attempts the Rust primary path first (recorded
CODEGEN001 block, §5), then the TS-lane composition double-build +
byte-compare + double-emit byte-identity + `tsc --noEmit`.

## 10. Cargo discipline

No cargo suites were run at this boundary beyond the existing in-tree radix
binary (the `check-determinism` Rust-path attempt emits to a scratch crate
in `/tmp` only if the emit succeeds; at this boundary it failed CODEGEN001
before any cargo ran). The radix ladder stages 4–6 / `--e2e` /
`release-gate` are auditor-owned and were NOT run. The full-surface run
above is the one official run; reviewer/auditor re-runs are named test
owners (the fire-9 norm).

## 11. Non-goals honored

No real-browser suite. No radix-lane fixes. No `CAMPAIGN.md` edits (the
goal Status flip + acceptance is closeout-owned — decision D3). The stage
record documents the catalog, the proofs, the a11y matrix, the dogfooding
verdict, the residuals, and the exact commands — this record.
