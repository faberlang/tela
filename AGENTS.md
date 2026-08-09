# Tela Agent Instructions

Tela is the public Faber view-protocol package — typed HTML/SVG view values,
fail-closed validation, and deterministic HTML + initial CSS serialization
(the `tela:*` provider). The repo is the Stage 1 kernel + static renderer
surface: a real library package (`tela`, provider `tela`) with a flat kernel
module, a flat validation module, and (in later waves) benchmark packages and
package-test harnesses.

This file records the Stage 1 authoring/package conventions so later Hands and
reviewers hit a proven surface. The source of truth for policies and the
stage plan is `docs/factory/mvp/` (policies `stage-0-protocol-policies.md`,
delivery `stage-1-delivery.md`, closeout residuals `tela-closeout.md`). This
file is the operating summary; the docs are the contract.

## Layout

| Path | Role |
| --- | --- |
| `faber.toml` | Package `tela`, provider `tela`, `[paths] source = "src"`, `[build] kind = "lib"`, `targets = ["rust", "ts"]`, `[reader] locale = "en"`, edition 2026, version `0.0.0` (versioning is a Stage 8 decision) |
| `src/tela.fab` | The kernel — **one flat, import-free module** (imported as `tela:tela`), stdlib-only (no `norma`/`triga`/`faber-runtime` dependency) |
| `src/valida.fab` | Validation module (imported as `tela:valida`) — flat, import-free, public surface string/bool only |
| `exempla/` | Exempla-mode tests (`+++` frontmatter, `locale = "en"`); one exempla file per unit surface (e.g. `validation.fab`, `serializer.fab`) |
| `scripta/` | Validation harnesses (Stage 1 U6: `check-compile`, `check-exempla`, `check-determinism`) |
| `docs/design/` | Design records (this stage: `identity-hydration.md`) |
| `docs/factory/mvp/` | Campaign + delivery + policy docs (machine-managed; do not hand-edit `README.md` if present — regenerate) |
| `spike/` | **Frozen Stage 0 evidence — no unit writes here** |
| `proof/benchmark/` | Stage 1 U5 benchmark packages (`extension-lib/`, `canary-app/`, `libhome/`) |

## Authoring constraints (recorded radix-lane workarounds — apply, don't fight)

These are the recorded D/G gaps from Stage 0 evidence
(`spike/stage-0-branch-a-b-evidence.md`, `docs/factory/mvp/stage-0-canary.md`)
and the stage-0 closeout residual ("Faber dialect / authoring notes"). They
constrain authoring surface until radix deliveries land; none are to be hidden
by framework-contract weakening.

- **Flat-module + flat-provider-module rule (G4).** A callable whose signature
  references an imported sibling type is skipped in the export snapshot
  (`WARN014.file_interface_export_skipped`). Provider modules must be **flat
  (single file)** so every referenced type is local to the module. The kernel
  is therefore **one flat, import-free module** (`tela/src/tela.fab`,
  `tela:tela`) — G4-safe and matching the proven spike single-file shape.
- **Enum-member top-level binding (G5).** Enum members bind as top-level
  module names — a `fn html()` collides with the `Spatium.html` member
  binding (`SEM005.duplicate_definition`). Prefix helpers that shadow members
  (`html_spatium`, `svg_spatium`).
- **Reserved-keyword spellings (G6).** Reserved `conversio` keywords are
  unavailable as identifiers — `fn tabula(...)` collides with the `tabula`
  type keyword (`PARSE001.retired_type_call_constructor`). Avoid the reserved
  spellings.
- **Field-name constraint (D2 → `nomen_tag`).** A field named `tag` collides
  with the TS emitter's discriminant (`type U = { tag: "V", tag: string }` →
  TS2300/TS2717). The working spelling is **`nomen_tag`**. (Re-checked clean
  at U1 against in-tree radix 0.80.0; keep the spelling.)
- **Nullable-identity routing (D3 → `nova_identitas`).** Direct non-null
  construction into a nullable union field misses the Rust `Some(...)` wrap
  (cargo E0308). Route non-null identity through the helper
  `nova_identitas(v) → Identitas ∪ null`; keep the workaround until the radix
  D3 delivery lands.
- **Namespace-helper pattern (G1 → `html_spatium`/`svg_spatium`).** Enum
  member value access through an imported namespace fails
  (`ext.Spatium.html` → `SEM010`). Expose namespace values as helper functions
  even inside the kernel module.
- **Imported-union construction (G3 → kernel-owned constructors).** Variant
  construction of an imported union fails and the qualified cast does not
  parse (`variant Elementum {…}` → `SEM001.unknown_variant`; `∷ ext.Visus` →
  `PARSE030`). The kernel owns constructors (`textus_view`,
  `fragmentum_view`, `elementum_view`, `elementum_omne`) over the same public
  values; constructors are ordinary functions, not privileged syntax.
- **Named type imports (G2 → wildcard + qualified).** `importa ex "m" publica
  Visus` then bare `Visus` does not bind (`SEM002.unknown_type`). Use wildcard
  imports (`* ut ns`) + qualified references.
- **Dialect note (spike evidence §6).** Latin keywords (`discretio`, `finge`,
  `ordo`) partially diverge in the 0.80.0 in-tree build — `discretio` did not
  register a usable type name. Author with the spellings the kernel proves:
  `union`, `enum`, `class`, `fn`.

