import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { resources } from "@/lib/resources";
import { catalogStructuredData, resourcePageUrl, resourceStructuredData, siteUrl } from "@/lib/seo";
import { sitemapPathForLocation, sitemapStaticPaths, sitemapXML } from "@/lib/sitemap";
import { routeTree } from "@/routeTree.gen";

describe("Public source discovery", () => {
  it("links the complete catalog to unique public source pages", () => {
    const graph = catalogStructuredData(resources)["@graph"];
    const list = graph.find((item) => item["@type"] === "ItemList");
    expect(list?.numberOfItems).toBe(resources.length);
    expect(new Set(list?.itemListElement?.map((item) => item.url)).size).toBe(resources.length);
  });
  it("retains original source references and usage conditions in structured data", () => {
    const resource = resources.find((item) => item.id === "open-meteo");
    if (!resource) throw new Error("Missing source");
    const data = resourceStructuredData(resource);
    expect(data.sameAs).toBe("https://open-meteo.com/");
    expect(data.description).toContain(resource.limitation);
    expect(data.url).toBe(resourcePageUrl("open-meteo"));
  });
  it("includes the homepage, about page, and all public source records without the sitemap itself", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const paths = sitemapStaticPaths(router);
    expect(paths).toEqual(["/", "/about", "/de", "/de/about"]);
    for (const resource of resources) {
      const location = router.buildLocation({ to: "/resources/$id", params: { id: resource.id }, search: () => ({}), hash: "" });
      expect(sitemapPathForLocation(router, location, "/resources/$id")).toBe(`/resources/${resource.id}`);
    }
    expect(sitemapXML(siteUrl, paths.map((path) => ({ path })))).toContain(`${siteUrl}/</loc>`);
    expect(sitemapXML(siteUrl, [{ path: "/about" }])).toContain(`${siteUrl}/about</loc>`);
  });
  it("resolves sitemap paths under a GitHub Pages path prefix", () => {
    expect(sitemapXML("https://user.github.io/repo", [{ path: "/" }, { path: "/about" }])).toContain("https://user.github.io/repo/about</loc>");
  });
  it("strips the router basepath so the Pages prefix is not doubled", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() }, basepath: "/repo" });
    const location = router.buildLocation({ to: "/about" });
    expect(location.publicHref).toBe("/repo/about");
    expect(sitemapPathForLocation(router, location, "/about")).toBe("/about");
  });
  it("strips a basepath stored without a leading slash (react-start server router)", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    (router.options as { basepath?: string }).basepath = "repo";
    expect(sitemapPathForLocation(router, { pathname: "/about", publicHref: "/repo/about" }, "/about")).toBe("/about");
    expect(sitemapPathForLocation(router, { pathname: "/", publicHref: "/repo" }, "/")).toBe("/");
  });
  it("rejects external or query-bearing sitemap paths", () => {
    expect(() => sitemapXML(siteUrl, [{ path: "//other.example" }])).toThrow();
    expect(() => sitemapXML(siteUrl, [{ path: "/?private=yes" }])).toThrow();
  });
});