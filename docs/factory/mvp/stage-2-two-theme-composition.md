# Stage 2 U3 — Two-Theme Composition Record

**Status**: active (evidence for `tela-s2-u3-two-theme-composition`)
**Unit spec**: `tela/docs/factory/mvp/stage-2-delivery.md` U3 (wave 3;
depends on U1 `e194621` + U2 `bd3130e`)
**Campaign**: `CAMPAIGN.md` Stage 2 gate bullets 1 + 2 — "two materially
different themes render the same component tree" and "namespaced extension
tokens work"
**Baseline**: kernel theme/token + assembly surface (U1/U2), Stage 1
benchmark packages (U5)

---

## 1. What U3 delivers

The benchmark composition renders the **same component tree under two
materially different `Thema` values** with no component changes. The
extension contributes a second token collection (tenebrae/dark); the app
builds two themes from the core baseline + the extension's namespaced
tokens and renders the full cascade under each on the TS lane (the proven
runtime lane).

| Deliverable | Location | Content |
| --- | --- | --- |
| Extension tokens | `proof/benchmark/extension-lib/src/extension.fab` | Light + dark namespaced tokens: `chart.axis.muted` (`#6b7280` / `#9ca3af`), `chart.grid.muted` (`#e5e7eb` / `#1f2937`), zero-arg accessors per the G4-safe seam |
| Two-theme runner | `proof/benchmark/canary-app/src/main.fab` | Same `arbor` (panel > metric table + bar meter); `lumen` + `tenebrae` `Thema` values; full cascade per theme via `tela.assemble`; runtime asserts: HTML byte-identity, token layers differ; prints HTML once + both cascades |
| Evidence record | `docs/factory/mvp/stage-2-two-theme-composition.md` | This file |

The component tree is **unchanged** from Stage 1 U5 (panelum, metrica_tabula,
bar_metrum_app — same helpers, same structure). The extension-lib remains a
**separate package** (own `faber.toml`, provider `extensionlib`).

## 2. The two themes

| Token | `lumen` (light) | `tenebrae` (dark) |
| --- | --- | --- |
| `surface.canvas` | `#ffffff` | `#0f172a` |
| `surface.panel` | `#f9fafb` | `#1e293b` |
| `text.primary` | `#111827` | `#f8fafc` |
| `text.muted` | `#6b7280` | `#94a3b8` |
| `border.default` | `#e5e7eb` | `#334155` |
| `accent.primary` | `#2563eb` | `#3b82f6` |
| `state.positive` | `#16a34a` | `#22c55e` |
| `state.caution` | `#d97706` | `#f59e0b` |
| `chart.axis.muted` (extension) | `#6b7280` | `#9ca3af` |
| `chart.grid.muted` (extension) | `#e5e7eb` | `#1f2937` |

Both themes cover the 8-token core baseline (U1) plus the extension's
namespaced tokens — collected app-side into kernel `Scopulum` values
(compose-without; the extension keeps its own `Scopulus` local class).

## 3. The gate proof (TS-lane runtime, node exit 0)

The assembled runner asserts and prints:

1. **HTML byte-identity under both themes**: the same `arbor` renders twice
   and the runtime assert `html_a ≡ html_b` passes (themes supply values, not
   markup — campaign §5). The HTML is printed once:

```text
<div aria-label='metric panel' data-tela='canary-panelum'><dl><dt>uptime</dt><dd>99.9%</dd><dt>requests</dt><dd>12 480</dd><dt>error rate</dt><dd>0.02%</dd></dl><div role='meter' aria-label='throughput' data-latitudo='74' data-tela='tela-chart-bar'><span>throughput</span><x-bar><x-fill>7.4 Mbps</x-fill></x-bar></div></div>
```

2. **Materially different token layers**: the runtime assert
   `css_lumen ≠ css_tenebrae` passes. The `:root` token layer differs in
   every token value; the component/library/application bundles are
   identical under both themes (only the token layer changes):

```text
:root { --surface-canvas: #ffffff; --surface-panel: #f9fafb; --text-primary: #111827; --text-muted: #6b7280; --border-default: #e5e7eb; --accent-primary: #2563eb; --state-positive: #16a34a; --state-caution: #d97706; --chart-axis-muted: #6b7280; --chart-grid-muted: #e5e7eb; }\n[data-tela='tela-chart-bar'] { color: var(--chart-axis-muted); display: grid; gap: 0.5rem; }\n[data-tela='canary-panelum'] { display: grid; gap: 1rem; color: var(--chart-axis-muted); }\n
```

