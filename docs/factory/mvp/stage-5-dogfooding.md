# Stage 5 U9 — Dogfooding Record (the fake DOM authored as Faber source)

`tela-s5-u9-dogfooding-harness-dom` — the dogfooding unit's evidence record.
The posture (CAMPAIGN.md, commits f7c8647 / af9d5ff): harness/tooling that
"does things" should be Faber scripts, not TypeScript — the only unavoidable
TS is the emitted web-target output + the `faber-web` browser-host runtime
(TS by contract). This record documents the conversion verdict.

## Verdict

**GREEN with two recorded radix-lane gaps.** The harness fake DOM —
`scripta/dom-shim.ts` (35.7KB) + the embedded fake DOM in
`check-forms-interactive` / `check-reference` — is authored as Faber source
(`scripta/harness_dom.fab`, en locale, self-contained) and emits to
TypeScript via the provider-module emit pattern (the `faber-web/src/dom.fab`
precedent). The harnesses consume the emitted module; `dom-shim.ts` is
deleted; the embedded copies are removed. **All six harness gates are green**
at this boundary (one official run, fail-closed). The assertion/orchestration
drivers stay TS (the hardening executed lane — recorded below).

## (a) Authoring probe — outcome

The fake-DOM surface is **expressible** on the in-tree radix (0.80.0),
probed live with minimized repros (never assumed). Confirmed expressible:

- **Genus records + functions over records** (Faber has no global state —
  the document instance flows as an EXPLICIT parameter).
- **`tabula`/`copia` Map/Set state**: `tabula` is fully functional
  (`pone`/`accipe`/`habet`/`dele`/`claves`/`valores`).
- **`varia` for mutable locals**: mutable records need a `var` copy +
  `←` field assignment (fields are otherwise write-once — SEM020).
- **Function-typed params** + inline function types in type-arg position
  (`list<(FakeEvent) → void>`, `tabula<int, () → void>`); `() → void` is
  the no-arg function type.
- **Recursion over the tree** (self-referential genus fields).
- **The bounded parser over string ops** — `sectio`/`longitudo`/`+`/
  char-scanning; **no regexes** (the selector matcher + the HTML parser are
  string-scanning re-authors, as the write_scope permits).
- **Closures** (`(params) → T ∴ fac { … }`) and **`panic`** for the
  fail-closed traps.
