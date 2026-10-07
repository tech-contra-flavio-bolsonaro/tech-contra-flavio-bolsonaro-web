do $$
begin
  create type public.submission_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  description text not null check (char_length(description) between 10 and 2000),
  credit text not null check (char_length(credit) between 2 and 160),
  media_path text,
  video_url text,
  status public.submission_status not null default 'pending',
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  constraint submissions_one_media_source check (((media_path is not null)::integer + (video_url is not null)::integer) = 1)
);

alter table public.submissions enable row level security;
alter table public.submissions alter column status set default 'pending';
alter table public.submissions alter column status set not null;
revoke all on table public.submissions from anon, authenticated;

create index if not exists submissions_pending_created_at_idx on public.submissions (status, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-submissions',
  'community-submissions',
  false,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
