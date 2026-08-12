# Stage 6 Admission Condition 3 — Evidence Record (the post-WSI seven-gate re-run + the fresh determinism SHA)

**Status**: active (evidence for the Stage 6 admission condition 3 — the
post-WSI re-run of the seven Stage 5 gates + the two ported runtime/contract
tests + a fresh determinism SHA)
**Predecessor**: `tela mvp CAMPAIGN.md` Stage 6 CONDITIONALLY ADMITTED
(phase-close review 2026-08-10, head-cpo advisory `a909b339`); the
web-surface-import flip/evidence boundary LANDED (U4–U6, 2026-08-11) —
admission conditions 1–2 met. This record executes admission condition 3.
**Read scope consumed**: the WSI emission (`web-surface-import/EVIDENCE.md`,
the official post-flip boundary), the Stage 5 U10 evidence pattern
(`stage-5-evidence.md`), the seven harnesses + the two ported tests, the
current post-WSI tela state at main `4d95bf9`.
**Hand**: test-1 (test-lane packet `worktrees/test-1/tela`). **Date**:
2026-08-11 (in-tree radix **0.81.0**, built in-packet).

## Verdict

**GREEN — the full post-WSI tela surface runs green once at this boundary**
(the seven Stage 5 gates + the two ported `tela:dom` tests, one official
fail-closed run). The final composition double-builds **byte-identical**; the
determinism sha **re-records** to
`6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` —
**unchanged from the Stage 5 U9/U10 + WSI-U4/U6 records** (the post-WSI
composition produces identical bytes; the honest flag — no supersession, the
re-record at this boundary stands as the post-WSI baseline). The Rust primary
path was **attempted** and BLOCKED by the recorded CODEGEN001 defect
(re-recorded; `fix:codegen001`); the proven TS-lane composition lane carried
the gate (not weakened). `git diff --check` clean.

---

## 1. The full-surface run — one official run, fail-closed

The seven harnesses + the two ported tests ran **once** at this boundary
(2026-08-11, test-lane packet `worktrees/test-1/tela`, in-tree radix 0.81.0 —
the tela-lane convention, NOT the on-PATH faber CLI):

```
check-compile:           GREEN — radix check on src/{tela,validate,reference,dom,canvas2d}.fab (container libhome) + the benchmark packages (canary shows the 9 dom.on* WARN014 skips from tela:dom)
check-exempla:           GREEN — every exempla/*.fab (incl. browser DomNode/identity fixtures + reference wiring): radix check + TS lane + node runtime gate
check-mount:             GREEN — the segmented-control interaction gate (scripted sequence; node exit 0)
check-determinism:       GREEN — the final composition double-built twice, byte-identical; tsc --noEmit on the assembled composition green; Rust primary path ATTEMPTED + CODEGEN001 recorded
check-forms-proof:       GREEN — package exempla gate + consumer assembly gate (node exit 0)
check-forms-interactive: GREEN — the real provider seam (tela:dom → bindings → runtime/dom.ts), scripted interaction sequence (node exit 0)
check-reference:         GREEN — layout + typography + panel + badge + metric + table + segmented-control + button + field mount + structure/a11y + field behavior + declared interaction cases (node exit 0)

ported contract-test:    GREEN — tsc --strict --module CommonJS; node — "contract-test: OK — 2 module(s), 57 route(s) verified"
ported dom-runtime-test: GREEN — tsc (test + runtime/dom.ts) --strict --module CommonJS; node exit 0 (assert suite; silent on success)
```

Any failure or non-zero exit FAILS the run (fail-closed). Runner tails,
verbatim:

```
check-compile: green
check-exempla: green
segmented control interaction gate green (scripted sequence; tela-s3-u4)
check-mount: green (segmented-control interaction gate; node exit 0)
check-determinism: green (byte-identical double build; build/ has the evidence)
check-forms-proof: green (package exempla gate + consumer assembly gate; node exit 0)
forms interactive provider-seam gate green (scripted sequence; tela-s4-u7)
check-forms-interactive: green (real provider seam; scripted sequence; node exit 0)
reference catalog mount gate green (layout + typography + panel + badge + metric + table + segmented-control + button + field mount + structure/a11y + field behavior + declared interaction; tela-s5-u2/u3/u4/u5/u6/u7/u8)
check-reference: green (real provider seam; … ; node exit 0)
contract-test: OK — 2 module(s), 57 route(s) verified
```

## 2. Determinism — re-recorded at the admission-condition-3 boundary

### Hashes (build/hashes.txt — re-recorded by this run)

```text
static-1 sha256: 6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194
static-2 sha256: 6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194
byte-identical: yes
```

The two builds of the **final composition** — tela kernel (valida + tela) +
reference + formslib + extension-lib + canary-app, incl. the emitted
`tela:dom` seam + the `tela:browser` binding — are **byte-identical**
(fail-closed: any diff exits non-zero and fails the gate).

### The supersession chain (honest record)

| Record | sha | Note |
| --- | --- | --- |
| Stage 4 U7 (`stage-4-interactive.md`) | `8dfcb1430e44758df824bc8b68943915caac499dfb7a110d6bf4800dccb50a04` | pre-Stage-5 |
| Stage 5 U9/U10 (official Stage 5) | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | U9 rewire superseded `8dfcb143…`; U10 ratified |
| WSI-U4 flip (`65b38e6`) | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | static output **unchanged** by the flip (DELIVERY §5.4 point 7) |
| WSI-U6 (official post-flip) | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | composition **unchanged** since Stage 5 U9; U6 authored no product code. **No supersession.** |
| **Stage 6 admission condition 3 (this record)** | `6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194` | **fresh re-record** at the post-WSI boundary — the double-build was run anew at this boundary and is byte-identical; the sha **STANDS** (same bytes; no supersession). The re-recorded sha is the post-WSI baseline for Stage 6. |

