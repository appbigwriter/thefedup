-- Levantamento SOMENTE LEITURA do schema blog_fedupbuddies (não lê dados, não altera nada).
-- Rode no SQL Editor do Supabase central e cole os 3 resultados na conversa.

-- 1) Tabelas e colunas
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'blog_fedupbuddies'
order by table_name, ordinal_position;

-- 2) Chaves primárias, únicas e estrangeiras
select tc.table_name, tc.constraint_type, kcu.column_name,
       ccu.table_name as references_table, ccu.column_name as references_column
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on kcu.constraint_schema = tc.constraint_schema and kcu.constraint_name = tc.constraint_name
left join information_schema.constraint_column_usage ccu
  on tc.constraint_type = 'FOREIGN KEY'
 and ccu.constraint_schema = tc.constraint_schema and ccu.constraint_name = tc.constraint_name
where tc.table_schema = 'blog_fedupbuddies'
order by tc.table_name, tc.constraint_type;

-- 3) RLS e permissões do schema
select c.relname as table_name, c.relrowsecurity as rls_enabled,
       has_schema_privilege(current_user, 'blog_fedupbuddies', 'USAGE') as schema_usage
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'blog_fedupbuddies' and c.relkind = 'r'
order by c.relname;
