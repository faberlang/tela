# TELA NAMING & PATTERNS REVIEW — head-cto advisory (read-only)

**Commission**: Vivi task 5ad90f52 (naming & patterns review of the Tela
public API surface; input to planner-2's Stage 5 lowering, task 067785ba).
**Role**: head-cto, advisory. No code was written, committed, or merged.
**Method note**: the task body lives in the Vivi SQLite (no vivi exec in this
environment), so the commission was executed from the dispatch text + the
repo records (`tela/AGENTS.md`, `CAMPAIGN.md`, stage records, landed source).
**Read scope**: `tela/src/*.fab`, `tela/docs/factory/mvp/*`, `tela/docs/design/*`,
`tela/proof/**`, `tela/scripta/*`, `faber-web/src/dom.fab`, `faber-web/runtime/dom.ts`,
`faber-web/bindings/ts.toml`, `tela/docs/factory/mvp/stage-5-delivery.md` (planner-2),
plus cross-repo type-naming evidence in `triga/`, `gradus/`, `norma/`.

---

## 0. Executive summary

The Tela kernel surface is **clean and internally consistent**. Faber-Latin
protocol types, English renderer/host verbs, and English theme tokens are
named per the documented split (policy (b), `stage-0-protocol-policies.md` §2)
with disciplined casing. **The drift is concentrated exactly where Stage 5
will scale: the extension layer** — the forms proof package (`formslib`) and
the canary-app plan types. That layer carries (a) a Pascal_snake casing
deviation no other Faber repo uses (`Props_campi`, `Nuntius_Formae`), (b)
mixed-vocabulary identifiers inside single names (`error_regionum`,
`eventus_click`), (c) a Latin grammar deviation (`statu`, `selego`), (d) a
parallel `*_html` render surface whose `fix:g4` justification is stale since
cds-u6 landed, and (e) an un-decided English type in the protocol surface
(`Mounted`).

The commission asks for a clean API so v2/v3 need no rework. The verdict:
**every one of these is cheap now and expensive after Stage 5**, because the
Stage 5 delivery (`stage-5-delivery.md`) explicitly re-homes the forms family
into `tela:reference` and codifies "the `Scopulus` pattern" for props/tokens.
The right move is a small **naming-cleanup unit before Stage 5 admission**,
then the catalog authors against the locked convention.

Open Question 5 is, in fact, **already resolved** by policy (b) — the
campaign file still lists it open. The review confirms the documented split,
tightens it with an enforcement rule (one vocabulary per identifier + a Latin
grammar bar + a locked exception list), and recommends marking Q5 resolved
in `CAMPAIGN.md`.

---

## 1. Public API surface inventory

### 1.1 Kernel — `tela:tela` (`src/tela.fab`, flat, en locale)

| Surface | Names |
|---|---|
| View protocol types | `Spatium` (enum html\|svg), `Attributum {nomen, valor}`, `Proprietas {nomen, valor}`, `Identitas {valor}`, `Visus` union (`Elementum {identitas∪null, spatium, nomen_tag, attributa, proprietates, liberi}` / `Textus {valor}` / `Fragmentum {liberi}`) |
| Style/theme types | `Declaratio`, `Regula`, `Stilum`, `Scopulum {nomen, valor}`, `Thema {nomen, scopuli}`, `Codicillus {identitas, stilum}`, `Ordo {identitas, dependet}` |
| Behavior carriers | `Eventum {nomen}`, `Effectus` union (`Restitue`/`Dirige`/`Ancora`, each `{identitas}`), `Renovatio {visus, effectus}` |
| Constructors | `textus_view`, `fragmentum_view`, `elementum_view`, `elementum_omne`, `nova_identitas`, `html_spatium`, `svg_spatium`, `scopulum`, `thema`, `codicillus`, `ordo`, `eventum`, `restitue`, `dirige`, `ancora`, `renovatio`, accessor `effectus_identitas` |
| Renderer/host verbs | `html_visus` (G5 workaround for `html`), `css`, `thema_css`, `thema_stilum`, `assemble` |
| Helpers | `scopuli_core`, `nomen_scopuli_proprietas`, `nomen_scopuli_validum`, `thema_scopuli_core_parati`, `thema_habet_scopulum`, `codicilli_dedupata`, `in_lista`, `pendeant_parata`, `ordine_ordinata`, `stilum_validum`, `stilum_textus_immundus`, `codicillus_ex` |
| Internal (flat-module bindings, not consumer surface) | `escapa`, `seri_ns`, `seri_attributa`, `seri_identitas`, `seri_visus`, `valida_arbor`, `spatium_textus` |

### 1.2 Validation — `tela:valida` (`src/valida.fab`)

`valida_spatium`, `valida_nomen_tag`, `valida_nomen_attributi`,
`valida_nomen_in_spatio`, `valida_void_html`, `valida_void_structura`
(`valida_in_gregis` internal). Consistent `valida_*` prefix; string/bool-only
surface (G4-safe).

### 1.3 Browser module — `tela:browser` (`src/browser.fab`)

Pinned seam (audited): `mount(dom.Scope, Visus, Thema) → Mounted ∪ null`,
`replace(Mounted, Visus) → Renovatio ∪ null`, `dispose(Mounted) → void`.

- State/plan types: `Mounted` (12 fields incl. `scopus`, `radix`, `visus`,
  `thema`, `textus_markup`, `textus_css`, `identitates`, `diagnosia`,
  `ligamina`, `subscriptiones`, `identitas_focus`, `identitas_focus_optata`);
  carriers `Radiculum {identitas}`, `Subscriptio {identitas, nomen_eventi}`,
  `Ligamen {identitas, status}`.
- Policy fns (G4-safe string/list): `parse_identitates`, `elementum_tag`,
  `nomen_tagi`, `quotiens`, `identitates_duplicatae`, `identitates_ex_nodis`,
  `tags_ex_nodis`, `tag_at`, `ligamen_status`, `diagnosia_hydrationis`.
- Focus model: `focus_tenet(Mounted, identitas) → Mounted`,
  `focus_optata(Mounted, identitas) → Mounted`.
- Constructors: `radiculum`, `subscriptio`, `ligamen`. Internal:
  `nota_identitatis`, `unescape`.

### 1.4 Forms extension — `formslib` (`proof/extension-forms/src/forms.fab`)

- Types: `Props_campi`, `Props_boxi`, `Props_selecti`, `Scopula_formae`.
- Component fns: `campum`, `boxum`, `selego`, `error_regionum`,
  `regio_viva_forma`, `agmen_campi`; props ctors `props_campi`/`props_boxi`/
  `props_selecti`.
- G4-era string helpers: `campum_html`, `boxum_html`, `selego_html`,
  `error_regionum_html`, `regio_viva_forma_html`, `agmen_campi_html`.
- Tokens/styles: `form_field_invalid`, `form_field_valid`, `form_focus`,
  `scopulae_formae`, `form_stilum`.
- Behavior contract: `eventus_campi`/`eventus_mutationis`/
  `eventus_submissionis`/`eventus_click`, `invalid_textus`, `error_praesens`.

### 1.5 Extension-lib — `extensionlib` (`proof/benchmark/extension-lib/src/extension.fab`)

`Scopulus` (token carrier), `chart_axis_muted`, `chart_axis_muted_tenebrae`,
`chart_grid_muted`, `chart_grid_muted_tenebrae`, `chart_scopuli`,
`chart_scopuli_tenebrae`, `bar_metrum`, `chart_stilum`.

### 1.6 Canary-app plan types (`proof/benchmark/canary-app/src/main.fab`)

`Props_controlli`, `Nuntius` (`Electum`/`Motus`), `Vinculum`,
`Nuntius_Formae` (`Campi_Textus`/`Boxum_Toggle`/`Selectum_Mutatio`/
`Submission`), `Vinculum_Formae`, `Statu_Campi`; plan fns `update_controlli`,
`nuntius_clavis`, `annuntium`, `update_campi`, `annuntium_formae`,
`montium_formae`; components `segmentatum`, `segmentum_view`, `regio_viva`,
`panelum`, `metrica_tabula`, `bar_metrum_app`.

### 1.7 faber-web host seam — `web:dom` (la dialect, consumed read-only)

Types `Scope`, `Element`, `Nodus`, `DomEvent`, `FrameState`, `ResizeState`,
`KeyboardState`, `PointerState`, `FocusState`, `PointerLockState`,
`Subscription`, `SubmitOptions`, `FetchRequest`, `FetchResponse`; fns
`scope`, `query`, `require`, `all`, `snapshot`, `text_set`, `attr_set`,
`attr_remove`, `class_add`, `class_remove`, `class_toggle`, `on`,
`unsubscribe`, `value`, `value_set`, `on_input`, `on_submit`, `on_frame`,
`on_resize`, `on_keyboard`, `on_pointer`, `on_focus`,
`pointer_lock_state`, `request_pointer_lock`, `exit_pointer_lock`,
`on_pointer_lock`, `prevent_default`, `fetch_text`. TS runtime symbols are
`webDom*` + PascalCase (`webDomSnapshot`, `webDomOnSubmit`, …).

### 1.8 Harnesses (`tela/scripta/`)

`check-compile`, `check-exempla`, `check-determinism`, `check-mount`,
`check-forms-proof`, `check-forms-interactive`, `dom-shim.ts` (driver fns
`parseFragment`, `executeMountPlan`, `bindRegionSubscriptions`,
`executeMountProof`). Stage 5 adds `check-reference`; U9 converts the fake
DOM to `scripta/harness_dom.fab`.

---

## 2. Findings by severity

### 2.1 MUST-FIX-before-Stage-5 (decision or small rename; Stage 5 code would otherwise bake in the wrong pattern)

**MF-1 — Lock the naming convention before U1 admission (decision, the load-bearing item).**
The Stage 5 delivery (`stage-5-delivery.md`) re-homes the forms family into
`tela:reference`, codifies "the `Scopulus` pattern" for props/tokens, and
defers naming to U1. Without a locked convention, U2–U8 will mint dozens of
`Props_*` classes, tokens, and plan types against the drift. The convention
statement (§4 below) must be an input to U1's `done_when (a)` freeze. This is
also the mechanism for the operator's dogfooding posture (Faber-native API
naming).

