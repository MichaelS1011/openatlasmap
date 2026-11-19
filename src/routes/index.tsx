import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog-page";
import { resources } from "@/lib/resources";
import { catalogStructuredData, siteUrl } from "@/lib/seo";
import { catalogMeta } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: catalogMeta.en.title },
    { name: "description", content: catalogMeta.en.description },
    { property: "og:title", content: catalogMeta.en.ogTitle },
    { property: "og:description", content: catalogMeta.en.ogDescription },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "en_US" },
    { property: "og:locale:alternate", content: "de_DE" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:url", content: `${siteUrl}/` },
  ], links: [
    { rel: "canonical", href: `${siteUrl}/` },
    { rel: "alternate", hreflang: "en", href: `${siteUrl}/` },
    { rel: "alternate", hreflang: "de", href: `${siteUrl}/de/` },
    { rel: "alternate", hreflang: "x-default", href: `${siteUrl}/` },
  ],
  scripts: [{ type: "application/ld+json", children: JSON.stringify(catalogStructuredData(resources, "en")) }] }),
  component: () => <CatalogPage lang="en" />,
});
