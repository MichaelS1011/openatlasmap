import { ArrowUpRight, FileJson, Github, Globe, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { ThemeToggle, useScrolled } from "@/components/site-chrome";
import { SiteStatus } from "@/components/site-status";
import { resources } from "@/lib/resources";
import { catalogJsonUrl, llmsTxtUrl, siteUrl } from "@/lib/seo";
import { ui, type Lang } from "@/lib/i18n";

const githubUrl = "https://github.com/MichaelS1011/openatlasmap";
const suggestUrl = `${githubUrl}/issues/new?title=Suggest%20a%20free%20API%20or%20dataset`;

export function AboutContent({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const p =
    lang === "en"
      ? { home: "/", about: "/about", other: "/de/", otherLabel: "Deutsch" }
      : { home: "/de/", about: "/de/about", other: "/", otherLabel: "English" };
  const scrolled = useScrolled();
  return (
    <>
      <header className={`site-header shell${scrolled ? " is-scrolled" : ""}`}>
        <a className="brand" href={`${siteUrl}${p.home}`} aria-label={t.homeAria}>
          <span className="brand-symbol">
            <BrandMark size={30} />
          </span>
          openatlas<span className="text-primary">.</span>
        </a>
        <nav className="main-nav" aria-label={t.mainNavAria}>
          <Button asChild variant="ghost" className="nav-item">
            <a href={`${siteUrl}${p.home}`}>{t.navExplore}</a>
          </Button>
          <Button asChild variant="ghost" className="nav-item" aria-label={t.langSwitchLabel}>
            <a href={`${siteUrl}${p.other}`}>{p.otherLabel}</a>
          </Button>
          <ThemeToggle lang={lang} />
        </nav>
        <span className="header-note">
          <span className="status-dot" />
          {t.headerNote}
        </span>
      </header>

      <main className="shell" style={{ maxWidth: 920, paddingTop: 150, paddingBottom: 72 }}>
        <div className="eyebrow">
          <Sparkles size={13} /> {t.aboutEyebrow}
        </div>
        <h1
          className="font-display"
          style={{ fontSize: 40, lineHeight: 1.15, margin: "14px 0 10px" }}
        >
          {t.aboutH1}
        </h1>
        <p className="text-muted-foreground" style={{ fontSize: 16, maxWidth: 620 }}>
          {t.aboutSub}
        </p>

        <section style={{ marginTop: 36 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 12 }}>
            {t.missionH2}
          </h2>
          <div
            className="text-sm text-muted-foreground"
            style={{ lineHeight: 1.7, display: "grid", gap: 12 }}
          >
            <p>{t.mission1}</p>
            <p>{t.mission2}</p>
            <p>{t.mission3}</p>
          </div>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>
            {t.curateH2}
          </h2>
          <p className="text-sm text-muted-foreground" style={{ marginBottom: 14 }}>
            {t.curateIntro(resources.length)}
          </p>
          <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
            {t.curationRules.map(([title, text]) => (
              <li
                key={title}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  background: "var(--card)",
                }}
              >
                <h3 className="font-display" style={{ fontSize: 15, marginBottom: 4 }}>
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.6 }}>
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 14 }}>
            {t.faqH2}
          </h2>
          <div style={{ display: "grid", gap: 18 }}>
            {t.faqs.map(([q, a]) => (
              <div key={q}>
                <h3 className="font-display" style={{ fontSize: 15, marginBottom: 4 }}>
                  {q}
                </h3>
                <p className="text-sm text-muted-foreground" style={{ lineHeight: 1.65 }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 40, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>
            {t.openDataH2}
          </h2>
          <p
            className="text-sm text-muted-foreground"
            style={{ marginBottom: 16, lineHeight: 1.65 }}
          >
            {t.openDataText}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={catalogJsonUrl} rel="noopener">
                <FileJson size={14} /> openatlas.json
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={llmsTxtUrl} rel="noopener">
                <Globe size={14} /> llms.txt
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={`${siteUrl}/sitemap.xml`} rel="noopener">
                Sitemap
              </a>
            </Button>
          </div>
        </section>

        <SiteStatus lang={lang} />

        <section style={{ marginTop: 40 }}>
          <h2 className="font-display" style={{ fontSize: 22, marginBottom: 12 }}>
            {t.involvedH2}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <a href={`${siteUrl}${p.home}`}>{t.exploreCatalog}</a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={suggestUrl} target="_blank" rel="noopener noreferrer">
                {t.suggestResource} <ArrowUpRight size={14} />
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={14} /> {t.sourceOnGithub}
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href="https://www.linkedin.com/in/michael-soppa/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.connectMichael} <ArrowUpRight size={14} />
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground" style={{ marginTop: 24 }}>
            {t.availabilityNote}
          </p>
        </section>
      </main>

      <footer className="site-footer shell">
        <span className="brand">
          <BrandMark size={21} />
          openatlas.
        </span>
        <span>{t.footerTagline}</span>
        <span className="flex items-center gap-3">
          <Button asChild variant="link" className="h-auto p-0 text-xs font-normal">
            <a href={`${siteUrl}${p.home}`}>{t.navExplore}</a>
          </Button>
          <a
            className="text-xs text-muted-foreground hover:text-foreground"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="text-xs text-muted-foreground hover:text-foreground"
            href={suggestUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.footerSuggest}
          </a>
        </span>
      </footer>
    </>
  );
}
