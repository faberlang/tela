// tela/scripta/dom-shim.ts — the node host simulation for the Stage 3
// mount/update runtime gate (tela-s3-u2-browser-mount + tela-s4-u6).
//
// Implements the `webDom*` runtime-binding surface (mirroring
// faber-web/runtime/dom.ts) over a minimal in-memory DOM, plus a bounded
// HTML parser for the tela serializer's output shape and the mount-proof
// driver (`executeMountProof`). WEB5 precedent:
// examples/browser-app/tests/fake-dom.mjs + runtime-bridge.mjs.
//
// Stage 4 U6 (the seam restoration): this is the fake-DOM NODE HOST ENV for
// the REAL provider route — browser.fab consumes the real web:dom seam
// (dom.Scope + dom.snapshot), and the assembled runner binds this shim's
// webDom* symbols exactly as the real host binds faber-web's. The shim
// adds the typed hydration snapshot read (`webDomSnapshot`, mirroring the
// faber-web op 0d79f5b) + the bare Scope/Nodus types the emitted module
// references. web:dom is NEVER re-authored inside tela — this shim is the
// harness's node-side DOM, keyed by the same webDom* symbols the faber-web
// runtime exports.
//
// Bounded fidelity (recorded): the fake DOM supports the selector, event,
// class, attribute, text, focus, and subscription operations the Stage 3
// proofs exercise; assertions run at the STATE level (selection/ARIA/
// subscription/focus/scroll intent), not real layout. The parser handles
// the serializer's markup shape (elements + single-quoted attributes +
// `data-tela` identities + nested children + void elements); text/attr
// content embedding the exact marker string ` data-tela='` is out of the
// proof corpus (recorded in browser.fab).
//
// The driver is SYNCHRONOUS-ONLY: no `@ futura`, no fetch (the TS async
// gap — routed, not claimed; `webDomFetchText` is deliberately absent).

// ---------------------------------------------------------------------------
// Minimal fake DOM.
// ---------------------------------------------------------------------------

export class FakeClassList {
  private readonly classes = new Set<string>();
  add(cls: string): void {
    this.classes.add(cls);
  }
  remove(cls: string): void {
    this.classes.delete(cls);
  }
  toggle(cls: string): boolean {
    if (this.classes.has(cls)) {
      this.classes.delete(cls);
      return false;
    }
    this.classes.add(cls);
    return true;
  }
  has(cls: string): boolean {
    return this.classes.has(cls);
  }
  classNames(): string[] {
    return Array.from(this.classes);
  }
}

export class FakeEvent {
  readonly type: string;
  defaultPrevented = false;
  constructor(type: string, fields: Record<string, unknown> = {}) {
    this.type = type;
    Object.assign(this, fields);
  }
  preventDefault(): void {
    this.defaultPrevented = true;
  }
}

type FakeListener = (event: FakeEvent) => void;

export class FakeElement {
  children: FakeElement[] = [];
  parent: FakeElement | null = null;
  tagName: string;
  value = "";
  classList = new FakeClassList();
  /** The parsed data-tela identity ("" when the node carries none). */
  dataTela = "";
  /** Hydration stamp: "original" when the node was bound (not recreated). */
  token = "";
  private readonly attributes = new Map<string, string>();
  private readonly listeners = new Map<string, Set<FakeListener>>();
  private ownText = "";

  constructor(tagName: string) {
    this.tagName = tagName;
  }

