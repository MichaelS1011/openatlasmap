import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { resources } from "@/lib/resources";
import { siteUrl } from "@/lib/seo";
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: { handlers: { GET: async () => {
    const router = await getRouterInstance();
    const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));
    if (isSitemapRouteIncluded(router.routesById["/resources/$id"])) {
      for (const resource of resources) {
        const location = router.buildLocation({ to: "/resources/$id", params: { id: resource.id }, search: () => ({}), hash: "" });
        const path = sitemapPathForLocation(router, location, "/resources/$id");
        if (path) entries.push({ path });
      }
    }
    if (entries.length === 0) return new Response("No public pages included", { status: 404 });
    return new Response(sitemapXML(siteUrl, entries), { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
  } } },
});