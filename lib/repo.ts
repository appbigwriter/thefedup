import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import type { Article, Author, Category, InstitutionalPage, SiteId } from "./types";
import * as en from "./content/en";

/**
 * Camada de dados.
 * - Sem variáveis do Supabase → usa o conteúdo inicial versionado em lib/content/*.
 * - Com NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY → lê artigos publicados do banco
 *   (RLS libera apenas status = 'published' para o papel anon). Ver supabase/migrations.
 * Autores, categorias e páginas institucionais continuam versionados no código.
 */
const SEED = { en } as const;

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      })
    : null;

interface ArticleRow {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  content: string;
  category_slug: string;
  author_slug: string;
  published_at: string;
  updated_at: string | null;
  keywords: string[] | null;
  blueprint: string | null;
  faq: { q: string; a: string }[] | null;
  featured: boolean | null;
  cover_label: string | null;
}

function fromRow(r: ArticleRow): Article {
  return {
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? "",
    excerpt: r.excerpt,
    content: r.content,
    category: r.category_slug,
    author: r.author_slug,
    publishedAt: r.published_at.slice(0, 10),
    updatedAt: r.updated_at?.slice(0, 10),
    keywords: r.keywords ?? [],
    blueprint: r.blueprint ?? undefined,
    faq: r.faq ?? undefined,
    featured: r.featured ?? false,
    coverLabel: r.cover_label ?? r.title.split(" ").slice(0, 2).join(" ").toUpperCase(),
  };
}

const byDateDesc = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt);

/** Tag de cache por site — a API de ingestão chama revalidateTag(articlesTag(site), "max") ao publicar */
export const articlesTag = (site: SiteId) => `articles-${site}`;

export async function getArticles(site: SiteId): Promise<Article[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(articlesTag(site));
  if (supabase) {
    const { data, error } = await supabase
      .from("articles_public")
      .select("*")
      .eq("site_slug", site)
      .order("published_at", { ascending: false });
    if (!error && data) return (data as ArticleRow[]).map(fromRow);
    console.error("[repo] Supabase indisponível, usando conteúdo local:", error?.message);
  }
  return [...SEED[site].articles].sort(byDateDesc);
}

export async function getArticle(site: SiteId, slug: string) {
  return (await getArticles(site)).find((a) => a.slug === slug) ?? null;
}

export async function getCategories(site: SiteId): Promise<Category[]> {
  return SEED[site].categories;
}

/** Só categorias com conteúdo — evita páginas vazias (regra editorial) */
export async function getActiveCategories(site: SiteId): Promise<Category[]> {
  const [cats, arts] = await Promise.all([getCategories(site), getArticles(site)]);
  return cats.filter((c) => arts.some((a) => a.category === c.slug));
}

export async function getCategory(site: SiteId, slug: string) {
  return SEED[site].categories.find((c) => c.slug === slug) ?? null;
}

export async function getAuthors(site: SiteId): Promise<Author[]> {
  return SEED[site].authors;
}

export async function getAuthor(site: SiteId, slug: string) {
  return SEED[site].authors.find((a) => a.slug === slug) ?? null;
}

export async function getPages(site: SiteId): Promise<InstitutionalPage[]> {
  return SEED[site].pages;
}

export async function getPage(site: SiteId, slug: string) {
  return SEED[site].pages.find((p) => p.slug === slug) ?? null;
}

export async function searchArticles(site: SiteId, query: string) {
  const q = normalize(query);
  if (!q) return [];
  return (await getArticles(site)).filter((a) =>
    normalize([a.title, a.subtitle, a.excerpt, a.keywords.join(" "), a.content].join(" ")).includes(q),
  );
}

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
