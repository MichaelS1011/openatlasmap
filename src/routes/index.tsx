import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Atom, ArrowDownToLine, ArrowRight, ArrowUpRight, Bookmark, Briefcase, Brain, Bus, Check, CheckCircle2, CloudSun, Code2, Compass, Cpu, Database, Dna, Droplets, Factory, FlaskConical, Globe2, GraduationCap, Grid2X2, Languages, Leaf, Library, List, Map as MapIcon, Orbit, Palette, Scale, Search, Shield, ShieldCheck, SlidersHorizontal, Sprout, Sparkles, Trophy, Users, Utensils, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { filterResources, resources, searchResources, type Resource } from "@/lib/resources";
import { catalogStructuredData, siteUrl } from "@/lib/seo";
import { categoryGroups } from "@/lib/resource-categories";
import glassImage from "@/assets/discovery-glass.jpg";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "OpenAtlas — Discover Free APIs & Open Data" },
    { name: "description", content: "Browse a curated catalog of free APIs and open datasets. Explore original sources, formats, access requirements, and free-use limits with OpenAtlas." },
    { property: "og:title", content: "OpenAtlas — Discover Free APIs & Open Data" },
    { property: "og:description", content: "Find the right free API or open dataset for your next idea, with instant filtering and original source links." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:url", content: `${siteUrl}/` },
  ], links: [{ rel: "canonical", href: `${siteUrl}/` }],
  scripts: [{ type: "application/ld+json", children: JSON.stringify(catalogStructuredData(resources)) }] }),
  component: Index,
});

const icons = {
  "AI & Machine Learning": Brain, "Software & Developer Tools": Code2, Cybersecurity: Shield, "3D & Graphics": Cpu, Technology: Cpu,
  Research: FlaskConical, "Science & Space": Orbit, "Biology & Genomics": Dna, "Chemistry & Materials": Atom, "Industry & Materials": Factory,
  "Weather & Climate": CloudSun, Geography: MapIcon, "Nature & Environment": Leaf, "Oceans & Water": Droplets, Agriculture: Sprout, Energy: Zap, "Transport & Mobility": Bus,
  Government: ShieldCheck, "Finance & Economics": Globe2, "Business & Trade": Briefcase, "Society & Development": Users, Education: GraduationCap, "Law & Justice": Scale, "Food & Health": Utensils,
  "Archives & Libraries": Library, "Arts & Culture": Palette, "Data & Knowledge": Database, "Language & Linguistics": Languages, "Sports & Games": Trophy, Other: Compass,
};
const badgeTips: Record<string, string> = {
  Free: "Costs nothing to use.",
  "Free tier": "Free to start — you only pay if you need more usage later.",
  "No key": "You can use it right away, no sign-up required.",
  "API key": "You need a free account at the source to get a personal key first.",
  Unknown: "We haven't verified the access rules yet — check the source site.",
  API: "A service your code can call over the internet.",
  Dataset: "A collection of data you can download and explore.",
};
function Tip({ label, children }: { label: string; children: ReactNode }) {
  return <Tooltip><TooltipTrigger asChild>{children}</TooltipTrigger><TooltipContent side="bottom" className="max-w-56 text-xs leading-relaxed">{label}</TooltipContent></Tooltip>;
}
const topics = ["Weather & climate", "Finance", "Space", "Public transport", "AI & machine learning"];

