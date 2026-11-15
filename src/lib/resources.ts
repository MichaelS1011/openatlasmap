import { z } from "zod";

const plainText = z.string().transform((text) => text.replace(/\s*\(\[[^\]]*\]\(https?:\/\/[^)]*\)\)/g, "").replace(/\[([^\]]+)\]\(https?:\/\/[^)]*\)/g, "$1").trim());
export const resourceSchema = z.object({
  id: z.string(), name: plainText, description: plainText,
  url: z.string().url().refine((url) => url.startsWith("https://")),
  type: z.enum(["API", "Dataset"]), category: z.string(),
  access: z.enum(["No key", "API key", "Unknown"]),
  pricing: z.enum(["Free", "Free tier"]), format: z.string(),
  limitation: plainText,
});
export type Resource = z.infer<typeof resourceSchema>;
export const searchResultsSchema = z.object({ resources: z.array(resourceSchema).max(20) });
export const resources: Resource[] = [
  { id: "open-meteo", name: "Open-Meteo", description: "Global weather forecasts, historical climate data, and air quality. Built for your next weather-powered project.", url: "https://open-meteo.com/", type: "API", category: "Weather & Climate", access: "No key", pricing: "Free", format: "JSON", limitation: "Free for non-commercial use; usage limits apply." },
  { id: "world-bank", name: "World Bank Open Data", description: "Economic, development, and population indicators from countries around the world.", url: "https://data.worldbank.org/", type: "Dataset", category: "Finance & Economics", access: "No key", pricing: "Free", format: "CSV · JSON", limitation: "Check the license and attribution requirements of each dataset." },
  { id: "nasa", name: "NASA Open APIs", description: "Explore space with astronomy images, Earth observation, and data from NASA missions.", url: "https://api.nasa.gov/", type: "API", category: "Science & Space", access: "API key", pricing: "Free", format: "JSON", limitation: "A free API key is recommended; endpoint rate limits apply." },
  { id: "rest-countries", name: "REST Countries", description: "Country names, capitals, currencies, languages, and flags in one straightforward API.", url: "https://restcountries.com/", type: "API", category: "Geography", access: "No key", pricing: "Free", format: "JSON", limitation: "Community-operated service; no uptime guarantee." },
  { id: "open-library", name: "Open Library", description: "Millions of books, authors, editions, and cover images from the Internet Archive's open catalog.", url: "https://openlibrary.org/developers/api", type: "API", category: "Arts & Culture", access: "No key", pricing: "Free", format: "JSON", limitation: "Use responsibly and follow the documented request limits." },
  { id: "data-gov", name: "Data.gov", description: "Public US government datasets covering agriculture, cities, health, energy, and much more.", url: "https://data.gov/", type: "Dataset", category: "Government", access: "No key", pricing: "Free", format: "CSV · GeoJSON", limitation: "Formats, licenses, and access vary by publisher." },
  { id: "gbif", name: "GBIF Biodiversity Data", description: "Open species observations and biodiversity records contributed by institutions worldwide.", url: "https://www.gbif.org/developer/summary", type: "API", category: "Nature & Environment", access: "No key", pricing: "Free", format: "JSON · CSV", limitation: "Bulk downloads require an account; individual dataset licenses vary." },
  { id: "open-food", name: "Open Food Facts", description: "A collaborative database of food products, ingredients, nutrition, and packaging information.", url: "https://world.openfoodfacts.org/data", type: "Dataset", category: "Food & Health", access: "No key", pricing: "Free", format: "JSON · CSV", limitation: "ODbL attribution and share-alike conditions apply." },
];

export function filterResources(items: Resource[], filters: { type: string; category: string; noKey: boolean; fullyFree: boolean }) {
  return items.filter((r) => (filters.type === "All" || r.type === filters.type)
    && (filters.category === "All categories" || r.category === filters.category)
    && (!filters.noKey || r.access === "No key")
    && (!filters.fullyFree || r.pricing === "Free"));
}