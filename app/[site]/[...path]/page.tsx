import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Chrome";
import { Cover } from "@/components/Cover";
import { readingMinutes, renderMarkdown } from "@/lib/markdown";
import * as repo from "@/lib/repo";
import { SITE_IDS, SITES, getSite, type SiteConfig } from "@/lib/sites";
import type { Article } from "@/lib/types";
import { formatDate, urls } from "@/lib/urls";

/**
 * Caminhos desconhecidos e a busca (searchParams) são resolvidos no servidor antes de
 * responder: assim slugs inexistentes recebem 404 real, e não uma página vazia.
 */
export const instant = false;

/* ─── Resolução de rotas localizadas ──────────────────────────────────────── */
type Resolved =
  | { kind: "article"; article: Article }
  | { kind: "page"; slug: string }
  | { kind: "category"; slug: string }
  | { kind: "author"; slug: string }
  | { kind: "search" };

async function resolve(site: SiteConfig, path: string[]): Promise<Resolved | null> {
  const [a, b, ...rest] = path.map(decodeURIComponent);
  if (rest.length) return null;
  if (!b) {
    if (a === site.routes.search) return { kind: "search" };
    const article = await repo.getArticle(site.id, a);
    if (article) return { kind: "article", article };
    if (await repo.getPage(site.id, a)) return { kind: "page", slug: a };
    return null;
  }
  if (a === site.routes.category) {
    const active = await repo.getActiveCategories(site.id);
    return active.some((c) => c.slug === b) ? { kind: "category", slug: b } : null;
  }
  if (a === site.routes.author && (await repo.getAuthor(site.id, b))) return { kind: "author", slug: b };
  return null;
}

export async function generateStaticParams() {
  const out: { site: string; path: string[] }[] = [];
  for (const id of SITE_IDS) {
    const s = SITES[id];
    const [arts, cats, auths, pages] = await Promise.all([
      repo.getArticles(id),
      repo.getActiveCategories(id),
      repo.getAuthors(id),
      repo.getPages(id),
    ]);
    arts.forEach((x) => out.push({ site: id, path: [x.slug] }));
    pages.forEach((x) => out.push({ site: id, path: [x.slug] }));
    cats.forEach((x) => out.push({ site: id, path: [s.routes.category, x.slug] }));
    auths.forEach((x) => out.push({ site: id, path: [s.routes.author, x.slug] }));
  }
  return out;
}

export async function generateMetadata({ params }: PageProps<"/[site]/[...path]">): Promise<Metadata> {
  const { site: id, path } = await params;
  const site = getSite(id);
  const u = urls(site);
  const r = await resolve(site, path);
  if (!r) return {};
  switch (r.kind) {
    case "article": {
      const a = r.article;
      return {
        title: a.title,
        description: a.excerpt,
        keywords: a.keywords,
        alternates: { canonical: u.article(a.slug) },
        openGraph: {
          type: "article",
          title: a.title,
          description: a.excerpt,
          url: u.article(a.slug),
          publishedTime: a.publishedAt,
          modifiedTime: a.updatedAt ?? a.publishedAt,
        },
      };
    }
    case "page": {
      const p = (await repo.getPage(site.id, r.slug))!;
      return { title: p.title, description: p.description, alternates: { canonical: u.page(p.slug) } };
    }
    case "category": {
      const c = (await repo.getCategory(site.id, r.slug))!;
      return { title: c.name, description: c.description, alternates: { canonical: u.category(c.slug) } };
    }
    case "author": {
      const a = (await repo.getAuthor(site.id, r.slug))!;
      return { title: a.name, description: a.bio, alternates: { canonical: u.author(a.slug) } };
    }
    case "search":
      return { title: site.ui.searchTitle, robots: { index: false, follow: true } };
  }
}

export default async function CatchAll({ params, searchParams }: PageProps<"/[site]/[...path]">) {
  const { site: id, path } = await params;
  const site = getSite(id);
  const r = await resolve(site, path);
  if (!r) notFound();
  switch (r.kind) {
    case "article":
      return <ArticleView site={site} article={r.article} />;
    case "page":
      return <PageView site={site} slug={r.slug} />;
    case "category":
      return <CategoryView site={site} slug={r.slug} />;
    case "author":
      return <AuthorView site={site} slug={r.slug} />;
    case "search": {
      const q = (await searchParams).q;
      return <SearchView site={site} q={typeof q === "string" ? q : ""} />;
    }
  }
}

