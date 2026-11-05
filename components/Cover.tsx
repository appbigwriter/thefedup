import type { Category } from "@/lib/types";

/**
 * Capa gerada em SVG (sem arquivo de imagem → nunca quebra, peso mínimo, sem CLS).
 * Substituível por arte real (prompts em docs/04) quando houver imagens produzidas.
 */
const TONES: Record<Category["tone"], { bg: string; fg: string; accent: string }> = {
  alert: { bg: "#0E0F11", fg: "#FFD60A", accent: "#ECEAE4" },
  fail: { bg: "#0E0F11", fg: "#D7263D", accent: "#FFD60A" },
  blueprint: { bg: "#13284d", fg: "#ECEAE4", accent: "#FFD60A" },
  paper: { bg: "#ECEAE4", fg: "#0E0F11", accent: "#D7263D" },
  steel: { bg: "#2B2E33", fg: "#ECEAE4", accent: "#FFD60A" },
};

const DISPLAY = { fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif" };
const MONO = { fontFamily: "var(--font-jetbrains), ui-monospace, monospace" };

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function splitLabel(label: string) {
  const words = label.split(" ");
  if (words.length > 2) {
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }
  if (words.length === 2 && label.length > 14) return words;
  return [label];
}

export function Cover({
  label,
  tone,
  seed,
  stamp,
  className = "",
  title,
}: {
  label: string;
  tone: Category["tone"];
  seed: string;
  stamp: string;
  className?: string;
  /** Texto alternativo; omita para capa decorativa */
  title?: string;
}) {
  const t = TONES[tone];
  const h = hash(seed);
  const stampX = 860 + (h % 120);
  const stampY = 110 + (h % 70);
  const lines = splitLabel(label);
  const fontSize = lines.length > 1 ? 118 : label.length > 12 ? 104 : 140;

  return (
    <svg
      viewBox="0 0 1200 630"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={`hz-${h}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="20" height="40" fill="#FFD60A" />
          <rect x="20" width="20" height="40" fill="#0E0F11" />
        </pattern>
        <pattern id={`grid-${h}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={t.fg} strokeOpacity="0.08" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="1200" height="630" fill={t.bg} />
      <rect width="1200" height="630" fill={`url(#grid-${h})`} />
      {/* faixa de obra inclinada 3° fora do prumo */}
      <g transform="rotate(3 600 560)">
        <rect x="-50" y="540" width="1300" height="46" fill={`url(#hz-${h})`} />
      </g>
      {/* scanlines da "digitalização" */}
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x="0" y={i * 40} width="1200" height="2" fill={t.fg} opacity="0.04" />
      ))}
      {lines.map((line, i) => (
        <text
          key={i}
          x="70"
          y={300 + i * (fontSize + 10) - (lines.length - 1) * 60}
          fill={t.fg}
          style={DISPLAY}
          fontSize={fontSize}
          letterSpacing="2"
        >
          {line}
        </text>
      ))}
      <g transform={`rotate(-12 ${stampX} ${stampY})`}>
        <rect x={stampX - 160} y={stampY - 45} width="320" height="90" fill="none" stroke={t.accent} strokeWidth="8" rx="6" />
        <text x={stampX} y={stampY + 18} textAnchor="middle" fill={t.accent} style={MONO} fontWeight="800" fontSize="48">
          {stamp}
        </text>
      </g>
      <text x="70" y="500" fill={t.fg} opacity="0.6" style={MONO} fontSize="26">
        {`NC-${String(h % 10000).padStart(4, "0")} · ${(h % 5) + 1}/5`}
      </text>
    </svg>
  );
}