  /** Real-DOM semantics: an element's textContent is the concatenated text
   * of its subtree; a #text node's is its own text. Setting it replaces the
   * children (webDomTextSet behaviour). */
  get textContent(): string {
    if (this.tagName === "#text") {
      return this.ownText;
    }
    let accum = this.ownText;
    for (const child of this.children) {
      accum += child.textContent;
    }
    return accum;
  }
  set textContent(value: string) {
    this.ownText = value;
    if (this.tagName !== "#text") {
      this.children = [];
    }
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }
  setAttribute(name: string, value: string): void {
    this.attributes.set(name, String(value));
  }
  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
  hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }
  /** Serialized attribute shape (insertion order) — the open-tag compare. */
  attributeShape(): string {
    const parts: string[] = [];
    for (const [name, value] of this.attributes) {
      parts.push(` ${name}='${value}'`);
    }
    return parts.join("");
  }
  attributeEntries(): Array<[string, string]> {
    return Array.from(this.attributes.entries());
  }

  matches(selector: string): boolean {
    if (selector === "[data-tela]") {
      return this.dataTela !== "";
    }
    if (selector.startsWith("#")) {
      return this.getAttribute("id") === selector.slice(1);
    }
    if (selector.startsWith(".")) {
      return this.classList.has(selector.slice(1));
    }
    const attrMatch = /^\[([\w-]+)=['"]?([\w-]*)['"]?\]$/.exec(selector);
    if (attrMatch) {
      return this.getAttribute(attrMatch[1]) === attrMatch[2];
    }
    return this.tagName === selector;
  }

  querySelector(selector: string): FakeElement | null {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector: string): FakeElement[] {
    const out: FakeElement[] = [];
    const walk = (el: FakeElement): void => {
      for (const child of el.children) {
        if (child.matches(selector)) {
          out.push(child);
        }
        walk(child);
      }
    };
    walk(this);
    return out;
  }

  appendChild(child: FakeElement): FakeElement {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  remove(): void {
    if (this.parent !== null) {
      const idx = this.parent.children.indexOf(this);
      if (idx !== -1) {
        this.parent.children.splice(idx, 1);
      }
      this.parent = null;
    }
  }

  addEventListener(type: string, handler: FakeListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);
  }

  removeEventListener(type: string, handler: FakeListener): void {
    this.listeners.get(type)?.delete(handler);
  }

  dispatchEvent(event: FakeEvent): boolean {
    for (const handler of this.listeners.get(event.type) ?? []) {
      handler(event);
    }
    return !event.defaultPrevented;
  }
}

/** The fake document: a root element + body, plus focus tracking. */
export class FakeDocument extends FakeElement {
  /** The element currently holding DOM focus (null when unfocused). */
  activeElement: FakeElement | null = null;
  /** The body element under the document root. */
  body: FakeElement;
  private readonly focused = true;

  constructor() {
    super("#document");
    this.body = new FakeElement("body");
    this.appendChild(this.body);
  }
  hasFocus(): boolean {
    return this.focused;
  }
  focusNode(node: FakeElement | null): void {
    this.activeElement = node;
  }
}

// ---------------------------------------------------------------------------
// Bounded HTML parser for the tela serializer's markup shape.
// ---------------------------------------------------------------------------

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

function unescapeHtml(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function makeTextNode(text: string): FakeElement {
  const node = new FakeElement("#text");
  node.textContent = text;
  return node;
}

function parseElement(html: string, start: number): { node: FakeElement; next: number } | null {
  let j = start + 1;
  let name = "";
  while (j < html.length && !/[\s>]/.test(html[j])) {
    name += html[j];
    j += 1;
  }
  if (name.length === 0 || name.startsWith("/")) {
    return null;
  }
  const node = new FakeElement(name);
  while (j < html.length && html[j] !== ">") {
    if (/\s/.test(html[j])) {
      j += 1;
      continue;
    }
    let attrName = "";
    while (j < html.length && html[j] !== "=" && html[j] !== ">" && !/\s/.test(html[j])) {
      attrName += html[j];
      j += 1;
    }
    while (j < html.length && /\s/.test(html[j])) {
      j += 1;
    }
    if (html[j] === "=") {
      j += 1;
      while (j < html.length && /\s/.test(html[j])) {
        j += 1;
      }
      const quote = html[j];
      if (quote === "'" || quote === '"') {
        j += 1;
        let val = "";
        while (j < html.length && html[j] !== quote) {
          val += html[j];
          j += 1;
        }
        j += 1;
        node.setAttribute(attrName, unescapeHtml(val));
      } else {
        let val = "";
        while (j < html.length && !/\s/.test(html[j]) && html[j] !== ">") {
          val += html[j];
          j += 1;
        }
        node.setAttribute(attrName, unescapeHtml(val));
      }
    } else {
      node.setAttribute(attrName, "");
    }
  }
  if (j < html.length && html[j] === ">") {
    j += 1;
  }
  const dataTela = node.getAttribute("data-tela");
  if (dataTela !== null) {
    node.dataTela = dataTela;
  }
  if (VOID_TAGS.has(name)) {
    return { node, next: j };
  }
  while (j < html.length) {
    if (html[j] === "<" && html.slice(j, j + name.length + 3) === `</${name}>`) {
      j += name.length + 3;
      break;
    }
    if (html[j] === "<") {
      const child = parseElement(html, j);
      if (child !== null) {
        node.appendChild(child.node);
        j = child.next;
      } else {
        j += 1;
      }
    } else {
      const end = html.indexOf("<", j);
      const text = end === -1 ? html.slice(j) : html.slice(j, end);
      if (text.length > 0) {
        node.appendChild(makeTextNode(text));
      }
      j = end === -1 ? html.length : end;
    }
  }
  return { node, next: j };
}

/** Parse a serializer-shaped markup string into a list of top-level nodes. */
export function parseFragment(html: string): FakeElement[] {
  const nodes: FakeElement[] = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === "<") {
      const parsed = parseElement(html, i);
      if (parsed !== null) {
        nodes.push(parsed.node);
        i = parsed.next;
      } else {
        i += 1;
      }
    } else {
      const end = html.indexOf("<", i);
      const text = end === -1 ? html.slice(i) : html.slice(i, end);
      if (text.length > 0) {
        nodes.push(makeTextNode(text));
      }
      i = end === -1 ? html.length : end;
    }
  }
  return nodes;
}