**MF-2 — Extension/plan type casing: Pascal_snake → PascalCase concatenation.**
`Props_campi`, `Props_boxi`, `Props_selecti`, `Scopula_formae`,
`Nuntius_Formae`, `Vinculum_Formae`, `Statu_Campi`, `Props_controlli` use
`Pascal_snake`. Every other Faber repo concatenates: triga
(`ResourceHandle`, `SceneMeshDrawPacket`, `Box3OverlapFacts`), gradus
(`GradienteError`, `IdentitasTokenizator`), norma (`SolumStatus`,
`Subprocessus`), and the tela kernel (all single-word Latin) use
underscore-free PascalCase. Rename to `PropsCampi`, `PropsBoxi`,
`PropsSelecti`, `NuntiusFormae`, `VinculumFormae`, `StatusCampi`
(grammar fix too — see MF-3). Mechanical, contained to formslib + canary +
the harness `FORMS_NS`/`EXT_NS` consts + exempla assertions. **Byte-neutral
for static output** (identity strings and CSS do not contain type names), so
the determinism sha is unaffected by the renames themselves.

**MF-3 — Latin grammar bar: `selego`, `statu`, `error_regionum`, `eventus_click`.**
- `selego` is the 1st-person verb "I choose" among a noun family
  (`campum`/`boxum`/`regio_viva_forma`/`agmen_campi`). → `selectum` (neuter
  noun, matches the `campum`/`boxum` neuter coinage pattern). Probe for
  collisions per the G5 discipline.
