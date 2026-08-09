/**
 * tela/runtime/canvas2d.ts — the tela-owned Canvas2D host runtime
 * (tela:canvas2d).
 *
 * SOURCE: faber-web/runtime/canvas2d.ts copied + adapted (web-surface-import
 * U3, web-import-u3-tela-canvas2d; DELIVERY.md §U3 + §5.2). The runtime
 * symbols (`webCanvas2d*`) are KEPT (the documented host-binding contract —
 * the bindings/ts.toml routes map tela:canvas2d.X → webCanvas2dX, and the
 * harness assemblies bind the CANVAS_NS const over these). The error
 * strings are adapted to the tela:canvas2d provider spelling. Mirrors
 * src/canvas2d.fab: every fn maps to one exported function, and every
 * route in bindings/ts.toml resolves to one of these symbols (verified by
 * tests/contract-test.ts). Canvas2DContext is a lightweight numeric handle
 * resolved through a module-level Map — the same lifecycle pattern as the
 * dom Subscription handle. The Path2D handle genus is a second module-level
 * Map<number, Path2D>; the handles are never explicitly disposed — contexts
 * and Path2D objects are browser-owned and the maps accumulate until page
 * unload (matches the dom.ts Subscription accumulation precedent).
 */

export type WebCanvas2dContext = { readonly id: number };
export type WebCanvas2dPath2D = { readonly id: number };

let nextContextId = 1;
const contexts = new Map<number, CanvasRenderingContext2D>();

let nextPath2DId = 1;
const path2ds = new Map<number, Path2D>();

export function webCanvas2dContext(element: Element): WebCanvas2dContext {
  const canvas = element as HTMLCanvasElement;
  if (typeof canvas.getContext !== "function") {
    throw new Error("tela:canvas2d context requires an HTMLCanvasElement");
  }
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error("tela:canvas2d failed to acquire a 2d context");
  }
  const id = nextContextId;
  nextContextId += 1;
  contexts.set(id, ctx);
  return { id };
}

export function webCanvas2dSave(ctx: WebCanvas2dContext): void {
  contextById(ctx).save();
}

export function webCanvas2dRestore(ctx: WebCanvas2dContext): void {
  contextById(ctx).restore();
}

export function webCanvas2dTranslate(ctx: WebCanvas2dContext, x: number, y: number): void {
  contextById(ctx).translate(x, y);
}

export function webCanvas2dRotate(ctx: WebCanvas2dContext, radians: number): void {
  contextById(ctx).rotate(radians);
}

export function webCanvas2dScale(ctx: WebCanvas2dContext, x: number, y: number): void {
  contextById(ctx).scale(x, y);
}

export function webCanvas2dSetTransform(
  ctx: WebCanvas2dContext,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): void {
  contextById(ctx).setTransform(a, b, c, d, e, f);
}

export function webCanvas2dClearRect(
  ctx: WebCanvas2dContext,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  contextById(ctx).clearRect(x, y, w, h);
}

export function webCanvas2dFillRect(
  ctx: WebCanvas2dContext,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  contextById(ctx).fillRect(x, y, w, h);
}

export function webCanvas2dStrokeRect(
  ctx: WebCanvas2dContext,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  contextById(ctx).strokeRect(x, y, w, h);
}

export function webCanvas2dSetFillStyle(ctx: WebCanvas2dContext, color: string): void {
  contextById(ctx).fillStyle = color;
}

export function webCanvas2dSetStrokeStyle(ctx: WebCanvas2dContext, color: string): void {
  contextById(ctx).strokeStyle = color;
}

export function webCanvas2dBeginPath(ctx: WebCanvas2dContext): void {
  contextById(ctx).beginPath();
}

export function webCanvas2dMoveTo(ctx: WebCanvas2dContext, x: number, y: number): void {
  contextById(ctx).moveTo(x, y);
}

export function webCanvas2dLineTo(ctx: WebCanvas2dContext, x: number, y: number): void {
  contextById(ctx).lineTo(x, y);
}

export function webCanvas2dClosePath(ctx: WebCanvas2dContext): void {
  contextById(ctx).closePath();
}

export function webCanvas2dArc(
  ctx: WebCanvas2dContext,
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): void {
  contextById(ctx).arc(x, y, radius, startAngle, endAngle);
}

export function webCanvas2dEllipse(
  ctx: WebCanvas2dContext,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
): void {
  contextById(ctx).ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
}

export function webCanvas2dFill(ctx: WebCanvas2dContext): void {
  contextById(ctx).fill();
}

export function webCanvas2dStroke(ctx: WebCanvas2dContext): void {
  contextById(ctx).stroke();
}

export function webCanvas2dClip(ctx: WebCanvas2dContext): void {
  contextById(ctx).clip();
}

export function webCanvas2dFillText(
  ctx: WebCanvas2dContext,
  text: string,
  x: number,
  y: number,
): void {
  contextById(ctx).fillText(text, x, y);
}

export function webCanvas2dSetFont(ctx: WebCanvas2dContext, font: string): void {
  contextById(ctx).font = font;
}

export function webCanvas2dSetTextAlign(ctx: WebCanvas2dContext, align: string): void {
  contextById(ctx).textAlign = align as CanvasTextAlign;
}

export function webCanvas2dSetTextBaseline(ctx: WebCanvas2dContext, baseline: string): void {
  contextById(ctx).textBaseline = baseline as CanvasTextBaseline;
}

export function webCanvas2dPath2DNew(): WebCanvas2dPath2D {
  const id = nextPath2DId;
  nextPath2DId += 1;
  path2ds.set(id, new Path2D());
  return { id };
}

export function webCanvas2dPath2DNewFromSvg(pathData: string): WebCanvas2dPath2D {
  const id = nextPath2DId;
  nextPath2DId += 1;
  path2ds.set(id, new Path2D(pathData));
  return { id };
}

export function webCanvas2dPath2DFill(ctx: WebCanvas2dContext, path: WebCanvas2dPath2D): void {
  contextById(ctx).fill(pathById(path));
}

export function webCanvas2dPath2DStroke(ctx: WebCanvas2dContext, path: WebCanvas2dPath2D): void {
  contextById(ctx).stroke(pathById(path));
}

function contextById(handle: WebCanvas2dContext): CanvasRenderingContext2D {
  const ctx = contexts.get(handle.id);
  if (ctx === undefined) {
    throw new Error(`tela:canvas2d unknown context handle id ${handle.id}`);
  }
  return ctx;
}

function pathById(handle: WebCanvas2dPath2D): Path2D {
  const path = path2ds.get(handle.id);
  if (path === undefined) {
    throw new Error(`tela:canvas2d unknown Path2D handle id ${handle.id}`);
  }
  return path;
}
