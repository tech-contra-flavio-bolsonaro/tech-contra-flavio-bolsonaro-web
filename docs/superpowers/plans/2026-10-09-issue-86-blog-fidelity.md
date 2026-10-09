# Issue 86 — Blog detail identity and reading

Goal: adapt the detail to the implemented Home/Manifesto identity while preserving published content and behavior. Base: fresh tech-contra-flavio-web/main 12ca9465. No commit/push by implementer.

## Authority and causal trace

User explicitly overrides literal Penpot fidelity: “ta igual ao penpot mas o penpot esta ruim adeque ao resto do site”. Home buttons/icons, Inter reading, Barlow Condensed headings, IBM Plex Mono code and real palette tokens are approved. Desktop Penpot uses Georgia15/30 body (27/36 bold lead); mobile Arial12/19 with Georgia17/23 lead. These are intentionally replaced.

Browser baseline /private/tmp/issue-86-evidence/before-1440.png confirms Georgia15/30, Arial nav12px, yellow#ffef35, ink#171717, no CTA shadow, 2px radius and tiny arrow. Only IBM fonts load for code: next/font variables exist but blog CSS prevents Inter/Barlow usage. Blog prose p:first-child also promotes every paragraph that is first in nested containers (e.g. list items), not just article introduction. Blog share styles strip the shared Button geometry. Unicode arrows are hardcoded in detail/contribution; footer logo uses Unicode flag.

## Implementation and verification sequence

- [x] RED: browser audit real detail paragraph/header/code families, body20/35 desktop and18/31.5 mobile, Home palette and CTA geometry/SVG24px; unit rendering assertions for real HomeArrow and shared share variant. Run before implementation, record observed failure.
- [x] GREEN: add detail CSS Module wrapper so styles cannot leak across client navigation; use existing Home classes and shared share variant, SVG HomeArrow and original pixel logo. Override only detail selectors, never global Home/shared primitives. Preserve listing appearance and article/API/metadata/sanitizer.
- [x] Reading: responsive one-column <=900, editorial aside desktop; readable column with padding and flexible width; Barlow headings h1–h6; remove arbitrary first-paragraph promotion; full list/blockquote/table/pre/image/details content remains visible. Measure actual text widths rather than require 65ch.
- [x] Verify real article and injected browser-only semantic stress fixture, 1440/900/390 plus200% zoom; capture full pages and paragraph/aside/control closeups, check actual font loads/CDP platform fonts, computed styles, hover/focus, menu/modal Escape/focus restoration/copy. Inspect route transitions Home/Manifesto/tools/content/send/listing/detail/missing/wrongslug.
- [x] Run all Vitest tests, lint, tsc, default Next build and git diff --check. Recheck production CSS ordering on built local app.
- [x] Request independent QA via Maestri (QA informed of override). Resolve findings until GO; report to Tech lead with files/evidence. No PR/commit/push/merge.

Files: app/blog/[id]/[slug]/page.tsx + page.test.tsx, new detail.module.css; conditional detail branch in app/components/blog-status.tsx; detail-only original logo/footer class in app/components/site-footer.tsx + test. Browser audit scripts/check-blog-detail.mjs. Shared components/behavior remain intact.

## Implementer evidence

RED observed: rendering test failed because accessible link still had Unicode arrow; browser audit failed on Georgia family1440 before implementation. GREEN: 238/238 Vitest tests (31 files), ESLint, TypeScript, default Turbopack build and diff check. Browser audit also passes against production3103 for1440/900/390.

Before screenshot and after/full-page/prose crops: /private/tmp/issue-86-evidence/. fonts.json includes computed values, loaded FontFace records and CDP platform fonts proving actual custom-font glyphs: Inter-Regular body, BarlowCondensed-ExtraBold hero, IBMPlexMono-Regular code. Barlow fontcheck must specify loaded weight700/800 (400 is intentionally not bundled).

Additional browser-only stress fixture (does not change real article/API): h1–h6, ordinary and nested-list paragraphs, lists, blockquote, code/pre, wide table, unbroken word, open details,30long paragraphs and end marker. All3widths pass: no document overflow, pre/table scroll internally, final paragraph accessible, list paragraph weight400. QA independently tests media fixtures.

Interaction: modal Escape/focus restoration and mobile menu Escape pass at3widths; final hover lilac and focus3px/offset5px pass. Browser audit awaits shared Button transitions rather than sampling intermediate color. Clipboard remains shared unmodified behavior. Direct production200 for Home/Manifesto/tools/content/send/listing; client transitions out of detail retain pre-navigation shell font/color/height; wrongslug307, missing404. No DB/env files used.

Production server3103 and development3102 retained for QA. No commits/pushes/PR actions. Independent final GO received; see /private/tmp/issue86-qa/review.md.

## QA P2 correction

QA reproduced unavailable fallback using legacy Arial/Arial Black and shadowless retry. Regression test failed before fix (retry had blog-button); passed after optional detail/home variant preserving default listing retry, useTransition/pending/router.refresh. Detail retry now uses shared Button lg + HomeArrow + Home classes. Local status headings use Barlow40/1.1, paragraphs Inter18/1.75, black3px borders/radius8. Local error/not-found boundaries now reuse DetailShell for this identity; global Blog boundaries/listing untouched. Error receives retry per installed Next16.3.7 guide; destination/copy/404 behavior unchanged. Additional tests cover route refresh, runtime retry,404link and default listing.

Final rebuild238tests31files,lint,TypeScript and diffcheck passed. Production3103 restarted with latest build;1440/900/390 browser identity audit passed again. QA retest requested; final GO received after residual correction.

## QA residual: short-state canvas

Real404 at390x900 exposed old parent Blog canvas below the new shell. RED reproduced independently:1440 parent710px vs shell507.5px, parent#1500e8 vs child#1900d0. Added CSS Module selector `.blog-page:has(local detail class)` to make that parent a column flexbox and use Home canvas; shell flex1 fills remaining space. Selector cannot match listing or other routes once detail shell unmounts. Browser audit now locks down short404 canvas/height at3widths alongside real article.

Residual GREEN: real404 parent/shell height equal710px at1440/900 and606.40625px at390x900, both#1900d0. Article and short404 audit all3widths PASS against latest production. Full238tests/lint/tsc/defaultbuild/diffcheck PASS after final CSS edit. Client route checks completed again without identity leak; test harness waits completed Blog heading and disappearance of streaming loading fallback before comparing shell.

## Final independent GO and handoff

QA final GO received: no open P1/P2. /private/tmp/issue86-qa/review.md. Independent238tests/31files +7QA checks,lint,tsc,defaultTurbopackbuild,diff passed on final tree. Real article + semantic/media stress1440/900/390; CDP actual fonts;15state checks;18/18SPA comparisons without style leakage (listing parent restores#1500e8); native200% listing/detail/missing/stress/table/code/endmarker/sharecopy passed. Both QA P2 findings closed. Real404/noindex and origin-failure distinctions preserved.

Limits: upstream errors/runtime/media use isolated fixtures, no production failure induced, no remote DB integration or global security audit. Content/API/authorship/canonical/sanitizer/cache/migrations and shared primitive implementation unchanged. No commits/pushes/PR/merge. Lead owns integration after this GO. Local previews3102/3103 retained.