// ---------------------------------------------------------------------------
// The webDom* runtime-binding surface (mirrors faber-web/runtime/dom.ts;
// operates against the installed fake document).
// ---------------------------------------------------------------------------

export type WebDomScope = { root: FakeElement; selector: string };
type WebDomHandler = (event: FakeEvent) => void;
export type WebDomSubscription = { id: number; dispose: () => void };

let nextSubscriptionId = 1;
const activeSubscriptions = new Map<number, () => void>();

function installedDocument(): FakeDocument {
  const doc = (globalThis as unknown as { document?: FakeDocument }).document;
  if (doc === undefined) {
    throw new Error("dom-shim: no fake document installed; call installFakeDom() first");
  }
  return doc;
}

function scopedRequire(root: FakeElement, selector: string): FakeElement {
  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`dom-shim: required selector not found: ${selector}`);
  }
  return element;
}

// Stage 4 U6 — the bare web:dom types the emitted tela:browser module
// references (the seam flip: browser.fab imports web:dom). The emitted
// web:dom module's own `class Element` collides with the DOM lib's
// `Element`, so the harness declares the two types tela actually uses
// (Scope + Nodus — constructible, matching the emitted shape) instead of
// assembling the emitted provider module. webDomScope's return (which also
// carries `root`) is structurally assignable to Scope.
class Scope {
  selector!: string;
}
class Nodus {
  identitas!: string;
  tag!: string;
}

export function webDomScope(selector: string, root: FakeElement = installedDocument()): WebDomScope {
  const scopedRoot = selector.length === 0 ? root : scopedRequire(root, selector);
  return { root: scopedRoot, selector };
}

export function webDomQuery(scope: WebDomScope, selector: string): FakeElement | null {
  return scope.root.querySelector(selector);
}

export function webDomRequire(scope: WebDomScope, selector: string): FakeElement {
  return scopedRequire(scope.root, selector);
}

export function webDomAll(scope: WebDomScope, selector: string): FakeElement[] {
  return Array.from(scope.root.querySelectorAll(selector));
}

// Stage 4 U6 — the typed hydration snapshot read (mirrors faber-web's
// webDomSnapshot, faber-web 0d79f5b): one Nodus per data-tela descendant of
// the scoped root (identity + tag name). The mount planner reads the
// pre-existing hydration state through this op — a typed read, no textual
// DOM parse. Null only for a null scope (fail-closed).
export type WebDomNodus = { readonly identitas: string; readonly tag: string };
export function webDomSnapshot(scope: WebDomScope | null): WebDomNodus[] | null {
  if (scope === null) {
    return null;
  }
  return Array.from(scope.root.querySelectorAll("[data-tela]")).map((el) => ({
    identitas: el.getAttribute("data-tela") ?? "",
    tag: el.tagName.toLowerCase(),
  }));
}

export function webDomTextSet(element: FakeElement, value: string): void {
  element.textContent = value;
}

export function webDomAttrSet(element: FakeElement, name: string, value: string): void {
  element.setAttribute(name, value);
}

