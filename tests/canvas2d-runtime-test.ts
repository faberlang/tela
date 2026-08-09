/**
 * tela/tests/canvas2d-runtime-test.ts — the COMMITTED canvas2d runtime
 * execution smoke (tela:canvas2d, web-surface-import U3).
 *
 * CLOSES THE GAP (P2, auditor-2 fire-19, non-blocking): the U3 delivery
 * done_when (c) scoped the draw/Path2D execution smoke in an ephemeral
 * /tmp scratch assembly (honest — not a hidden overclaim), so draw-
 * sequence runtime behavior was NOT reproducible from the committed tree.
 * This committed test is the node route-resolution regression: it imports
 * the tela:canvas2d routes via the runtime (`webCanvas2d*` — the symbols
 * the bindings/ts.toml routes map to) and asserts EXIT-0 EXECUTION of a
 * representative draw sequence through them.
 *
 * The route bijection itself (every fn ↔ route ↔ runtime symbol) is
 * already proven mechanically by tests/contract-test.ts (57 routes across
 * tela:dom + tela:canvas2d, the `webCanvas2d*` retention — U3 done_when
 * (d)). This test closes the EXECUTION-smoke gap only.
 *
 * Thin-shim posture (the delivery's accepted bar): browser pixel-readback
 * stays OUT of scope — node route-resolution + call routing is the bar.
 * The fake 2d context + Path2D are hand-rolled (no npm dependencies, the
 * dom-runtime-test precedent): the runtime resolves the numeric handles
 * through its module-level Maps, so the fakes only need to (a) accept the
 * `getContext` acquisition and (b) RECORD the draw calls the routes
 * dispatch. The error surface (non-canvas element / null context /
 * unknown handles) is asserted too.
 *
 * Run mechanics (faber-web's, same as dom-runtime-test): from the tela
 * repo root —
 *   tsc --strict --module CommonJS --outDir <scratch> tests/canvas2d-runtime-test.ts
 * then `node <scratch>/tests/canvas2d-runtime-test.js`. No npm deps.
 */

import {
  webCanvas2dArc,
  webCanvas2dBeginPath,
  webCanvas2dClearRect,
  webCanvas2dClip,
  webCanvas2dClosePath,
  webCanvas2dContext,
  webCanvas2dEllipse,
  webCanvas2dFill,
  webCanvas2dFillRect,
  webCanvas2dFillText,
  webCanvas2dLineTo,
  webCanvas2dMoveTo,
  webCanvas2dPath2DFill,
  webCanvas2dPath2DNew,
  webCanvas2dPath2DNewFromSvg,
  webCanvas2dPath2DStroke,
  webCanvas2dRestore,
  webCanvas2dRotate,
  webCanvas2dSave,
  webCanvas2dScale,
  webCanvas2dSetFillStyle,
  webCanvas2dSetFont,
  webCanvas2dSetStrokeStyle,
  webCanvas2dSetTextAlign,
  webCanvas2dSetTextBaseline,
  webCanvas2dSetTransform,
  webCanvas2dStroke,
  webCanvas2dStrokeRect,
  webCanvas2dTranslate,
} from "../runtime/canvas2d";

// ---- hand-rolled fakes (no npm deps — the dom-runtime-test precedent) ---
// The runtime resolves the numeric context/Path2D handles through its
// module-level Maps to a live CanvasRenderingContext2D / Path2D. In Node
// those are absent, so the fake context RECORDS the draw calls the routes
// dispatch (the call sequence IS the execution proof), and the fake
// Path2D carries the optional SVG path-data string.

class FakeCanvasRenderingContext2D {
  readonly calls: string[] = [];
  // The writable style/font surface the setter routes assign.
  fillStyle = "";
  strokeStyle = "";
  font = "";
  textAlign: CanvasTextAlign = "start";
  textBaseline: CanvasTextBaseline = "alphabetic";

