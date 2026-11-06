# The Fed Up Buddies

Blog de sátira e opinião (en) do ecossistema Arthur & Nico. Projetos-irmãos, em repositórios separados: *Os Saco Cheio* e *Los Hartos*.

Next.js 16 (App Router, Cache Components) + Tailwind 4. Um site por repositório, um schema por site.

| | |
|---|---|
| Idioma | en |
| Domínio (proposta — verificar e registrar) | fedupbuddies.com |
| Schema no Supabase central | `blog_fedupbuddies` (proposta — confirmar no provisionamento) |
| Rotas | article `/{slug}` · topic `/topic/{slug}` · author `/author/{slug}` · search `/search` |

## Rodar localmente
```bash
npm install
npm run build
npm run start
```
Abra http://localhost:3000.

## Estrutura
```
proxy.ts                 qualquer host → app/[site] (canonical sempre em SITE_URL); /favicon.ico → ícone do blog
lib/sites.ts             configuração, domínio, rotas e textos de interface
lib/content/*.ts         categorias, autores (personagens fictícios), artigos iniciais, páginas institucionais
lib/repo.ts              camada de dados (hoje: conteúdo local; próximo passo: schema do projeto via DATABASE_URL)
lib/markdown.ts          Markdown → HTML (HTML bruto escapado, links filtrados)
lib/articles/validate.ts regras editoriais compartilhadas (API e admin)
components/              capa SVG gerada, carrossel, cards, cabeçalho/rodapé, tema claro/escuro
app/[site]/              home, artigo/página/tema/autor/busca, 404, sitemap.xml, robots.txt, feed.xml
app/health               validação da plataforma (HTTP 200)
app/api/v1/articles      API de ingestão — será religada ao schema do projeto
supabase/inspect_schema.sql   levantamento somente leitura do schema provisionado
```

## Deploy (Easypanel / VPS)
- Build por **Dockerfile** (`output: "standalone"`), porta 3000, healthcheck em `/health`.
- Variáveis **apenas** no Environment do serviço (nunca no repositório): `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `CONTROL_TOWER_*`, `AUTHORITY_*_TOKEN`, `SITE_URL=https://fedupbuddies.com`.
- Banco: operar **somente** no schema `blog_fedupbuddies`. Nada no `public` nem em `auth`.

## Pendências
- [ ] Rodar `supabase/inspect_schema.sql` no schema provisionado e adaptar `lib/repo.ts` às tabelas do template `blog_standard`.
- [ ] Área administrativa com usuários próprios (`blog_fedupbuddies.users`, senha com hash, papéis admin/editor).
- [ ] Religar a API de ingestão ao schema (hoje responde 503 sem configuração).
- [ ] Etapa Zero do AdSense: diretrizes oficiais atuais **não consultadas** — pendente de validação.
- [ ] Ampliar o lote editorial (hoje: 4 artigos) antes de pedir AdSense; aprovação nunca é garantida.
- [ ] Preencher os marcadores `[INSERIR …]` / `[INSERT …]` / `[INSERTAR …]` das páginas institucionais.
- [ ] Trocar as capas SVG por artes reais quando houver.
