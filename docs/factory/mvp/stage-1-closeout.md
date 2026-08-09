# Tela Stage 1 — Closeout Record

**Status**: delivered (Stage 1 closeout complete; Stage 2 selected next)
**Closeout owner**: hand-6, 2026-08-09 (fleet task e079ef4e, workflow step 6)
**Campaign**: `tela/docs/factory/mvp/CAMPAIGN.md` Stage 1 — "Tela Kernel And
Static Renderer"
**Delivery spec**: `tela/docs/factory/mvp/stage-1-delivery.md`
**Input units**: U1–U6 (all landed; commits verified below), plus the closeout
img-set repair (`4c00192`)

This record closes Stage 1: it records the six gates as satisfied with cited
artifacts, records the escalations routed to the radix lane (and the one
correctness repair this closeout made), and hands the independent verification
to the reviewer/auditor (the named test owner for `check-determinism`). The
campaign's own acceptance remains the campaign's step-6 decision; this record
prepares it. It makes no Stage 2 implementation claim.

---

## 1. Gate record (all six gates satisfied)

| Gate | After | Cited artifact(s) | Evidence at closeout |
|---|---|---|---|
| **CG1** — kernel contract | U1 (`5bc797e`) | `src/tela.fab` (Branch B `Visus` union + kernel constructors); `faber.toml` | Typed HTML/SVG view values: `Elementum`/`Textus`/`Fragmentum` only, open element model, typed `Identitas`, `Proprietas` separate from `Attributa`, no raw-markup variant (policy (a)). Kernel owns constructors. Three-lane check green at U1; D2 (`nomen_tag`) / D3 (`nova_identitas`) re-checks recorded clean on in-tree radix 0.80.0. |
| **CG2** — validation | U2 (`836965c`) | `src/valida.fab`; `exempla/validation.fab` | Fail-closed lexical + namespace-context predicates, G4-safe string/bool surface. Dependency rule 9 honored (unknown-but-valid names accepted). The U2 name-set defect (html-only set omitted `img`) was surfaced at U6 and **fixed by this closeout** (`4c00192`, §3.5); the validation exempla now passes at runtime. |
| **CG3** — serializer | U3 (`05909f7`) | `src/tela.fab` (escapa + serializers); `exempla/serializer.fab` | Central escaping (one escape path; `& < >` text, `+ " '` attrs; identity valor through the same attr path — policy (d)); deterministic `html_visus`/`css`; fail-closed boundary (U2 checks before emission; invalid never emits — nullable result, documented + exercised); `data-tela` identity emission; void/namespace correctness. Exempla asserts green at runtime in the assembled TS lane (U3) and re-verified at this closeout. Verb collision handling: `css` verbatim; `html` → `html_visus` (G5, §3.2). |
| **CG4** — docs | U4 (`20d9bfd` + reconcile `d4ad577`) | `docs/design/identity-hydration.md`; `AGENTS.md` | Hydration-ready identity form documented (`data-tela="<escaped valor>"`, the one serialization form); Stage 1 authoring/package conventions recorded. Docs **reconciled to the landed U3 emission** (`d4ad577`): `html_visus` verb spelling, quote/escape verification — docs agree with the implementation. |
| **CG5** — benchmark static | U5 (`d71e29f`) | `proof/benchmark/{extension-lib,canary-app,libhome}/`; `stage-1-benchmark-static.md` | Two **separate packages** (own `faber.toml`, providers `extensionlib`/app, imported via the benchmark libhome) importing `tela:*`. Composition renders through the kernel: themed panel (`data-tela='canary-panelum'` + `aria-label`), two-column metric table (`dl`/`dt`/`dd`), horizontal bar meter (label + textual value); static HTML/CSS output via `tela.html_visus` + `tela.css`. Package-boundary proof: separate dirs + provider machinery — a same-file extension does not close this gate. Rendered bytes: actual TS-lane execution (see §2). |
| **CG6** — tests + determinism | U6 (`e8fb083`) | `scripta/{check-compile,check-exempla,check-determinism}`; `stage-1-determinism.md` | Package test surface green (compile / exempla / determinism harnesses). Determinism: the benchmark composition static output builds **twice and is byte-for-byte identical** — sha256 `a0f1b1cb170eded36c2816011320399080c60644f3182b7bd0167300f1f8613b` on both captures; a diff FAILS the check (fail-closed). Commands + output description recorded. |

Commit base verified in `tela/` git log: `5bc797e` (U1), `836965c` (U2),
`05909f7` (U3), `20d9bfd` + `d4ad577` (U4 + reconcile), `d71e29f` (U5),
`e8fb083` (U6), `4c00192` (closeout img-set repair).

---

## 2. Determinism evidence (the campaign double-build gate)

