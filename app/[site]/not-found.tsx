"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getSite } from "@/lib/sites";

export default function NotFound() {
  const params = useParams<{ site: string }>();
  const site = getSite(params?.site ?? "pt");
  return (
    <section className="mx-auto max-w-2xl py-16 text-center">
      <p className="tilt-3 inline-block border-4 border-fail px-4 py-1 font-mono text-2xl font-extrabold text-fail">404 · {site.ui.stamp}</p>
      <h1 className="mt-8 font-display text-5xl uppercase">{site.ui.notFoundTitle}</h1>
      <p className="mt-4 text-lg text-muted">{site.ui.notFoundText}</p>
      <Link href="/" className="brutal mt-8 inline-block bg-alert px-5 py-3 font-bold text-ink">
        {site.ui.backHome}
      </Link>
    </section>
  );
}
