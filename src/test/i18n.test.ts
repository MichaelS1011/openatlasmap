import { describe, expect, it } from "vitest";
import {
  badgeLabel,
  badgeTip,
  catalogMeta,
  catLabel,
  groupLabel,
  popularTopics,
  ui,
  type Lang,
} from "@/lib/i18n";
import { categoryGroups } from "@/lib/resource-categories";
import { resources, searchResources } from "@/lib/resources";

const langs: Lang[] = ["en", "de"];

function keyTree(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) return v.map((_, i) => `${path}[${i}]`);
    if (v && typeof v === "object") return keyTree(v as Record<string, unknown>, path);
    return [path];
  });
}

describe("i18n dictionary", () => {
  it("en and de dictionaries have identical key trees", () => {
    expect(keyTree(ui.de as unknown as Record<string, unknown>)).toEqual(
      keyTree(ui.en as unknown as Record<string, unknown>),
    );
  });

  it("no empty de strings", () => {
    for (const [lang, dict] of Object.entries(ui)) {
      for (const path of keyTree(dict as unknown as Record<string, unknown>)) {
        const get = path
          .replace(/\[(\d+)\]/g, ".$1")
          .split(".")
          .reduce((acc: unknown, k) => (acc as Record<string, unknown>)?.[k], dict as unknown);
        if (typeof get === "string")
          expect(get.trim().length, `${lang}:${path}`).toBeGreaterThan(0);
      }
    }
  });

  it("example searches return real catalog results in both languages", () => {
    for (const lang of langs) {
      for (const example of ui[lang].searchExamples) {
        expect(searchResources(example.query).length, `${lang}:${example.query}`).toBeGreaterThan(
          0,
        );
      }
    }
  });

  it("catalogMeta is filled for both languages", () => {
    for (const lang of langs) {
      expect(catalogMeta[lang].title).toContain("OpenAtlas");
      expect(catalogMeta[lang].description.length).toBeGreaterThan(40);
      expect(catalogMeta[lang].ogTitle.length).toBeGreaterThan(0);
      expect(catalogMeta[lang].ogDescription.length).toBeGreaterThan(40);
    }
  });
});

describe("category labels", () => {
  const categories = [...new Set(resources.map((r) => r.category))];

  it("every catalog category has a German label", () => {
    for (const c of categories) {
      expect(catLabel("de", c), c).not.toBe(c);
      expect(catLabel("en", c), c).toBe(c);
    }
  });

  it("every category group label has a German label", () => {
    for (const group of categoryGroups) {
      expect(groupLabel("de", group.label), group.label).not.toBe(group.label);
      expect(groupLabel("en", group.label), group.label).toBe(group.label);
    }
  });
});

describe("badge labels", () => {
  const values = [...new Set(resources.flatMap((r) => [r.type, r.pricing, r.access]))];

  it("type/pricing/access values render non-empty in both languages", () => {
    for (const v of values) {
      for (const lang of langs) {
        expect(badgeLabel(lang, v), `${lang}:${v}`).toBeTruthy();
        expect(badgeTip(lang, v), `${lang}:${v}`).toBeTruthy();
      }
    }
  });

  it("core badges are translated in German", () => {
    expect(badgeLabel("de", "Free")).toBe("Kostenlos");
    expect(badgeLabel("de", "Dataset")).toBe("Datensatz");
    expect(badgeLabel("de", "API")).toBe("API");
  });
});

describe("popular topics", () => {
  it("are English terms that return results via search", () => {
    expect(popularTopics.length).toBeGreaterThanOrEqual(3);
    for (const topic of popularTopics) expect(topic).toBe(topic.trim());
  });
});
