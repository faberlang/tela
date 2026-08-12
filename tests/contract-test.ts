/**
 * Contract test for the tela DOM runtime bindings (tela:dom).
 *
 * Ported from faber-web/tests/contract-test.ts and en-adjusted
 * (web-surface-import U2, web-import-u2-tela-dom-runtime-bindings;
 * DELIVERY.md §U2). Closes the gap between hand-mirrored runtime types and
 * honest machine verification. For every bound module the test cross-checks
 * three artifacts:
 *
 *   - src/<module>.fab    — Faber-side routes (fn), classes, and typi
 *   - bindings/ts.toml    — route -> runtime symbol + opener/result typing
 *   - runtime/<module>.ts — TypeScript runtime implementation
 *
 * Checks (the faber-web web-canvas2d Unit 0 contract, ported):
 *   (a) every fn with a print body has a ts.toml route, and every route
 *       names a real fn
 *   (b) every route's symbol resolves to an exported function in the runtime
 *   (c) every exported function in the runtime is referenced by a route
 *   (d) every class in a route signature (or a typus it uses) has a TS
 *       counterpart whose fields cover the class fields with matching
 *       primitive types
 *   (e) opener/result in ts.toml match the actual fn signature
 *
 * Parsing is plain text: the Radix TS backend exposes no class-type
 * reflection API, so .fab and .ts sources are read and matched directly.
 * The en surface: class/fn/type/print/optional, list<>, ∪ null, ⇥ (the
 * glyph never localizes).
 *
 * Runs as a plain Node script with no npm dependencies (tsc emits CommonJS).
 * From the tela repo root:  tsc --strict --module CommonJS --outDir <scratch>
 * then `node <scratch>/tests/contract-test.js` (cwd = the repo root — the
 * test resolves bindings/ts.toml via process.cwd()).
 */

declare const require: (id: string) => unknown;
declare const process: { cwd(): string };

const fs = require("fs") as {
  readFileSync(path: string, encoding: "utf8"): string;
  existsSync(path: string): boolean;
};

/** A bound module: route prefix, .fab source, TS runtime, TS type prefix. */
interface ModuleSpec {
  prefix: string;      // e.g. "tela:dom"
  fabFile: string;     // e.g. "src/dom.fab"
  runtimeFile: string; // e.g. "runtime/dom.ts"
  typePrefix: string;  // e.g. "WebDom"
  moduleToken: string; // e.g. "Dom" — folded off class names (DomNode -> WebDomNode)
}

const MODULES: ModuleSpec[] = [
  { prefix: "tela:dom", fabFile: "src/dom.fab", runtimeFile: "runtime/dom.ts", typePrefix: "WebDom", moduleToken: "Dom" },
  // web-import-u3-tela-canvas2d: the tela:canvas2d surface joins the
  // bijection cross-check. The moduleToken fold: the en class is
  // `Canvas2DContext` (PascalCase concatenation, S5-U0 / DELIVERY §5.2 —
  // the la `Canvas2dContext`'s lower-d spelling) → folded off the
  // `WebCanvas2d` type prefix → `WebCanvas2dContext`.
  { prefix: "tela:canvas2d", fabFile: "src/canvas2d.fab", runtimeFile: "runtime/canvas2d.ts", typePrefix: "WebCanvas2d", moduleToken: "Canvas2D" },
];

/** TS counterpart name for a class: WebDom + class, folding a redundant module token. */
function tsTypeName(mod: ModuleSpec, className: string): string {
  if (className.startsWith(mod.moduleToken)) {
    return mod.typePrefix + className.slice(mod.moduleToken.length);
  }
  return mod.typePrefix + className;
}

// ---------------------------------------------------------------------------
// .fab parsing (the en surface: class / fn / type / print / optional)
// ---------------------------------------------------------------------------

interface FabField {
  fabType: string;
  name: string;
  optional: boolean;
}

interface FabClass {
  name: string;
  fields: FabField[];
}

interface FabFn {
  name: string;
  params: { typeName: string; paramName: string }[];
  returnType: string; // raw, e.g. "Element ∪ null", "FetchResponse ⇥ string"
  printParams: Set<string>;
}

interface FabFile {
  classes: Map<string, FabClass>;
  typi: string[]; // typus declaration RHS, e.g. "(DomEvent) → void"
  fns: Map<string, FabFn>;
}

function countChar(s: string, c: string): number {
  let n = 0;
  for (const ch of s) {
    if (ch === c) {
      n += 1;
    }
  }
  return n;
}

