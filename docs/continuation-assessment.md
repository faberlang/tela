# Tela continuation assessment — CTO pass

**Seat**: head-cto (advisory; single seat by design — dormant-repo pass, not a landed-work verdict)
**Task**: `ef55a940` (2026-09-20). **Companion**: Triga continuation pass `41b22132`, running
concurrently and independently — see §8 for the coupling read from Tela's side.
**HEAD verified**: `tela` `e1a0ce6` (2026-09-17); consumers checked live in `triga`, `examples`,
`faberlang.dev`, `radix`, `hosts` at their current checkouts.
**Method**: read-only symbol search, no cargo, no builds. Doc claims checked against code; the repo
wins. Not re-run: the adversarial security review
(`radix/docs/audits/radix-blackhat-2026-09-20/research/S-H-product-seams.md`) — cited where relevant.

---

## 1. State — what exists, what is proven, where it stops

**Inventory (verified at HEAD).** Seven modules in `src/`, 3,877 lines:
`tela.fab` 1,037 (kernel: `View` union, constructors, serializers, theme/token/assembly),
`reference.fab` 1,392 (reference component catalog), `browser.fab` 596 (mount/replace/dispose
lifecycle + hydration), `dom.fab` 389 (DOM contract), `canvas2d.fab` 275, `validate.fab` 166,
`web.fab` 22 (the `WebController` annotation only). Plus `exempla/` 1,345 lines, the Faber-authored
fake-DOM mount harness `scripta/harness_dom.fab` 1,088 lines, ten repo-local `scripta/check-*`
gates, `runtime/dom.ts` 437 + `runtime/canvas2d.ts` 224 (the TS host runtime), and
`bindings/ts.toml` (57 routes: 28 `tela:dom`, 29 `tela:canvas2d`).

**What is proven.** The TS lane end to end: `radix check` clean per-module, TS emit +
`check-exempla`/`check-mount`/`check-forms-*`/`check-reference`/`check-determinism` gates,
byte-identical double-build determinism (SHA `6927187ec0`, ratified **TS-only**), and
`tests/contract-test.ts`, which mechanically cross-checks the `.fab` ↔ `bindings/ts.toml` ↔
`runtime/*.ts` bijection. Campaign Stages 0–5 are accepted with independent audits on record
(`docs/factory/mvp/CAMPAIGN.md`). The migration of all 11 `web:*` consumer packages onto `tela:*`
landed 2026-08-12 (§2). This is honest, evidenced work — the quality level of what is proven is
high; the question is how much of it anything uses (§3).

**What is stubbed or absent.**

- **No real-browser execution anywhere in-tree.** The mount/update proofs run under the
  Faber-authored fake DOM (`scripta/harness_dom.fab`); AGENTS.md states "a real-browser driver is
  out of scope". The real consumers (§3) never invoke `tela:browser` at all — their HTML is
  hand-authored and their controllers mutate `data-*` attributes. Nothing at HEAD installs
  `mount()`'s render plan (markup/`css_text`) into a real document; the blackhat audit confirms
  "no in-tree host installs `css_text`" (S-H1).
- **Rust lane blocked.** `fix:codegen001` markers remain on 9 sites across 4 modules; the radix
  rust e2e lane is itself red (`radix/docs/factory/e2e-rust-red-set/goal.md`, planned 2026-08-28,
  not lowered). Rust parity is unproven and explicitly held.
- **Async absent by posture.** No `@ futura` in handlers, no fetch-driven updates — blocked on a
  radix TS lowering gap recorded in `docs/design/browser-lifecycle.md` §6.
- **57 `fix:` marker sites** (a dozen distinct kinds) across `src/`, `exempla/`, and the harness —
  recorded radix-defect workarounds with grep-replace removal predicates. This is the standing
  tax of living on a moving compiler.

**Where the library stops being usable.** (a) Any Rust-target need. (b) Any async/fetch-driven
interaction. (c) Any claim of real-DOM fidelity — layout, real events, real browsers are unproven.
(d) Most sharply: the kernel view protocol, the browser lifecycle, and the reference catalog
(≈3,000 of the 3,877 source lines) have **zero external consumers** — see §3. The library is
"usable" today exactly to the extent `tela:dom` + `tela:web` + `tela:canvas2d` are used.

---

## 2. The gap — against the MVP campaign and the migration goal

