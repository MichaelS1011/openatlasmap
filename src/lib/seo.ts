import type { Resource } from "./resources";

export const siteUrl = "https://open-data-treasure-map.lovable.app";
export const resourcePageUrl = (id: string) => `${siteUrl}/resources/${encodeURIComponent(id)}`;

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
      {
        "@type": "WebSite", "@id": `${siteUrl}/#website`,
        name: "OpenAtlas", url: siteUrl,
        description: "Find free APIs and open datasets with original source links, access requirements, and usage conditions.",
        inLanguage: "en",
        creator: { "@type": "Person", name: "Michael Soppa", sameAs: "https://www.linkedin.com/in/michael-soppa/" },
      },
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