  save(): void {
    this.calls.push("save");
  }
  restore(): void {
    this.calls.push("restore");
  }
  translate(x: number, y: number): void {
    this.calls.push(`translate(${x},${y})`);
  }
  rotate(radians: number): void {
    this.calls.push(`rotate(${radians})`);
  }
  scale(x: number, y: number): void {
    this.calls.push(`scale(${x},${y})`);
  }
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this.calls.push(`setTransform(${a},${b},${c},${d},${e},${f})`);
  }
  clearRect(x: number, y: number, w: number, h: number): void {
    this.calls.push(`clearRect(${x},${y},${w},${h})`);
  }
  fillRect(x: number, y: number, w: number, h: number): void {
    this.calls.push(`fillRect(${x},${y},${w},${h})`);
  }
  strokeRect(x: number, y: number, w: number, h: number): void {
    this.calls.push(`strokeRect(${x},${y},${w},${h})`);
  }
  beginPath(): void {
    this.calls.push("beginPath");
  }
  moveTo(x: number, y: number): void {
    this.calls.push(`moveTo(${x},${y})`);
  }
  lineTo(x: number, y: number): void {
    this.calls.push(`lineTo(${x},${y})`);
  }
  closePath(): void {
    this.calls.push("closePath");
  }
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
    this.calls.push(`arc(${x},${y},${radius},${startAngle},${endAngle})`);
  }
  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
  ): void {
    this.calls.push(`ellipse(${x},${y},${radiusX},${radiusY},${rotation},${startAngle},${endAngle})`);
  }
  fill(path?: Path2D): void {
    if (path === undefined) {
      this.calls.push("fill");
      return;
    }
    const fake = path as unknown as FakePath2D;
    this.calls.push(`fill(path:${fake.data ?? ""})`);
  }
  stroke(path?: Path2D): void {
    if (path === undefined) {
      this.calls.push("stroke");
      return;
    }
    const fake = path as unknown as FakePath2D;
    this.calls.push(`stroke(path:${fake.data ?? ""})`);
  }
  clip(): void {
    this.calls.push("clip");
  }
  fillText(text: string, x: number, y: number): void {
    this.calls.push(`fillText(${text},${x},${y})`);
  }
}

class FakePath2D {
  readonly data: string | undefined;
  constructor(pathData?: string) {
    this.data = pathData;
  }
}

class FakeHTMLCanvasElement {
  readonly getContext: (kind: string) => FakeCanvasRenderingContext2D | null;
  constructor(ctx: FakeCanvasRenderingContext2D | null) {
    this.getContext = (kind: string): FakeCanvasRenderingContext2D | null => {
      if (kind !== "2d") {
        return null;
      }
      return ctx;
    };
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`canvas2d-runtime-test assert failed: ${message}`);
  }
}