**MVP campaign (`docs/factory/mvp/CAMPAIGN.md`).** Stages 0–5 accepted. Remaining: Stage 6
(data display/visualization — conditionally admitted 2026-08-10, never opened), Stage 7 (consumer
migration + duplicate-IR removal: "Speculum renders through Tela and deletes its duplicate general
view IR; the browser fixture renders and mounts Tela components"), Stage 8 (hardening/release
decision). The real distance is **Stage 7, not Stage 6**: Stage 7's own gate names exactly the hole
found in §1 — no browser fixture renders and mounts Tela components, and Speculum
(`faberlang.dev`) still serializes through its own `document_ir`. Both Stage 7 halves are unmet;
Stage 6 would add more unconsumed surface before that hole is closed.

**Migration goal — the register is lying, and that is a finding.**
`docs/factory/web-to-tela-consumer-migration/goal.md` still reads
`**Status**: planned — pre-implementation … no code moves`. The code disagrees on every axis:
`EVIDENCE.md` in the same directory records U1–U6 **landed 2026-08-12** with the retirement
condition MET ("zero live `web:` consumers"), my own HEAD sweep confirms all 11 packages
(5 `triga/corpus`, 6 `examples`) import `tela:*` and no live `"web:` import remains outside
`archivum/`, and faber-web was archived outright on 2026-08-18 (`archivum/faber-web`). The goal was
never advanced or archived — a register-vs-repo defect of exactly the class this workspace has been
burned by before. Related drift in the same dir: `DELIVERY.md` still self-references its pre-rename
path (`tela/docs/factory/ln-consumer-migration/`).

**Is the original target still right in 2026?** Half. The world validated the bottom of the repo
and not (yet) the top: faber-web is gone and `tela:dom`/`tela:web` are now the *sole* DOM/controller
seam, enforced by name in the faber CLI (§3) — that part of the MVP thesis landed and stuck. But
the "general-purpose Web UI framework" frame outran demand: the actual browser consumers at HEAD
are controller-style apps with hand-authored HTML; none renders through the View protocol. The
campaign's Stage 7 (real consumers, one canonical view truth) remains the right 2026 shape of the
target; Stage 6's visualization grammar is premature until Stage 7 exists (§6).

---

## 3. The seam — what Tela binds to, who consumes it, what is residue

**Outbound dependency (what Tela sits on).** Tela is a *leaf consumer* of the radix language
surface: import/export/visibility mechanics (`WARN014`, `SEM006`, file interfaces), the TS emitter,
locale pack-authority lookup (`locale/en`, `locale/la` merged into consumer reader packs), and the
faber CLI's browser-app packaging. It has no dependency on norma, triga, gradus, or any generated
carrier (kernel is stdlib-only by contract). All of its validation is repo-local and manual —
nothing in `radix/scripta/` references tela, and tela exempla are not in the radix e2e corpus, so
**no automated ladder covers tela**; radix movement is caught only when someone runs tela's checks.

**Inbound edges (who consumes Tela at HEAD) — the load-bearing map:**

| Surface | Size | Consumers at HEAD | Verdict |
| --- | --- | --- | --- |
| `tela:web` (annotation) | 22 lines | 11 browser-app packages (5 triga corpus, 6 examples), 28+ `@ WebController` sites; **enforced by the faber CLI** — `radix/crates/faber/src/package/product/controllers.rs` requires `WebController` provenance from `tela:web`/`web:web` and a `tela:dom`/`web:dom` `Scope` first parameter | **Live, load-bearing, hardcoded by name inside radix** |
| `tela:dom` | 389 lines + 28 routes + `runtime/dom.ts` | The same 11 packages (19 distinct members used; `attr_set` alone at 228 recorded call sites); delivered into builds via the faber browser product's per-package TS shim loading (`ts_emit.rs` reads `[target.ts] bindings = bindings/ts.toml`); radix test fixtures mirror the emitted `tela-browser.ts` shape | **Live — the workhorse** |
| `tela:canvas2d` | 275 lines + 29 routes + `runtime/canvas2d.ts` | 2 examples (`canvas2d-interactive`, `web-canvas2d-smoke`) | Live, narrow |
| `tela:tela` (kernel) | 1,037 lines | **One proof consumer**: `faberlang.dev/generator/src/tela_island.fab` — explicitly "not imported by main.fab"; the site's production serializer remains `document_ir` | Proven, unconsumed |
| `tela:browser` (lifecycle) | 596 lines | **Zero external consumers.** Proven only by exempla + `check-mount`/`check-forms-*` under the fake DOM | Proven, unconsumed |
| `tela:reference` (catalog) | 1,392 lines | **Zero external consumers** (largest module in the repo) | Proven, unconsumed |
| `tela:validate` | 166 lines | Internal — the kernel serializer's fail-closed glue | Internal |

