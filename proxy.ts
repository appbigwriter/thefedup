import { NextResponse, type NextRequest } from "next/server";
import { siteFromHost } from "./lib/sites";

/**
 * O domínio do blog (e localhost em desenvolvimento) é reescrito internamente para /{site}/...
 * /health e /admin respondem em qualquer host, inclusive no domínio técnico da plataforma.
 * Qualquer outro host recebe 404.
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
  // Arquivos estáticos de /public (ads.txt, ícones…) passam direto
  if (/\.[a-z0-9]+$/i.test(pathname) && !PER_SITE_FILES.has(pathname)) {
    return NextResponse.next();
  }
  const site = siteFromHost(request.headers.get("host"));
  if (!site) {
    return new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${site}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next).*)"],
};
