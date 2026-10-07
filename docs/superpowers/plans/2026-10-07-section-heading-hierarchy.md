# Section Heading Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make homepage section headings vertically ordered, non-redundant, and robust on narrow mobile screens.

**Architecture:** The homepage owns the contextual copy, while global CSS defines a reusable vertical header rhythm for homepage sections. The hero receives a narrow-screen typography constraint so words wrap naturally without orphaning a final character.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, Vitest, Playwright-free browser visual verification.

---

### Task 1: Cover section-copy semantics

**Files:**
- Modify: `app/page.tsx:20-34`
- Test: `app/page.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("uses contextual eyebrows instead of repeating section titles", () => {
  render(<Home />);
  expect(screen.getByText("HUB DE MOBILIZAÇÃO")).toBeInTheDocument();
  expect(screen.getByText("ACERVO COLETIVO")).toBeInTheDocument();
  expect(screen.queryByText("FERRAMENTAS")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `bunx vitest run app/page.test.tsx`

Expected: failure because the original duplicate eyebrows are rendered.

- [ ] **Step 3: Replace duplicate eyebrows with contextual copy**

```tsx
<div className="section-heading">
  <p className="section-eyebrow">HUB DE MOBILIZAÇÃO</p>
  <h2 id="tools-title">Ferramentas</h2>
</div>
```

Use `ACERVO COLETIVO` for the content section with the same structure.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `bunx vitest run app/page.test.tsx`

Expected: PASS.

### Task 2: Establish vertical rhythm and mobile-safe hero type

**Files:**
- Modify: `app/globals.css:30-60, @media (max-width: 600px)`
- Test: manual responsive verification at a 402 px viewport

- [ ] **Step 1: Add a vertical section-heading stack**

```css
.section-heading { display: grid; gap: .85rem; }
.section-eyebrow { margin: 0; color: var(--tech-yellow); font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
.section-heading h2 { max-width: 11ch; }
```

- [ ] **Step 2: Remove the broad selector that styles every first paragraph in a section**

Replace `section > p:first-child` with `.section-eyebrow` so only the intentional label gets eyebrow styling.

- [ ] **Step 3: Make the narrow hero title wrap only at word boundaries**

```css
@media (max-width: 600px) {
  .hero-copy h1 { max-width: 9ch; font-size: clamp(2.5rem, 13vw, 4rem); overflow-wrap: normal; word-break: normal; }
}
```

- [ ] **Step 4: Verify visually**

Run: `bun dev`

At 402 px wide, confirm `MOVIMENTO.` remains intact on a line and section labels stack directly above their headings.

### Task 3: Verify the change

**Files:**
- Verify: `app/page.tsx`, `app/globals.css`, `app/page.test.tsx`

- [ ] **Step 1: Run unit tests**

Run: `bun run test`

Expected: all tests pass.

- [ ] **Step 2: Run lint and production build**

Run: `bun run lint && bun run build && git diff --check`

Expected: all commands exit successfully.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx app/globals.css app/page.test.tsx docs/superpowers/specs/2026-10-07-section-heading-hierarchy-design.md docs/superpowers/plans/2026-10-07-section-heading-hierarchy.md
git commit -m "fix: clarify section heading hierarchy"
```
