export type SiteId = "en";

export interface Category {
  slug: string;
  name: string;
  description: string;
  /** Cor de destaque usada na capa gerada e no selo */
  tone: "alert" | "fail" | "blueprint" | "paper" | "steel";
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  /** Personagem fictício — sempre true neste projeto (transparência editorial) */
  fictional: true;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  /** Markdown */
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  keywords: string[];
  /** "O gabarito": a solução óbvia que ninguém aplica */
  blueprint?: string;
  faq?: FaqItem[];
  featured?: boolean;
  /** Texto curto exibido na capa gerada (2–3 palavras) */
  coverLabel: string;
}

export interface InstitutionalPage {
  slug: string;
  title: string;
  description: string;
  /** Markdown */
  content: string;
}
