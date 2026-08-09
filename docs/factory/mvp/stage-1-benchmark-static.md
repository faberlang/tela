# Stage 1 U5 — Benchmark Static Composition Record

**Status**: active (benchmark evidence for `tela-s1-u5-benchmark-static`)
**Hand**: hand-6, 2026-08-09
**Unit spec**: `tela/docs/factory/mvp/stage-1-delivery.md` U5 (wave 4;
depends on U3 `05909f7`)
**Campaign**: `CAMPAIGN.md` §10 (first vertical proof — static half: themed
panel, two-column metric table, horizontal bar meter with label + textual
value, static HTML/CSS output through the kernel)
**Baseline**: kernel `tela/src/tela.fab` (U1 `5bc797e` + U3 `05909f7`),
validation `tela/src/valida.fab` (U2 `836965c`), docs `tela/AGENTS.md` (U4
`20d9bfd`)

---

## 1. What U5 delivers

The static half of the two-package benchmark composition: a **real extension
package** and a **real application package**, both importing `tela:*`, both
passing `radix check` under the benchmark library home, rendering the
campaign §10 composition to static HTML/CSS through the kernel.

| Deliverable | Location | Content |
| --- | --- | --- |
| Extension package | `proof/benchmark/extension-lib/` | Own `faber.toml` (provider `extensionlib`, `kind = "lib"`, flat single module); imports `tela:tela`; defines `bar_metrum(label, valor, latitudo) → tela.Visus`, the namespaced token `chart.axis.muted` (`Scopulum` declared value, `#6b7280`), and `chart_stilum() → tela.Stilum` referencing `var(--chart-axis-muted)` |
| Application package | `proof/benchmark/canary-app/` | Own `faber.toml` (`kind = "app"`); imports `tela:tela` + `extensionlib:extension`; assembles themed panel (`data-tela='canary-panelum'` + `aria-label`), two-column metric table (`dl`/`dt`/`dd`), horizontal bar meter (label + textual value); `main` is the U6 static-render runner — calls `tela.html_visus(arbor)` + `tela.css(…)` and prints the full HTML/CSS bytes |
| Library home | `proof/benchmark/libhome/` | `tela → ../../..` and `extensionlib → ../extension-lib` symlinks (the proven Stage 0 spike mechanism), keeps the benchmark isolated |
| Evidence record | `docs/factory/mvp/stage-1-benchmark-static.md` | This file |

`extension-lib` is a **separate package**: own directory + `faber.toml` +
provider identity, imported through the library-home provider machinery — a
same-file "extension" does not close this gate (reviewer package-boundary
check applies).

## 2. Toolchain and environment

- Radix binary: **`radix/target/debug/radix` (0.80.0, in-tree build)** — the
  installed `~/.cargo/bin/radix` (0.78.0) predates the corpus sugar; not
  representative.
- Surface: corpus exempla mode (`+++` frontmatter, `locale = "en"`), the
  surface the exempla ratchet and emitters are proven on.
- Import mechanism: `provider:module` resolved via
  `FABER_LIBRARY_HOME=tela/proof/benchmark/libhome` (resolves `tela` +
  `extensionlib`).
- Cargo discipline: no workspace suites; Rust-lane checks in scratch dirs
  outside the shared workspace.

## 3. Exercised seams and outcomes

| Seam | Attempt | Outcome |
| --- | --- | --- |
| G2 wildcard + qualified import | `import from "tela:tela" public * ut tela` (extension), `private tela` / `public * ut ext` (app) | **Closed.** All qualified references (`tela.Visus`, `tela.elementum_omne`, `tela.html_spatium`, `ext.chart_stilum`, `ext.Scopulum`) resolve. |
| G1 namespace values | `tela.html_spatium()` / `tela.svg_spatium()` helpers | **Closed** (recorded workaround, not fought). |
| G3 imported-union construction | kernel-owned constructors (`elementum_omne`, `elementum_view`, `textus_view`, …) | **Closed** (recorded workaround). |
| G5 `html` verb | spec `tela.html(arbor)` | **Deviation (spec-vs-live).** The exact `html` verb collides with the `Spatium.html` enum-member top-level binding (SEM005.duplicate_definition; G5, `stage-0-canary.md` §5; recorded in `tela.fab` header). The app calls **`tela.html_visus(arbor)`** — the G5 workaround spelling (`html_` prefix), escalated To mind at U3 (`fb0278e3`). `css` is verbatim. |
| **G4 cross-package helper** | `ext.bar_metrum(...)` (signature `→ tela.Visus`) from the app | **ESCALATION (confirmed against the kernel).** The export snapshot skips `bar_metrum` — `WARN014.file_interface_export_skipped:ext.bar_metrum` — so the cross-package call fails to resolve (SEM010). `ext.chart_stilum()` (also `tela.Stilum`-returning) and `ext.chart_axis_muted()` **resolve**. Per the U5 documented workaround: the app composes the bar meter with `tela` constructors (`bar_metrum_app`, same DOM shape) and consumes the extension's token + style bundle. Contract not weakened: the extension **keeps** its `bar_metrum` seam, and no duplicated `Visus` exists IN the extension. Routed to the radix lane (G4 delivery). |
| Emit-across-imports (Rust) | `radix emit -t rust` on both packages | **ESCALATION (blocked).** `CODEGEN001` — provider module `tela` re-analyzed WITHOUT the en reader pack (PARSE030/PARSE001; the provider-module locale-propagation defect, recorded at U3). Rust static-render is deferred to the U6 fallback lane. |

