import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Bookmark, Check, CheckCircle2, CloudSun, Code2, Database, Globe2, Grid2X2, Leaf, Library, List, LoaderCircle, Orbit, Search, ShieldCheck, SlidersHorizontal, Sparkles, Utensils, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { filterResources, resources, type Resource } from "@/lib/resources";
import { catalogStructuredData, siteUrl } from "@/lib/seo";
import { categoryGroups } from "@/lib/resource-categories";
import glassImage from "@/assets/discovery-glass.jpg";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "OpenAtlas — Discover Free APIs & Open Data" },
    { name: "description", content: "Search the web for free APIs and open datasets. Explore original sources, formats, access requirements, and free-use limits with OpenAtlas." },
    { property: "og:title", content: "OpenAtlas — Discover Free APIs & Open Data" },
    { property: "og:description", content: "Find the right free API or open dataset for your next idea, with live search and original source links." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:url", content: `${siteUrl}/` },
  ], links: [{ rel: "canonical", href: `${siteUrl}/` }],
  scripts: [{ type: "application/ld+json", children: JSON.stringify(catalogStructuredData(resources)) }] }),
  component: Index,
});

const icons = { "Weather & Climate": CloudSun, "Finance & Economics": Globe2, "Science & Space": Orbit, Geography: Globe2, "Arts & Culture": Library, Government: Database, "Nature & Environment": Leaf, "Food & Health": Utensils };
const topics = ["Weather & climate", "Finance", "Space", "Public transport", "AI & machine learning"];

function ResourceCard({ resource, saved, onSave, onDetails }: { resource: Resource; saved: boolean; onSave: () => void; onDetails: () => void }) {
  const Icon = icons[resource.category as keyof typeof icons] || Code2;
  const dataset = resource.type === "Dataset";
  return <article className="resource-card">
    <div className="card-top">
      <div className={`resource-icon ${dataset ? "dataset" : ""}`}><Icon size={22} strokeWidth={1.6} /></div>
      <div className="flex items-center gap-2">
        <span className={`type-badge ${dataset ? "dataset" : ""}`}>{dataset ? <Database size={11} /> : <Code2 size={11} />}{resource.type}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={onSave} aria-label={saved ? `Remove ${resource.name} from collection` : `Save ${resource.name}`} title={saved ? "Remove from collection" : "Save to collection"} aria-pressed={saved}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /></Button>
      </div>
    </div>
    <h3>{resources.some((item) => item.id === resource.id && item.url === resource.url) ? <Link to="/resources/$id" params={{ id: resource.id }}>{resource.name}</Link> : resource.name}</h3><p>{resource.description}</p>
    <div className="card-tags"><span className="free"><CheckCircle2 size={11} />{resource.pricing}</span><span>·</span><span>{resource.access}</span><span className="tag">{resource.format}</span></div>
    <div className="card-footer"><span>{resource.category}</span><Button variant="link" className="source-link" onClick={onDetails}>View source <ArrowUpRight size={13} /></Button></div>
  </article>;
}

