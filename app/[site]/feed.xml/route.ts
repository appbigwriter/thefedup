import * as repo from "@/lib/repo";
import { getSite } from "@/lib/sites";
import { urls } from "@/lib/urls";


const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET(_req: Request, ctx: RouteContext<"/[site]/feed.xml">) {
  const site = getSite((await ctx.params).site);
  const u = urls(site);
  const arts = (await repo.getArticles(site.id)).slice(0, 30);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(site.name)}</title>
  <link>${site.domain}</link>
  <description>${esc(site.description)}</description>
  <language>${site.htmlLang}</language>
${arts
  .map(
    (a) => `  <item>
    <title>${esc(a.title)}</title>
    <link>${u.abs(u.article(a.slug))}</link>
    <guid>${u.abs(u.article(a.slug))}</guid>
    <pubDate>${new Date(`${a.publishedAt}T12:00:00Z`).toUTCString()}</pubDate>
    <description>${esc(a.excerpt)}</description>
  </item>`,
  )
  .join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
