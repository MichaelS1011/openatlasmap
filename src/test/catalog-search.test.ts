import { describe, expect, it } from "vitest";
import { ALL_CATEGORIES, compactCatalogSearch, parseCatalogSearch } from "@/lib/catalog-search";

describe("catalog search state", () => {
  it("keeps supported values and trims the query", () => {
    expect(
      parseCatalogSearch({
        q: "  3-D  ",
        type: "API",
        category: "3D & Graphics",
        noKey: 1,
        free: 1,
        sort: "name",
        view: "list",
        collection: 1,
        ignored: "value",
      }),
    ).toEqual({
      q: "3-D",
      type: "API",
      category: "3D & Graphics",
      noKey: 1,
      free: 1,
      sort: "name",
      view: "list",
      collection: 1,
    });
  });

  it("drops unsupported values and limits input length", () => {
    expect(
      parseCatalogSearch({
        q: "x".repeat(400),
        type: "Archive",
        category: "x".repeat(121),
        noKey: "true",
        free: true,
        sort: "popular",
        view: "cards",
        collection: "yes",
      }),
    ).toEqual({ q: "x".repeat(300) });
    expect(parseCatalogSearch(null)).toEqual({});
    expect(parseCatalogSearch([])).toEqual({});
  });

  it("removes defaults from generated search URLs", () => {
    expect(
      compactCatalogSearch({
        q: "weather",
        type: "All",
        category: ALL_CATEGORIES,
        sort: "relevance",
        view: "grid",
      }),
    ).toEqual({ q: "weather" });
  });
});
