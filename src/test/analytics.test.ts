import { describe, expect, it } from "vitest";
import {
  berlinDateIso,
  countCountryStats,
  goatAuthHeaders,
  goatCountryUrl,
  goatTotalUrl,
} from "@/lib/analytics";

describe("goatTotalUrl", () => {
  it("builds the v0 stats/total endpoint with start and end", () => {
    const url = new URL(goatTotalUrl({ start: "2026-11-19T00:00:00.000Z", end: "2026-11-19T12:00:00.000Z" }));
    expect(url.origin + url.pathname).toBe("https://openatlas.goatcounter.com/api/v0/stats/total");
    expect(url.searchParams.get("start")).toBe("2026-11-19T00:00:00.000Z");
    expect(url.searchParams.get("end")).toBe("2026-11-19T12:00:00.000Z");
  });
  it("omits optional parameters when not requested", () => {
    const url = new URL(goatTotalUrl());
    expect(url.search).toBe("");
  });
});

describe("goatCountryUrl", () => {
  it("targets the countries stats endpoint with a limit", () => {
    const url = new URL(goatCountryUrl({ limit: 100 }));
    expect(url.pathname).toBe("/api/v0/stats/countries");
    expect(url.searchParams.get("limit")).toBe("100");
  });
});

describe("goatAuthHeaders", () => {
  it("sends the key as a bearer token", () => {
    expect(goatAuthHeaders("k123").Authorization).toBe("Bearer k123");
  });
});

describe("berlinDateIso", () => {
  it("returns the Berlin calendar date for a noon UTC instant", () => {
    expect(berlinDateIso(new Date("2026-07-15T12:00:00Z"))).toBe("2026-07-15");
  });
  it("rolls to the next day once Berlin passes midnight", () => {
    expect(berlinDateIso(new Date("2026-01-15T23:30:00Z"))).toBe("2026-01-16");
  });
});

describe("countCountryStats", () => {
  it("counts buckets with positive counts and skips catch-alls", () => {
    expect(countCountryStats([
      { name: "Germany", count: 5 },
      { name: "United States", count: 2 },
      { name: "Unknown", count: 9 },
      { name: "(not set)", count: 3 },
      { name: "Antarctica", count: 0 },
    ])).toBe(2);
  });
  it("returns zero for missing or malformed stats", () => {
    expect(countCountryStats(undefined)).toBe(0);
    expect(countCountryStats([])).toBe(0);
  });
});
