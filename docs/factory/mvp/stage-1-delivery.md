# Stage 1 — Tela Kernel And Static Renderer — Delivery Spec

**Status**: planned (delivery lowering complete)
**Planner**: planner-1
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` (Stage 1 — "Tela Kernel And Static Renderer", lines 245–258)
**Control-plane repo**: `/Users/ianzepp/work/faberlang/tela` (Stage 1 cwd, locked by `stage-0-ownership.md` U0)
**Baseline carried from Stage 0**: Branch B `View` shape (non-generic; kernel owns constructors; `data-tela` identity); policy locks (a)–(e) from `stage-0-protocol-policies.md`; behavior posture from `stage-0-behavior-design.md`; closeout residuals `tela-closeout.md` §4.
**Mode**: planning artifacts only. This spec lowers the stage; it does not implement.
**Closeout owner**: the tela `CAMPAIGN.md` status line is owned by the stage closeout, not by any unit in this spec.

---

## Phase Intent

Turn the Stage 1 campaign gate into discrete, one-Hand-per-unit implementable
units. Stage 1 establishes the **real reusable `tela` package** (Branch B
kernel + validation + static renderer) with deterministic output and the
**static half of the two-package benchmark composition**, so Stage 2 (style
and theme protocol) and Stage 3 (browser mount and update lifecycle) start
against a frozen view truth and a documented hydration seam.

What Stage 1 is **not**: no style/theme protocol (Stage 2), no browser
mount/behavior lifecycle (Stage 3), no catalog, no product assembly/cascade
ordering (Stage 2), no remote/publication action, no `faber-web` / `radix`
source edits, no Speculum code migration (Stage 7).

---

## Interpreted Scope

Per the Stage 1 gate and campaign §2/§3/§7, Stage 1 must deliver:

1. **Typed HTML/SVG view values** — the Branch B kernel: pure non-generic
   recursive `Visus` tagged union with the open element model, typed
   `Identitas`, `Proprietas` modeled separately from serialized `Attributa`;
   kernel owns constructors. No raw-markup `View` variant (policy (a)).
2. **Explicit stable identity in one documented hydration-ready form** —
   `Identitas` serialized as the `data-tela` attribute (policy (d)); the form
   documented (the gate's "documented hydration-ready form").
3. **Central escaping** — all text and attribute-value serialization flows
   through one escape path in the renderer (policy (a)2; campaign §2: "text
   and attribute escaping occurs only in renderers").
4. **Tag/attribute lexical + namespace validation** — fail-closed lexical
   predicates and namespace/void correctness; unknown-but-valid names are not
   rejected for being new (campaign dependency rule 9).
5. **Deterministic HTML + initial CSS serialization** — the static renderer
   over the structured `Stilum`/`Regula`/`Declaratio` model (smallest honest
   CSS value model, policy (c)); byte-deterministic output.
6. **Deterministic double-build evidence** — the same static output built
   twice, byte-for-byte identical (campaign validation; closeout residual).
7. **Package tests** — a runnable package test surface (compile / exempla /
   determinism harnesses) in the `tela` repo.
8. **Static half of the two-package benchmark composition** — real extension +
   application packages importing `tela:*`, assembling the panel / metric
   table / bar meter composition (campaign §10), rendered to static HTML/CSS.

Coordination constraints carried in (not inventing new scope):

- **Branch A re-spike is a campaign option, not Stage 1 work.** Stage 1 lowers
  on Branch B without waiting for radix D1. If D1 lands mid-stage, the kernel
  unit records the re-spike option; it does not switch the kernel.
- **D0–D3 + G1–G6 are radix-lane inputs.** Stage 1 units apply the recorded
  workarounds (flat-module shape, `nomen_tag`, `nova_identitas`,
  `html_spatium`/`svg_spatium`, wildcard+qualified imports, package-owned
  constructors, reserved-keyword avoidance). Where a defect would force a
  workaround that touches a contract surface (notably G4 on the benchmark
  extension's public helper), the unit **records the escalation and does not
  weaken the contract** — no duplicated view model, no raw strings.
- **No Speculum source wholesale copying.** The kernel contract is extracted
  from the **accepted Branch B spike** (`tela/spike/visus-b.fab`,
  `tela/spike/extension-lib/`, `tela/spike/canary-app/` — Tela's own accepted
  Stage 0 evidence), not from `faberlang.dev`'s `document_ir.fab`. Any
  Speculum context read (`radix/docs/factory/faber-hir-v1/browser-application-delivery.md`)
  is evidence-only; the Stage 7 migration consumes Tela through public package
  imports.
- **TS async `@ futura`/`fac`/`cape` gap is a Stage 3 input.** The Stage 1
  static renderer is synchronous and makes no async or fetch claim. The
  boundary is recorded in the Normalized Spec and the hydration doc.

---

## Normalized Spec

Stage 1 produces, in the `tela` repo: one real **library package** (`tela`,
provider `tela`) whose flat kernel module owns the Branch B view protocol,
kernel constructors, fail-closed validation predicates, central escaping, and
the deterministic HTML + initial CSS serializers; one **validation module**
(string/bool predicate surface, G4-safe); a **docs unit** that documents the
hydration-ready identity form and the Stage 1 authoring/package conventions;
two real **benchmark packages** (extension + application) that import `tela:*`
and assemble the campaign §10 panel/table/bar composition; and a **package
test + determinism unit** (compile/exempla/determinism harnesses plus
byte-identical double-build evidence).

Locked decisions this spec freezes (from Stage 0, not invented here):

- **Kernel shape**: Branch B non-generic `Visus` union — `Elementum`,
  `Textus`, `Fragmentum` only; no raw variant (policy (a)); open element
  model; typed `Identitas`; `Proprietas` separate from `Attributa`; field
  spellings per policy (b) (`nomen_tag` for the D2-safe tag field, `liberi`,
  `valor`, `attributa`, `proprietates`, `identitas`, `spatium`).
- **Vocabulary**: Faber-Latin protocol internals (`Visus`, `Elementum`,
  `Spatium`, `Attributum`, `Proprietas`, `Identitas`, `nomen_tag`, `liberi`);
  English renderer verbs (`html`, `css` — policy (b) locked examples);
  English theme tokens (`chart.axis.muted`). Renderer-internal helpers may
  follow the spike spellings (`escapa`, `seri_*`) or English; the public
  serializer verbs are `html`/`css`.
- **Identity**: non-null `Identitas` serializes as `data-tela="<escaped
  valor>"` — the only identity serialization form in v1 (policy (d)). Quote
  style and escape set follow the spike baseline (single quotes) and are
  documented in `identity-hydration.md`.
