import { Marked, type Tokens } from "marked";

export interface Heading {
  id: string;
  text: string;
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Renderiza Markdown para HTML.
 * HTML bruto dentro do Markdown é ESCAPADO (proteção contra XSS em conteúdo vindo da API de ingestão).
 * Links só aceitam http(s), mailto e caminhos relativos.
 */
export function renderMarkdown(md: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const marked = new Marked({
    gfm: true,
    renderer: {
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return escapeHtml(text);
      },
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const plain = inner.replace(/<[^>]+>/g, "");
        const id = slugify(plain);
        if (depth === 2) headings.push({ id, text: plain });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const safe = /^(https?:|mailto:|\/|#)/i.test(href) ? href : "#";
        const external = /^https?:/i.test(safe);
        return `<a href="${escapeHtml(safe)}"${title ? ` title="${escapeHtml(title)}"` : ""}${
          external ? ' rel="noopener" target="_blank"' : ""
        }>${text}</a>`;
      },
    },
  });
  const html = marked.parse(md, { async: false }) as string;
  return { html, headings };
}

export function readingMinutes(md: string) {
  return Math.max(1, Math.round(md.split(/\s+/).length / 200));
}
