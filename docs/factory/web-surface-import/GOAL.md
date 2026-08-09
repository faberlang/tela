# Goal: web-surface-import — import faber-web's browser surface into tela

**Status**: planning (goal drafted; goal-check + delivery lowering pending)
**Created**: 2026-08-09
**Planner**: mind (operator-authored goal)
**Target repo**: `/Users/ianzepp/work/faberlang/tela`
**Source repo**: `/Users/ianzepp/work/faberlang/faber-web` (deprecated on completion)
**Factory artifact dir**: `tela/docs/factory/web-surface-import/`

---

## Summary

Import faber-web's browser host surface — `web:dom` and `web:canvas2d` — into
tela under the `tela:*` namespace, converted from Latin (`la`) to English (`en`)
locale and identifiers. Fold `web:web`'s `WebController`/`Mount` framework
contract into `tela:browser`. Deprecate faber-web as a frozen legacy surface;
new browser work lives in tela.

This is an **import**, not a migration. The new `tela:*` surface is built
alongside the old `web:*` surface; existing faber-web consumers (examples,
exempla) keep working unchanged on the frozen `web:*` imports until they
migrate. The two providers never collide.

The outcome: tela becomes Faber's browser toolkit — a pure view-protocol core
(`tela:tela`, `tela:validate`) plus an impure browser layer (`tela:browser`,
`tela:dom`, `tela:canvas2d`) that it already de facto has. faber-web stops being
a separate repo a real consumer must also reach for.

## Problem

tela and faber-web are one product split across two repos. Today:

- `tela:browser` already depends on `web:dom` across a repo boundary — the one
  hard cross-repo edge in the product, existing only because the two surfaces
  live in separate repos.
- Every real faber-web consumer is also a tela consumer within one or two hops:
  a "standalone" canvas2D app still needs `web:dom` to acquire the element and
  subscribe to pointer/resize events. There is no audience served by the split.
- tela's identity as "pure view protocol" is already inaccurate: `tela:browser`
  holds host state, calls the DOM, runs the mount lifecycle. tela has a pure
  *core* and an impure *browser layer* — the purity boundary is at the module
  level, not the repo level.
- faber-web's Latin locale (`la`) is the documented `fix:web-dom-locale` pain
  that tela:browser had to work around; converting to `en` (tela's Stage 5 U0
  lock) retires that whole class of issue permanently.

There is no external contract protecting the split: faber-web has no standalone
release surface (it "rides faber" via `core-support-manifest.txt`). Only the
`web:*` import paths are public, and they are consumed entirely in-container.

## Goals

1. **`tela:dom`** — convert faber-web's `web:dom` to `en` locale + English
   identifiers, place at `tela/src/dom.fab` as module `tela:dom`, with its own
   runtime (`runtime/dom.ts`) and bindings (`bindings/ts.toml` entries).

2. **`tela:browser` flip** — change `tela:browser`'s import from `web:dom` to
   `tela:dom`. Closes the cross-repo edge on tela's side immediately.

3. **`web:web` fold** — absorb `WebController`/`Mount` into `tela:browser` where
   useful (`Mount` overlaps `tela:browser.mount`); drop the rest. `tela:browser`
   becomes the single browser-mount surface.

4. **`tela:canvas2d`** — convert `web:canvas2d` to `en` + English identifiers,
   place at `tela/src/canvas2d.fab` as module `tela:canvas2d`, with runtime +
   bindings. A standalone imperative-draw surface; does not touch the view
   core.

5. **faber-web deprecation** — deprecation banner + migration table on
   `faber-web/README.md`. faber-web is frozen for new features; critical fixes
   only.

## Non-Goals

- **No big-bang migration.** Existing `web:*` consumers (examples, exempla,
  docs) are NOT rewritten in this goal. They keep working on frozen faber-web
  until a separate consumer-migration effort (campaign Stage 7 territory).
- **No faber-web archival.** faber-web stays in place, frozen + deprecated. It
  archives only after its consumers migrate off `web:*` — a future goal.
- **No tela view-core changes.** `tela:tela`, `tela:validate` are untouched.
  The new modules are browser-host API surfaces, not view-protocol surfaces.
