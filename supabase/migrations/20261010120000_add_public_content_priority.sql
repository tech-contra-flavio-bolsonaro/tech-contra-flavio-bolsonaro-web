alter table public.submissions
  add column if not exists priority integer not null default 0;

alter table public.tool_submissions
  add column if not exists priority integer not null default 0;

create index if not exists submissions_public_priority_idx
  on public.submissions (priority desc, created_at desc, id desc)
  where status = 'approved';

create index if not exists tool_submissions_public_priority_idx
  on public.tool_submissions (priority desc, created_at desc, id desc)
  where status = 'approved';
