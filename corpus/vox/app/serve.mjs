// Dependency-free static server for the built Vox app.
//
//   node serve.mjs [dist-dir] [port] [--no-worklet]     (defaults: ./dist, 8790)
//
// --no-worklet answers every /worklets/ request with 404, to try the app's
// main-thread fallback route.
//
// Serves on 127.0.0.1 only (localhost is a secure context, which AudioWorklet
// needs). Open http://127.0.0.1:8790/pages/index.html
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, join, extname, normalize, sep } from "node:path";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const noWorklet = process.argv.includes("--no-worklet");
const root = resolve(args[0] ?? "dist");
const port = Number(args[1] ?? process.env.PORT ?? 8790);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".map": "application/json; charset=utf-8",
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let path = decodeURIComponent(url.pathname);
  if (path === "/") {
    res.writeHead(302, { Location: "/pages/index.html" });
    res.end();
    return;
  }
  if (noWorklet && path.startsWith("/worklets/")) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("worklets disabled");
    return;
  }
  const file = normalize(join(root, path));
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403).end("forbidden");
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) throw new Error("directory");
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end(`not found: ${path}`);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`vox: http://127.0.0.1:${port}/pages/index.html  (serving ${root})`);
});
