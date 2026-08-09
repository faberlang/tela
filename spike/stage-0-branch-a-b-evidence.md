# Stage 0 U3 — Branch A/B Cross-Target Protocol Spike Evidence

**Status**: active (spike evidence for `tela-s0-u3-protocol-spike-branch`)
**Hand**: hand-7, 2026-08-09
**Unit spec**: `tela/docs/factory/mvp/stage-0-delivery.md` U3 (hard gate for
Stage 1's `View` shape)
**Campaign**: `CAMPAIGN.md` §2–§4, §6 (Branch A/B/C), stop condition 7
**Identity lock**: `tela/docs/factory/mvp/stage-0-ownership.md` U0
**Independent audit owns the final Branch decision** (campaign workflow step 6);
this document is the evidence input.

**Branch decision (evidence-driven recommendation): select Branch B.**

---

## 1. Toolchain and environment

- Radix binary used: **`radix/target/debug/radix` (0.80.0, in-tree build,
  2026-08-08)** — the corpus ratchet binary. The installed `~/.cargo/bin/radix`
  (0.78.0) predates the modern corpus sugar (`enum`/`union`/`match`/`fn`) and
  rejects corpus files; it is **not** representative.
- TypeScript: `tsc 6.0.3`, node v24.15.0 (tsconfig in `spike/ts-scratch/`).
- Rust: cargo via `cargo check --offline` in a scratch dir under `/tmp`
  (outside the shared workspace — Cargo discipline).
- Language surface used: corpus exempla mode (`+++` frontmatter with
  `locale = "en"`), the surface the exempla ratchet and emitters are proven on.
  The spike protocol **names** follow the campaign sketch (Latin); keyword
  sugar follows the ratchet.

## 2. Branch A attempt — generic-recursive `Visus<Message>` + `Vinculum<Message>`

Candidate per campaign §2 sketch: recursive tagged union with a generic
`Message` parameter, `Vinculum<Message>` carrying `(Eventum) → Message`
message-producing closures.

**Result: the generic view protocol DECLARES and typechecks, but its values
cannot be CONSTRUCTED in current ordinary Faber.** A genuine shared-language
(defect D1, §4) blocks every construction spelling:

| Construction spelling | Result |
| --- | --- |
| `variant Elementum { … } ∷ Visus` (bare name) | SEM010 type mismatch (result is uninstantiated `Type::Enum`) |
| `(variant Elementum { … }) ∷ Visus<AppNuntius>` (general ascription) | SEM010 argument/field type mismatch (fields keep unbound type param) |
| `variant Elementum { … } ∷ Visus<AppNuntius>` | parse error (finge cast grammar accepts only a bare type name) |
| `variant Elementum { … }` (inference against return type) | SEM010 return/expression type mismatch |

Same failure for generic class construction (`class C<T> { T value }` +
`(C { value = 1 }) ∷ C<int>` → field_initializer mismatch), so
`Vinculum<Message>` construction fails identically.

**Consequence:** the campaign §2 fallback triggers — *"If current Faber target
support cannot carry it honestly, keep the pure non-generic `View` tree and
place behavior in an adjacent typed plan"* — i.e. Branch B. The defect is
fixable at the compiler level (minimized delivery filed, §4 D1); Branch A
should be re-spiked when/if the delivery lands, but Stage 1 cannot freeze a
generic-construction-dependent `View` shape today.

## 3. Branch B candidate — `spike/visus-b.fab` (working candidate)

Shape: **pure (closure-free) non-generic `Visus`** recursive tagged union +
**adjacent typed behavior plan** `Vinculum { identitas, eventus,
(Eventum) → AppNuntius }` keyed to stable node identities.

Properties preserved (campaign §2):
- open element model — `nomen_tag` is an ordinary `string`; `Spatium` enum
  (html/svg) makes namespaces explicit; custom elements (`x-metric`) used;
- typed `Identitas` — explicit field, never position-derived, serialized in
  one documented hydration-ready form (`data-tela`);
- `Proprietas` modeled separately from serialized `Attributa`;
- behavior carried by **typed** message-producing closures
  `(Eventum) → AppNuntius` — not erased into strings;
- recursive tagged union; `Fragmentum` structural (no wrapper);
- no raw-markup `View` variant.

### Per-lane results (closeout)

| Lane | Command | Result |
| --- | --- | --- |
| Check | `radix check spike/visus-b.fab` | **ok** (warnings only: WARN005 unnecessary cast, WARN001 unused var) |
| TS | `radix emit -t ts spike/visus-b.fab` + `tsc --noEmit -p spike/ts-scratch/tsconfig.json` | **clean, exit 0** |
| Rust | `radix emit -t rust spike/visus-b.fab` + scratch `cargo check --offline` (crate in `/tmp/tela-spike-rust-03`, Cargo.toml + emitted `src/main.rs`) | **Finished, exit 0** (warnings only: unused vars, non-snake-case `Svg`) |

The emitted Rust is self-contained stdlib (`String`/`Vec`/`format!`); no
`faber` runtime dependency was needed for this source. The emitted TS and Rust
artifacts are reproducible with the commands above (`spike/ts-scratch/`
contains the tsconfig + last emitted TS).

### Static HTML/CSS representability — structural assertion (done_when d)

The serializer in `visus-b.fab` (`seri_visus`, `seri_attributa`,
`seri_proprietates`, `seri_identitas`, `seri_ns`, `seri_css`) typechecks
through both the TS and Rust lanes, proving the recursive descent over every
`Visus` variant and the representation of every protocol field. The following
expected output for `seri_visus(contator_app(7))` is a **hand-traced
structural assertion** (placeholder escaping; not executed in closeout, per the
unit's narrow-checks constraint — not Stage 1's determinism gate):

```html
<div aria-label='contator' data-prop:aria-valuenow='7' data-tela='contator-app'>contator: 7<x-metric>7</x-metric>ab</div>
```

and for the CSS bundle:

```css
[data-tela='contator-app'] { display: grid; gap: 0.5rem; }
```

The trace demonstrates: open tags serialize without a compiler/framework enum,
serialized `Attributa` and separate `Proprietas` markers coexist, stable
identity serializes as `data-tela`, `Fragmentum` emits no wrapper, and
behavior stays adjacent (typed `contator_program()` bindings keyed to
`data-tela` identities) rather than inside the markup.

## 4. Genuine compiler defects exposed (minimized deliveries)

Per campaign stop condition 7 / unit done_when (f): **no framework-contract
weakening was made to hide any defect**; each is recorded with a minimized
repro under `tela/spike/defects/`. None blocks Branch B.

### D0 — generic type alias does not bind its type parameters (shared)
`typus`/`type` aliases with `genericParams` fail to resolve their own type
parameter: `type Nuntius<Message> = (Eventum) → Message` → `SEM008
unknown_type_name` at the parameter use. The campaign sketch's
`typus Nuntius<Message> = …` cannot be written; the spike uses an inline
function-type field `(Eventum) → Message` instead (property preserved).
Minimized: `type X<T> = T`.

### D1 — generic user-type construction does not instantiate type parameters (shared; Branch A blocker)
`union Cista<T> { Plena { T res } }`; `return variant Plena { res = 1 } ∷
Cista` → `SEM010` argument/expression type mismatch. Repro file:
`spike/defects/d1-generic-construction.fab`. The checker's variant-constructor
path (`semantic/passes/typecheck/call.rs`) checks fields against raw
`Type::Param` and returns uninstantiated `Type::Enum(parent)`. Affects classes
equally. **This is the defect that forces Branch B.** Also: the `finge` cast
grammar accepts only a bare type name (`parse_ident()`), so `∷ Cista<int>` on
a variant does not parse at all.

### D2 — TS lane: variant field named `tag` collides with the emitted discriminant
`union U { V { string tag }, … }` checks fine, but `radix emit -t ts` emits
`type U = { tag: "V", tag: string }` → tsc TS2300/TS2717. Repro:
`spike/defects/d2-ts-tag-discriminant.fab`. The campaign's `tag` field name
cannot ride the TS lane as-is; the spike renames the field to `nomen_tag`
(names may differ per spec; vocabulary is campaign Open Q5). Stage 1 should
either fix the emitter's discriminant naming or keep a non-colliding field name.

### D3 — Rust lane: non-null value into a nullable union field misses `Some(…)`
`variant V { identitas = Identitas { valor = "x" } }` (field type
`Identitas ∪ null`) emits `identitas: Identitas { … }` where the field is
`Option<Identitas>` → cargo check E0308. Repro:
`spike/defects/d3-rust-option-wrap.fab`. Null assignments and already-nullable
values emit correctly; only a direct non-null constructor expression into the
nullable field is broken. Spike workaround: `nova_identitas() →
Identitas ∪ null` routes the non-null identity through the nullable type.

Routing note: per the unit's `write_scope`, these deliveries are filed here
(evidence + repros) and reported to Mind for routing to radix; no radix source
was edited.

## 5. Branch decision and rationale

**Recommendation: Branch B** — pure non-generic `View` tree + adjacent typed
behavior plan keyed to stable node identities.

Concrete reasons:
1. Branch A's generic-recursive view values cannot be constructed in current
   ordinary Faber (D1 — genuine shared-language defect, all targets). The
   spike's primary risk (campaign §6: "Generic recursive views and closure
   fields may expose current target gaps") materialized at the shared
   language layer.
2. Branch B's candidate (`visus-b.fab`) passes **all three lanes**: `radix
   check` ok; TS emitted + `tsc --noEmit` clean; Rust emitted + scratch
   `cargo check` finished. Static representability is proven structurally.
3. The branch keeps the campaign's typed-behavior commitment: message-bearing
   closures are `(Eventum) → AppNuntius`, keyed to typed `Identitas` — not
   erased into unvalidated strings (campaign §2).
4. Branch A remains the ideal end-state and is blocked only by fixable D1;
   when the minimized compiler delivery lands, re-spike Branch A before any
   generic-construction-dependent `View` decision. The audit may weight this
   differently; this document reports evidence, not a veto.

## 6. Residuals and recommendations

- **D0/D1/D2/D3 compiler deliveries** should be filed to radix (mind routes);
  each has a minimized repro under `tela/spike/defects/`.
- **Field-name vocabulary** (`tag` vs `nomen_tag`) and the generic-`Message`
  question feed campaign Open Q5 / U6 (protocol policies); D2 makes the
  `tag` spelling TS-unsafe today.
- **Faber dialect discovery for Stage 1 authors**: the spike used exempla-mode
  sugar (`locale = "en"` frontmatter). Latin keywords (`discretio`, `finge`,
  `ordo`) partially diverge in this build (`discretio` did not register a
  usable type name in the 0.80.0 in-tree build). Worth a note in Stage 1
  docs/AGENTS.md.
- The unit's non-goals were respected: no production serializer, no
  determinism/double-build gate, no reference components, no `faber-web` or
  `radix` edits, no async/fetch claims, no workspace cargo suites.

## 7. Commands (recorded closeout)

```text
R=radix/target/debug/radix
$R check spike/visus-b.fab                                  # ok
$R emit -t ts spike/visus-b.fab > spike/ts-scratch/visus-b.ts
tsc --noEmit -p spike/ts-scratch/tsconfig.json              # exit 0
$R emit -t rust spike/visus-b.fab > /tmp/visus-b.rs
# scratch crate /tmp/tela-spike-rust-03 { Cargo.toml, src/main.rs }
cd /tmp/tela-spike-rust-03 && cargo check --offline         # Finished, exit 0
$R check spike/defects/d1-generic-construction.fab          # SEM010 (expected)
$R check spike/defects/d2-ts-tag-discriminant.fab           # ok (TS emit broken)
$R check spike/defects/d3-rust-option-wrap.fab              # ok (Rust emit broken)
```
