import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Grid2X2,
  List,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { AtlasCards, AtlasContours } from "@/components/atlas-stage";
import { BrandMark } from "@/components/brand-mark";
import { CatalogFilters } from "@/components/catalog-filters";
import { ResourceCard } from "@/components/resource-card";
import { SourceDialog } from "@/components/source-dialog";
import { ThemeToggle, useScrolled } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ALL_CATEGORIES,
  compactCatalogSearch,
  parseCatalogSearch,
  type CatalogSearch,
} from "@/lib/catalog-search";
import { catLabel, ui, type Lang } from "@/lib/i18n";
import { filterResources, resources, searchResources, type Resource } from "@/lib/resources";

const PAGE_SIZE = 60;
const noKeyTotal = resources.filter((resource) => resource.access === "No key").length;
const apiTotal = resources.filter((resource) => resource.type === "API").length;
const datasetTotal = resources.filter((resource) => resource.type === "Dataset").length;
let sessionSaved: Resource[] = [];

export function CatalogPage({ lang, search }: { lang: Lang; search: CatalogSearch }) {
  const t = ui[lang];
  const navigate = useNavigate();
  const scrolled = useScrolled();
  const inputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<Resource[]>(sessionSaved);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  // Static exports serve query-free HTML, so URL state starts after hydration.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const activeSearch = hydrated ? search : {};
  const searchTerm = activeSearch.q ?? "";
  const type = activeSearch.type ?? "All";
  const category = activeSearch.category ?? ALL_CATEGORIES;
  const noKey = activeSearch.noKey === 1;
  const fullyFree = activeSearch.free === 1;
  const sort = activeSearch.sort ?? "relevance";
  const view = activeSearch.view ?? "grid";
  const collection = activeSearch.collection === 1;
  const hasQuery = searchTerm.trim().length >= 2;
  const hasFilters = type !== "All" || category !== ALL_CATEGORIES || noKey || fullyFree;
  const showResults = collection || hasQuery || hasFilters;

  const updateSearch = useCallback(
    (patch: Partial<CatalogSearch>, replace = true) => {
      void navigate({
        to: lang === "en" ? "/" : "/de",
        search: (previous) => compactCatalogSearch({ ...parseCatalogSearch(previous), ...patch }),
        replace,
      });
    },
    [lang, navigate],
  );

  const runSearch = useCallback(
    (term: string, replace = true) => {
      updateSearch(
        {
          q: term,
          type: undefined,
          category: undefined,
          noKey: undefined,
          free: undefined,
          collection: undefined,
        },
        replace,
      );
    },
    [updateSearch],
  );

  const showExplore = useCallback(() => {
    void navigate({ to: lang === "en" ? "/" : "/de", search: {} });
  }, [lang, navigate]);

  useEffect(() => {
    sessionSaved = saved;
  }, [saved]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [searchTerm, type, category, noKey, fullyFree, collection, sort, view]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const editing =
        target instanceof Element &&
        target.matches("input, textarea, select, [contenteditable='true']");
      if (event.key === "/" && !editing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current && searchTerm) {
        runSearch("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [runSearch, searchTerm]);

  const base = collection ? saved : hasQuery ? searchResources(searchTerm) : resources;
  const filtered = [...filterResources(base, { type, category, noKey, fullyFree })];
  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "newest") {
    filtered.sort(
      (a, b) =>
        (b.verifiedAt ?? "").localeCompare(a.verifiedAt ?? "") || a.name.localeCompare(b.name),
    );
  }

  const categories = Array.from(new Set(base.map((resource) => resource.category))).sort();
  const baseApis = base.filter((resource) => resource.type === "API").length;
  const baseDatasets = base.length - baseApis;
  const baseNoKey = base.filter((resource) => resource.access === "No key").length;
  const queryTitle = collection
    ? t.resultsCollection
    : hasQuery
      ? searchTerm.trim()
      : category !== ALL_CATEGORIES
        ? catLabel(lang, category)
        : type !== "All"
          ? type === "API"
            ? t.apis
            : t.datasets
          : t.resultsExplore;

  function resetFilters() {
    updateSearch({
      type: undefined,
      category: undefined,
      noKey: undefined,
      free: undefined,
    });
  }

  function toggleSave(resource: Resource) {
    setSaved((previous) =>
      previous.some((item) => item.url === resource.url)
        ? previous.filter((item) => item.url !== resource.url)
        : [...previous, resource],
    );
  }

  function exportCollection() {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "openatlas-collection.json";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className={`catalog-page ${showResults ? "has-results" : "is-landing"}`}>
        <header className={`site-header shell${scrolled ? " is-scrolled" : ""}`}>
          <Link
            className="brand"
            to={lang === "en" ? "/" : "/de"}
            search={{}}
            aria-label={t.homeAria}
          >
            <span className="brand-symbol">
              <BrandMark size={30} />
            </span>
            openatlas<span className="text-primary">.</span>
          </Link>
          <nav className="main-nav" aria-label={t.mainNavAria}>
            <Button
              variant="ghost"
              onClick={showExplore}
              className={`nav-item nav-explore${!collection ? " active" : ""}`}
            >
              {t.navExplore}
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                updateSearch(
                  {
                    collection: collection ? undefined : 1,
                    q: undefined,
                    type: undefined,
                    category: undefined,
                    noKey: undefined,
                    free: undefined,
                  },
                  false,
                )
              }
              className={`nav-item nav-collection${collection ? " active" : ""}`}
              aria-label={t.navCollection}
            >
              <Bookmark size={14} />
              <span className="collection-label">{t.navCollection}</span>
              {saved.length > 0 && <span className="collection-count">{saved.length}</span>}
            </Button>
            <Button asChild variant="ghost" className="nav-item nav-about">
              <Link to={lang === "en" ? "/about" : "/de/about"}>{t.navAbout}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="nav-item lang-switch"
              aria-label={t.langSwitchLabel}
            >
              <Link to={lang === "en" ? "/de" : "/"} search={activeSearch}>
                {lang === "en" ? "Deutsch" : "English"}
              </Link>
            </Button>
            <ThemeToggle lang={lang} />
          </nav>
          <span className="header-note">
            <span className="status-dot" />
            {t.headerNote}
          </span>
        </header>

        <main id="explore">
          {!showResults && (
            <h1 className="sr-only">
              {t.h1a} {t.h1b}
            </h1>
          )}
          <section
            className={`search-region${showResults ? " results-mode" : ""}`}
            aria-label={t.searchAria}
          >
            <AtlasContours />
            {!showResults && <AtlasCards lang={lang} />}
            {!showResults && (
              <span className="vertical-note" aria-hidden="true">
                Catalog / Open sources / 2026
              </span>
            )}
            <div className="search-dock">
              <p className="search-kicker">
                <span />
                {showResults ? t.searchResult : t.discoveryIndex}
                <span />
              </p>
              <form
                className="atlas-search"
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (hasQuery) inputRef.current?.blur();
                }}
              >
                <Search size={23} strokeWidth={1.7} aria-hidden="true" />
                <label className="sr-only" htmlFor="atlas-search-input">
                  {t.searchAria}
                </label>
                <input
                  ref={inputRef}
                  id="atlas-search-input"
                  type="search"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(event) => runSearch(event.target.value)}
                  maxLength={300}
                  autoComplete="off"
                  spellCheck={false}
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    type="button"
                    aria-label={t.clearSearch}
                    title={t.clearSearch}
                    onClick={() => {
                      runSearch("");
                      inputRef.current?.focus();
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  className="search-submit"
                  type="submit"
                  aria-label={t.findResources}
                  title={t.findResources}
                >
                  <ArrowRight size={21} />
                </button>
              </form>
              {showResults ? (
                <div className="search-ledger" aria-live="polite">
                  <span>
                    <strong>{base.length}</strong> {t.sources}
                  </span>
                  <span>
                    {baseApis} {t.apis}
                  </span>
                  <span>
                    {baseDatasets} {t.datasets}
                  </span>
                  <span>
                    {baseNoKey} {t.withoutKey}
                  </span>
                </div>
              ) : (
                <div className="search-ledger landing-ledger">
                  <span>
                    <strong>{resources.length}</strong> {t.sources}
                  </span>
                  <span>
                    {apiTotal} {t.apis}
                  </span>
                  <span>
                    {datasetTotal} {t.datasets}
                  </span>
                  <span>
                    {noKeyTotal} {t.withoutKey}
                  </span>
                </div>
              )}
              {!showResults && (
                <p className="search-shortcut">
                  <kbd>/</kbd> {t.searchShortcut}
                </p>
              )}
            </div>
          </section>

          {showResults && (
            <section className="results-layout" aria-label={t.resultsSearch}>
              <aside className="query-panel">
                <p className="query-eyebrow">
                  {collection ? t.savedIndex : hasQuery ? t.searchResult : t.browseIndex}
                </p>
                <h1 className="query-title">{queryTitle}</h1>
                <div className="query-count">
                  <strong>{filtered.length}</strong>
                  <span>{t.sourcesFound}</span>
                </div>
                <p className="query-description">
                  {collection
                    ? t.descCollection
                    : hasQuery
                      ? t.descSearchFor(searchTerm.trim(), resources.length)
                      : t.descExplore}
                </p>
                <dl className="query-stats">
                  <div>
                    <dt>{t.apis}</dt>
                    <dd>{baseApis}</dd>
                  </div>
                  <div>
                    <dt>{t.datasets}</dt>
                    <dd>{baseDatasets}</dd>
                  </div>
                  <div>
                    <dt>{t.withoutKey}</dt>
                    <dd>{baseNoKey}</dd>
                  </div>
                </dl>
                <CatalogFilters
                  lang={lang}
                  base={base}
                  categories={categories}
                  type={type}
                  category={category}
                  noKey={noKey}
                  fullyFree={fullyFree}
                  onType={(value) => updateSearch({ type: value })}
                  onCategory={(value) => updateSearch({ category: value })}
                  onNoKey={(value) => updateSearch({ noKey: value ? 1 : undefined })}
                  onFullyFree={(value) => updateSearch({ free: value ? 1 : undefined })}
                  onReset={resetFilters}
                />
              </aside>

              <section className="results-panel" aria-labelledby="results-heading">
                <div className="results-header">
                  <div>
                    <p className="section-index">
                      OA / {collection ? t.savedIndex : t.discoveryIndex}
                    </p>
                    <h2 id="results-heading">
                      {collection
                        ? t.resultsCollection
                        : hasQuery
                          ? t.resultsSearch
                          : t.resultsExplore}
                    </h2>
                  </div>
                  <div className="results-tools">
                    {collection && saved.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t.exportCollection}
                        aria-label={t.exportCollection}
                        onClick={exportCollection}
                      >
                        <ArrowDownToLine size={15} />
                      </Button>
                    )}
                    <select
                      className="sort-select"
                      aria-label={t.sortAria}
                      value={sort}
                      onChange={(event) =>
                        updateSearch({ sort: event.target.value as CatalogSearch["sort"] })
                      }
                    >
                      <option value="relevance">
                        {hasQuery ? t.sortRelevance : t.sortRecommended}
                      </option>
                      <option value="newest">{t.sortNewest}</option>
                      <option value="name">{t.sortName}</option>
                    </select>
                    <div className="view-switch">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t.gridView}
                        title={t.gridView}
                        aria-pressed={view === "grid"}
                        onClick={() => updateSearch({ view: "grid" })}
                      >
                        <Grid2X2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t.listView}
                        title={t.listView}
                        aria-pressed={view === "list"}
                        onClick={() => updateSearch({ view: "list" })}
                      >
                        <List size={14} />
                      </Button>
                    </div>
                  </div>
                </div>

                {filtered.length > 0 ? (
                  <div className={`resource-grid${view === "list" ? " list" : ""}`}>
                    {filtered.slice(0, visible).map((resource, index) => (
                      <ResourceCard
                        key={resource.url}
                        lang={lang}
                        resource={resource}
                        index={index}
                        featured={index === 0 && !collection}
                        saved={saved.some((item) => item.url === resource.url)}
                        onSave={() => toggleSave(resource)}
                        onDetails={() => setSelected(resource)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Search size={28} />
                    <h3>{collection ? t.emptyCollectionTitle : t.emptyNoMatchTitle}</h3>
                    <p>{collection ? t.emptyCollectionText : t.emptyNoMatchText}</p>
                    <Button variant="outline" onClick={collection ? showExplore : resetFilters}>
                      {collection ? t.exploreResources : t.resetFilters}
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                )}
                {filtered.length > visible && (
                  <div className="load-more">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisible((value) => value + PAGE_SIZE)}
                    >
                      {t.loadMore}
                      <ArrowDownToLine size={14} />
                    </Button>
                    <span>{t.showing(Math.min(visible, filtered.length), filtered.length)}</span>
                  </div>
                )}
                <div className="result-notice">
                  <ShieldCheck size={15} />
                  <span>{t.notice}</span>
                </div>
              </section>
            </section>
          )}

          <footer className="site-footer shell">
            <span className="brand">
              <BrandMark size={21} />
              openatlas.
            </span>
            <span>{t.footerTagline}</span>
            <span className="footer-links">
              <Button asChild variant="link" className="h-auto p-0 text-xs font-normal">
                <Link to={lang === "en" ? "/about" : "/de/about"}>{t.navAbout}</Link>
              </Button>
              <a
                href="https://github.com/MichaelS1011/openatlasmap"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://github.com/MichaelS1011/openatlasmap/issues/new?title=Suggest%20a%20free%20API%20or%20dataset"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.footerSuggest}
                <ArrowUpRight size={11} />
              </a>
            </span>
          </footer>
        </main>

        <SourceDialog
          lang={lang}
          resource={selected}
          saved={selected ? saved.some((item) => item.url === selected.url) : false}
          onClose={() => setSelected(null)}
          onSave={() => {
            if (selected) toggleSave(selected);
          }}
        />
      </div>
    </TooltipProvider>
  );
}