**The four ambiguous top-level dirs:**

- `bindings/` — **live**. `ts.toml` is the route→symbol table the faber browser build consumes per
  package; `tests/contract-test.ts` verifies its bijection against `src/*.fab` and `runtime/*.ts`.
- `runtime/` — **live**. `dom.ts`/`canvas2d.ts` are the actual TS that executes in the browser for
  every `webDom*`/`webCanvas2d*` call in the 11 consumer packages.
- `spike/` — **frozen Stage 0 evidence by policy** ("no unit writes here"): Branch A/B decision
  record, defect repros d0–d5, canary packages, `ts-scratch/`. Residue by design; it documents why
  the kernel is Branch B. Not dead weight, not live code.
- `build/` — **untracked residue**. Gitignored ("Stage 1 U6 harness outputs"); `hashes.txt`,
  `static-1/2.txt` are local determinism-run outputs. Ignore it.
- (Also live: `proof/` — locale-la proofs, benchmark packages, the Aug 18 `dom-export` probe that
  pins the export surface to the symbols the examples actually use; `locale/` — the en/la packs.)

**Small seam-hygiene findings (verified):** `AGENTS.md` and `docs/design/browser-lifecycle.md`
still reference `scripta/dom-shim.ts`, which no longer exists at HEAD (Stage 5 U9 replaced it with
`harness_dom.fab`); and the consumer `faber.lock`s record `tela = "0.1.0"` while
`tela/faber.toml` says `version = "0.0.0"` (unverified whether the resolver enforces path-dep
versions — flagged, not diagnosed).

---

## 4. Work areas — ordered, sized (effort bands: S ≈ 50–150k, M ≈ 150–400k tokens)

1. **Close the lying register (S, trivial).** Advance
   `docs/factory/web-to-tela-consumer-migration/` to done and archive it per workspace convention;
   fix `DELIVERY.md`'s stale self-path and the stale `dom-shim.ts` references in `AGENTS.md` /
   `browser-lifecycle.md`. Why first: this assessment's own reconnaissance was contaminated by the
   false status line; every future session pays the same tax. Mind-owned bookkeeping, zero product
   risk, no radix interaction.
2. **The Stage 7 browser half: one real-browser fixture that renders and mounts Tela components
   (M).** The campaign's own gate, missing entirely at HEAD. Smallest honest shape: one example
   package whose page is generated from `tela.View` values (static serializer output), whose
   controller mounts via `tela:browser` over `tela:dom` in a *real* browser, with a driver
   asserting `data-tela` identities and one scripted interaction (the segmented-control sequence
   already exists as a script). This also makes the render-plan install path real — which is the
   prerequisite for ever resolving blackhat S-H1's "no host installs `css_text`" unknown honestly.
   Why second: it is the credibility gate for all 3,000 unconsumed lines; without it, anything
   built on the lifecycle is proof-by-fake-DOM forever.
3. **The Stage 7 static half: migrate Speculum (`faberlang.dev`) onto `tela:tela` and delete
   `document_ir` (M).** `tela_island.fab` already proves byte-parity for the core node shapes and
   proves the cross-locale import (Latin generator, English library). The site is the workspace's
   most-shipped Faber artifact — real consumer pressure, real gates. Why third: independent of
   area 2 (different repo, static-only, no browser needed); together they decide the kernel's fate
   with evidence instead of opinion.
4. **Async routing — advisory now, radix-owned (S advisory; port is S when radix lands).**
   Fetch-driven updates are blocked on the radix TS `@ futura`-in-handler lowering
   (`browser-lifecycle.md` §6). Tela-side work is to keep the escalation record pointing at that
   producer fact and port the proof when it lands. Do **not** build tela-side async machinery
   (would be speculative edge machinery competing with the producer).
5. **fix-marker burn-down on radix landings (S per wave, maintenance cadence).** 57 sites,
   predicates recorded. Each radix defect fix (D1, G4/G5, CODEGEN001) triggers a small tela pass.
   Not a project; a standing cost of the seam.

