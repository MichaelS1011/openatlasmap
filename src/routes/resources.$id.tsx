import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { ThemeToggle, useScrolled } from "@/components/site-chrome";
import { licenseSpecified, resources } from "@/lib/resources";
import { resourcePageUrl, resourceStructuredData } from "@/lib/seo";

export const Route = createFileRoute("/resources/$id")({
  staticData: { sitemap: true },
  loader: ({ params }) => {
    const resource = resources.find((item) => item.id === params.id);
    if (!resource) throw notFound();
    return resource;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Source unavailable — OpenAtlas" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} — ${loaderData.pricing} ${loaderData.type} | OpenAtlas`;
    const description = `${loaderData.description} Access: ${loaderData.access}. ${loaderData.limitation}`;
    return {
      meta: [
        { title }, { name: "description", content: description },
        { property: "og:title", content: title }, { property: "og:description", content: description },
        { property: "og:type", content: "website" }, { property: "og:url", content: resourcePageUrl(loaderData.id) },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: resourcePageUrl(loaderData.id) }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(resourceStructuredData(loaderData)) }],
    };
  },
  component: ResourcePage,
});

function ResourcePage() {
  const resource = Route.useLoaderData();
  const scrolled = useScrolled();
  return <>
    <header className={`site-header shell${scrolled ? " is-scrolled" : ""}`}>
      <Link className="brand" to="/"><span className="brand-symbol"><BrandMark size={30} /></span>openatlas<span className="text-primary">.</span></Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost"><Link to="/"><ArrowLeft size={15} />Explore</Link></Button>
        <ThemeToggle />
      </div>
    </header>
    <main className="shell source-page">
      <p className="text-sm text-primary mb-4">{resource.category}</p>
      <h1 className="font-display text-3xl sm:text-4xl font-medium break-words">{resource.name}</h1>
      <p className="text-muted-foreground text-base leading-relaxed mt-5 max-w-3xl">{resource.description}</p>
      <dl className="source-facts">
        <div><dt>Resource type</dt><dd>{resource.type}</dd></div>
        <div><dt>Pricing</dt><dd>{resource.pricing}</dd></div>
        <div><dt>Access</dt><dd>{resource.access}</dd></div>
        <div><dt>Formats</dt><dd>{resource.format}</dd></div>
        <div><dt>License</dt><dd>{licenseSpecified(resource) ? "Stated by original source" : "Unspecified — check the original source"}</dd></div>
      </dl>
      <section className="source-conditions">
        <h2 className="text-xl font-medium mb-3">Access & usage conditions</h2>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">{resource.limitation}</p>
        <p className="text-xs text-muted-foreground mt-4">Free access does not necessarily allow unrestricted reuse. The original provider's current terms apply.</p>
      </section>
      <Button asChild className="mt-6"><a href={resource.url} target="_blank" rel="noopener noreferrer">Open original source <ArrowUpRight size={15} /></a></Button>
      <p className="text-xs text-muted-foreground break-all mt-4">{resource.url}</p>
      {resource.evidenceUrl && <section className="source-conditions mt-8">
        <h2 className="text-xl font-medium mb-3">Source documentation</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{resource.evidenceNote}</p>
        <Button asChild variant="link" className="px-0"><a href={resource.evidenceUrl} target="_blank" rel="noopener noreferrer">Provider reference <ArrowUpRight size={14} /></a></Button>
        {resource.verifiedAt && <p className="text-xs text-muted-foreground">Documentation reviewed: {resource.verifiedAt}</p>}
      </section>}
      <nav aria-label="Breadcrumb" className="mt-10 text-sm text-muted-foreground"><Link to="/" className="text-primary">OpenAtlas</Link> / {resource.category} / {resource.name}</nav>
    </main>
  </>;
}