import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import {
  berlinMidnightIso,
  countCountryStats,
  goatAuthHeaders,
  goatCountryUrl,
  goatLocationUrl,
  goatTotalUrl,
  GOAT_API_KEY,
} from "@/lib/analytics";
import { ui, type Lang } from "@/lib/i18n";

type Stats = { today: number; total: number; countries: number };

const json = (url: string) =>
  fetch(url, { headers: goatAuthHeaders(GOAT_API_KEY) }).then((r) => (r.ok ? r.json() : Promise.reject(r)));

// GoatCounter rate-limits its API (verified live: bursts answer 429), so all
// mounts share one in-flight request and results are cached in sessionStorage
// for a minute. Reloads and SPA navigations therefore never hammer the API.
const CACHE_KEY = "openatlas-status-cache";
const CACHE_TTL_MS = 60_000;
let inflight: Promise<Stats | null> | null = null;

function loadStats(): Promise<Stats | null> {
  if (inflight) return inflight;
  const now = new Date();
  const range = { start: berlinMidnightIso(now), end: now.toISOString() };
  // Verified live: countries arrive via stats/locations (the API rejects
  // "countries"); kept as fallback. Partial success is fine — a failed
  // dimension just drops its chip, only "no totals at all" hides the block.
  inflight = Promise.allSettled([
    json(goatTotalUrl(range)),
    json(goatTotalUrl()),
    json(goatLocationUrl({ limit: 100 })).catch(() => json(goatCountryUrl({ limit: 100 }))),
  ])
    .then(([today, total, geo]) => {
      const t = today.status === "fulfilled" ? Number(today.value?.total) : NaN;
      const a = total.status === "fulfilled" ? Number(total.value?.total) : NaN;
      if (Number.isNaN(t) && Number.isNaN(a)) return null;
      return {
        today: Number.isNaN(t) ? 0 : t,
        total: Number.isNaN(a) ? 0 : a,
        countries: geo.status === "fulfilled" ? countCountryStats(geo.value?.stats) : 0,
      };
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

// Live visitor stats read from GoatCounter's JSON API in the browser. The
// block hides itself entirely until a site key is configured and the API
// answers — an empty shell never shows.
export function SiteStatus({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!GOAT_API_KEY) return;
    let live = true;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as { t?: number; data?: Stats };
        if (cached?.data && Date.now() - (cached.t ?? 0) < CACHE_TTL_MS) {
          setStats(cached.data);
          return;
        }
      }
    } catch {
      /* private mode / corrupt entry: fetch fresh */
    }
    loadStats().then((data) => {
      if (!live || !data) return;
      setStats(data);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
      } catch {
        /* cache is best-effort */
      }
    });
    return () => {
      live = false;
    };
  }, []);

  if (!GOAT_API_KEY || !stats) return null;

  const items = [
    { n: stats.today, label: t.statusVisitsToday },
    { n: stats.total, label: t.statusVisitsTotal },
    ...(stats.countries > 0 ? [{ n: stats.countries, label: t.statusCountries }] : []),
  ];

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