Not proposed as areas: Stage 6 visualization, Rust parity, publication — see §6.

---

## 5. Parallelizability — the operator's actual concern

**Verdict: parallel-friendly.** Tela can move now alongside Radix/Gradus-forward work with
low contention, because:

- **Disjoint write surfaces.** Tela work lives in `tela/` (plus `examples/` or `faberlang.dev/`
  for areas 2–3 — separate repos, separate commits). Radix GPU/Metal/Gradus work touches none of
  these. No cargo in tela (Faber source + node scripts) — no workspace build-lock interaction at
  all under the no-cargo discipline.
- **Leaf position.** Tela depends on radix's *language surface*, not on its moving fronts (Metal,
  WGSL, MIR, inference). The GPU agenda and the tela agenda share no files and no crates.

**The still-moving dependencies that do bear on tela — named:**

1. **Radix language surface (imports/exports/visibility/locale)** — the real coupling. It moved
   under tela repeatedly in Aug–Sept, and the September tela commits are exactly those repairs
   (`ut→as` imports, `SEM006` export marking, locale-projection dedup). Expect small break-repair
   cycles to continue; they are bounded, mechanically caught by tela's own gates, and the repair
   pattern is proven. This is the one "distraction" mode — it is a tax, not a block.
2. **Radix TS emit** — tela's only proven target. The radix `ts-codegen` factory goal is
   *deferred, low priority*: the lane works but is not a radix priority. Drift here hits tela's
   contract test and harnesses mechanically. Stable enough to build on; orphaned enough that tela
   must keep owning its own TS-lane proof.
3. **Radix Rust emit** — red and unowned (`e2e-rust-red-set`, planned, not lowered). Irrelevant to
   parallel progress as long as tela makes no Rust claim (the `fix:codegen001` markers keep that
   honest).
4. **The faber CLI browser product** — a live consumer edge *inside* radix (`controllers.rs`
   provenance enforcement, `ts_emit.rs` shim loading). Currently settled; changes there are rare
   but need tela awareness.
5. **Locale packs / corpus** — tela owns fragments; radix owns the merge mechanics. Consumer
   demos in `triga/corpus` are tela consumers, so Triga-side edits there can touch tela's
   `dom-export` probe symbol list (§8) — a coordination point, not a blocker.

**What would make Tela a distraction rather than parallel progress:** scheduling Stage 6
(growing the unconsumed catalog), tela-side async machinery, or Rust-parity attempts — each burns
sessions against blocked or premature fronts (§6). The work areas in §4 are chosen to be
consumer-shaped precisely so they never compete for radix attention.

---

## 6. Premature or blocked — as useful as the work list

- **Stage 6 visualization grammar — premature.** It grows `reference.fab`-style unconsumed
  surface before any consumer renders through the kernel. The campaign's own sequencing (Stage 7
  after 4–6, "prove the framework against real consumers") and the 2026-08-10 admission conditions
  say the same. A session spent here produces proven-unconsumed code.
- **Rust-lane parity — blocked.** Producer facts missing: CODEGEN001 and a green rust e2e lane.
  Nothing tela-side to do until `e2e-rust-red-set` lands.
- **Branch A (`Visus<Message>`) re-spike — blocked** on radix D1; campaign rule: never a mid-stage
  switch. Correctly parked.
- **Async/fetch-driven updates — blocked** on the radix TS lowering gap. Building tela-side
  workarounds now would violate the campaign's synchronous-only posture and duplicate the producer.
- **Any theme-pack/token loader feeding non-literal values — must not precede the S-H1
  mitigation** (extend `unclean_style_text` + run `style_valid` over the token layer; cheap,
  recorded in the audit). A loader without it activates the audit's raise condition (CSS → script
  injection in the app origin).
- **Publication/remote (Stage 8) — premature** until Stage 7 gives consumer evidence; versioning
  is explicitly a Stage 8 decision (see also the 0.0.0/0.1.0 pin note in §3).

---

## 7. The honesty question — is continuing Tela worth it?

**Yes — conditionally, and the condition is consumer-shaped.** A blanket "no" is not honest,
because the bottom of the repo is not a prototype: `tela:dom` + `tela:web` + `bindings/` +
`runtime/` + the contract test are live infrastructure for all 11 browser-app packages in the
workspace and are enforced by name inside the faber CLI. Abandoning or re-deriving that would
orphan working consumers to re-buy what already works — the wrong clean break.

