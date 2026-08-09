import {
  webDomAll,
  webDomAttrRemove,
  webDomAttrSet,
  webDomClassAdd,
  webDomClassRemove,
  webDomClassToggle,
  webDomFetchText,
  webDomOnFocus,
  webDomOnFrame,
  webDomOnInput,
  webDomOnKeyboard,
  webDomOnPointer,
  webDomOnPointerLock,
  webDomOnResize,
  webDomOnSubmit,
  webDomPreventDefault,
  webDomPointerLockState,
  webDomQuery,
  webDomRequire,
  webDomRequestPointerLock,
  webDomScope,
  webDomSnapshot,
  webDomTextSet,
  webDomUnsubscribe,
  webDomValue,
  webDomValueSet,
  webDomExitPointerLock,
} from "../runtime/dom";

/**
 * Ported from faber-web/tests/dom-runtime-test.ts and en-adjusted
 * (web-surface-import U2, web-import-u2-tela-dom-runtime-bindings;
 * DELIVERY.md §U2): the snapshot node field is `identity` (the en
 * `DomNode.identity`, §5.2 — faber-web's la lane keeps `identitas`; this
 * test validates the tela-owned runtime lane). The runtime symbols stay
 * `webDom*` (the documented host-binding contract). Everything else is
 * verbatim from the source (hand-rolled fakes, no npm dependencies).
 * Run mechanics (faber-web's): tsc to CommonJS, then node the compiled
 * test.
 */

class FakeClassList {
  readonly values = new Set<string>();

  add(value: string): void {
    this.values.add(value);
  }

  remove(value: string): void {
    this.values.delete(value);
  }

  toggle(value: string): void {
    if (this.values.has(value)) {
      this.values.delete(value);
    } else {
      this.values.add(value);
    }
  }

  has(value: string): boolean {
    return this.values.has(value);
  }
}

class FakeEvent {
  defaultPrevented = false;

  constructor(readonly type = "") {}

  preventDefault(): void {
    this.defaultPrevented = true;
  }
}

class FakeKeyboardEvent extends FakeEvent {
  constructor(
    type: string,
    readonly key: string,
    readonly code: string,
    readonly repeat = false,
    readonly altKey = false,
    readonly ctrlKey = false,
    readonly shiftKey = false,
    readonly metaKey = false,
  ) {
    super(type);
  }
}

class FakePointerEvent extends FakeEvent {
  constructor(
    type: string,
    readonly clientX: number,
    readonly clientY: number,
    readonly movementX: number,
    readonly movementY: number,
    readonly button: number,
    readonly isPrimary: boolean,
  ) {
    super(type);
  }
}

class FakeElement {
  readonly children: FakeElement[] = [];
  readonly attributes = new Map<string, string>();
  readonly classList = new FakeClassList();
  readonly listeners = new Map<string, Set<(event: Event) => void>>();
  requestPointerLock?: () => Promise<void> | void;
  textContent: string | null = null;
  value = "";
  tagName = "";
  namespaceURI: string | null = null;
  localName = "";

  constructor(readonly selector: string) {}

  append(child: FakeElement): void {
    this.children.push(child);
  }

  querySelector(selector: string): Element | null {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector: string): Element[] {
    const found: FakeElement[] = [];
    const visit = (node: FakeElement): void => {
      for (const child of node.children) {
        if (child.selector === selector) {
          found.push(child);
        }
        visit(child);
      }
    };
    visit(this);
    return found as unknown as Element[];
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }

  addEventListener(name: string, handler: (event: Event) => void): void {
    const handlers = this.listeners.get(name) ?? new Set<(event: Event) => void>();
    handlers.add(handler);
    this.listeners.set(name, handlers);
  }

  removeEventListener(name: string, handler: (event: Event) => void): void {
    this.listeners.get(name)?.delete(handler);
  }

