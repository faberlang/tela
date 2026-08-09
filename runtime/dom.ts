/**
 * tela/runtime/dom.ts — the tela-owned DOM host runtime (tela:dom).
 *
 * SOURCE: faber-web/runtime/dom.ts copied + adapted (web-surface-import U2,
 * web-import-u2-tela-dom-runtime-bindings; DELIVERY.md §U2 + §5.2). The
 * runtime symbols (`webDom*`) are KEPT (the documented host-binding
 * contract — the bindings/ts.toml routes map tela:dom.X → webDomX, and the
 * harness assemblies bind the DOM_NS const over these). The one forced
 * adaptation: the snapshot node type `WebDomNodus` → `WebDomNode` with the
 * `identitas` field → `identity` (the en genus `DomNode` + the English-
 * first identity field, §5.2 — matches the Stage 5 U0 kernel rename).
 * faber-web's consumers stay frozen on the la `identitas` spelling (C1 —
 * the la runtime is untouched); this file is the en-lane adaptation.
 *
 * The type names mirror the en Faber genera: Scope → WebDomScope, Element →
 * WebDomElement (opaque), DomNode → WebDomNode, DomEvent → WebDomEvent,
 * FrameState → WebDomFrameState, ResizeState → WebDomResizeState,
 * KeyboardState → WebDomKeyboardState, PointerState → WebDomPointerState,
 * FocusState → WebDomFocusState, PointerLockState → WebDomPointerLockState,
 * Subscription → WebDomSubscription, SubmitOptions → WebDomSubmitOptions,
 * FetchRequest → WebDomFetchRequest, FetchResponse → WebDomFetchResponse —
 * verified mechanically by tests/contract-test.ts (the en-adjusted plain-
 * text cross-check of src/dom.fab ↔ bindings/ts.toml ↔ this runtime).
 */

export type WebDomScope = { readonly root: ParentNode; readonly selector: string };
export type WebDomElement = Element;
export type WebDomNode = {
  readonly identity: string;
  readonly tag: string;
  readonly namespace: string;
  readonly local: string;
};
export type WebDomEvent = Event;
export type WebDomSubscription = { readonly id: number; readonly dispose: () => void };
export type WebDomEventHandler = (event: WebDomEvent) => void;
export type WebDomInputHandler = (element: WebDomElement, value: string) => void;
export type WebDomSubmitHandler = (form: WebDomElement) => void;
export type WebDomFrameState = {
  readonly frame: number;
  readonly time_ms: number;
  readonly delta_ms: number;
};
export type WebDomResizeState = {
  readonly width: number;
  readonly height: number;
  readonly device_pixel_ratio: number;
};
export type WebDomKeyboardState = {
  readonly kind: string;
  readonly key: string;
  readonly code: string;
  readonly repeat: boolean;
  readonly alt: boolean;
  readonly ctrl: boolean;
  readonly shift: boolean;
  readonly meta: boolean;
};
export type WebDomPointerState = {
  readonly kind: string;
  readonly x: number;
  readonly y: number;
  readonly movement_x: number;
  readonly movement_y: number;
  readonly button: number;
  readonly primary: boolean;
};
export type WebDomFocusState = {
  readonly focused: boolean;
};
export type WebDomPointerLockState = {
  readonly supported: boolean;
  readonly locked: boolean;
  readonly denied: boolean;
  readonly target_matches: boolean;
};
export type WebDomFrameHandler = (state: WebDomFrameState) => void;
export type WebDomResizeHandler = (state: WebDomResizeState) => void;
export type WebDomKeyboardHandler = (state: WebDomKeyboardState) => void;
export type WebDomPointerHandler = (state: WebDomPointerState) => void;
export type WebDomFocusHandler = (state: WebDomFocusState) => void;
export type WebDomPointerLockHandler = (state: WebDomPointerLockState) => void;

export type WebDomSubmitOptions = {
  readonly prevent_default?: boolean;
};

export type WebDomFetchRequest = {
  readonly url: string;
  readonly method?: string;
  readonly body?: string | null;
  readonly headers?: Record<string, string>;
};

export type WebDomFetchResponse = {
  readonly status: number;
  readonly ok: boolean;
  readonly body: string;
};

let nextSubscriptionId = 1;
const activeSubscriptions = new Map<number, () => void>();

export function webDomScope(selector: string, root: ParentNode = document): WebDomScope {
  const scopedRoot = selector.length === 0 ? root : scopedRequire(root, selector);
  return { root: scopedRoot, selector };
}

export function webDomQuery(scope: WebDomScope, selector: string): WebDomElement | null {
  return scope.root.querySelector(selector);
}

export function webDomRequire(scope: WebDomScope, selector: string): WebDomElement {
  return scopedRequire(scope.root, selector);
}