function Index() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Resource[]>(resources);
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All categories");
  const [noKey, setNoKey] = useState(false);
  const [fullyFree, setFullyFree] = useState(false);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("relevance");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Resource[]>([]);
  const [collection, setCollection] = useState(false);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [about, setAbout] = useState(false);
  const [searchedAt, setSearchedAt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const base = collection ? saved : items;
  const filtered = filterResources(base, { type, category, noKey, fullyFree });
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  const categories = Array.from(new Set(base.map((r) => r.category))).sort();

  function resetFilters() { setType("All"); setCategory("All categories"); setNoKey(false); setFullyFree(false); }
  function showExplore() { setCollection(false); setItems(resources); setSearchTerm(""); setQuery(""); setError(""); setSearchedAt(""); resetFilters(); }
  async function search(term: string) {
    if (pending || term.trim().length < 2) return;
    setQuery(term); setError(""); setCollection(false); resetFilters();
    // Client-side catalog search: match every word against the curated resources.
    const words = term.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = resources.filter((r) => {
      const hay = `${r.name} ${r.description} ${r.category} ${r.type} ${r.limitation}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    setItems(hits); setSearchTerm(term); setSearchedAt(new Date().toISOString());
  }
  function toggleSave(resource: Resource) { setSaved((prev) => prev.some((r) => r.url === resource.url) ? prev.filter((r) => r.url !== resource.url) : [...prev, resource]); }
  function exportCollection() {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "openatlas-collection.json"; a.click(); URL.revokeObjectURL(url);
  }

  return <>
    <header className="site-header shell">
      <a className="brand" href="/" aria-label="OpenAtlas home"><span className="brand-symbol"><Orbit size={22} strokeWidth={1.7} /></span>openatlas<span className="text-primary">.</span></a>
      <nav className="main-nav" aria-label="Main navigation">
        <Button variant="ghost" onClick={showExplore} className={`nav-item ${!collection ? "active" : ""}`}>Explore</Button>
        <Button variant="ghost" onClick={() => { setCollection(true); resetFilters(); }} className={`nav-item ${collection ? "active" : ""}`}><Bookmark size={14} /><span className="collection-label">My collection</span>{saved.length > 0 && <span>{saved.length}</span>}</Button>
        <Button variant="ghost" className="nav-item" onClick={() => setAbout(true)}>About <ArrowUpRight size={13} /></Button>
      </nav>
      <span className="header-note"><span className="status-dot" />Open data. Endless possibilities.</span>
    </header>

    <section className="hero">
      <img src={glassImage} className="hero-image" alt="Sculptural green glass arcs representing connected open data" width={1536} height={1024} />
      <div className="hero-content shell"><div className="eyebrow"><Sparkles size={13} /> A world of data, open to you</div>
        <h1>Free APIs & open data.<br /><span>Find your next possibility.</span></h1>
        <p className="hero-description">Discover the APIs and datasets behind your next big idea.<br className="hidden sm:block" /> Tell us what you need. We'll find where to start.</p>
        <div className="hero-points"><span><Check size={13} />Free resources</span><span><Globe2 size={13} />Original sources</span><span><ShieldCheck size={13} />No account needed</span></div>
      </div>
    </section>

    <main className="discovery shell" id="explore">
      <form className="searchbox" onSubmit={(e) => { e.preventDefault(); void search(query); }}>
        <Search size={21} className="text-muted-foreground shrink-0" />
        <input ref={inputRef} aria-label="Search APIs and datasets" placeholder="What are you looking for? Try ‘real-time weather data’" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={300} minLength={2} required />
        {query && <Button type="button" variant="ghost" size="icon" aria-label="Clear search" title="Clear search" onClick={() => { setQuery(""); inputRef.current?.focus(); }}><X size={14} /></Button>}
        <Button className="search-submit" type="submit" aria-label={pending ? "Searching" : "Find resources"} title="Find resources" disabled={pending || query.trim().length < 2}>{pending ? <LoaderCircle className="loading-icon" /> : <Sparkles size={15} />}<span className="search-label">{pending ? "Searching…" : "Find resources"}</span></Button>
      </form>
      <div className="suggestions"><span>Popular searches:</span>{topics.map((topic) => <Button key={topic} variant="outline" className="suggestion" disabled={pending} onClick={() => void search(topic)}>{topic}<ArrowUpRight size={10} /></Button>)}</div>

      <div className="catalog-layout">
        <aside aria-label="Resource filters"><div className="filter-header"><h2 className="flex items-center gap-2"><SlidersHorizontal size={14} />Filters</h2><Button variant="link" className="h-auto p-0 text-[11px] text-muted-foreground" onClick={resetFilters}>Reset</Button></div>
          <div className="filters">
            <div className="filter-group resource-type"><h3>Resource type</h3>{[{ value: "All", label: "All resources" }, { value: "API", label: "APIs" }, { value: "Dataset", label: "Datasets" }].map((option) => <label className="filter-row" key={option.value}><input type="radio" name="type" checked={type === option.value} onChange={() => setType(option.value)} />{option.label}<span className="count">{base.filter((r) => option.value === "All" || r.type === option.value).length}</span></label>)}</div>
            <div className="filter-group category-group"><h3>Category</h3><select className="category-select" aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}><option>All categories</option>{categoryGroups.map((group) => { const available = group.categories.filter((c) => categories.includes(c)); return available.length ? <optgroup label={group.label} key={group.label}>{available.map((c) => <option key={c}>{c}</option>)}</optgroup> : null; })}{categories.filter((c) => !categoryGroups.some((group) => group.categories.some((known) => known === c))).map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="filter-group access-group"><h3>Access & pricing</h3><label className="filter-row"><input type="checkbox" checked={noKey} onChange={(e) => setNoKey(e.target.checked)} />No API key required</label><label className="filter-row"><input type="checkbox" checked={fullyFree} onChange={(e) => setFullyFree(e.target.checked)} />Free, not just a free tier</label></div>
          </div>
          <div className="sidebar-bottom"><Globe2 size={20} className="mb-3 text-primary" /><strong className="text-foreground font-medium">Good ideas start with open data.</strong><p className="mt-2">Explore a little. Build something great.</p></div>
        </aside>

        <section aria-label="Search results" aria-busy={pending}>
          <div className="results-header"><div><div className="results-title"><h2>{collection ? "My collection" : searchTerm ? "Search results" : "Explore the possibilities"}</h2><span className="result-count">{filtered.length}</span></div><p className="results-description">{collection ? "Your saved resources · this session" : searchTerm ? `Results for “${searchTerm}” · live web search` : "A few great places to start. Hand-picked, open to explore."}</p></div>
            <div className="results-tools">{collection && saved.length > 0 && <Button variant="ghost" size="icon" title="Export collection" aria-label="Export collection" onClick={exportCollection}><ArrowDownToLine size={15} /></Button>}<select className="sort-select" aria-label="Sort resources" value={sort} onChange={(e) => setSort(e.target.value)}><option value="relevance">{searchTerm ? "Most relevant" : "Recommended"}</option><option value="name">Name: A–Z</option></select><div className="view-switch"><Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Grid view" title="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 size={13} /></Button><Button variant="ghost" size="icon" className="h-6 w-6" aria-label="List view" title="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={14} /></Button></div></div>
          </div>
          {error && <div role="alert" className="error-notice">{error}<Button variant="link" className="text-xs ml-2" onClick={showExplore}>Explore curated resources <ArrowRight size={12} /></Button></div>}
          {pending ? <div className="empty-state" role="status"><LoaderCircle size={32} className="loading-icon mx-auto text-primary" /><h3>Looking for your next possibility…</h3><p>Searching the web for relevant APIs, datasets, and their free-use conditions.</p></div> : filtered.length ? <div className={`resource-grid ${view === "list" ? "list" : ""}`}>{filtered.map((r) => <ResourceCard key={r.url} resource={r} saved={saved.some((s) => s.url === r.url)} onSave={() => toggleSave(r)} onDetails={() => setSelected(r)} />)}</div> : <div className="empty-state"><Search size={28} className="mx-auto text-primary" /><h3>{collection ? "A place for your next ideas" : "No matching resources"}</h3><p>{collection ? "Your collection is empty. Save a resource to keep it here during this session." : "Try a broader search or remove a filter."}</p><Button variant="outline" onClick={collection ? showExplore : resetFilters}>{collection ? "Explore resources" : "Reset filters"}<ArrowRight size={14} /></Button></div>}
          <div className="result-notice"><ShieldCheck size={15} className="shrink-0 mt-0.5" /><span>{searchedAt && !collection ? `Searched ${new Date(searchedAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}. ` : ""}Free doesn't always mean unlimited. Check source licenses, usage limits, and commercial-use terms. No search can cover every resource on the internet.</span></div>
        </section>
      </div>
    </main>
    <footer className="site-footer shell"><span className="brand"><Orbit size={19} />openatlas.</span><span>A little curiosity. A world of possibilities.</span><span>Made for the openly curious <ArrowUpRight size={11} className="inline" /></span></footer>

    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle className="font-display text-2xl">{selected?.name}</DialogTitle><DialogDescription>{selected?.description}</DialogDescription></DialogHeader>{selected && <div className="space-y-5"><div className="flex flex-wrap gap-2"><span className="type-badge">{selected.type}</span><span className="type-badge">{selected.pricing}</span><span className="type-badge">{selected.access}</span><span className="type-badge">{selected.format}</span></div><div className="border-t pt-4"><h3 className="font-semibold text-sm mb-2">Access & usage conditions</h3><p className="text-sm text-muted-foreground leading-relaxed">{selected.limitation}</p></div><p className="text-xs text-muted-foreground break-all">{selected.url}</p><div className="flex gap-3"><Button asChild><a href={selected.url} target="_blank" rel="noopener noreferrer">Open original source <ArrowUpRight size={15} /></a></Button><Button variant="outline" onClick={() => toggleSave(selected)}><Bookmark size={14} />{saved.some((r) => r.url === selected.url) ? "Saved" : "Save"}</Button></div></div>}</DialogContent></Dialog>
    <Dialog open={about} onOpenChange={setAbout}><DialogContent><DialogHeader><DialogTitle className="font-display text-2xl">For the next generation of builders.</DialogTitle><DialogDescription>Created by Michael Soppa to help the next generation turn curiosity into something real.</DialogDescription></DialogHeader><div className="text-sm text-muted-foreground leading-relaxed space-y-4"><p>I'm Michael Soppa, and I built OpenAtlas because I want to support the next generation. Access to knowledge and data can be the starting point for learning, experimenting, and bringing new ideas to life.</p><p>My hope is to make that first step easier: to help curious people discover free APIs and open datasets, explore what's possible, and build something of their own.</p><p>You don't need a big budget to have a big idea. Sometimes, you just need a place to start.</p><div className="border-t pt-4"><p className="font-medium text-foreground">Michael Soppa</p><p className="text-xs mt-1">Creator of OpenAtlas</p><Button asChild variant="link" className="px-0 mt-1"><a href="https://www.linkedin.com/in/michael-soppa/" target="_blank" rel="noopener noreferrer">Connect with me on LinkedIn <ArrowUpRight size={14} /></a></Button></div><p className="text-xs">Resource availability can change. Please check the original source for licenses, pricing, and usage limits.</p></div></DialogContent></Dialog>
  </>;
}