- **CamelCase genus fields/methods** emit verbatim — the runtime-contract
  bridge (`getAttribute`/`querySelector`/`querySelectorAll` methods + the
  `tagName` field satisfy faber-web's runtime/dom.ts, included verbatim).

**Authoring-surface findings:**

1. **`fix:copia-iteration`** — GENUINE GAP: `copia` (Set) has NO iteration
   or read-back surface (copia-intrinsics.md: `valores`/`perambula`/
   `inLista` are "preserved, not promoted"; `itera ex` over a copia fails
   SEM010). Minimized repro: `spike/defects/d4-copia-iteration.fab`. The
   conversion preserves the Set semantics EXACTLY with a tabula-backed
   store (insertion-ordered read-back via `claves()`, membership via
   `habet()`, listener dedup via the `continet`-guard before append) —
   never a weakened target.
2. **`fix:codegen002`** — GENUINE GAP: the TS emitter rejects an equality
   comparison whose RIGHT operand is a variable named `value`
   (CODEGEN001 — `est` target type does not correspond to a Valor variant;
   a helper-name collision in the emitter). Minimized repro:
   `spike/defects/d5-rhs-value-equality.fab`. The conversion spells the
   local `attr_value` — a source work-around, never a weakened target.
3. **The write_scope's "Faber has no methods" premise is STALE**: radix
   0.80.0 has genus methods (the EBNF methodDecl; the ordinata.fab
   precedent), and they emit to TS class methods. The faber-web runtime
   (TS by contract, unchanged) calls a METHOD surface on the fake nodes
   (`webDomScope` → `root.querySelector`, `webDomSnapshot` →
   `el.getAttribute`/`el.tagName`, `webDomClass*` → `classList.*`). The
   authored module provides those methods as genus methods that delegate
   to the free-function surface — the runtime contract is satisfied by
   FABER-authored code, never weakened.
4. Surface quirks recorded: no else-if chain (the `secus si` construct is
   deliberately rejected — radix-parser `secus_si_else_if`; nested
   if/else is the work-around); no ternaries; nullable reads bind +
   `is null`-guard + copy-narrow (the `fix:prim-nullable` pattern);
   `∪ null` on FUNCTION types is avoided (a TS precedence quirk in the
   emit).

## (b) Authored surface — `scripta/harness_dom.fab`

The full fake-DOM surface (mirroring dom-shim.ts):

- **Records**: `FakeClassList`, `FakeEvent`, `FakeElement`, `FakeDocument`,
  `FakeScope`, `FakeSubscription`, `FakeNodus`, `FakeSubmitOptions`,
  `FakeKeyboardState`, `FakePointerState`, `FakeFocusState`,
  `SubscriptionRecord`, `ParseResult`, `BindingLike`, `SubscriptionLike`,
  `MountedLike`.
- **Functions over records**: `class_list_*`, `fake_event(_key)`,
  `event_prevent_default`, `fake_element`, `make_text_node`,
  `element_text(_set)`, `element_attr_*`, `element_attribute_shape`,
  `element_matches` (string-scanning selector matcher),
  `element_query_selector/_all`, `query_all_into`, `element_append_child`,
  `element_remove`, `element_clear_children`, `element_add/remove_listener`,
  `element_dispatch`, `fake_document`, `doc_has_focus`, `doc_focus_node`,
  `doc_query_selector/_all`, `resolve_region`, `unescape_html`,
  `is_void_tag`, `index_of`, `parse_element`, `parse_fragment`.
- **The `webDom*` runtime-binding surface**: `web_dom_scope/_query/`
  `_require/_all/_snapshot/_text_set/_attr_set/_attr_remove/_class_add/`
  `_class_remove/_class_toggle/_on/_unsubscribe/_value/_value_set/`
  `_on_input/_on_submit/_on_keyboard/_on_pointer/_on_focus/`
  `_prevent_default`. The subscription registry lives on the document
  (the explicit-parameter posture).
- **The mount-plan executor**: `execute_mount_plan`, `bind_region_
  subscriptions`, `find_child_by_identity`, `find_match`, `stamp_subtree`,
  `open_tag_equals`, `clone_node`, `sync_region` (target-ordered rebuild;
  equivalent to the shim's splice/remove pass for the proof corpus, where
  target order == present order — recorded bounded fidelity).
- **The runtime-contract method bridge** (genus methods delegating to the
  free functions): `FakeElement.getAttribute/querySelectorAll`,
  `FakeDocument.querySelector/querySelectorAll`,
  `FakeClassList.add/remove/toggle/has`.

`radix check --locale en scripta/harness_dom.fab` → `ok` (WARN003
unused-function only — the surface is consumed by the TS drivers, the U1
probe's expected shape).

## (c) Emission + assembly

`radix emit -t ts --locale en scripta/harness_dom.fab` → 944 lines of clean
TS (records → classes with public fields, camelCase method bridges
verbatim, functions → top-level functions). **No FaberDisplay preamble is
emitted** (the authored surface uses no display helpers), so the assembly
uses a plain header strip (`strip_hdom`) — the spec's `strip_dom`-precedent
rename set is not needed, verified. `tsc --noEmit --strict` on the emitted
module: exit 0. The harnesses assemble the emitted module with the
established strip mechanics (check-mount, check-exempla's browser case,
check-forms-interactive, check-reference).

## (d) Conversion of the two copies

- `scripta/dom-shim.ts` — **deleted** (git rm).
- The embedded fake DOM in `check-forms-interactive` and `check-reference`
  (the host-driver heredocs' FakeClassList/FakeEvent/FakeElement/
  FakeDocument/VOID_TAGS/parseFragment classes) — **removed**; the emitted
  module is assembled in their place.

## (e) Driver rewiring

The four interactive harnesses' drivers are rewritten to the emitted
function surface (orchestration semantics unchanged):

- `check-mount` — segmented-control interaction gate on
  `reference.segmented_control` + `reference_theme()` (the Stage 5 U5–U8
  reference re-home bound here — the pre-existing staleness that left
  check-mount RED since U5 is repaired at this boundary).
- `check-exempla` (browser case) — the mount-proof driver relocated
  (`executeMountProof` — assertion/orchestration, hardening lane) over the
  emitted module; the bare `Scope`/`Nodus` provider types declared at the
  harness boundary.
- `check-forms-interactive` + `check-reference` — the faber-web runtime
  (TS by contract) stays verbatim; the fake nodes satisfy its method
  contract via the authored bridges; the drivers' call sites
  (`web_dom_*`, `element_*`, `doc_*`, `fake_event_*`,
  `execute_mount_plan`) replace the runtime-function + method-syntax calls.
- `check-forms-proof` + `check-determinism` — the same pre-existing
  reference staleness repaired (the canary runner binds tela:reference).

## (f) Six-gate green (one official run, fail-closed)

```
check-compile:         GREEN
check-exempla:         GREEN
check-mount:           GREEN
check-determinism:     GREEN
check-forms-proof:     GREEN
check-forms-interactive: GREEN
```

Each gate: `radix check` (where it runs), TS lane emit + assemble +
`tsc --noEmit` (strict), `node` (fail-closed — every assertion executes).
`tsc --noEmit` on the assembled compositions: exit 0.

## Executed-lane split (the posture split, recorded)

**Converted (Faber source → emitted TS):** the fake DOM behavior — node
records + functions over records, the bounded parser, the `webDom*`
runtime-binding surface, `executeMountPlan`/`bindRegionSubscriptions`, the
runtime-contract method bridge.

**Rides the hardening executed lane (TS, orchestration — recorded, NOT a
Stage-5 blocker):** the assertion/orchestration drivers (the scripted
interaction sequences, the mount-proof scenario driver `executeMountProof`),
the global-install wiring (`installFakeDom` — `globalThis.document`/`window`
installation at the driver boundary), the bare `Scope`/`Nodus` provider-type
declarations (the emitted web:dom module's type shape at the harness
boundary), and the namespace-const assembly glue. A follow-on wave would
convert the drivers themselves; the split is explicit so no later stage
claims otherwise.

## (g) Determinism

The canary-app runner output **changes** at this boundary: the composition
now binds the reference namespace, so the runner's reference-catalog
asserts (U5–U8) execute instead of crashing at `reference is not defined`
(the pre-existing staleness repair). New sha supersedes
`8dfcb143…` — recorded locally in `build/hashes.txt`:
`6927187ec04e752fad716ef096e15f5c613bef6609b7b627c2b60a76a113b194`.
U10 re-records the official sha (the U9 record does not claim the U10
boundary).

## Residuals

1. `fix:copia-iteration` — the radix-lane gap (copia read-back); the
   tabula-backed work-around is in the authored module; a radix follow-on
   would retire it. Not a Stage-5 blocker.
2. `fix:codegen002` — the radix-lane TS-emitter helper-name collision
   (RHS variable named `value`); the `attr_value` spelling is in the
   authored module. Not a Stage-5 blocker.
3. `fix:prim-nullable`-style copy-narrow is pervasive in the authored
   module (the nullable-read surface); a radix narrowing improvement would
   remove the ceremony.
4. The write_scope's "Faber has no methods" premise is stale — the authored
   module uses genus methods only for the runtime-contract bridge (the
   faber-web runtime is TS by contract); the driver surface is
   functions-over-records as specified.
5. `sync_region`'s target-ordered rebuild is equivalent to the shim's
   splice/remove pass for the proof corpus (target order == present order);
   a position-preserving replace would close the theoretical gap.
6. The `web_dom_scope` empty-selector default roots at the document body —
   query-equivalent to the shim's document root for the harness (the
   document's tree IS the body subtree). Dead code in the corpus (every
   scope is `#root`-scoped).
7. The reference-staleness repairs (check-mount/check-forms-interactive/
   check-forms-proof/check-determinism binding tela:reference + the
   canary's `reference_theme`) are pre-existing repairs folded into this
   boundary — recorded so the closeout audit sees them as such.

## Exact commands

```
radix check --locale en scripta/harness_dom.fab
radix emit -t ts --locale en scripta/harness_dom.fab
radix check --locale en spike/defects/d4-copia-iteration.fab   # the gap repro
radix emit -t ts --locale en spike/defects/d5-rhs-value-equality.fab  # the gap repro
./scripta/check-compile
./scripta/check-exempla
./scripta/check-mount
./scripta/check-determinism
./scripta/check-forms-proof
./scripta/check-forms-interactive
git diff --check
```

No cargo beyond the existing in-tree radix binary (the Cargo discipline).
