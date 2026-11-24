import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { parseCatalogSearch } from "@/lib/catalog-search";
import { resources } from "@/lib/resources";
import { catalogStructuredData, siteUrl } from "@/lib/seo";
import { catalogMeta } from "@/lib/i18n";

function GermanHomePage() {
  return <CatalogPage lang="de" search={Route.useSearch()} />;
}

export const Route = createFileRoute("/de/")({
  staticData: { sitemap: true },
  validateSearch: parseCatalogSearch,
  head: () => ({
    meta: [
      { title: catalogMeta.de.title },
      { name: "description", content: catalogMeta.de.description },
      { property: "og:title", content: catalogMeta.de.ogTitle },
      { property: "og:description", content: catalogMeta.de.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `${siteUrl}/de/` },
    ],
    links: [
      { rel: "canonical", href: `${siteUrl}/de/` },
      { rel: "alternate", hrefLang: "en", href: `${siteUrl}/` },
      { rel: "alternate", hrefLang: "de", href: `${siteUrl}/de/` },
      { rel: "alternate", hrefLang: "x-default", href: `${siteUrl}/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(catalogStructuredData(resources, "de")),
      },
    ],
  }),
  component: GermanHomePage,
});
