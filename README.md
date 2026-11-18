# OpenAtlas

**Free APIs & open data. Find your next possibility.**

[![Live site](https://img.shields.io/badge/Live-GitHub_Pages-2ea44f?style=flat-square)](https://michaels1011.github.io/openatlasmap/)
[![Deploy](https://img.shields.io/github/actions/workflow/status/MichaelS1011/openatlasmap/deploy-pages.yml?style=flat-square&label=deploy)](https://github.com/MichaelS1011/openatlasmap/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

OpenAtlas is a curated catalog of **free APIs and open datasets** — weather, finance, space, transport, AI, 3D assets, archives, and more. Every entry lists access conditions (key requirements, pricing, formats, limitations) so you know before you build whether a source fits your project.

🔭 **Live:** [michaels1011.github.io/openatlasmap](https://michaels1011.github.io/openatlasmap/)

## Features

- **Curated sources** across 20+ categories, each with verified access details — the catalog grows continuously
- **Instant client-side search** — matches name, description, category, and terms, no server needed
- **Filters** by type (API / dataset), category, no-key access, and fully free pricing
- **Detail pages** for every resource with canonical URLs and structured data (schema.org `Dataset`)
- **Collection** — bookmark resources during a session and export them as JSON
- **Static deployment** — every page is prerendered for fast loads and good SEO on GitHub Pages

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) + React 19 |
| Build | Vite 8, prerendered to static HTML for GitHub Pages |
| Styling | Tailwind CSS 4, shadcn/ui (Radix primitives) |
| Language | TypeScript (strict) |
| CI/CD | GitHub Actions → GitHub Pages |

## Quick start

Requires [Node.js](https://nodejs.org) 22+.

```sh
git clone https://github.com/MichaelS1011/openatlasmap.git
cd openatlasmap
npm install
npm run dev
```

Open http://localhost:5173 — the catalog and search run fully client-side.

## Production build (GitHub Pages)

The Pages deployment is a **fully static, prerendered** build:

```sh
PAGES_STATIC=1 npm run build        # builds with the /openatlasmap/ base path
node scripts/prerender-pages.mjs    # renders all routes to .output/public
```

Pushes to `main` run the same pipeline in
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
and publish to GitHub Pages automatically.

## Project structure

```
src/
  routes/            # file-based routes (index, resource detail, sitemap)
  lib/resources.ts   # the catalog — single source of truth for all pages
  components/        # UI components
scripts/
  prerender-pages.mjs  # static export for GitHub Pages
```

Adding a resource means editing `src/lib/resources.ts` only — the homepage,
detail pages, sitemap, and search all pick it up.

## Credits

Built with [Lovable](https://lovable.dev) and developed further locally. The full Lovable-hosted version runs at [open-data-treasure-map.lovable.app](https://open-data-treasure-map.lovable.app).

## License

[MIT](LICENSE) © Michael Soppa
