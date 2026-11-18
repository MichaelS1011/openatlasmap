import { describe, expect, it } from "vitest";
import { filterResources, licenseSpecified, resources, resourceSchema, searchResources } from "@/lib/resources";
import { curatedCategories } from "@/lib/resource-categories";

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
  it.each(["kaggle-datasets", "libraries-io"])("keeps %s behind the key-required filter", (id) => {
    expect(resources.find((r) => r.id === id)?.access).toBe("API key");
  });
  it("does not present Hugging Face Hub as fully free", () => {
    expect(resources.find((r) => r.id === "hugging-face-hub")?.pricing).toBe("Free tier");
  });
  it("keeps every researched batch entry evidence-backed and unique", () => {
    const added = resources.filter((r) => r.verifiedAt === "2026-11-17");
    expect(resources.length).toBeGreaterThan(100);
    expect(new Set(added.map((r) => r.url)).size).toBe(added.length);
    for (const r of added) {
      expect(r.evidenceUrl?.startsWith("https://")).toBe(true);
      expect((r.evidenceNote ?? "").length).toBeGreaterThan(20);
      expect(r.limitation.length).toBeGreaterThan(20);
    }
  });
  it("assigns every curated entry to a defined subject category", () => {
    expect(new Set(curatedCategories).size).toBe(curatedCategories.length);
    for (const r of resources) expect(curatedCategories.includes(r.category)).toBe(true);
  });
});

describe("searchResources", () => {
  it("ranks name hits above description-only hits", () => {
    const hits = searchResources("weather");
    expect(hits.length).toBeGreaterThan(3);
    const nameIndexes = hits.map((r, i) => r.name.toLowerCase().includes("weather") ? i : -1).filter((i) => i >= 0);
    const otherIndexes = hits.map((r, i) => r.name.toLowerCase().includes("weather") ? -1 : i).filter((i) => i >= 0);
    expect(nameIndexes.length).toBeGreaterThan(0);
    expect(otherIndexes.length).toBeGreaterThan(0);
    expect(Math.max(...nameIndexes)).toBeLessThan(Math.min(...otherIndexes));
  });
  it("requires every word to match and ignores short or unknown terms", () => {
    expect(searchResources("")).toEqual([]);
    expect(searchResources("zzzzqqq")).toEqual([]);
    expect(searchResources("real time weather").length).toBeGreaterThan(0);
  });
});

describe("licenseSpecified", () => {
  it("flags only the generic placeholder limitations", () => {
    const generic = resources.filter((r) => !licenseSpecified(r));
    expect(generic.length).toBe(10);
    for (const r of generic) expect(r.limitation.toLowerCase()).toContain("check the site for current terms");
    expect(licenseSpecified(resources.find((r) => r.id === "open-meteo")!)).toBe(true);
  });
});
