# Web-Surface-Import — Delivery Spec (P3)

**Status**: delivery lowered (planner-1, 2026-08-09); goal-check READY; implementation pending Mind admission
**Planner**: planner-1 (assignment 2e573e1b)
**Goal**: `tela/docs/factory/web-surface-import/GOAL.md` (committed tela `a20c967`, operator-authored)
**Control-plane repo**: `/Users/ianzepp/work/faberlang/tela`
**Source repo**: `/Users/ianzepp/work/faberlang/faber-web` (frozen on completion)
**Mode**: planning artifacts only. This spec lowers the goal; it does not implement. No product code, no merge, no Hand tasking by this planner.

---

## 1. Goal-Check

- **Artifact reviewed**: `tela/docs/factory/web-surface-import/GOAL.md` — Summary/Problem/Goals/Non-Goals/Architecture Direction/Ground Truth/Constraints/Naming Decision Points/Phases/Validation/Open Questions/Stop Conditions — checked against the LIVE tela/faber-web/radix surface (probes below), the landed Stage 4 seam, the Stage 5 wave (in flight), the English-first convention (Stage 5 U0), and the faber-web host-binding contract.
- **Evaluator mode**: self-contained cold pass (planner-1 — the lowerer also the checker; the independent pass is the delivery auditor's, the established Stage 1–5 pattern).
- **Intended next consumer**: `delivery` (this spec) → `factory` (Mind files Hand units citing delivery unit ids).
- **Verdict**: **READY**.
- **Reasoning**: The goal is well-bounded (two source conversions + one flip + one fold + one banner), the la→en conversion is **mechanically viable and verified live** (probes below: `radix check --locale en` + TS emit green on the full converted surfaces, in-tree radix 0.80.0, zero radix changes), the delta beyond the landed seam is honestly scoped (§3), and every naming decision the goal left open resolves to a probed default (§5.2). No blocker, no `NEEDS FURTHER REVIEW`: the one forced rename (`value` → `input_value`) and the flip's harness-rewire scope are named, bounded, and probed — they change the unit graph, not the verdict.
- **Key points**:
  - **Seam live-verified** (2026-08-09): `tela/src/browser.fab` imports `web:dom public * ut dom`; `radix check src/browser.fab --locale en` emits exactly the **9 recorded `dom.on*` WARN014 skips** (on, on_focus, on_frame, on_input, on_keyboard, on_pointer, on_pointer_lock, on_resize, on_submit) — the Stage 5 U1 discovery's live count confirmed; the skips are recorded-not-blocking (host-binding read at the harness boundary).
  - **The conversion is proven, not assumed**: a mechanical la→en conversion of `faber-web/src/dom.fab`, `canvas2d.fab`, `web.fab` checks `ok` under `--locale en`; the final intended shapes (renames applied, below) check `ok` AND emit TS green (`emit -t ts --locale en` exit 0). The en reader pack (`radix/stdlib/locale/en/pack.toml`) supplies every required spelling. No radix change is required — the goal's "No radix/compiler changes" non-goal holds.
  - **One forced rename discovered by probe**: `fn value(Element) → string` collides with the en-locale type keyword `value` (canonical `valor`) → `SEM005.duplicate_definition`. The conversion is NOT purely mechanical — `value` → `input_value` (probed green). This is the G6 reserved-keyword class in the en surface; the goal doc's "small named identifier review" anticipated it; it is now concrete.
  - **The goal's "flip is one import line" under-scopes the harness rewire**: the flip changes `browser.fab`'s *public signature references* (`dom.Nodus` → `dom.DomNode`, `.identitas` → `.identity` — forced by the English-first convention), and the emitted TS references these as **bare identifiers** (`Array<Nodus>`, `.identitas` — verified in the emitted `browser.ts`). The flip therefore ripples into `exempla/browser.fab`, `scripta/dom-shim.ts`, and every harness assembly (`check-mount`, `check-exempla`, `check-forms-interactive`, `check-determinism`, `check-compile`, `check-reference`). The unit graph carries this; the goal's Phase 2 prose does not.
  - **Serialization with Stage 5 is MANDATORY for the flip**: hand-7 is running Stage 5 U2 **right now** (uncommitted `src/reference.fab` + `exempla/reference.fab` + `canary-app/src/main.fab` in the working tree, verified 2026-08-09). Stage 5 U2–U8 extend the same `scripta/` harness files + `canary-app/src/main.fab` the flip must rewire. The flip unit must serialize after the Stage 5 catalog wave (§5.4).
  - **One stale ground-truth claim**: "NO opener/result typing (the web-canvas2d Phase 0 gap…)" — the live `faber-web/bindings/ts.toml` HAS `opener` + `result` on every route (added by the web-canvas2d Unit 0/1/2 work; `tests/contract-test.ts` verifies them). Corrected here — the contract machinery exists and ports cleanly.
- **Blocking gaps**: none.
- **Escalation reason**: none.
- **Recommended next step**: delivery lowering (this spec) → delivery audit → Mind admission.

---

## 2. Probe Evidence (all live, 2026-08-09, in-tree `radix/target/debug/radix` 0.80.0)

| # | Probe | Result |
| --- | --- | --- |
| P1 | `radix check tela/src/browser.fab --locale en` | `ok`; exactly the 9 `dom.on*` WARN014 skips + WARN003 noise (the seam shape) |
| P2 | Mechanical la→en conversion of `faber-web/src/dom.fab` → scratch | `check` `ok`; TS `emit` **fails** on `SEM005:duplicate_definition` at `fn value(…)` |
| P3 | Same with `value` → `input_value`, `Nodus` → `DomNode`, `identitas` → `identity` (final shape) | `check` `ok`; `emit -t ts` **exit 0**; raw emitted module hits the known DOM-lib `Element` TS2300 collision (the assembly's `strip_dom` rename — the la module has the identical property today, harness-handled) |
| P4 | Same treatment for `canvas2d.fab` (en + `Canvas2DContext` + `type Element = dom.Element`) against a scratch `tela:dom` package under `FABER_LIBRARY_HOME` | `check` `ok`; `emit` exit 0 |
| P5 | `faber-web/src/web.fab` → en (`class`/`fn`/`string`, `@ annotatio` kept) | `check` `ok` (the `annotatio` annotation name has no en surface in the pack — keep the name; it is an annotation *name*, not a keyword) |
| P6 | Emitted `browser.ts` reference shape | `identities_from_nodes(nodes: Array<Nodus> \| null)` + `.identitas` — bare identifiers, not `dom.Nodus` (the flip renames ripple into the shim + exempla) |
| P7 | Reader pack surface (`radix/stdlib/locale/en/pack.toml`) | `nota`→`print`, `sponte`→`optional`, `futura`→`future`, `lista`→`list`, `vacuum`→`void`, `bivalens`→`bool`, `numerus`→`int`, `textus`→`string`, `valor`→`value` (the SEM005 source); `⇥` is a glyph — never localizes |
| P8 | Classifier (`radix/scripta/audit-factory-goal-status.py`) on the goal Status line | current `planning (…)` → `PLANNED`; proposed `ready for delivery — …` → `ACTIVE` (machine-parseable either way) |

**Not touched by probes**: no radix source edits, no workspace cargo, no product files outside `/tmp` scratch.

---

## 3. The Delta — what "import the browser surface" adds beyond the landed seam

The seam is real and landed: `tela:browser` consumes `dom.Scope` + `dom.snapshot` through the normal package interface (en→la `web:dom`, the Stage 4 gate, `fix:g4`/`fix:web-dom-locale` removed). The import is therefore **not a functional unlock** — it is an **ownership + locale + breadth + single-product move**:

1. **Locale normalization + ownership of the DOM contract** — the DOM surface becomes en-locale + English-identified (`DomNode`, `identity`, `input_value`) and **tela-owned** (`tela:dom`). The la provider dependency disappears from `tela/src`. The `fix:web-dom-locale` class is permanently retired (the en→la edge was already fixed; this removes the *reason* it existed).
2. **Canvas2D breadth** — genuinely new tela surface: `tela:canvas2d` (the imperative draw API + runtime + bindings), inheriting the web-canvas2d goal's WEB1–2 delivered work; WEB3-4 (Unit 3: gradients, `draw_image`/`ImageData`) carries forward as a deferred residual.
3. **The `web:web` framework contract** (`WebController`/`Mount`) — fold decision: **drop entirely**; `tela:browser.mount` supersedes `Mount`/`mount`; `WebController` has two in-container example consumers (`examples/web-canvas2d-smoke`, `examples/canvas2d-interactive`) that stay frozen on `web:*` — recorded as a residual, never folded.
4. **Cross-repo edge removal at the source level** — `browser.fab` imports `tela:dom`; the harness assemblies (`check-forms-interactive`, `check-determinism`, and the dom-shim consumers) move off the `$ROOT/../faber-web` hard references onto tela's runtime + bindings.
5. **faber-web deprecation** — banner + migration table; faber-web frozen, not deleted.

---

## 4. Repo-Aware Baseline (live-verified 2026-08-09)

- **`tela/`** — clean git (Stage 5 U2 uncommitted WIP present: `src/reference.fab`, `exempla/reference.fab`, `canary-app/src/main.fab` — foreign WIP, never touched by this goal's units). Contents: `faber.toml` (`provider = "tela"`, `targets = ["rust", "ts"]`, `locale = "en"`, **no `[target.ts] bindings` entry yet**); `src/tela.fab` (kernel — the en surface, `Property { name, value }` proves a field named `value` is legal — only the **fn** `value` collides); `src/validate.fab`; `src/browser.fab` (the `web:dom` import + `dom.Nodus`/`.identitas` references at `identities_from_nodes`/`tags_from_nodes`); `src/reference.fab` (Stage 5 U2 in-flight); `exempla/` (incl. `browser.fab` — constructs `dom.Nodus { identitas = … }`; `reference.fab` in-flight); `scripta/` (`check-compile` iterates `tela validate`; `check-exempla` browser case binds the dom-shim DOM_NS; `check-mount` binds the dom-shim + the segmented driver; `check-forms-interactive` + `check-determinism` emit `$ROOT/../faber-web/src/dom.fab` (la) + include `$ROOT/../faber-web/runtime/dom.ts` verbatim; `dom-shim.ts` declares `class Scope` + `class Nodus { identitas!: string }` + the `webDom*` surface); `proof/benchmark/canary-app/src/main.fab` imports `web:dom public * ut dom` (7 `dom.` references: `dom.scope`, `dom.Scope`, `dom.snapshot`); `proof/benchmark/libhome/` (symlink `tela → ../../..` — `tela:dom` resolves automatically once `src/dom.fab` exists).
- **`faber-web/`** — clean git. `faber.toml` (`provider = "web"`, `targets = ["ts"]`, `locale = "la"`, `[target.ts] bindings = "bindings/ts.toml"`); `src/dom.fab` (293 lines, 13 genera, 9 handler `typus`, `@ futura fetch_text`); `src/canvas2d.fab` (211 lines, `importa ex "web:dom" privata dom`, `Canvas2dContext`/`Path2D`, ~25 stubs); `src/web.fab` (24 lines, `@ annotatio`, `WebController`, `Mount`, `mount`, `selector_of`); `runtime/dom.ts` (the `webDom*` surface — `WebDomNodus { identitas, tag, namespace, local }`); `runtime/canvas2d.ts` (the `webCanvas2d*` surface, module-level handle Maps); `bindings/ts.toml` (`[shim]` dom + `[shims.canvas2d]`, route → symbol + `opener`/`result` on **every** route — the goal doc's "NO opener/result typing" claim is stale); `tests/` (`contract-test.ts` cross-checks .fab ↔ ts.toml ↔ runtime; `dom-runtime-test.ts` 431 lines of fakes).
- **The landed seam (Stage 4)** — the canary-app imports `web:dom` (en→la) + `tela:browser`; `check-forms-interactive` assembles the real route (emitted app/browser `dom.*` refs → emitted web:dom provider → `bindings/ts.toml` → `runtime/dom.ts` verbatim) over a WEB5-precedent fake DOM.
- **Stage 5 (in flight)** — U0 (English-first rename wave) + U1 (discovery, `fde3a0d`) landed; **U2 (layout-typography) running NOW** (hand-7, task 800837ec). Stage 5 writes `src/reference.fab` (U2–U8, strictly sequential), `exempla/reference.fab`, `canary-app/src/main.fab` (U2–U8), `scripta/` (`check-reference` new; `check-exempla`/`check-compile`/`check-determinism`/`check-mount` extended U2–U8; `dom-shim.ts` **deleted by U9**; the embedded fake DOM in `check-forms-interactive` removed by U9), and U10 runs the seven-harness evidence boundary.
- **Radix binary** — in-tree `radix/target/debug/radix` (0.80.0), prebuilt; `--locale en`; the radix repo has foreign WIP (fire-17 audit in flight) — **no radix edits by any unit** (probes prove none are needed).

---

## 5. Normalized Spec + Locked Decisions

### 5.1 Normalized spec

In the `tela` repo: **`src/dom.fab`** (`tela:dom` — the en conversion of faber-web's dom contract, import-free), **`src/canvas2d.fab`** (`tela:canvas2d` — en, importing `tela:dom private dom`, aliasing `type Element = dom.Element`), **`runtime/dom.ts` + `runtime/canvas2d.ts`** (the tela-owned host bindings — copied from faber-web, adapted to the en field names, runtime symbols kept), **`bindings/ts.toml`** (route → symbol with the `[shim]` + `[shims.canvas2d]` split, route keys re-prefixed `web:` → `tela:`), **`tela/faber.toml`** gains `[target.ts] bindings = "bindings/ts.toml"`, **`tests/`** (the ported `contract-test.ts` + `dom-runtime-test.ts`, en-adjusted), the **`browser.fab` flip** (import + the `DomNode`/`identity` signature references), the **harness rewires** (the flip unit), and the **faber-web deprecation** (README banner + migration table + the web-canvas2d goal Status line).

`tela:tela` and `tela:validate` are untouched (C4). The view core is untouched (C5 — canvas2d stays a standalone imperative surface).

### 5.2 Naming decision resolutions (probed; all green)

| Identifier | Latin | Locked en | Evidence |
| --- | --- | --- | --- |
| Snapshot node | `Nodus` | **`DomNode`** | P3 — `class DomNode { identity, tag, namespace, local }` checks + emits |
| Identity field | `identitas` | **`identity`** | P3; matches the Stage 5 U0 kernel rename |
| Value fn | `value` | **`input_value`** | P2/P3 — `value` is SEM005 (en type keyword); `input_value` green; route `tela:dom.input_value → webDomValue` |
| Context type | `Canvas2dContext` | **`Canvas2DContext`** | P4 — PascalCase concatenation (S5-U0) |
| Stub marker | `nota` | **`print`** | P7 — the en surface of the canonical stub; the `print` bodies emit `console.log` in TS, never executed (the DOM_NS const shadows the emitted fns; the la module has the identical property) |
| Optional marker | `sponte` | **`optional`** | P7/P3 (`string body optional`) |
| Async annotation | `@ futura` | **`@ future`** | P7/P3 (`fn fetch_text(FetchRequest request) → FetchResponse ⇥ string`) |
| Annotatio | `@ annotatio` | **kept** | P5 — annotation *name*, not a keyword; no en surface in the pack |
| Runtime symbols | `webDomX`/`webCanvas2dX` | **kept** | the runtime is the documented host-binding contract; the harnesses + shim bind these by name; the provider prefix changes in the route keys only (alternative `telaDomX` recorded — rejected: a wide cosmetic sweep across every harness with zero functional gain) |
| `web:web` fold | — | **drop entirely** | §3 — `WebController` has two frozen example consumers; `Mount`/`mount` superseded by `tela:browser.mount` |
| Bindings shim split | — | **two shim paths** (`[shim]` dom + `[shims.canvas2d]`) | the faber-web shape is the proven pattern |

Advisory `LOCALE002` warnings (keyword-like spellings, non-blocking) on the converted surface: `local`, `width`, `alt`, `shift`, `id`, `status`, `ok`, `require`, `on`. Recorded; the naming review may leave them (they parse + emit) or rename at the Hand's discretion with the route keys following. Never a gate.

### 5.3 Module placement + the faber.toml shape

| New module | Provider:module | Source | Locale | Write unit |
| --- | --- | --- | --- | --- |
| `tela/src/dom.fab` | `tela:dom` | `faber-web/src/dom.fab` converted | `en` | U1 |
| `tela/runtime/dom.ts` + `tela/bindings/ts.toml` (dom) | binding surface | faber-web copies adapted | — | U2 |
| `tela/src/canvas2d.fab` | `tela:canvas2d` | `faber-web/src/canvas2d.fab` converted | `en` | U3 |
| `tela/runtime/canvas2d.ts` + bindings extend | binding surface | faber-web copy adapted | — | U3 |
| `tela/faber.toml` | — | `[target.ts] bindings = "bindings/ts.toml"` added | — | U2 |
| `tela/src/browser.fab` (edited) | `tela:browser` | import + signature refs flipped | `en` | U4 |

`tela`'s package-wide `targets = ["rust", "ts"]` is unchanged; the new modules are ts-runtime-lane modules inside the package (the `browser.fab` precedent). The Rust lane posture is unchanged: `radix emit -t rust` attempted + recorded per unit boundary; `fix:codegen001` (scratch compile red on the kernel's `topological_order` E0382 — the Stage 5 U1 refined observation) never the gate. The `tela:dom`/`tela:canvas2d` modules are import-free (dom) / single-sibling-import (canvas2d) — the G4-safe flat shape holds; the 9 `dom.on*` WARN014 skips persist on importers (now sourced from `tela:dom`) — recorded-not-blocking.

### 5.4 Coordination constraints (record, don't invent)

1. **Stage 5 serialization (the flip)**: Stage 5 U2–U8 extend the same `scripta/` harness files + `canary-app/src/main.fab` the flip (U4) rewires. **U4 must land after Stage 5 U8** (the last catalog unit) and before or after U9/U10 per Mind's lane choice — never interleaved with a Stage 5 unit that is actively extending a harness file. The default slot: **after Stage 5 U8, before U9** (U9's fake-DOM conversion then authors against the final `DomNode`/`identity` names — one authoring pass). Alternative: after Stage 5 U10 (cleanest ownership separation; the flip then renames the U9-authored names). U1/U2/U3 touch **new files only** (`src/dom.fab`, `runtime/`, `bindings/`, `tests/`, `src/canvas2d.fab`) — parallel-safe with the entire Stage 5 wave; they must NOT touch `scripta/` (the harness list additions ride U4).
2. **One committing lane per repo**: `tela/` units serialize (U1→U2→U3, U4 gated, U6 last); `faber-web/` has exactly one unit (U5). faber-web is otherwise read-only (frozen).
3. **No radix edits** — probed unneeded; the radix repo has foreign WIP (fire-17). A NEW gap surfaced by a unit records a minimized repro + `fix:<id>` marker + work-around (dependency rule 2) — never a weakened contract.
4. **The factory README regeneration** (`scripta/generate-factory-readme.py` + `audit-factory-goal-status.py`, radix/scripta) at doc-creation time is the **Mind's planning commit** (this planner does not commit); the goal closeout re-runs it for the evidence records. The goal Status line stays machine-parseable (P8: `ready for delivery — …` → ACTIVE bucket).
5. **C1 holds**: faber-web's own consumers (examples, exempla) are NOT rewritten; they stay frozen on `web:*`. The canary-app flip is a decision (Q1 — default: flip; it is tela-owned proof, not a protected consumer).
6. **The web-canvas2d goal is superseded** — its Unit 3 (gradients, `draw_image`/`ImageData`) carries forward as a deferred `tela:canvas2d` residual (Q5/Q6); the faber-web canvas2d goal Status line flips to `closed — superseded by tela web-surface-import` in U5 (classifier-parseable).
7. **Determinism posture**: the flip does NOT change the runner's static output (the same Views render the same bytes; only the emitted module sources + assembly change). No sha supersession is expected; the evidence unit re-records and flags honestly if the composition output changes.

---

## 6. Ordered Unit Graph

```
Wave A (parallel-safe with the Stage 5 wave — new files only):
  U1 tela-dom-source            (src/dom.fab — the en conversion)
  U2 tela-dom-runtime-bindings  (runtime/dom.ts + bindings/ts.toml + tests + faber.toml)
Wave B:
  U3 tela-canvas2d              (src/canvas2d.fab + runtime/canvas2d.ts + bindings extend)   [U1, U2]
Wave C (GATED on Stage 5 U8 landed + U3):
  U4 browser-flip-harness-rewire (browser.fab + exempla + scripta rewires + canary)          [U3, Stage 5 U8]
Wave D:
  U5 faber-web-deprecation      (faber-web README + web-canvas2d goal Status)                 [U3, U4]
Wave E:
  U6 evidence                   (full surface green once + evidence record)                   [U4, U5]
```

Shared-file constraints: `src/dom.fab` is written by U1 only; `runtime/dom.ts` + `tests/` by U2 only; `src/canvas2d.fab` by U3 only; `bindings/ts.toml` by U2 (create) + U3 (extend) — sequential; `tela/faber.toml` by U2 only; `src/browser.fab` + `exempla/browser.fab` + `scripta/dom-shim.ts` by U4 only (until Stage 5 U9 deletes the shim — U4 lands before or after U9 per Mind's slot choice, §5.4); the `scripta/check-*` harness files by U4 only (this goal) — never overlapping a Stage 5 unit. **No unit overlaps another unit's write_scope.**

| # | Unit | Wave | Depends on |
|---|---|---|---|
| U1 | `web-import-u1-tela-dom-source` | A | English surface (S5-U0) landed |
| U2 | `web-import-u2-tela-dom-runtime-bindings` | A | U1 |
| U3 | `web-import-u3-tela-canvas2d` | B | U1, U2 |
| U4 | `web-import-u4-browser-flip-harness-rewire` | C | U3; **Stage 5 U8 landed** (external gate) |
| U5 | `web-import-u5-faber-web-deprecation` | D | U3, U4 |
| U6 | `web-import-u6-evidence` | E | U4, U5 |

---

## 7. Units

### U1 — `web-import-u1-tela-dom-source`

| Field | Value |
|---|---|
| `id` | `web-import-u1-tela-dom-source` |
| `outcome` | `tela/src/dom.fab` (`tela:dom`) — the faber-web DOM contract converted to en locale + English identifiers per §5.2 (`Scope`, `Element`, `DomNode`, `DomEvent`, `FrameState`, `ResizeState`, `KeyboardState`, `PointerState`, `FocusState`, `PointerLockState`, `Subscription`, `SubmitOptions`, `FetchRequest`, `FetchResponse`, the 9 handler `type` aliases, the ~30 `fn`s incl. the renamed `input_value`, the `print`-body stub convention (C8), `@ future fetch_text` with the `⇥` glyph). Import-free (the G4-safe flat shape). Header documents the source (faber-web `src/dom.fab`), the conversion record, and the `fix:` markers carried (the 9 `dom.on*` skips — recorded; the `LOCALE002` advisory spellings — recorded). |
| `write_scope` | `tela/src/dom.fab` (new) |
| `read_scope` | `faber-web/src/dom.fab` (the conversion source, read-only); this DELIVERY.md §5.2 (the locked names); `tela/src/browser.fab` + `tela/exempla/browser.fab` (the consumers' `dom.Nodus`/`.identitas` usage); `tela/AGENTS.md` (en surface, stdlib exception list, flat-module rule); `radix/stdlib/locale/en/pack.toml` (keyword surface) |
| `done_when` | (a) `radix check src/dom.fab --locale en` → `ok` (the 9 `dom.on*` WARN014 skips appear on *importers*, not on the module itself — a clean module is expected). (b) `radix emit -t ts --locale en` exit 0. (c) A scratch assembly (the harness `strip_dom` mechanics: preamble + `Element` rename) + `tsc --noEmit --strict` green — the raw emitted module's `Element` TS2300 vs the DOM lib is the known assembly-handled collision (the la module's identical property). (d) The conversion is byte-honest: every public symbol from faber-web's dom.fab has exactly one en counterpart (the route bijection is verified by U2's contract-test); no symbol dropped except the recorded renames. (e) The `print`-body stub convention holds (no behavior in the module — the runtime does the work). (f) `git diff --check` in `tela/`. |
| `validation` | `radix/target/debug/radix check src/dom.fab --locale en`; `radix/target/debug/radix emit -t ts --locale en src/dom.fab` → scratch assembly (`strip_dom` mechanics) → `tsc --noEmit --strict --target ES2020 --lib ES2020,DOM --skipLibCheck`; `git diff --check`. No cargo (the prebuilt in-tree binary only). |
| `depends_on` | the English surface (Stage 5 U0) landed (done) |
| `non_goals` | No `scripta/` edits (U4). No `runtime/`/`bindings/`/`tests/` (U2). No `canary-app` (U4). No faber-web edits. No radix edits. No kernel (`tela:tela`) edits. |
| `risk` | **Low.** The conversion is mechanical + probed green end-to-end (P2/P3); the only judgment is the naming review, which §5.2 locks. |
| `est_work_tokens` | 5–9k |
| `test_owner` | Unit Hand (probes + lanes); reviewer (route bijection vs faber-web's dom.fab; §5.2 names). |

### U2 — `web-import-u2-tela-dom-runtime-bindings`

| Field | Value |
|---|---|
| `id` | `web-import-u2-tela-dom-runtime-bindings` |
| `outcome` | The tela-owned DOM host binding: `tela/runtime/dom.ts` (faber-web's runtime copied + adapted — `WebDomNodus.identitas` → `identity`; runtime symbols `webDom*` kept), `tela/bindings/ts.toml` (new — `[shim] path = "runtime/dom.ts"` + the dom routes re-keyed `web:dom.X` → `tela:dom.X`, symbols + `opener`/`result` carried with the en Faber type names: `string`, `void`, `bool`, `int`, `list<Element>`, `Scope`, `Element`, `DomNode`, `Subscription`, `SubmitOptions`, `FetchRequest`, `FetchResponse`), `tela/faber.toml` gains `[target.ts] bindings = "bindings/ts.toml"`, and the ported tests (`tela/tests/contract-test.ts` + `tela/tests/dom-runtime-test.ts`, en-adjusted — the contract-test's plain-text cross-check of .fab ↔ ts.toml ↔ runtime now validates the tela:dom surface). |
| `write_scope` | `tela/runtime/dom.ts` (new), `tela/bindings/ts.toml` (new), `tela/faber.toml` (edit — add `[target.ts] bindings`), `tela/tests/contract-test.ts` (new), `tela/tests/dom-runtime-test.ts` (new) |
| `read_scope` | `faber-web/runtime/dom.ts` + `faber-web/bindings/ts.toml` + `faber-web/tests/` (the sources, read-only); `tela/src/dom.fab` (U1 — the route bijection target); `faber-web/faber.toml` (the `[target.ts]` shape) |
| `done_when` | (a) The ported `dom-runtime-test` runs green under node (the faber-web run mechanics: `tsc` then `node` the compiled test). (b) The ported `contract-test` runs green — every `tela:dom.X` route ↔ symbol ↔ functio bijection holds against `src/dom.fab` + `runtime/dom.ts`. (c) A scratch route-resolution probe: a scratch `.fab` importing `tela:dom` (emitted under the container library home) assembles with the DOM_NS const bound over `tela/runtime/dom.ts` (the `check-forms-interactive` mechanics) → `tsc --noEmit` + `node` exit 0. (d) `tela/faber.toml` declares the binding surface; `radix check` on the package modules stays green with the new entry. (e) `git diff --check` in `tela/`. |
| `validation` | `node` on the two ported tests (tsc-compiled); the scratch route-resolution probe (`tsc --noEmit` + `node`); `radix check --locale en` on `src/dom.fab`; `git diff --check`. No cargo. |
| `depends_on` | U1 |
| `non_goals` | No canvas2d routes (U3). No `scripta/` edits (U4). No faber-web edits. No radix edits. |
| `risk` | **Low.** Copy + adapt + port on the proven faber-web shape; the contract-test machinery exists and validates the bijection mechanically. |
| `est_work_tokens` | 5–9k |
| `test_owner` | Unit Hand; reviewer (the adapted `identity` field vs the en module + the faber-web consumers' frozen `identitas` — both correct in their own lane). |

### U3 — `web-import-u3-tela-canvas2d`

| Field | Value |
|---|---|
| `id` | `web-import-u3-tela-canvas2d` |
| `outcome` | `tela:canvas2d` — `tela/src/canvas2d.fab` (en conversion: `import from "tela:dom" private dom`, `type Element = dom.Element`, `Canvas2DContext` + `Path2D` handle classes, the ~27 stub `fn`s), `tela/runtime/canvas2d.ts` (the faber-web shim copied — `webCanvas2d*` symbols kept), `tela/bindings/ts.toml` extended with `[shims.canvas2d]` + the `tela:canvas2d.*` routes (opener/result carried). A standalone imperative draw surface — no view-core coupling (C5). |
| `write_scope` | `tela/src/canvas2d.fab` (new), `tela/runtime/canvas2d.ts` (new), `tela/bindings/ts.toml` (extend — the canvas2d section) |
| `read_scope` | `faber-web/src/canvas2d.fab` + `faber-web/runtime/canvas2d.ts` (read-only sources); `tela/src/dom.fab` (U1 — the `Element` alias source); the faber-web canvas2d delivery record (the WEB1–2 surface) |
| `done_when` | (a) `radix check src/canvas2d.fab --locale en` → `ok` under the container library home (the `tela:dom` import resolves). (b) `radix emit -t ts --locale en` exit 0. (c) A scratch smoke assembly: a scratch app importing `tela:canvas2d` + `tela:dom` assembles (DOM_NS + CANVAS_NS over the tela runtimes) → `tsc --noEmit` + `node` exit 0 — the draw-surface route resolution proven (the faber-web `examples/web-canvas2d-smoke` shape, en-adapted, in `/tmp`). (d) The route bijection (contract-test extension for canvas2d — or the U2 contract-test's canvas2d section added here) green. (e) `git diff --check` in `tela/`. |
| `validation` | `radix check --locale en` + `emit -t ts` on `src/canvas2d.fab`; the scratch smoke assembly (`tsc --noEmit` + `node`); the contract-test canvas2d section; `git diff --check`. No cargo. |
| `depends_on` | U1 (the `tela:dom` import), U2 (the bindings file to extend) |
| `non_goals` | No WEB3-4 (Unit 3 gradients/draw_image/ImageData — carried as a deferred residual). No view-protocol coupling. No `scripta/` edits (U4). No faber-web edits. |
| `risk` | **Low.** The WEB1–2 surface is proven in faber-web; the conversion is mechanical (P4 green). |
| `est_work_tokens` | 5–8k |
| `test_owner` | Unit Hand; reviewer (surface parity vs faber-web's canvas2d + C5). |

### U4 — `web-import-u4-browser-flip-harness-rewire` (the serialization point)

| Field | Value |
|---|---|
| `id` | `web-import-u4-browser-flip-harness-rewire` |
| `outcome` | The cross-repo edge closes on tela's side: `tela/src/browser.fab` flips `import from "web:dom"` → `import from "tela:dom"` and its signature references rename (`dom.Nodus` → `dom.DomNode`, `.identitas` → `.identity` — the public surface `mount`/`replace`/`dispose`/`focus_held`/`focus_target` + the policy fns is unchanged, C6); the consumers + harness assemblies rewire: `exempla/browser.fab` (`dom.DomNode { identity = … }`), `scripta/dom-shim.ts` (`class DomNode { identity!: string }` + the `webDom*` surface), `scripta/check-mount` + `scripta/check-exempla` (the DOM_NS + shim references), `scripta/check-forms-interactive` + `scripta/check-determinism` (the dom emit source `$ROOT/../faber-web/src/dom.fab` la → `$ROOT/src/dom.fab` en; the runtime source → `$ROOT/runtime/dom.ts`), `scripta/check-compile` (module list gains `dom` + `canvas2d`), `scripta/check-reference` (the Stage 5 harness — the dom emit source + DOM_NS), and (decision Q1, default) `proof/benchmark/canary-app/src/main.fab` flips `web:dom` → `tela:dom`. The 9 `dom.on*` WARN014 skips persist (now sourced from `tela:dom`) — recorded-not-blocking. |
| `write_scope` | `tela/src/browser.fab` (edit — import + signature refs), `tela/exempla/browser.fab` (edit), `tela/scripta/dom-shim.ts` (edit — the rename; **only if this unit lands before Stage 5 U9**, which deletes the file — if U9 lands first, the rename lands inside `scripta/harness_dom.fab` + the U9-authored assembly and this unit does not touch the shim), `tela/scripta/check-mount`, `tela/scripta/check-exempla`, `tela/scripta/check-forms-interactive`, `tela/scripta/check-determinism`, `tela/scripta/check-compile`, `tela/scripta/check-reference` (edit — the dom assembly), `tela/proof/benchmark/canary-app/src/main.fab` (edit — Q1 default: the import + the `dom.` type refs) |
| `read_scope` | `tela/runtime/dom.ts` + `tela/bindings/ts.toml` (U2 — the new binding surface); `tela/src/dom.fab` (U1); the Stage 5 harness surface as landed (the post-U8 `check-reference`/`check-exempla`/`check-compile` state); this DELIVERY.md §5.2/§5.4 |
| `done_when` | (a) `radix check src/browser.fab --locale en` → `ok` (the 9 `dom.on*` skips remain, sourced from `tela:dom`). (b) The **full harness surface is green at this boundary — one official run**: `check-compile` + `check-exempla` (incl. the browser exempla's `DomNode`/`identity` fixtures) + `check-mount` + `check-determinism` + `check-forms-proof` + `check-forms-interactive` + `check-reference` — fail-closed, node exit 0 each. (c) The browser exempla + the canary composition prove the flipped seam end-to-end (the en→en `tela:dom` route through `bindings/ts.toml` → `runtime/dom.ts`). (d) The determinism double-build is byte-identical; the sha is re-recorded — **no supersession expected** (the runner's static output is unchanged by the flip); if the output differs, the diff is recorded + flagged honestly. (e) `git diff --check` in `tela/`. |
| `validation` | The seven harness gates once at this boundary (cheap node/tsc runs; the prebuilt in-tree radix binary); `radix check --locale en` on the flipped modules + the canary; `git diff --check`. No cargo beyond the prebuilt binary (the harness auto-build fallback must not trigger — the binary exists). |
| `depends_on` | U3; **external gate: Stage 5 U8 landed** (the last catalog unit — §5.4 default slot after U8/before U9, or after U10 per Mind's choice) |
| `non_goals` | No `src/reference.fab`/`exempla/reference.fab` edits (Stage 5 owns them). No `CAMPAIGN.md` edits (Stage 5 closeout-owned). No faber-web edits. No radix edits. No kernel edits. |
| `risk` | **Medium.** The widest unit — it rewires the harness surface the Stage 5 wave owns. The renames are mechanical (`DomNode`/`identity`/emit-source swap); the risk is the *slot*, not the work — the Stage 5 gate (§5.4) is the mitigation. The public browser surface is unchanged (C6) — Stage 5's reference consumers are unaffected semantically. |
| `est_work_tokens` | 12–18k |
| `test_owner` | Unit Hand (the seven-gate run once); reviewer (the flip-vs-C1 scope + the Stage 5 slot); closeout auditor (independent re-run at the evidence boundary). |

### U5 — `web-import-u5-faber-web-deprecation`

| Field | Value |
|---|---|
| `id` | `web-import-u5-faber-web-deprecation` |
| `outcome` | faber-web is frozen + deprecated: `faber-web/README.md` gains the deprecation banner at the top + the migration table (`web:dom` → `tela:dom`, `web:canvas2d` → `tela:canvas2d`, `web:web` → `tela:browser` (superseded by `tela:browser.mount`; `WebController` stays for the frozen examples)); `faber-web/docs/factory/web-canvas2d/GOAL.md` Status line flips to a classifier-parseable superseded marker (`closed — superseded by tela web-surface-import (2026-08-09)`). faber-web is frozen for new features; critical fixes only until archival (a future goal). |
| `write_scope` | `faber-web/README.md` (edit — banner + migration table), `faber-web/docs/factory/web-canvas2d/GOAL.md` (edit — the Status line only) |
| `read_scope` | this DELIVERY.md §5.2 (the migration mapping); the live tela surface (the `tela:*` modules exist) |
| `done_when` | (a) The README banner names the `tela:*` equivalents with the accurate mapping. (b) The migration table maps every `web:*` provider to its `tela:*` home; `WebController`'s frozen-examples note is present. (c) The canvas2d goal Status line is classifier-parseable (`closed` → the DONE bucket — verified against `audit-factory-goal-status.py`). (d) faber-web source/tests are untouched (frozen). (e) `git diff --check` in `faber-web/`. |
| `validation` | Content checks (banner + table + Status line present and accurate); the classifier run on the flipped Status line (`python3 radix/scripta/audit-factory-goal-status.py` machinery, read-only); `git diff --check` in `faber-web/`. No cargo, no radix. |
| `depends_on` | U3 (the `tela:canvas2d` the table maps to), U4 (the flip the `web:web` row maps to) |
| `non_goals` | No faber-web source/test edits. No archival (a future goal). No consumer migration (C1/Stage 7 territory). |
| `risk` | **Low.** A README + Status-line change; the only judgment is the migration table's accuracy, which §5.2 locks. |
| `est_work_tokens` | 1–2k |
| `test_owner` | Unit Hand; reviewer (the mapping vs the landed `tela:*` surface). |

### U6 — `web-import-u6-evidence`

| Field | Value |
|---|---|
| `id` | `web-import-u6-evidence` |
| `outcome` | The official evidence boundary: the full tela surface green once post-flip (the seven harnesses + the two ported tests); the determinism double-build byte-identical with the sha re-recorded (no supersession expected — flagged honestly if the composition output changed); the evidence record documents the conversion, the naming resolutions, the flip, the residuals, and the exact commands. |
| `write_scope` | `tela/docs/factory/web-surface-import/EVIDENCE.md` (new — the evidence record: the conversion parity, the naming table as-landed, the seven-gate run, the sha record, the residuals (the 9 `dom.on*` skips, the `LOCALE002` advisories, the canvas2d Unit 3 deferral, `WebController`), the exact commands), `tela/scripta/check-determinism` (extend — the runner input if the composition changed; re-record the sha into `build/hashes.txt`) |
| `read_scope` | the U1–U5 emission; the existing harness mechanics; the goal's Stop Conditions |
| `done_when` | (a) The seven harness gates + the two ported tests — one official run, fail-closed. (b) The determinism double-build byte-identical; the sha re-recorded (supersession noted if any). (c) The evidence record documents the as-landed naming table, the residuals, and the exact commands; the Rust emit path attempted + `fix:codegen001` recorded (the scratch compile stays red on the kernel's `topological_order` E0382 — the Stage 5 U1 observation; never the gate). (d) The goal Status line reflects the completed state (classifier-parseable; Mind's closeout). (e) `git diff --check` in `tela/`. |
| `validation` | Run the seven harnesses + the ported tests once at this boundary; `git diff --check`. Reviewer/auditor re-runs as named test owners (the fire-9 norm). No cargo, no radix ladder. |
| `depends_on` | U4, U5 |
| `non_goals` | No real-browser suite. No radix ladder stages 4–6 / `--e2e` (auditor-owned). No `CAMPAIGN.md` edits. No faber-web edits beyond U5's. |
| `risk` | **Low–Medium.** The sha is expected stable; the official run is the boundary (once, then done). |
| `est_work_tokens` | 3–5k |
| `test_owner` | Unit Hand (the official run + record); closeout auditor (independent re-runs). |

---

## 8. Checkpoints And Gates

| Gate | After | Check |
|---|---|---|
| **W1 — dom source** | U1 | `tela:dom` checks + emits en-clean; the route bijection vs faber-web's dom.fab holds (U2's contract-test); §5.2 names landed. |
| **W2 — dom binding** | U2 | The ported tests green; the scratch route-resolution probe green; `tela/faber.toml` declares the binding surface. |
| **W3 — canvas2d** | U3 | `tela:canvas2d` checks + emits; the smoke assembly green; C5 held (no view coupling). |
| **W4 — flip** | U4 | `tela:browser` imports `tela:dom`; the seven harness gates green once at this boundary; the browser public surface unchanged (C6); the determinism sha stable (or flagged); the Stage 5 slot honored. |
| **W5 — deprecation** | U5 | faber-web README banner + accurate migration table; the canvas2d goal Status classifier-parseable; faber-web frozen. |
| **W6 — evidence** | U6 | The full surface green once; the sha re-recorded; the evidence record complete. |
| **Goal closeout** | all | Mind-routed closeout: delivery audit → admit units → implement → the goal Status flip + the factory README regeneration (Mind's commits). |

---

## 9. Validation Summary

| Layer | Command / Flow | Covers |
|---|---|---|
| Package semantics | `radix check --locale en` on `src/dom.fab`, `src/canvas2d.fab`, `src/browser.fab`, the exempla, the canary (container + benchmark libhome) | The converted modules + the flip typecheck |
| TS lane | `radix emit -t ts --locale en` + the scratch/assembly (`strip_dom` mechanics) + `tsc --noEmit` | Typed values valid in TS; the proven runtime lane |
| Binding contract | The ported `contract-test.ts` (the plain-text .fab ↔ ts.toml ↔ runtime cross-check) | The route bijection + the opener/result typing — mechanically verified |
| Runtime surface | The ported `dom-runtime-test.ts` under node | The tela-owned runtime behaves (the adapted `identity` field) |
| Route resolution | The scratch probes (a `tela:dom`/`tela:canvas2d`-importing app assembled over the tela runtimes; `tsc --noEmit` + `node`) | Routes resolve through `tela/bindings/ts.toml` → `tela/runtime/*.ts` |
| Harness surface | The seven harness gates (check-compile, check-exempla, check-mount, check-determinism, check-forms-proof, check-forms-interactive, check-reference) once at U4's boundary and once at U6's | The flipped seam end-to-end; fail-closed |
| Determinism | `check-determinism` — the double-build byte-compare + sha256 → `build/hashes.txt` | Byte-identical static/mount-time serialization; no supersession expected |
| Rust lane | `radix emit -t rust --locale en` attempted + recorded per boundary; scratch-dir `cargo check` (import-free surfaces only) | `fix:codegen001` (the kernel E0382) recorded; never the gate |
| Doc hygiene | `git diff --check` in `tela/` + `faber-web/` | Whitespace/conflict hygiene |
| Cargo discipline | No workspace cargo suites; the prebuilt in-tree radix binary; scratch dirs only | Lock ownership (operator rule 2026-08-07) |

---

## 10. Ownership Split

| Surface | Owner | Posture |
| --- | --- | --- |
| `tela/src/dom.fab` + `tela/src/canvas2d.fab` (the converted en contracts) | `tela` | Authored in this goal (U1/U3) |
| `tela/runtime/*.ts` + `tela/bindings/ts.toml` + `tela/tests/` (the host binding + contract) | `tela` | Copied + adapted from faber-web (U2/U3); symbols kept |
| `tela/src/browser.fab` + the harness rewires | `tela` | The flip (U4) |
| `faber-web/src/*.fab` + `runtime/*.ts` + `bindings/ts.toml` + `tests/` | `faber-web` | **Frozen** — the single U5 write is the README + the canvas2d goal Status line |
| The la→en conversion facts + the en reader surface | `radix` | No radix changes needed (probed); the carried residuals apply recorded work-arounds |
| The emitted TS output | generated | `radix emit` into scratch/harness assembly — never hand-authored |

---

## 11. Open Questions For Mind

| # | Question | Default | Who |
|---|---|---|---|
| Q1 | Canary-app flip: flip `proof/benchmark/canary-app/src/main.fab`'s `web:dom` → `tela:dom` in U4 (single-provider composition; the canary is tela-owned proof, not a protected consumer; the coexistence claim stays proven by faber-web's own examples on `web:*`) vs keep the canary on `web:dom` (strictest C1 reading; two-provider assembly with a second `strip_dom` rename pass — more harness complexity). | **Flip** | Mind (confirm) |
| Q2 | U4's Stage 5 slot: after Stage 5 U8 / before U9 (U9's fake-DOM conversion authors against the final `DomNode`/`identity` names — one authoring pass; couples the two goals' execution order) vs after Stage 5 U10 (cleanest ownership separation; the flip renames the U9-authored names + re-records the Stage 5 sha). | **After U8 / before U9** | Mind (confirm — coordinates with the Stage 5 dispatch) |
| Q3 | `LOCALE002` advisory spellings on the converted modules (`local`, `width`, `alt`, `shift`, `id`, `status`, `ok`, `require`, `on`): leave (parse + emit green) or rename for advisory cleanliness (each rename changes a route key). | **Leave; record** | Mind (inform) |
| Q4 | Runtime symbols: keep `webDom*`/`webCanvas2d*` (the documented host-binding contract; minimal harness diff) vs rename `telaDom*` (cosmetic consistency; a wide sweep across every harness + the shim). | **Keep** | Mind (confirm) |
| Q5 | The web-canvas2d Unit 3 deferral (gradients, `draw_image`/`ImageData`) carries into `tela:canvas2d` as a deferred residual (file when a real consumer asks — the faber-web goal's own posture). | **Carry as deferred** | Mind (inform) |
| Q6 | `WebController` fold: dropped (its two example consumers stay frozen on `web:*`; a tela equivalent is Stage 7 consumer-migration territory). | **Drop; record** | Mind (inform) |

---

## 12. Residuals (routed, not this goal's work)

- **The 9 `dom.on*` WARN014 skips** — persist on importers of `tela:dom` (handler-typed exports); read through the documented host binding at the harness boundary (`fix:g4` host-side; removal = grep-replace after the radix fix lands).
- **`fix:codegen001`** — the Rust scratch-compile red on the kernel's `topological_order` (E0382; the Stage 5 U1 refined observation). The Rust emit path is attempted + recorded per boundary; the TS lane is the proven lane. Never the gate.
- **The `LOCALE002` advisories** — the keyword-like spellings on the converted modules; recorded, non-blocking.
- **The canvas2d Unit 3 deferral** — gradients, `draw_image`/`ImageData`, on-demand coverage: file when a real consumer asks.
- **`WebController`** — stays in frozen faber-web for its two example consumers.
- **The consumer migration** (`web:*` → `tela:*` across faber-web's examples/exempla + the canary-app if Q1 keeps it on `web:dom`) — campaign Stage 7 territory; faber-web archives only after its consumers migrate (a future goal).
- **The factory README regeneration + the goal Status flip** — the Mind-routed planning commit (this planner does not commit) + the goal closeout.
