// Cookieless visitor stats via GoatCounter. The count script (see __root.tsx)
// sets no cookies and stores no personal data; the JSON API below only serves
// aggregate counts, which is why the site key is safe to ship in the client.
// Create a read-only *site key* in GoatCounter → Settings → API keys → Site key.
export const GOAT_SITE = "openatlas";
export const GOAT_API_KEY = ""; // set to the GoatCounter site key to enable the live status

export const goatCountScriptUrl = `https://${GOAT_SITE}.goatcounter.com/count`;

// GET /api/v1/total — https://www.goatcounter.com/help/api
export function goatTotalUrl(opts: { key: string; from?: string; to?: string; group?: string; limit?: number }): string {
  const p = new URLSearchParams({ access_key: opts.key });
  if (opts.from) p.set("from", opts.from);
  if (opts.to) p.set("to", opts.to ?? new Date().toISOString());
  if (opts.group) p.set("group", opts.group);
  if (opts.limit) p.set("limit", String(opts.limit));
  return `https://${GOAT_SITE}.goatcounter.com/api/v1/total?${p.toString()}`;
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

// The API groups results as `pages: { "country:DE": 12, "unknown": 3, ... }`.
export function countCountries(pages: Record<string, number> | undefined): number {
  if (!pages) return 0;
  return Object.keys(pages).filter((k) => k.startsWith("country:") && pages[k] > 0).length;
}
