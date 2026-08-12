# Web→tela Consumer Migration U6 — Evidence Record (retirement sweep + faber-web banner + residual record)

**Status**: active (evidence for `web-mig-u6-retirement-sweep` — the official
closeout of the faber-web retirement condition)
**Unit spec**: `tela/docs/factory/web-to-tela-consumer-migration/DELIVERY.md`
§U6 (depends on U5 — examples batch `7073a01`; U1 tela `50d5d9e`; U3/U4
corpus merged)
**Hand**: hand-1. **Date**: 2026-08-12. **Branch**: examples/tela/faber-web
`factory/hand-1`.

## Verdict

**RETIREMENT CONDITION MET — zero live `web:` consumers.** The bounded sweep
(§1) returns **zero** live `import from "web:"` / `importa ex "web:"` matches
in consumer source across the 11 packages (5 triga corpus + 6 examples).
faber-web reaches the retirement condition: no live consumer keeps it alive.
It remains **frozen** (no new features, critical fixes only) and on disk —
the faber `web:` test fixtures (`package_test.rs`,
`web2_build_integration_test.rs`) pin the `web:` provider path, and actual
**archival is a future goal** (§3). The banner table's `WebController` row
now names `tela:web` (§2). `git diff --check` clean.

---

## 1. The sweep — exact command + zero-live proof

Sweep definition (per DELIVERY §5.1 / §U6 done_when a): consumer source =
the 11 packages; the sweep excludes `worktrees/`, `docs/`, faber-web's own
`src/`, `u2-verify-faber/`, and `*.rs` test fixtures.

Exact command (run from the workspace root `/Users/ianzepp/work/faberlang`,
local main checkouts of triga + examples; package paths enumerate the 11
consumer packages; `--glob '!docs/**' --glob '!*.rs'` encode the sweep's
`docs/` + `*.rs` exclusions; `worktrees/`, faber-web `src/`, and
`u2-verify-faber/` are excluded by not being enumerated):

```sh
rg -n 'import (from|a ex) "web:' \
  triga/corpus/webgl-geometry-terrain triga/corpus/webgl-animation-terrain \
  triga/corpus/webgl-animation-water triga/corpus/webgl-animation-orbit \
  triga/corpus/webgl-geometries \
  examples/triga-drift-city examples/triga-budapest examples/browser-app \
  examples/hello-voxel examples/canvas2d-interactive examples/web-canvas2d-smoke \
  --glob '!docs/**' --glob '!*.rs'
```

**Result: zero matches** (rg exit 1 = no matches; no stdout). Verified
against both the workspace main checkouts and the hand-1 packet copies of
the 11 packages (2026-08-12). The pattern form is exercised (not vacuous):
the same command with `"tela:` returns live matches in the same packages
(e.g. `importa ex "tela:web" privata web` in
`examples/hello-voxel/src/main.fab:45`, `import from "tela:web" private web`
in `triga/corpus/webgl-animation-terrain/src/main.fab:4`).

### What remains (all out of the live-consumer definition)

| Where | Kind | Status |
| --- | --- | --- |
| `faber-web/src/canvas2d.fab:20` (`importa ex "web:dom"`) | provider's own intra-package import | frozen; archives with faber-web (excluded: faber-web's own `src/`) |
| `faber/src/package_test.rs` (~25 fixtures) | faber packaging tests pinning the `web:` provider path | stays green; keeps faber-web on disk (§3) |
| `faber/tests/web2_build_integration_test.rs:90-91` | faber build-integration test | stays green; pins `web:` resolution (§3) |
| `examples/hello-voxel/dist/` (tracked) | committed generated ESM/TS with `web:` bare specifiers in `faber-esm/main.js`, `faber-ts/{main.ts,faber-web.d.ts}` + `web-*` stems | build-regenerated output; regen pending the emit-blocker cluster (§3) |
| `u2-verify-faber/` | stale detached snapshot repo (Aug 9), outside the workspace layout | **flagged to Mind** (not swept; not cleaned up) |

No other `web:` reference remains in the 11 packages' source/config/pages/
tests/harness files (grep-verified 2026-08-12).

---

## 2. faber-web banner table (docs-only precision, frozen repo)

`faber-web/README.md` (branch `factory/hand-1`), migration-table row:

| Former (`web:*`) | Replacement (`tela:*`) | Notes |
| --- | --- | --- |
| `web:web` (`WebController`) | `tela:web` | the browser-app packaging entry contract re-homed to tela (web-to-tela U1 `50d5d9e`); faber-web stays frozen until the archival goal |

- The `WebController` row previously read `*(none — not folded)*` with a note
  naming frozen example consumers — superseded: U1 landed `tela:web` (tela
  `50d5d9e`, `tela/src/web.fab`), U3–U6 migrated all consumers.
- `Mount`/`mount` → `tela:browser.mount` row unchanged (already accurate).
- Freeze caveat recorded in the banner: all `web:*` consumers have migrated
  to `tela:*` (web-to-tela U3–U6, 2026-08-12); the package **stays frozen**
  until the archival goal.
- Residual bullets refreshed to match (WebController re-homed; consumer
  migration complete). No product/source/runtime edits — the frozen repo is
  untouched except this docs-only banner-table precision (WSI U5 precedent).

---

## 3. Residuals (recorded, per DELIVERY §11 Q3/Q4 + §U6 done_when c)

1. **faber `web:` test fixtures keep faber-web on disk.** `package_test.rs`
   and `web2_build_integration_test.rs` pin `web:` provider resolution;
   faber-web stays on disk as a **pinned test dependency until the archival
   goal**. No faber test-fixture rewrites in this campaign (Q3 default).
2. **Tracked `dist/` is build-regenerated.** `examples/hello-voxel/dist/` is
   the only tracked dist among the 11 consumers; it still carries `web:`
   bare-specifier content because regeneration is blocked by the
   emit-blocker cluster (below). It is generated build output — never
   hand-edited; regen lands with the blockers, not by manual edit.
3. **`u2-verify-faber/` flagged to Mind.** A stale detached snapshot repo
   (Aug 9) with `web:` fixtures, outside the workspace layout; excluded from
   the sweep; no cleanup performed (Q4 default — report only).
4. **Emit-blocker cluster = the gate to full example/corpus builds**
   (need 79439687, filed 2026-08-12): (1) tela `src/{browser,reference}.fab`
   use la `ut` under en pack authority; (2) `tela-web.ts` not produced in
   product staging; (3) faber `STEM_TYPE_ALIASES` hardcodes
   `Canvas2dContext` vs the `Canvas2DContext` surface; (4)
   `tela/runtime/dom.ts` `SubmitOptions` type-only → value export; (5)
   product build hangs after staging. Full gates + dist regen go green only
   after these land.

**Non-goals honored**: no faber-web archival (future goal); no deletion of
faber-web source/runtime/tests; no faber test-fixture rewrites; no
`u2-verify-faber` cleanup; no `docs/` archaeology.

---

## 4. Validation (closeout, one run)

- The §1 sweep command returns zero live matches (2026-08-12).
- `git diff --check` clean in both commit surfaces.