/* ─── Artigo ──────────────────────────────────────────────────────────────── */
async function ArticleView({ site, article: a }: { site: SiteConfig; article: Article }) {
  const u = urls(site);
  const [category, author, all, categories, authors] = await Promise.all([
    repo.getCategory(site.id, a.category),
    repo.getAuthor(site.id, a.author),
    repo.getArticles(site.id),
    repo.getCategories(site.id),
    repo.getAuthors(site.id),
  ]);
  const { html, headings } = renderMarkdown(a.content);
  const minutes = readingMinutes(a.content);
  const idx = all.findIndex((x) => x.slug === a.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;
  const related = all.filter((x) => x.slug !== a.slug).slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.excerpt,
      inLanguage: site.htmlLang,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt ?? a.publishedAt,
      author: author ? { "@type": "Person", name: author.name, url: u.abs(u.author(author.slug)) } : undefined,
      publisher: { "@type": "Organization", name: site.name, url: site.domain },
      mainEntityOfPage: u.abs(u.article(a.slug)),
      keywords: a.keywords.join(", "),
      genre: "satire",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: site.ui.breadcrumbHome, item: site.domain },
        ...(category ? [{ "@type": "ListItem", position: 2, name: category.name, item: u.abs(u.category(category.slug)) }] : []),
        { "@type": "ListItem", position: category ? 3 : 2, name: a.title },
      ],
    },
    ...(a.faq?.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
  ];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        label="breadcrumb"
        items={[
          { name: site.ui.breadcrumbHome, href: u.home() },
          ...(category ? [{ name: category.name, href: u.category(category.slug) }] : []),
          { name: a.title },
        ]}
      />
      <header className="mt-6 max-w-4xl">
        {category && (
          <Link href={u.category(category.slug)} className="inline-block bg-alert px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink">
            {category.name}
          </Link>
        )}
        <h1 className="mt-4 font-display text-4xl uppercase leading-[1.05] sm:text-6xl">{a.title}</h1>
        <p className="mt-4 text-xl text-muted">{a.subtitle}</p>
        <p className="mt-5 font-mono text-xs uppercase text-muted">
          {site.ui.by}{" "}
          {author && (
            <Link href={u.author(author.slug)} className="font-bold text-text underline decoration-alert decoration-2">
              {author.name}
            </Link>
          )}{" "}
          · {site.ui.published} <time dateTime={a.publishedAt}>{formatDate(a.publishedAt, site.htmlLang)}</time>
          {a.updatedAt && (
            <>
              {" "}
              · {site.ui.updated} <time dateTime={a.updatedAt}>{formatDate(a.updatedAt, site.htmlLang)}</time>
            </>
          )}{" "}
          · {minutes} {site.ui.minRead}
        </p>
      </header>

      <div className="brutal mt-8 aspect-[1200/630] overflow-hidden">
        <Cover label={a.coverLabel} tone={category?.tone ?? "steel"} seed={a.slug} stamp={site.ui.stamp} title={a.title} className="h-full w-full" />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="max-w-3xl">
          <div className="prose-sc" dangerouslySetInnerHTML={{ __html: html }} />

          {a.blueprint && (
            <aside className="brutal mt-10 bg-blueprint p-6 text-paper" aria-labelledby="gabarito">
              <h2 id="gabarito" className="font-mono text-xs font-bold uppercase tracking-widest text-alert">
                {site.ui.blueprint}
              </h2>
              <p className="mt-2 text-lg font-semibold">{a.blueprint}</p>
            </aside>
          )}

          {a.faq?.length ? (
            <section className="mt-12" aria-labelledby="faq">
              <h2 id="faq" className="font-display text-3xl uppercase">
                {site.ui.faq}
              </h2>
              <div className="mt-4 space-y-3">
                {a.faq.map((f) => (
                  <details key={f.q} className="brutal bg-surface p-4">
                    <summary className="cursor-pointer font-bold">{f.q}</summary>
                    <p className="mt-2 text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {author && (
            <section className="brutal mt-12 flex gap-4 bg-surface p-6" aria-labelledby="autor">
              <div className="grid h-14 w-14 shrink-0 place-items-center bg-alert font-display text-2xl text-ink" aria-hidden="true">
                {author.name[0]}
              </div>
              <div>
                <h2 id="autor" className="font-mono text-xs uppercase tracking-widest text-muted">
                  {site.ui.aboutAuthor}
                </h2>
                <p className="mt-1 text-lg font-extrabold">
                  <Link href={u.author(author.slug)}>{author.name}</Link>
                </p>
                <p className="text-sm text-muted">{author.bio}</p>
                <p className="mt-2 font-mono text-[11px] uppercase text-muted">{site.ui.fictionalNote}</p>
              </div>
            </section>
          )}

          <nav className="mt-10 grid gap-4 sm:grid-cols-2" aria-label={`${site.ui.prev} / ${site.ui.next}`}>
            {older ? (
              <Link href={u.article(older.slug)} className="brutal brutal-hover block bg-surface p-4">
                <span className="font-mono text-[11px] uppercase text-muted">← {site.ui.prev}</span>
                <span className="mt-1 block font-bold">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link href={u.article(newer.slug)} className="brutal brutal-hover block bg-surface p-4 text-right">
                <span className="font-mono text-[11px] uppercase text-muted">{site.ui.next} →</span>
                <span className="mt-1 block font-bold">{newer.title}</span>
              </Link>
            )}
          </nav>
        </div>

        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <nav aria-labelledby="toc" className="brutal sticky top-32 bg-surface p-5">
              <h2 id="toc" className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
                {site.ui.toc}
              </h2>
              <ol className="mt-3 space-y-2 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="hover:underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="relacionados">
          <h2 id="relacionados" className="font-display text-3xl uppercase">
            {site.ui.related}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((x) => (
              <ArticleCard
                key={x.slug}
                site={site}
                article={x}
                category={categories.find((c) => c.slug === x.category)}
                author={authors.find((au) => au.slug === x.author)}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

/* ─── Página institucional ────────────────────────────────────────────────── */
async function PageView({ site, slug }: { site: SiteConfig; slug: string }) {
  const p = (await repo.getPage(site.id, slug))!;
  const { html } = renderMarkdown(p.content);
  return (
    <article className="max-w-3xl">
      <Breadcrumbs label="breadcrumb" items={[{ name: site.ui.breadcrumbHome, href: "/" }, { name: p.title }]} />
      <h1 className="mt-6 font-display text-4xl uppercase sm:text-5xl">{p.title}</h1>
      <div className="prose-sc mt-8" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

/* ─── Categoria ───────────────────────────────────────────────────────────── */
async function CategoryView({ site, slug }: { site: SiteConfig; slug: string }) {
  const [c, arts, authors] = await Promise.all([repo.getCategory(site.id, slug), repo.getArticles(site.id), repo.getAuthors(site.id)]);
  const list = arts.filter((a) => a.category === slug);
  return (
    <>
      <Breadcrumbs label="breadcrumb" items={[{ name: site.ui.breadcrumbHome, href: "/" }, { name: c!.name }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl uppercase sm:text-6xl">{c!.name}</h1>
        <p className="mt-3 text-lg text-muted">{c!.description}</p>
      </header>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <ArticleCard key={a.slug} site={site} article={a} category={c!} author={authors.find((x) => x.slug === a.author)} />
        ))}
      </div>
    </>
  );
}

/* ─── Autor ───────────────────────────────────────────────────────────────── */
async function AuthorView({ site, slug }: { site: SiteConfig; slug: string }) {
  const [author, arts, cats] = await Promise.all([repo.getAuthor(site.id, slug), repo.getArticles(site.id), repo.getCategories(site.id)]);
  const list = arts.filter((a) => a.author === slug);
  const jsonLd = { "@context": "https://schema.org", "@type": "Person", name: author!.name, description: author!.bio, jobTitle: author!.role };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs label="breadcrumb" items={[{ name: site.ui.breadcrumbHome, href: "/" }, { name: author!.name }]} />
      <header className="brutal mt-6 max-w-3xl bg-surface p-6">
        <p className="font-mono text-xs uppercase text-muted">{author!.role}</p>
        <h1 className="mt-1 font-display text-4xl uppercase sm:text-5xl">{author!.name}</h1>
        <p className="mt-3 text-lg">{author!.bio}</p>
        <p className="mt-3 font-mono text-[11px] uppercase text-muted">{site.ui.fictionalNote}</p>
      </header>
      <h2 className="mt-12 font-display text-3xl uppercase">
        {site.ui.articlesBy} {author!.name.split(" ")[0]}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <ArticleCard key={a.slug} site={site} article={a} category={cats.find((c) => c.slug === a.category)} author={author!} />
        ))}
      </div>
    </>
  );
}

/* ─── Busca ───────────────────────────────────────────────────────────────── */
async function SearchView({ site, q }: { site: SiteConfig; q: string }) {
  const [results, cats, authors] = await Promise.all([repo.searchArticles(site.id, q), repo.getCategories(site.id), repo.getAuthors(site.id)]);
  return (
    <>
      <h1 className="font-display text-4xl uppercase sm:text-5xl">{site.ui.searchTitle}</h1>
      <form method="get" role="search" className="mt-6 flex max-w-xl gap-2">
        <label htmlFor="q" className="sr-only">
          {site.ui.search}
        </label>
        <input id="q" name="q" type="search" defaultValue={q} placeholder={site.ui.searchPlaceholder} className="brutal h-12 flex-1 bg-surface px-4" />
        <button type="submit" className="brutal h-12 bg-alert px-5 font-bold text-ink">
          {site.ui.search}
        </button>
      </form>
      <p className="mt-4 text-muted">{q ? (results.length ? null : site.ui.searchEmpty) : site.ui.searchHint}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <ArticleCard key={a.slug} site={site} article={a} category={cats.find((c) => c.slug === a.category)} author={authors.find((x) => x.slug === a.author)} />
        ))}
      </div>
    </>
  );
}