The honest "prototype" question applies to the **upper layers** — kernel view protocol, browser
lifecycle, reference catalog (~3,000 proven-but-unconsumed lines). Two defensible answers:

- **Invest (recommended):** run areas 1–3. Cost ≈ one S + two M efforts. Outcome: the upper layers
  either earn real consumers (faberlang.dev on the kernel; a mounting browser fixture on the
  lifecycle) or the negative answer arrives *with evidence*, at which point freezing them as
  protocol evidence is a ruled decision rather than neglect.
- **Freeze:** if the operator does not want faberlang.dev on tela and does not want a mounting
  browser fixture, then the right move is to freeze the upper layers as-is, skip Stage 6, and
  spend nothing beyond radix-breakage repairs (area 5 cadence). The repo then costs almost nothing
  and keeps paying for the seam.

What is **not** defensible is the middle path — continuing to grow the framework (Stage 6) with
zero consumers. That is the actual dead-end risk in this repo, and it is avoidable by sequencing.

---

## 8. The Triga coupling — from Tela's side

**What the coupling is at HEAD (known, verified):** concrete and one-directional in use. Five
`triga/corpus` demos and two triga-flavored `examples` packages import `tela:web` + `tela:dom` for
controller packaging and DOM binding. That is the entire edge. Triga demos do **not** render
through Tela: their HTML is hand-authored (`pages/index.html`), their rendering is hand-written host
JS (`public/src/product/bootstrap.js`, three.js) plus WGSL artifacts, and the Faber controller's
job is to publish geometry/transform payloads into `data-*` attributes that the host JS reads.

**Does Tela expect to consume Triga? No.** The kernel is stdlib-only by contract (no `triga`
dependency — `faber.toml` and AGENTS.md lock this), and nothing in tela's remaining campaign scope
needs geometry or a renderer.

**Does Triga's renderer belong behind Tela's seam? No — and this is the explicit disagreement
flag.** If the Triga pass reads its S2 "shared-renderer vertical slice" as *rendering through
tela* (Tela as an umbrella graphics+UI seam), Tela's side disagrees on three grounds: (1) the
corpus demos' proven composition is exactly the opposite — tela owns DOM/controller/packaging, the
demo owns the draw loop — and it works; (2) absorbing a GPU renderer behind the `View` seam would
couple tela to triga and the device backends, breaking the campaign invariant that Canvas2D (let
alone WebGL/WGPU) stays separate from `View` (Stage 6 admission condition 2); (3) it would add
nothing the demos need. `hosts/webgpu-browser` — the Radix-side browser device host consuming
emitted WGSL + reflection — has **no tela dependency at HEAD** (verified), which is the correct
shape: three orthogonal browser layers (device host / renderer / DOM-UI), none nested.

**Where the two passes genuinely share a surface (small, named):** the triga corpus demos are
tela consumers, so Triga-side edits to them (import shape, `dom.*` member usage) can trip tela's
`proof/dom-export/probe.fab` symbol list and the examples' `faber.lock` tela pins. Coordination
cost is a grep, not a gate. If Triga's slice wants a browser home, the natural composition from
Tela's side is: `tela:dom` for canvas/event/facts binding, Triga for the draw code, tela's
View/mount out of the loop unless the demo wants tela-rendered overlay chrome — optional garnish,
not a dependency.

---

## 9. Not claimed / unverified

- No builds, checks, or gates were run (no-cargo constraint; tela's scripta gates unexecuted).
  All "proven" claims above are citations of recorded evidence, not re-verification.
- Whether the faber package resolver enforces the `0.1.0` (consumer dep/lock) vs `0.0.0`
  (`tela/faber.toml`) version disagreement — flagged in §3, not diagnosed.
- Whether radix's `async-ad-lowering` campaign (active, 2026-07-04) covers the specific TS
  `@ futura`-in-`fac`/`cape` handler lowering tela's §6 record names — the mapping is plausible
  but was not established.
- The recorded consumer census figures (19 distinct `dom.*` members, 228 `attr_set` sites) are the
  migration spec's 2026-08-12 numbers; spot-checks at HEAD agree but the counts were not re-run.
- `u2-verify-faber/` (stale detached snapshot flagged to Mind in the migration evidence) was not
  examined — outside this pass's scope.
