import type { SiteConfig } from "./sites";

export const urls = (site: SiteConfig) => ({
  home: () => "/",
  article: (slug: string) => `/${slug}`,
  category: (slug: string) => `/${site.routes.category}/${slug}`,
  author: (slug: string) => `/${site.routes.author}/${slug}`,
  search: () => `/${site.routes.search}`,
  page: (slug: string) => `/${slug}`,
  abs: (path: string) => `${site.domain}${path === "/" ? "" : path}`,
});

export function formatDate(iso: string, locale: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}
