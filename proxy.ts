import { NextResponse, type NextRequest } from "next/server";
import { SITE } from "./lib/sites";

/**
 * Este repositório publica um único blog: qualquer host (domínio próprio, domínio técnico da
 * plataforma, IP da rede, localhost) é reescrito internamente para /{site}/...
 * O SEO não é afetado: canonical, sitemap e Open Graph usam sempre SITE_URL (domínio oficial).
 */
const PER_SITE_FILES = new Set(["/sitemap.xml", "/robots.txt", "/feed.xml", "/manifest.webmanifest"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/health") return NextResponse.next();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
  const url = request.nextUrl.clone();
  if (pathname === "/favicon.ico") {
    url.pathname = `/icon-${SITE.id}.svg`;
    return NextResponse.rewrite(url);
  }
  // Arquivos estáticos de /public (ads.txt, ícones…) passam direto
  if (/\.[a-z0-9]+$/i.test(pathname) && !PER_SITE_FILES.has(pathname)) {
    return NextResponse.next();
  }
  url.pathname = `/${SITE.id}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next).*)"],
};
