// Cookieless visitor stats via GoatCounter. The count script (see __root.tsx)
// sets no cookies and stores no personal data; the JSON API below only serves
// aggregate counts, which is why the site key is safe to ship in the client.
// Create a read-only *site key* in GoatCounter → [top menu] → API → Site key.
// API reference: https://[site].goatcounter.com/api.json (endpoints /api/v0/stats/*).
export const GOAT_SITE = "openatlas";
// Read-only stats token from GoatCounter (user → API). Public by design:
// GoatCounter documents embedding it in client-side JS (CORS allows any origin)
// and it cannot modify counters or expose personal data — no secret.
export const GOAT_API_KEY = "16m2nngxu7cs6wohf5ceajfst1q0fsfk8asr2xjutsu9to1zim";

export const goatCountScriptUrl = `https://${GOAT_SITE}.goatcounter.com/count`;

// GoatCounter authenticates with `Authorization: Bearer <key>` (site keys are
// read-only stats keys, meant to be embedded in client-side JS).
export function goatAuthHeaders(key: string): Record<string, string> {
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export type GoatRange = { start?: string; end?: string; limit?: number };

function goatApiUrl(path: string, opts: GoatRange): string {
  const p = new URLSearchParams();
  if (opts.start) p.set("start", opts.start);
  if (opts.end) p.set("end", opts.end);
  if (opts.limit) p.set("limit", String(opts.limit));
  const q = p.toString();
  return `https://${GOAT_SITE}.goatcounter.com/api/v0/${path}${q ? `?${q}` : ""}`;
}

// GET /api/v0/stats/total → { total: <visitors in range> }
export function goatTotalUrl(opts: GoatRange = {}): string {
  return goatApiUrl("stats/total", opts);
}

// GET /api/v0/stats/countries (fallback: locations) → { stats: [{ name, count }] }
export function goatCountryUrl(opts: GoatRange = {}): string {
  return goatApiUrl("stats/countries", opts);
}
export function goatLocationUrl(opts: GoatRange = {}): string {
  return goatApiUrl("stats/locations", opts);
}

// UTC ISO string for "midnight in Berlin" — "today" means the visitor's day,
// and the catalog is aimed at Europe/Berlin.
export function berlinMidnightIso(now: Date = new Date()): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).formatToParts(now).map((p) => [p.type, p.value]),
  );
  // Local wall time read as UTC minus the current offset = the real UTC instant.
  const wallAsUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  const offsetMs = wallAsUtc - now.getTime();
  return new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day) - offsetMs).toISOString();
}

type GoatStat = { name?: string; count?: number };

// Count distinct countries from a stats array; the API reports buckets like
// { name: "Germany", count: 12 } plus catch-all buckets we must not count.
export function countCountryStats(stats: GoatStat[] | undefined): number {
  if (!Array.isArray(stats)) return 0;
  const blank = new Set(["", "unknown", "(not set)", "none", "n/a"]);
  return stats.filter((s) => (s?.count ?? 0) > 0 && s?.name && !blank.has(s.name.toLowerCase())).length;
}
