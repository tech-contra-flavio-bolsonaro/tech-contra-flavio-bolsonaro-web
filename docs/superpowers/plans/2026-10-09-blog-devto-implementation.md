# Blog DEV.to Implementation Plan

> **For agentic workers:** execute inline using superpowers:executing-plans task-by-task; independent QA through existing Maestri QA. User explicitly forbids implementer commits/pushes.

**Goal:** deliver all published organization posts with safe local reading and sharing, preserving DEV.to attribution and SEO canonical.

**Architecture:** server fetch and parsing in cohesive blog lib; Next server routes select result states; sanitized HTML never enters client fetch paths. Reuse SiteNav, ShareButton, tokens and global Toaster; Blog CSS scoped.

**Tech Stack:** Next 16.3.7, React 19, Bun, TypeScript, sanitize-html, Vitest/Testing Library, Playwright.

---

### Task 1: contracts / URL security / server API
Files create app/lib/blog/types.ts, urls.ts, server.ts and server.test.ts, urls.test.ts.
- [x] Write failing tests using vi.stubGlobal('fetch', vi.fn()) with organization fixtures, all tags, 404/foreign/unpublished and wrong id, 429/5xx/abort/malformed payload; assert fixed URL, Accept/User-Agent, next.revalidate=300, redirect:error, signal.
- [x] Run bun run test -- app/lib/blog; expected missing-module failures before implementation.
- [x] Implement BlogArticle {id,slug,title,description,publishedAt,readingMinutes,tags,author,coverImage,sourceUrl}, BlogResult discriminant ok/not-found/unavailable. parsePage coerces only positive integer <=9999; blogPermalink encodes slug; safeBlogLink rejects credentials/non-HTTPS, devtoSource validates original then constructs trusted source. getBlogPage accepts numeric page, fetches 6 per page with a next-page probe only when full; getBlogArticle validates id before fixed origin fetch and returns safe typed result.
- [x] Run targeted tests; expect pass.

```ts
expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://dev.to/api/organizations/techcontrabolsonaro/articles?'), expect.objectContaining({next:{revalidate:300},redirect:'error'}));
expect(blogPermalink({id:2299146,slug:'revisao-rapida-de-condicionais-em-js-5emd'})).toBe('/blog/2299146/revisao-rapida-de-condicionais-em-js-5emd');
```

### Task 2: sanitizer
Files create app/lib/blog/sanitize.ts and sanitize.test.ts; modify package.json/bun.lock with sanitize-html and types.
- [x] Verify maintained upstream package docs, install Bun dependency and types.
- [x] Write security tests preserving accented paragraphs and escaped pre/code, tables, long article; removing scripts/handlers/iframe/svg/math/styles/javascript/data/http/private images.
- [x] Run bun run test -- app/lib/blog/sanitize.test.ts; expect missing-module failure.
- [x] Implement sanitizeBlogHtml with explicit tags/attrs and parser transforms for safe HTTPS anchors/allowlisted image hosts, forced rel/loading/no-referrer; prevent DOM clobbering; retain safe heading fragments with blog prefix.
- [x] Run tests and inspect real article output text/code structure.

```ts
expect(sanitizeBlogHtml('<p>ação</p><script>alert(1)</script><pre><code>if (a &lt; b) {\n  ação();\n}</code></pre>')).toContain('ação');
expect(sanitizeBlogHtml('<img src="http://evil.test/x" onerror="alert(1)"><iframe src="https://youtube.com"></iframe>')).not.toMatch(/onerror|iframe|http:\/\//);
```

### Task 3: rendering / canonical routes / states
Files create app/blog/layout.tsx, (listing)/page.tsx, [id]/[slug]/page.tsx, (listing)/loading.tsx, error.tsx, not-found.tsx; app/components/blog-card.tsx, blog-art.tsx, blog-retry.tsx; route tests.
- [x] Write failing rendering tests with mocked server results for populated/empty/unavailable, valid/foreign/missing/wrong slug, author/date/tags and sanitized body. Metadata asserts source canonical while ShareButton receives local path; actual null cover has no fake image.
- [x] Run bun run test -- app/blog; expected module failures.
- [x] Implement awaited params/searchParams, redirect outside catch, metadata safely constructed; status UI for source errors with retry. List all tags; six-item pagination, no search or tag/category filter controls. No DB.
- [x] Implement decorative hero separately from optional covers; article prose via server sanitizer; share passes title, local URL, author credit without imageUrl so clipboard copies link.
- [x] Run targeted route tests; expect pass.

```tsx
<ShareButton title={article.title} url={blogPermalink(article)} credit={article.author.name} />
<a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">Ler publicação original no DEV.to ↗</a>
```

### Task 4: design / shared navigation
Files create app/blog/blog.css; modify app/components/site-nav.tsx, site-footer.tsx and their tests only.
- [x] Write nav/footer tests for Blog access and active detail route, compact Blog footer, existing routes preserved; run expected red.
- [x] Add /blog shared links; permit Blog/detail footer while keeping other visibility unchanged. Scope Blog header at 72px, use mobile menu at <=1024 including 900px. Frame colors/layout/fonts/borders/gutters from spec; no global host/CSP changes.
- [x] Build responsive featured cards/three-column secondary cards and detail 880/350 panel split, stacked <=900; long title/code/table overflow locally contained; keyboard focus visible, reduced motion respected.
- [x] Validate targeted nav/footer tests.

### Task 5: verification and independent QA
- [x] bun run test — zero failing tests. bun run lint — no introduced diagnostics. bunx tsc --noEmit — exit 0. bun run build — exit 0, real API not mandatory during build.
- [x] Start Bun dev server bounded port; inspect real article and canonical metadata, 404 and slug redirects with curl; use isolated fetch fixtures only for synthetic states.
- [x] Read MCP exports all four frames and compare browser screenshots at 1440/900/390 and 200% zoom: composition, tokens, typography/weights/line/tracking, icons/background/borders/radius/shadow, gutters/gaps, content states.
- [x] Send QA via mandatory Maestri CLI list then ask: worktree, server URL, exact fixtures/test commands and acceptance checklist. QA owns independent API/keyboard/share/SEO/regressions; implement fixes, rerun affected checks until GO.
- [x] Update checked steps and evidence in docs/superpowers/specs/2026-10-09-blog-devto-qa.md; report diff/status/results to lead. No commit/push/PR changes, no issue 21 closure, no remote migrations.

HTTP semantics refinement: listing owns a route-group loading boundary; detail has no pre-validation loading boundary. generateMetadata also calls notFound for verified missing/foreign results. This preserves real HTTP404 and slug307; origin failure stays retryable. No global metadata/CSP changes.