function ResourceCard({ resource, saved, onSave, onDetails }: { resource: Resource; saved: boolean; onSave: () => void; onDetails: () => void }) {
  const Icon = icons[resource.category as keyof typeof icons] || Code2;
  const dataset = resource.type === "Dataset";
  return <article className="resource-card">
    <div className="card-top">
      <div className={`resource-icon ${dataset ? "dataset" : ""}`}><Icon size={22} strokeWidth={1.6} /></div>
      <div className="flex items-center gap-2">
        <Tip label={badgeTips[resource.type] ?? resource.type}><span className={`type-badge ${dataset ? "dataset" : ""}`}>{dataset ? <Database size={11} /> : <Code2 size={11} />}{resource.type}</span></Tip>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={onSave} aria-label={saved ? `Remove ${resource.name} from collection` : `Save ${resource.name}`} title={saved ? "Remove from collection" : "Save to collection"} aria-pressed={saved}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /></Button>
      </div>
    </div>
    <h3>{resources.some((item) => item.id === resource.id && item.url === resource.url) ? <Link to="/resources/$id" params={{ id: resource.id }}>{resource.name}</Link> : resource.name}</h3><p>{resource.description}</p>
    <div className="card-tags"><Tip label={badgeTips[resource.pricing] ?? resource.pricing}><span className="free"><CheckCircle2 size={11} />{resource.pricing}</span></Tip><span>·</span><Tip label={badgeTips[resource.access] ?? resource.access}><span>{resource.access}</span></Tip><span className="tag">{resource.format}</span>{resource.verifiedAt && resource.verifiedAt >= "2026-11-01" && <span className="tag">New</span>}</div>
    <div className="card-footer"><span>{resource.category}</span><Button variant="link" className="source-link" onClick={onDetails}>View source <ArrowUpRight size={13} /></Button></div>
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

function Index() {
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
    <header className="site-header shell">
      <a className="brand" href={`${siteUrl}/`} aria-label="OpenAtlas home"><span className="brand-symbol"><Orbit size={22} strokeWidth={1.7} /></span>openatlas<span className="text-primary">.</span></a>
      <nav className="main-nav" aria-label="Main navigation">
        <Button variant="ghost" onClick={showExplore} className={`nav-item ${!collection ? "active" : ""}`}>Explore</Button>
        <Button variant="ghost" onClick={() => { setCollection(true); resetFilters(); }} className={`nav-item ${collection ? "active" : ""}`}><Bookmark size={14} /><span className="collection-label">My collection</span>{saved.length > 0 && <span>{saved.length}</span>}</Button>
        <Button asChild variant="ghost" className="nav-item"><Link to="/about">About</Link></Button>
      </nav>
      <span className="header-note"><span className="status-dot" />Open data. Endless possibilities.</span>
    </header>

    <section className="hero">
      <img src={glassImage} className="hero-image" alt="Sculptural green glass arcs representing connected open data" width={1536} height={1024} />
      <div className="hero-content shell"><div className="eyebrow"><Sparkles size={13} /> A world of data, open to you</div>
        <h1>Free APIs & open data.<br /><span>Find your next possibility.</span></h1>
        <p className="hero-description">Discover the APIs and datasets behind your next big idea.<br className="hidden sm:block" /> Tell us what you need. We'll find where to start.</p>
        <div className="hero-points"><span><Check size={13} />{resources.length} vetted sources</span><span><Globe2 size={13} />{noKeyCount} work without a key</span><span><ShieldCheck size={13} />License notes on every source</span></div>
      </div>
    </section>

    <main className="discovery shell" id="explore">
      <form className="searchbox" onSubmit={(e) => { e.preventDefault(); }}>
        <Search size={21} className="text-muted-foreground shrink-0" />
        <input ref={inputRef} aria-label="Search APIs and datasets" placeholder="What are you looking for? Try ‘real-time weather data’" value={searchTerm} onChange={(e) => search(e.target.value)} maxLength={300} />
        {searchTerm && <Button type="button" variant="ghost" size="icon" aria-label="Clear search" title="Clear search" onClick={() => { setSearchTerm(""); inputRef.current?.focus(); }}><X size={14} /></Button>}
        <Button className="search-submit" type="submit" aria-label="Find resources" title="Find resources"><Sparkles size={15} /><span className="search-label">Find resources</span></Button>
      </form>
      <div className="suggestions"><span>Popular searches:</span>{topics.map((topic) => <Button key={topic} variant="outline" className="suggestion" onClick={() => search(topic)}>{topic}<ArrowUpRight size={10} /></Button>)}</div>
      <div className="suggestions" aria-label="Browse by category"><span>Browse:</span>{topCategories.map(([name, count]) => <Button key={name} variant={category === name ? "default" : "outline"} className="suggestion" aria-pressed={category === name} onClick={() => { setCollection(false); setCategory(category === name ? "All categories" : name); setSearchedAt(""); setSearchTerm(""); }}>{name}<span className="count">{count}</span></Button>)}</div>

      <div className="catalog-layout">
        <aside aria-label="Resource filters"><div className="filter-header"><h2 className="flex items-center gap-2"><SlidersHorizontal size={14} />Filters</h2><Button variant="link" className="h-auto p-0 text-[11px] text-muted-foreground" onClick={resetFilters}>Reset</Button></div>
          <div className="filters">
            <div className="filter-group resource-type"><h3>Resource type</h3>{[{ value: "All", label: "All resources" }, { value: "API", label: "APIs" }, { value: "Dataset", label: "Datasets" }].map((option) => <label className="filter-row" key={option.value}><input type="radio" name="type" checked={type === option.value} onChange={() => setType(option.value)} />{option.label}<span className="count">{base.filter((r) => option.value === "All" || r.type === option.value).length}</span></label>)}</div>
            <div className="filter-group category-group"><h3>Category</h3><select className="category-select" aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}><option>All categories</option>{categoryGroups.map((group) => { const available = group.categories.filter((c) => categories.includes(c)); return available.length ? <optgroup label={group.label} key={group.label}>{available.map((c) => <option key={c} value={c}>{c} ({base.filter((r) => r.category === c).length})</option>)}</optgroup> : null; })}{categories.filter((c) => !categoryGroups.some((group) => group.categories.some((known) => known === c))).map((c) => <option key={c} value={c}>{c} ({base.filter((r) => r.category === c).length})</option>)}</select></div>
            <div className="filter-group access-group"><h3>Access & pricing</h3><label className="filter-row"><input type="checkbox" checked={noKey} onChange={(e) => setNoKey(e.target.checked)} />No API key required</label><label className="filter-row"><input type="checkbox" checked={fullyFree} onChange={(e) => setFullyFree(e.target.checked)} />Free, not just a free tier</label></div>
          </div>
          <div className="sidebar-bottom"><Globe2 size={20} className="mb-3 text-primary" /><strong className="text-foreground font-medium">Good ideas start with open data.</strong><p className="mt-2">Explore a little. Build something great.</p></div>
        </aside>

        <section aria-label="Search results">
          <div className="results-header"><div><div className="results-title"><h2>{collection ? "My collection" : searchTerm ? "Search results" : "Explore the possibilities"}</h2><span className="result-count">{filtered.length}</span></div><p className="results-description">{collection ? "Your saved resources · stored on this device" : searchTerm ? `Results for “${searchTerm}” · curated catalog of ${resources.length} sources` : "A few great places to start. Hand-picked, open to explore."}</p></div>
            <div className="results-tools">{collection && saved.length > 0 && <Button variant="ghost" size="icon" title="Export collection" aria-label="Export collection" onClick={exportCollection}><ArrowDownToLine size={15} /></Button>}<select className="sort-select" aria-label="Sort resources" value={sort} onChange={(e) => setSort(e.target.value)}><option value="relevance">{searchTerm ? "Most relevant" : "Recommended"}</option><option value="newest">Added recently</option><option value="name">Name: A–Z</option></select><div className="view-switch"><Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Grid view" title="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 size={13} /></Button><Button variant="ghost" size="icon" className="h-6 w-6" aria-label="List view" title="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={14} /></Button></div></div>
          </div>
          {filtered.length ? <><div className={`resource-grid ${view === "list" ? "list" : ""}`}>{filtered.slice(0, visible).map((r) => <ResourceCard key={r.url} resource={r} saved={saved.some((s) => s.url === r.url)} onSave={() => toggleSave(r)} onDetails={() => setSelected(r)} />)}</div>{filtered.length > visible && <div className="flex flex-col items-center gap-2 pt-8"><Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Load more<ArrowDownToLine size={14} /></Button><span className="text-xs text-muted-foreground">Showing {Math.min(visible, filtered.length)} of {filtered.length}</span></div>}</> : <div className="empty-state"><Search size={28} className="mx-auto text-primary" /><h3>{collection ? "A place for your next ideas" : "No matching resources"}</h3><p>{collection ? "Your collection is empty. Save a resource and it stays here on this device." : "Try a broader search or remove a filter."}</p><Button variant="outline" onClick={collection ? showExplore : resetFilters}>{collection ? "Explore resources" : "Reset filters"}<ArrowRight size={14} /></Button></div>}
          <div className="result-notice"><ShieldCheck size={15} className="shrink-0 mt-0.5" /><span>{searchedAt && !collection ? `Searched ${new Date(searchedAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}. ` : ""}Free doesn't always mean unlimited. Check source licenses, usage limits, and commercial-use terms. This catalog is curated by hand — it grows over time and can't cover every resource yet.</span></div>
        </section>
      </div>
    </main>
    <footer className="site-footer shell"><span className="brand"><Orbit size={19} />openatlas.</span><span>A little curiosity. A world of possibilities.</span><span className="flex items-center gap-3"><Button asChild variant="link" className="h-auto p-0 text-xs font-normal"><Link to="/about">About</Link></Button><a className="text-xs text-muted-foreground hover:text-foreground" href="https://github.com/MichaelS1011/openatlasmap" target="_blank" rel="noopener noreferrer">GitHub</a><a className="text-xs text-muted-foreground hover:text-foreground" href="https://github.com/MichaelS1011/openatlasmap/issues/new?title=Suggest%20a%20free%20API%20or%20dataset" target="_blank" rel="noopener noreferrer">Suggest a source</a></span></footer>

    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle className="font-display text-2xl">{selected?.name}</DialogTitle><DialogDescription>{selected?.description}</DialogDescription></DialogHeader>{selected && <div className="space-y-5"><div className="flex flex-wrap gap-2"><Tip label={badgeTips[selected.type] ?? selected.type}><span className="type-badge">{selected.type}</span></Tip><Tip label={badgeTips[selected.pricing] ?? selected.pricing}><span className="type-badge">{selected.pricing}</span></Tip><Tip label={badgeTips[selected.access] ?? selected.access}><span className="type-badge">{selected.access}</span></Tip><span className="type-badge">{selected.format}</span></div><div className="border-t pt-4"><h3 className="font-semibold text-sm mb-2">Access & usage conditions</h3><p className="text-sm text-muted-foreground leading-relaxed">{selected.limitation}</p></div><p className="text-xs text-muted-foreground break-all">{selected.url}</p><div className="flex gap-3"><Button asChild><a href={selected.url} target="_blank" rel="noopener noreferrer">Open original source <ArrowUpRight size={15} /></a></Button><Button variant="outline" onClick={() => toggleSave(selected)}><Bookmark size={14} />{saved.some((r) => r.url === selected.url) ? "Saved" : "Save"}</Button></div></div>}</DialogContent></Dialog>
  </TooltipProvider>;
}
