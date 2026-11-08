#!/usr/bin/env bash
# bench.sh: realtime factor of the voice engine through the worklet entry,
# natively (Rust, release) and under Node from the ts build.
#
#   tools/bench-realtime/bench.sh            native + node
#   JIT=1 tools/bench-realtime/bench.sh      also the faber run JIT route (slow in a debug faber)
#
# Needs: a faber binary ($FABER, default the radix debug build), cargo and rustc
# for the native leg, tsc and node for the ts leg. Python 3 only supplies a
# stopwatch. Realtime factor = audio seconds / best-of-3 wall seconds of the
# whole process (startup included; the bench renders 20 s so startup is small).
# The ts leg is timed from outside because norma:time has no clock on ts (gap 05).
set -euo pipefail

FABER="${FABER:-/Users/ianzepp/work/faberlang/radix/target/debug/faber}"
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${OUT:-$(mktemp -d)}"
export PATH="/opt/homebrew/bin:$PATH"

SECONDS_OF_AUDIO="$(awk '/^const int SECONDS/ {print $NF}' "$HERE/src/main.fab")"

best_of_3() {
  python3 - "$@" <<'PY'
import subprocess, sys, time
best = None
out = ""
for _ in range(3):
    t = time.perf_counter()
    r = subprocess.run(sys.argv[1:], capture_output=True, text=True, check=True)
    dt = time.perf_counter() - t
    out = r.stdout.strip()
    best = dt if best is None else min(best, dt)
print(f"{best:.4f}\t{out}")
PY
}

report() {
  local label="$1" result="$2"
  local wall="${result%%$'\t'*}" detail="${result#*$'\t'}"
  python3 - "$label" "$wall" "$SECONDS_OF_AUDIO" "$detail" <<'PY'
import sys
label, wall, audio, detail = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
print(f"{label:<22} {audio:.0f} s of audio in {wall:.3f} s  ->  {audio / wall:7.1f}x realtime   [{detail}]")
PY
}

echo "audio per run: ${SECONDS_OF_AUDIO} s, 44.1 kHz, 128-frame blocks, telemetry every 1024 frames"

build() {
  local label="$1"; shift
  "$FABER" build "$@" >/dev/null 2>"$OUT/build-$label.log" || { cat "$OUT/build-$label.log" >&2; exit 1; }
}

build rust -t rust --release -o "$OUT/rust" "$HERE"
report "native (rust release)" "$(best_of_3 "$OUT/rust/vox-bench-realtime")"

build ts -t ts "$HERE"
report "node (ts build)" "$(best_of_3 node "$HERE/target/faber/ts/bin/vox-bench-realtime.js")"

if [ "${JIT:-0}" = "1" ]; then
  report "faber run (clif-jit)" "$(best_of_3 "$FABER" run -t clif-jit "$HERE")"
fi