- **CSS value openness**: smallest honest model — `Declaratio`/`Regula`/
  `Stilum` structured values (spike shape) serialized deterministically. No
  theme resolution, no cascade layers, no product assembly (Stage 2).
- **Proprietas static posture (spec decision)**: `Proprietas` are typed
  view-tree fields carried for the browser lane (Stage 3) and are **not**
  serialized into static HTML in Stage 1. The spike's provisional
  `data-prop:` marker is **superseded**. Static output carries `Attributa` +
  `Identitas` + text + structure only. This keeps static HTML honest (DOM
  properties are not HTML attributes) and is recorded in the hydration doc.
- **Behavior types stay out of the Stage 1 kernel**: `Eventum`, `Vinculum`,
  `Nuntius`, and application message types are the Stage 3 typed behavior
  plan (Branch B places them in the adjacent plan, not the view tree; the
  kernel cannot own `Vinculum` because its closure field requires a concrete
  application message type). The `data-tela` seam documented here is the
  contract Stage 3 binds to (policy (d)3).
- **Validation boundary**: validation is enforced **before emission** at the
  serializer boundary (fail-closed: invalid lexical shape, namespace misuse,
  or impossible void-element structure never emits markup). Constructors stay
  open (they are ergonomic helpers over the open element model). The concrete
  fail-closed mechanism (error/abort vs. rejecting result) is the implementing
  Hand's choice within the available Faber surface, and must be documented and
  exercised by exempla.
- **Determinism posture**: serializers are pure functions over ordered lists.
  Author order of `attributa`, `liberi`, `regulae`, and `declarationes` is
  preserved; no unordered/hash-ordered emission, no timestamps. Determinism
  is proven empirically by the double-build harness.
- **Package layout**: `tela/faber.toml` (package `tela`, provider `tela`,
  `[paths] source = "src"`, `kind = "lib"`, edition 2026, reader locale `en`,
  targets `rust`+`ts`) following the `triga` sibling convention. Version
  `0.0.0`; versioning is a Stage 8 decision. The kernel is **one flat,
  import-free module** (`tela/src/tela.fab`, imported as `tela:tela`) —
  G4-safe and matching the proven spike single-file shape. The validation
  module is a second flat module (`tela/src/valida.fab`) whose public surface
  is string/bool only (G4-safe). No norma/triga/faber-runtime dependency:
  kernel is stdlib-only, like the U3 spike emit evidence.

---

## Repo-Aware Baseline

Verified by planner-1 (2026-08-09):

- **`tela/`** — sibling git repo on `main`, clean (commit `1c6cba5`, Stage 0
  closeout). Contains `docs/factory/mvp/` (CAMPAIGN.md + 7 stage-0 records)
  and `spike/` (`visus-b.fab`, `extension-lib/`, `canary-app/`,
  `defects/d1-d3`, `libhome/extensionlib` symlink, `ts-scratch/`,
  `stage-0-branch-a-b-evidence.md`). **No** `faber.toml`, `src/`, `exempla/`,
  `scripta/`, `AGENTS.md`, or `docs/design/` yet. `spike/` content is frozen
  Stage 0 evidence — no unit writes there.
- **Sibling package convention** — `triga/faber.toml`: `[package] name
  "triga"`, `[library] provider "triga"`, `[paths] source "src"`,
  `[build] kind "lib"`, `targets ["rust","ts"]`, `[reader] locale "en"`.
  triga's `scripta/check-compile` pattern: `FABER_LIBRARY_HOME` (default the
  container root), `radix check --locale-pack <radix/stdlib/locale/en/pack.toml>`
  per `src/*.fab`.
- **Library home** — `radix/scripta/library-home.sh`: walks up to the
  directory containing `norma/src`; the container root
  `/Users/ianzepp/work/faberlang` is the default library home. Once
  `tela/faber.toml` + `tela/src/` exist, provider `tela` resolves from the
  container root (directory name == provider, as with `triga`). The benchmark
  composition additionally needs `extensionlib` to resolve: a benchmark-local
  `libhome/` with symlinks (`tela → ../../..`, `extensionlib → ../extension-lib`)
  mirrors the proven Stage 0 spike mechanism and keeps the benchmark isolated.