export function webDomAttrRemove(element: FakeElement, name: string): void {
  element.removeAttribute(name);
}

export function webDomClassAdd(element: FakeElement, className: string): void {
  element.classList.add(className);
}

export function webDomClassRemove(element: FakeElement, className: string): void {
  element.classList.remove(className);
}

export function webDomClassToggle(element: FakeElement, className: string): void {
  element.classList.toggle(className);
}

export function webDomOn(
  element: FakeElement,
  eventName: string,
  handler: WebDomHandler,
): WebDomSubscription {
  element.addEventListener(eventName, handler);
  return rememberSubscription(() => element.removeEventListener(eventName, handler));
}

export function webDomUnsubscribe(subscription: WebDomSubscription): void {
  const dispose = activeSubscriptions.get(subscription.id) ?? subscription.dispose;
  activeSubscriptions.delete(subscription.id);
  dispose();
}

export function webDomValue(element: FakeElement): string {
  return element.value;
}

export function webDomValueSet(element: FakeElement, value: string): void {
  element.value = value;
}

export function webDomOnInput(
  element: FakeElement,
  handler: (el: FakeElement, value: string) => void,
): WebDomSubscription {
  return webDomOn(element, "input", () => handler(element, webDomValue(element)));
}

export function webDomOnSubmit(
  form: FakeElement,
  options: { prevent_default?: boolean },
  handler: (form: FakeElement) => void,
): WebDomSubscription {
  return webDomOn(form, "submit", (event) => {
    if (options.prevent_default !== false) {
      event.preventDefault();
    }
    handler(form);
  });
}

export function webDomOnKeyboard(
  element: FakeElement,
  eventName: string,
  handler: (state: Record<string, unknown>) => void,
): WebDomSubscription {
  return webDomOn(element, eventName, (event) =>
    handler({
      kind: event.type,
      key: (event as unknown as Record<string, unknown>).key ?? "",
      code: (event as unknown as Record<string, unknown>).code ?? "",
      repeat: (event as unknown as Record<string, unknown>).repeat ?? false,
      alt: (event as unknown as Record<string, unknown>).altKey ?? false,
      ctrl: (event as unknown as Record<string, unknown>).ctrlKey ?? false,
      shift: (event as unknown as Record<string, unknown>).shiftKey ?? false,
      meta: (event as unknown as Record<string, unknown>).metaKey ?? false,
    }),
  );
}

export function webDomOnPointer(
  element: FakeElement,
  eventName: string,
  handler: (state: Record<string, unknown>) => void,
): WebDomSubscription {
  return webDomOn(element, eventName, (event) =>
    handler({
      kind: event.type,
      x: (event as unknown as Record<string, unknown>).clientX ?? 0,
      y: (event as unknown as Record<string, unknown>).clientY ?? 0,
      movement_x: (event as unknown as Record<string, unknown>).movementX ?? 0,
      movement_y: (event as unknown as Record<string, unknown>).movementY ?? 0,
      button: (event as unknown as Record<string, unknown>).button ?? 0,
      primary: (event as unknown as Record<string, unknown>).isPrimary ?? false,
    }),
  );
}

export function webDomOnFocus(
  element: FakeElement,
  eventName: string,
  handler: (state: { focused: boolean }) => void,
): WebDomSubscription {
  const emit = (): void => handler({ focused: installedDocument().hasFocus() });
  element.addEventListener(eventName, emit);
  emit();
  return rememberSubscription(() => element.removeEventListener(eventName, emit));
}

export function webDomPreventDefault(event: FakeEvent): FakeEvent {
  event.preventDefault();
  return event;
}

function rememberSubscription(dispose: () => void): WebDomSubscription {
  const id = nextSubscriptionId;
  nextSubscriptionId += 1;
  activeSubscriptions.set(id, dispose);
  return { id, dispose };
}

// ---------------------------------------------------------------------------
// Fake DOM installation + the region helper.
// ---------------------------------------------------------------------------

export function installFakeDom(): FakeDocument {
  const document = new FakeDocument();
  (globalThis as unknown as { document?: FakeDocument }).document = document;
  (globalThis as unknown as {
    window?: { addEventListener: () => void; removeEventListener: () => void };
  }).window = {
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };
  return document;
}

