# Sourced by the TS-lane scripta. link_faber_runtime NAME RADIX SCRATCH
# installs the emitted code's "@faber/runtime" import into SCRATCH/node_modules
# as a symlink to radix's own TypeScript runtime package (radix/runtime/typescript,
# the authority; the public faber/ copy is stale). tsc and node then resolve the
# real package source, so the harness carries no hand-maintained type stub that
# can drift from it (a stub missed dup/valor/variant and the exact.store arity).
# FABER_RUNTIME_TS overrides the package directory.
link_faber_runtime() {
  local name="$1" radix="$2" scratch="$3"
  local pkg="${FABER_RUNTIME_TS:-$radix/runtime/typescript}"
  if [[ ! -f "$pkg/exact.ts" ]]; then
    echo "$name: missing faber runtime package at $pkg (set FABER_RUNTIME_TS)" >&2
    return 1
  fi
  pkg="$(cd "$pkg" && pwd)"
  mkdir -p "$scratch/node_modules/@faber"
  ln -s "$pkg" "$scratch/node_modules/@faber/runtime"
}
