import type { SiteId } from "./types";

/**
 * Configuração deste blog. O domínio é uma PROPOSTA — verifique e registre antes de publicar.
 * Desenvolvimento local: http://localhost:3000
 */
export interface SiteConfig {
  id: SiteId;
  name: string;
  locale: string;
  htmlLang: string;
  domain: string;
  hosts: string[];
  tagline: string;
  description: string;
  /** Prefixos de rota localizados */
  routes: { category: string; author: string; search: string };
  ui: Record<UiKey, string>;
}

type UiKey =
  | "skip"
  | "home"
  | "menu"
  | "search"
  | "searchPlaceholder"
  | "searchTitle"
  | "searchEmpty"
  | "searchHint"
  | "readArticle"
  | "latest"
  | "byCategory"
  | "seeAll"
  | "by"
  | "published"
  | "updated"
  | "minRead"
  | "toc"
  | "blueprint"
  | "faq"
  | "related"
  | "aboutAuthor"
  | "fictionalNote"
  | "aboutBoxTitle"
  | "aboutBoxText"
  | "aboutBoxCta"
  | "prev"
  | "next"
  | "pause"
  | "play"
  | "slide"
  | "themeToggle"
  | "footerNote"
  | "institutional"
  | "categories"
  | "notFoundTitle"
  | "notFoundText"
  | "backHome"
  | "breadcrumbHome"
  | "articlesBy"
  | "stamp";

export const SITES: Record<SiteId, SiteConfig> = {
  en: {
    id: "en",
    name: "The Fed Up Buddies",
    locale: "en_US",
    htmlLang: "en",
    domain: process.env.SITE_URL ?? "https://fedupbuddies.com",
    hosts: ["fedupbuddies.com", "www.fedupbuddies.com", "en.localhost"],
    tagline: "Nothing is fine.",
    description:
      "Two digitized retirees versus a world that failed quality control. Satire, opinion and dry humor about the news, technology and everyday absurdity.",
    routes: { category: "topic", author: "author", search: "search" },
    ui: {
      skip: "Skip to content",
      home: "Home",
      menu: "Menu",
      search: "Search",
      searchPlaceholder: "Find your complaint…",
      searchTitle: "Search",
      searchEmpty: "Nothing found. For once, we haven't complained about it yet.",
      searchHint: "Find your complaint. We've probably complained about it already.",
      readArticle: "Read article",
      latest: "Latest complaints",
      byCategory: "By segment",
      seeAll: "See all",
      by: "By",
      published: "Published",
      updated: "Updated",
      minRead: "min read",
      toc: "In this article",
      blueprint: "The fix",
      faq: "Frequently asked questions",
      related: "More nonconformities",
      aboutAuthor: "About the author",
      fictionalNote: "Fictional character from The Fed Up Buddies universe.",
      aboutBoxTitle: "Who are these two?",
      aboutBoxText:
        "Arthur and Nico are retirees, friends for 31 years, digitized by Nico's grandson so they'd complain somewhere other than Sunday lunch. They're fictional characters. The complaints are real.",
      aboutBoxCta: "Meet the duo",
      prev: "Previous",
      next: "Next",
      pause: "Pause highlights",
      play: "Resume highlights",
      slide: "Highlight",
      themeToggle: "Toggle light/dark theme",
      footerNote: "No quality standard was met in the making of this website.",
      institutional: "About",
      categories: "Segments",
      notFoundTitle: "Nonconforming page",
      notFoundText: "This page went to production without testing. Like everything.",
      backHome: "Back to home",
      breadcrumbHome: "Home",
      articlesBy: "Writing by",
      stamp: "FAILED",
    },
  },
};

export const SITE_IDS = Object.keys(SITES) as SiteId[];
/** Este repositório publica um único blog */
export const SITE = SITES[SITE_IDS[0]];

export function isSiteId(value: string): value is SiteId {
  return value in SITES;
}

export function getSite(id: string): SiteConfig {
  return isSiteId(id) ? SITES[id] : SITE;
}

const DEV_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Domínio → site. Hosts desconhecidos (ex.: o domínio técnico da plataforma) retornam null:
 * lá só respondem /health e /admin. localhost serve o blog em desenvolvimento.
 */
export function siteFromHost(host: string | null): SiteId | null {
  const clean = (host ?? "").split(":")[0].toLowerCase();
  if (SITE.hosts.includes(clean) || DEV_HOSTS.has(clean)) return SITE.id;
  return null;
}