- **Radix binary** — use `radix/target/debug/radix` (0.80.0 in-tree corpus
  build); the installed `~/.cargo/bin/radix` (0.78.0) predates the corpus
  sugar and rejects exempla-mode files (Stage 0 evidence §1). If the in-tree
  binary is absent, building it is a narrow one-shot (`cargo build -p radix
  --bin radix` in `radix/`) or the Hand uses the existing artifact — do not
  run workspace suites.
- **Proven commands to carry** (Stage 0 closeout records) — single-file
  `radix check`; single-file `radix emit -t ts` + `tsc --noEmit`; single-file
  `radix emit -t rust` + scratch-dir `cargo check` outside the shared
  workspace; `FABER_LIBRARY_HOME=<libhome> radix check` for package imports;
  `git diff --check` in `tela/`.
- **Known-open mechanics (risk, not blockers)**: `radix emit` across provider
  imports (`tela:tela` imported by an exempla/app) is **not yet evidenced** —
  the U3 spike emitted an import-free single file only. Units that need
  emitted-and-run output (U3 exempla lane, U5 static render, U6 determinism)
  must treat this as a named escalation point (record, do not weaken) with the
  proven single-module emit lane as the determinism baseline.
- **Cargo discipline** — no workspace cargo suites in any unit. Rust lane
  checks run in scratch dirs outside the shared workspace (`/tmp/…`),
  mirroring the U3 spike. Full radix ladder stages 4–6 / `--e2e` remain
  auditor-owned and are not invoked.
- **Concurrent workers** — none expected inside `tela/` during Stage 1 (this
  stage owns the repo). Sibling repos are read-only here; no cross-repo write
  scope exists in this stage (unlike Stage 0 U2).
- **Speculum overlap rule** — `radix/docs/factory/faber-hir-v1/browser-application-delivery.md`
  Speculum context is read-only evidence. The accepted contract to extract is
  Tela's own Branch B spike; `faberlang.dev`'s `document_ir.fab` is not a
  copy source (Stage 7 migration imports `tela:*` publicly).

---

## Coordination Constraints (record, don't invent)

1. **Branch A re-spike** — recorded campaign option gated on radix D1
   (generic user-type construction). Stage 1 freezes Branch B; if D1 lands
   during the stage, U1 records the re-spike option in its closeout note —
   the kernel does not switch mid-stage.
2. **D0–D3 + G1–G6 radix-lane inputs** — Stage 1 uses the recorded
   workarounds as authoring constraints (listed in U1/U2/U3/U4 done_when and
   the AGENTS.md unit). Where a defect still forces a contract-surface
   workaround, the unit records it (with the repro/evidence) and escalates To
   mind for the radix lane — never by weakening the Tela contract.
3. **Speculum overlap** — no wholesale copying; extract the accepted Branch B
   contract; Stage 7 migrates through public package imports.
4. **TS async gap** — `@ futura` inside `fac`/`cape` not awaited
   (`stage-0-behavior-design.md` §4) is a **Stage 3 input**. Stage 1's static
   renderer is synchronous; this spec makes no async/fetch claim. The
   boundary is restated in `identity-hydration.md` so Stage 3 sees it.
5. **CAMPAIGN.md status** — untouched by this spec and by every unit; owned by
   the Stage 1 closeout.

---

## Ordered Unit Graph

```
Wave 1:  U1 kernel-contract (package scaffold + Branch B types + constructors)
Wave 2:  U2 validation (valida.fab)  ∥  U4 docs (identity + authoring notes)
Wave 3:  U3 serializer (escaping + HTML/CSS serializers + identity emission)
Wave 4:  U5 benchmark-static (two-package composition importing tela:*)
Wave 5:  U6 package-tests + determinism (harnesses + double-build evidence)
```

Shared-file constraint: the kernel module `tela/src/tela.fab` is written by U1
(types + constructors), then extended by U3 (escaping + serializers) — these
two units are strictly sequential. `valida.fab` is written by U2 (U3 imports
it). Docs (U4) run parallel to U2, bound to the policy-locked surface.
Benchmark (U5) needs the serializer. Tests + determinism (U6) need the
composition. Waves give 2-way parallelism in wave 2 only; the chain is the
honest cost of the G4-safe flat-module shape — Mind may serialize further if
slot capacity prefers.

| # | Unit | Wave | Depends on |
|---|---|---|---|
| U1 | `tela-s1-u1-kernel-contract` | 1 | none |
| U2 | `tela-s1-u2-validation` | 2 | U1 |
| U4 | `tela-s1-u4-docs` | 2 | U1 |
| U3 | `tela-s1-u3-serializer` | 3 | U2 |
| U5 | `tela-s1-u5-benchmark-static` | 4 | U3 |
| U6 | `tela-s1-u6-tests-determinism` | 5 | U5 |

---

## Units

### U1 — `tela-s1-u1-kernel-contract`

