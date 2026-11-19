import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { berlinMidnightIso, countCountries, goatTotalUrl, GOAT_API_KEY, GOAT_SITE } from "@/lib/analytics";
import { ui, type Lang } from "@/lib/i18n";

type Stats = { today: number; total: number; countries: number };

// Live visitor stats read from GoatCounter's JSON API in the browser. The
// block hides itself entirely until a site key is configured and the API
// answers — an empty shell never shows.
export function SiteStatus({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!GOAT_API_KEY) return;
    let live = true;
    const now = new Date();
    const from = berlinMidnightIso(now);
    const to = now.toISOString();
    const req = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r)));
    Promise.all([
      req(goatTotalUrl({ key: GOAT_API_KEY, from, to })),
      req(goatTotalUrl({ key: GOAT_API_KEY })),
      req(goatTotalUrl({ key: GOAT_API_KEY, group: "country", limit: 250 })),
    ])
      .then(([today, total, geo]) => {
        if (!live) return;
        setStats({
          today: Number(today?.total) || 0,
          total: Number(total?.total) || 0,
          countries: countCountries(geo?.pages),
        });
      })
      .catch(() => { if (live) setStats(null); });
    return () => { live = false; };
  }, []);

  if (!GOAT_API_KEY || !stats) return null;

  const items = [
    { n: stats.today, label: t.statusVisitsToday },
    { n: stats.total, label: t.statusVisitsTotal },
    stats.countries > 0 ? { n: stats.countries, label: t.statusCountries } : null,
  ].filter(Boolean) as { n: number; label: string }[];

  return (
    <section style={{ marginTop: 40 }}>
      <h2 className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>
        <span className="status-dot" style={{ marginRight: 8 }} />{t.statusH2}
      </h2>
      <p className="text-sm text-muted-foreground" style={{ marginBottom: 16, lineHeight: 1.65 }}>{t.statusNote}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span key={it.label} className="status-stat">
            <Activity size={13} />
            <strong style={{ fontVariantNumeric: "tabular-nums" }}>{it.n.toLocaleString(lang === "de" ? "de-DE" : "en-US")}</strong>
            <span>{it.label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
