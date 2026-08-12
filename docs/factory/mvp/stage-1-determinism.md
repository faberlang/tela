# Stage 1 U6 — Package Tests + Determinism Record

**Status**: active (tests + determinism evidence for `tela-s1-u6-tests-determinism`)
**Hand**: hand-6, 2026-08-09
**Unit spec**: `tela/docs/factory/mvp/stage-1-delivery.md` U6 (wave 5;
depends on U5 `d71e29f`)
**Campaign**: `CAMPAIGN.md` Stage 1 gate — "Deterministic HTML + initial CSS
serialization" (double-build evidence) and "Package tests" (compile /
exempla / determinism harnesses)

---

## 1. What U6 delivers

The package test surface and the deterministic double-build evidence for the
Stage 1 capstone:

| Deliverable | Location | Role |
| --- | --- | --- |
| Compile harness | `scripta/check-compile` | `radix check` every `src/*.fab` (kernel + validation under the container library home) + both benchmark packages (under the benchmark libhome) |
| Exempla harness | `scripta/check-exempla` | `radix check` every `exempla/*.fab` + the TS lane (emit the import-free kernel-side modules, assemble each import-bearing exempla into one self-contained file, `tsc --noEmit` strict) |
| Determinism harness | `scripta/check-determinism` | Builds the benchmark composition static output TWICE and byte-compares; a diff FAILS the check (fail-closed); writes `build/static-1.txt`, `build/static-2.txt`, `build/hashes.txt` |
| Evidence record | `docs/factory/mvp/stage-1-determinism.md` | This file |
| `.gitignore` | `.gitignore` | `build/` (harness outputs land under the repo) |

## 2. Toolchain and environment

- Radix binary: **`radix/target/debug/radix` (0.80.0, in-tree build)** — the
  installed `~/.cargo/bin/radix` (0.78.0) predates the corpus sugar; not
  representative.
