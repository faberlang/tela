#!/bin/bash
# Build the Vox app into dist/: the page, its modules and the audio worklet.
#
#   ./build.sh [path-to-faber]        (default: faber on PATH)
#
# After `faber build`, the compiled @faber/runtime is copied to dist/runtime:
# the product's page modules import the bare name "@faber/runtime", which the
# page's import map points there (gap 26). The compiled runtime is the one the
# build itself made for the worklet, found through the dist/node_modules link.
set -euo pipefail
cd "$(dirname "$0")"
FABER="${1:-faber}"
export PATH="/opt/homebrew/bin:$PATH"

# The product refuses stale files in dist/, and last build's runtime copy is one.
if [ -e dist/runtime ]; then trash dist/runtime; fi

"$FABER" build .

link="$(readlink dist/node_modules/@faber/runtime)"
compiled="$(dirname "$(dirname "$link")")"
compiled="${compiled/faber-runtime/faber-ts-runtime}"
test -f "$compiled/index.js" || { echo "compiled runtime not found at $compiled" >&2; exit 1; }

mkdir -p dist/runtime
cp -R "$compiled"/. dist/runtime/
echo "built dist/ (runtime from $compiled)"
