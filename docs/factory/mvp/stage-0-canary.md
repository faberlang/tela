# Stage 0 U4 — Two-Package Extension Canary Record

**Status**: active (canary evidence for `tela-s0-u4-two-package-canary`)
**Hand**: hand-7, 2026-08-09
**Unit spec**: `tela/docs/factory/mvp/stage-0-delivery.md` U4 (load-bearing
early extension gate — campaign review item 6)
**Campaign**: `CAMPAIGN.md` §3/§9/§10 (extension contract; first vertical
proof must be two-package)
**Identity lock**: `stage-0-ownership.md` (repo/package/provider `tela`)
**Branch decision input**: `spike/stage-0-branch-a-b-evidence.md` (Branch B:
pure non-generic `Visus` view tree + adjacent typed behavior plan)

---

## 1. What the canary proves

The campaign gate (review item 6): *"a checked two-package Faber spike has one
extension library define a custom view helper and namespaced token, and one
application consume them in the benchmark panel/table/bar composition"* —
**closed with public shape only, no Tela/radix/faber-web edits.**

| Deliverable | Location | Content |
| --- | --- | --- |
| Extension package | `spike/extension-lib/` | Decided Branch B view protocol values + standard constructors + custom helper `bar_metrum` + namespaced token `chart.axis.muted` + component style bundle |
| Application package | `spike/canary-app/` | Imports `extensionlib:extension`, assembles panel + two-column metric table + horizontal bar meter (label + textual value) using the extension helper and token |
| Provider alias | `spike/libhome/extensionlib → ../extension-lib` | Alphanumeric provider name for the `provider:module` import form (see §3) |
| Record | `docs/factory/mvp/stage-0-canary.md` | This file |

`extension-lib` is a **separate package**: its own directory and `faber.toml`,
imported by the app through the library-home provider machinery — a same-file
"extension" does not close this gate.

## 2. Toolchain and environment

- Radix binary: **`radix/target/debug/radix` (0.80.0, in-tree build)** — the
  installed `~/.cargo/bin/radix` (0.78.0) predates the corpus sugar and rejects
  these files; not representative.
- Surface: corpus exempla mode (`+++` frontmatter, `locale = "en"`), the
  surface the exempla ratchet and emitters are proven on (same as U3).
- Import mechanism: `provider:module` resolved via `FABER_LIBRARY_HOME`
  (the same machinery the product uses for `norma:*`, `triga:*`).
  `FABER_LIBRARY_HOME=spike/libhome` maps provider `extensionlib` →
  `spike/extension-lib` (symlink), reading the extension package's own
  `faber.toml` `[paths].source`.

## 3. Why the provider alias exists (seam constraint, not a framework edit)

Two import forms are rejected by this radix build by design:
`provider:module` names must be alphanumeric only
(`importa ex "extension-lib:..."` → `SEM006.import_unknown_scheme`), and
relative imports must not contain `..` (`importa ex "../extension-lib/..."` →
`SEM006.import_parent_traversal`). So the declared package directory
`extension-lib` needs an alphanumeric provider alias under the library home.
`spike/libhome/extensionlib` is a symlink to the real package; the alias is
recorded here so reviewers and Stage 1 can re-run the commands.

## 4. Seams exercised (all working, in the canary source)

1. **Package-boundary import resolution** — `importa ex "extensionlib:extension"`
   resolves `libhome/extensionlib` → `extension-lib/faber.toml`
   `[paths].source` → `src/extension.fab`. The app and the lib are different
   packages; no same-file extension.
2. **Qualified type references** — `ext.Visus`, `ext.Scopulum`, `ext.Stilum`,
   `ext.Regula`, `ext.Declaratio`, `list<ext.Visus>` in annotations/params.
3. **Qualified function calls** — `ext.bar_metrum(...)`, `ext.chart_axis_muted()`,
   `ext.chart_stilum()`, `ext.elementum_view(...)`, `ext.nova_identitas(...)`,
   including composite (union) values in parameters and returns.
4. **Class literal construction of imported classes** — `ext.Regula { … }`,
   `ext.Stilum { … }` in the app.
5. **Field access on imported class instances** — `axis_muted.nomen`.
6. **Enum values via namespace-level helper returns** — `ext.html_spatium()`,
   `ext.svg_spatium()` (workaround for gap G1).
7. **Nullable identity routing** — `ext.nova_identitas(...) → Identitas ∪ null`
   (U3 D3 workaround preserved).
8. **Custom helper + namespaced token consumed across the boundary** — the app
   assembles panel/table/bar with `bar_metrum` and references
   `chart.axis.muted` in both the extension bundle and the app's own rule.

