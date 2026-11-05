import { createHash } from "node:crypto";
import { revalidateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/markdown";
import * as repo from "@/lib/repo";
import { SITES, isSiteId } from "@/lib/sites";

/**
 * API de ingestão de artigos (sistema externo de redação → banco).
 * Auth: Authorization: Bearer <API_KEY>  (hash sha256 conferido em public.api_keys)
 * Requer SUPABASE_SERVICE_ROLE_KEY (somente servidor). Ver README.
 */
const MIN_WORDS = Number(process.env.MIN_WORDS ?? 400);

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

const json = (status: number, body: unknown) => Response.json(body, { status });

async function authenticate(req: Request, scope: string) {
  const db = admin();
  if (!db) return { error: json(503, { error: "Supabase não configurado no servidor." }) };
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: json(401, { error: "Chave ausente." }) };
  const hash = createHash("sha256").update(token).digest("hex");
  const { data: key } = await db
    .from("api_keys")
    .select("id, site_id, scopes, revoked_at, sites(slug)")
    .eq("key_hash", hash)
    .maybeSingle();
  if (!key || key.revoked_at) return { error: json(401, { error: "Chave inválida ou revogada." }) };
  if (!key.scopes.includes(scope)) return { error: json(403, { error: `Escopo ${scope} ausente.` }) };
  await db.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", key.id);
  const siteSlug = (key.sites as unknown as { slug: string }).slug;
  return { db, siteId: key.site_id as string, siteSlug };
}

export async function GET(req: Request) {
  const auth = await authenticate(req, "articles:read");
  if ("error" in auth) return auth.error;
  const { data, error } = await auth.db
    .from("articles")
    .select("id, slug, title, status, category_slug, author_slug, published_at, updated_at")
    .eq("site_id", auth.siteId)
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) return json(500, { error: error.message });
  return json(200, { data });
}

export async function POST(req: Request) {
  const auth = await authenticate(req, "articles:write");
  if ("error" in auth) return auth.error;
  if (!isSiteId(auth.siteSlug)) return json(500, { error: "Site da chave desconhecido." });
  const site = SITES[auth.siteSlug];

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "JSON inválido." });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const title = str("title");
  const excerpt = str("excerpt");
  const content = str("content");
  const category = str("category");
  const author = str("author");
  let status = (str("status") || "draft") as "draft" | "review" | "published";
  const problems: string[] = [];

  if (title.length < 10 || title.length > 140) problems.push("title: entre 10 e 140 caracteres.");
  if (excerpt.length < 40 || excerpt.length > 320) problems.push("excerpt: entre 40 e 320 caracteres.");
  if (!content) problems.push("content: obrigatório (markdown).");
  if (!["draft", "review", "published"].includes(status)) problems.push("status: draft | review | published.");
  if (!(await repo.getCategory(site.id, category))) problems.push(`category: slug inexistente em ${site.name}.`);
  if (!(await repo.getAuthor(site.id, author))) problems.push("author: use 'arthur' ou 'nico'.");
  if (problems.length) return json(422, { error: "Validação falhou.", problems });

  const warnings: string[] = [];
  const words = content.split(/\s+/).length;
  if (status === "published" && words < MIN_WORDS) {
    status = "draft";
    warnings.push(`Conteúdo com ${words} palavras (< ${MIN_WORDS}); salvo como rascunho.`);
  }

  const row = {
    site_id: auth.siteId,
    slug: slugify(str("slug") || title),
    title,
    subtitle: str("subtitle") || null,
    excerpt,
    content, // markdown; HTML bruto é escapado na renderização (lib/markdown.ts)
    category_slug: category,
    author_slug: author,
    keywords: Array.isArray(body.keywords) ? (body.keywords as unknown[]).filter((k) => typeof k === "string") : [],
    blueprint: str("blueprint") || null,
    faq: Array.isArray(body.faq) ? body.faq : null,
    featured: body.featured === true,
    cover_label: str("cover_label") || null,
    meta_title: str("meta_title") || null,
    meta_description: str("meta_description") || null,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    idempotency_key: str("idempotency_key") || null,
  };

  const { data, error } = await auth.db.from("articles").insert(row).select("id, slug, status").single();
  if (error) {
    if (error.code === "23505") return json(409, { error: "Slug ou idempotency_key já existe neste site." });
    return json(500, { error: error.message });
  }

  if (status === "published") revalidateTag(repo.articlesTag(site.id), "max");

  return json(201, { data: { ...data, url: `${site.domain}/${data.slug}` }, warnings });
}
