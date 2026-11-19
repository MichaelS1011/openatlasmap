import { createFileRoute } from "@tanstack/react-router";
import { AboutContent } from "@/components/about-content";
import { resources } from "@/lib/resources";
import { aboutStructuredData, siteUrl } from "@/lib/seo";
import { ui } from "@/lib/i18n";

export const Route = createFileRoute("/de/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: ui.de.aboutTitle },
      { name: "description", content: ui.de.aboutDesc },
      { property: "og:title", content: ui.de.aboutOgTitle },
      { property: "og:description", content: ui.de.aboutOgDesc },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:url", content: `${siteUrl}/de/about/` },
    ],
    links: [
      { rel: "canonical", href: `${siteUrl}/de/about/` },
      { rel: "alternate", hreflang: "en", href: `${siteUrl}/about/` },
      { rel: "alternate", hreflang: "de", href: `${siteUrl}/de/about/` },
      { rel: "alternate", hreflang: "x-default", href: `${siteUrl}/about/` },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(aboutStructuredData(resources.length, "de")) }],
  }),
  component: () => <AboutContent lang="de" />,
});