- **Locale flag note:** the tela/triga packages read English (`faber.toml`
  `[reader] locale = "en"`); the current radix 0.80.0 binary takes the reader
  locale as **`--locale en`**. triga's `scripta/` scripts still pass the
  renamed `--locale-pack <FILE>` spelling (it errors with a "similar argument
  exists" tip on 0.80.0); the tela harnesses use `--locale en` directly.
- Cargo discipline: Rust-lane cargo runs in scratch dirs OUTSIDE the shared
  workspace (`mktemp` under `${TMPDIR:-/tmp}`); no workspace suites.
- The TS lane needs `node` (runtime) and `tsc` (typecheck) on PATH.

## 3. Determinism evidence — the double build

Exact commands (the harness, `scripta/check-determinism`):

```text
cd tela
./scripta/check-determinism
```

What it does, in order:

1. **Rust path (primary, attempted):** `radix emit -t rust --locale en
   proof/benchmark/canary-app/src/main.fab` → scratch crate (Cargo.toml with
   `faber = { package = "faber-runtime", path = "../faber/runtime/rust" }`) →
   `cargo run` twice → capture HTML/CSS to `build/static-1.txt` /
   `build/static-2.txt`.
   **BLOCKED** (recorded radix-lane defect): the emit fails
   `CODEGEN001` — provider modules (`tela`, `extensionlib`) are re-analyzed
   WITHOUT the en reader locale (PARSE030/PARSE001). This is the
   provider-module locale-propagation defect from the U3/U5 escalation
   (`stage-1-benchmark-static.md` §3). The path is attempted every run and
   the defect is recorded; the gate is **not** weakened to make Rust pass.
2. **TS-lane composition lane (proven fallback, per delivery U6 (e)):**
   `radix emit -t ts --locale en` on `src/valida.fab`, `src/tela.fab`,
   `proof/benchmark/extension-lib/src/extension.fab`,
   `proof/benchmark/canary-app/src/main.fab`; double-emit byte-identity check
   on the kernel; the four emitted files are assembled into ONE
   self-contained module (radix header + import lines dropped, imported
   namespaces bound as const objects — no runtime imports); `node` runs it
   twice → `build/static-1.txt` / `build/static-2.txt`.
3. **Fail-closed compare:** `cmp -s` on the two captures — a diff exits 1 and
   FAILS the check.
4. **Hashes:** sha256 of both captures written to `build/hashes.txt`.
5. **TS lane analog:** `tsc --noEmit --strict` on the assembled composition.

Closeout result (2026-08-09, one run):

```text
static-1 sha256: a0f1b1cb170eded36c2816011320399080c60644f3182b7bd0167300f1f8613b
static-2 sha256: a0f1b1cb170eded36c2816011320399080c60644f3182b7bd0167300f1f8613b
byte-identical: yes
check-determinism: green (byte-identical double build; build/ has the evidence)
```

The two builds are **byte-for-byte identical** — required; a diff fails the
check (fail-closed). The composition's static output (the U6 runner shape):
the rendered HTML (panel + `dl`/`dt`/`dd` table + bar meter, `data-tela`
identities `canary-panelum` / `tela-chart-bar`, `aria-label`s), both CSS
bundles (author order preserved, `var(--chart-axis-muted)` references), and
the trailing `canary static rendered (token chart.axis.muted; tela-s1-u5)`
line. This sha **matches the U5 double-run evidence** exactly
(`stage-1-benchmark-static.md` §5, `a0f1b1cb…f8613b`) — the harness and the
U5 assembly produce the same bytes.

## 4. Harness summaries (closeout run)

- **`check-compile`** — green. Kernel + validation under the container
  library home (`FABER_LIBRARY_HOME=$ROOT/..`), benchmark packages under the
  benchmark libhome (`FABER_LIBRARY_HOME=$ROOT/proof/benchmark/libhome`);
  expected warnings only (WARN003 public-API functions; WARN014
  `ext.bar_metrum` — the recorded G4 seam).
- **`check-exempla`** — green. `radix check` on `exempla/validation.fab` +
  `exempla/serializer.fab`; TS lane `tsc --noEmit` on the assembled
  `validation-joined.ts` (valida + exempla) and `serializer-joined.ts`
  (valida + tela + exempla). Expected LOCALE002 spelling-suggestion warnings
  only.
- **`check-determinism`** — green, byte-identical (hashes above).

## 5. Escalation-path record (recorded, not papered over)

1. **Rust emit-across-imports block (determinism primary path).** Recorded
   at U3, re-confirmed at U5 and here: `CODEGEN001` — provider modules
   re-analyzed without the en reader locale. The determinism baseline falls
   back to the single-module TS-lane composition runner (proven U3/U5 lane)
   per delivery U6 (e) — never by inlining the kernel into the app. Routed
   to the radix lane (provider-module locale propagation fix).
2. **U2 defect surfaced by a development-time runtime run (new finding).**
   A dev-time runtime execution of the assembled `validation` exempla failed
   at `assert not valida.valida_nomen_in_spatio("img", "svg")`:
   `valida.fab`'s html-only name set (`nomen_html_soli`) **omits `img`**, so
   the predicate returns true (img accepted in svg context) while
   `validation.fab` asserts rejection. The spec gate for check-exempla is
   radix check + the TS lane (tsc) — both green — and the runtime run is not
   part of any gate, so U6 does not fail; the defect is **escalated**, not
   hidden: the U2 owner / radix lane should add `img` to the html-only set
   (one token; makes the implementation match the authored exempla intent)
   and then runtime-verify `validation.fab`. Until then the latent wrong
   assert is known and disclosed.

## 6. U6 residual for the Stage 1 closeout

- Reviewer/auditor re-runs `scripta/check-determinism` as the named test
  owner (Stage 1 review) — the fail-closed gate is the `cmp` on
  `build/static-1.txt` vs `build/static-2.txt`.
- Once the radix provider-module locale-propagation fix lands, the Rust
  primary path in `check-determinism` activates automatically (no harness
  change); the TS-lane sha should then be confirmed equal to the Rust-lane
  capture.
