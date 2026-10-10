alter table public.tool_submissions
  add column if not exists is_internal boolean not null default false;