/** Build a region root for a selector (e.g. "#root") under the body. */
export function resolveRegion(document: FakeDocument, selector: string): FakeElement {
  const existing = document.querySelector(selector);
  if (existing !== null) {
    return existing;
  }
  const region = new FakeElement("div");
  region.setAttribute("id", selector.slice(1));
  document.body.appendChild(region);
  return region;
}

function cloneNode(node: FakeElement): FakeElement {
  const copy = new FakeElement(node.tagName);
  if (node.tagName === "#text") {
    copy.textContent = node.textContent;
    return copy;
  }
  copy.value = node.value;
  copy.dataTela = node.dataTela;
  for (const [name, value] of node.attributeEntries()) {
    copy.setAttribute(name, value);
  }
  for (const cls of node.classList.classNames()) {
    copy.classList.add(cls);
  }
  copy.token = node.token;
  for (const child of node.children) {
    copy.appendChild(cloneNode(child));
  }
  return copy;
}

/** Structural equality of the open-tag shape (tag + attributes + identity). */
function openTagEquals(a: FakeElement, b: FakeElement): boolean {
  if (a.tagName !== b.tagName) {
    return false;
  }
  if (a.tagName === "#text") {
    return a.textContent === b.textContent;
  }
  return a.attributeShape() === b.attributeShape() && a.dataTela === b.dataTela;
}

// ---------------------------------------------------------------------------
// The mount-plan executor + the mount proof driver.
// ---------------------------------------------------------------------------

export interface MountedLike {
  scope: { selector: string };
  root: { identity: string };
  markup: string;
  css_text: string;
  identities: string[];
  diagnostics: string[];
  bindings: Array<{ identity: string; status: string }>;
  subscriptions: Array<{ identity: string; event_name: string }>;
  focused_identity: string;
  target_identity: string;
}

export interface RenovatioLike {
  view: unknown;
  effects: unknown[];
}

export interface MountProofApi {
  // The api fn params are `any`-typed (bounded harness typing): the emitted
  // browser.fab functions carry concrete Scope/View/Theme types declared in
  // the assembled file, which this standalone module cannot import. The
  // RETURN types stay structural so the driver reads real plan fields.
  mount: (scope: any, view: any, theme: any) => MountedLike | null;
  replace: (mounted: any, view: any) => RenovatioLike | null;
  dispose: (mounted: any) => void;
  focus_held: (mounted: any, identity: string) => any;
  focus_target: (mounted: any, identity: string) => any;
  // Stage 4 U6: the scope is constructed through the REAL provider seam
  // (webDomScope — the dom-shim's web:dom runtime) — no tela-side `scope`
  // constructor exists anymore. The pre-existing hydration state is READ by
  // mount via webDomSnapshot; the driver plants the present DOM first.
  scope: (selector: string) => any;
  html_visus: (view: any) => string | null;
  effect_identity: (effects: any) => string;
  tree: () => any;
  extended_tree: () => any;
  duplicate_tree: () => any;
  theme: () => any;
  tree_markup: () => string;
  hydration_present: () => string;
  mismatch_present: () => string;
  duplicate_present: () => string;
  foreign_present: () => string;
}

/**
 * Execute a mount plan against the installed fake DOM. Node-level policy
 * follows the module's binding plan (bindings): "bind" identities bind to
 * the existing matching node (stamped "original" when `stamp` is set);
 * "create" identities are created/replaced from the View; extra or
 * duplicated identity nodes are removed.
 */
export function executeMountPlan(
  document: FakeDocument,
  selector: string,
  mounted: MountedLike,
  stamp = false,
): void {
  const root = resolveRegion(document, selector);
  const target = parseFragment(mounted.markup);
  const plan = new Map(mounted.bindings.map((l) => [l.identity, l.status]));
  syncRegion(root, target, plan, stamp);
}

function stampSubtree(node: FakeElement, token: string): void {
  if (node.dataTela !== "") {
    node.token = token;
  }
  for (const child of node.children) {
    stampSubtree(child, token);
  }
}

