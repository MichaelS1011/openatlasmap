import type { AnyRoute, AnyRouter, ParsedLocation } from "@tanstack/react-router";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption { sitemap: boolean | "exclude-subtree" }
}
export const sitemapRouteInventoryVersion = 1;
type RouteMatch =
  | { routeParams: Record<string, unknown>; foundRoute?: AnyRoute; parseError?: unknown }
  | [AnyRoute[], Record<string, unknown>, AnyRoute | undefined];

export function isSitemapRouteIncluded(route: AnyRoute | undefined): boolean {
  if (!route || route.isRoot || route.options.staticData?.sitemap !== true) return false;
  for (let ancestor = route.parentRoute; ancestor; ancestor = ancestor.parentRoute) {
    if (ancestor.options.staticData?.sitemap === "exclude-subtree") return false;
  }
  return true;
}
export function sitemapStaticPaths(router: AnyRouter): string[] {
  const paths = new Set<string>();
  for (const route of Object.values(router.routesById) as AnyRoute[]) {
    if (!isSitemapRouteIncluded(route) || /[$*]/.test(route.fullPath)) continue;
    const location = router.buildLocation({ to: route.fullPath });
    const path = sitemapPathForLocation(router, location, route.id);
    if (path !== undefined) paths.add(path);
  }
  return [...paths].sort();
}
export function sitemapPathForLocation(router: AnyRouter, location: Pick<ParsedLocation, "pathname" | "publicHref">, routeId: string): string | undefined {
  if (!isSafeSitemapPath(location.pathname) || !isSafeSitemapPath(location.publicHref)) return undefined;
  const result = router.getMatchedRoutes(location.pathname) as RouteMatch;
  const [params, foundRoute] = Array.isArray(result)
    ? [result[1], result[2]]
    : [result.routeParams, result.parseError ? undefined : result.foundRoute];
  if (params["**"] !== undefined || foundRoute?.id !== routeId || !isSitemapRouteIncluded(foundRoute)) return undefined;
  // publicHref already contains the router basepath (GitHub Pages project sites);
  // sitemapXML prefixes the base URL, so strip it here to avoid doubling.
  // The basepath may be stored with or without a leading slash depending on the router instance.
  const base = ((router.options as { basepath?: string }).basepath ?? "").replace(/^\/+|\/+$/g, "");
  if (base) {
    const path = location.publicHref.startsWith("/") ? location.publicHref.slice(1) : location.publicHref;
    if (path === base) return "/";
    if (path.startsWith(`${base}/`)) return `/${path.slice(base.length + 1)}`;
  }
  return location.publicHref;
}
export interface SitemapEntry { path: string; lastmod?: string }
function isSafeSitemapPath(pathname: string): boolean {
  if (!pathname.startsWith("/") || pathname.startsWith("//") || /[?#\\]/.test(pathname)) return false;
  try { return decodeURI(new URL(pathname, "https://sitemap.invalid").pathname) === decodeURI(pathname); }
  catch { return false; }
}
export function sitemapXML(baseURL: string, entries: SitemapEntry[]): string {
  // baseURL may include a path prefix (GitHub Pages project sites), e.g. https://user.github.io/repo
  const origin = new URL(baseURL.endsWith("/") ? baseURL : `${baseURL}/`);
  if (!/^https?:$/.test(origin.protocol) || origin.username || origin.password || origin.search || origin.hash) throw new Error("The sitemap base URL must be the public site origin");
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
  const escape = (value: string) => value.replace(/[&<>"']/g, (character) => entities[character] ?? character);
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const entry of entries) {
    if (!isSafeSitemapPath(entry.path)) throw new Error("Invalid sitemap path");
    const url = new URL(entry.path.replace(/^\//, ""), origin);
    if (seen.has(url.href)) continue;
    seen.add(url.href);
    urls.push(`<url><loc>${escape(url.href)}</loc>${entry.lastmod ? `<lastmod>${escape(entry.lastmod)}</lastmod>` : ""}</url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
}