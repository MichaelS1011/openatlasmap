import type { Resource } from "./resources";

export const siteUrl = "https://michaels1011.github.io/openatlasmap";
export const resourcePageUrl = (id: string) => `${siteUrl}/resources/${encodeURIComponent(id)}`;
export const socialCardUrl = `${siteUrl}/social-card.png`;
export const catalogJsonUrl = `${siteUrl}/openatlas.json`;
export const llmsTxtUrl = `${siteUrl}/llms.txt`;

const person = { "@type": "Person", name: "Michael Soppa", sameAs: "https://www.linkedin.com/in/michael-soppa/" };
const webSite = {
  "@type": "WebSite", "@id": `${siteUrl}/#website`,
  name: "OpenAtlas", url: `${siteUrl}/`,
  alternateName: "OpenAtlas — Discover Free APIs & Open Data",
  description: "Curated directory of free APIs and open datasets with original source links, access requirements, and usage conditions.",
  inLanguage: "en",
  creator: person,
  publisher: person,
};

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

export function catalogStructuredData(items: Resource[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      webSite,
      {
        "@type": "ItemList", name: "OpenAtlas free API and open data directory",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem", position: index + 1, name: item.name, url: resourcePageUrl(item.id),
        })),
      },
    ],
  };
}

const faq = [
  {
    "@type": "Question",
    name: "What is OpenAtlas?",
    acceptedAnswer: { "@type": "Answer", text: "OpenAtlas is a free, curated directory of APIs and open datasets. Every entry links to the original source and states the access requirements, pricing model, and usage limits, so you can judge in seconds whether a resource fits your project." },
  },
  {
    "@type": "Question",
    name: "Are the APIs and datasets on OpenAtlas really free?",
    acceptedAnswer: { "@type": "Answer", text: "Every listed resource is free to start: entries are either completely free or offer a genuine free tier. Badges show the pricing model and whether an API key is required, and the original source always remains the authority for current licenses and limits." },
  },
  {
    "@type": "Question",
    name: "How does OpenAtlas decide what gets listed?",
    acceptedAnswer: { "@type": "Answer", text: "A resource is added only if it is free to use, links to its original source rather than a mirror, is not a duplicate of an existing entry, and fits one of the subject categories. Each entry carries a verification date, and outdated entries are corrected or removed through GitHub issues." },
  },
  {
    "@type": "Question",
    name: "Can I suggest a resource for OpenAtlas?",
    acceptedAnswer: { "@type": "Answer", text: "Yes. Use the Suggest a resource form on GitHub. Include the original source URL, what it offers, and whether an API key is needed. The catalog is also published as open data in JSON format at /openatlas.json." },
  },
];

export function aboutStructuredData(count: number) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      webSite,
      {
        "@type": "AboutPage", "@id": `${siteUrl}/about/`, url: `${siteUrl}/about/`,
        name: "About OpenAtlas", language: "en",
        description: "Mission and curation rules of OpenAtlas, a curated directory of free APIs and open datasets.",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: person,
      },
      {
        "@type": "DataCatalog", name: "OpenAtlas catalog",
        description: "Machine-readable catalog of free APIs and open datasets, published as open data.",
        url: catalogJsonUrl,
        inLanguage: "en",
        license: "https://opensource.org/licenses/MIT",
        measurementTechnique: "manual curation with verification dates",
        numberOfItems: count,
        publisher: person,
        distribution: { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: catalogJsonUrl },
      },
      { "@type": "FAQPage", mainEntity: faq },
    ],
  };
}