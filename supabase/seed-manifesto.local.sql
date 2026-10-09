-- LOCAL ONLY. Run explicitly in the local Docker DB; not included in production release or global seed.
-- Deliberately fictitious contacts at reserved .invalid domains.
insert into public.manifesto_signatures(name,email,phone,work_area,consent,manifesto_version,consent_version)
values ('Pessoa Fictícia — QA local', 'manifesto-seed@example.invalid', '+5511999990000', 'Teste local fictício', true, '2026-10-09-v1', '2026-10-09-v1')
on conflict(email) do nothing;