The admission-condition sha-churn expectation (a new hash value at this
boundary) did not materialize because the post-WSI composition produces
identical bytes to the Stage 5 U9 / WSI-U6 records — the honest flag is
recorded here, exactly as at the Stage 5 U10 and WSI-U6 boundaries: no
product code, no runner change, same byte output, same sha. The re-record at
this boundary (a genuinely new run, `build/hashes.txt` regenerated) is the
fresh determinism evidence that admission condition 3 requires.

### The Rust primary path — attempted + the defect re-recorded

The Rust lane is the **primary** determinism path and is **attempted first**
by `check-determinism` (no code path skips it). At this boundary it fired the
recorded defect:

```
Rust path: BLOCKED — error[CODEGEN001]:
  proof/benchmark/canary-app/src/main.fab: code generation failed:
  internal: definition id 4117 could not be resolved during code generation
```

**`fix:codegen001`** — the recorded radix-lane defect (provider modules
re-analyzed without the en reader locale; the import-bearing Rust emit fails
at codegen). The gate **falls back to the proven TS-lane composition lane** —
it is NOT weakened. **R2 sha-equality note restated**: when CODEGEN001 lands,
the Rust-lane capture must equal the TS-lane capture (sha equality), and the
Rust primary path activates automatically — no harness change. Admission
condition 5 (Rust limitations stay explicit until CODEGEN001 fixed and parity
demonstrated) is unaffected by this boundary.

## 3. What this boundary does NOT claim

- No real-browser suite (out of scope; harness/node fidelity only).
- No radix ladder stages 4–6 / `--e2e` / `release-gate` (auditor-owned).
- No `CAMPAIGN.md` edits and no Stage 6 acceptance (Mind/campaign-owned —
  this record is the admission-condition evidence, not the admission).
- No faber-web or radix-lane edits (the tela-lane scope only).
- No re-flip or product change of the WSI emission (FORBIDDEN on this unit —
  the seven gates are a re-RUN, not a re-author).
- No claim that the Rust primary path is green (`fix:codegen001` held).
- Interactive state is time-variant — determinism applies to
  **static/mount-time serialization only**; interaction gates are scripted
  deterministic assertion sequences under node, not racy timing tests.

## 4. Residuals (routed — none new at this boundary)

1. **The 9 `dom.on*` WARN014 skips** — persist on importers of `tela:dom`
   (host-binding read at the harness boundary; `fix:g4` host-side). Recorded-
   not-blocking; removal = grep-replace after the radix fix lands.
2. **`fix:codegen001`** — the Rust primary determinism path (provider-module
   locale propagation). Re-recorded §2 at this boundary. Not a Stage 6
   admission blocker (the TS lane is the ratified Stage 5 baseline; R2
   restated).
3. **`LOCALE002` advisories** — keyword-like spellings on the converted
   modules; left as-landed. Non-blocking.
4. **Tela factory README is stale at main `4d95bf9`** (pre-existing): the
   web-surface-import goal closed (GOAL.md Status) and the mvp
   evidence/dogfooding docs landed after the last regeneration. Factory
   README regeneration is Mind-owned — out of the test-lane write scope.
5. **Stage 6 admission condition 4** (open with one horizontal-bar pattern
   then the full visualization grammar) — a Stage 6 delivery concern, not
   this boundary's evidence.

## 5. Exact commands (the official run)

From the tela repo root (the test-lane packet), with the in-tree radix binary
(`../radix/target/debug/radix`, 0.81.0, built in-packet) and `PATH` carrying
`tsc` + `node`:

```bash
# Seven harness gates (fail-closed; any non-zero exits the gate)
./scripta/check-compile
./scripta/check-exempla
./scripta/check-mount
./scripta/check-determinism      # writes build/{static-1,static-2,hashes}.txt
./scripta/check-forms-proof
./scripta/check-forms-interactive
./scripta/check-reference

# Two ported tests (tela:dom route bijection + runtime behavior)
SCRATCH=$(mktemp -d /tmp/tela-test1-cond3.XXXXXX)
tsc --strict --module CommonJS --esModuleInterop --outDir "$SCRATCH" \
  tests/contract-test.ts
node "$SCRATCH/contract-test.js"
# → contract-test: OK — 2 module(s), 57 route(s) verified

tsc --strict --module CommonJS --esModuleInterop --outDir "$SCRATCH" \
  tests/dom-runtime-test.ts runtime/dom.ts
node "$SCRATCH/tests/dom-runtime-test.js"
# → exit 0 (assert suite; silent on success)

# Rust primary path (attempted; expected BLOCKED — never the gate)
../radix/target/debug/radix emit -t rust --locale en \
  proof/benchmark/canary-app/src/main.fab
# → error[CODEGEN001]: definition id 4117 could not be resolved …

# Hygiene
git diff --check
```

Cargo discipline: no workspace cargo suites; the in-packet radix binary was
built once (`cargo build -p radix --bin radix` in the packet — isolation is
the point) and the gates then ran without further cargo.
