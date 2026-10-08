-- Run after supabase/seed.sql in the local Docker test stack.
do $$
begin
  assert (select count(*) from public.tool_submissions where id between '20000000-0000-4000-8000-000000000001'::uuid and '20000000-0000-4000-8000-000000000004'::uuid and status = 'approved') = 2, 'two approved tools seeded';
  assert (select count(*) from public.tool_submissions where id between '20000000-0000-4000-8000-000000000001'::uuid and '20000000-0000-4000-8000-000000000004'::uuid and status = 'pending') = 1, 'one pending tool seeded';
  assert (select count(*) from public.tool_submissions where id between '20000000-0000-4000-8000-000000000001'::uuid and '20000000-0000-4000-8000-000000000004'::uuid and status = 'rejected') = 1, 'one rejected tool seeded';
  assert exists (
    select 1 from public.tool_submissions
    where slug = 'painel-de-dados-comunitarios' and embed_url = 'https://embed.example.test/painel'
  ), 'approved embed fixture seeded with a human-readable slug';
  assert exists (select 1 from public.tool_embed_domains where hostname = 'embed.example.test'), 'approved embed host seeded';
  assert (select count(*) from public.tool_submissions where id between '20000000-0000-4000-8000-000000000001'::uuid and '20000000-0000-4000-8000-000000000004'::uuid and status <> 'approved') = 2, 'non-approved tools remain private from public reads';
end $$;
