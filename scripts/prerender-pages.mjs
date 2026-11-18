// Renders every route of the built app to static HTML for GitHub Pages.
// Run after `PAGES_STATIC=1 npm run build`. Reads routes from src/routes +
// the resource catalog, drives the built worker's fetch handler in-process,
// and writes .output/public/<route>/index.html.
import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, ".output", "public");
const BASE = "/openatlasmap";

const { resources } = await import(pathToFileURL(join(root, "src/lib/resources.ts")).href);

// Resource detail pages (mirrors resourcePageUrl / resources.$id route).
const routes = [
  ["/", "index.html"],
  ["/about", "about/index.html"],
  ["/sitemap.xml", "sitemap.xml"],
  ...resources.map((r) => [`/resources/${encodeURIComponent(r.id)}`, `resources/${r.id}/index.html`]),
];

const worker = (await import(pathToFileURL(join(root, ".output", "server", "index.mjs")).href)).default;
if (typeof worker?.fetch !== "function") throw new Error("built worker has no fetch handler");

let failed = 0;
for (const [route, outPath] of routes) {
  const url = `http://localhost${BASE}${route === "/" ? "/" : route}`;
  // Cloudflare module ctx: the runtime binds ctx.waitUntil, so provide a stub.
  const response = await worker.fetch(new Request(url, { headers: { accept: "text/html,application/xml;q=0.9" } }), {}, { waitUntil: () => {}, passThroughOnException: () => {} });
  if (response.status !== 200) {
    console.error(`FAIL ${route} -> ${response.status}`);
    failed++;
    continue;
  }
  const body = await response.text();
  const file = join(outDir, outPath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body);
}

// The server bundle must not be published to Pages.
await rm(join(outDir, "server"), { recursive: true, force: true });
await rm(join(outDir, "_headers"), { force: true });

if (failed) {
  console.error(`prerender: ${failed}/${routes.length} routes failed`);
  process.exit(1);
}
console.log(`prerender: wrote ${routes.length} routes to .output/public`);
