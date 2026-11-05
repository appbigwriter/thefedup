import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Cover } from "@/components/Cover";
import { HeroCarousel } from "@/components/HeroCarousel";
import { getActiveCategories, getArticles, getAuthors, getPages } from "@/lib/repo";
import { getSite } from "@/lib/sites";
import { urls } from "@/lib/urls";


export default async function Home({ params }: PageProps<"/[site]">) {
  const { site: id } = await params;
  const site = getSite(id);
  const u = urls(site);
  const [articles, categories, authors, pages] = await Promise.all([
    getArticles(site.id),
    getActiveCategories(site.id),
    getAuthors(site.id),
    getPages(site.id),
  ]);
  const cat = (slug: string) => categories.find((c) => c.slug === slug);
  const auth = (slug: string) => authors.find((a) => a.slug === slug);
  const featured = (articles.filter((a) => a.featured).length ? articles.filter((a) => a.featured) : articles).slice(0, 5);
  const about = pages[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.domain,
    inLanguage: site.htmlLang,
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.domain}${u.search()}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>

      <HeroCarousel
        slides={featured.map((a) => ({
          href: u.article(a.slug),
          category: cat(a.category)?.name ?? "",
          title: a.title,
          excerpt: a.excerpt,
          cover: <Cover label={a.coverLabel} tone={cat(a.category)?.tone ?? "steel"} seed={a.slug} stamp={site.ui.stamp} />,
        }))}
        labels={{
          prev: site.ui.prev,
          next: site.ui.next,
          pause: site.ui.pause,
          play: site.ui.play,
          slide: site.ui.slide,
          read: site.ui.readArticle,
        }}
      />

      <section className="mt-14" aria-labelledby="recentes">
        <h2 id="recentes" className="font-display text-3xl uppercase sm:text-4xl">
          {site.ui.latest}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((a) => (
            <ArticleCard key={a.slug} site={site} article={a} category={cat(a.category)} author={auth(a.author)} />
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-[2fr_1fr]" aria-labelledby="quadros">
        <div>
          <h2 id="quadros" className="font-display text-3xl uppercase sm:text-4xl">
            {site.ui.byCategory}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {categories.map((c) => (
              <li key={c.slug} className="brutal brutal-hover relative bg-surface p-5">
                <h3 className="text-lg font-extrabold">
                  <Link href={u.category(c.slug)} className="after:absolute after:inset-0">
                    {c.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-muted">{c.description}</p>
                <p className="mt-3 font-mono text-[11px] uppercase text-muted">
                  {site.ui.seeAll} →
                </p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="brutal bg-ink p-6 text-paper" aria-labelledby="dupla">
          <p className="tilt-3 inline-block bg-alert px-2 font-mono text-xs font-bold uppercase text-ink">Arthur & Nico</p>
          <h2 id="dupla" className="mt-4 font-display text-3xl uppercase">
            {site.ui.aboutBoxTitle}
          </h2>
          <p className="mt-3 text-sm text-paper/85">{site.ui.aboutBoxText}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {authors.map((a) => (
              <li key={a.slug}>
                <Link href={u.author(a.slug)} className="font-bold text-alert hover:underline">
                  {a.name}
                </Link>
                <span className="block text-paper/70">{a.role}</span>
              </li>
            ))}
          </ul>
          {about && (
            <Link href={u.page(about.slug)} className="mt-6 inline-block border-2 border-paper bg-alert px-4 py-2 font-bold text-ink">
              {site.ui.aboutBoxCta} →
            </Link>
          )}
        </aside>
      </section>
    </>
  );
}