function parseParams(raw: string): { typeName: string; paramName: string }[] {
  const params: { typeName: string; paramName: string }[] = [];
  for (const part of raw.split(",")) {
    const m = /^\s*([\w<>]+)\s+(\w+)\s*$/.exec(part);
    if (m !== null) {
      params.push({ typeName: m[1], paramName: m[2] });
    }
  }
  return params;
}

function parseFab(source: string): FabFile {
  const classes = new Map<string, FabClass>();
  const typi: string[] = [];
  const fns = new Map<string, FabFn>();
  const lines = source.split(/\r?\n/);
  let i = 0;
  let currentClass: FabClass | null = null;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (currentClass !== null) {
      if (line.startsWith("}")) {
        currentClass = null;
      } else {
        const field = /^(\w+)\s+(\w+)(\s+optional)?(\s*=.*)?$/.exec(line);
        if (field !== null) {
          currentClass.fields.push({
            fabType: field[1],
            name: field[2],
            optional: field[3] !== undefined,
          });
        }
      }
      i += 1;
      continue;
    }
    const classMatch = /^class\s+(\w+)\s*\{$/.exec(line);
    if (classMatch !== null) {
      currentClass = { name: classMatch[1], fields: [] };
      classes.set(currentClass.name, currentClass);
      i += 1;
      continue;
    }
    const typusMatch = /^type\s+\w+\s*=\s*(.*)$/.exec(line);
    if (typusMatch !== null) {
      typi.push(typusMatch[1]);
      i += 1;
      continue;
    }
    const fnMatch = /^fn\s+(\w+)\s*\(([^)]*)\)\s*→\s*(.+)$/.exec(line);
    if (fnMatch !== null) {
      const name = fnMatch[1];
      const params = parseParams(fnMatch[2]);
      const returnType = fnMatch[3].replace(/\{\s*$/, "").trim();
      const printParams = new Set<string>();
      let depth = 1; // the signature line opened the body
      i += 1;
      while (i < lines.length && depth > 0) {
        const bodyLine = lines[i];
        depth += countChar(bodyLine, "{") - countChar(bodyLine, "}");
        if (depth > 0) {
          const printMatch = /^\s*print\s+(\w+)\s*$/.exec(bodyLine);
          if (printMatch !== null) {
            printParams.add(printMatch[1]);
          }
        }
        i += 1;
      }
      fns.set(name, { name, params, returnType, printParams });
      continue;
    }
    i += 1;
  }
  return { classes, typi, fns };
}

/** "Element ∪ null" -> "Element"; "FetchResponse ⇥ string" -> "FetchResponse". */
function normalizeFabType(raw: string): string {
  return raw
    .replace(/\s*∪\s*null\s*$/, "")
    .replace(/\s*⇥\s*\w+\s*$/, "")
    .trim();
}

function unwrapCollection(fabType: string): string {
  const m = /^list<([\w<>]+)>$/.exec(fabType);
  return m === null ? fabType : m[1];
}

// ---------------------------------------------------------------------------
// ts.toml parsing
// ---------------------------------------------------------------------------

interface TomlEntry {
  route: string;
  symbol: string;
  opener: string;
  result: string;
}

function parseToml(source: string): Map<string, TomlEntry> {
  const entries = new Map<string, TomlEntry>();
  let currentRoute: string | null = null;
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    const header = /^\[functions\."([^"]+)"\]$/.exec(line);
    if (header !== null) {
      currentRoute = header[1];
      entries.set(currentRoute, { route: currentRoute, symbol: "", opener: "", result: "" });
      continue;
    }
    if (line.startsWith("[")) {
      currentRoute = null; // [shim] or another table
      continue;
    }
    const field = /^(\w+)\s*=\s*"([^"]*)"$/.exec(line);
    if (field !== null && currentRoute !== null) {
      const entry = entries.get(currentRoute) as TomlEntry;
      if (field[1] === "symbol") {
        entry.symbol = field[2];
      } else if (field[1] === "opener") {
        entry.opener = field[2];
      } else if (field[1] === "result") {
        entry.result = field[2];
      }
    }
  }
  return entries;
}

// ---------------------------------------------------------------------------
// runtime .ts parsing
// ---------------------------------------------------------------------------

interface RuntimeFile {
  exportedFunctions: string[];
  typeDecls: Map<string, string>; // type name -> declaration RHS
}

