import * as repo from "@/lib/repo";
import { getSite } from "@/lib/sites";
import { urls } from "@/lib/urls";


export async function GET(_req: Request, ctx: RouteContext<"/[site]/sitemap.xml">) {
  const site = getSite((await ctx.params).site);
  const u = urls(site);
  const [arts, cats, auths, pages] = await Promise.all([
    repo.getArticles(site.id),
    repo.getActiveCategories(site.id),
    repo.getAuthors(site.id),
    repo.getPages(site.id),
  ]);
  const latest = arts[0]?.updatedAt ?? arts[0]?.publishedAt;
  const entries: { loc: string; lastmod?: string }[] = [
    { loc: u.abs("/"), lastmod: latest },
    ...arts.map((a) => ({ loc: u.abs(u.article(a.slug)), lastmod: a.updatedAt ?? a.publishedAt })),
    ...cats.map((c) => ({ loc: u.abs(u.category(c.slug)) })),
    ...auths.map((a) => ({ loc: u.abs(u.author(a.slug)) })),
    ...pages.map((p) => ({ loc: u.abs(u.page(p.slug)) })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
