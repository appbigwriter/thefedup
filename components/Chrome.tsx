import Link from "next/link";
import { cacheLife } from "next/cache";
import type { SiteConfig } from "@/lib/sites";
import type { Category, InstitutionalPage } from "@/lib/types";
import { urls } from "@/lib/urls";
import { ThemeToggle } from "./ThemeToggle";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Logo({ site }: { site: SiteConfig }) {
  const name = site.name.toUpperCase();
  const head = name.slice(0, -1);
  const last = name.slice(-1);
  return (
    <span className="flex flex-col leading-none">
      <span className="font-display text-2xl tracking-wide sm:text-3xl">
        {head}
        {/* a última letra é "reprovada": cortada e fora do prumo */}
        <span className="tilt-3 inline-block text-alert [clip-path:polygon(0_0,100%_0,100%_70%,0_100%)]">{last}</span>
      </span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{site.tagline}</span>
    </span>
  );
}

export function Header({ site, categories }: { site: SiteConfig; categories: Category[] }) {
  const u = urls(site);
  return (
    <header className="sticky top-0 z-30 border-b-2 border-line bg-bg/95 backdrop-blur">
      <div className="hazard h-2 w-full" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={u.home()} aria-label={`${site.name} — ${site.ui.home}`}>
          <Logo site={site} />
        </Link>
        <div className="flex items-center gap-2">
          <form action={u.search()} method="get" role="search" className="hidden md:block">
            <label htmlFor="q-header" className="sr-only">
              {site.ui.search}
            </label>
            <input
              id="q-header"
              name="q"
              type="search"
              placeholder={site.ui.searchPlaceholder}
              className="brutal h-10 w-56 bg-surface px-3 text-sm placeholder:text-muted"
            />
          </form>
          <ThemeToggle label={site.ui.themeToggle} />
        </div>
      </div>
      <nav aria-label={site.ui.categories} className="border-t border-line/40">
        <ul className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 text-sm font-semibold">
          <li>
            <Link href={u.home()} className="block whitespace-nowrap px-2 py-1 hover:bg-alert hover:text-ink">
              {site.ui.home}
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={u.category(c.slug)} className="block whitespace-nowrap px-2 py-1 hover:bg-alert hover:text-ink">
                {c.name}
              </Link>
            </li>
          ))}
          <li className="md:hidden">
            <Link href={u.search()} className="block whitespace-nowrap px-2 py-1 hover:bg-alert hover:text-ink">
              {site.ui.search}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function Footer({ site, categories, pages }: { site: SiteConfig; categories: Category[]; pages: InstitutionalPage[] }) {
  const u = urls(site);
  return (
    <footer className="mt-20 border-t-2 border-line bg-ink text-paper">
      <div className="hazard h-2 w-full" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <Logo site={site} />
          <p className="mt-4 max-w-xs text-sm text-paper/75">{site.description}</p>
        </div>
        <nav aria-label={site.ui.categories}>
          <h2 className="font-mono text-xs uppercase tracking-widest text-alert">{site.ui.categories}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={u.category(c.slug)} className="hover:text-alert">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={site.ui.institutional}>
          <h2 className="font-mono text-xs uppercase tracking-widest text-alert">{site.ui.institutional}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {pages.map((p) => (
              <li key={p.slug}>
                <Link href={u.page(p.slug)} className="hover:text-alert">
                  {p.title}
                </Link>
              </li>
            ))}
            <li>
              <a href="/feed.xml" className="hover:text-alert">
                RSS
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-paper/15 px-4 py-5 text-center font-mono text-xs text-paper/60">
        © <CurrentYear /> {site.name} · {site.ui.footerNote}
      </p>
    </footer>
  );
}

export function Breadcrumbs({ items, label }: { items: { name: string; href?: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="font-mono text-xs uppercase tracking-wider text-muted">
      <ol className="flex flex-wrap gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-text hover:underline">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-text">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