```text
:root { --surface-canvas: #0f172a; --surface-panel: #1e293b; --text-primary: #f8fafc; --text-muted: #94a3b8; --border-default: #334155; --accent-primary: #3b82f6; --state-positive: #22c55e; --state-caution: #f59e0b; --chart-axis-muted: #9ca3af; --chart-grid-muted: #1f2937; }\n[data-tela='tela-chart-bar'] { color: var(--chart-axis-muted); display: grid; gap: 0.5rem; }\n[data-tela='canary-panelum'] { display: grid; gap: 1rem; color: var(--chart-axis-muted); }\n
```

The cascade order is the U2 layer order: tokens → extensionlib (library) →
canary-app (application).

## 4. Extension-token seam (gate bullet 2)

The extension's namespaced tokens (`chart.axis.muted`, `chart.grid.muted`)
are declared as extension-local `Scopulus` values with zero-arg accessors
and **collected app-side** into kernel `Scopulum` values. The seam resolves
cross-package: `ext.chart_axis_muted()` etc. are callable from the app and
their `.nomen`/`.valor` fields are readable (see §5 for the workaround
shape). No cross-package Visus-returning helper is called — the G4
compose-without default holds.

## 5. fix:<id> markers applied

- **fix:snapshot-nomen-collision (NEW observation, escalated to the radix
  lane)**: the extension's local token class was originally named `Scopulum`,
  which collides with the kernel's U1 `Scopulum` type in the shared
  file-interface snapshot — importing both packages made the snapshot skip
  every class-returning export in both providers (WARN014 cascade) and broke
  the app's token binding. Workaround: the extension's local token class is
  renamed **`Scopulus`** (extension-local classes must avoid kernel type
  names). Additionally the extension-local class name is not a nameable
  qualified type from the app (`SEM002 qualified_type_not_exported`), so
  consumers read tokens via field access on the zero-arg accessor call
  results (`tela.scopulum(ext.chart_axis_muted().nomen,
  ext.chart_axis_muted().valor)`). Removal of both workarounds is a
  grep-replace after the radix snapshot fix lands.
- **fix:g4** (pre-existing): `ext.bar_metrum` (→ `tela.Visus`) is skipped in
  the cross-package export snapshot (WARN014) — the app composes the meter
  with `tela` constructors (unchanged from U5).
- **fix:ts-emitter** (pre-existing, observed): the `css()` serializer's
  `"}\n"` emits as a literal backslash-n in the TS lane (the emitter
  double-escapes backslash escapes), so the rendered CSS bytes carry literal
  `\n` between rules. Deterministic (identical bytes on every build), CSS-
  parseable, recorded not fought. No exact-byte assertion depends on it.
- **fix:codegen001** (pre-existing): the Rust emit-across-imports block
  (provider-module locale propagation). The Rust path was attempted and
  recorded; the TS lane is the proven runtime lane.

## 6. Toolchain and validation (one closeout)

- Radix binary: `radix/target/debug/radix` (0.80.0, in-tree).
- `FABER_LIBRARY_HOME=tela/proof/benchmark/libhome` (the benchmark libhome:
  `tela → ../../..`, `extensionlib → ../extension-lib`).
- `radix check --locale en` on both packages under the libhome: **green**
  (`ok:`; the only WARN014 is the pre-existing `ext.bar_metrum` G4 skip).
- TS lane: emit (valida, tela, extension, canary) + assemble into one module
  + `tsc --noEmit --strict`: **green**.
- TS-lane runtime: `node` on the assembled runner: **exit 0** — both gate
  asserts executed and passed; output above.
- Rust lane: import-bearing `tela.fab` emit → `CODEGEN001` recorded
  (fix:codegen001); the import-free `valida.fab` lane is the green proven
  lane.
- `git diff --check`: clean.

## 7. U5 double-build hook

`check-determinism` (U5) extends to this runner: build the composition twice
on the TS lane and byte-compare (fail-closed; sha256 into `build/hashes.txt`).
The runner prints the HTML once + both cascades; the HTML section is
theme-independent by construction and asserted byte-identical in-process.
R2 (Rust-lane sha-equality) activates when CODEGEN001 lands.

## 8. Residuals

- `check-exempla` gains the runtime gate + the thema/assemble wiring (U5).
- `check-determinism` extends to the two-theme composition (U5).
- `fix:snapshot-nomen-collision` routed to the radix lane (the shared
  file-interface snapshot should tolerate same-named local classes across
  providers; and export local class names as qualified type references).
- No CAMPAIGN.md edits (closeout-owned); no component changes (the point);
  no radix-lane fixes.