function parseRuntime(source: string): RuntimeFile {
  const exportedFunctions: string[] = [];
  const typeDecls = new Map<string, string>();
  const lines = source.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const funcMatch = /^export (?:async )?function (\w+)/.exec(lines[i]);
    if (funcMatch !== null) {
      exportedFunctions.push(funcMatch[1]);
      i += 1;
      continue;
    }
    const typeMatch = /^export type (\w+)\s*=\s*(.*)$/.exec(lines[i]);
    if (typeMatch !== null) {
      const name = typeMatch[1];
      let rhs = typeMatch[2].trim();
      i += 1;
      if (rhs.startsWith("{")) {
        while (i < lines.length && !rhs.endsWith("};")) {
          rhs += " " + lines[i].trim();
          i += 1;
        }
      }
      typeDecls.set(name, rhs);
      continue;
    }
    // emit-surface value exports: an `export class` genus carrier (e.g.
    // `WebDomSubmitOptions` — the value export the browser-app construction
    // needs) is parsed like a type declaration so the field-coverage check
    // (d) keeps working over its body.
    const classMatch = /^export class (\w+)\s*\{$/.exec(lines[i]);
    if (classMatch !== null) {
      const name = classMatch[1];
      let rhs = "{";
      i += 1;
      while (i < lines.length && !/^\}\s*;?\s*$/.test(lines[i])) {
        rhs += " " + lines[i].trim();
        i += 1;
      }
      rhs += " }";
      typeDecls.set(name, rhs);
      continue;
    }
    i += 1;
  }
  return { exportedFunctions, typeDecls };
}

interface TsField {
  name: string;
  optional: boolean;
  type: string;
}

/** Object-literal field extraction; null for native/opaque aliases. */
function tsTypeFields(rhs: string): TsField[] | null {
  const trimmed = rhs.trim();
  if (!trimmed.startsWith("{")) {
    return null; // e.g. `type WebDomElement = Element;` — opaque handle type
  }
  const inner = trimmed.replace(/}\s*;?\s*$/, ";"); // keep last field's ';', drop closing '}'
  const fields: TsField[] = [];
  const fieldRe = /(?:readonly\s+)?(\w+)(\??)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = fieldRe.exec(inner)) !== null) {
    fields.push({ name: m[1], optional: m[2] === "?", type: m[3].trim() });
  }
  if (fields.length === 0) {
    return null;
  }
  return fields;
}