- `Statu_Campi` uses the **ablative** of `status`. → `StatusCampi`
  (nominative).
- `error_regionum` is mixed vocabulary ("error" is actually Latin, but the
  construction is wrong: `regionum` is genitive **plural**) and inconsistent
  with `regio_viva`/`regio_viva_forma`. → `regio_erroris` ("region of error",
  genitive singular) — aligns the family's "region" scheme.
- `eventus_click` is the only English word in the `eventus_*` constant
  family. → `eventus_clicis` (Latinized genitive, matching `eventus_campi`/
  `eventus_mutationis`/`eventus_submissionis`). Values stay the English DOM
  strings ("input"/"change"/"submit"/"click").

**MF-4 — `Mounted`: protocol surface has one English type; decide now.**
Policy (b)'s letter says `tela:*` protocol types are Faber-Latin. `Mounted`
is the most-visible interactive type and its siblings are Latin
(`Radiculum`, `Subscriptio`, `Ligamen`, `Renovatio`). Two defensible ends:
(a) rename to a Latin -io noun matching `Renovatio` → **`Positio`**
(placement; recommended — Faber-native per the dogfooding posture, and the
`-io` pattern is already established), or (b) document `Mounted` as the
sanctioned English host-seam exception in policy (b). Either way, **decide
and apply before Stage 5**: U2–U8 browser proofs and the U9 dogfooding
rewrite consume `Mounted` pervasively; the rename is a handful of sites now,
dozens after the catalog.

