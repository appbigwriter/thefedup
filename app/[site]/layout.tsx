import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer, Header } from "@/components/Chrome";
import { themeScript } from "@/components/ThemeToggle";
import { getActiveCategories, getPages } from "@/lib/repo";
import { SITE_IDS, SITES, isSiteId } from "@/lib/sites";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export function generateStaticParams() {
  return SITE_IDS.map((site) => ({ site }));
}

export async function generateMetadata({ params }: LayoutProps<"/[site]">): Promise<Metadata> {
  const { site: id } = await params;
  if (!isSiteId(id)) return {};
  const site = SITES[id];
  return {
    metadataBase: new URL(site.domain),
    title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
    description: site.description,
    applicationName: site.name,
    alternates: {
      canonical: "/",
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: { type: "website", siteName: site.name, locale: site.locale },
    twitter: { card: "summary_large_image" },
    icons: { icon: `/icon-${id}.svg` },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[site]">) {
  const { site: id } = await params;
  if (!isSiteId(id)) notFound();
  const site = SITES[id];
  const [categories, pages] = await Promise.all([getActiveCategories(id), getPages(id)]);

  return (
    <html lang={site.htmlLang} className={`${anton.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#conteudo"
          className="sr-only z-50 bg-alert px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {site.ui.skip}
        </a>
        <Header site={site} categories={categories} />
        <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8">
          {children}
        </main>
        <Footer site={site} categories={categories} pages={pages} />
      </body>
    </html>
  );
}
