import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, FileJson, Github, Globe, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { ThemeToggle, useScrolled } from "@/components/site-chrome";
import { resources } from "@/lib/resources";
import { aboutStructuredData, catalogJsonUrl, llmsTxtUrl, siteUrl } from "@/lib/seo";

const githubUrl = "https://github.com/MichaelS1011/openatlasmap";
const suggestUrl = `${githubUrl}/issues/new?title=Suggest%20a%20free%20API%20or%20dataset`;

const curationRules = [
  ["Free to use", "A resource is only listed if it is free to start: completely free, or with a genuine free tier. Pricing and access requirements are shown on every entry."],
  ["Original source only", "Every entry links to the official provider, not a mirror or blog post. You always land where the data lives and can verify licenses yourself."],
  ["No duplicates, one home", "Each resource appears once, under the category where it helps most, so browsing stays trustworthy instead of turning into a link pile."],
  ["Verified with a date", "Entries carry a verification date. When an API changes or disappears, the community reports it through GitHub issues and the entry is corrected or removed."],
];

const faqs = [
  ["What is OpenAtlas?", "OpenAtlas is a free, curated directory of APIs and open datasets. Every entry links to the original source and states the access requirements, pricing model, and usage limits, so you can judge in seconds whether a resource fits your project."],
  ["Are the APIs and datasets really free?", "Every listed resource is free to start: entries are either completely free or offer a genuine free tier. Badges show the pricing model and whether an API key is required, and the original source always remains the authority for current licenses and limits."],
  ["How does OpenAtlas decide what gets listed?", "A resource is added only if it is free to use, links to its original source rather than a mirror, is not a duplicate of an existing entry, and fits one of the subject categories. Each entry carries a verification date, and outdated entries are corrected or removed through GitHub issues."],
  ["Can I suggest a resource?", "Yes. Use the Suggest a resource form on GitHub. Include the original source URL, what it offers, and whether an API key is needed. The catalog is also published as open data in JSON format."],
];

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "About OpenAtlas — Curated free APIs & open data" },
      { name: "description", content: "Why OpenAtlas exists, how its catalog of free APIs and open datasets is curated, and how to suggest a resource or reuse the catalog as open data." },
      { property: "og:title", content: "About OpenAtlas" },
      { property: "og:description", content: "Mission and curation rules behind a curated directory of free APIs and open datasets." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteUrl}/about/` },
    ],
    links: [{ rel: "canonical", href: `${siteUrl}/about/` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(aboutStructuredData(resources.length)) }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const scrolled = useScrolled();
  return (
    <>
      <header className={`site-header shell${scrolled ? " is-scrolled" : ""}`}>
        <Link className="brand" to="/" aria-label="OpenAtlas home"><span className="brand-symbol"><BrandMark size={30} /></span>openatlas<span className="text-primary">.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Button asChild variant="ghost" className="nav-item"><Link to="/">Explore</Link></Button>
          <ThemeToggle />
        </nav>
        <span className="header-note"><span className="status-dot" />Open data. Endless possibilities.</span>
      </header>

      <main className="shell" style={{ maxWidth: 760, paddingTop: 56, paddingBottom: 72 }}>
        <div className="eyebrow"><Sparkles size={13} /> About OpenAtlas</div>
        <h1 className="font-display" style={{ fontSize: 40, lineHeight: 1.15, margin: "14px 0 10px" }}>For the next generation of builders.</h1>
        <p className="text-muted-foreground" style={{ fontSize: 16, maxWidth: 620 }}>Created by Michael Soppa to help the next generation turn curiosity into something real.</p>

        <section style={{ marginTop: 36 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 12 }}>The mission</h2>
          <div className="text-sm text-muted-foreground" style={{ lineHeight: 1.7, display: "grid", gap: 12 }}>
            <p>I built OpenAtlas because I want to support the next generation. Access to knowledge and data can be the starting point for learning, experimenting, and bringing new ideas to life.</p>
            <p>My hope is to make that first step easier: to help curious people discover free APIs and open datasets, explore what's possible, and build something of their own.</p>
            <p>You don't need a big budget to have a big idea. Sometimes, you just need a place to start.</p>
          </div>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>How we curate</h2>
          <p className="text-sm text-muted-foreground" style={{ marginBottom: 14 }}>OpenAtlas is not a scraped link dump. The {resources.length} entries follow four strict rules — that is what makes it faster than a web search:</p>
          <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
            {curationRules.map(([title, text]) => (
              <li key={title} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", background: "var(--card)" }}>
                <h3 className="font-display" style={{ fontSize: 15, marginBottom: 4 }}>{title}</h3>
                <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.6 }}>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 14 }}>Questions people ask</h2>
          <div style={{ display: "grid", gap: 18 }}>
            {faqs.map(([q, a]) => (
              <div key={q}>
                <h3 className="font-display" style={{ fontSize: 15, marginBottom: 4 }}>{q}</h3>
                <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.65 }}>{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 40, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>The catalog itself is open data</h2>
          <p className="text-sm text-muted-foreground" style={{ marginBottom: 16, lineHeight: 1.65 }}>
            Practice what we preach: the full catalog is published under the MIT license as machine-readable JSON, and <code>llms.txt</code> helps AI assistants cite it correctly. Reuse it, cite it, build on it.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><a href={catalogJsonUrl} rel="noopener"><FileJson size={14} /> openatlas.json</a></Button>
            <Button asChild variant="outline" size="sm"><a href={llmsTxtUrl} rel="noopener"><Globe size={14} /> llms.txt</a></Button>
            <Button asChild variant="outline" size="sm"><a href={`${siteUrl}/sitemap.xml`} rel="noopener">Sitemap</a></Button>
          </div>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 12 }}>Get involved</h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm"><Link to="/">Explore the catalog</Link></Button>
            <Button asChild size="sm" variant="outline"><a href={suggestUrl} target="_blank" rel="noopener noreferrer">Suggest a resource <ArrowUpRight size={14} /></a></Button>
            <Button asChild size="sm" variant="outline"><a href={githubUrl} target="_blank" rel="noopener noreferrer"><Github size={14} /> Source on GitHub</a></Button>
            <Button asChild size="sm" variant="outline"><a href="https://www.linkedin.com/in/michael-soppa/" target="_blank" rel="noopener noreferrer">Connect with Michael <ArrowUpRight size={14} /></a></Button>
          </div>
          <p className="text-xs text-muted-foreground" style={{ marginTop: 24 }}>Resource availability can change. Please check the original source for licenses, pricing, and usage limits.</p>
        </section>
      </main>

      <footer className="site-footer shell"><span className="brand"><BrandMark size={21} />openatlas.</span><span>A little curiosity. A world of possibilities.</span><span className="flex items-center gap-3"><Button asChild variant="link" className="h-auto p-0 text-xs font-normal"><Link to="/">Explore</Link></Button><a className="text-xs text-muted-foreground hover:text-foreground" href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a><a className="text-xs text-muted-foreground hover:text-foreground" href={suggestUrl} target="_blank" rel="noopener noreferrer">Suggest a source</a></span></footer>
    </>
  );
}
