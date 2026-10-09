-- Harden community video links: only https public-looking URLs (or null).
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