Byte-identical double build, recorded in `stage-1-determinism.md` §3:

```text
static-1 sha256: a0f1b1cb170eded36c2816011320399080c60644f3182b7bd0167300f1f8613b
static-2 sha256: a0f1b1cb170eded36c2816011320399080c60644f3182b7bd0167300f1f8613b
byte-identical: yes
```

Produced by `scripta/check-determinism` (Rust primary path attempted and
recorded BLOCKED — §3.1; proven TS-lane composition runner as the fallback),
re-checked green at the closeout. The U5 double-run evidence
(`stage-1-benchmark-static.md` §5) carries the same sha — one deterministic
output, two independent captures.

---

## 3. Escalations recorded (routed; the closeout fixed the one correctness item)

### 3.1 Rust emit-across-imports — provider-module locale propagation (radix lane)

`radix emit -t rust` of any file importing `tela:valida`/`tela:tela` fails
`CODEGEN001` — provider modules are re-analyzed WITHOUT the en reader locale
(PARSE030/PARSE001), so `--locale en` does not propagate to provider analysis.
Reproduced at U3/U5/U6. Consequences: the Rust static-render path and the
Rust-lane determinism build use the proven single-module fallback (never by
inlining the kernel). A fix would auto-activate the primary Rust path in
`scripta/check-determinism`. Routed To mind for the radix lane (U3 report).

### 3.2 G5 — exact `html` renderer verb blocked (radix lane; workaround in use)

`fn html(Visus)` collides with the `Spatium.html` enum-member top-level
binding (`SEM005.duplicate_definition`; `stage-0-canary.md` §5). The public
HTML renderer verb is `html_visus` (html_ prefix per the G5 recorded naming
constraint); `css` is verbatim. The locked English stem is preserved, NOT
silently renamed; docs reconciled (`d4ad577`). A G5 fix restores the exact
`html` verb.

### 3.3 G4 — cross-package helper export skipped (radix lane)

`ext.bar_metrum` (signature `→ tela.Visus`) is skipped in the cross-package
export snapshot (`WARN014.file_interface_export_skipped`); `ext.chart_stilum()`
and `ext.chart_axis_muted()` resolve. U5 applied the documented workaround
(app composes the meter with `tela` constructors, consuming the extension's
token + style bundle); the extension keeps its seam; no duplicated `Visus`.
Routed for the radix lane (G4 delivery).

### 3.4 Emitter observations (radix lane; workarounds verified in both lanes)

TS emitter: elif-chains with single-statement assignment bodies emit a
returned ternary (undefined at runtime); backslash escapes (`\"`, `\n`) are
double-escaped in string payloads. Rust emitter: a `String` moved into a
local still borrowed below (`E0382`). Workarounds (sequential independent ifs,
ascii-literal interpolation `"§"('"')`, fragment via `"" + c`) verified in both
lanes' runtimes; fragile against future emitter changes.

### 3.5 U2 img-set defect — FIXED at this closeout (this record's correctness item)

`valida.fab`'s html-only name set (`nomen_html_soli`) omitted `img`, so
`valida_nomen_in_spatio("img","svg")` returned true while `validation.fab`
asserts rejection (surfaced by the U6 dev-time runtime run; recorded in
`stage-1-determinism.md` §5.2). Fixed by commit `4c00192` (`img` added to the
set) per the U6 recommendation. Runtime re-verified: `img@svg=false`,
`img@html=true`, `circle@html=false` (regression intact); the validation
exempla and the serializer exempla both pass at runtime.

---

## 4. Reviewer / auditor handoff

Per delivery U6, the reviewer/auditor is the **named test owner** for
`check-determinism`: **Mind routes the auditor to re-run
`tela/scripta/check-determinism`** at the Stage 1 review (workflow step 6 —
`consequences`, `correctness`, independent audit before the campaign accepts
the stage). The fail-closed gate is the `cmp` on `build/static-1.txt` vs
`build/static-2.txt`; the evidence dir `tela/build/` (gitignored) holds the
current captures. Reviewer package-boundary check for CG5: separate packages
via the libhome provider machinery.

---

## 5. Disposition

Stage 1 is **delivered and closed out** from the implementation side: all six
gates satisfied with cited artifacts, the one correctness finding fixed and
runtime-verified, escalations routed with owners, and the independent
verification handed to the auditor (routed by Mind). The campaign's leading
status clause stays **active** until the campaign's own acceptance (workflow
step 6). **Stage 2 — Style And Theme Protocol** is selected next (campaign
stage list; discovery-first, lowers to `delivery` → `factory`; gate: two
materially different themes render the same component tree, namespaced
extension tokens, fail-closed duplicate/invalid output, deterministic product
assembly ordering).
