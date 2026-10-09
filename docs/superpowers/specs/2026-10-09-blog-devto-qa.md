# Blog DEV.to — implementation verification

Worktree: /private/tmp/vira-voto-blog-devto. Branch feat/blog-devto. Base fresh main d668f14b. Integrated issues 22/23/53/54; issue 21 untouched. No commits/pushes/PR edits or migrations. Independent Maestri QA final GO received: no open P1/P2. Full read-only review and evidence: /private/tmp/blog-devto-qa/review.md.

## Architecture and security evidence
- Read installed Next16.3.7 guides: fetch, dynamic routes, generateMetadata, error handling and not-found. Inspected patch-fetch.js line696: only HTTP200 persisted; no negative404 or429/5xx caching. Explicit next.revalidate300; React cache render deduplication; fixed API routes, validated integer id/page, redirect:error, 8s deadline.
- Published real detail id2299146: organization.username techcontrabolsonaro, slug revisao-rapida-de-condicionais-em-js-5emd, author Pachi 🥑 (she/her)/pachicodes, published2025-02-26, cover null. All real tags braziliandevs/javascript/beginners appear without filtering. No API key, writes or DB.
- sanitize-html2.18.0/server-only: parser allowlist removes active HTML/events/styles/srcset/protocol-relative/mixed or credentialed media and suffix-spoof hosts. Keeps Unicode, escaped code operators/newlines, long article, table/list/prose structure and prefixed heading fragment navigation; invalid heading IDs stripped.
- DEV.to source canonical validated exact hostname, organization and slug; external arbitrary canonical ignored. Browser metadata DEV.to canonical and local OG URL confirmed. Copy link from shared modal produces current-origin /blog/2299146/revisao-rapida-de-condicionais-em-js-5emd.
- Parent loading boundary initially caused streamed HTTP200 for missing detail. Loading isolated in (listing) route group and verified notFound invoked by detail metadata. Real curl/browser and independent production server checks: missing/invalid id=>404 (foreign/null payloads independently verified with mocks); wrongslug=>307 with correct local Location; real listing/detail=>200. Upstream failures remain separate retry UI, metadata noindex.
- Global CSP/Next image hosts unchanged. Blog images constrained in sanitizer/cover validation; no embeds auto-load.

## Design comparison and adaptations
MCP directly inspected/exported all four approved frames; IDs in design spec. Measured browser 1440/900/390; no document overflow. Shared nav verified on Home/conteudos/manifesto/enviar/ferramentas/Blog at1440/1100/1025/900/390; Home header brand/nav separation32px at1025. Menu has existing Manifesto/Ferramentas/Conteúdos +Blog +Enviar conteúdo CTA. No fabricated Comunidade destination.

Explicit approved adaptations: yellow organization source bar replaces mock search/category controls to keep ALL posts; null cover becomes text-only card and omits detail image, no mock post or cover; real article titles/body/tags/dates/authors replace example text; back link targets Blog; Blog access added beyond frame. Heights follow real content length. No Home preview added.

QA findings corrected: decorative desktop hero385x294 atx970/y135, nested337x245 stroke2 and289x197 stroke1; card grid400px columns/gap40/shadow7/topstrip12 at1440; detail CTA separate text VAI COMPARTILHAR UMA IDEIA?/Convide mais pessoas para construir junto,24px/minheight112, hidden390 mobile; mobile has share callout only; aside IDEIAS BOAS blue, FAÇA PARTE23px and DESSA CONVERSA21px.

Last mobile refinements: listing intro and compact44px CTA use the mobile frame copy; secondary cards use Arial14/700, gap12, lateral9px strip, white cards with yellow/coral lateral strips, no desktop shadow/top strip or description, retaining real tags/author/date/reading time and local detail link. Real covers retained, height grows with real metadata rather than forcing mock64px. Coral103.2x28 featured label moves into copy after real cover (or start of copy for null cover). First prose paragraph desktop Georgia27px/36px/700, mobile17px/23px retained. Mobile intro has the explicit two-line composition. Final hero closeup uses MCP positions: IDEIA1037.81/205.55/134.8x129.85, JUNTO1199.57/227.6/80.88x93.1, label189.6x28; display text has explicit1.2 line-height. Browser coordinates differ only by subpixel rounding.

Own screenshots outside repo: /private/tmp/blog-{listing,detail}-{1440,900,390}.png; initial loading captures replaced by completed-heading captures. Zoom200 screenshot /private/tmp/blog-detail-zoom200.png; independent QA owns actual browser zoom validation and fixture matrix.

## Interaction and verification
Menu Escape returns toggle focus. Shared share modal Escape returns triggering share focus after hidden animation in1440/900/390. Clipboard copies local URL; no image fetch through share. No pageerror in real Blog captures.

Malformed organization object (missing/nonstring username) now yields origin unavailable in both detail/feed, rather than a fake404/empty page; explicit null or foreign username still rejected404. Two regression fixtures observed RED before validation-order correction and GREEN afterward, independently reproduced.

TDD: missing modules RED before server/URLs/sanitizer; missing routes/nav RED before implementation; detail CTA assertion RED before correction; invalid heading ID assertion RED before hardening. Final verification:30 files232tests PASS (19:53:19), ESLint PASS, Next build PASS; independent QA also ran232tests PASS and17 additional isolated checks PASS. First simultaneous build/test run observed one intermittent failure of the existing Enviar focus assertion at app/enviar/page.test.tsx:101; isolated9tests and full rerun passed without changing submission code or tests. Independent final GO confirms all four frames, final mobile recaptures, API/SEO/share, sanitizer, keyboard, 20 route regression cases and real200% zoom.

## Authorized baseline correction
app/lib/tools-server.ts original line4 duplicated resolveServerSupabaseUrl import from line2. Main d668f14b failed TS2300 and Vitest parse before Blog. Tech lead explicitly authorized removing only second identical import. Diff removes exactly that line; no tools refactor, filters or behavior changes. This correction is separate from Blog feature.

## Independent QA GO and limits
Final QA report: /private/tmp/blog-devto-qa/review.md. 232/232 application tests +17/17 independent checks, lint/tsc/default Turbopack build/diff PASS after the final server change. Six real API screenshots,18 isolated-state browser snapshots and two real zoom200% cases passed without page overflow. No P1/P2 remains open.

Multi-page feed, upstream errors and mixed images are isolated fixtures because the real API currently has one coverless post. Cache300 is asserted, not timed over five minutes; retry is tested through router.refresh, not by provoking an upstream incident. Backend form submission/Storage were not executed; this is scoped Blog QA, not a global production audit. Temporary QA production server3101 stopped; dev preview3100 retained. Lead owns commit/PR/merge after this GO.
