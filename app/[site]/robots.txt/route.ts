import { getSite } from "@/lib/sites";

export async function GET(_req: Request, ctx: RouteContext<"/[site]/robots.txt">) {
  const site = getSite((await ctx.params).site);
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /${site.routes.search}

Sitemap: ${site.domain}/sitemap.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
