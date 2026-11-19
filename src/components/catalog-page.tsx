import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Atom, ArrowDownToLine, ArrowRight, ArrowUpRight, Bookmark, Boxes, Briefcase, Brain, Check, CheckCircle2, CloudSun, Code2, Compass, Cpu, Database, Dna, Factory, FlaskConical, Globe2, GraduationCap, Grid2X2, Landmark, Languages, Leaf, Library, List, Map as MapIcon, Palette, Rocket, Scale, Search, ShieldCheck, ShieldHalf, SlidersHorizontal, Sparkles, TrainFront, TrendingUp, Trophy, Users, Utensils, Waves, Wheat, X, Zap } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { filterResources, licenseSpecified, resources, searchResources, type Resource } from "@/lib/resources";
import { siteUrl } from "@/lib/seo";
import { ThemeToggle, useScrolled } from "@/components/site-chrome";
import { categoryGroups } from "@/lib/resource-categories";
import { badgeLabel, badgeTip, catLabel, groupLabel, popularTopics, ui, type Lang } from "@/lib/i18n";
import glassImage from "@/assets/discovery-glass.jpg";

const icons = {
  "AI & Machine Learning": Brain, "Software & Developer Tools": Code2, Cybersecurity: ShieldHalf, "3D & Graphics": Boxes, Technology: Cpu,
  Research: FlaskConical, "Science & Space": Rocket, "Biology & Genomics": Dna, "Chemistry & Materials": Atom, "Industry & Materials": Factory,
  "Weather & Climate": CloudSun, Geography: MapIcon, "Nature & Environment": Leaf, "Oceans & Water": Waves, Agriculture: Wheat, Energy: Zap, "Transport & Mobility": TrainFront,
  Government: Landmark, "Finance & Economics": TrendingUp, "Business & Trade": Briefcase, "Society & Development": Users, Education: GraduationCap, "Law & Justice": Scale, "Food & Health": Utensils,
  "Archives & Libraries": Library, "Arts & Culture": Palette, "Data & Knowledge": Database, "Language & Linguistics": Languages, "Sports & Games": Trophy, Other: Compass,
};

function Tip({ label, children }: { label: string; children: ReactNode }) {
  return <Tooltip><TooltipTrigger asChild>{children}</TooltipTrigger><TooltipContent side="bottom" className="max-w-56 text-xs leading-relaxed">{label}</TooltipContent></Tooltip>;
}

function ResourceCard({ lang, resource, saved, onSave, onDetails }: { lang: Lang; resource: Resource; saved: boolean; onSave: () => void; onDetails: () => void }) {
  const t = ui[lang];
  const Icon = icons[resource.category as keyof typeof icons] || Code2;
  const dataset = resource.type === "Dataset";
  return <article className="resource-card">
    <div className="card-top">
      <div className={`resource-icon ${dataset ? "dataset" : ""}`}><Icon size={22} strokeWidth={1.6} /></div>
      <div className="flex items-center gap-2">
        <Tip label={badgeTip(lang, resource.type)}><span className={`type-badge ${dataset ? "dataset" : ""}`}>{dataset ? <Database size={11} /> : <Code2 size={11} />}{badgeLabel(lang, resource.type)}</span></Tip>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={onSave} aria-label={saved ? t.removeAria(resource.name) : t.saveAria(resource.name)} title={saved ? t.removeTitle : t.saveTitle} aria-pressed={saved}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /></Button>
      </div>
    </div>
    <h3>{resources.some((item) => item.id === resource.id && item.url === resource.url) ? <Link to="/resources/$id" params={{ id: resource.id }}>{resource.name}</Link> : resource.name}</h3><p>{resource.description}</p>
    <div className="card-tags"><Tip label={badgeTip(lang, resource.pricing)}><span className="free"><CheckCircle2 size={11} />{badgeLabel(lang, resource.pricing)}</span></Tip><span>·</span><Tip label={badgeTip(lang, resource.access)}><span>{badgeLabel(lang, resource.access)}</span></Tip><span className="tag">{resource.format}</span>{resource.verifiedAt && resource.verifiedAt >= "2026-11-01" && <span className="tag">{t.newBadge}</span>}{!licenseSpecified(resource) && <Tip label={t.licenseTip}><span className="tag">{t.licenseUnspecified}</span></Tip>}</div>
    <div className="card-footer"><span>{catLabel(lang, resource.category)}</span><Button variant="link" className="source-link" onClick={onDetails}>{t.viewSource} <ArrowUpRight size={13} /></Button></div>
  </article>;
}

