import type { Resource } from "./resources";
import { ui, type Lang } from "./i18n";

export const siteUrl = "https://michaels1011.github.io/openatlasmap";
export const resourcePageUrl = (id: string) => `${siteUrl}/resources/${encodeURIComponent(id)}`;
export const socialCardUrl = `${siteUrl}/social-card.png`;
export const catalogJsonUrl = `${siteUrl}/openatlas.json`;
export const llmsTxtUrl = `${siteUrl}/llms.txt`;

const person = {
  "@type": "Person",
  name: "Michael Soppa",
  sameAs: "https://www.linkedin.com/in/michael-soppa/",
};

const webSiteCopy: Record<Lang, { alternateName: string; description: string }> = {
  en: {
    alternateName: "OpenAtlas — Discover Free APIs & Open Data",
    description:
      "Curated directory of free APIs and open datasets with original source links, access requirements, and usage conditions.",
  },
  de: {
    alternateName: "OpenAtlas — Kostenlose APIs & Open Data entdecken",
    description:
      "Kuratiertes Verzeichnis kostenloser APIs und offener Datensätze mit Links zur Originalquelle, Zugangsvoraussetzungen und Nutzungsbedingungen.",
  },
};

const webSite = (lang: Lang) => ({
  "@type": "WebSite",
  "@id": lang === "en" ? `${siteUrl}/#website` : `${siteUrl}/de/#website`,
  name: "OpenAtlas",
  url: lang === "en" ? `${siteUrl}/` : `${siteUrl}/de/`,
  alternateName: webSiteCopy[lang].alternateName,
  description: webSiteCopy[lang].description,
  inLanguage: lang === "en" ? "en" : "de",
  creator: person,
  publisher: person,
});

export function resourceStructuredData(resource: Resource) {
  return {
    "@context": "https://schema.org",
    "@type": resource.type === "Dataset" ? "Dataset" : "WebAPI",
    name: resource.name,
    description: `${resource.description} ${resource.limitation}`,
    url: resourcePageUrl(resource.id),
    sameAs: resource.url,
    keywords: resource.category,
    isAccessibleForFree: true,
    ...(resource.type === "API" ? { documentation: resource.url } : {}),
  };
}

export function breadcrumbStructuredData(resource: Resource) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "OpenAtlas", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: resource.category, item: `${siteUrl}/#explore` },
      { "@type": "ListItem", position: 3, name: resource.name, item: resourcePageUrl(resource.id) },
    ],
  };
}

const itemListName: Record<Lang, string> = {
  en: "OpenAtlas free API and open data directory",
  de: "OpenAtlas-Verzeichnis kostenloser APIs und offener Datensätze",
};

export function catalogStructuredData(items: Resource[], lang: Lang = "en") {
  return {
    "@context": "https://schema.org",
    "@graph": [
      webSite(lang),
      {
        "@type": "ItemList",
        name: itemListName[lang],
        inLanguage: lang === "en" ? "en" : "de",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: resourcePageUrl(item.id),
        })),
      },
    ],
  };
}

const aboutPageCopy: Record<Lang, { name: string; description: string }> = {
  en: {
    name: "About OpenAtlas",
    description:
      "Mission and curation rules of OpenAtlas, a curated directory of free APIs and open datasets.",
  },
  de: {
    name: "Über OpenAtlas",
    description:
      "Mission und Kuratierungsregeln von OpenAtlas, einem kuratierten Verzeichnis kostenloser APIs und offener Datensätze.",
  },
};

const catalogCopy: Record<Lang, { description: string; measurementTechnique: string }> = {
  en: {
    description: "Machine-readable catalog of free APIs and open datasets, published as open data.",
    measurementTechnique: "manual curation; verification date recorded where available",
  },
  de: {
    description:
      "Maschinenlesbares Verzeichnis kostenloser APIs und offener Datensätze, veröffentlicht als Open Data.",
    measurementTechnique: "manuelle Kuratierung; Verifikationsdatum, wo verfügbar",
  },
};

export function aboutStructuredData(count: number, lang: Lang = "en") {
  const aboutId = lang === "en" ? `${siteUrl}/about/` : `${siteUrl}/de/about/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      webSite(lang),
      {
        "@type": "AboutPage",
        "@id": aboutId,
        url: aboutId,
        name: aboutPageCopy[lang].name,
        language: lang,
        description: aboutPageCopy[lang].description,
        isPartOf: { "@id": lang === "en" ? `${siteUrl}/#website` : `${siteUrl}/de/#website` },
        about: person,
      },
      {
        "@type": "DataCatalog",
        name: "OpenAtlas catalog",
        description: catalogCopy[lang].description,
        url: catalogJsonUrl,
        inLanguage: lang === "en" ? "en" : "de",
        license: "https://opensource.org/licenses/MIT",
        measurementTechnique: catalogCopy[lang].measurementTechnique,
        numberOfItems: count,
        publisher: person,
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: catalogJsonUrl,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: ui[lang].faqs.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
    ],
  };
}