## 4. Rendered static HTML/CSS (composition renders — done_when (d))

Primary path (Rust emit + run) is blocked by the emit-across-imports
escalation (§3). Evidence here is **actual rendered output** through the
emitted kernel serializer code, produced by the TS lane: each module
(`valida`, `tela`, `extension`, `main`) emitted with `radix emit -t ts`,
assembled into one file (imports rewritten to namespaces), executed with
node — not a hand-trace. A hand-traced structural assertion of the same
markup is given below the bytes and is **explicitly labeled as such**.

Rendered HTML (TS-lane execution, one line):

```html
<div aria-label='metric panel' data-tela='canary-panelum'><dl><dt>uptime</dt><dd>99.9%</dd><dt>requests</dt><dd>12 480</dd><dt>error rate</dt><dd>0.02%</dd></dl><div role='meter' aria-label='throughput' data-latitudo='74' data-tela='tela-chart-bar'><span>throughput</span><x-bar><x-fill>7.4 Mbps</x-fill></x-bar></div></div>
```

Rendered CSS (both bundles, author order preserved; `\n` shows literally in
the TS lane — the recorded TS emitter double-escape of backslash escapes; the
Rust lane would carry real newlines, U6 lane note):

```css
[data-tela='canary-panelum'] { display: grid; gap: 1rem; color: var(--chart-axis-muted); }
[data-tela='tela-chart-bar'] { color: var(--chart-axis-muted); display: grid; gap: 0.5rem; }
```

Trailing runner line: `canary static rendered (token chart.axis.muted; tela-s1-u5)`.

Composition coverage (campaign §10 static half): themed panel with stable
`data-tela` identity + `aria-label` ✓; two-column metric table (`dl`/`dt`/
`dd`, 3 label/value pairs) ✓; horizontal bar meter with label + textual
value (`span` label, `x-bar`/`x-fill` with `7.4 Mbps`) ✓; static HTML/CSS
output through the kernel ✓. The extension's namespaced token
`chart.axis.muted` is declared (`Scopulum { nomen = "chart.axis.muted",
valor = "#6b7280" }`) and referenced as `var(--chart-axis-muted)` by both
style bundles — token **rendering** is Stage 2.

*Hand-traced structural assertion (labeled, for the blocked Rust path):* the
arbor is `Elementum(div, identitas canary-panelum, [aria-label])` containing
`Elementum(dl, [3× (dt,dd)])` and the bar meter `Elementum(div, identitas
tela-chart-bar, [role, aria-label, data-latitudo])` containing
`Elementum(span, [textus(label)])` + `Elementum(x-bar, [Elementum(x-fill,
[textus(valor)])])`. This matches the actual TS-lane bytes above.

## 5. U6 double-build hook (determinism)

- The composition runner is `proof/benchmark/canary-app/src/main.fab` — its
  `main` prints the full HTML + CSS bytes to stdout.
- TS-lane double-run of the assembled composition: two executions are
  **byte-identical** (`cmp` clean), sha256
  `a0f1b1cb170eded36c2816011320399080c60644f3182b7bd0167300f1f8613b`
  (single-module assembler + emitted modules under `/tmp/tela-u5-ts`).
- `tsc --noEmit` (strict) on the assembled composition: green (exit 0).
- Rust-lane double-build: blocked by the §3 emit escalation; U6 falls back to
  the single-module proven lane per the U6 escalation path (never by inlining
  the kernel into the app).

## 6. Validation (closeout, exactly one run)

```text
R=radix/target/debug/radix
export FABER_LIBRARY_HOME=tela/proof/benchmark/libhome
$R check --locale en proof/benchmark/extension-lib/src/extension.fab   # ok (WARN003 public-API only)
$R check --locale en proof/benchmark/canary-app/src/main.fab           # ok (WARN014 ext.bar_metrum — the recorded G4 seam)
git diff --check                                                       # clean
```

Results at closeout: both packages `ok` under the benchmark library home;
`git diff --check` clean. Reviewer package-boundary check: separate
directories + `faber.toml` per package, imported via the libhome provider
machinery — not a same-file extension.