const COLLECTION_KEY = "openatlas-collec…ions";
const PAGE_SIZE = 60;
const noKeyCount = resources.filter((r) => r.access === "No key").length;
const topCategories = (() => {
  const counts = new Map<string, number>();
  for (const r of resources) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8);
})();

export function CatalogPage({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const p = lang === "en" ? { home: "/", about: "/about", other: "/de/", otherLabel: "Deutsch" } : { home: "/de/", about: "/de/about", other: "/", otherLabel: "English" };
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All categories");
  const [noKey, setNoKey] = useState(false);
  const [fullyFree, setFullyFree] = useState(false);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("relevance");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [saved, setSaved] = useState<Resource[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem(COLLECTION_KEY) ?? "[]") as Resource[]; } catch { return []; }
  });
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(saved));
  }, [saved]);
  const [collection, setCollection] = useState(false);
  const scrolled = useScrolled();
  const [selected, setSelected] = useState<Resource | null>(null);
  const [searchedAt, setSearchedAt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const base = collection ? saved : searchTerm.trim().length >= 2 ? searchResources(searchTerm) : resources;
  const filtered = filterResources(base, { type, category, noKey, fullyFree });
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "newest") filtered.sort((a, b) => (b.verifiedAt ?? "").localeCompare(a.verifiedAt ?? "") || a.name.localeCompare(b.name));
  const categories = Array.from(new Set(base.map((r) => r.category))).sort();
  useEffect(() => { setVisible(PAGE_SIZE); }, [searchTerm, type, category, noKey, fullyFree, collection, sort]);

  function resetFilters() { setType("All"); setCategory("All categories"); setNoKey(false); setFullyFree(false); }
  function showExplore() { setCollection(false); setSearchTerm(""); setSearchedAt(""); resetFilters(); }
  function search(term: string) { setCollection(false); resetFilters(); setSearchTerm(term); setSearchedAt(term.trim().length >= 2 ? new Date().toISOString() : ""); }
  function toggleSave(resource: Resource) { setSaved((prev) => prev.some((r) => r.url === resource.url) ? prev.filter((r) => r.url !== resource.url) : [...prev, resource]); }
  function exportCollection() {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "openatlas-collection.json"; a.click(); URL.revokeObjectURL(url);
  }

  return <TooltipProvider delayDuration={300}>
    <header className={`site-header shell${scrolled ? " is-scrolled" : ""}`}>
      <a className="brand" href={`${siteUrl}${p.home}`} aria-label={t.homeAria}><span className="brand-symbol"><BrandMark size={30} /></span>openatlas<span className="text-primary">.</span></a>
      <nav className="main-nav" aria-label={t.mainNavAria}>
        <Button variant="ghost" onClick={showExplore} className={`nav-item ${!collection ? "active" : ""}`}>{t.navExplore}</Button>
        <Button variant="ghost" onClick={() => { setCollection(true); resetFilters(); }} className={`nav-item ${collection ? "active" : ""}`}><Bookmark size={14} /><span className="collection-label">{t.navCollection}</span>{saved.length > 0 && <span>{saved.length}</span>}</Button>
        <Button asChild variant="ghost" className="nav-item"><a href={`${siteUrl}${p.about}`}>{t.navAbout}</a></Button>
        <Button asChild variant="ghost" className="nav-item" aria-label={t.langSwitchLabel}><a href={`${siteUrl}${p.other}`}>{p.otherLabel}</a></Button>
        <ThemeToggle />
      </nav>
      <span className="header-note"><span className="status-dot" />{t.headerNote}</span>
    </header>

    <section className="hero">
      <img src={glassImage} className="hero-image" alt={t.heroImageAlt} width={1536} height={1024} />
      <div className="hero-content shell"><div className="eyebrow"><Sparkles size={13} /> {t.eyebrow}</div>
        <h1>{t.h1a}<br /><span>{t.h1b}</span></h1>
        <p className="hero-description">{t.heroDescA}<br className="hidden sm:block" /> {t.heroDescB}</p>
        <div className="hero-points"><span><Check size={13} />{t.vettedSources(resources.length)}</span><span><Globe2 size={13} />{t.workWithoutKey(noKeyCount)}</span><span><ShieldCheck size={13} />{t.licenseNotes}</span></div>
      </div>
    </section>

    <main className="discovery shell" id="explore">
      <form className="searchbox" onSubmit={(e) => { e.preventDefault(); }}>
        <Search size={21} className="text-muted-foreground shrink-0" />
        <input ref={inputRef} aria-label={t.searchAria} placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => search(e.target.value)} maxLength={300} />
        {searchTerm && <Button type="button" variant="ghost" size="icon" aria-label={t.clearSearch} title={t.clearSearch} onClick={() => { setSearchTerm(""); inputRef.current?.focus(); }}><X size={14} /></Button>}
        <Button className="search-submit" type="submit" aria-label={t.findResources} title={t.findResources}><Sparkles size={15} /><span className="search-label">{t.findResources}</span></Button>
      </form>
      <div className="suggestions"><span>{t.popularSearches}</span>{popularTopics.map((topic) => <Button key={topic} variant="outline" className="suggestion" onClick={() => search(topic)}>{topic}<ArrowUpRight size={10} /></Button>)}</div>
      <div className="suggestions" aria-label={t.browse}><span>{t.browse}</span>{topCategories.map(([name, count]) => <Button key={name} variant={category === name ? "default" : "outline"} className="suggestion" aria-pressed={category === name} onClick={() => { setCollection(false); setCategory(category === name ? "All categories" : name); setSearchedAt(""); setSearchTerm(""); }}>{catLabel(lang, name)}<span className="count">{count}</span></Button>)}</div>

      <div className="catalog-layout">
        <aside aria-label={t.filters}><div className="filter-header"><h2 className="flex items-center gap-2"><SlidersHorizontal size={14} />{t.filters}</h2><Button variant="link" className="h-auto p-0 text-[11px] text-muted-foreground" onClick={resetFilters}>{t.reset}</Button></div>
          <div className="filters">
            <div className="filter-group resource-type"><h3>{t.resourceType}</h3>{[{ value: "All", label: t.allResources }, { value: "API", label: t.apis }, { value: "Dataset", label: t.datasets }].map((option) => <label className="filter-row" key={option.value}><input type="radio" name="type" checked={type === option.value} onChange={() => setType(option.value)} />{option.label}<span className="count">{base.filter((r) => option.value === "All" || r.type === option.value).length}</span></label>)}</div>
            <div className="filter-group category-group"><h3>{t.categoryLabel}</h3><select className="category-select" aria-label={t.categoryLabel} value={category} onChange={(e) => setCategory(e.target.value)}><option>All categories</option>{categoryGroups.map((group) => { const available = group.categories.filter((c) => categories.includes(c)); return available.length ? <optgroup label={groupLabel(lang, group.label)} key={group.label}>{available.map((c) => <option key={c} value={c}>{catLabel(lang, c)} ({base.filter((r) => r.category === c).length})</option>)}</optgroup> : null; })}{categories.filter((c) => !categoryGroups.some((group) => group.categories.some((known) => known === c))).map((c) => <option key={c} value={c}>{catLabel(lang, c)} ({base.filter((r) => r.category === c).length})</option>)}</select></div>
            <div className="filter-group access-group"><h3>{t.accessPricing}</h3><label className="filter-row"><input type="checkbox" checked={noKey} onChange={(e) => setNoKey(e.target.checked)} />{t.noKeyRequired}</label><label className="filter-row"><input type="checkbox" checked={fullyFree} onChange={(e) => setFullyFree(e.target.checked)} />{t.fullyFreeOnly}</label></div>
          </div>
          <div className="sidebar-bottom"><Globe2 size={20} className="mb-3 text-primary" /><strong className="text-foreground font-medium">{t.sidebarStrong}</strong><p className="mt-2">{t.sidebarSub}</p></div>
        </aside>

        <section aria-label={t.resultsSearch}>
          <div className="results-header"><div><div className="results-title"><h2>{collection ? t.resultsCollection : searchTerm ? t.resultsSearch : t.resultsExplore}</h2><span className="result-count">{filtered.length}</span></div><p className="results-description">{collection ? t.descCollection : searchTerm ? t.descSearchFor(searchTerm, resources.length) : t.descExplore}</p></div>
            <div className="results-tools">{collection && saved.length > 0 && <Button variant="ghost" size="icon" title={t.exportCollection} aria-label={t.exportCollection} onClick={exportCollection}><ArrowDownToLine size={15} /></Button>}<select className="sort-select" aria-label={t.sortAria} value={sort} onChange={(e) => setSort(e.target.value)}><option value="relevance">{searchTerm ? t.sortRelevance : t.sortRecommended}</option><option value="newest">{t.sortNewest}</option><option value="name">{t.sortName}</option></select><div className="view-switch"><Button variant="ghost" size="icon" className="h-6 w-6" aria-label={t.gridView} title={t.gridView} aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 size={13} /></Button><Button variant="ghost" size="icon" className="h-6 w-6" aria-label={t.listView} title={t.listView} aria-pressed={view === "list"} onClick={() => setView("list")}><List size={14} /></Button></div></div>
          </div>
          {filtered.length ? <><div className={`resource-grid ${view === "list" ? "list" : ""}`}>{filtered.slice(0, visible).map((r) => <ResourceCard key={r.url} lang={lang} resource={r} saved={saved.some((s) => s.url === r.url)} onSave={() => toggleSave(r)} onDetails={() => setSelected(r)} />)}</div>{filtered.length > visible && <div className="flex flex-col items-center gap-2 pt-8"><Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>{t.loadMore}<ArrowDownToLine size={14} /></Button><span className="text-xs text-muted-foreground">{t.showing(Math.min(visible, filtered.length), filtered.length)}</span></div>}</> : <div className="empty-state"><Search size={28} className="mx-auto text-primary" /><h3>{collection ? t.emptyCollectionTitle : t.emptyNoMatchTitle}</h3><p>{collection ? t.emptyCollectionText : t.emptyNoMatchText}</p><Button variant="outline" onClick={collection ? showExplore : resetFilters}>{collection ? t.exploreResources : t.resetFilters}<ArrowRight size={14} /></Button></div>}
          <div className="result-notice"><ShieldCheck size={15} className="shrink-0 mt-0.5" /><span>{searchedAt && !collection ? t.searchedAt(new Date(searchedAt).toLocaleTimeString(t.searchTimeLocale, { hour: "2-digit", minute: "2-digit" })) : ""}{t.notice}</span></div>
        </section>
      </div>
    </main>
    <footer className="site-footer shell"><span className="brand"><BrandMark size={21} />openatlas.</span><span>{t.footerTagline}</span><span className="flex items-center gap-3"><Button asChild variant="link" className="h-auto p-0 text-xs font-normal"><a href={`${siteUrl}${p.about}`}>{t.navAbout}</a></Button><a className="text-xs text-muted-foreground hover:text-foreground" href="https://github.com/MichaelS1011/openatlasmap" target="_blank" rel="noopener noreferrer">GitHub</a><a className="text-xs text-muted-foreground hover:text-foreground" href="https://github.com/MichaelS1011/openatlasmap/issues/new?title=Suggest%20a%20free%20API%20or%20dataset" target="_blank" rel="noopener noreferrer">{t.footerSuggest}</a></span></footer>

    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle className="font-display text-2xl">{selected?.name}</DialogTitle><DialogDescription>{selected?.description}</DialogDescription></DialogHeader>{selected && <div className="space-y-5"><div className="flex flex-wrap gap-2"><Tip label={badgeTip(lang, selected.type)}><span className="type-badge">{badgeLabel(lang, selected.type)}</span></Tip><Tip label={badgeTip(lang, selected.pricing)}><span className="type-badge">{badgeLabel(lang, selected.pricing)}</span></Tip><Tip label={badgeTip(lang, selected.access)}><span className="type-badge">{badgeLabel(lang, selected.access)}</span></Tip><span className="type-badge">{selected.format}</span>{!licenseSpecified(selected) && <Tip label={t.licenseTip}><span className="type-badge">{t.licenseUnspecified}</span></Tip>}</div><div className="border-t pt-4"><h3 className="font-semibold text-sm mb-2">{t.accessConditions}</h3><p className="text-sm text-muted-foreground leading-relaxed">{selected.limitation}</p></div><p className="text-xs text-muted-foreground break-all">{selected.url}</p><div className="flex gap-3"><Button asChild><a href={selected.url} target="_blank" rel="noopener noreferrer">{t.openOriginalSource} <ArrowUpRight size={15} /></a></Button><Button variant="outline" onClick={() => toggleSave(selected)}><Bookmark size={14} />{saved.some((r) => r.url === selected.url) ? t.saved : t.save}</Button></div></div>}</DialogContent></Dialog>
  </TooltipProvider>;
}