function main(): void {
  // The Path2D genus: the runtime resolves its Path2D handles through
  // `new Path2D()` / `new Path2D(pathData)` — install the fake on the
  // global so the bare constructor references route to it.
  (globalThis as { Path2D: typeof Path2D }).Path2D = FakePath2D as unknown as typeof Path2D;

  // --- context acquisition ------------------------------------------------
  const fakeCtx = new FakeCanvasRenderingContext2D();
  const canvas = new FakeHTMLCanvasElement(fakeCtx);
  const ctx = webCanvas2dContext(canvas as unknown as Element);
  assert(typeof ctx.id === "number" && ctx.id >= 1, "context acquisition returns a numeric handle");

  // --- the representative draw sequence (the U3 smoke shape) ------------
  // A save/restore frame, the transform stack, rect drawing, a path, text,
  // and the Path2D genus — every route in bindings/ts.toml's
  // tela:canvas2d section executes once.
  webCanvas2dSave(ctx);
  webCanvas2dSetFillStyle(ctx, "#2563eb");
  webCanvas2dFillRect(ctx, 0, 0, 100, 80);
  webCanvas2dSetStrokeStyle(ctx, "#111827");
  webCanvas2dStrokeRect(ctx, 4, 4, 92, 72);
  webCanvas2dTranslate(ctx, 8, 8);
  webCanvas2dRotate(ctx, 0.5);
  webCanvas2dScale(ctx, 2, 2);
  webCanvas2dSetTransform(ctx, 1, 0, 0, 1, 0, 0);
  webCanvas2dClearRect(ctx, 0, 0, 200, 200);
  webCanvas2dBeginPath(ctx);
  webCanvas2dMoveTo(ctx, 10, 10);
  webCanvas2dLineTo(ctx, 90, 10);
  webCanvas2dArc(ctx, 50, 50, 40, 0, 6.28318);
  webCanvas2dEllipse(ctx, 30, 30, 10, 5, 0, 0, 6.28318);
  webCanvas2dClosePath(ctx);
  webCanvas2dStroke(ctx);
  webCanvas2dFill(ctx);
  webCanvas2dClip(ctx);
  webCanvas2dSetFont(ctx, "12px sans-serif");
  webCanvas2dSetTextAlign(ctx, "center");
  webCanvas2dSetTextBaseline(ctx, "middle");
  webCanvas2dFillText(ctx, "tela", 50, 50);
  webCanvas2dRestore(ctx);

  // --- the Path2D genus routes -------------------------------------------
  const path = webCanvas2dPath2DNew();
  const svgPath = webCanvas2dPath2DNewFromSvg("M0 0L100 100");
  assert(typeof path.id === "number" && typeof svgPath.id === "number", "Path2D handles resolve");
  webCanvas2dPath2DFill(ctx, path);
  webCanvas2dPath2DStroke(ctx, svgPath);

  // --- the execution proof: every draw call routed + the order held -----
  // 19 draw-route method calls + 2 Path2D fill/stroke calls = 21 recorded
  // ops. The 5 setter routes (fillStyle/strokeStyle/font/textAlign/
  // textBaseline) are property WRITES — asserted separately below.
  assert(fakeCtx.calls.length === 21, `all 21 draw-route method calls executed (got ${fakeCtx.calls.length})`);
  const expected: string[] = [
    "save",
    "fillRect(0,0,100,80)",
    "strokeRect(4,4,92,72)",
    "translate(8,8)",
    "rotate(0.5)",
    "scale(2,2)",
    "setTransform(1,0,0,1,0,0)",
    "clearRect(0,0,200,200)",
    "beginPath",
    "moveTo(10,10)",
    "lineTo(90,10)",
    "arc(50,50,40,0,6.28318)",
    "ellipse(30,30,10,5,0,0,6.28318)",
    "closePath",
    "stroke",
    "fill",
    "clip",
    "fillText(tela,50,50)",
    "restore",
    "fill(path:)",
    "stroke(path:M0 0L100 100)",
  ];
  for (let i = 0; i < expected.length; i += 1) {
    assert(fakeCtx.calls[i] === expected[i], `draw call ${i} is ${expected[i]} (got ${fakeCtx.calls[i]})`);
  }
  assert(fakeCtx.fillStyle === "#2563eb", "the fill-style route writes the property");
  assert(fakeCtx.strokeStyle === "#111827", "the stroke-style route writes the property");
  assert(fakeCtx.font === "12px sans-serif", "the font route writes the property");
  assert(fakeCtx.textAlign === "center", "the text-align route writes the property");
  assert(fakeCtx.textBaseline === "middle", "the text-baseline route writes the property");

  // --- the documented error surface (the thin-shim boundary) ------------
  let threw = false;
  try {
    webCanvas2dContext({} as unknown as Element);
  } catch (e) {
    threw = (e as Error).message.includes("requires an HTMLCanvasElement");
  }
  assert(threw, "a non-canvas element is rejected");
  threw = false;
  try {
    webCanvas2dContext(new FakeHTMLCanvasElement(null) as unknown as Element);
  } catch (e) {
    threw = (e as Error).message.includes("failed to acquire a 2d context");
  }
  assert(threw, "a null 2d context is rejected");
  threw = false;
  try {
    webCanvas2dFillRect({ id: 9999 }, 0, 0, 1, 1);
  } catch (e) {
    threw = (e as Error).message.includes("unknown context handle id");
  }
  assert(threw, "an unknown context handle is rejected");
  threw = false;
  try {
    webCanvas2dPath2DFill(ctx, { id: 9999 });
  } catch (e) {
    threw = (e as Error).message.includes("unknown Path2D handle id");
  }
  assert(threw, "an unknown Path2D handle is rejected");

  console.log("canvas2d-runtime-test: green (node route-resolution — the full draw/Path2D sequence executes; web-surface-import U3)");
}

void main();
