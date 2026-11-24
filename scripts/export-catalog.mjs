// Publishes the curated catalog as open data:
//   public/openatlas.json   — machine-readable catalog (MIT)
//   public/llms-full.txt    — the same catalog as plain text for LLM context
// Run after editing src/lib/resources.ts: `npm run export:catalog`
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { resources, licenseSpecified } = await import(
  pathToFileURL(join(root, "src/lib/resources.ts")).href
);

const catalog = {
  name: "OpenAtlas catalog",
  description:
    "Curated directory of free APIs and open datasets. Every entry links to the original source and states pricing, access requirements, and known usage limits. Curation rules: free to start, original source only, clear conditions, evidence where available.",
  site: "https://michaels1011.github.io/openatlasmap/",
  about: "https://michaels1011.github.io/openatlasmap/about/",
  license: "https://opensource.org/licenses/MIT",
  generator: "https://github.com/MichaelS1011/openatlasmap",
  generatedAt: new Date().toISOString().slice(0, 10),
  count: resources.length,
  resources: resources.map(
    ({
      id,
      name,
      url,
      description,
      category,
      type,
      pricing,
      access,
      format,
      limitation,
      verifiedAt,
    }) => ({
      id,
      name,
      url,
      description,
      category,
      type,
      pricing,
      access,
      format,
      limitation,
      verifiedAt,
      licenseSpecified: licenseSpecified({ limitation }),
    }),
  ),
};

await writeFile(join(root, "public", "openatlas.json"), JSON.stringify(catalog, null, 2) + "\n");

const lines = [
  "# OpenAtlas — full catalog",
  "",
  `Curated directory of ${resources.length} free APIs and open datasets (MIT license).`,
  "Fields per entry: category, type, pricing, access, limitation, review date where recorded, canonical page, original source.",
  "",
];
for (const r of catalog.resources) {
  lines.push(`## ${r.name}`, "", r.description, "");
  lines.push(`- Category: ${r.category}`);
  lines.push(`- Type: ${r.type} | Pricing: ${r.pricing} | Access: ${r.access}`);
  lines.push(`- Limitation: ${r.limitation}`);
  lines.push(
    `- License stated at source: ${r.licenseSpecified ? "yes" : "no — check the original source"}`,
  );
  lines.push(`- Reviewed: ${r.verifiedAt ?? "not recorded"}`);
  lines.push(
    `- OpenAtlas page: https://michaels1011.github.io/openatlasmap/resources/${encodeURIComponent(r.id)}`,
  );
  lines.push(`- Original source: ${r.url}`, "");
}
await writeFile(join(root, "public", "llms-full.txt"), lines.join("\n"));

console.log(
  `export:catalog -> public/openatlas.json + public/llms-full.txt (${resources.length} resources)`,
);
