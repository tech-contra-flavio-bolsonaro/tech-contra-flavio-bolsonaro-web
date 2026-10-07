create table public.tool_submissions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug <> 'enviar'),
  title text not null check (char_length(title) between 3 and 160),
  description text not null check (char_length(description) between 10 and 2000),
  category text not null check (char_length(category) between 2 and 60),
  credit text not null check (char_length(credit) between 2 and 160),
  url text not null check (url ~ '^https://[^\s]+$' and char_length(url) <= 2048),
  embed_url text check (embed_url ~ '^https://[^\s]+$' and char_length(embed_url) <= 2048),
  status public.submission_status not null default 'pending',
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now()
);

create table public.tool_embed_domains (
  hostname text primary key check (hostname ~ '^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$')
);

create index tool_submissions_public_idx on public.tool_submissions (created_at desc) where status = 'approved';

-- The slug comes from the title once, at insert. "enviar" is reserved for the submission route.
create function public.assign_tool_slug() returns trigger
language plpgsql as $$
declare
  base text;
  candidate text;
begin
  base := left(trim(both '-' from regexp_replace(
    translate(lower(new.title), 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn'),
    '[^a-z0-9]+', '-', 'g')), 60);
  base := coalesce(nullif(trim(both '-' from base), ''), 'ferramenta');
  candidate := base;
  -- Serialise concurrent inserts of one base so the check below sees the other transaction's row.
  perform pg_advisory_xact_lock(hashtext('tool_slug:' || base));
  while candidate = 'enviar' or exists (select 1 from public.tool_submissions where slug = candidate) loop
    candidate := base || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 6);
  end loop;
  new.slug := candidate;
  return new;
end $$;

create function public.keep_tool_slug() returns trigger
language plpgsql as $$
begin
  if new.slug is distinct from old.slug then
    raise exception 'tool slug is immutable' using errcode = 'check_violation';
  end if;
  return new;
end $$;

create trigger tool_submissions_assign_slug before insert on public.tool_submissions
  for each row execute function public.assign_tool_slug();
create trigger tool_submissions_keep_slug before update on public.tool_submissions
  for each row execute function public.keep_tool_slug();

alter table public.tool_submissions enable row level security;
alter table public.tool_embed_domains enable row level security;
revoke all on table public.tool_submissions, public.tool_embed_domains from public, anon, authenticated;
grant select, insert, update, delete on table public.tool_submissions, public.tool_embed_domains to service_role;
revoke all on function public.assign_tool_slug(), public.keep_tool_slug() from public, anon, authenticated;
