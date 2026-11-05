import Link from "next/link";
import type { SiteConfig } from "@/lib/sites";
import type { Article, Author, Category } from "@/lib/types";
import { formatDate, urls } from "@/lib/urls";
import { Cover } from "./Cover";

export function ArticleCard({
  site,
  article,
  category,
  author,
}: {
  site: SiteConfig;
  article: Article;
  category?: Category;
  author?: Author;
}) {
  const u = urls(site);
  return (
    <article className="brutal brutal-hover group relative flex flex-col bg-surface">
      <div className="aspect-[1200/630] overflow-hidden border-b-2 border-line">
        <Cover
          label={article.coverLabel}
          tone={category?.tone ?? "steel"}
          seed={article.slug}
          stamp={site.ui.stamp}
          className="h-full w-full"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">{category.name}</p>
        )}
        <h3 className="mt-2 text-xl font-extrabold leading-snug">
          <Link href={u.article(article.slug)} className="after:absolute after:inset-0 group-hover:underline">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{article.excerpt}</p>
        <p className="mt-auto pt-4 font-mono text-[11px] uppercase text-muted">
          {author?.name} · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, site.htmlLang)}</time>
        </p>
      </div>
    </article>
  );
}
