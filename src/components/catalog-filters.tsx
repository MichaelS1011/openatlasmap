import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_CATEGORIES } from "@/lib/catalog-search";
import { categoryGroups } from "@/lib/resource-categories";
import { catLabel, groupLabel, ui, type Lang } from "@/lib/i18n";
import type { Resource } from "@/lib/resources";

type CatalogFiltersProps = {
  lang: Lang;
  base: Resource[];
  categories: string[];
  type: "All" | "API" | "Dataset";
  category: string;
  noKey: boolean;
  fullyFree: boolean;
  onType: (type: "All" | "API" | "Dataset") => void;
  onCategory: (category: string) => void;
  onNoKey: (value: boolean) => void;
  onFullyFree: (value: boolean) => void;
  onReset: () => void;
};

export function CatalogFilters({
  lang,
  base,
  categories,
  type,
  category,
  noKey,
  fullyFree,
  onType,
  onCategory,
  onNoKey,
  onFullyFree,
  onReset,
}: CatalogFiltersProps) {
  const t = ui[lang];
  const unknownCategories = categories.filter(
    (item) => !categoryGroups.some((group) => group.categories.some((value) => value === item)),
  );

  return (
    <div className="catalog-filters">
      <div className="filter-heading">
        <h2>{t.filters}</h2>
        <Button variant="link" className="reset-button" onClick={onReset}>
          <RotateCcw size={12} />
          {t.reset}
        </Button>
      </div>
      <fieldset className="filter-group">
        <legend>{t.resourceType}</legend>
        {(
          [
            { value: "All", label: t.allResources },
            { value: "API", label: t.apis },
            { value: "Dataset", label: t.datasets },
          ] as const
        ).map((option) => (
          <label className="filter-row" key={option.value}>
            <input
              type="radio"
              name="resource-type"
              checked={type === option.value}
              onChange={() => onType(option.value)}
            />
            <span>{option.label}</span>
            <span className="count">
              {
                base.filter((resource) => option.value === "All" || resource.type === option.value)
                  .length
              }
            </span>
          </label>
        ))}
      </fieldset>
      <div className="filter-group">
        <label htmlFor="catalog-category">{t.categoryLabel}</label>
        <select
          id="catalog-category"
          className="category-select"
          value={category}
          onChange={(event) => onCategory(event.target.value)}
        >
          <option value={ALL_CATEGORIES}>{t.allCategories}</option>
          {categoryGroups.map((group) => {
            const available = group.categories.filter((item) => categories.includes(item));
            return available.length ? (
              <optgroup label={groupLabel(lang, group.label)} key={group.label}>
                {available.map((item) => (
                  <option key={item} value={item}>
                    {catLabel(lang, item)} (
                    {base.filter((resource) => resource.category === item).length})
                  </option>
                ))}
              </optgroup>
            ) : null;
          })}
          {unknownCategories.map((item) => (
            <option key={item} value={item}>
              {catLabel(lang, item)} ({base.filter((resource) => resource.category === item).length}
              )
            </option>
          ))}
        </select>
      </div>
      <fieldset className="filter-group access-group">
        <legend>{t.accessPricing}</legend>
        <label className="filter-row">
          <input
            type="checkbox"
            checked={noKey}
            onChange={(event) => onNoKey(event.target.checked)}
          />
          <span>{t.noKeyRequired}</span>
        </label>
        <label className="filter-row">
          <input
            type="checkbox"
            checked={fullyFree}
            onChange={(event) => onFullyFree(event.target.checked)}
          />
          <span>{t.fullyFreeOnly}</span>
        </label>
      </fieldset>
    </div>
  );
}
