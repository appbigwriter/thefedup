import { slugify } from "../markdown";
import * as repo from "../repo";
import { SITES, type SiteConfig } from "../sites";
import type { FaqItem, SiteId } from "../types";

/** Regras editoriais compartilhadas pela API de ingestão e pela área administrativa. */
export const MIN_WORDS = Number(process.env.MIN_WORDS ?? 400);

export type ArticleStatus = "draft" | "review" | "published";

export interface ArticleInput {
  title: string;
  slug?: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  keywords?: string[];
  blueprint?: string;
  faq?: FaqItem[] | null;
  featured?: boolean;
  cover_label?: string;
  meta_title?: string;
  meta_description?: string;
  status: ArticleStatus;
}

export const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export interface ChecklistItem {
  ok: boolean;
  label: string;
}

/** Checklist exibido no editor e aplicado antes de publicar */
export function editorialChecklist(input: Partial<ArticleInput>): ChecklistItem[] {
  const words = wordCount(input.content ?? "");
  const h2 = ((input.content ?? "").match(/^## /gm) ?? []).length;
  return [
    { ok: (input.title?.length ?? 0) >= 10 && (input.title?.length ?? 0) <= 140, label: "Título entre 10 e 140 caracteres" },
    { ok: (input.excerpt?.length ?? 0) >= 40 && (input.excerpt?.length ?? 0) <= 320, label: "Resumo entre 40 e 320 caracteres" },
    { ok: words >= MIN_WORDS, label: `Pelo menos ${MIN_WORDS} palavras (atual: ${words})` },
    { ok: h2 >= 2, label: `Ao menos 2 intertítulos ## (atual: ${h2})` },
    { ok: Boolean(input.blueprint?.trim()), label: "Gabarito preenchido" },
    { ok: (input.meta_description?.length ?? 0) === 0 || (input.meta_description?.length ?? 0) <= 160, label: "Meta description até 160 caracteres" },
  ];
}

export interface ValidationResult {
  problems: string[];
  warnings: string[];
  row: Record<string, unknown>;
}

export async function validateArticle(siteId: SiteId, input: ArticleInput): Promise<ValidationResult> {
  const site: SiteConfig = SITES[siteId];
  const problems: string[] = [];
  const warnings: string[] = [];
  let status = input.status;

  if (input.title.length < 10 || input.title.length > 140) problems.push("Título: entre 10 e 140 caracteres.");
  if (input.excerpt.length < 40 || input.excerpt.length > 320) problems.push("Resumo: entre 40 e 320 caracteres.");
  if (!input.content.trim()) problems.push("Conteúdo é obrigatório.");
  if (!["draft", "review", "published"].includes(status)) problems.push("Status inválido.");
  if (!(await repo.getCategory(siteId, input.category))) problems.push(`Categoria inexistente em ${site.name}.`);
  if (!(await repo.getAuthor(siteId, input.author))) problems.push("Autor: use 'arthur' ou 'nico'.");

  const words = wordCount(input.content);
  if (status === "published" && words < MIN_WORDS) {
    status = "draft";
    warnings.push(`Conteúdo com ${words} palavras (mínimo ${MIN_WORDS}); salvo como rascunho.`);
  }

  const slug = slugify(input.slug?.trim() || input.title);
  if (!slug) problems.push("Slug inválido.");

  return {
    problems,
    warnings,
    row: {
      slug,
      title: input.title,
      subtitle: input.subtitle || null,
      excerpt: input.excerpt,
      content: input.content, // markdown; HTML bruto é escapado na renderização
      category_slug: input.category,
      author_slug: input.author,
      keywords: input.keywords ?? [],
      blueprint: input.blueprint || null,
      faq: input.faq?.length ? input.faq : null,
      featured: Boolean(input.featured),
      cover_label: input.cover_label || null,
      meta_title: input.meta_title || null,
      meta_description: input.meta_description || null,
      status,
    },
  };
}