**MF-5 — `html_visus`: pin the spelling; sequence the `html` restoration.**
G5 is NOT fixed: the cds sprint is "lowered 2026-08-09 — READY for
admission", and G5 rides **cds-u8 (wave 4)**. The committed plan restores the
exact `html` verb when it lands. Recommendation: **lock `html_visus` as the
v1.0 public verb** (Stage 5 catalog code writes `tela.html_visus(...)`), and
record the `html` restoration as a named v2 rename with the `fix:g5`
grep-replace predicate — the same `html_visus` → `html` swap, done once, in
the kernel + `TELA_NS` + docs. If instead the operator wants the pristine
verb before the catalog, do the swap as a Stage 5 entry unit the moment
cds-u8 lands. The one forbidden outcome is the catalog authoring against a
spelling that later flips.

**MF-6 — Single render route: retire or demote the `*_html` parallel surface.**
The `*_html` helpers (`campum_html`, …) were the G4 workaround ("the `→
tela.Visus` fns are WARN014-skipped for consumers"). cds-u6 landed; the U7
gate composes the fns through **normal qualified imports** — yet the stale
`fix:g4` claim survives in four places: `forms.fab` header,
`exempla/forms.fab` header, the `main.fab` "Stage 4 U3" static-runner block
(lines ~930–940, which still routes through `*_html`), and the
`check-forms-proof` header. Stage 5 catalog exempla (U2–U8) will copy
whichever route the field exempla use. Action: re-verify exempla-mode
consumption of `→ tela.Visus` fns against live radix (never assume); if
green, re-route the exempla to the direct fns and either delete the `*_html`
helpers or explicitly mark them exempla-local conveniences. Migrate the
`main.fab` U3 block to the normal-import route (the sha re-records; recorded
supersession).

**MF-7 — Token-carrier pattern: resolve `Scopulum` / `Scopulus` /
`Scopula_formae`.**
Three names for one concept, born of `fix:snapshot-nomen-collision`. The cds
removal predicate includes "`Scopulus` rename reverts". The Stage 5 delivery
currently codifies "the `Scopulus` pattern" for catalog props/tokens — that
must be re-decided: re-verify the snapshot-collision predicate against live
radix; if resolved, standardize the catalog on **kernel `Scopulum` values**
(matching the kernel token surface) and delete the per-package carriers; if
not, lock ONE documented local-carrier pattern with correct casing
(`Scopula`/`FormaScopula`-style) and remove the triad. U1's probe is the
named re-verification point; the delivery's "`Scopulus` pattern" wording must
be updated to the decision.

**MF-8 — Identity-scheme convention locked.**
The scheme is already good (`form-field-<nomen>`, `tela-seg-N`, `tela-live`,
`form-live`) and the delivery's `ref-*` prefix continues it. Lock the
convention in §4 (family-prefix kebab-case, one `-live` per family,
`-error-<nomen>`/`-control-<nomen>` association). Two nits to note:
`forma` (the top-level composition identity) reads as a standalone word
alongside the `form-*` family — document or rename; and identity strings are
DATA, so the identifier-vocabulary rule does not apply to them (mixed
`canary-panelum` is fine) — say so explicitly so nobody "fixes" identities.

### 2.2 SHOULD-fix (cheap during Stage 5; avoids v2 churn)

**SH-1 — `focus_tenet` / `focus_optata` → `focus_held` / `focus_target`.**
"tenet" (he/she holds) and "optata" (desired things) are obscure; the
browser module's public fn surface is English verbs (`mount`/`replace`/
`dispose`), so English model setters are consistent: `focus_held(m, id)`
records the pre-replacement focused identity; `focus_target(m, id)` declares
the focus-movement target. The Stage 5 delivery cites both fns in its a11y
contract — rename before U5/U6/U8 author against them (bundle with MF-2's
unit).

**SH-2 — Cascade layer label `tela.applicatio` → `tela.application`.**
The layer list mixes English (`reset`, `tokens`, `components`) and Latin
(`applicatio`). Align to one vocabulary (English, since reset/tokens/
components are English).

**SH-3 — `invalid_textus` → `status_invalidi` (or `textus_invalidi`).**
The fn maps bool → the aria-invalid string; "invalid_textus" reads as
"invalid text", which is the opposite of what it returns.

**SH-4 — Document the browser-module seam vocabulary** so `elementum_tag`,
`tag_at`, `nomen_tagi`, `tags_ex_nodis` are the sanctioned Latin-stem +
locked-DOM-noun seam set (and `elementum_tag`'s optional grammar polish to
`elementi_aperta`). The point is the rule, not the churn: the seam inherently
mixes protocol Latin and host English; make the mix explicit instead of
accidental.

**SH-5 — Stale-marker sweep.** Re-verify the `fix:<id>` inventory in tela/src
+ proof against live radix state (grep-replace discipline). Specifically the
`fix:g4` comments in MF-6's four sites and the `Scopulus` marker in
`extension.fab` (see MF-7). The AGENTS.md `fix:web-dom-locale` row is already
flipped; keep the inventory honest.

### 2.3 Carry-with-note (v2/v3; no action now)

1. **Stringly-typed statuses/diagnostics** — `Ligamen.status`
   `"ligare"/"creare"` and the `diagnosia_hydrationis` prefixes
   `duplicata:`/`extranea:`/`muta:` are string-encoded policy values. This
   was a G4-safe-surface constraint in v1. v2: typed unions
   (`union LigamenStatus`, `union Diagnosia`).
2. **`dispose(Mounted) → void` is a no-op pure marker** — the host executes
   the unsubscribe plan (`webDomUnsubscribe`) separately. The name promises
   an action the pure fn cannot perform. Pinned + audited; keep the seam, but
   v2 should consider a plan-returning dispose (symmetry with `replace` →
   `Renovatio`) and the docs must state the host-execution model loudly.
3. **Variant-name grammar** — `Effectus` variants are imperatives
   (`Restitue`/`Dirige`/`Ancora`) while `Visus` variants are nouns. Defensible
   (effects are commands to the host); document or unify to -io nouns
   (`Restitutio`/`Directio`/`Ancoratio`) in v2.
4. **Constructor duality** — `Visus` variants get `_view` constructors
   (`textus_view`, `elementum_view`) + `elementum_omne`; plain classes get
   bare-name constructors (`thema`, `codicillus`, `renovatio`); effect
   variants get verb constructors (`restitue`). Documented but worth a v2
   unification pass once the pattern set is visible.
5. **`agmen_campi`** — grammatical Latin but "column of the field" is odd for
   a form group (the exempla themselves gloss it as `grex`/`gregale`).
   Optional `coetus_campi` polish; carry.
6. **Flat-module single namespace (G4)** — every public name in one module
   makes uniqueness + the collision-probe discipline load-bearing. Module
   splits are a v2 structure decision (cds-u6 relaxed the flat rule).
7. **App-side plan names** (`annuntium`, `nuntius_clavis`, `montium_formae`,
   `Boxum_Toggle`, `Submission`) — app-typed per D1, not tela API, but the
   message-variant names should follow the one-vocabulary rule (`Submission`
   → `Submissio`, `Boxum_Toggle` → `Boxum_Mutatio`) as part of MF-2's canary
   rename.
8. **`tela:ligamen` event name** — namespace-colon DOM event, consistent
   with the `web:` provider convention; document as the tela-owned event
   spelling.

---

## 3. Rename / restructure proposal table

| # | Old | New | Surface | Rationale |
|---|---|---|---|---|
| 1 | `Props_campi` / `Props_boxi` / `Props_selecti` | `PropsCampi` / `PropsBoxi` / `PropsSelecti` | formslib types | PascalCase concatenation (triga/gradus/norma/kernel convention); "Props" kept as documented English seam term |
| 2 | `Nuntius_Formae` / `Vinculum_Formae` / `Statu_Campi` / `Props_controlli` | `NuntiusFormae` / `VinculumFormae` / `StatusCampi` / `PropsControlli` | canary plan types | Casing; `Statu`→`Status` (nominative) |
| 3 | `selego` | `selectum` | formslib component fn | Noun family (`campum`/`boxum`); verb form → neuter noun |
| 4 | `error_regionum` | `regio_erroris` | formslib component fn | One vocabulary; genitive singular; aligns the `regio_viva*` region scheme |
| 5 | `eventus_click` | `eventus_clicis` | formslib constant | Latin family purity; value stays "click" |
| 6 | `Mounted` | `Positio` (or documented exception) | tela:browser protocol type | Policy (b) letter: protocol types Latin; matches the `Renovatio` -io pattern |
| 7 | `html_visus` | `html` (v2, when cds-u8 lands) | kernel renderer verb | Committed G5 restoration; locked as `html_visus` for v1.0 |
| 8 | `focus_tenet` / `focus_optata` | `focus_held` / `focus_target` | tela:browser model fns | English verb surface clarity |
| 9 | `tela.applicatio` | `tela.application` | cascade layer label | Layer-vocabulary consistency |
| 10 | `invalid_textus` | `status_invalidi` | formslib mapping fn | Method clarity (name reads as "invalid text") |
| 11 | `Scopulus` / `Scopula_formae` | (kernel `Scopulum`) | extension token carriers | Resolve the triad per MF-7 once the snapshot fix is verified |
| 12 | `*_html` helpers | retired / exempla-local | formslib surface | G4 workaround obsolete post-cds-u6 (verify live) |
| 13 | `elementum_tag` | `elementi_aperta` (optional) | tela:browser policy fn | Seam grammar polish; the rule (SH-4) matters more than the rename |
| 14 | `Submission` / `Boxum_Toggle` | `Submissio` / `Boxum_Mutatio` | canary message variants | One-vocabulary rule for plan types |

Note: items 1–5, 8, 10, 12, 14 are **byte-neutral for static output** —
identities (`form-field-name`, `data-tela` values) and CSS bytes do not
contain type/fn names. Only harness namespace consts (`FORMS_NS`), exempla
assertions, and driver call sites change; the determinism sha is unaffected
by the renames themselves (re-records only for the MF-6 `main.fab` route
migration).

---

## 4. Naming-convention statement (proposed lock for Stage 5 U1)

1. **Casing.** Types (`class`/`genus`/`union`/`enum`): PascalCase, single
   token — multi-word types concatenate (`PropsCampi`, `SceneMeshDrawPacket`).
   Functions: snake_case (`html_visus`, `mount`, `regio_erroris`). Fields:
   snake_case. Theme tokens: dotted lowercase (`chart.axis.muted`). CSS
   custom properties: `--kebab-case`. `data-tela` identities: family-prefixed
   kebab-case (`form-field-<nomen>`, `ref-seg-*`). Tela-owned DOM events:
   `tela:`-prefixed (`tela:ligamen`).
2. **Vocabulary (policy (b), tightened).** The documented split stands.
   Enforcement rule: **an identifier is one vocabulary end-to-end — no mixed
   stems.** Protocol types + fields → Faber-Latin. Renderer/host verbs +
   host-adjacent types → English. Theme tokens → English dotted paths.
   Extension-contract prose → English. Exceptions locked by this review:
   `Props*` (component-props seam — English), the browser-module DOM/string
   policy fns (`elementum_tag`, `tag_at`, `nomen_tagi`, `tags_ex_nodis` —
   Latin stems + locked DOM/web nouns), `Mounted`→`Positio` ruling (MF-4).
3. **Latin grammar bar.** Type/component nouns: nominative singular or
   established neuter 2nd-declension coinages (`Elementum`, `Stilum`,
   `Scopulum`, `campum`, `boxum`, `selectum`). Possessive/relation compounds:
   genitive suffix (`agmen_campi`, `regio_erroris`). No verb forms as nouns
   (`selego` → `selectum`), no oblique cases (`statu` → `status`), no plural
   genitives for singular relations (`regionum` → `erroris`). Action-result
   types may use -io nouns (`Renovatio`, `Positio`).
4. **Seam rule.** Types in `tela:*` public signatures are protocol types →
   Latin. English host types (`dom.Scope`, `dom.Nodus`) keep faber-web's
   spellings — consumed, never re-declared.
5. **Plan/message pattern (D1 app-typed).** Per-family:
   `Nuntius<Familia>` / `Vinculum<Familia>` / `Status<Familia>`; variants are
   Latin nouns or perfect participles (`Electum`, `Motus`, `Submissio`), one
   vocabulary.
6. **Component-package shape (the extension contract the catalog repeats).**
   Per family: props carrier (`Props<Familia>`, PascalCase) → component fns
   (Latin nouns) → `regio_erroris`/`regio_viva_forma` region scheme →
   `eventus_*` constants (Latin) → `status_*`/`*_praesens` mapping fns →
   `form_stilum`-style bundle + `Scopulum`-based tokens (MF-7 decision) →
   `form-*`/`ref-*` identities. One render route (the component fn; the
   `*_html` surface retired — MF-6).
7. **Stringly statuses/diagnostics** are a v1 G4 constraint; v2 moves to
   typed unions (documented, not silently permanent).

---

## 5. Open Question 5 — vocabulary policy: resolution

**Recommendation: keep the documented split (policy (b)) and mark Q5
resolved in `CAMPAIGN.md`.** The three candidate answers reduce to the split,
which was locked in `stage-0-protocol-policies.md` §2 and is correctly the
least-surprising choice for a web framework on Faber: Latin protocol identity
(`Visus`, `Elementum`, `Renovatio`), English at every web seam (`mount`/
`replace`/`dispose`/`css`, theme tokens, extension prose). What the policy
record lacked — and what this review adds — is the **consistency rule that
makes the split enforceable**:

> **One vocabulary per identifier.** A name never mixes Latin and English
> stems; the vocabulary of the head word is the vocabulary of the surface
> (protocol → Latin, host/renderer → English); the browser-module seam is the
> documented exception set, not an open license.

Plus the grammar bar (§4.3), the casing lock (§4.1), and the explicit
exception rulings (Props, Mounted→Positio, seam DOM nouns). The observed
violations of the split are exactly MF-3/4 and SH-1/2/3 — all small, all
now.

Also answering the Stage 5 delivery's own Open Q1: module name
**`tela:reference` (English)**, with the module-name convention locked as:
pure internal protocol modules Latin (`tela`, `valida`), consumer/host-facing
modules English (`browser`, `reference`). Latinizing to `tela:refero` buys a
gloss step with no consistency gain against the `browser` precedent.

---

## 6. Sequencing

### Before Stage 5 implementation (one naming-cleanup unit, tela-only, small)

The Stage 5 delivery's graph (U1 discovery → U2–U8 catalog) does not
currently carry a naming-cleanup unit, and U1 is docs-only. Recommend one
pre-admission unit (or an expanded U1 write_scope) that lands, in order:

1. **MF-1 + MF-8**: the naming-convention statement and identity-scheme lock
   (input to U1's `done_when (a)` and to planner-2's delivery admission).
2. **MF-4**: `Mounted` → `Positio` (or documented exception) — kernel +
   browser.fab + design record + driver TS + exempla.
3. **MF-2 + MF-3 + SH-1 + SH-3 + item 14**: formslib + canary renames
   (casing, vocabulary, grammar) — byte-neutral for static output.
4. **MF-6**: retire `*_html` (after the live exempla-consumption
   re-verification), migrate the `main.fab` U3 block, reconcile the stale
   `fix:g4` claims; sha re-records (recorded supersession).
5. **MF-7**: token-carrier decision + application (conditional on the
   snapshot-fix re-verification in U1's probe).
6. **MF-5**: `html_visus` spelling decision recorded in the delivery (lock
   `html_visus` for v1; `html` restoration = v2 rename when cds-u8 lands).
7. **SH-2 + SH-5**: layer label + stale-marker sweep.

After this unit, planner-2's delivery needs three small updates: U1
`done_when (a)` absorbs the convention; Open Q1 answered `tela:reference`;
the "`Scopulus` pattern" and `focus_tenet`/`focus_optata` references updated
to the decisions.

### During Stage 5 (before closeout)

Nothing naming-critical — the catalog authors against the locked convention.
Any late rename is a carry-with-note into v2.

### Later (v2/v3)

`html` restoration (when cds-u8 lands); stringly statuses/diagnostics →
typed unions; plan-returning `dispose`; variant-name grammar unification;
constructor-pattern unification; flat-module splits; `agmen_campi` polish.

---

## 7. Risks and caveats

- **Renames touch accepted-stage artifacts** (Mounted, the seam record,
  stage-4-interactive). They are post-acceptance deviations; the
  browser-lifecycle §12 reconciliation ledger is the vehicle for recording
  them. Advisory — the operator decides.
- **`*_html` retirement is conditional on a live re-verification** that the
  exempla-mode path consumes `→ tela.Visus` fns post-cds-u6. If the exempla
  path still skips, keep the helpers as documented exempla-local conveniences
  (the app route is already fixed either way). Never assume — the U1 probe.
- **`html` restoration and the token-carrier standardization depend on radix
  fixes** (cds-u8 / the snapshot predicate). Both have recorded removal
  predicates; neither is a Stage 5 gate.
- The commission's task body (5ad90f52) was not directly readable without
  vivi exec; this review was executed from the dispatch + repo records. Any
  task-body item not reflected above should be surfaced to mind.