export function webDomAll(scope: WebDomScope, selector: string): WebDomElement[] {
  return Array.from(scope.root.querySelectorAll(selector));
}

export function webDomSnapshot(scope: WebDomScope | null): WebDomNode[] | null {
  if (scope === null) {
    return null;
  }
  return Array.from(scope.root.querySelectorAll("[data-tela]")).map((el) => ({
    identity: el.getAttribute("data-tela") ?? "",
    tag: el.tagName.toLowerCase(),
    // Canonical identity pair: DOM namespaceURI + localName, case-preserved.
    // "" = HTML default (namespaceURI absent/null); local keeps SVG camel-case
    // names (foreignObject) intact so hydration can distinguish them.
    namespace: el.namespaceURI ?? "",
    local: el.localName,
  }));
}

export function webDomTextSet(element: WebDomElement, value: string): void {
  element.textContent = value;
}

export function webDomAttrSet(element: WebDomElement, name: string, value: string): void {
  element.setAttribute(name, value);
}

export function webDomAttrRemove(element: WebDomElement, name: string): void {
  element.removeAttribute(name);
}

export function webDomClassAdd(element: WebDomElement, className: string): void {
  element.classList.add(className);
}

export function webDomClassRemove(element: WebDomElement, className: string): void {
  element.classList.remove(className);
}

export function webDomClassToggle(element: WebDomElement, className: string): void {
  element.classList.toggle(className);
}

export function webDomOn(
  element: WebDomElement,
  eventName: string,
  handler: WebDomEventHandler,
): WebDomSubscription {
  element.addEventListener(eventName, handler);
  return rememberSubscription(() => element.removeEventListener(eventName, handler));
}

export function webDomUnsubscribe(subscription: WebDomSubscription): void {
  const dispose = activeSubscriptions.get(subscription.id) ?? subscription.dispose;
  activeSubscriptions.delete(subscription.id);
  dispose();
}

export function webDomValue(element: WebDomElement): string {
  return elementWithValue(element).value;
}

export function webDomValueSet(element: WebDomElement, value: string): void {
  elementWithValue(element).value = value;
}

export function webDomOnInput(
  element: WebDomElement,
  handler: WebDomInputHandler,
): WebDomSubscription {
  return webDomOn(element, "input", () => handler(element, webDomValue(element)));
}

export function webDomOnSubmit(
  form: WebDomElement,
  options: WebDomSubmitOptions,
  handler: WebDomSubmitHandler,
): WebDomSubscription {
  return webDomOn(form, "submit", (event) => {
    if (options.prevent_default !== false) {
      event.preventDefault();
    }
    handler(form);
  });
}

export function webDomOnFrame(handler: WebDomFrameHandler): WebDomSubscription {
  let active = true;
  let frame = 0;
  let previousTime: number | null = null;
  let requestId = 0;
  const step = (time: number): void => {
    if (!active) {
      return;
    }
    const delta = previousTime === null ? 0 : time - previousTime;
    previousTime = time;
    frame += 1;
    handler({ frame, time_ms: time, delta_ms: delta });
    requestId = requestAnimationFrame(step);
  };
  requestId = requestAnimationFrame(step);
  return rememberSubscription(() => {
    active = false;
    cancelAnimationFrame(requestId);
  });
}

export function webDomOnResize(handler: WebDomResizeHandler): WebDomSubscription {
  const emit = (): void => handler(currentResizeState());
  window.addEventListener("resize", emit);
  emit();
  return rememberSubscription(() => window.removeEventListener("resize", emit));
}

export function webDomOnKeyboard(
  element: WebDomElement,
  eventName: string,
  handler: WebDomKeyboardHandler,
): WebDomSubscription {
  // Listen on the bound element (scoped) and on window so drive/apps receive
  // keys without requiring the bound element to hold DOM focus first.
  // Boolean key state is idempotent under double-fire when both targets see
  // the same event (focused element + bubble to window).
  const wrapped = (event: Event): void => {
    handler(keyboardState(event));
  };
  element.addEventListener(eventName, wrapped);
  const win = typeof globalThis !== "undefined" ? globalThis.window : undefined;
  const alsoWindow =
    win !== undefined &&
    typeof win.addEventListener === "function" &&
    (element as unknown) !== win;
  if (alsoWindow) {
    win.addEventListener(eventName, wrapped);
  }
  return rememberSubscription(() => {
    element.removeEventListener(eventName, wrapped);
    if (alsoWindow) {
      win.removeEventListener(eventName, wrapped);
    }
  });
}

export function webDomOnPointer(
  element: WebDomElement,
  eventName: string,
  handler: WebDomPointerHandler,
): WebDomSubscription {
  return webDomOn(element, eventName, (event) => handler(pointerState(event)));
}