function syncRegion(
  parent: FakeElement,
  targetChildren: FakeElement[],
  plan: Map<string, string>,
  stamp: boolean,
): void {
  for (let k = 0; k < targetChildren.length; k += 1) {
    const t = targetChildren[k];
    const tId = t.dataTela;
    const match = tId !== "" ? parent.children.find((c) => c.dataTela === tId) ?? null
      : parent.children[k] ?? null;
    const status = tId !== "" ? (plan.get(tId) ?? "create") : "create";
    if (match !== null && status === "bind" && openTagEquals(match, t)) {
      if (stamp) {
        match.token = "original";
      }
      syncRegion(match, t.children, plan, stamp);
    } else {
      const fresh = cloneNode(t);
      if (match !== null) {
        const idx = parent.children.indexOf(match);
        match.remove();
        const at = Math.min(Math.max(idx, 0), parent.children.length);
        parent.children.splice(at, 0, fresh);
        fresh.parent = parent;
      } else {
        parent.appendChild(fresh);
      }
      if (stamp) {
        stampSubtree(fresh, "fresh");
      }
    }
  }
  // Remove leftover identity nodes: nodes whose identity is absent from the
  // target (foreign) and duplicate nodes beyond one per target identity
  // (the duplicate-identity policy — never a silent double-bind).
  const targetIdentitySet = new Set(
    targetChildren.filter((c) => c.dataTela !== "").map((c) => c.dataTela),
  );
  const counts = new Map<string, number>();
  for (const child of parent.children) {
    if (child.dataTela !== "") {
      counts.set(child.dataTela, (counts.get(child.dataTela) ?? 0) + 1);
    }
  }
  for (let k = parent.children.length - 1; k >= 0; k -= 1) {
    const child = parent.children[k];
    if (child.dataTela === "") {
      continue;
    }
    if (!targetIdentitySet.has(child.dataTela)) {
      child.remove();
    } else if ((counts.get(child.dataTela) ?? 0) > 1) {
      counts.set(child.dataTela, (counts.get(child.dataTela) ?? 0) - 1);
      child.remove();
    }
  }
}

/** Bind a webDom subscription per Mounted descriptor onto the identity node. */
export function bindRegionSubscriptions(
  document: FakeDocument,
  selector: string,
  mounted: MountedLike,
  handler: (event: FakeEvent) => void = () => undefined,
): WebDomSubscription[] {
  const root = resolveRegion(document, selector);
  return mounted.subscriptions.map((s) => {
    const node = root.querySelectorAll("[data-tela]").find((n) => n.dataTela === s.identity);
    if (node === undefined) {
      throw new Error(`dom-shim: subscription target missing: ${s.identity}`);
    }
    return webDomOn(node, s.event_name, handler);
  });
}

/**
 * The Stage 3 U2 mount proof: executes the real mount/replace/dispose
 * lifecycle (emitted from browser.fab via the api) against the fake DOM
 * and asserts every done_when (g) DOM-level outcome. Called by the
 * assembled runner after the Faber modules + consts are in scope.
 */
