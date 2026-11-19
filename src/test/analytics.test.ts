import { describe, expect, it } from "vitest";
import { berlinMidnightIso, countCountries, goatTotalUrl } from "@/lib/analytics";

describe("goatTotalUrl", () => {
  it("builds the total endpoint with key, range and grouping", () => {
    const url = new URL(goatTotalUrl({ key: "k", from: "2026-11-19T00:00:00.000Z", to: "2026-11-19T12:00:00.000Z", group: "country", limit: 250 }));
    expect(url.origin + url.pathname).toBe("https://openatlas.goatcounter.com/api/v1/total");
    expect(url.searchParams.get("access_key")).toBe("k");
    expect(url.searchParams.get("from")).toBe("2026-11-19T00:00:00.000Z");
    expect(url.searchParams.get("group")).toBe("country");
    expect(url.searchParams.get("limit")).toBe("250");
  });
  it("omits optional parameters when not requested", () => {
    const url = new URL(goatTotalUrl({ key: "k" }));
    expect(url.searchParams.has("from")).toBe(false);
    expect(url.searchParams.has("group")).toBe(false);
  });
});

describe("berlinMidnightIso", () => {
  it("returns midnight UTC+2 (summer) for a noon UTC instant", () => {
    expect(berlinMidnightIso(new Date("2026-07-15T12:00:00Z"))).toBe("2026-07-14T22:00:00.000Z");
  });
  it("returns midnight UTC+1 (winter) for a noon UTC instant", () => {
    expect(berlinMidnightIso(new Date("2026-01-15T12:00:00Z"))).toBe("2026-01-14T23:00:00.000Z");
  });
});

describe("countCountries", () => {
  it("counts distinct country groups and ignores unknown/zero buckets", () => {
    expect(countCountries({ "country:DE": 5, "country:US": 2, "country:XX": 0, unknown: 9 })).toBe(2);
  });
  it("returns zero for missing pages", () => {
    expect(countCountries(undefined)).toBe(0);
  });
});