| Field | Value |
|---|---|
| `id` | `tela-s1-u1-kernel-contract` |
| `outcome` | The real `tela` library package exists with the Branch B kernel: typed HTML/SVG view values, kernel-owned constructors, no raw-markup variant, vocabulary per policy (b), and the module typechecks through the Rust and TypeScript lanes. |
| `write_scope` | `tela/faber.toml` (new); `tela/src/tela.fab` (new — flat kernel module; file name default `tela.fab`, imported as `tela:tela`; a different `src/` module name is acceptable if stated, but must stay one flat import-free module) |
| `read_scope` | `tela/spike/visus-b.fab` + `tela/spike/extension-lib/src/extension.fab` + `tela/spike/stage-0-branch-a-b-evidence.md` (accepted Branch B shape, D2/D3 workarounds); `tela/docs/factory/mvp/stage-0-protocol-policies.md` (policies (a),(b),(d)); `tela/docs/factory/mvp/stage-0-ownership.md` (identity); `triga/faber.toml` + `triga/scripta/check-compile` (package/check convention); `radix/docs/factory/faber-hir-v1/browser-application-delivery.md` Speculum context (read-only evidence) |
| `done_when` | (a) `tela/faber.toml` declares package `tela`, provider `tela`, `[paths] source = "src"`, `[build] kind = "lib"`, `targets = ["rust", "ts"]`, `[reader] locale = "en"`, edition 2026, version `0.0.0` (versioning is a Stage 8 decision; no release claims). (b) `tela/src/tela.fab` defines, with the policy (b) spellings: `Spatium { html, svg }`; `Attributum { nomen, valor }`; `Proprietas { nomen, valor }`; `Identitas { valor }`; and the recursive `union Visus` with **exactly** `Elementum { Identitas ∪ null identitas, Spatium spatium, string nomen_tag, list<Attributum> attributa, list<Proprietas> proprietates, list<Visus> liberi }`, `Textus { string valor }`, `Fragmentum { list<Visus> liberi }`. **No raw-markup variant** (policy (a)). (c) Kernel-owned constructors over the same public values (policy: kernel owns constructors; G3 workaround): `textus_view`, `fragmentum_view`, `elementum_view` (open element shorthand), `elementum_omne` (full open-element constructor), `nova_identitas` (D3 workaround: routes non-null identity through `Identitas ∪ null`), `html_spatium`/`svg_spatium` (G1 workaround). Constructors are ordinary functions, not privileged syntax. (d) The module is **flat and import-free** (G4-safe) and stdlib-only (no `norma`/`triga`/`faber-runtime` dependency). (e) Three-lane check green: `radix check` ok; `radix emit -t ts` + `tsc --noEmit` clean (**D2 re-check**: `nomen_tag` emits with no TS discriminant collision — record the re-check result); `radix emit -t rust` + scratch-dir `cargo check` clean (**D3 re-check**: nullable-field emission — `nova_identitas` keeps the workaround; direct non-null construction is adopted only if the radix D3 delivery landed, recorded either way). (f) Module header records: Branch B frozen for Stage 1; D1 lands → Branch A re-spike is a decision point, not a mid-stage switch. |
| `validation` | The three-lane commands above (in-tree `radix/target/debug/radix`; scratch-dir cargo outside the shared workspace); `git diff --check` in `tela/`. |
| `depends_on` | none |
| `non_goals` | No escaping/serializers (U3). No validation module (U2). No `Eventum`/`Vinculum`/`Nuntius`/message types (Stage 3 behavior plan). No `Declaratio`/`Regula`/`Stilum` CSS types yet (U3). No eager validation in constructors (validation boundary is the serializer). No `faber-web`/`radix` edits. No remote/publication. |
| `risk` | **Medium.** Kernel shape is policy-locked and the flat import-free module matches the proven U3 spike lane (low structural risk); residual risk is D2/D3 re-checks surfacing emitter drift — mitigated by the recorded field spelling + workaround, escalated if it regresses. |
| `est_work_tokens` | 6–9k |
| `test_owner` | Unit Hand (three-lane checks); reviewer (kernel-vs-policy cross-check at stage closeout). |

### U2 — `tela-s1-u2-validation`

| Field | Value |
|---|---|
| `id` | `tela-s1-u2-validation` |
| `outcome` | Fail-closed tag/attribute lexical + namespace-context validation as a G4-safe predicate module: tag names and attribute names are lexically validated so `string` tag/attribute values cannot inject markup; unknown-but-valid names (custom elements, future-standard names) are **not** rejected for being new (campaign dependency rule 9). |
| `write_scope` | `tela/src/valida.fab` (new — flat module, public surface string/bool only); `tela/exempla/validation.fab` (new — exempla-mode tests, `+++` frontmatter, locale `en`) |
| `read_scope` | `tela/docs/factory/mvp/stage-0-protocol-policies.md` policy (a)2 + campaign dependency rule 9; U1 kernel module (field spellings); `tela/spike/stage-0-branch-a-b-evidence.md` §3/§4 (emission context, D2) |
| `done_when` | (a) Lexical tag-name predicate (e.g. `valida_nomen_tag(string) → bool`): accepts valid HTML/SVG tag-name shapes including custom elements (`x-*`) and unknown-but-valid names; rejects empty names, whitespace, markup/attribute delimiters (`< > " ' / =`), leading digit in the HTML context, and control characters. (b) Lexical attribute-name predicate (e.g. `valida_nomen_attributi(string) → bool`): accepts `data-*`, `aria-*`, `xlink:*`, and standard names; rejects whitespace, `=`, quotes, `< > /`, and control characters. (c) Namespace-context predicates with a string surface the serializer glue (U3) applies against `Spatium`: HTML void-element set membership (`area base br col embed hr img input link meta param source track wbr`) and html/svg name-context checks (namespace misuse detection: e.g. SVG-only names under html context and vice versa — the concrete misuse predicate is the Hand's, fail-closed, with exempla). (d) Fail-closed contract documented in the module header: invalid lexical shape, namespace misuse, or impossible void-element structure **never** emits markup; the serializer boundary rejects (concrete mechanism is the Hand's choice within the available Faber surface, documented here). (e) Exempla cover: valid custom element; valid `data-`/`aria-` attributes; rejected empty tag, space-containing tag, markup char in tag, leading-digit tag, quote in attribute name; void-element-with-children rejection case; unknown-but-valid name accepted (dependency rule 9). `radix check` green on both files. (f) `valida.fab` is import-free and its public signatures reference only `string`/`bool` (G4-safe — no `Spatium` or other tela type in public signatures). |
| `validation` | `radix check` on `valida.fab` + `exempla/validation.fab`; both-lane emit of `valida.fab` (import-free, proven lane): `radix emit -t ts` + `tsc --noEmit`, `radix emit -t rust` + scratch-dir `cargo check`; `git diff --check`. |
| `depends_on` | U1 |
| `non_goals` | No `Spatium`-typed public surface in `valida.fab` (namespace glue lives in the kernel module, U3 — keeping `valida.fab` G4-safe). No serializer. No eager constructor validation. No raw-escape policy change. |
| `risk` | **Low–Medium.** Lexical predicates are standard; the residual risk is the namespace-misuse predicate drifting too strict (rejecting valid future names — guarded by dependency rule 9 exempla) or too loose. |
| `est_work_tokens` | 4–6k |
| `test_owner` | Unit Hand (exempla + lanes); reviewer (fail-closed contract + dependency-rule-9 exempla cross-check). |