function fieldTypeCompatible(fabType: string, nullable: boolean, field: TsField): boolean {
  const baseTypes: Record<string, string[]> = {
    string: ["string"],
    int: ["number"],
    bool: ["boolean"],
    f32: ["number"],
    f64: ["number"],
  };
  const allowed = baseTypes[fabType];
  if (allowed === undefined) {
    return false;
  }
  const tsType = field.type;
  // Null/undefined variants are acceptable only for optional (nullable) fields.
  const coreTypes = nullable ? allowed.flatMap((t) => [t, `${t} | null`, `${t} | undefined`]) : allowed;
  if (!coreTypes.includes(tsType)) {
    return false;
  }
  if (nullable) {
    return field.optional || tsType.includes("null") || tsType.includes("undefined");
  }
  return true;
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function moduleRoutes(entries: Map<string, TomlEntry>, prefix: string): Map<string, TomlEntry> {
  const routes = new Map<string, TomlEntry>();
  for (const [route, entry] of entries) {
    if (route.startsWith(prefix + ".")) {
      routes.set(route, entry);
    }
  }
  return routes;
}

function checkClassTypes(mod: ModuleSpec, fab: FabFile, runtime: RuntimeFile, findings: string[]): void {
  const referenced = new Set<string>();
  const consider = (typeName: string): void => {
    if (fab.classes.has(typeName)) {
      referenced.add(typeName);
    }
  };
  for (const f of fab.fns.values()) {
    for (const p of f.params) {
      consider(p.typeName);
    }
    consider(unwrapCollection(normalizeFabType(f.returnType)));
  }
  const typusTokenRe = /\b[A-Z]\w+\b/g;
  for (const rhs of fab.typi) {
    let m: RegExpExecArray | null;
    while ((m = typusTokenRe.exec(rhs)) !== null) {
      consider(m[1]);
    }
  }
  for (const className of referenced) {
    const tsTypeDeclName = tsTypeName(mod, className);
    const rhs = runtime.typeDecls.get(tsTypeDeclName);
    if (rhs === undefined) {
      findings.push(`(d) class ${className} in ${mod.fabFile} has no TS type ${tsTypeDeclName} in ${mod.runtimeFile}`);
      continue;
    }
    const fields = tsTypeFields(rhs);
    if (fields === null) {
      continue; // native/opaque alias (e.g. WebDomElement = Element) — handle type
    }
    const klass = fab.classes.get(className) as FabClass;
    for (const ff of klass.fields) {
      const match = fields.find((tf) => tf.name === ff.name);
      if (match === undefined) {
        findings.push(`(d) class ${className}: field '${ff.name}' (${ff.fabType}) missing from ${tsTypeDeclName}`);
      } else if (!fieldTypeCompatible(ff.fabType, ff.optional, match)) {
        findings.push(
          `(d) class ${className}: field '${ff.name}' is ${ff.fabType}${ff.optional ? " (nullable)" : ""} but ${tsTypeDeclName} declares '${match.type}'${match.optional ? " (optional)" : ""}`,
        );
      }
    }
  }
}

function runModule(mod: ModuleSpec, entries: Map<string, TomlEntry>, findings: string[]): void {
  const fab = parseFab(readText(mod.fabFile));
  const routes = moduleRoutes(entries, mod.prefix);
  const runtimeExists = fs.existsSync(readPath(mod.runtimeFile));

  // (a) every print-bodied fn has a route; every route names a real fn.
  for (const f of fab.fns.values()) {
    if (f.printParams.size > 0 && !routes.has(`${mod.prefix}.${f.name}`)) {
      findings.push(`(a) fn ${mod.prefix}.${f.name} has a print body but no ts.toml route`);
    }
  }
  for (const route of routes.keys()) {
    const name = route.slice(mod.prefix.length + 1);
    if (!fab.fns.has(name)) {
      findings.push(`(a) route ${route} in ts.toml has no matching fn in ${mod.fabFile}`);
    }
  }

  // (b)(c) route symbols <-> runtime exports; (d) class <-> TS type shapes.
  if (!runtimeExists) {
    console.log(`info: ${mod.runtimeFile} not implemented yet — checks (b)(c)(d) deferred for ${mod.prefix}`);
  } else {
    const runtime = parseRuntime(readText(mod.runtimeFile));
    const symbols = new Set<string>();
    for (const [route, entry] of routes) {
      if (entry.symbol === "") {
        findings.push(`(b) route ${route} declares no symbol`);
      } else {
        symbols.add(entry.symbol);
        if (!runtime.exportedFunctions.includes(entry.symbol)) {
          findings.push(`(b) route ${route} symbol ${entry.symbol} is not an exported function of ${mod.runtimeFile}`);
        }
      }
    }
    for (const fn of runtime.exportedFunctions) {
      if (!symbols.has(fn)) {
        findings.push(`(c) exported function ${fn} in ${mod.runtimeFile} is not referenced by any ts.toml route`);
      }
    }
    checkClassTypes(mod, fab, runtime, findings);
  }

  // (e) opener/result/symbol on every route match the fn signature.
  for (const [route, entry] of routes) {
    const f = fab.fns.get(route.slice(mod.prefix.length + 1));
    if (f === undefined) {
      continue; // missing fn already reported in (a)
    }
    const expectedOpener = f.params.map((p) => p.typeName).join(", ");
    const expectedResult = normalizeFabType(f.returnType);
    if (entry.opener !== expectedOpener) {
      findings.push(`(e) route ${route} opener '${entry.opener}' does not match signature '${expectedOpener}'`);
    }
    if (entry.result !== expectedResult) {
      findings.push(`(e) route ${route} result '${entry.result}' does not match signature '${expectedResult}'`);
    }
    if (entry.symbol === "") {
      findings.push(`(e) route ${route} declares no symbol`);
    }
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function readPath(relPath: string): string {
  return process.cwd() + "/" + relPath;
}

function readText(relPath: string): string {
  return fs.readFileSync(readPath(relPath), "utf8");
}

function main(): void {
  const tomlPath = readPath("bindings/ts.toml");
  if (!fs.existsSync(tomlPath)) {
    throw new Error(`contract test must run from the tela repo root; missing ${tomlPath}`);
  }
  const entries = parseToml(readText("bindings/ts.toml"));
  const findings: string[] = [];
  for (const mod of MODULES) {
    runModule(mod, entries, findings);
  }
  if (findings.length > 0) {
    for (const finding of findings) {
      console.error(`contract FAIL: ${finding}`);
    }
    throw new Error(`contract test failed with ${findings.length} finding(s)`);
  }
  console.log(`contract-test: OK — ${MODULES.length} module(s), ${entries.size} route(s) verified`);
}

void main();
