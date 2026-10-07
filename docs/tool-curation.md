# Tool curation

Tool submissions are reviewed by hand in the Supabase dashboard (SQL editor or table editor). Only the `service_role` can read or write these tables. The `anon` and `authenticated` roles have no access.

## Review a submission

New submissions arrive with `status = 'pending'`. To publish or reject one:

```sql
update public.tool_submissions
set status = 'approved', reviewed_at = now(), reviewed_by = '<reviewer user uuid>'
where slug = '<slug>';
```

Use `'rejected'` to decline. Only `approved` rows appear on the site. Duplicates are allowed; approve the entries you want to show.

Category is free text. Edit it to normalize names when you approve a tool.

## Slugs

The database assigns `slug` from the title when the row is inserted. A collision adds a short random suffix. `enviar` is reserved for the submission page and is never used. Renaming a tool does not change its slug, and the database rejects any update to `slug`, so existing links keep working.

## Embedding

By default a tool opens only through its external link. To allow an embedded view:

1. Add the exact hostname to the allowlist, in lower case and without scheme, port, or path:

   ```sql
   insert into public.tool_embed_domains (hostname) values ('tool.example.com');
   ```

2. Set the tool's `embed_url` to an `https://` address on that host:

   ```sql
   update public.tool_submissions set embed_url = 'https://tool.example.com/app' where slug = '<slug>';
   ```

Matching is exact: `example.com` does not allow `www.example.com`. The site checks the allowlist every time it renders an embed. To revoke embedding, delete the hostname row (or clear `embed_url`). The tool then falls back to its external link. The allowlist is empty until a reviewer adds hostnames.

## Deployment prerequisites

- The `submit-tool` function needs `TURNSTILE_SECRET_KEY` and the standard Supabase `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. It does not verify a JWT (`verify_jwt = false`), because Turnstile protects it.
- Apply the `20261007190000_tool_submissions.sql` migration before the function and before any UI that reads these tables.
- The production GitHub environment needs `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` for function deployment, alongside the existing `SUPABASE_DB_URL` and `VERCEL_DEPLOY_HOOK_URL`. Production automation applies migrations, deploys `submit-tool`, then triggers Vercel; a function deployment failure stops the release.
- The release preflight checks these credentials and the presence of `TURNSTILE_SECRET_KEY` before changing the database. Set the Turnstile secret through the Supabase dashboard, or use `supabase secrets set --env-file <local-secret-file> --project-ref <project-ref>` with a private, untracked file. A missing runtime secret produces a server error and a configuration message in function logs, without logging its value.
- Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` for the frontend, and `SUPABASE_SECRET_KEY` for server-side reads. The server key must have service-role privileges and must never be exposed with a `NEXT_PUBLIC_` prefix.
- Review an embedding URL in the actual hub before approval. The iframe allows scripts, forms, and popups but uses an opaque origin; tools requiring third-party cookies or broader permissions should use external access. Nonstandard embedding ports are not allowed. An existing iframe is not forcibly unloaded on revocation, but subsequent page loads and open actions recheck approval.

## Tests

`bunx vitest run supabase/functions` covers the function handler. `bash supabase/tests/tool-submissions.sh` needs Docker. It starts a throwaway Postgres, applies the migrations, and checks slug rules, constraints, access by role, and concurrent inserts.
