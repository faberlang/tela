# Stage 5 U1 — Discovery Record (catalog home + naming + probes + residuals + dogfooding split)

**Status**: active (evidence for `tela-s5-u1-discovery-reference-posture`)
**Unit spec**: `tela/docs/factory/mvp/stage-5-delivery.md` U1 (wave 1 — the
discovery-first gate; §U1 done_when (a)–(g) below)
**Entry gate**: U0 convention ACCEPTED (`7aeffbd`, C1 review) + the U0
evidence record (`e82d50c`); the post-U0 live source (the English-first
kernel surface) is the authoring input.
**Hand**: hand-7. **Date**: 2026-08-09 (in-tree radix 0.80.0).

This record locks the reference-catalog home + naming, records the two
probed items (post-g4/post-U0 consumability through normal qualified
imports; a standalone `scripta/` `.fab` check + emit — the DOGFOODING
home), enumerates the consumers (fire-9), re-verifies the Stage-4 + U0
residuals against live radix with work-around notes, freezes the
dogfooding split, and confirms the unit wave plan + identity scheme. All
docs-only; no product code, no reference module (U2), no `CAMPAIGN.md`
edits.

---

## 1. Catalog home + naming locked (done_when (a))

| Identity | Value |
| --- | --- |
| Module | `tela/src/reference.fab` (new, written by U2, extended U3–U8 — **strictly sequential**, one flat module owns the catalog's public surface) |
| Provider | `tela:reference` (the U1 identity freeze; **English-first end to end** — no Latin alternative; the `valida`-style Latin precedent no longer applies to module names) |
| Module shape | ONE flat module mirroring the kernel (the G4-safe flat shape + the formslib precedent) — stdlib-only + one same-package sibling import (`tela:tela`); no public signature references a type outside `tela:tela`'s surface beyond the kernel's own types |
| Exports | The **nine families** (layout, typography, panel, table, button, field, segmented-control, badge, metric) as ordinary component functions over typed props → `tela.View` over the English-first kernel `tela.*` surfaces (post-U0 names read from the live source — `View`/`ElementNode`/`TextNode`/`Fragment`, `Style`/`Rule`/`Declaration`, `Token`, `element_full`/`element_view`/`text_view`/`new_identity`/`html_space`, `Attribute`, `html_visus`, `assemble`, `bundle`, `order`, …) |
| Props | **Local carrier classes** per the locked casing rule — PascalCase concatenation (`PanelProps`, `FieldProps`), Pascal_snake (`Props_campi`-style) **banned**; consumers read fields on the call result (the kernel `Token` carrier pattern, MF-7 — never a widened kernel record) |
| Identity scheme | `ref-`-prefixed stable `data-tela` identities (`ref-layout-*`, `ref-typography-*`, `ref-panel-*`, `ref-table-*`, `ref-button-*`, `ref-badge-*`, `ref-metric-*`, `ref-seg-*`); the field/forms identities continue the established `form-*` scheme (the Stage 3/4 precedent); one `-live` per family (MF-8) |
| Naming rule | New identifiers avoid kernel type names AND the consumed seam type names (the snapshot-name-collision rule); every new identifier probed collision-free on the in-tree radix before use (the G5 probe discipline — a colliding locked verb is escalated, never silently renamed) |
| Rendering posture | No raw markup (the central-escaping serializer `html_visus` is the only renderer); style bundles `→ tela.Style` keyed on the identities; namespaced `ref.*` tokens (`ref.panel.surface`, `ref.button.focus` — exact paths the U2+ Hand's, probed) as local-carrier accessors returning the kernel `Token`, consumed through `assemble` (the Stage 2 assembly contract: ordering, dedup, fail-closed) |
| Fixed from | The campaign §3/§8, the batching table, the dogfooding posture (lines 112–121), the U0 convention + rename table, and the post-U0 live source — not invented here |

**The two probed items this freeze depends on are re-verified against live
radix (§2) — never assumed** (delivery U1 done_when (b)): the module's
`→ tela.View`-shaped exports are consumable through normal qualified
imports post-g4/post-U0, and a standalone `scripta/` `.fab` checks +
emits — the DOGFOODING home.

---

## 2. Probes recorded (done_when (b))

Both probes ran against the in-tree radix `radix/target/debug/radix`
0.80.0 (2026-08-09). No cargo suites; scratch files under `/tmp/`.

### Probe (i) — `→ tela.View` consumability through NORMAL qualified imports (post-g4 + post-U0)

A minimal `tela:reference`-SHAPE module (flat, importing `tela:tela`,
exporting `→ tela.View` component fns over local PascalCase carrier
classes + class-returning style/token accessors) + a consumer importing it
through NORMAL qualified imports — the exact shape the U2 catalog module
will author. Scratch: `/tmp/tela-s5-u1-probe.*/` (package `reference-pkg`
provider `reference`, module `src/reference.fab`; consumer-pkg `kind =
"app"`; libhome symlinks `reference`/`consumer`/`tela`).

**Probe module (`reference.fab`, the catalog shape)**:

```faber
# Probe: a `tela:reference`-SHAPE module (tela-s5-u1 probe (i)).
# ... (header omitted) — flat module, G4-safe, mirroring the catalog shape.
import from "tela:tela" public * ut tela

# Local carrier classes (PascalCase — the U0-locked casing rule).
class PanelProps {
    string label
    list<string> rows
}

class BadgeProps {
    string label
    string tone
}

fn panel_props(string label, list<string> rows) → PanelProps {
    return PanelProps { label = label, rows = rows }
}

fn badge_props(string label, string tone) → BadgeProps {
    return BadgeProps { label = label, tone = tone }
}

# The → tela.View component fns (union-returning exports over imported
# sibling types — the post-g4 consumable surface).
fn panel(PanelProps props) → tela.View {
    var list<tela.View> children ← vacua
    var int i ← 0
    while i < props.rows.longitudo() {
        children.appende(tela.element_view(tela.html_space(), "p", [ tela.text_view(props.rows[i]) ]))
        i ← i + 1
    }
    return tela.element_full(
        tela.new_identity("ref-panel-probe"),
        tela.html_space(),
        "div",
        [ tela.Attribute { name = "aria-label", value = props.label } ],
        [],
        children
    )
}

fn badge(BadgeProps props) → tela.View {
    return tela.element_full(
        tela.new_identity("ref-badge-probe"),
        tela.html_space(),
        "span",
        [
            tela.Attribute { name = "role", value = "status" },
            tela.Attribute { name = "data-tone", value = props.tone }
        ],
        [],
        [ tela.text_view(props.label) ]
    )
}

# Class-returning surface (the style bundle + the kernel-Token accessor —
# the MF-7 token-carrier pattern).
fn probe_style() → tela.Style {
    return tela.Style {
        rules = [
            tela.Rule {
                selector = "[data-tela='ref-panel-probe']",
                declarations = [
                    tela.Declaration { name = "display", value = "grid" },
                    tela.Declaration { name = "gap", value = "1rem" }
                ]
            }
        ]
    }
}

fn probe_token() → tela.Token {
    return tela.Token { name = "ref.panel.surface", value = "#f9fafb" }
}
```

**Consumer (`main.fab`)** — normal qualified imports, direct-call
composition, field access on the call results:

```faber
import from "tela:tela" public * ut tela
import from "reference:reference" public * ut ref

main {
    const tela.View tree ← tela.element_full(
        tela.new_identity("probe-root"),
        tela.html_space(),
        "div",
        [],
        [],
        [
            ref.panel(ref.panel_props("probe panel", ["one", "two"])),
            ref.badge(ref.badge_props("live", "positive"))
        ]
    )
    const string html ← tela.html_visus(tree) coalesce ""
    assert html.continet("data-tela='ref-panel-probe'")
    assert html.continet("data-tela='ref-badge-probe'")
    assert html.continet("role='status'")
    assert html.continet(">one</p>")
    const tela.Style style ← ref.probe_style()
    assert style.rules.longitudo() ≡ 1
    const tela.Token token ← ref.probe_token()
    assert token.name ≡ "ref.panel.surface"
    assert token.value ≡ "#f9fafb"
    print html
    print "reference-shape consumability probe green (normal qualified imports; tela-s5-u1)"
}
```

**Results**:

| Step | Command | Result |
| --- | --- | --- |
| Package check | `FABER_LIBRARY_HOME=<probe libhome> radix check --locale en reference-pkg/src/reference.fab` | `ok` (only WARN003 unused-function warnings — expected, the fns are consumer-exported). **NO WARN014** |
| Consumer check | `radix check --locale en consumer-pkg/src/main.fab` | `ok` — **no warnings at all** |
| TS emit | `radix emit -t ts --locale en` (both modules) | exit 0 for both; the reference module emits `import { tela as tela } from "tela:tela"` (the import is preserved) |
| TS type gate | assemble (strip + `tela`/`ref` namespace consts — the check-forms-proof mechanics) + `tsc --noEmit --strict` | exit 0 |
| Runtime gate | `node` on the assembled consumer | exit 0 — assertions execute; the composition renders with the `ref-` identities: `<div aria-label='probe panel' data-tela='ref-panel-probe'>…<span role='status' … data-tela='ref-badge-probe'>live</span>` |

**Verdict: GREEN.** A minimal `→ tela.View`-shaped export from a
`tela:reference`-shape module resolves through NORMAL qualified imports
from a consumer against live radix — post-g4 + post-U0. **WARN014 does NOT
persist on this surface**; the compose-without scope is not needed for the
catalog (it remains only for the la provider's own `dom.on*` handler-typed
exports — §4). The `proof/harness-dom/` package fallback is **not**
required.

### Probe (ii) — a standalone `scripta/` `.fab` checks + emits (the DOGFOODING home)

A self-contained, import-free, en-locale `.fab` placed in
`tela/scripta/` (the U9 home for `harness_dom.fab`), shaped like the fake
DOM's authoring surface (genus-style records + functions over records —
Faber has no methods — a bounded string-scanner for `parseFragment`, and a
function-typed parameter for the webDom* handler-binding surface). The
probe file was created as `scripta/__u1_probe.fab`, checked + emitted, and
**removed** after the probe (the U1 write_scope is the discovery record;
U9 authors the real `harness_dom.fab`). Full content verbatim:

```faber
# tela/scripta/__u1_probe.fab — tela-s5-u1 probe (ii): the DOGFOODING home.
#
# A self-contained, import-free, en-locale .fab colocated with the
# harnesses in scripta/ — the U9 home for the authored fake DOM
# (scripta/harness_dom.fab). This probe verifies that such a file passes
# `radix check --locale en` AND `radix emit -t ts --locale en` STANDALONE
# (no package context — the fallback would be a `proof/harness-dom/`
# package, recorded in stage-5-discovery.md). The shape mirrors the fake
# DOM's authoring surface: genus-style records + functions over records
# (Faber has no methods), a bounded string-scanner (the parseFragment
# equivalent), list/string state, and a function-typed parameter (the
# webDom* handler-binding surface). PROBE ONLY — removed after the probe
# (U9 authors the real harness_dom.fab).
class FakeNode {
    string tag_name
    string identity
    string text
    list<FakeNode> children
}

class FakeDocument {
    list<FakeNode> roots
}

fn fake_node(string tag_name, string identity, string text) → FakeNode {
    return FakeNode { tag_name = tag_name, identity = identity, text = text, children = [] }
}

# The bounded parser shape: scan the markup for the identity marker (the
# serializer's emission form) and collect the identities in document order.
fn scan_identities(string markup) → list<string> {
    var list<string> identities ← vacua
    var int i ← 0
    while i < markup.longitudo() {
        if markup.sectio(i, i + 12) ≡ " data-tela='" {
            var string raw ← ""
            var int j ← i + 12
            var bool terminated ← false
            while j < markup.longitudo() and not terminated {
                const string ch ← markup.sectio(j, j + 1)
                if ch ≡ "'" {
                    terminated ← true
                }
                if not (ch ≡ "'") {
                    raw ← raw + ch
                }
                j ← j + 1
            }
            if terminated {
                identities.appende(raw)
                i ← j
            }
            if not terminated {
                i ← i + 1
            }
        } else {
            i ← i + 1
        }
    }
    return identities
}

# The executeMountPlan shape: a function-typed parameter (the handler
# binding — the harness driver passes the webDom* surface) + tabula/copia
# state over the records.
fn execute_mount_plan(FakeDocument doc, (FakeNode) → void handler, list<string> identities) → int {
    var int count ← 0
    var int i ← 0
    while i < identities.longitudo() {
        const FakeNode node ← fake_node("div", identities[i], "")
        doc.roots.appende(node)
        handler(node)
        count ← count + 1
        i ← i + 1
    }
    return count
}

fn count_identities(list<string> collection, string identity) → int {
    var int count ← 0
    var int i ← 0
    while i < collection.longitudo() {
        if collection[i] ≡ identity {
            count ← count + 1
        }
        i ← i + 1
    }
    return count
}
```

**Results** (run from `tela/`, no package context, no `FABER_LIBRARY_HOME`):

| Step | Command | Result |
| --- | --- | --- |
| Standalone check | `radix check --locale en scripta/__u1_probe.fab` | `ok` (WARN003 unused-function only — expected) |
| Standalone emit | `radix emit -t ts --locale en scripta/__u1_probe.fab` | exit 0; clean TS — records → `class … { field!: T }` (definite-assignment), functions over records, function-typed params → TS function types |
| TS type gate | `tsc --noEmit --strict` on the emitted file | exit 0 |

**Verdict: GREEN.** A self-contained `.fab` in `scripta/` passes `radix
check --locale en` + `radix emit -t ts --locale en` STANDALONE — no
package context required. The DOGFOODING home (`scripta/harness_dom.fab`,
U9) is confirmed; the `proof/harness-dom/` package fallback is **not**
required. The authoring surface the probe exercised (records + functions
over records, string/list ops, recursion loops, function-typed params)
matches the fake-DOM conversion's needs; the `tabula`/`copia` Map/Set
state surface and the full webDom* surface are U9's authoring-probe scope.

---

## 3. Consumers enumerated (fire-9 norm, done_when (c))

| Consumer | Role | Exercised by |
| --- | --- | --- |
| **The reference module** (`tela:reference`) | Consumer of the tela kernel modules (`tela:tela`) — every catalog fn is authored over the kernel surface | U2 self-probe (check/emit) + every U2–U8 extension; the U1 probe (i) proved the module shape checks green |
| **The consumer app** `canary-app` | Consumes `tela:reference` + formslib + extension-lib + tela — the three-package ecosystem proof grows to four | U2–U8 (the runner composition extends per unit; the Stage 4 determinism sha supersedes per unit — recorded, `check-determinism` RED between units is the honest flag); the Stage 4 plan/behavior surfaces re-target the reference identities (U5) |
| **The forms exempla** (`proof/extension-forms/exempla/forms.fab` + the tela `exempla/*.fab`) | Consumers of the tela kernel through the provider interface (exempla-mode, `+++` frontmatter) | `check-exempla` (existing wiring cases stay green) + `check-forms-proof` (the exempla gate); U2 adds `exempla/reference.fab` (new wiring case) |
| **The check harnesses** | `check-reference` (new — the Stage 4 interactive-seam mechanics); `check-exempla`/`check-compile`/`check-determinism`/`check-mount`/`check-forms-interactive` where the composition feeds them | U2–U8 per-unit wiring (compile list, exempla case, runner input); U9 rewires the fake-DOM surface; the official full-surface run is U10, exactly once |
| **Any third-party package** | A future package consumes `tela:reference` through the normal package interface (the extension-lib precedent) | The U1 probe (i) is the proof-of-shape: a `tela:reference`-shape module is consumable through NORMAL qualified imports today |

**Per-unit package-test-surface rule (recorded)**: each unit proves the
affected consumer surface green at its boundary or flags honestly — the
narrowest check that falsifies the change (fire-9 norm; delivery
Coordination Constraint 4). The official full-surface run is U10's close +
the stage closeout, exactly once.

---

## 4. Residuals re-verified against live radix + work-around notes (done_when (d))

The Stage-4 residuals (delivery §Entry Posture + §Escalation Path) and the
U0 residuals were re-verified live on 2026-08-09 (in-tree radix 0.80.0) —
never assumed.

| Residual | Live re-verification (2026-08-09) | Stage 5 posture / work-around | Marker |
| --- | --- | --- | --- |
| **CODEGEN001** — Rust emit-across-imports / provider-module locale propagation | **REFINED observation**: the emit half is now GREEN — `radix emit -t rust --locale en` on the import-bearing kernel (`tela.fab`), the cross-package `browser.fab` (en→la `web:dom`), and the import-free `validate.fab` all exit 0; the cross-package provider tree inlines as single-file `pub mod dom { … }`/`pub mod tela { … }` (the cds-u5 locale-propagation half holds). BUT the Rust path is still RED at the compile gate: a scratch cargo check (`/tmp/tela-u1-rust.*`, faber-runtime linked as `faber`) fails on the emitted kernel with **E0382 borrow-of-moved-value in `topological_order`** (`ordinata.push(chosen)` then `remaining[j] != chosen`). The TS lane stays the proven lane; the R2 sha-equality note is restated. Never the gate. | `fix:codegen001` |
| **prim-nullable** — nullable-list method-call workaround (the `not is null` narrow) | Live in the source: `browser.fab` carries 3 `if … not is null` narrow sites (`identities_from_nodes`/`tags_from_nodes`/`mount`'s snapshot route) — the recorded narrow pattern binds the `∪ null`, checks, then narrows to a non-null copy before method calls. | Units use the recorded narrow pattern where nullables appear; a wrong expectation fails honestly. | `fix:prim-nullable` |
| **`verum`→`b`** — the la-locale bool keyword not usable as an identifier in en modules | En naming rule holds: grep over `src/` + `exempla/` + `proof/extension-forms/src` finds **zero** `verum`/`falsum` identifiers. The tela catalog is en — unaffected, recorded. | Naming note carried: en-locale authoring never names an identifier `verum`/`falsum`. | `fix:verum-b` |
| **9 `dom.on*` WARN014 skips** — the la provider's own handler-typed exports | **Live count confirmed**: `radix check` on `src/browser.fab` (web:dom-importing) and on the canary `main.fab` each emit exactly **9** `WARN014.file_interface_export_skipped` — and only for `dom.on`, `dom.on_focus`, `dom.on_frame`, `dom.on_input`, `dom.on_keyboard`, `dom.on_pointer`, `dom.on_pointer_lock`, `dom.on_resize`, `dom.on_submit` (the handler-typed `typus`-alias exports in `faber-web/src/dom.fab`). The tela/forms surface has **0** skips (`forms.fab` check clean; the reference-shape probe — §2 — clean). | tela consumers read `dom.on*` through the documented host binding (`bindings/ts.toml` → `runtime/dom.ts`) at the harness boundary (the DOM_NS assembly — the proven pattern); no tela authoring impact beyond the existing seam. | `fix:g4` (partial, host-side) |

### U0 residuals re-verified (the faber-lane tooling item + the emit edge)

| U0 residual | Live re-verification (2026-08-09) | Recorded as |
| --- | --- | --- |
| **faber format CLI reader-pack path mismatch** | Confirmed + refined. The installed `~/.local/bin/faber` (1.3.0) `format --reader-locale en` still fails: it resolves `radix/stdlib/reader/en/pack.toml` while the packs live under `radix/stdlib/locale/` (`radix/stdlib/reader/` is empty) — the exact U0 mismatch. The in-tree dev faber (`faber/target/debug/faber`, 1.6.0-rc.1) resolves the dev-tree `radix/stdlib/locale/en/pack.toml` (its `format --locale en --stdout` loads the pack, LOCALE002 suggestions only) — the `--reader-locale` flag spelling is superseded by `--locale`; the stale `~/.cargo/bin/faber` symlink points at a missing target. `radix emit -t faber --locale en` remains the proven locale machinery (byte-stable round-trip re-verified below). | **faber-lane tooling item** (recorded, not a tela defect — the CLI reader-pack path + the stale symlink are faber's to fix; the tela/radix `-t faber` emit path is the tela-side tooling). |
| **forms-exempla `-t faber` emit edge** | Re-verified. `radix emit -t faber --locale en` on the KERNEL exempla (`exempla/serializer.fab`, `exempla/assemble.fab`, `exempla/thema.fab`) is byte-stable (bodies identical, frontmatter `+++` dropped — the U0 record holds). The **cross-package exempla** (`proof/extension-forms/exempla/forms.fab`, imports `formslib:forms` + `tela:tela`) fails the `-t faber` re-emission with `SEM010 expression_type_mismatch`/`argument_type_mismatch` on the `tela.html_visus(forms.field(...))` call sites — the cross-package union-returning surface does not resolve through the exempla-mode HIR re-emission. | **Recorded edge** (probe-verification only, per the CTO caveat: `emit -t faber`/`format` locale commands are HIR re-emission — probe verification, NEVER a source-conversion tool). |

**CTO caveat (applies to every `-t faber`/`format` locale command in this
record)**: HIR re-emission is probe-verification only. The stage source of
truth remains the authored `.fab` files; re-emission is never a
source-conversion tool (the CTO lossless-transcode follow-up, recorded).

---

## 5. The dogfooding split frozen (done_when (e))

| Surface | Converts in | Home | Scope |
| --- | --- | --- | --- |
| **The fake DOM** (DOM *behavior*: node records — FakeClassList/FakeEvent/FakeElement/FakeDocument equivalents, the bounded parser `parseFragment`, the `webDom*` runtime-binding surface, `executeMountPlan`/`bindRegionSubscriptions`) | **U9** (`tela-s5-u9-dogfooding-harness-dom`) | `scripta/harness_dom.fab` (self-contained, en locale — the §2 probe (ii) home, confirmed) → emitted TS via the provider-module emit pattern; the `proof/harness-dom/` package fallback is **not** required | Both copies convert: `scripta/dom-shim.ts` (deleted at U9) + the embedded fake DOM in `check-forms-interactive` (removed at U9); all six harness gates stay green at the U9 boundary |
| **The assertion/orchestration drivers** (assert sequences, mount proofs, `executeMountProof`-shaped drivers, the install-globals wiring) | **follow-on** (the hardening executed lane) | ride the hardening lane — never a Stage-5 blocker | The posture's boundary (committed `f7c8647` + `af9d5ff`); the executed-lane split is recorded per unit in the U9 evidence record |

**Split rationale (frozen)**: the fake DOM is pure DOM-behavior over
records — the expressible, testable surface the conversion proves; the
orchestration drivers execute assertions/global installation, which stays
TS by the posture and rides the hardening executed lane (delivery §Residuals;
a workspace-wide TS→Faber harness conversion is a follow-on goal only if
the Tela conversion earns it).

---

## 6. Unit wave plan + identity scheme confirmed (done_when (f))

The U1–U10 graph (delivery §Ordered Unit Graph) is confirmed:

```
Wave 1:  U1 discovery-reference-posture        (this record)
Wave 2:  U2 layout-typography                  (reference.fab start + exempla + browser mount)
Wave 3:  U3 panel-badge-metric                 (reference.fab extend + exempla + browser mount)
Wave 4:  U4 table                              (composite: headers/caption/scope a11y + browser)
Wave 5:  U5 segmented-control-reference        (re-home the Stage 3 control + browser)
Wave 6:  U6 button                             (behavior/a11y: click + keyboard + focus)
Wave 7:  U7 field-forms-static                 (forms split half 1: field + form primitives, static + structure)
Wave 8:  U8 field-forms-behavior-a11y          (forms split half 2: validation + live region + keyboard)
Wave 9:  U9 dogfooding-harness-dom             (fake DOM + embedded harness TS → Faber source; six gates green)
Wave 10: U10 tests-determinism-evidence        (full surface green once + sha + evidence record)
```

- **Identity scheme**: `ref-layout-*` / `ref-typography-*` / `ref-panel-*` /
  `ref-table-*` / `ref-button-*` / `ref-badge-*` / `ref-metric-*` /
  `ref-seg-*`; the field/forms identities continue `form-*` (Stage 3/4
  precedent); one `-live` per family; `ref.*`/`form.*` namespaced tokens.
- **Naming rule**: no kernel-type-name collisions, no seam-type-name
  collisions, no `verum`/`falsum` identifiers; every new identifier probed
  collision-free (the G5 probe discipline); PascalCase concatenation for
  types, snake_case for fns/fields.
- **Shared-file sequence** (delivery Coordination Constraint 3, confirmed):
  `src/reference.fab` + `canary-app/src/main.fab` + `scripta/check-reference`
  are strictly sequential (U2 → U8); `scripta/dom-shim.ts` + the embedded
  fake DOM are touched by U9 only; docs by U1 (this record) + U10 (evidence).
- **No gated units**; the carried residuals (§4) apply recorded
  work-arounds with `fix:<id>` markers.

---

## 7. Non-goals of this unit (recorded)

No product code; no reference module (U2); no harnesses (U2+); no
conversion (U9); no `CAMPAIGN.md` edits (D3 — closeout-owned); no
faber-web/radix edits; no radix-lane fixes. The `-t faber`/`format`
locale commands are probe-verification only (the CTO caveat) — never a
source-conversion tool.

## 8. Validation

- No cargo suites (in-tree radix probes only; the one scratch cargo check
  ran in `/tmp` — the CODEGEN001 Rust-path attempt, §4).
- The probes above are recorded with their results against live radix
  0.80.0 (2026-08-09) — never assumed.
- `git diff --check` in `tela/`: clean (verified at the unit close).
