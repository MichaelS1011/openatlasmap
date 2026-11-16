import { describe, expect, it } from "vitest";
import { filterResources, resources, resourceSchema } from "@/lib/resources";

describe("Free resource discovery", () => {
  it("excludes free-tier entries when fully free is selected", () => {
    const first = resources[0];
    if (!first) throw new Error("Expected a curated resource");
    const limited = { ...first, id: "limited", pricing: "Free tier" as const };
    expect(filterResources([limited], { type: "All", category: "All categories", noKey: false, fullyFree: true })).toEqual([]);
  });
  it("only returns keyless resources when no API key is selected", () => {
    const result = filterResources(resources, { type: "All", category: "All categories", noKey: true, fullyFree: false });
    expect(result.some((r) => r.id === "nasa")).toBe(false);
    expect(result.some((r) => r.id === "open-meteo")).toBe(true);
  });
  it("rejects unsafe source links", () => {
    expect(resourceSchema.safeParse({ ...resources[0], url: "javascript:alert(1)" }).success).toBe(false);
  });
  it("keeps every curated source valid and uniquely identifiable", () => {
    for (const resource of resources) expect(resourceSchema.safeParse(resource).success).toBe(true);
    expect(new Set(resources.map((r) => r.id)).size).toBe(resources.length);
    expect(new Set(resources.map((r) => r.url)).size).toBe(resources.length);
  });
  it("keeps openFDA behind the key-required filter", () => {
    expect(resources.find((r) => r.id === "openfda")?.access).toBe("API key");
    expect(filterResources(resources, { type: "All", category: "All categories", noKey: true, fullyFree: false }).some((r) => r.id === "openfda")).toBe(false);
  });
  it("does not present the OpenAlex free tier as fully free", () => {
    expect(resources.find((r) => r.id === "openalex")?.pricing).toBe("Free tier");
    expect(filterResources(resources, { type: "All", category: "All categories", noKey: false, fullyFree: true }).some((r) => r.id === "openalex")).toBe(false);
  });
  it.each(["eia", "fec", "fooddata-central"])("excludes %s from keyless discovery", (id) => {
    expect(resources.find((r) => r.id === id)?.access).toBe("API key");
    expect(filterResources(resources, { type: "All", category: "All categories", noKey: true, fullyFree: false }).some((r) => r.id === id)).toBe(false);
  });
  it.each(["smithsonian-3d", "materials-project", "fred"])("keeps %s behind the key-required filter", (id) => {
    expect(resources.find((r) => r.id === id)?.access).toBe("API key");
  });
  it("lists the new 3D, industry, and research categories", () => {
    for (const c of ["3D & Graphics", "Industry & Materials", "Research"]) expect(resources.some((r) => r.category === c)).toBe(true);
  });
});