### U3 — `tela-s1-u3-serializer`

| Field | Value |
|---|---|
| `id` | `tela-s1-u3-serializer` |
| `outcome` | Central escaping plus deterministic HTML and initial CSS serializers in the kernel module: `html(Visus) → string`, `css(Stilum) → string` (English renderer verbs per policy (b)); `data-tela` identity emission per policy (d); fail-closed validation enforcement before emission; byte-deterministic output. |
| `write_scope` | `tela/src/tela.fab` (extend: escape function, HTML serializer, CSS value types `Declaratio`/`Regula`/`Stilum` + CSS serializer, namespace glue calling `valida`); `tela/exempla/serializer.fab` (new) |
| `read_scope` | U2 `valida.fab`; `tela/docs/factory/mvp/stage-0-protocol-policies.md` policies (a),(b),(d); `tela/spike/visus-b.fab` `seri_*`/`escapa` structure (accepted spike baseline); `tela/spike/extension-lib/src/extension.fab` (CSS value shape) |
| `done_when` | (a) **Central escaping**: one escape path used by both text and attribute-value serialization; escape set covers `& < >` for text and additionally `" '` for attribute values (per the chosen quote style); no serializer path concatenates an unescaped value; the identity `valor` flows through the same attribute-escape path (policy (d)). (b) **HTML serializer `html(Visus) → string`**: open elements emit `<nomen_tag …>children</nomen_tag>`; `Fragmentum` emits no wrapper (campaign §2); `Textus` escapes; `Attributa` serialize as `nomen='valor'` (quote style per the spike baseline — single quotes — and documented); non-null `Identitas` emits `data-tela='<escaped valor>'` (policy (d) — the one documented hydration-ready form); svg-namespace elements emit with correct namespace handling (`xmlns` on the svg root per the spike baseline); HTML void elements emit without a closing tag (void set from `valida`). (c) **Fail-closed boundary**: before emission the serializer runs the lexical/namespace/void checks (U2); invalid input **never emits markup** — the fail-closed mechanism is documented and exercised by an exempla. (d) **Proprietas static posture**: `Proprietas` are carried in the tree but **not** serialized into static HTML in Stage 1 (browser-lane DOM properties; the spike's provisional `data-prop:` marker is superseded) — recorded in the module header and reflected in the hydration doc (U4). (e) **Initial CSS**: kernel gains `Declaratio { nomen, valor }`, `Regula { selector, list<Declaratio> declarationes }`, `Stilum { list<Regula> regulae }` (spike shape — smallest honest model, policy (c)); `css(Stilum) → string` emits deterministically preserving author order. (f) **Determinism posture**: serializers are pure functions over ordered lists; no unordered/hash-ordered iteration, no timestamps; identical input → identical bytes (empirically proven by U6). (g) Exempla `exempla/serializer.fab` covers: text/attribute/identity escaping with special characters; void emission (`br`, `img`); svg `xmlns`; fragment no-wrapper; `data-tela` emission; fail-closed rejection; CSS emission. `radix check` green; both-lane: TS emit + `tsc --noEmit` on the exempla **and** the import-free kernel module (the proven lane). If emit of the import-bearing exempla fails, record the defect + escalate (coordination §2/§5) — `radix check` + single-module emit still cover the contract. (h) `html`/`css` verb names verified against reserved-keyword collisions (G5/G6); if blocked, **escalate rather than silently rename** (policy (b) locks English renderer verbs). |
| `validation` | `radix check` on `tela.fab` + `exempla/serializer.fab`; both-lane emit checks; `git diff --check`. |
| `depends_on` | U2 |
| `non_goals` | No cascade layers / package ordering / bundle dedup / product assembly (Stage 2). No theme or token rendering (Stage 2). No raw escape (policy (a)3). No browser behavior or `Vinculum` (Stage 3). No renderer-host interface (deferred until a second consumer asks — `stage-0-behavior-design.md` §5). |
| `risk` | **Medium–High.** Serializer correctness (escaping, void, namespace, identity) is the gate-critical surface; emit-across-imports for the exempla is unproven (named escalation, single-module lane as baseline). |
| `est_work_tokens` | 6–10k |
| `test_owner` | Unit Hand (exempla + lanes); reviewer (escaping/identity cross-check against policies (a)/(d) and the hydration doc). |

### U4 — `tela-s1-u4-docs`

| Field | Value |
|---|---|
| `id` | `tela-s1-u4-docs` |
| `outcome` | The hydration-ready identity form is documented (Stage 1 gate bullet 2) and the Stage 1 authoring/package conventions are written down for later Hands and reviewers. |
| `write_scope` | `tela/docs/design/identity-hydration.md` (new); `tela/AGENTS.md` (new — repo root, the sibling-repo convention; the Stage 0 closeout residual spelled "docs/AGENTS.md" — see Open Question Q2) |
| `read_scope` | `tela/docs/factory/mvp/stage-0-protocol-policies.md` policies (b),(d); `tela/docs/factory/mvp/stage-0-behavior-design.md` §3.3/§4 (hydration contract, async-gap boundary); `tela/docs/factory/mvp/tela-closeout.md` §4 residuals (faber-dialect notes); U1 kernel module |
| `done_when` | (a) `identity-hydration.md` documents: `data-tela="<escaped valor>"` (quote style per the serializer) as **the** hydration-ready serialization form (policy (d)); which elements carry it (non-null `Identitas` only); the escaping rules for the `valor`; identity is an explicit typed field, never position-derived; duplicate-value/uniqueness expectations are deferred to Stage 3 hydration matching (campaign §7: mismatch diagnoses or replaces by declared policy, never silently binds the wrong tree); the Stage 3 binding contract reference (`Vinculum.identitas` keys to these values) and the TS async-gap boundary restated (Stage 3 input — Stage 1 is synchronous). (b) `tela/AGENTS.md` records: package layout (`faber.toml`, `src/`, `exempla/`, `scripta/`); exempla-mode surface (`+++` frontmatter, locale `en`); flat-module + flat-provider-module rule (G4) and the single-flat-kernel rationale; enum-member top-level binding (G5) and reserved-keyword spellings (G6); field-name constraint (D2 → `nomen_tag`); nullable-identity routing (D3 → `nova_identitas`); namespace-helper pattern (G1 → `html_spatium`/`svg_spatium`); vocabulary policy summary (Latin internals / English renderer verbs + theme tokens, policy (b)); no raw markup (policy (a)); `FABER_LIBRARY_HOME` mechanics (container root for `tela:*`, benchmark `libhome/` for the composition); the Stage 1 authoring constraints from the closeout residual ("Faber dialect / authoring notes"). (c) Docs agree with the implementation after U3 (quote style, verb names); if U3 recorded a deviation, it is reflected here (reconciliation within U4 scope) or routed. (d) `git diff --check` in `tela/`. |
| `validation` | Reviewer cross-checks docs against policies (b)/(d), the U3 emission, and the closeout residuals; `git diff --check`. |
| `depends_on` | U1 |
| `non_goals` | No API reference beyond locked surfaces. No docs for Stage 2+ surfaces. No website/marketing docs. No `CAMPAIGN.md` edits. |
| `risk` | **Low.** Doc-only; drift risk against U3 emission is the small reconciliation item in done_when (c). |
| `est_work_tokens` | 3–5k |
| `test_owner` | Reviewer (doc-vs-implementation cross-check). |

### U5 — `tela-s1-u5-benchmark-static`

| Field | Value |
|---|---|
| `id` | `tela-s1-u5-benchmark-static` |
| `outcome` | Static half of the two-package benchmark composition: a real extension package and a real application package importing `tela:*`, assembling the campaign §10 panel / two-column metric table / horizontal bar meter composition and rendering it to static HTML/CSS through the kernel. |
| `write_scope` | `tela/proof/benchmark/extension-lib/` (new package: `faber.toml` + `src/extension.fab`); `tela/proof/benchmark/canary-app/` (new package: `faber.toml` + `src/main.fab`); `tela/proof/benchmark/libhome/` (new: `tela → ../../..` and `extensionlib → ../extension-lib` symlinks); `tela/docs/factory/mvp/stage-1-benchmark-static.md` (new evidence record) |
| `read_scope` | Campaign §10 composition list + §3/§9 extension contract; `tela/spike/extension-lib/` + `tela/spike/canary-app/` + `tela/docs/factory/mvp/stage-0-canary.md` (benchmark composition seed + exercised seams + G1–G6); U1–U3 kernel; `tela/AGENTS.md` (U4) authoring notes |
| `done_when` | (a) **extension-lib**: a separate package (own `faber.toml`, provider `extensionlib`, `kind = "lib"`, flat module), imports `tela:tela` (wildcard + alias per G2); defines the custom helper `bar_metrum(label, valor, latitudo) → tela.Visus`, the namespaced token `chart.axis.muted` (declared value — theme/token **rendering** is Stage 2), and the component style bundle `chart_stilum() → tela.Stilum` referencing `var(--chart-axis-muted)`. (b) **canary-app**: a separate package (`kind = "app"`), imports `tela:tela` + `extensionlib:extension`; assembles the themed panel (stable `data-tela` identity + `aria-label`), the two-column metric table (`dl`/`dt`/`dd`), and the horizontal bar meter (label + textual value) using the extension helper where the seam permits; builds the app style bundle; its `main` calls `tela.html(arbor)` and `tela.css(…)` and prints the static output (the static-render runner for U6). (c) Both packages pass `radix check` with `FABER_LIBRARY_HOME=tela/proof/benchmark/libhome` (resolves `tela` + `extensionlib`). (d) **Composition renders**: static HTML/CSS output is produced. Primary path: emit the app + run (U6 harness). If emit-across-imports is blocked, the record carries a hand-traced structural assertion **explicitly labeled as such** plus the blocker + escalation (the gate's static-half evidence is actual rendered output; the blocked path is escalated, not silently weakened). (e) **Seam escalation (G4)**: the extension helper's `tela.Visus`-returning signature is attempted cross-package. If G4 still skips the export (WARN014), the unit records the escalation (G4 confirmed against the kernel — radix lane) and uses the documented workaround: the app composes the bar meter with `tela` constructors, consuming the extension's token + style bundle + declared values; the contract is **not** weakened (no duplicated `Visus` in the extension). (f) Evidence record documents: exercised seams, the G4/escalation outcome, the rendered static HTML/CSS (or the labeled structural assertion + blocker), and the U6 double-build hook. |
| `validation` | `radix check` both packages under the benchmark libhome; reviewer package-boundary check (separate packages — a same-file "extension" does not close this); `git diff --check`. |
| `depends_on` | U3 |
| `non_goals` | No behavior/mount, no segmented control, no interactive update (Stage 3). No theme/token rendering, no cascade ordering (Stage 2). No catalog. No writes to `tela/spike/` (frozen Stage 0 evidence). No remote/publication. |
| `risk` | **Medium–High.** The G4 cross-package helper seam and emit-across-imports are the two named escalation points; both have recorded workarounds that preserve the contract. |
| `est_work_tokens` | 5–8k |
| `test_owner` | Unit Hand (checks) + reviewer (package-boundary + seam verification). |

### U6 — `tela-s1-u6-tests-determinism`

| Field | Value |
|---|---|
| `id` | `tela-s1-u6-tests-determinism` |
| `outcome` | The package test surface (compile / exempla / determinism harnesses) and the deterministic double-build evidence: the benchmark composition's static output builds twice and is byte-for-byte identical. |
| `write_scope` | `tela/scripta/check-compile`, `tela/scripta/check-exempla`, `tela/scripta/check-determinism` (new — triga `scripta/` pattern); `tela/docs/factory/mvp/stage-1-determinism.md` (new evidence record); `tela/.gitignore` (add `build/` if the harness writes outputs under the repo) |
| `read_scope` | U5 benchmark packages; U1–U3 kernel + exempla; `triga/scripta/check-compile` + `check-exempla-inventory` (harness pattern); `tela/spike/stage-0-branch-a-b-evidence.md` §7 (recorded commands) |
| `done_when` | (a) `check-compile`: `radix check` every `src/*.fab` (locale pack where needed, `FABER_LIBRARY_HOME` set) — green. (b) `check-exempla`: `radix check` every `exempla/*.fab` + the TS lane (emit + `tsc --noEmit`) — green. (c) `check-determinism`: builds the benchmark composition static output twice and byte-compares. Build = emit the app to Rust → scratch crate **outside the shared workspace** → `cargo run` → capture HTML/CSS output → `build/static-1` (or equivalent); repeat → `build/static-2`; `cmp` byte-identical with sha256 hashes recorded. TS lane analog where runnable (double-emit byte-identity + `tsc --noEmit` if the emitted TS is not runnable — documented). (d) `stage-1-determinism.md` records: both hashes, the exact commands, the output description — byte-identical required; a diff **fails the check** (fail-closed). (e) Escalation path documented: if emit cannot resolve provider imports for the composition, the defect is recorded (radix lane) and the determinism baseline falls back to the single-module exempla runner (proven U3 lane) — never by inlining the kernel into the app. (f) Cargo discipline: all cargo runs in scratch dirs outside the shared workspace; no workspace suites; the closeout runs the three harnesses exactly once. (g) `git diff --check` in `tela/`. |
| `validation` | Run `scripta/check-compile` + `scripta/check-exempla` + `scripta/check-determinism` once at closeout; reviewer/auditor re-runs `check-determinism` as the named test owner for the determinism gate; `git diff --check`. |
| `depends_on` | U5 |
| `non_goals` | No radix ladder stages 4–6 / `--e2e` / release-gate (auditor-owned). No faber packaging or product assembly. No release claims. |
| `risk` | **Medium.** Emit-across-imports and scratch `cargo run` reliability on macOS are the residual risks; the fallback lane is the proven single-module emit + scratch run. |
| `est_work_tokens` | 4–7k |
| `test_owner` | Unit Hand (harness runs) + closeout auditor (re-runs `check-determinism`). |

---

## Checkpoints And Gates

| Gate | After | Check |
|---|---|---|
| **CG1 — kernel contract** | U1 | `tela` package scaffold exists; Branch B `Visus` union + kernel constructors green through `radix check`, TS + `tsc --noEmit`, Rust + scratch `cargo check`; no raw variant; policy (b)/(d) spellings; D2/D3 re-checks recorded. |
| **CG2 — validation** | U2 | `valida.fab` predicates + fail-closed contract green; dependency-rule-9 exempla (unknown-but-valid names accepted); G4-safe string/bool surface. |
| **CG3 — serializer** | U3 | Central escaping, `html`/`css` deterministic serializers, `data-tela` identity emission, fail-closed boundary, void/namespace correctness — green through check + exempla; policy (a)/(b)/(d) respected; verb-name collisions escalated if any. |
| **CG4 — docs** | U4 | `identity-hydration.md` documents the one hydration-ready form; `tela/AGENTS.md` carries the authoring/dialect notes; docs agree with the U3 emission. |
| **CG5 — benchmark static** | U5 | Two-package composition imports `tela:*`; panel/table/bar assembles; static HTML/CSS rendered (or the labeled structural assertion + escalation record); G4 seam outcome recorded. |
| **CG6 — tests + determinism** | U6 | `check-compile` + `check-exempla` green; `check-determinism` byte-identical double-build evidence on disk with hashes; fail-closed (diff fails). |
| **Stage closeout** | all | Campaign workflow step 6: review shared protocol changes with `consequences`, `correctness`, and an independent audit **before** accepting the stage. The closeout owns the `CAMPAIGN.md` status line and the Stage 1 → Stage 2 selection. |

The Stage 1 gate bullets map 1:1 to the gates above (typed HTML/SVG view
values → CG1; documented hydration-ready identity → CG1 + CG4; central
escaping → CG3; lexical + namespace validation → CG2; deterministic HTML +
initial CSS → CG3; double-build evidence → CG6; package tests → CG6; static
half of the two-package benchmark composition → CG5).

---

## Validation Summary

| Layer | Command / Flow | Covers |
|---|---|---|
| Kernel semantics | `radix check` on `tela/src/*.fab` (locale pack + `FABER_LIBRARY_HOME`) | Types, constructors, validation, serializers typecheck |
| TS lane | `radix emit -t ts` + `tsc --noEmit` (import-free files; exempla where emit resolves) | Typed values + serializers valid in TypeScript; D2 re-check |
| Rust lane | `radix emit -t rust` + scratch-dir `cargo check`/`cargo run` (outside shared workspace) | Typed values + serializers valid in Rust; D3 re-check; static output runs |
| Package tests | `scripta/check-compile` + `scripta/check-exempla` | The tela package test surface (exempla corpus) |
| Determinism | `scripta/check-determinism` — build twice, byte-compare (sha256) | Byte-identical double-build evidence (fail-closed) |
| Benchmark static | `radix check` both benchmark packages under `tela/proof/benchmark/libhome` + rendered output | Two-package composition static half |
| Doc hygiene | `git diff --check` in `tela/` | Whitespace/conflict hygiene |
| Cargo discipline | No workspace cargo suites; scratch dirs only | Lock ownership (operator rule 2026-08-07) |
| Radix ladder | Not run by Stage 1 units (tela changes do not touch radix); stages 4–6 / `--e2e` auditor-owned | Boundary: no whole-workspace suites |

---

## Open Questions For Mind

| # | Question | Default | Who |
|---|---|---|---|
| Q1 | Where should the benchmark composition packages live? This spec uses `tela/proof/benchmark/` (self-contained, mirroring `triga/proof/`), keeping application/benchmark concepts out of the Tela kernel package. The campaign scope table routes "interactive and extension proofs → examples or dedicated sibling packages". | `tela/proof/benchmark/` for Stage 1; migration to `examples/` is a later-stage routing option | Mind |
| Q2 | Authoring-notes path: the Stage 0 closeout residual spelled "Stage 1 docs/AGENTS.md", but every sibling repo (`radix/`, `faber/`, `triga/`) keeps `AGENTS.md` at the repo root. | Repo-root `tela/AGENTS.md` (sibling convention); the residual's "docs/" was a routing shorthand | Mind |
| Q3 | Proprietas static posture: this spec decides `Proprietas` are **not** serialized into static HTML in Stage 1 (browser-lane DOM properties; the spike's provisional `data-prop:` marker is superseded). Confirm this is acceptable for the gate, which lists typed HTML/SVG view values but not property serialization. | Not serialized statically; documented in `identity-hydration.md`; Stage 3 defines any static/hydration presence | Mind (confirm) |
| Q4 | G4 escalation: if the benchmark extension's `tela.Visus`-returning helper is skipped cross-package (WARN014), the composition uses the value/style-level seam and the escalation is recorded for the radix lane — the two-package static composition still closes the gate bullet. Acceptable? | Yes — record + escalate; never duplicate `Visus` in the extension | Mind |
| Q5 | Emit-across-provider-imports is unproven (`radix emit` of a file importing `tela:tela`). If it fails, determinism evidence falls back to the proven single-module exempla lane and the defect escalates to radix. Acceptable as the bounded risk? | Yes — fallback + escalation; no contract weakening | Mind |
| Q6 | Kernel module file name: default `tela/src/tela.fab` (imported as `tela:tela`, the `triga:triga` facade convention). | Hand choice within `tela/src/`; state it in the closeout | Hand |

---

## Residuals (routed, not Stage 1 work)

- **D0–D3 + G1–G6 compiler deliveries** → radix lane (Mind routes minimized
  deliveries; repros under `tela/spike/defects/`). Stage 1 applies the
  recorded workarounds; a Stage 1 re-confirmation (D2/D3 re-check, G4 against
  the kernel) lands in the relevant unit's record + the radix lane.
- **Branch A re-spike** → campaign option, gated on radix D1 landing; not
  Stage 1 work.
- **TS async `@ futura`/`fac`/`cape` codegen gap** → Stage 3 input
  (`stage-0-behavior-design.md` §4); Stage 1 is synchronous and records the
  boundary.
- **Theme/token rendering, cascade layers, product assembly, deterministic
  extension ordering implementation** → Stage 2 (policy (c)/(e) are the locked
  rules; this stage serializes the structured model only).
- **Browser mount, segmented control, behavior plan (`Vinculum`/`Eventum`),
  hydration matching, host effects** → Stage 3 (binds to the `data-tela` seam
  documented here).
- **Speculum migration + duplicate-IR removal** → Stage 7 (imports `tela:*`
  publicly; no wholesale source copying).
- **Capability-truth finalization, versioning, publication** → Stage 8.
