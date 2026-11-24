export const ALL_CATEGORIES = "All categories";

export type CatalogSearch = {
  q?: string | undefined;
  type?: "All" | "API" | "Dataset" | undefined;
  category?: string | undefined;
  noKey?: 1 | undefined;
  free?: 1 | undefined;
  sort?: "relevance" | "newest" | "name" | undefined;
  view?: "grid" | "list" | undefined;
  collection?: 1 | undefined;
};

const types = new Set(["All", "API", "Dataset"]);
const sorts = new Set(["relevance", "newest", "name"]);
const views = new Set(["grid", "list"]);

export function parseCatalogSearch(input: unknown): CatalogSearch {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const value = input as Record<string, unknown>;
  const result: CatalogSearch = {};

  if (typeof value["q"] === "string") result.q = value["q"].trim().slice(0, 300);
  if (typeof value["type"] === "string" && types.has(value["type"]))
    result.type = value["type"] as CatalogSearch["type"];
  if (typeof value["category"] === "string" && value["category"].length <= 120)
    result.category = value["category"];
  if (value["noKey"] === 1 || value["noKey"] === "1") result.noKey = 1;
  if (value["free"] === 1 || value["free"] === "1") result.free = 1;
  if (typeof value["sort"] === "string" && sorts.has(value["sort"]))
    result.sort = value["sort"] as CatalogSearch["sort"];
  if (typeof value["view"] === "string" && views.has(value["view"]))
    result.view = value["view"] as CatalogSearch["view"];
  if (value["collection"] === 1 || value["collection"] === "1") result.collection = 1;

  return result;
}

export function compactCatalogSearch(search: CatalogSearch): CatalogSearch {
  const result: CatalogSearch = {};
  if (search.q) result.q = search.q;
  if (search.type && search.type !== "All") result.type = search.type;
  if (search.category && search.category !== ALL_CATEGORIES) result.category = search.category;
  if (search.noKey === 1) result.noKey = 1;
  if (search.free === 1) result.free = 1;
  if (search.sort && search.sort !== "relevance") result.sort = search.sort;
  if (search.view && search.view !== "grid") result.view = search.view;
  if (search.collection === 1) result.collection = 1;
  return result;
}