## Vocabulary policy (policy (b))

| Surface | Vocabulary | Examples |
| --- | --- | --- |
| Protocol types + fields (`tela:*`) | **Faber-Latin** | `Visus`, `Elementum`, `Textus`, `Fragmentum`, `Spatium`, `Attributum`, `Proprietas`, `Identitas`; fields `nomen`, `valor`, `liberi`, `attributa`, `proprietates`, `identitas`, `spatium`, `nomen_tag` |
| Renderer / host verbs | **English** | `html`, `css` (the public serializer verbs); `mount`, `replace`, `dispose`, `assemble` |
| Theme tokens | **English web terms** | `surface.canvas`, `text.primary`, `chart.axis.muted`, `form.field.invalid` |
| Extension-contract verbs | **English** | define, return, publish, declare |

`liberi` (not `children`) is locked — the field vocabulary is one consistent
Faber-Latin scheme; the Stage 7 Speculum migration maps `children` → `liberi`
at the boundary. Renderer-internal helpers may follow the spike spellings
(`escapa`, `seri_*`) or English; the public serializer verbs are `html`/`css`.
If a locked verb name collides (G5/G6), **escalate rather than silently
rename** (policy (b) locks the English renderer verbs).

## No raw markup (policy (a))

Tela v1 has no raw-markup `View` variant. The `Visus` union contains exactly
`Elementum`, `Textus`, `Fragmentum` — no `RawHtml`/`RawCss`-style escape in
the ordinary path. Tag/attribute names are lexically + namespace validated at
the serializer boundary; text and attribute values are escaped centrally in
the renderer only. Unknown-but-valid names are **not** rejected for being new
(campaign dependency rule 9).

## Identity serialization (policy (d))

`Identitas` serializes as the `data-tela` attribute — the only identity
serialization form in v1, documented in
[`docs/design/identity-hydration.md`](docs/design/identity-hydration.md).
Non-null `Identitas` only; quote style and escape set follow the spike
baseline (single quotes). `Proprietas` are carried in the tree but **not**
serialized into static HTML in Stage 1 (the `data-prop:` marker is
superseded).

## `FABER_LIBRARY_HOME` mechanics

- The container root `/Users/ianzepp/work/faberlang` is the default library
  home (walks up to the directory containing `norma/src`). Provider `tela`
  resolves from the container root once `tela/faber.toml` + `tela/src/` exist
  (directory name == provider, as with `triga`).
- The benchmark composition (U5) additionally needs `extensionlib` to resolve:
  a benchmark-local `libhome/` (`tela/proof/benchmark/libhome/`) with symlinks
  (`tela → ../../..`, `extensionlib → ../extension-lib`) mirrors the proven
  Stage 0 spike mechanism and keeps the benchmark isolated.
- `FABER_LIBRARY_HOME=<libhome> radix check <package>/src/*.fab` for package
  imports.

## Validation (three lanes)

Use the **in-tree** radix binary `radix/target/debug/radix` (0.80.0) — the
installed `~/.cargo/bin/radix` (0.78.0) predates corpus exempla-mode sugar.
Rust-lane cargo checks run in **scratch dirs outside the shared workspace**
(`/tmp/…`). No workspace cargo suites (Cargo discipline, operator rule
2026-08-07); full radix ladder stages 4–6 / `--e2e` are auditor-owned.

```text
R=radix/target/debug/radix
$R check src/tela.fab --locale en                         # kernel check
$R check src/valida.fab --locale en                       # valida check
$R check exempla/*.fab --locale en                        # exempla-mode check
$R emit -t ts src/tela.fab > <scratch>/x.ts && tsc --noEmit   # TS lane
$R emit -t rust src/tela.fab > /tmp/x.rs                  # Rust lane:
# scratch crate { Cargo.toml, src/main.rs } in /tmp, then cargo check --offline
FABER_LIBRARY_HOME=<libhome> $R check <package>/src/*.fab  # package imports
git diff --check                                          # hygiene in tela/
```

## Stage 1 wave ordering + shared-file constraint

```
Wave 1:  U1 kernel-contract (package scaffold + Branch B types + constructors)
Wave 2:  U2 validation (valida.fab)  ∥  U4 docs (identity + authoring notes)
Wave 3:  U3 serializer (escaping + HTML/CSS serializers + identity emission)
Wave 4:  U5 benchmark-static (two-package composition importing tela:*)
Wave 5:  U6 package-tests + determinism (harnesses + double-build evidence)
```

The kernel module `src/tela.fab` is written by U1 (types + constructors),
then extended by U3 (escaping + serializers) — **strictly sequential**.
`valida.fab` is written by U2 (U3 imports it). Docs (U4) run parallel to U2,
bound to the policy-locked surface. Benchmark (U5) needs the serializer;
tests + determinism (U6) need the composition.

## Branch B (frozen for Stage 1)

The kernel is the Branch B shape — pure non-generic recursive `Visus` +
adjacent typed behavior plan (Stage 3). Branch A (generic `Visus<Message>`)
is the ideal end-state blocked only by radix defect D1; if D1 lands, the
Branch A re-spike is a decision point for a future stage — **never a
mid-stage switch**.
