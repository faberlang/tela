# Sourced by the TS-lane scripta that assemble the emitted modules as an
# import-based module graph (check-exempla's design, shared). Requires ROOT,
# FABER_BIN, FABER_LIBRARY_HOME and SCRATCH to be set by the caller.
#
# The radix TS emit is an import-based module graph: modules carry
# `import * as <ns> from "./<provider>-<module>.js"` specifiers,
# namespace-qualified type positions (tela.Theme) and namespace constructors,
# and declare their top-level bindings WITHOUT export statements. emit_module
# places a module at its specifier path and appends the export surface
# collected from its column-0 declarations, so tsc and node resolve the graph
# natively.

# Intrinsic-augmentation interfaces bridge the runtime-contract method surface
# onto the JS built-ins; they augment the global scope and are never exports.
INTRINSICS='Number|String|Boolean|Object|Array|Function|Symbol'

# The emitter's `est` variant check probes `value.__faberValorTag` on the
# value's STATIC type; strict TS rejects the access. A compile-time cast only.
seam_normalize() {
  perl -pi -e 's/value\.__faberValorTag/(value as { __faberValorTag?: unknown }).__faberValorTag/g' "$1"
}

# A declaration the emitter sanitized with a trailing underscore (`order` is a
# runtime namespace word, so the fn is declared `order_`) is exported under its
# source name: qualified uses (`tela.order(...)`) are spelled with the source
# name.
emit_module() { # <fab path> <specifier file name>
  "$FABER_BIN" emit --library-home "$FABER_LIBRARY_HOME" -t ts --locale en "$1" -o "$SCRATCH/$2" >/dev/null
  perl -0pi -e "s/^interface ($INTRINSICS) \\{\n(.*?)^\\}\n/declare global {\ninterface \$1 {\n\$2}\n}\n/ms" "$SCRATCH/$2"
  seam_normalize "$SCRATCH/$2"
  local names
  names="$(grep -E '^(function|class|interface|type|const|let|var|enum) [A-Za-z_$]' "$SCRATCH/$2" \
    | sed -E 's/^(function|class|interface|type|const|let|var|enum) ([A-Za-z_$][A-Za-z0-9_$]*).*/\2/' \
    | sort -u \
    | grep -vE "^($INTRINSICS)$" \
    | sed -E 's/^([A-Za-z0-9$]+)_$/\1_ as \1/' \
    | paste -sd, - \
    | sed 's/,/, /g')"
  if [[ -n "$names" ]]; then
    printf '\nexport { %s };\n' "$names" >> "$SCRATCH/$2"
  else
    printf '\nexport {};\n' >> "$SCRATCH/$2"
  fi
}

# The exported names of an emitted module as a comma list (for the import line
# of a driver appended to another module).
module_import_names() { # <specifier file name>
  grep -E '^export \{' "$SCRATCH/$1" | tail -1 | sed -E 's/^export \{ (.*) \};$/\1/'
}

# The tela:dom seam over tela's ACTUAL host runtime: the route mapping of
# bindings/ts.toml (tela:dom.snapshot -> webDomSnapshot, ...) re-exported from
# runtime/dom.ts, plus the bare provider types the browser module names
# (dom.Scope, dom.DomNode). The emitted provider module (src/dom.fab) is not
# assembled. The snapshot binding is widened at this boundary (the emitted
# Scope type carries only `selector`; the runtime scope also carries `root`).
write_dom_seam() {
  cp "$ROOT/runtime/dom.ts" "$SCRATCH/tela-dom-runtime.ts"
  cat > "$SCRATCH/tela-dom.ts" <<'DOM_SEAM'
import * as rt from "./tela-dom-runtime.js";

export class Scope {
    selector!: string;
}
export class DomNode {
    identity!: string;
    tag!: string;
}
export const scope = rt.webDomScope;
export const query = rt.webDomQuery;
export const require = rt.webDomRequire;
export const all = rt.webDomAll;
export const snapshot = (scope: any): Array<rt.WebDomNode> | null => rt.webDomSnapshot(scope);
export const text_set = rt.webDomTextSet;
export const attr_set = rt.webDomAttrSet;
export const attr_remove = rt.webDomAttrRemove;
export const class_add = rt.webDomClassAdd;
export const class_remove = rt.webDomClassRemove;
export const class_toggle = rt.webDomClassToggle;
export const on = rt.webDomOn;
export const unsubscribe = rt.webDomUnsubscribe;
export const value = rt.webDomValue;
export const value_set = rt.webDomValueSet;
export const on_input = rt.webDomOnInput;
export const on_submit = rt.webDomOnSubmit;
export const on_frame = rt.webDomOnFrame;
export const on_resize = rt.webDomOnResize;
export const on_keyboard = rt.webDomOnKeyboard;
export const on_pointer = rt.webDomOnPointer;
export const on_focus = rt.webDomOnFocus;
export const pointer_lock_state = rt.webDomPointerLockState;
export const request_pointer_lock = rt.webDomRequestPointerLock;
export const exit_pointer_lock = rt.webDomExitPointerLock;
export const on_pointer_lock = rt.webDomOnPointerLock;
export const prevent_default = rt.webDomPreventDefault;
export const fetch_text = rt.webDomFetchText;
DOM_SEAM
}

# The tela:dom seam over the AUTHORED fake DOM (check-mount): the route
# functions read the document the driver registers in `host`. Used where the
# gate exercises the mount seam against the harness itself rather than the
# host runtime.
write_harness_dom_seam() {
  cat > "$SCRATCH/tela-dom.ts" <<'DOM_SEAM'
import { web_dom_scope, web_dom_snapshot, web_dom_query, web_dom_require, web_dom_all, web_dom_value } from "./tela-harness-dom.js";
import type { FakeDocument, FakeNodus } from "./tela-harness-dom.js";

export class Scope {
    selector!: string;
}
export class DomNode {
    identity!: string;
    tag!: string;
}
// The driver installs the fake document here before any mount runs.
export const host: { doc: FakeDocument | null } = { doc: null };
// `scope` is the one-arg seam shape the emitted mount fns call; `snapshot` is
// widened at the harness boundary (the emitted Scope type carries only
// `selector`).
export const scope = (selector: string): any => web_dom_scope(host.doc!, selector);
export const snapshot = (scope: any): Array<FakeNodus> | null => web_dom_snapshot(scope);
export const query = web_dom_query;
export const require = web_dom_require;
export const all = web_dom_all;
export const value = web_dom_value;
DOM_SEAM
}