- **No shared abstraction between canvas2D and the view layer.** canvas2D is an
  imperative draw API; the view protocol is typed values. They stay separate
  modules (faber-web's canvas2d goal constraint C7 carries forward).
- **No radix/compiler changes.** The `la`→`en` conversion is source-level; the
  reader pack already supports both locales (tela proves `en` today).
- **No release / publication.** tela remains local-only (publication is a
  Stage 8 authorization gate).

## Architecture Direction

**Module placement — all inside `tela/src/`:**

| New module | Source | Provider:module | Targets | Locale |
| --- | --- | --- | --- | --- |
| `tela/src/dom.fab` | `faber-web/src/dom.fab` | `tela:dom` | `["ts"]` (runtime lane) | `en` |
| `tela/src/canvas2d.fab` | `faber-web/src/canvas2d.fab` | `tela:canvas2d` | `["ts"]` (runtime lane) | `en` |
| `tela/src/browser.fab` | (existing, edited) | `tela:browser` | `["ts"]` (runtime lane) | `en` |

`tela/faber.toml` keeps `targets = ["rust", "ts"]`; the new browser modules are
ts-runtime-lane modules inside the package, exactly as `browser.fab` already
is. tela's package-wide locale stays `en`.

**Runtime + bindings move:**

- `faber-web/runtime/dom.ts` → `tela/runtime/dom.ts` (copied + adapted)
- `faber-web/runtime/canvas2d.ts` → `tela/runtime/canvas2d.ts` (copied + adapted)
- `faber-web/bindings/ts.toml` → `tela/bindings/ts.toml` (new file in tela;
  entries re-prefixed `web:` → `tela:`)

Runtime duplication during deprecation is intentional: tela gets its own copies;
faber-web keeps its frozen copies until archival.

**The la→en conversion has two layers:**

1. **Keyword locale (mechanical):** `genus`→`class`, `functio`→`fn`,
   `textus`→`string`, `vacuum`→`void`, `bivalens`→`bool`, `numerus`→`int`,
   `lista`→`list`, `redde`→`return`, `nota`→(the en stub form), `nihil`→`null`,
   `falsum`→`false`, `verum`→`true`, `sponte`→(en optional marker),
   `∪ nihil`→`∪ null`. tela's kernel already uses all en spellings; this is
   the same conversion tela paid for `browser.fab`.

2. **Type/field identifiers (naming review):** most faber-web type names are
   already English (`Scope`, `Element`, `DomEvent`, `FrameState`, …). The Latin
   identifiers to rename:
   - `Nodus` → **naming decision** (DOM global `Node` collision; lean `DomNode`)
   - `identitas` → `identity`
   - `Canvas2dContext` → casing decision (`Canvas2DContext`? — tela uses
     PascalCase; lean match tela convention)
   - Latin-named **stdlib call sites keep their names** per tela's exception
     list (`longitudo()`, `sectio()`, `continet()`, `appende()`, `ordinata()`,
     `coalesce`, `∪`, `∷`, `∴`). Never rename a stdlib call — tela's locked
     rule.

**tela:browser flip:**

`tela/src/browser.fab` currently does `import from "web:dom" public * ut dom`.
After `tela:dom` lands, this becomes `import from "tela:dom" public * ut dom`.
Same module alias, same field access (`dom.Scope`, `dom.snapshot`, …) — the
flip is one import line, gated on `tela:dom` resolving.

**web:web fold:**

`faber-web/src/web.fab` exports `WebController { selector }` + `Mount` +
`mount`/`selector_of`. `Mount`/`mount` overlap `tela:browser.mount` (which is
strictly richer — hydration, lifecycle, effects). Fold only what adds value;
`tela:browser` is already the canonical mount surface. Likely outcome: drop
`web:web` entirely; if `WebController` has a real consumer, route it as a
named residual.

## Ground Truth Researched

### tela/ (confirmed by file read, 2026-08-09)

- **`faber.toml`:** `provider = "tela"`, `kind = "lib"`, `targets = ["rust",
  "ts"]`, `locale = "en"`, version `0.0.0`. The en locale + rust+ts targets are
  the landing shape for imported modules.
- **`src/tela.fab`:** the view kernel (690+ lines) — `View` union,
  `Attribute`/`Property`/`Identity`, escape + serializers, `Theme`/`Token`,
  `Bundle`/`Order` + `assemble`, `Effect`/`Update`. Import-free except
  `tela:validate`. **Not touched by this goal.**
- **`src/validate.fab`:** validation module. **Not touched.**
- **`src/browser.fab`:** the mount lifecycle (580+ lines). Imports
  `web:dom public * ut dom`. This is the one flip site: `web:dom` → `tela:dom`.
- **No `runtime/` or `bindings/` dir exists in tela yet.** This goal creates
  them (the browser runtime lands in tela for the first time).

### faber-web/ (confirmed by file read, 2026-08-09)

- **`faber.toml`:** `provider = "web"`, `kind = "lib"`, `targets = ["ts"]`,
  `locale = "la"`, `bindings = "bindings/ts.toml"`. The source of the la locale
  + ts-only posture being converted.
- **`src/dom.fab`:** 293 lines, 13 genus types (`Scope`, `Element`, `Nodus`,
  `DomEvent`, `FrameState`, `ResizeState`, `KeyboardState`, `PointerState`,
  `FocusState`, `PointerLockState`, `Subscription`, `SubmitOptions`,
  `FetchRequest`, `FetchResponse`), 9 handler typus, ~30 functio stubs (`nota`
  body + default return). One `@ futura` fn (`fetch_text`).
- **`src/canvas2d.fab`:** 211 lines. Imports `web:dom privata dom`; aliases
  `typus Element = dom.Element`. `Canvas2dContext` + `Path2D` handle genera,
  ~25 `nota`-stub functios. WEB1–2 delivered; WEB3–4 deferred.
- **`src/web.fab`:** 24 lines. `@ annotatio { target = functio }`, `WebController`,
  `Mount`, `mount`, `selector_of`. The fold target.
- **`runtime/dom.ts`:** 348 lines — `WebDomScope`, `WebDomElement`, etc., 25
  exported functions matching `ts.toml` symbols.
- **`runtime/canvas2d.ts`:** the Canvas2D TS shim (handles via module-level Map).
- **`bindings/ts.toml`:** `[shim] path = "runtime/dom.ts"` + 22 route entries,
  each `symbol = "webDomX"`. NO opener/result typing (the web-canvas2d Phase 0
  gap; not this goal's scope to fix, but carried forward).
- **`tests/`:** `contract-test.ts`, `dom-runtime-test.ts` (431 lines, fakes).
- **`docs/factory/web-canvas2d/`:** GOAL.md + delivery.md — the live canvas2d
  goal. WEB1–2 done; WEB3–4 deferred. After import, tela inherits this work as
  `tela:canvas2d` and the faber-web canvas2d goal is superseded.

## Constraints and Invariants

| # | Constraint | Source |
| --- | --- | --- |
| C1 | Import, not migration. `web:*` and `tela:*` coexist; no consumer rewrite in this goal. | Operator decision |
| C2 | `en` locale + English identifiers end to end. tela Stage 5 U0 lock applies to all imported modules. | tela AGENTS.md |
| C3 | Latin-named stdlib call sites keep their names. tela's locked exception list. | tela AGENTS.md |
| C4 | `tela:tela` and `tela:validate` are untouched. New modules are browser-host surfaces. | This goal |
| C5 | No shared canvas2D/view abstraction. canvas2D stays a standalone imperative surface. | faber-web canvas2d goal C7 |
| C6 | tela:browser's existing public surface (`mount`/`replace`/`dispose` + the policy fns) does not break. The flip changes the import line, not the API. | tela AGENTS.md |
| C7 | faber-web is frozen, not deleted, on completion. Deprecation banner only. | Operator decision |
| C8 | One `nota` stub convention: tela:dom/canvas2d keep the `nota`-body + default-return shape (TS runtime does the work), matching faber-web. | faber-web binding discipline |
| C9 | tela validation lanes apply: `radix check` (in-tree binary) + TS emit lane for every converted module; no cargo workspace suites mid-development. | tela AGENTS.md + Cargo discipline |

## Naming Decision Points

These need a resolution before/during the naming review (lean values stated;
confirm at delivery):

| Identifier | Latin | English lean | Note |
| --- | --- | --- | --- |
| Snapshot node type | `Nodus` | `DomNode` | DOM global `Node` collision; tela references `dom.Nodus` in browser.fab |
| Snapshot identity field | `identitas` | `identity` | tela browser.fab reads `.identitas` |
| Context type | `Canvas2dContext` | `Canvas2DContext` | PascalCase consistency (tela multi-word types concatenate) |
| Stub marker | `nota` | (en stub form) | verify en spelling against reader pack |
| Optional marker | `sponte` | (en optional form) | verify; tela uses `∪ null` for nullable, `sponte` may differ |
| Async marker | `@ futura` | (en async form) | verify en annotation spelling |
| Annotation marker | `@ annotatio` | (en annotation form) | verify |

## Implementation Shape

### Phase 0 — `tela:dom` source conversion (la→en) (S–M)

**Write surface:** `tela/src/dom.fab` (new), `tela/faber.toml` (no change —
same package/module discovery).

Convert `faber-web/src/dom.fab` to en locale + English identifiers →
`tela/src/dom.fab`. Resolve the naming decisions (§ Naming Decision Points).
Verify: `radix check src/dom.fab --locale en` + TS emit lane (`emit -t ts` →
`tsc --noEmit`).

**First milestone:** `tela:dom` checks clean in both lanes; the module resolves
as `tela:dom` from the container root.

### Phase 1 — `tela:dom` runtime + bindings (M)

**Write surface:** `tela/runtime/dom.ts` (new), `tela/bindings/ts.toml` (new).

Copy `faber-web/runtime/dom.ts` + `bindings/ts.toml` entries into tela;
re-prefix routes `web:dom.X` → `tela:dom.X` (symbols `webDomX` stay or rename
to `telaDomX` — decision). Port the runtime test (`dom-runtime-test.ts`) as a
tela-local copy.

**First milestone:** a tela app importing `tela:dom` resolves routes through
`tela/bindings/ts.toml` → `tela/runtime/dom.ts`.

### Phase 2 — `tela:browser` flip + `web:web` fold (S)

**Write surface:** `tela/src/browser.fab` (edited).

Flip the import line `web:dom` → `tela:dom`. Fold `web:web`'s useful parts
into `tela:browser` (likely nothing — `tela:browser.mount` supersedes
`Mount`/`mount`; `WebController` routed as residual if it has a consumer).
Verify: the existing browser exempla + `check-mount` harness stay green against
the new `tela:dom` seam.

**First milestone:** `tela:browser` imports `tela:dom`; the cross-repo edge to
faber-web is gone from tela's side; browser exempla green.

### Phase 3 — `tela:canvas2d` import (M)

**Write surface:** `tela/src/canvas2d.fab` (new), `tela/runtime/canvas2d.ts`
(new), `tela/bindings/ts.toml` (extend).

Convert `faber-web/src/canvas2d.fab` (la→en) → `tela/src/canvas2d.fab`
(`tela:canvas2d`). Update the dom import `web:dom privata dom` →
`tela:dom privata dom`. Copy `runtime/canvas2d.ts` + bindings. Depends on
Phase 0 (`tela:dom`, for the `Element` alias).

**First milestone:** `tela:canvas2d` checks clean; routes resolve through tela
bindings + runtime.

### Phase 4 — faber-web deprecation (S)

**Write surface:** `faber-web/README.md` (edited).

Deprecation banner at top + migration table (`web:dom`→`tela:dom`,
`web:canvas2d`→`tela:canvas2d`, `web:web`→`tela:browser`). faber-web is frozen
for new features; critical fixes only until archival.

**First milestone:** faber-web README carries the deprecation banner pointing
at the `tela:*` equivalents.

## Release Posture

No release. tela remains local-only (publication is a Stage 8 gate). The import
ships as tela source changes; faber-web ships a README deprecation. No version
bump implied by this goal.

## Validation

| Phase | Check |
| --- | --- |
| 0 | `radix/target/debug/radix check src/dom.fab --locale en`; TS emit → `tsc --noEmit` |
| 1 | runtime test ported + green; route resolution through `tela/bindings/ts.toml` |
| 2 | browser exempla + `scripta/check-mount` green against `tela:dom` seam |
| 3 | `radix check src/canvas2d.fab --locale en`; TS emit lane; route resolution |
| 4 | deprecation banner present + migration table accurate |

All checks use the **in-tree** radix binary (`radix/target/debug/radix`,
0.80.0) per tela AGENTS.md. No cargo workspace suites mid-development; one
closeout via `./scripta/test --stage 1-3` from `radix/` at end.

## Open Questions

| # | Question | Default | Source |
| --- | --- | --- | --- |
| Q1 | `Nodus` → `DomNode` (DOM `Node` collision) or bare `Node`? | `DomNode` | naming review |
| Q2 | Runtime symbol prefix: keep `webDomX` or rename to `telaDomX`? | `telaDomX` (consistency) | delivery |
| Q3 | Does `WebController` have a real consumer to fold, or drop entirely? | drop (route as residual if found) | web:web fold |
| Q4 | Does tela need a `bindings/ts.toml` shim-path split (dom + canvas2d separate shim paths) or one merged shim? | two shim paths (match faber-web shape) | delivery |
| Q5 | Carry forward the web-canvas2d Phase 0 contract-harness gap (no opener/result typing in ts.toml)? | carry as deferred; not this goal's scope | faber-web canvas2d goal |

## Stop Conditions

1. The conversion exposes a compiler/reader gap that blocks `en` for these
   modules — stop, file a minimized radix delivery, do not weaken the contract.
2. tela:browser's public surface would break to accommodate the flip — stop,
   report; the flip is import-only by constraint C6.
3. A real external `web:*` consumer surfaces outside the container — stop;
   the "no external contract" premise reopens.
4. canvas2D starts growing view-protocol coupling — stop (constraint C5;
   faber-web canvas2d goal C7).

## Readiness Label

**Ready for delivery** — the work is well-bounded (two source modules + one
flip + one fold + one banner), the conversion is mostly mechanical with a
small named identifier review, and the conventions (en locale, English
identifiers, stdlib exception list) are all established in tela's AGENTS.md.
Lower as a single delivery spec; the four phases sequence naturally (dom → dom
runtime → browser flip → canvas2d → deprecation).
