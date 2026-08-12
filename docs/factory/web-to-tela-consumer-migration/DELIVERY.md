# web: → tela: consumer migration — delivery spec

**Status**: planned — pre-implementation; delivery spec READY (2026-08-12, planner-2); no code moves; Mind owns the commit via the merge lane

**Goal**: move every live `web:*` consumer in the workspace onto the tela-owned `tela:*` surface, reaching the faber-web retirement condition (no live `web:` consumer remains).
**Planner**: planner-2 (task 81539b0c; parallel track, non-overlapping with planner-1's cg2 lowering)
**Predecessor**: web-surface-import (WSI) campaign CLOSED (U1–U6, 2026-08-11); faber-web frozen/deprecated
**Goal-check verdict**: **READY** (see §13)
**Artifact dir**: `tela/docs/factory/web-to-tela-consumer-migration/`

---

## 1. Interpreted unit / problem

faber-web (provider `web`) is frozen and deprecated. Its browser surfaces
(`web:dom`, `web:canvas2d`, `web:web`) were imported into tela as
`tela:dom` / `tela:canvas2d` / `tela:browser` (WSI, closed). What remains is
the **consumer side**: 11 live packages (5 triga corpus + 6 examples) still
import `web:*` and would keep faber-web alive forever. The operator requested
(2026-08-11) the work to move all usage/calls of `web:` into `tela:`.

This delivery scopes that migration: the full inventory, the mapping table
(verified against the live tela surface), the per-consumer plan, the two
enablers that must land first, the verification gates, and the faber-web
retirement condition. **Planning artifact only — no code moves in this unit.**

## 2. Open question resolution (researched live, 2026-08-12)

**Q: Does tela's dom/browser surface still depend on `web:dom`, or is it standalone?**

**RESOLVED: tela is fully standalone.** No live `web:` dependency remains in
tela/src:

| File | Current state (verified) |
| --- | --- |
| `tela/src/dom.fab` | **Import-free** (module header line 9: "import-free (the G4-safe flat shape)"). Self-contained en conversion of `web:dom`. |
| `tela/src/browser.fab` | `import from "tela:dom" public * ut dom` (line 67). The WSI U4 flip landed. No `web:dom`. |
| `tela/src/canvas2d.fab` | `import from "tela:dom" private dom` (line 47). No `web:dom`. |
| `tela/src/tela.fab` | Kernel. `web:`-free (comment-only mentions). |
| `tela/faber.toml` | No `web` dependency; `[target.ts] bindings = "bindings/ts.toml"` (tela-owned). |
| `tela/bindings/ts.toml` | Routes re-keyed `tela:dom.X` / `tela:canvas2d.X` → `webDom*`/`webCanvas2d*` symbols; `[shim]` + `[shims.canvas2d]` present (the per-stem shim shape faber's browser-product tsc verification needs). |

The only `web:` strings left in tela are **comments** (`src/dom.fab`,
`src/browser.fab`, `src/canvas2d.fab`, `AGENTS.md`, `scripta/*` header
comments, `docs/`). **Consumers can move immediately on the surface-completeness
axis** — except for the one gap below.

## 3. Full inventory of live `web:` usages (bounded ripgrep, 2026-08-12; `worktrees/` excluded)

### 3.1 Live consumer packages (11 — the migration surface)

| # | Package | Locale | Imports (`web:*`) | `@ WebController` |
| --- | --- | --- | --- | --- |
| 1 | `triga/corpus/webgl-geometry-terrain` | la | `web:web`, `web:dom` | 1 |
| 2 | `triga/corpus/webgl-animation-terrain` | en | `web:web`, `web:dom` | 1 |
| 3 | `triga/corpus/webgl-animation-water` | en | `web:web`, `web:dom` | 1 |
| 4 | `triga/corpus/webgl-animation-orbit` | en | `web:web`, `web:dom` | 1 |
| 5 | `triga/corpus/webgl-geometries` | la | `web:web`, `web:dom` | 1 |
| 6 | `examples/triga-drift-city` | la | `web:web`, `web:dom` | 1 |
| 7 | `examples/triga-budapest` | la | `web:web`, `web:dom` | 1 |
| 8 | `examples/browser-app` | la | `web:web`, `web:dom` | 11 |
| 9 | `examples/hello-voxel` | la | `web:web`, `web:dom` | 1 |
| 10 | `examples/canvas2d-interactive` | la | `web:web`, `web:dom`, `web:canvas2d` | 1 |
| 11 | `examples/web-canvas2d-smoke` | la | `web:web`, `web:dom`, `web:canvas2d` | 1 |

All 11 are `[product] kind = "browser-app"` packages (`[build] kind = "bin"`,
`target = "ts"`, `controllers_json = "controllers.json"`). All declare
`web = "0.1.0"` in `[dependencies]` (corpus + drift-city/budapest/hello-voxel
additionally `triga = "0.1.0"`). **28 `@ WebController` annotation sites
total.** Every consumer resolves `web:` via a `faber.lock` with a path entry to
`$WORKSPACE/faber-web` (the lock is written by each package's `tests/run.sh`).

### 3.2 Member-level usage (verified against the live tela surface)

- **`dom.*` members used (19 distinct, no missing in `tela:dom`):**
  `attr_set` (228), `require` (33), `text_set` (22), `class_add` (17),
  `on_keyboard` (12), `on_frame` (11), `on_pointer` (7), `on_resize` (6),
  `on_focus` (6), `on` (6), `request_pointer_lock` (3), `on_pointer_lock` (3),
  `class_remove` (3), `all` (2), `prevent_default` (1), `pointer_lock_state`
  (1), `on_submit` (1), `on_input` (1), `class_toggle` (1).
  **No `dom.value` / `dom.value_set` / `dom.fetch_text` / `dom.snapshot` usage
  in consumers** → the WSI rename `value` → `input_value` does not bite.
  **No `dom.Nodus` / `dom.identitas` usage** → the `DomNode`/`identity`
  renames do not bite.
- **`canvas2d.*` members used (27 distinct)** — all exist in `tela:canvas2d`
  (context, save/restore/translate/rotate/set_transform, clear/fill/stroke_rect,
  set_fill/stroke_style, begin_path/move_to/line_to/close_path/arc/ellipse/fill/
  stroke/clip, fill_text/set_font/set_text_align/set_text_baseline,
  path2d_new_from_svg/path2d_fill/path2d_stroke).
  **One type rename:** `canvas2d.Canvas2dContext` → `canvas2d.Canvas2DContext`
  (9 source sites in `canvas2d-interactive` + `web-canvas2d-smoke`; plus the
  test-facade genus-value exports `export const Canvas2dContext = …` in
  `interactive-test.mjs` / `smoke-test.mjs`).
- **`web.*` member usage: NONE.** `web:web` is imported only for the
  `@ WebController` annotation contract (28 sites). There is no `web.Mount`,
  `web.mount`, or `web.selector_of` consumer.

### 3.3 Non-consumer `web:` references (out of the migration surface)

| Where | Kind | Disposition |
| --- | --- | --- |
| `faber-web/src/canvas2d.fab:20` (`importa ex "web:dom"`) | intra-package (provider's own module) | frozen; archives with faber-web |
| `faber-web/src/{dom,canvas2d}.fab`, `runtime/*.ts`, `bindings/ts.toml`, `tests/*` | the frozen provider itself | untouched (WSI U5 freeze) |
| `faber/src/package_test.rs` (~25 fixtures) | faber's own packaging tests pinning the `web:` provider path | stay green; keep faber-web on disk as test fixture |
| `faber/tests/web2_build_integration_test.rs:90-91` | faber build-integration test | stays green; pins `web:` resolution |
| `examples/*/dist/` (tracked in hello-voxel + corpus + canvas2d-interactive) | committed generated ESM/TS with `web:` bare specifiers | **regenerated by build**, never hand-edited |
| `examples/*/tests/loader-hook.mjs`, `runtime-bridge.mjs`, `interactive-test.mjs`, `smoke-test.mjs` | node/Playwright harness specifier maps (`web:dom` → bridge) | **must be updated per migrated package** (U5) |
| `u2-verify-faber/` | stale detached snapshot repo (Aug 9; not in the workspace layout) | **excluded** — report only (open Q4) |
| `docs/` (tela, triga, radix, faber-web, examples READMEs, campaign docs) | historical/archival prose | out of scope (stale-doc refresh only where it names a live seam: tela AGENTS.md §U1) |
| `tela/src/*.fab`, `tela/scripta/*`, `tela/AGENTS.md` | comments | stale-comment cleanup folded into U1 |

## 4. Mapping table (verified against the live tela surface)

| Former (`web:*`) | Replacement (`tela:*`) | tela surface state | Notes |
| --- | --- | --- | --- |
| `web:dom` | `tela:dom` | ✅ present (`tela/src/dom.fab`, import-free, en) | Member-identical for every consumer call; `Nodus`→`DomNode`, `identitas`→`identity`, `value`→`input_value` (no consumer uses the renamed members) |
| `web:canvas2d` | `tela:canvas2d` | ✅ present (`tela/src/canvas2d.fab`, en; imports `tela:dom`) | One type rename: `Canvas2dContext`→`Canvas2DContext` (consumers + test facades) |
| `web:web` (`Mount`/`mount`/`selector_of`) | `tela:browser.mount` (superseded) | ✅ present (WSI decided: drop `Mount`/`mount`; `tela:browser.mount` is the lifecycle) | **No consumer uses `Mount`/`mount`/`selector_of`** — no action |
| `web:web` (`WebController` annotation) | **GAP — no tela equivalent today** | ❌ **missing** | Planned as **U1** (`tela:web` annotation contract); the faber packaging verification (**U2**) must accept the tela origin |

### The gap (named per task scope)

`@ WebController { selector = "…" }` is the browser-app **packaging entry
contract**: `faber/src/package/product/controllers.rs` hard-verifies
`discover_controllers`:

1. `validate_controller_origin` — the `WebController` annotation contract
   must originate from **provider `web`, module `web`, export `WebController`**
   (`product_controller_unqualified_origin` otherwise; local definitions
   rejected).
2. `param_is_dom_scope` — the controller fn's single param must be `Scope`
   from **provider `web`, module `dom`**
   (`product_invalid_controller_signature` otherwise).
3. `discover_controllers` — a browser-app product with **no** `WebController`
   fn fails (`product_controller_missing`).

Consequences, verified against live code:
- A browser-app consumer **cannot** flip `web:dom` → `tela:dom` without also
  changing faber's origin verification (the controller `Scope` param would
  fail `param_is_dom_scope`).
- The `@ WebController` annotation **cannot** be re-homed to tela without
  (a) a tela-owned `WebController` annotation contract, and (b) faber's
  origin verification accepting the tela origin.
- The annotation cannot simply be dropped (browser-app packaging requires ≥1
  controller fn).

This is the **only material dependency outside the 11 consumer packages**, and
it is addressed by U1 (tela surface) + U2 (faber verification) below. It is
not the tela kernel (`src/tela.fab` is untouched — WSI condition 2).

## 5. Normalized spec

After the migration:

1. **Zero live `web:` imports** in consumer source across the workspace
   (the 11 packages; `worktrees/`, docs, faber-web's own internals, and
   faber's Rust test fixtures excluded from the definition of "live
   consumer").
2. Each migrated package builds green through the **faber browser-product
   path** (`faber build --package .` → controllers.json) with the tela
   provider locked in its `faber.lock`.
3. tela gains the missing `WebController` annotation contract; faber's
   packaging verification accepts the tela origin **without weakening the
   no-local-shadowing invariant** (web: origins stay accepted; tela origins
   added).
4. faber-web reaches the **retirement condition** (§11): no live consumer
   keeps it alive; it remains frozen for the archival goal (a future goal).

## 6. Repo-aware baseline

| Repo | Relevant facts (verified) |
| --- | --- |
| `tela/` | `src/` modules: `tela, validate, browser, reference, dom, canvas2d`. `scripta/check-compile` iterates `for mod in tela validate reference dom canvas2d`. `faber.toml`: provider tela, `targets = ["rust","ts"]`, `[target.ts] bindings = "bindings/ts.toml"`. Seven harness gates + 2 ported tests (WSI EVIDENCE §7). |
| `faber/` | `src/package/product/controllers.rs` (the origin/param verification); `src/package_test.rs` fixtures (`write_web_consumer_app` + `build_browser_product` assert web-origin acceptance, local-shadowing rejection, duplicate-mount, invalid-selector, missing-controller); `tests/web2_build_integration_test.rs` builds a real `web:` package. |
| `triga/corpus/` | 5 self-contained browser-app packages; each `tests/run.sh` writes `faber.lock` (web + triga path entries), runs `faber check` per source file, `faber build --package .`, greps `dist/controllers.json` for its selector, runs fixture assertions. `dist/` tracked in all 5. Aggregate: `serve.sh` (build all + serve). |
| `examples/` | 6 browser-app packages. Shared harness: `examples/browser-app/tests/{register-hooks,loader-hook,runtime-bridge}.mjs` (loader-hook maps bare `web:dom`/`web:web` + compiled `./web-dom.js`/`./web-web.js` → runtime bridge); reused by hello-voxel. `canvas2d-interactive/tests/interactive-test.mjs` + `web-canvas2d-smoke/tests/smoke-test.mjs` build via Playwright with hand-written `web:canvas2d` facades + `Canvas2dContext` genus-value exports. `dist/` tracked in hello-voxel, canvas2d-interactive; gitignored in triga-budapest, browser-app. |
| `faber-web/` | Frozen (WSI U5). `src/web.fab` = the la `WebController`/`Mount`/`mount`/`selector_of` contract. README deprecation banner + migration table. |

## 7. Ordered unit graph

Dependency order per the task: **tela's own surface completion first (U1) →
the faber enabler (U2) → triga corpus (U3 probe + U4 batch) → examples (U5) →
retirement sweep (U6).**

### U1 — `tela:web` annotation surface + tela-side staleness

| Field | Value |
| --- | --- |
| `id` | U1 (`web-mig-u1-tela-web-annotation`) |
| `outcome` | tela provides the `WebController` annotation contract (`tela:web`) the browser-app packaging needs; tela's own `web:` comments/AGENTS staleness cleaned; the tela seven-gate stays green. |
| `write_scope` | `tela/src/web.fab` (new — en, `@ annotatio { target = fn } class WebController { string selector }`; the exact en keyword surface probed against `radix check`); `tela/scripta/check-compile` (module list gains `web`); `tela/AGENTS.md` (stale seam lines ~126–128: `dom.Nodus`/`dom.Nodus.identitas` → `dom.DomNode`/`dom.DomNode.identity`). |
| `read_scope` | `faber-web/src/web.fab` (the la source contract); `tela/src/browser.fab` (do not touch — lifecycle stays separate); `radix/stdlib/locale/en/pack.toml` (annotation keyword surface). |
| `done_when` | (a) `tela/src/web.fab` exists, checks clean (`radix check --locale en`), declares the `WebController` annotation contract with a `selector: string` field, and the `@ annotatio` declaration resolves (probe: an annotation-consumer fixture using `@ WebController` passes `radix check`). (b) `check-compile` iterates the new module and is green. (c) The 7 harness gates + 2 ported tests are green once (§8). (d) AGENTS.md seam lines name `DomNode`/`identity` (no stale `Nodus`/`identitas` seam claim). (e) `git diff --check` clean in `tela/`. |
| `validation` | `./scripta/check-compile && ./scripta/check-exempla && ./scripta/check-mount && ./scripta/check-determinism && ./scripta/check-forms-proof && ./scripta/check-forms-interactive && ./scripta/check-reference` + the 2 ported tests (`contract-test.ts`, `dom-runtime-test.ts`) per WSI EVIDENCE §7; `git diff --check`. |
| `depends_on` | none |
| `non_goals` | No kernel (`src/tela.fab`) edits. No `tela:dom`/`tela:canvas2d`/`tela:browser` changes. No consumer moves. No faber changes. |
| `risk` | **low** — new ~10-LOC module mirroring the frozen `faber-web/src/web.fab`; probe point: the en `@ annotatio` declaration keyword surface (escalate, never weaken). |
| `est_work_tokens` / `est_basis` | ~2.5k. Basis: 1 new module (~12 LOC), 1 script loop element, ~6 stale doc lines, one seven-gate run. |

### U2 — faber packaging verification accepts the tela origin

| Field | Value |
| --- | --- |
| `id` | U2 (`web-mig-u2-faber-controller-origin-tela`) |
| `outcome` | faber's browser-product packaging accepts `WebController` from `tela:web` and `Scope` from `tela:dom` as controller origins, while keeping the `web:` origins and the no-local-shadowing rejection. |
| `write_scope` | `faber/src/package/product/controllers.rs` (`validate_controller_origin` + `param_is_dom_scope`: extend the accepted-origin match to `provider "tela"` with the corresponding module/export — `["web"]`/`WebController` and `["dom"]`/`Scope` — alongside the legacy `web:` arms); `faber/src/package_test.rs` (new acceptance fixtures mirroring `write_web_consumer_app` with `tela:web`/`tela:dom` imports: tela-origin accepted, local-shadowing `WebController` still rejected, `product_controller_missing` still enforced). |
| `read_scope` | `faber/src/package/product/controllers.rs` (current arms); `faber/src/package_test.rs` (`write_web_consumer_app` + the `build_browser_product` fixture pattern). |
| `done_when` | (a) A `tela:web` + `tela:dom`-importing controller fixture builds and produces `controllers.json`. (b) A local `@ annotatio WebController` definition in a tela-importing fixture still fails `product_controller_unqualified_origin`. (c) All existing `web:` fixtures stay green (no behavior change for the legacy path). (d) `cargo check -p faber` + the touched lib tests pass. |
| `validation` | `cargo test -p faber --lib` (the package_test module; narrow, per the cargo discipline rule) or the single touched test target; `cargo check -p faber`. No full workspace suites, no release gate. |
| `depends_on` | U1 (the acceptance fixture mirrors the exact `tela:web` module/export names U1 lands) |
| `non_goals` | No change to `web:`-origin acceptance. No weakening of local-shadowing rejection. No `ts_render`/`ts_emit`/shim changes. No consumer moves. |
| `risk` | **medium** — product packaging verification; the invariant ("reject local shadowing / unqualified origin") must stay intact for both origins. Additive arms only. |
| `est_work_tokens` / `est_basis` | ~7k. Basis: 2 verification fns (~15 lines), 2–3 new fixture blocks (~60–90 lines mirroring existing `write_web_consumer_app` fixtures), 1 narrow cargo test. |

### U3 — corpus probe: `webgl-geometries` (the cross-locale probe)

| Field | Value |
| --- | --- |
| `id` | U3 (`web-mig-u3-corpus-probe`) |
| `outcome` | One triga corpus package (`webgl-geometries`, la) fully migrated and building through the tela provider — proving the la→en cross-locale package import of `tela:*` through `faber build` + the new controllers.rs path before the batch. |
| `write_scope` | `triga/corpus/webgl-geometries/src/main.fab` (imports: `importa ex "web:web" privata web` → `importa ex "tela:web" privata web`; `importa ex "web:dom" privata dom` → `importa ex "tela:dom" privata dom`); `faber.toml` (`web = "0.1.0"` → `tela = "0.1.0"`); `tests/run.sh` (the `faber.lock` `web` entry block → a `tela` entry: `package_root = "$WORKSPACE/tela"`, `interface_root = "$WORKSPACE/tela/src"`, `crate = "tela"`, `target_language = "ts"`, `target_triple = "browser"`); regenerated `faber.lock` + `dist/` (build output). |
| `read_scope` | `triga/corpus/webgl-geometries/src/{camera_controls,main,scene,shapes}.fab`; `tela/src/dom.fab` + `tela/bindings/ts.toml` (the surface being migrated to). |
| `done_when` | (a) `./tests/run.sh` green (check + build + `controllers.json` grep `"selector": "#triga-corpus-geometries"` + fixture assertions). (b) The emitted ESM resolves `tela:dom`/`tela:web` through the tela shim/runtime (the generated `tela-dom.js`/`tela-web.js` stems or equivalent verified). (c) No `web:` reference remains in the package's source/config (dist regenerated). |
| `validation` | `triga/corpus/webgl-geometries/tests/run.sh`; `git diff --check`. |
| `depends_on` | U1, U2 |
| `non_goals` | No conversion of the package's la keyword surface (la stays la; the import lines are the only edit). No controller-behavior changes. No `_host/` edits. |
| `risk` | **medium-high** — first live la→en cross-locale import of `tela:*` under `faber build` + the new verification path. Fallback if the la→en import fails: convert the consumer file's keyword surface to en (mechanical; the en corpus files prove the en shape) or escalate to radix (recorded, never weakened). The probe exists exactly to bound this. |
| `est_work_tokens` / `est_basis` | ~3.5k. Basis: 1 package, 4 checked src files, 2 import lines + 1 dep line + 1 lock block, 1 build + 1 controllers.json grep, rebuild. |

### U4 — corpus batch: remaining 4 packages

| Field | Value |
| --- | --- |
| `id` | U4 (`web-mig-u4-corpus-batch`) |
| `outcome` | The remaining corpus packages — `webgl-geometry-terrain` (la), `webgl-animation-terrain`, `webgl-animation-water`, `webgl-animation-orbit` (en) — migrated and building through the tela provider. |
| `write_scope` | Per package: `triga/corpus/<slug>/src/main.fab` (imports; la: `importa ex …`, en: `import from …` — module tokens `web:web`→`tela:web`, `web:dom`→`tela:dom`), `faber.toml` (dep `web`→`tela`), `tests/run.sh` (lock block), regenerated `faber.lock` + `dist/`. |
| `read_scope` | the same 4 packages' other src files (unchanged); the U3 probe as the pattern. |
| `done_when` | Each package: `tests/run.sh` green + `controllers.json` selector grep + no `web:` reference in source/config. |
| `validation` | Per package `triga/corpus/<slug>/tests/run.sh`; optionally the aggregate `triga/corpus/serve.sh` (builds all demos) once at closeout. |
| `depends_on` | U3 |
| `non_goals` | Same as U3; no `_host/` edits; no keyword-surface conversion. |
| `risk` | **medium** — mechanical ×4; the en-locale files (en→en import) are lower-risk than the la files; no new unknowns beyond U3. |
| `est_work_tokens` / `est_basis` | ~9k. Basis: 4 packages × (2 import lines + 1 dep + 1 lock block + 1 build + greps). |

### U5 — examples batch: 6 packages

| Field | Value |
| --- | --- |
| `id` | U5 (`web-mig-u5-examples-batch`) |
| `outcome` | All 6 example packages — `triga-drift-city`, `triga-budapest`, `browser-app` (11 controllers), `hello-voxel`, `canvas2d-interactive`, `web-canvas2d-smoke` — migrated and their test gates green through the tela provider. |
| `write_scope` | Per package: `examples/<slug>/src/main.fab` (imports; + the `canvas2d.Canvas2dContext` → `canvas2d.Canvas2DContext` rename in canvas2d-interactive/web-canvas2d-smoke), `faber.toml` (dep `web`→`tela`), `tests/run.sh` + `faber.lock` (lock block + regeneration), tracked `dist/` (regenerated). Harness specifier maps (shared, land in the same unit): `examples/browser-app/tests/loader-hook.mjs` (bare `web:dom`/`web:web` → `tela:dom`/`tela:web`; compiled `./web-dom.js`/`./web-web.js` → the tela stems), `examples/browser-app/tests/runtime-bridge.mjs` (a standalone bridge — specifier-map + header comments; the `web` namespace export drops or stays per the emitted tela:web shape), `examples/canvas2d-interactive/tests/interactive-test.mjs` + `examples/web-canvas2d-smoke/tests/smoke-test.mjs` (facades: `web:canvas2d` → `tela:canvas2d`; the transpiled runtime source path `faber-web/runtime/{dom,canvas2d}.ts` → `tela/runtime/{dom,canvas2d}.ts`; `Canvas2dContext` → `Canvas2DContext` genus-value exports), `examples/browser-app/tests/fake-dom.mjs` (header-comment refresh only). |
| `read_scope` | `tela/runtime/{dom,canvas2d}.ts` (the bridge targets; symbols `webDom*`/`webCanvas2d*` are the documented host-binding contract — read-only); the U3/U4 pattern. |
| `done_when` | (a) Per package: its build + test gate green (below). (b) The emitted ESM resolves the tela specifiers through the updated loader-hook/runtime bridge (hello-voxel rides browser-app's shared `register-hooks.mjs`/`loader-hook.mjs`). (c) No `web:` reference remains in each package's source/config (dist regenerated). |
| `validation` | `examples/browser-app/tests/run.sh` (node DOM harness); `examples/hello-voxel/tests/run.sh` (proof-driver + HV fixture tests); `examples/triga-drift-city/tests/run.sh` + `examples/triga-budapest/tests/run.sh` (facts tests); `node tests/interactive-test.mjs` (canvas2d-interactive, Playwright); `node tests/smoke-test.mjs` (web-canvas2d-smoke). `git diff --check` per package. |
| `depends_on` | U3 (the probe's mechanics), U4 (same-batch confidence) |
| `non_goals` | No rewrite of example behavior to the `tela:browser.mount` view lifecycle (they stay dom-surface consumers). No `@ WebController` removal (packaging requires it). No changes to `faber-web` runtime/source (frozen). |
| `risk` | **medium** — mechanical ×6 but with the most harness surface: browser-app's shared loader-hook/runtime-bridge (reused by hello-voxel), the two Playwright facades with the `Canvas2dContext` rename ripple (source + facade + emitted-import expectations), hello-voxel's largest fixture suite. Exact emitted stem names (`./tela-dom.js` etc.) verified at implementation. |
| `est_work_tokens` / `est_basis` | ~14k. Basis: 6 packages × (imports + dep + lock + build + gate) + 4 harness specifier-map edits + 2 facade renames + `Canvas2dContext`→`Canvas2DContext` (9 source + 4 facade sites). |

### U6 — retirement sweep + faber-web banner + residual record

| Field | Value |
| --- | --- |
| `id` | U6 (`web-mig-u6-retirement-sweep`) |
| `outcome` | The faber-web retirement condition is proven met (zero live `web:` consumer) and recorded; the frozen faber-web mapping table is made accurate (the `WebController` row gains the tela home); residuals filed. |
| `write_scope` | `faber-web/README.md` (docs-only precision on the migration-table row: `web:web` WebController → `tela:web`; `Mount`/`mount` → `tela:browser.mount` — a migration-table correction, not a feature; freeze caveat recorded); this delivery's `EVIDENCE.md` (the sweep record, one official closeout). |
| `read_scope` | the whole-workspace grep sweep. |
| `done_when` | (a) The bounded sweep returns **zero** live `import from "web:"` / `importa ex "web:"` matches in consumer source (the 11 packages; sweep definition excludes `worktrees/`, `docs/`, `faber-web/`'s own `src/`, `u2-verify-faber/`, and `*.rs` test fixtures). (b) The banner table's `WebController` row names `tela:web`. (c) Residuals recorded: faber's `web:` test fixtures (`package_test.rs`, `web2_build_integration_test.rs`) keep faber-web on disk as a pinned test dependency until the archival goal; tracked `dist/` in consumer repos is build-regenerated (no stale `web:` committed); `u2-verify-faber` flagged to Mind. |
| `validation` | The exact sweep grep (recorded in EVIDENCE.md) returns zero live matches; `git diff --check`. |
| `depends_on` | U5 |
| `non_goals` | **No faber-web archival** (a future goal; U6 reaches the condition, the archival is Mind/operator's). No deletion of faber-web source/runtime/tests. No faber test-fixture rewrites (recorded residual). No `u2-verify-faber` cleanup. |
| `risk` | **low** — a grep sweep + doc table row + residual record. The one judgment: the banner-table touch on a frozen repo is a docs-only correction (WSI U5 already set the precedent). |
| `est_work_tokens` / `est_basis` | ~2k. Basis: 1 bounded grep, 1 README row, 1 evidence record. |

## 8. Checkpoints and gates

| Gate | When | What |
| --- | --- | --- |
| **tela seven-gate** | U1 closeout (and re-run at U5/U6 boundaries if tela src changes) | `check-compile`, `check-exempla`, `check-mount`, `check-determinism`, `check-forms-proof`, `check-forms-interactive`, `check-reference` + ported `contract-test.ts` + `dom-runtime-test.ts` (WSI EVIDENCE §7 commands), fail-closed. |
| **faber narrow test** | U2 closeout | `cargo check -p faber` + `cargo test -p faber --lib` (touched module) — never a workspace suite (cargo discipline). |
| **Corpus builds** | U3, U4 | Per-package `triga/corpus/<slug>/tests/run.sh` (check + build + `controllers.json` selector grep + fixture assertions); aggregate `triga/corpus/serve.sh` once at U4 closeout. |
| **Example builds** | U5 | Per-package run.sh + fixture tests + the Playwright `interactive-test.mjs` / `smoke-test.mjs`. |
| **Retirement sweep** | U6 | Zero-live-consumer grep (recorded). |
| **Workspace-wide closeout** | merge lane | radix `./scripta/test --stage 1-3` (per the validation ladder; auditor/merge-owned, never the developing agent's loop). |

## 9. Validation summary

- **Surface parity**: consumer member usage vs the live tela surface is
  verified (this document §3.2) — dom member-identical, canvas2d one type
  rename, `web:web` annotation-only.
- **faber packaging**: U2's narrow cargo test proves the tela origin
  acceptance + invariant preservation.
- **Consumer builds**: every migrated package's own gate (build + controllers
  json + fixture assertions) is the done-when.
- **tela**: seven-gate green proves the tela surface is unaffected.

## 10. faber-web retirement condition (per WSI)

- faber-web is **frozen/deprecated** today (WSI U5). **Retirement** (no live
  consumer keeping it alive) is reached when the U6 sweep shows **zero live
  `web:` imports in consumer source**. Actual **archival** (moving faber-web
  to `archivum/` or a frozen branch) is a **future goal** — it must first
  re-pin faber's own `web:` test fixtures (residual R3) so faber's packaging
  tests keep a resolvable `web:` provider path.

## 11. Open questions for Mind

| # | Question | Default | Source |
| --- | --- | --- | --- |
| Q1 | `WebController` tela home: a new `tela:web` module (U1) **vs** folded into `tela:browser` (the announced WSI mapping row "web:web → tela:browser"). | **New `tela:web`** (naming symmetry; browser.fab stays lifecycle-focused; the faber-web banner row gets a precision edit in U6) | this delivery |
| Q2 | faber `controllers.rs` origin relaxation (U2) — a faber product change beyond "consumer moves". Acceptable? The alternative (consumers keep the `web:` annotation forever) means faber-web never retires. | **Relax (additive arms; invariants preserved)** | this delivery; Mind confirm |
| Q3 | faber test fixtures (`package_test.rs`, `web2_build_integration_test.rs`) pin `web:` resolution — keep faber-web on disk as a pinned test dependency at retirement (default, no faber test edits in this campaign) vs move fixtures now. | **Keep on disk; residual to the archival goal** | this delivery |
| Q4 | `u2-verify-faber/` — a stale detached snapshot repo (Aug 9) with `web:` fixtures, outside the workspace layout. Excluded from this migration. Clean it up / leave it? | **Leave; report only** | this delivery |
| Q5 | The `faber-web/README.md` banner-table touch in U6 is a docs edit on a frozen repo (precedent: WSI U5). Approved? | **Yes, docs-only** | this delivery |

## 12. Non-goals (campaign-wide)

- No faber-web archival (future goal; U6 reaches the condition only).
- No tela kernel (`src/tela.fab`) edits — WSI condition 2 (migration moves
  consumers, not the kernel).
- No rewrite of corpus/examples onto the `tela:browser.mount` view lifecycle.
- No removal of `@ WebController` annotations (browser-app packaging requires
  them; the annotation re-homes, it does not vanish).
- No radix/compiler changes.
- No la→en conversion of consumer keyword surfaces (import lines only).
- No docs-archaeology (stale-doc cleanup limited to what names a live seam).

## 13. Goal-check verdict (Phase B)

- **Summary**: `tela/docs/factory/web-to-tela-consumer-migration/DELIVERY.md`; evaluator mode = delivery-lowering + goal-check (goal-forge lite); intended consumer = delivery (Hands via Mind); **verdict: READY**.
- **Reasoning**: The inventory is complete and verified against live source; the tela surface is standalone (open question resolved); the single material gap (`web:web` WebController + faber's packaging verification) is named and planned as explicit enabler units (U1/U2) rather than hidden scope; the la→en cross-locale risk is bounded by a probe unit (U3) with a recorded fallback. Nothing blocks a mid-tier implementer from starting.
- **Key points**: member-level parity verified (no consumer-facing renames beyond `Canvas2dContext`→`Canvas2DContext`); every unit has write_scope/done_when/validation/deps/est; the seven-gate + per-package builds are the gates; retirement condition is objective (zero live consumer).
- **Blocking gaps**: none.
- **Recommended next**: delivery — Mind files U1, then U2, then U3→U4→U5→U6 in dependency order on Hand lanes; integration order via the merge lane: tela (U1) → faber (U2) → triga (U3/U4) → examples (U5) → faber-web docs (U6).

## 14. Report receipt (for planner-2's Vivi reply)

```text
kind: goal-check + delivery
planner: planner-2
assignment: 81539b0c
goal_path: tela/docs/factory/web-to-tela-consumer-migration/
delivery_path: tela/docs/factory/web-to-tela-consumer-migration/DELIVERY.md
verdict: READY
consumer: delivery
unit_count: 6
units:
  - id: web-mig-u1-tela-web-annotation
    write_scope: tela/src/web.fab + scripta/check-compile + AGENTS.md
    done_when: tela:web annotation contract checks clean; seven-gate green; no stale seam claims
    validation: tela seven-gate + 2 ported tests + git diff --check
    depends_on: none
  - id: web-mig-u2-faber-controller-origin-tela
    write_scope: faber/src/package/product/controllers.rs + package_test.rs
    done_when: tela-origin WebController+Scope accepted; local shadowing still rejected; web: fixtures green
    validation: cargo check -p faber + cargo test -p faber --lib
    depends_on: web-mig-u1-tela-web-annotation
  - id: web-mig-u3-corpus-probe
    write_scope: triga/corpus/webgl-geometries (main.fab imports + faber.toml + tests/run.sh lock + regenerated dist)
    done_when: tests/run.sh green; controllers.json selector; no web: in source/config
    validation: triga/corpus/webgl-geometries/tests/run.sh
    depends_on: web-mig-u2-faber-controller-origin-tela
  - id: web-mig-u4-corpus-batch
    write_scope: triga/corpus/{webgl-geometry-terrain,webgl-animation-terrain,webgl-animation-water,webgl-animation-orbit}
    done_when: each tests/run.sh green + selector grep + no web: refs
    validation: per-package tests/run.sh + aggregate serve.sh once
    depends_on: web-mig-u3-corpus-probe
  - id: web-mig-u5-examples-batch
    write_scope: examples/{triga-drift-city,triga-budapest,browser-app,hello-voxel,canvas2d-interactive,web-canvas2d-smoke} + harness specifier maps + Canvas2dContext renames
    done_when: each package gate green; shared loader-hook maps tela specifiers; no web: refs
    validation: per-package run.sh + Playwright interactive-test/smoke-test
    depends_on: web-mig-u4-corpus-batch
  - id: web-mig-u6-retirement-sweep
    write_scope: faber-web/README.md (banner row) + EVIDENCE.md
    done_when: zero live web: consumer in the sweep; banner row names tela:web; residuals recorded
    validation: recorded sweep grep returns zero; git diff --check
    depends_on: web-mig-u5-examples-batch
open_questions: [Q1 WebController home (default tela:web), Q2 faber controllers.rs relaxation, Q3 faber web: test fixtures at retirement, Q4 u2-verify-faber stale snapshot, Q5 faber-web banner docs touch]
```

Open questions and residuals are routed to Mind; the artifacts are uncommitted
(planning only — Mind owns the commit via the merge lane).
