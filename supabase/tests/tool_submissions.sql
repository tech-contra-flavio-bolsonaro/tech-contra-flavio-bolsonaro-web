-- Run by tool-submissions.sh after both migrations. Each block raises on a broken invariant.
\set ON_ERROR_STOP on

create function pg_temp.fails(statement text, expected text) returns void language plpgsql as $$
begin
  execute statement;
  raise exception 'expected failure (%) but succeeded: %', expected, statement;
exception when others then
  if sqlerrm = format('expected failure (%s) but succeeded: %s', expected, statement) then raise; end if;
  if sqlerrm not like '%' || expected || '%' then raise exception 'wrong error for %: %', statement, sqlerrm; end if;
end $$;

do $$
declare
  a text; b text; c text; r text;
begin
  insert into tool_submissions (title, description, category, credit, url)
    values ('Calculadora de Impostos', 'Simula impostos pagos.', 'Economia', 'Maria', 'https://example.com') returning slug into a;
  assert a = 'calculadora-de-impostos', 'slug from title: ' || a;

  insert into tool_submissions (title, description, category, credit, url)
    values ('Calculadora de Impostos', 'Outra ferramenta igual.', 'Economia', 'Joao', 'https://example.com') returning slug into b;
  assert b <> a and b like 'calculadora-de-impostos-%', 'collision gets a suffix: ' || b;

  insert into tool_submissions (title, description, category, credit, url)
    values ('Ação Rápida!', 'Acentos e pontuação.', 'Geral', 'Ana', 'https://example.com') returning slug into c;
  assert c = 'acao-rapida', 'accents and punctuation: ' || c;

  insert into tool_submissions (title, description, category, credit, url)
    values ('Enviar', 'Nome reservado da rota.', 'Geral', 'Ana', 'https://example.com') returning slug into r;
  assert r <> 'enviar' and r like 'enviar-%', 'reserved slug avoided: ' || r;

  insert into tool_submissions (title, description, category, credit, url, slug)
    values ('Slug forçado', 'Cliente não escolhe o slug.', 'Geral', 'Ana', 'https://example.com', 'enviar') returning slug into r;
  assert r = 'slug-forcado', 'client slug ignored: ' || r;

  assert (select status from tool_submissions where slug = a) = 'pending', 'default status is pending';

  update tool_submissions set title = 'Novo nome', status = 'approved' where slug = a;
  assert (select count(*) from tool_submissions where slug = a and title = 'Novo nome') = 1, 'slug survives rename';
end $$;

select pg_temp.fails($$update tool_submissions set slug = 'outro' where slug = 'acao-rapida'$$, 'immutable');
select pg_temp.fails($$insert into tool_submissions (title, description, category, credit, url) values ('Ok título', 'Descrição longa o bastante.', 'Geral', 'Ana', 'http://example.com')$$, 'tool_submissions_url_check');
select pg_temp.fails($$insert into tool_submissions (title, description, category, credit, url, embed_url) values ('Ok título', 'Descrição longa o bastante.', 'Geral', 'Ana', 'https://example.com', 'http://example.com')$$, 'tool_submissions_embed_url_check');
select pg_temp.fails($$insert into tool_submissions (title, description, category, credit, url) values ('ab', 'Descrição longa o bastante.', 'Geral', 'Ana', 'https://example.com')$$, 'tool_submissions_title_check');
select pg_temp.fails($$insert into tool_embed_domains values ('Example.com')$$, 'tool_embed_domains_hostname_check');
select pg_temp.fails($$insert into tool_embed_domains values ('example.com/path')$$, 'tool_embed_domains_hostname_check');

do $$
begin
  assert (select count(*) from tool_embed_domains) = 0, 'no allowlist rows by default';
  assert (select relrowsecurity from pg_class where oid = 'public.tool_submissions'::regclass), 'RLS on tool_submissions';
  assert (select relrowsecurity from pg_class where oid = 'public.tool_embed_domains'::regclass), 'RLS on tool_embed_domains';
end $$;

-- Roles: anon/authenticated denied everywhere, service_role allowed.
set role anon;
select pg_temp.fails('select * from tool_submissions', 'permission denied');
select pg_temp.fails('select * from tool_embed_domains', 'permission denied');
select pg_temp.fails($$insert into tool_submissions (title, description, category, credit, url) values ('Anon tool', 'Descrição longa o bastante.', 'Geral', 'Ana', 'https://example.com')$$, 'permission denied');
reset role;
set role authenticated;
select pg_temp.fails('select * from tool_submissions', 'permission denied');
select pg_temp.fails('update tool_embed_domains set hostname = hostname', 'permission denied');
reset role;
set role service_role;
select count(*) from tool_submissions;
insert into tool_embed_domains values ('embed.example.com');
delete from tool_embed_domains;
reset role;