export function webDomOnFocus(
  element: WebDomElement,
  eventName: string,
  handler: WebDomFocusHandler,
): WebDomSubscription {
  // Focus state here means "the document has focus", which is also what
  // decides whether window-level keyboard events can arrive. Mirror
  // on_keyboard and listen on window as well, so a subscriber tracks the
  // window gaining and losing focus without the bound element ever holding
  // DOM focus. Emit once at subscribe, as on_resize does; otherwise the
  // subscriber keeps an unfocused default that no event will correct.
  const emit = (): void => handler({ focused: document.hasFocus() });
  element.addEventListener(eventName, emit);
  const win = typeof globalThis !== "undefined" ? globalThis.window : undefined;
  const alsoWindow =
    win !== undefined &&
    typeof win.addEventListener === "function" &&
    (element as unknown) !== win;
  if (alsoWindow) {
    win.addEventListener(eventName, emit);
  }
  emit();
  return rememberSubscription(() => {
    element.removeEventListener(eventName, emit);
    if (alsoWindow) {
      win.removeEventListener(eventName, emit);
    }
  });
}

export function webDomPointerLockState(element: WebDomElement): WebDomPointerLockState {
  return pointerLockState(element, false);
}

export function webDomRequestPointerLock(element: WebDomElement): WebDomPointerLockState {
  const request = element.requestPointerLock;
  if (typeof request !== "function") {
    return pointerLockState(element, true);
  }
  try {
    const result = request.call(element) as Promise<void> | void;
    if (result !== undefined && typeof result.catch === "function") {
      result.catch(() => undefined);
    }
  } catch {
    return pointerLockState(element, true);
  }
  return pointerLockState(element, false);
}

export function webDomExitPointerLock(): WebDomPointerLockState {
  const exit = document.exitPointerLock;
  if (typeof exit !== "function") {
    return {
      supported: false,
      locked: false,
      denied: false,
      target_matches: false,
    };
  }
  exit.call(document);
  return {
    supported: true,
    locked: document.pointerLockElement !== null,
    denied: false,
    target_matches: false,
  };
}

export function webDomOnPointerLock(
  element: WebDomElement,
  handler: WebDomPointerLockHandler,
): WebDomSubscription {
  const emit = (): void => handler(pointerLockState(element, false));
  document.addEventListener("pointerlockchange", emit);
  document.addEventListener("pointerlockerror", emit);
  emit();
  return rememberSubscription(() => {
    document.removeEventListener("pointerlockchange", emit);
    document.removeEventListener("pointerlockerror", emit);
  });
}

export function webDomPreventDefault(event: WebDomEvent): WebDomEvent {
  event.preventDefault();
  return event;
}

export async function webDomFetchText(request: WebDomFetchRequest): Promise<WebDomFetchResponse> {
  const response = await fetch(request.url, {
    method: request.method ?? "GET",
    body: request.body ?? undefined,
    headers: request.headers,
  });
  return {
    status: response.status,
    ok: response.ok,
    body: await response.text(),
  };
}

function scopedRequire(root: ParentNode, selector: string): Element {
  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`tela:dom required selector not found: ${selector}`);
  }
  return element;
}

function rememberSubscription(dispose: () => void): WebDomSubscription {
  const id = nextSubscriptionId;
  nextSubscriptionId += 1;
  activeSubscriptions.set(id, dispose);
  return { id, dispose };
}

function currentResizeState(): WebDomResizeState {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio,
  };
}

function keyboardState(event: WebDomEvent): WebDomKeyboardState {
  const keyEvent = event as KeyboardEvent;
  return {
    kind: event.type,
    key: keyEvent.key ?? "",
    code: keyEvent.code ?? "",
    repeat: keyEvent.repeat ?? false,
    alt: keyEvent.altKey ?? false,
    ctrl: keyEvent.ctrlKey ?? false,
    shift: keyEvent.shiftKey ?? false,
    meta: keyEvent.metaKey ?? false,
  };
}

function pointerState(event: WebDomEvent): WebDomPointerState {
  const pointerEvent = event as PointerEvent;
  return {
    kind: event.type,
    x: pointerEvent.clientX ?? 0,
    y: pointerEvent.clientY ?? 0,
    movement_x: pointerEvent.movementX ?? 0,
    movement_y: pointerEvent.movementY ?? 0,
    button: pointerEvent.button ?? 0,
    primary: pointerEvent.isPrimary ?? false,
  };
}

function pointerLockState(element: WebDomElement, denied: boolean): WebDomPointerLockState {
  const supported = typeof element.requestPointerLock === "function"
    && typeof document.exitPointerLock === "function";
  const lockedElement = document.pointerLockElement;
  return {
    supported,
    locked: lockedElement !== null,
    denied,
    target_matches: lockedElement === element,
  };
}

function elementWithValue(element: WebDomElement): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  if ("value" in element) {
    return element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  }
  throw new Error("tela:dom element has no value property");
}
