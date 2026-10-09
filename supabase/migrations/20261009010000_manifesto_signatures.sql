create table public.manifesto_signatures (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 160 and name !~ '[[:cntrl:]]'),
  email text not null unique check (email = lower(btrim(email)) and char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text not null check (phone ~ '^\+55(1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])([2-5][0-9]{7}|9[0-9]{8})$'),
  work_area text not null check (char_length(btrim(work_area)) between 2 and 120 and work_area !~ '[[:cntrl:]]'),
  consent boolean not null check (consent is true),
  manifesto_version text not null check (manifesto_version = '2026-10-09-v1'),
  consent_version text not null check (consent_version = '2026-10-09-v1'),
  signed_at timestamptz not null default now()
);
-- Only a digest of a verified, short-lived challenge; no contact data or IP.
create table public.manifesto_challenges (
  token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at timestamptz not null default now() + interval '10 minutes'
);
create index manifesto_challenges_expiry_idx on public.manifesto_challenges(expires_at);
alter table public.manifesto_signatures enable row level security;
alter table public.manifesto_challenges enable row level security;
revoke all on public.manifesto_signatures, public.manifesto_challenges from public, anon, authenticated;
grant select, insert on public.manifesto_signatures to service_role;
grant select, insert, delete on public.manifesto_challenges to service_role;
-- The verified challenge and signature are claimed atomically. Duplicate emails never update data.
create function public.record_manifesto_signature(
  p_name text, p_email text, p_phone text, p_work_area text,
  p_consent boolean, p_manifesto_version text, p_consent_version text, p_token_hash text
) returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  delete from public.manifesto_challenges where expires_at < now();
  insert into public.manifesto_challenges(token_hash) values (p_token_hash) on conflict do nothing;
  if not found then return false; end if;
  insert into public.manifesto_signatures(name,email,phone,work_area,consent,manifesto_version,consent_version)
    values(p_name,p_email,p_phone,p_work_area,p_consent,p_manifesto_version,p_consent_version)
    on conflict(email) do nothing;
  return true;
end $$;
revoke all on function public.record_manifesto_signature(text,text,text,text,boolean,text,text,text) from public, anon, authenticated;
grant execute on function public.record_manifesto_signature(text,text,text,text,boolean,text,text,text) to service_role;
