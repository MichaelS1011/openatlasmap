import { createFileRoute } from "@tanstack/react-router";
import { AboutContent } from "@/components/about-content";
import { resources } from "@/lib/resources";
import { aboutStructuredData, siteUrl } from "@/lib/seo";
import { ui } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: ui.en.aboutTitle },
      { name: "description", content: ui.en.aboutDesc },
      { property: "og:title", content: ui.en.aboutOgTitle },
      { property: "og:description", content: ui.en.aboutOgDesc },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "de_DE" },
      { property: "og:url", content: `${siteUrl}/about/` },
    ],
    links: [
      { rel: "canonical", href: `${siteUrl}/about/` },
      { rel: "alternate", hrefLang: "en", href: `${siteUrl}/about/` },
      { rel: "alternate", hrefLang: "de", href: `${siteUrl}/de/about/` },
      { rel: "alternate", hrefLang: "x-default", href: `${siteUrl}/about/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(aboutStructuredData(resources.length, "en")),
      },
    ],
  }),
  component: () => <AboutContent lang="en" />,
});
