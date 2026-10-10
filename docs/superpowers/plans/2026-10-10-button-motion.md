# Button motion implementation plan

Goal: existing 3D actions press toward their hard shadow while their semantic hitbox stays fixed.
Architecture: shared CSS recipe; pointer-inert pseudo surface paints the existing background/border/shadow, and an inner span moves content. Native button/anchor retains dimensions, focus, ref, events and accessibility. No React interaction state. Ghost/link and editorial navigation stay outside the recipe.

- [x] RED: real Chromium check records surface displacement and a constant hitbox through hover/active, eight inset edge/corner points and one native activation.
- [x] Implement shared PressSurface and Button composition, preserving BaseUI render/ref/disabled.
- [x] Migrate explicit 3D Home/SSR actions and style overrides to shared paint variables, including Blog modules, share/forms/filters/pagination.
- [x] GREEN: run Chromium boundary/motion checks; add primitive semantic/ref/disabled/composition tests; run suite, typecheck and lint.
- [ ] QA independently validates visual/functional boundaries, touch/reduced, viewports, zoom and SPA. Handoff branch/base/worktree/evidence only; no commit/push/PR/merge.

## Handoff (uncommitted)

- Issue: https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/136
- Worktree: `/private/tmp/vira-voto-button-motion-f684`
- Branch: `feat/button-press-motion`
- Fresh remote main base: `ba476892571a6382dcd973fcb1e766cc1b4a5906`
- Candidate/base previews: 3212/3213. Hero previews 3210/3211 preserved.
- SSR Blog fixture previews: 3214/3215, isolated copies at `/private/tmp/issue136-ssr-candidate` and `/private/tmp/issue136-ssr-baseline`. Preload fixture `/private/tmp/issue136-blog-fixture.cjs`; no production/API/database changes.

## Coverage and deliberate exclusions

The CSS recipe lives in `components/ui/button-motion.css`, imported through global CSS. `Button` retains Base UI `render`/`nativeButton`, refs, events, native activation and forms. Existing SSR anchors remain links. `PressSurface` wraps presentational content, never an interactive element. Existing consumers were inspected for child controls; media controls stay outside action surfaces.

Covered: Home actions/cards; SSR Blog cards/detail/pagination; Manifesto actions and inline share; navigation CTA; native retries/pagination; hard-shadow tool filters; primitive form submits, shares and modal actions; tools actions and 404 CTA. Resting paint variables retain original cascade specificity including route CSS modules.

Excluded from 3D motion: editorial links/tags/text navigation, ghost/link variants, shadowless Menu, legacy shadowless blog-button, upload label and remove-file control. No broader library replacement or Link refactor.

Native hitboxes have square corners to keep all eight inset points hittable; painted surfaces retain their original 4px radius. No dimensions/padding change on hover/active and no pointer overlay outside the original target. Normal hover/active shifts: 2px/3px; already selected tool filters preserve resting visual 2px and press to 3px/4px. Reduced motion preserves static selection and removes all spatial transitions.

## Verification evidence

- `node_modules/.bin/vitest run --reporter=dot`: 40 files, 294 tests passed. Existing Vite dynamic-import/navigation notices remain; no test failures.
- `node_modules/.bin/tsc --noEmit --incremental false`: passed.
- `node_modules/.bin/eslint app components scripts/check-button-*.mjs`: passed.
- `node scripts/check-button-motion.mjs`: RED before implementation (surface none), GREEN after (real moving surface, unchanged hover/active rect, eight edges/corners x30 frames).
- `node scripts/check-button-states.mjs`: RED reduced0.14s; RED outline invalid border; GREEN zero surface transitions and coral invalid border.
- `node scripts/check-button-interactions.mjs`: 25 real interaction checks passed, including eight boundaries on actions across routes, slow crossing/click, one activation, inert outside paint, disabled, Base UI Enter/Space/Close/Escape/focus restoration, touch and reduced motion. `/private/tmp/button-interaction-evidence.json`.
- `node scripts/check-button-resting.mjs`: 24 route-width samples, 105 controls matched baseline paint/fonts/geometry/icons/opacity. `/private/tmp/button-resting-evidence.json`.
- `node /private/tmp/check-button-ssr.mjs`: 12 SSR fixture route-width samples, 102 controls matched baseline, including cards/detail/pagination. `/private/tmp/button-blog-ssr-evidence.json`.
- Independent QA artifacts: `/private/tmp/issue136-qa/`. QA initially found reduced pseudo specificity and outline invalid ordering; both reproduced and fixed. Additional inline-block share baseline regression found by expanded resting comparison and fixed with block content in that composition.

No implementation commit, push, PR, merge or deployment. Tech Lead/root owns eventual PR creation; PR must remain open pending user approval.
