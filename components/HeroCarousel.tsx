"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface Slide {
  href: string;
  category: string;
  title: string;
  excerpt: string;
  cover: ReactNode;
}

/**
 * Hero em carrossel: até 5 slides, altura máx. 450px, sem CLS (altura fixa),
 * navegável por teclado, com pausa; autoplay lento (8s) que para em hover/foco
 * e é desativado com prefers-reduced-motion.
 */
export function HeroCarousel({
  slides,
  labels,
}: {
  slides: Slide[];
  labels: { prev: string; next: string; pause: string; play: string; slide: string; read: string };
}) {
  const items = slides.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || hovered || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 8000);
    return () => clearInterval(id);
  }, [playing, hovered, items.length]);

  const go = (i: number) => setIndex((i + items.length) % items.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={labels.slide}
      className="brutal relative h-[380px] overflow-hidden bg-ink text-paper sm:h-[450px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      {items.map((s, i) => (
        <div
          key={s.href}
          role="group"
          aria-roledescription="slide"
          aria-label={`${labels.slide} ${i + 1} / ${items.length}`}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <div className="absolute inset-0 [&>svg]:h-full [&>svg]:w-full">{s.cover}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 pb-16 sm:p-10 sm:pb-16">
            <p className="mb-2 inline-block bg-alert px-2 py-0.5 font-mono text-xs font-bold uppercase text-ink">{s.category}</p>
            <h2 className="max-w-3xl font-display text-3xl uppercase leading-tight sm:text-5xl">{s.title}</h2>
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-paper/85 sm:text-base">{s.excerpt}</p>
            <Link
              href={s.href}
              tabIndex={i === index ? 0 : -1}
              className="mt-4 inline-block border-2 border-paper bg-alert px-4 py-2 font-bold text-ink shadow-[4px_4px_0_#000] hover:-translate-y-0.5"
            >
              {labels.read} →
            </Link>
          </div>
        </div>
      ))}

      {items.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:right-10">
          <button type="button" onClick={() => go(index - 1)} aria-label={labels.prev} className="grid h-9 w-9 place-items-center border-2 border-paper bg-ink">
            ←
          </button>
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`${labels.slide} ${i + 1}`}
              aria-current={i === index}
              className={`h-3 w-3 border-2 border-paper ${i === index ? "bg-alert" : "bg-transparent"}`}
            />
          ))}
          <button type="button" onClick={() => go(index + 1)} aria-label={labels.next} className="grid h-9 w-9 place-items-center border-2 border-paper bg-ink">
            →
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? labels.pause : labels.play}
            className="grid h-9 w-9 place-items-center border-2 border-paper bg-ink"
          >
            {playing ? "❚❚" : "▶"}
          </button>
        </div>
      )}
    </section>
  );
}
