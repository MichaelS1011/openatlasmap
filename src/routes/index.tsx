import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { parseCatalogSearch } from "@/lib/catalog-search";
import { resources } from "@/lib/resources";
import { catalogStructuredData, siteUrl } from "@/lib/seo";
import { catalogMeta } from "@/lib/i18n";

function HomePage() {
  return <CatalogPage lang="en" search={Route.useSearch()} />;
}

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  validateSearch: parseCatalogSearch,
  head: () => ({
    meta: [
      { title: catalogMeta.en.title },
      { name: "description", content: catalogMeta.en.description },
      { property: "og:title", content: catalogMeta.en.ogTitle },
      { property: "og:description", content: catalogMeta.en.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "de_DE" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `${siteUrl}/` },
    ],
    links: [
      { rel: "canonical", href: `${siteUrl}/` },
      { rel: "alternate", hrefLang: "en", href: `${siteUrl}/` },
      { rel: "alternate", hrefLang: "de", href: `${siteUrl}/de/` },
      { rel: "alternate", hrefLang: "x-default", href: `${siteUrl}/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(catalogStructuredData(resources, "en")),
      },
    ],
  }),
  component: HomePage,
});
