# Issue #3: tool submissions

Source: https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/3

## Agreed scope

- Tools are interactive resources, distinct from shareable content; see the root glossary.
- A separate tool submission table uses pending/approved/rejected status. Only approved records are public.
- Approval remains manual through backend infrastructure, with no moderation UI.
- A dedicated `/ferramentas/enviar` form follows the existing anonymous submission flow, including Turnstile and a confirmation message.
- Initial required fields are name, description, tool URL, category, and creator/source credit. Category is free text that reviewers can normalize. These fields are provisional and may be discussed in the PR.
- Each published tool has a dedicated hub page. Reviewers control embedding; embedding requires HTTPS and an approved domain. An external link remains available.
- Dedicated pages use `/ferramentas/[slug]`. Generate each slug once from the title, add a short unique suffix when necessary, and preserve it after renaming. Enforce uniqueness and reserve application route names.
- Reviewers manage the embedding domain allowlist in the backend database, with exact hostname matching.
- Load embedded tools only after a visitor clicks to open them. Keep the external link visible, including when embedding fails.
- Lists show approved entries in newest-submission order, ten per page and four on the homepage. Search and category filters are deferred.
- Allow duplicate submissions; curators decide which entries to publish rather than introducing automatic URL equivalence rules.
- Extend production automation to deploy the new submission function after migrations and before the Vercel deployment.
- Native tool development, accounts, notifications, and submission tracking are outside this feature.
- Replace hardcoded example tools with approved database records, including a proper empty state.

## Upstream baseline

Fetched `6ca441e` during the interview, then incorporated `8f167ba` during implementation. Before final validation, fetched and rebased onto `bed3ff2`. The current upstream includes production Supabase migration deployment, a Vercel deploy hook, an IPv4 pooler fix, architecture documentation, sharing feedback, inline content-submission errors, responsive navigation, section-heading semantics, and local Docker seed scenarios. The implementation retains those updates and adds tool-only fixtures to the local seed; the production migration does not seed example tools.

## Delivery constraints

Keep each PR within 500 added plus deleted lines and usable independently. Run relevant tests, lint, build, and whitespace checks; obtain Maestri QA GO before opening a PR. The interview must reach shared understanding before feature implementation.

## Confirmed implementation plan

The user confirmed shared understanding and authorized implementation on 2026-10-07.

1. Add the tool submission schema, stable unique slugs, approved embedding hosts, and deny-by-default public database access. Public reads must filter for approved records and omit reviewer metadata.
2. Add a public `submit-tool` function with Turnstile protection and server-side field/HTTPS URL validation. It creates pending submissions; submitters cannot set publication status, slug, or embedding approval. Add the anonymous submission form at `/ferramentas/enviar`.
3. Build approved-tool listing and detail reads, the paginated `/ferramentas` listing, and dedicated slug pages with visitor-initiated iframe loading and a persistent external link. Recheck domain approval when rendering an embed; missing or revoked approval uses external access.
4. Replace homepage example tools with up to four approved records. Include empty, loading, failure, unpublished/not-found, and submission confirmation states. Keep user-facing copy in Portuguese and reuse existing visual conventions. Local Docker fixtures exercise approved, pending, rejected, and approved-embed cases; no example records enter production through migrations.
5. Extend production deployment for the new function after migrations and before Vercel. Document required deployment credentials and manual backend curation, including domain approval, review status, and reviewer metadata.

Split implementation into four coherent stacked PRs by measured changed-line count: schema and domain documentation, protected submission/read APIs plus deployment prerequisites, submission/detail pages, then catalog and homepage integration. Each intermediate PR must leave the project usable, and migration/deployment prerequisites ship before dependent public UI.

## Validation

Cover pending submissions, rejected invalid fields/URLs, failed spam verification, and submission confirmation/errors. Verify that pending/rejected tools never appear in public listings or slug pages, slugs remain stable across title changes, and collisions cannot overwrite an existing tool. Verify that unapproved/revoked embedding hosts cannot mount an iframe, approved embeds load only on visitor action, and external links remain available. Check pagination, homepage limits, and empty/error states through existing test seams.

Run the relevant tests, lint, build, and `git diff --check`, then obtain Maestri QA GO and check each PR's size before opening it. Initial fields remain provisional and should be identified as a discussion point in the PR description; no GitHub issue comments have been posted.

## Validation record (2026-10-08)

- `npx bun@1.3.10 run test` — 14 files and 77 tests passed.
- `npx bun@1.3.10 run lint` — passed.
- `npx bun@1.3.10 run build` — passed.
- Docker/Postgres 16 SQL harness `supabase/tests/tool-submissions.sh` — passed in a throwaway container. The Windows checkout uses CRLF, so the script was streamed with CRLF removed without changing the tracked file.
- `git diff --check` — passed after this record was added.
- `scripts/check-pr-size.py` results at each committed stage head: schema 262 lines, backend 413, pages 303, catalog/homepage 298 (500-line maximum). This validation record is an uncommitted addition to the final stage.
- Maestri's first read-only review returned NO-GO only for missing recorded validation and size evidence. The follow-up review returned GO with no findings.