## 5. Gaps found (recorded; routed to radix as minimized-delivery candidates)

None of these required framework edits — the canary closes with the working
seams above. Each constrains the *authoring surface* of extension packages and
is a candidate radix minimized delivery (campaign stop condition 7: no
framework-contract weakening was made to hide any of them).

- **G1 — enum member value access through an imported namespace fails.**
  `ext.Spatium.html` in the app → `SEM010.expression_type_mismatch` /
  `argument_type_mismatch`. Workaround: namespace-level helper functions
  (`html_spatium()` / `svg_spatium()`). Repro essence:
  lib exports `enum Spatium { html, svg }`; app references `ext.Spatium.html`.
- **G2 — named type imports do not bind.** `importa ex "m" publica Visus`
  then bare `Visus` in an annotation → `SEM002.unknown_type` (classes, unions,
  and enums alike). Workaround: wildcard import (`* ut ns`) + qualified
  references. Note the app call still resolves through the namespace export
  list; only the type binding fails.
- **G3 — variant construction of an imported union fails, and the qualified
  cast does not parse.** `variant Elementum { … }` in the app → `SEM001.
  unknown_variant`; `∷ ext.Visus` → `PARSE030.expected_expression` (the
  `finge` cast accepts only a bare type name — same defect family as U3 D1).
  Workaround: package-owned constructors (`elementum_view` /
  `elementum_omne`).
- **G4 — a callable whose signature references an imported sibling type is
  skipped in the export snapshot.** A provider module that imports
  (`./sibling` or `provider:sibling`) and exports e.g.
  `fn bar_metrum(...) → visus.Visus` gets that export skipped
  (`WARN014.file_interface_export_skipped`) and consumers see no usable
  signature for it. Workaround: keep provider modules flat (single file) so
  all referenced types are local to the module.
- **G5 — enum members bind as top-level module names.** A `fn html()`
  collides with the `Spatium.html` member binding → `SEM005.
  duplicate_definition`. Naming constraint: prefix helpers
  (`html_spatium`).
- **G6 — reserved conversio keywords are unavailable as identifiers.**
  `fn tabula(...)` collides with the `tabula` type keyword → `PARSE001.
  retired_type_call_constructor`. By-design keyword collision; library authors
  must avoid the reserved spellings.

The package-boundary result stands: the two-package seam closes, and these
gaps refine *how* an extension author must shape a module's public surface in
today's compiler.

## 6. Validation (closeout, exactly one run)

```text
R=radix/target/debug/radix
$R check spike/extension-lib/src/extension.fab                  # ok
FABER_LIBRARY_HOME=$PWD/spike/libhome $R check spike/canary-app/src/main.fab   # ok
# import-resolution: the app's provider import resolves through the library
#   home to the extension package (change the symlink/remove the package → the
#   app check fails with import_resolve_provider_not_found / file_not_found).
git diff --check
```

Results at closeout: extension-lib `ok` (warnings only: unused helpers), app
`ok` (warnings only: unused structural consts), `git diff --check` clean.
Reviewer confirmation requested: **`extension-lib` is a separate package** (own
directory + `faber.toml`, imported via `FABER_LIBRARY_HOME` provider
machinery), not a same-file extension.

## 7. Residuals and routing

- **G1–G4 are minimized compiler-delivery candidates** for radix (name
  resolution + export-snapshot surface). File them with repros when a delivery
  owner is named; none block Stage 1's `View` shape, which the kernel will own
  with its own constructors.
- **Faber dialect / authoring notes** carry into Stage 1: enum members bind
  top-level, reserved conversio keywords are unavailable, and the flat-module
  rule for provider packages (G4) is the safe Stage-1 shape until G4 is fixed.
- Non-goals respected: no behavior/mount (static composition only;
  interactivity is Stage 3), no catalog, no theme rendering (token is declared
  and referenced, not rendered; Stage 2), no `faber-web`/`radix` edits, no
  workspace cargo suites (validation is `radix check` + `git diff --check`
  only, per the delivery spec validation table).

## 8. Commands (recorded)

```text
R=/Users/ianzepp/work/faberlang/radix/target/debug/radix
FABER_LIBRARY_HOME=/Users/ianzepp/work/faberlang/tela/spike/libhome
$R check /Users/ianzepp/work/faberlang/tela/spike/extension-lib/src/extension.fab
FABER_LIBRARY_HOME=$FABER_LIBRARY_HOME $R check /Users/ianzepp/work/faberlang/tela/spike/canary-app/src/main.fab
cd /Users/ianzepp/work/faberlang/tela && git diff --check
```
