-- Harden community video links: only https public-looking URLs (or null).
-- Clear legacy non-conforming values first so ADD CONSTRAINT cannot fail on deploy.
update public.submissions
set video_url = null
where video_url is not null
  and not (
    char_length(video_url) <= 2048
    and video_url ~ '^https://[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z0-9.-]+'
  );

alter table public.submissions
  drop constraint if exists submissions_video_url_https;

alter table public.submissions
  add constraint submissions_video_url_https
  check (
    video_url is null
    or (
      char_length(video_url) <= 2048
      and video_url ~ '^https://[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z0-9.-]+'
    )
  );