  dispatch(name: string, event: FakeEvent = new FakeEvent(name)): FakeEvent {
    for (const handler of this.listeners.get(name) ?? []) {
      handler(event as unknown as Event);
    }
    return event;
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

class FakeDocument {
  pointerLockElement: Element | null = null;
  readonly listeners = new Map<string, Set<(event: Event) => void>>();

  constructor(private readonly focusValue = true) {}

  hasFocus(): boolean {
    return this.focusValue;
  }

  exitPointerLock(): void {
    this.pointerLockElement = null;
    this.dispatch("pointerlockchange");
  }

  addEventListener(name: string, handler: (event: Event) => void): void {
    const handlers = this.listeners.get(name) ?? new Set<(event: Event) => void>();
    handlers.add(handler);
    this.listeners.set(name, handlers);
  }

  removeEventListener(name: string, handler: (event: Event) => void): void {
    this.listeners.get(name)?.delete(handler);
  }

  dispatch(name: string): void {
    for (const handler of this.listeners.get(name) ?? []) {
      handler(new FakeEvent(name) as unknown as Event);
    }
  }
}

async function main(): Promise<void> {
  const root = new FakeElement("#app");
  const label = new FakeElement(".label");
  const input = new FakeElement("input");
  const form = new FakeElement("form");
  root.append(label);
  root.append(input);
  root.append(form);

  // Scope through an explicit root — no global document shortcut.
  const scope = webDomScope("", root as unknown as ParentNode);
  assert(webDomQuery(scope, ".label") === (label as unknown as Element), "query is scoped through the supplied scope");
  assert(webDomRequire(scope, "input") === (input as unknown as Element), "require returns matching descendants");
  assert(webDomAll(scope, ".missing").length === 0, "all returns an empty list on no matches");

  // Scoped root isolation: scope to a subtree and verify queries do not
  // leak outside the scoped root.
  const doc = new FakeElement("#document");
  const app = new FakeElement("#app");
  const appLabel = new FakeElement(".label");
  const sidebar = new FakeElement(".sidebar");
  const sidebarLabel = new FakeElement(".label");
  const external = new FakeElement(".external");
  doc.append(app);
  doc.append(external);
  app.append(appLabel);
  app.append(sidebar);
  sidebar.append(sidebarLabel);

  const appScope = webDomScope("#app", doc as unknown as ParentNode);
  assert(webDomQuery(appScope, ".label") === (appLabel as unknown as Element), "scoped query finds descendant within scoped root");
  assert(webDomAll(appScope, ".label").length === 2, "scoped all finds every matching descendant within scoped root");
  assert(webDomQuery(appScope, ".external") === null, "scoped query does not leak outside the scoped root");

  const sidebarScope = webDomScope(".sidebar", app as unknown as ParentNode);
  const sidebarLabels = webDomAll(sidebarScope, ".label");
  assert(sidebarLabels.length === 1, "nested scoped all finds only descendants within nested scope");
  assert(sidebarLabels[0] === (sidebarLabel as unknown as Element), "nested scoped query returns the correct element");

  // Snapshot: typed hydration identity + tag read from the held root,
  // fail-closed on a null scope. The identity field is the en DomNode
  // spelling (the §5.2 adaptation of faber-web's `identitas`).
  const snapRoot = new FakeElement("#snap-root");
  const snapCard = new FakeElement("[data-tela]");
  snapCard.tagName = "div";
  snapCard.setAttribute("data-tela", "card-1");
  const snapField = new FakeElement("[data-tela]");
  snapField.tagName = "input";
  snapField.setAttribute("data-tela", "field-1");
  const snapPlain = new FakeElement(".plain");
  snapPlain.tagName = "span";
  snapRoot.append(snapCard);
  snapRoot.append(snapField);
  snapRoot.append(snapPlain);
  const snapScope = webDomScope("", snapRoot as unknown as ParentNode);
  const snapshotNodes = webDomSnapshot(snapScope);
  if (snapshotNodes === null) {
    throw new Error("snapshot returns a list for a valid scope");
  }
  assert(snapshotNodes.length === 2, "snapshot returns one node per [data-tela] descendant");
  assert(snapshotNodes[0].identity === "card-1" && snapshotNodes[0].tag === "div", "snapshot reads identity + tag from the held root");
  assert(snapshotNodes[1].identity === "field-1" && snapshotNodes[1].tag === "input", "snapshot reads the second node's identity + tag");
  assert(webDomSnapshot(null) === null, "snapshot fails closed on a null scope");

  // Snapshot canonical pair: namespace + local (DOM namespaceURI + localName,
  // case-preserved) distinguish SVG from HTML. Two cases that tagName lowering
  // cannot express: (1) SVG camel-case names like foreignObject, and (2) same
  // local name across namespaces (HTML <a> vs SVG <a>).
  const nsRoot = new FakeElement("#ns-root");
  const htmlLink = new FakeElement("[data-tela]");
  htmlLink.tagName = "a";
  // namespaceURI left null — HTML default maps to "" (runtime null fallback).
  htmlLink.localName = "a";
  htmlLink.setAttribute("data-tela", "html-a");
  const svgLink = new FakeElement("[data-tela]");
  svgLink.tagName = "a";
  svgLink.namespaceURI = "http://www.w3.org/2000/svg";
  svgLink.localName = "a";
  svgLink.setAttribute("data-tela", "svg-a");
  const svgForeignObject = new FakeElement("[data-tela]");
  svgForeignObject.tagName = "foreignObject";
  svgForeignObject.namespaceURI = "http://www.w3.org/2000/svg";
  svgForeignObject.localName = "foreignObject";
  svgForeignObject.setAttribute("data-tela", "svg-foreign");
  nsRoot.append(htmlLink);
  nsRoot.append(svgLink);
  nsRoot.append(svgForeignObject);
  const nsScope = webDomScope("", nsRoot as unknown as ParentNode);
  const nsNodes = webDomSnapshot(nsScope);
  if (nsNodes === null) {
    throw new Error("snapshot returns a list for a valid namespaced scope");
  }
  assert(nsNodes.length === 3, "snapshot returns one node per namespaced [data-tela] descendant");
  assert(nsNodes[0].namespace === "" && nsNodes[0].local === "a", "HTML default namespace is empty, local name case-preserved");
  assert(nsNodes[1].namespace === "http://www.w3.org/2000/svg" && nsNodes[1].local === "a", "SVG same-local-name element carries the SVG namespace");
  assert(nsNodes[0].local === nsNodes[1].local && nsNodes[0].namespace !== nsNodes[1].namespace, "canonical pair distinguishes HTML from SVG same-local-name elements");
  assert(nsNodes[2].namespace === "http://www.w3.org/2000/svg" && nsNodes[2].local === "foreignObject", "SVG camel-case local name is preserved, not tagName-lowered");
  assert(nsNodes[2].tag === "foreignobject", "legacy tag stays tagName-lowered for landed consumers");

  // Direct preventDefault proof.
  const pdEvent = new FakeEvent();
  assert(!pdEvent.defaultPrevented, "event starts unprevented");
  const returnedEvent = webDomPreventDefault(pdEvent as unknown as Event);
  assert(pdEvent.defaultPrevented, "preventDefault sets defaultPrevented on the event");
  assert(returnedEvent === (pdEvent as unknown as Event), "preventDefault returns the same event for chaining");

  webDomTextSet(label as unknown as Element, "ready");
  assert(label.textContent === "ready", "text mutation reaches the element");

  webDomAttrSet(label as unknown as Element, "aria-live", "polite");
  assert(label.attributes.get("aria-live") === "polite", "attr_set writes attributes");
  webDomAttrRemove(label as unknown as Element, "aria-live");
  assert(!label.attributes.has("aria-live"), "attr_remove deletes attributes");

  webDomClassAdd(label as unknown as Element, "active");
  assert(label.classList.has("active"), "class_add writes classList");
  webDomClassToggle(label as unknown as Element, "active");
  assert(!label.classList.has("active"), "class_toggle removes present class");
  webDomClassAdd(label as unknown as Element, "gone");
  webDomClassRemove(label as unknown as Element, "gone");
  assert(!label.classList.has("gone"), "class_remove deletes class");

  webDomValueSet(input as unknown as Element, "abc");
  assert(webDomValue(input as unknown as Element) === "abc", "value helpers roundtrip");

  let seenInput = "";
  const inputSub = webDomOnInput(input as unknown as Element, (_element, value) => {
    seenInput = value;
  });
  input.value = "changed";
  input.dispatch("input");
  assert(seenInput === "changed", "on_input passes the current value");
  webDomUnsubscribe(inputSub);
  input.value = "ignored";
  input.dispatch("input");
  assert(seenInput === "changed", "unsubscribe removes the listener");

  let submitted = false;
  webDomOnSubmit(form as unknown as Element, { prevent_default: true }, () => {
    submitted = true;
  });
  const submitEvent = form.dispatch("submit");
  assert(submitted, "on_submit invokes handler");
  assert(submitEvent.defaultPrevented, "on_submit prevents default by option");

  const oldRequestAnimationFrame = globalThis.requestAnimationFrame;
  const oldCancelAnimationFrame = globalThis.cancelAnimationFrame;
  const frameCallbacks = new Map<number, FrameRequestCallback>();
  let nextFrameId = 1;
  globalThis.requestAnimationFrame = ((callback: FrameRequestCallback): number => {
    const id = nextFrameId;
    nextFrameId += 1;
    frameCallbacks.set(id, callback);
    return id;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number): void => {
    frameCallbacks.delete(id);
  }) as typeof cancelAnimationFrame;
  try {
    const frames: number[] = [];
    const frameSub = webDomOnFrame((state) => {
      frames.push(state.frame);
      if (state.frame === 1) {
        assert(state.time_ms === 10, "frame handler receives timestamp");
        assert(state.delta_ms === 0, "first frame has zero delta");
      }
      if (state.frame === 2) {
        assert(state.delta_ms === 6, "second frame receives elapsed delta");
      }
    });
    frameCallbacks.get(1)?.(10);
    frameCallbacks.get(2)?.(16);
    assert(frames.length === 2, "on_frame schedules repeated frames");
    webDomUnsubscribe(frameSub);
    assert(!frameCallbacks.has(3), "on_frame unsubscribe cancels next frame");
  } finally {
    globalThis.requestAnimationFrame = oldRequestAnimationFrame;
    globalThis.cancelAnimationFrame = oldCancelAnimationFrame;
  }

  const oldWindow = globalThis.window;
  const resizeHandlers = new Set<(event: Event) => void>();
  globalThis.window = {
    innerWidth: 800,
    innerHeight: 600,
    devicePixelRatio: 2,
    addEventListener(name: string, handler: (event: Event) => void): void {
      assert(name === "resize", "resize listener uses resize event");
      resizeHandlers.add(handler);
    },
    removeEventListener(_name: string, handler: (event: Event) => void): void {
      resizeHandlers.delete(handler);
    },
  } as unknown as Window & typeof globalThis;
  try {
    const sizes: string[] = [];
    const resizeSub = webDomOnResize((state) => {
      sizes.push(`${state.width}x${state.height}@${state.device_pixel_ratio}`);
    });
    assert(sizes[0] === "800x600@2", "on_resize emits initial size");
    (globalThis.window as unknown as { innerWidth: number; innerHeight: number; devicePixelRatio: number }).innerWidth = 1024;
    (globalThis.window as unknown as { innerWidth: number; innerHeight: number; devicePixelRatio: number }).innerHeight = 768;
    (globalThis.window as unknown as { innerWidth: number; innerHeight: number; devicePixelRatio: number }).devicePixelRatio = 1;
    for (const handler of resizeHandlers) {
      handler(new FakeEvent("resize") as unknown as Event);
    }
    assert(sizes[1] === "1024x768@1", "on_resize emits updated size");
    webDomUnsubscribe(resizeSub);
    assert(resizeHandlers.size === 0, "on_resize unsubscribe removes listener");
  } finally {
    globalThis.window = oldWindow;
  }

  let keyboardSeen = "";
  const keySub = webDomOnKeyboard(input as unknown as Element, "keydown", (state) => {
    keyboardSeen = `${state.kind}:${state.key}:${state.code}:${state.repeat}:${state.shift}`;
  });
  input.dispatch("keydown", new FakeKeyboardEvent("keydown", "w", "KeyW", true, false, false, true));
  assert(keyboardSeen === "keydown:w:KeyW:true:true", "on_keyboard projects keyboard state");
  webDomUnsubscribe(keySub);

  let pointerSeen = "";
  const pointerSub = webDomOnPointer(input as unknown as Element, "pointermove", (state) => {
    pointerSeen = `${state.kind}:${state.x}:${state.y}:${state.movement_x}:${state.movement_y}:${state.button}:${state.primary}`;
  });
  input.dispatch("pointermove", new FakePointerEvent("pointermove", 10, 20, 3, -4, 1, true));
  assert(pointerSeen === "pointermove:10:20:3:-4:1:true", "on_pointer projects pointer state");
  webDomUnsubscribe(pointerSub);

  const oldDocument = globalThis.document;
  globalThis.document = new FakeDocument(true) as unknown as Document;
  try {
    let focusSeen = false;
    const focusSub = webDomOnFocus(input as unknown as Element, "focus", (state) => {
      focusSeen = state.focused;
    });
    input.dispatch("focus");
    assert(focusSeen, "on_focus reports document focus state");
    webDomUnsubscribe(focusSub);
  } finally {
    globalThis.document = oldDocument;
  }

  const pointerLockDoc = new FakeDocument(true);
  globalThis.document = pointerLockDoc as unknown as Document;
  try {
    input.requestPointerLock = () => {
      pointerLockDoc.pointerLockElement = input as unknown as Element;
      pointerLockDoc.dispatch("pointerlockchange");
    };
    let pointerLockSeen = "";
    const lockSub = webDomOnPointerLock(input as unknown as Element, (state) => {
      pointerLockSeen = `${state.supported}:${state.locked}:${state.denied}:${state.target_matches}`;
    });
    assert(pointerLockSeen === "true:false:false:false", "on_pointer_lock emits initial unlocked state");
    const requested = webDomRequestPointerLock(input as unknown as Element);
    assert(requested.supported && requested.locked && requested.target_matches, "request_pointer_lock reports locked target");
    assert(pointerLockSeen === "true:true:false:true", "on_pointer_lock observes lock change");
    const state = webDomPointerLockState(input as unknown as Element);
    assert(state.locked && state.target_matches, "pointer_lock_state reports current target");
    const exited = webDomExitPointerLock();
    assert(exited.supported && !exited.locked, "exit_pointer_lock reports unlocked state");
    assert(pointerLockSeen === "true:false:false:false", "on_pointer_lock observes exit");
    webDomUnsubscribe(lockSub);
    assert((pointerLockDoc.listeners.get("pointerlockchange")?.size ?? 0) === 0, "pointer lock unsubscribe removes change listener");
    assert((pointerLockDoc.listeners.get("pointerlockerror")?.size ?? 0) === 0, "pointer lock unsubscribe removes error listener");
  } finally {
    globalThis.document = oldDocument;
    input.requestPointerLock = undefined;
  }

  globalThis.document = new FakeDocument(true) as unknown as Document;
  try {
    const unsupported = webDomRequestPointerLock(input as unknown as Element);
    assert(!unsupported.supported && unsupported.denied, "request_pointer_lock reports unsupported denial");
    input.requestPointerLock = () => {
      throw new Error("denied");
    };
    const denied = webDomRequestPointerLock(input as unknown as Element);
    assert(denied.supported && denied.denied, "request_pointer_lock reports thrown denial");
  } finally {
    globalThis.document = oldDocument;
    input.requestPointerLock = undefined;
  }

  const oldFetch = globalThis.fetch;
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    assert(String(url) === "/api", "fetch receives url");
    assert(init?.method === "POST", "fetch receives method");
    return new Response("ok", { status: 201 });
  }) as typeof fetch;
  try {
    const response = await webDomFetchText({ url: "/api", method: "POST", body: "x" });
    assert(response.status === 201, "fetch response keeps status");
    assert(response.ok, "fetch response keeps ok");
    assert(response.body === "ok", "fetch response reads body text");
  } finally {
    globalThis.fetch = oldFetch;
  }
}

void main();