export function executeMountProof(api: MountProofApi): void {
  const document = installFakeDom();
  const assert = (cond: boolean, msg: string): void => {
    if (!cond) {
      throw new Error(`dom-shim assert failed: ${msg}`);
    }
  };

  const identityNodes = (): FakeElement[] => document.querySelectorAll("[data-tela]");
  const byIdentity = (id: string): FakeElement | undefined => identityNodes().find((n) => n.dataTela === id);
  // Each scenario owns a fresh region (sequential scenarios on one DOM).
  const resetRegion = (selector: string): FakeElement => {
    const region = resolveRegion(document, selector);
    region.children.splice(0, region.children.length);
    document.focusNode(null);
    return region;
  };
  // Stage 4 U6: the driver plants the pre-existing markup into the fake DOM
  // (the real provider route reads it via webDomSnapshot — the scope no
  // longer carries a textus_praesens field), then mount reads it.
  const preRenderRegion = (selector: string, markup: string): void => {
    const region = resetRegion(selector);
    for (const node of parseFragment(markup)) {
      region.appendChild(node);
    }
  };

  // --- scenario 1: mount onto an EMPTY scope ------------------------------
  {
    resetRegion("#root");
    const mounted = api.mount(api.scope("#root"), api.tree(), api.theme());
    assert(mounted !== null, "mount onto an empty scope returns a plan");
    const m = mounted as MountedLike;
    assert(m.markup === api.tree_markup(), "plan markup is the serialized View");
    assert(m.diagnostics.length === 0, "clean mount: no diagnostics");
    assert(m.bindings.every((l) => l.status === "create"), "clean mount: every identity creates");
    executeMountPlan(document, "#root", m, true);
    const ids = identityNodes();
    assert(ids.length === 3, "three identity nodes mounted");
    assert(byIdentity("tela-control")?.tagName === "div", "group node is a div");
    assert(byIdentity("tela-seg-1")?.textContent === "One", "seg-1 text mounted");
    assert(byIdentity("tela-seg-2")?.textContent === "Two", "seg-2 text mounted");
    assert(byIdentity("tela-seg-1")?.token === "fresh", "empty mount: nodes are fresh");
  }

  // --- scenario 2: hydration binds matching nodes (never recreated) ------
  {
    const present = api.hydration_present();
    preRenderRegion("#root", present);
    const mounted = api.mount(api.scope("#root"), api.tree(), api.theme());
    assert(mounted !== null, "hydration mount returns a plan");
    const m = mounted as MountedLike;
    assert(m.diagnostics.length === 0, "hydration: no diagnostics");
    assert(m.bindings.every((l) => l.status === "bind"), "hydration: every identity binds");
    executeMountPlan(document, "#root", m, true);
    const ids = identityNodes();
    assert(ids.length === 3, "hydration: three identity nodes present");
    assert(
      byIdentity("tela-control")?.token === "original" &&
        byIdentity("tela-seg-1")?.token === "original" &&
        byIdentity("tela-seg-2")?.token === "original",
      "hydration: matching nodes bound, not recreated",
    );
  }

  // --- scenario 3: mismatch → diagnose + replace (never a silent bind) ---
  {
    const present = api.mismatch_present();
    preRenderRegion("#root", present);
    const mounted = api.mount(api.scope("#root"), api.tree(), api.theme());
    assert(mounted !== null, "mismatch mount returns a plan");
    const m = mounted as MountedLike;
    assert(m.diagnostics.includes("changed:tela-seg-2"), "mismatch diagnosed");
    assert(m.bindings.find((l) => l.identity === "tela-seg-2")?.status === "create", "mismatch node re-creates");
    executeMountPlan(document, "#root", m, true);
    assert(byIdentity("tela-seg-2")?.token !== "original", "mismatch node replaced (not silently bound)");
    assert(byIdentity("tela-seg-2")?.textContent === "Two", "mismatch node replaced from the View");
    assert(byIdentity("tela-control")?.token === "original", "matching group node still bound");
    assert(byIdentity("tela-seg-1")?.token === "original", "matching seg-1 still bound");
  }

  // --- scenario 4: duplicate identity → diagnosed + resolved --------------
  {
    const present = api.duplicate_present();
    preRenderRegion("#root", present);
    const mounted = api.mount(api.scope("#root"), api.duplicate_tree(), api.theme());
    assert(mounted !== null, "duplicate mount returns a plan");
    const m = mounted as MountedLike;
    assert(m.diagnostics.includes("duplicate:tela-dup"), "duplicate identity diagnosed");
    assert(m.bindings.find((l) => l.identity === "tela-dup")?.status === "create", "duplicate identity re-creates");
    executeMountPlan(document, "#root", m, true);
    const dups = document.querySelectorAll("[data-tela='tela-dup']");
    assert(dups.length === 1, "duplicate nodes collapsed to one (no silent double-bind)");
    assert(dups[0]?.textContent === "x", "the surviving node is the View's node");
  }

  // --- scenario 5: replace → declarative effects execute ------------------
  {
    resetRegion("#root");
    const mounted = api.mount(api.scope("#root"), api.tree(), api.theme());
    assert(mounted !== null, "replace scenario: mount returns a plan");
    const m = mounted as MountedLike;
    executeMountPlan(document, "#root", m, true);
    // Model the pre-replacement focus; the shim mirrors it onto the DOM.
    const seg2 = byIdentity("tela-seg-2");
    assert(seg2 !== undefined, "seg-2 node present before replace");
    document.focusNode(seg2!);
    const mFocus = api.focus_held(m, "tela-seg-2");
    const update = api.replace(mFocus, api.tree());
    assert(update !== null, "replace returns the update result");
    const r = update as RenovatioLike;
    const keys = r.effects.map((e) => api.effect_identity(e));
    assert(keys.length === 2, "replace derives two effects");
    assert(keys[0] === "tela-seg-2" && keys[1] === "#root", "effects are restore(seg-2) + anchor(#root)");
    // Execute the replacement (rebuild the region from the next View).
    const nextMarkup = api.html_visus(r.view) ?? "";
    const nextPlan: MountedLike = {
      ...m,
      markup: nextMarkup,
      bindings: m.identities.map((id) => ({ identity: id, status: "create" })),
    };
    executeMountPlan(document, "#root", nextPlan, false);
    // Execute the declarative effects after replacement (focus restore by
    // stable identity; scroll-anchor intent for the region).
    for (const e of r.effects) {
      const key = api.effect_identity(e);
      const target = identityNodes().find((n) => n.dataTela === key);
      if (target !== undefined) {
        document.focusNode(target);
      }
    }
    assert(document.activeElement?.dataTela === "tela-seg-2", "focus restored to the pre-replacement identity");
    assert(byIdentity("tela-control") !== undefined, "region present after replacement");
  }

  // --- scenario 5b: declared focus movement adds Direct ------------------
  {
    resetRegion("#root");
    const mounted = api.mount(api.scope("#root"), api.tree(), api.theme());
    assert(mounted !== null, "movement scenario: mount returns a plan");
    const m = mounted as MountedLike;
    executeMountPlan(document, "#root", m, true);
    const mFocus = api.focus_held(m, "tela-seg-2");
    const mMove = api.focus_target(mFocus, "tela-seg-3");
    const update = api.replace(mMove, api.extended_tree());
    assert(update !== null, "movement replace returns the update result");
    const r = update as RenovatioLike;
    const keys = r.effects.map((e) => api.effect_identity(e));
    assert(keys.length === 3, "movement replace derives three effects");
    assert(
      keys[0] === "tela-seg-2" && keys[1] === "tela-seg-3" && keys[2] === "#root",
      "effects are restore + direct + anchor",
    );
    const nextMarkup = api.html_visus(r.view) ?? "";
    const extIds = m.identities.concat("tela-seg-3");
    const nextPlan: MountedLike = {
      ...m,
      markup: nextMarkup,
      bindings: extIds.map((id) => ({ identity: id, status: "create" })),
    };
    executeMountPlan(document, "#root", nextPlan, false);
    for (const e of r.effects) {
      const key = api.effect_identity(e);
      const target = identityNodes().find((n) => n.dataTela === key);
      if (target !== undefined) {
        document.focusNode(target);
      }
    }
    assert(document.activeElement?.dataTela === "tela-seg-3", "focus moved to the declared target identity");
  }

  // --- scenario 6: dispose unsubscribes + clears the region --------------
  {
    resetRegion("#root");
    const mounted = api.mount(api.scope("#root"), api.tree(), api.theme());
    assert(mounted !== null, "dispose scenario: mount returns a plan");
    const m = mounted as MountedLike;
    assert(m.subscriptions.length === 3, "one subscription descriptor per View identity");
    executeMountPlan(document, "#root", m, false);
    // Bind the region-bind subscriptions (webDom* surface) with an
    // observable counter; the app's real handlers are app-typed in U3.
    let dispatched = 0;
    const subscriptions = bindRegionSubscriptions(document, "#root", m, () => {
      dispatched += 1;
    });
    const preNode = byIdentity("tela-seg-1");
    assert(preNode !== undefined, "seg-1 node present before dispose");
    preNode!.dispatchEvent(new FakeEvent("tela:binding"));
    assert(dispatched === 1, "subscription is live before dispose");
    // dispose: the harness executes the unsubscribe plan + clears the region.
    api.dispose(m);
    for (const sub of subscriptions) {
      webDomUnsubscribe(sub);
    }
    const region = resolveRegion(document, "#root");
    region.children.splice(0, region.children.length);
    // A post-dispose dispatch does nothing (listeners removed).
    preNode!.dispatchEvent(new FakeEvent("tela:binding"));
    assert(dispatched === 1, "post-dispose dispatch is a no-op (unsubscribed)");
    assert(identityNodes().length === 0, "region cleared after dispose");
  }

  assert(identityNodes().length === 0, "proof scenarios leave no residue");
}
