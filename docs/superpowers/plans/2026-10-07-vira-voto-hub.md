# Vira Voto Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the starter page with a responsive, accessible Vira Voto community hub for manifesto, tools, and shareable content.

**Architecture:** Keep the route as a Server Component and store initial curated data in `app/lib/content.ts`, whose types mirror the later Supabase records. Isolate browser-only iframe disclosure and share behavior in small Client Components so the initial render remains static and lightweight.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest and Testing Library.

---

## File structure

- Create: `app/lib/content.ts` — domain types plus curated demonstration tools and content.
- Create: `app/lib/content.test.ts` — validates the public content contract and safe tool URLs.
- Create: `app/components/tool-card.tsx` — client-side, opt-in iframe disclosure with external fallback.
- Create: `app/components/share-button.tsx` — client-side Web Share/copy-link control.
- Create: `app/components/tool-card.test.tsx` — verifies tool access behavior.
- Modify: `app/page.tsx` — semantic server-rendered hub sections and data composition.
- Modify: `app/globals.css` — palette, responsive layout, typography, focus and motion rules.
- Modify: `app/layout.tsx` — Portuguese language and production metadata.
- Modify: `package.json` — add test command and test-only dependencies.
- Create: `vitest.config.ts` and `vitest.setup.ts` — browser-like test environment.

### Task 1: Establish test harness and content contract

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/lib/content.ts`
- Create: `app/lib/content.test.ts`

- [ ] **Step 1: Add the failing content contract test**

```ts
import { describe, expect, it } from "vitest";
import { contents, tools } from "./content";

describe("curated hub content", () => {
  it("provides a usable destination for every tool", () => {
    for (const tool of tools) {
      expect(tool.url).toMatch(/^https:\/\//);
      expect(tool.accessMode).toMatch(/^(embed|external)$/);
      if (tool.accessMode === "embed") expect(tool.embedUrl).toMatch(/^https:\/\//);
    }
  });

  it("provides share metadata for every published content card", () => {
    expect(contents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "image", credit: expect.any(String) }),
        expect.objectContaining({ kind: "video", embedUrl: expect.stringMatching(/^https:\/\//) }),
      ]),
    );
  });
});
```

- [ ] **Step 2: Configure Vitest and verify the test fails because the module is absent**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"] },
});

// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

Add `"test": "vitest run"` to `scripts` and add `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `@vitejs/plugin-react` to `devDependencies`.

Run: `bun test`

Expected: FAIL with `Cannot find module './content'`.

- [ ] **Step 3: Implement the typed content boundary**

```ts
export type Tool = {
  id: string;
  title: string;
  description: string;
  category: string;
  accessMode: "embed" | "external";
  url: string;
  embedUrl?: string;
};

export type Content = {
  id: string;
  title: string;
  description: string;
  kind: "image" | "video";
  credit: string;
  tags: string[];
  accent: "rose" | "sage" | "sky";
  url: string;
  embedUrl?: string;
};
```

Export three tools: a strategy canvas marked `embed` with an HTTPS `embedUrl`, a link repository marked `external`, and a campaign calendar marked `external`. Export three content records: two `image` cards with HTTPS share URLs and one `video` with an HTTPS embed URL. Use Portuguese titles, descriptions, credits and tags; do not claim that a fictitious service is live.

- [ ] **Step 4: Run the content test**

Run: `bun test app/lib/content.test.ts`

Expected: PASS with two tests.

- [ ] **Step 5: Commit the contract boundary**

```bash
git add package.json bun.lock vitest.config.ts vitest.setup.ts app/lib/content.ts app/lib/content.test.ts
git commit -m "feat: add hub content contract"
```

### Task 2: Implement the interactive tool and sharing controls

**Files:**
- Create: `app/components/tool-card.tsx`
- Create: `app/components/tool-card.test.tsx`
- Create: `app/components/share-button.tsx`

- [ ] **Step 1: Write the failing tool interaction test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ToolCard } from "./tool-card";

it("loads an embeddable tool only after the visitor requests it", () => {
  render(<ToolCard tool={{ id: "t", title: "Mapa", description: "Descubra caminhos.", category: "Planejamento", accessMode: "embed", url: "https://example.com", embedUrl: "https://example.com/embed" }} />);
  expect(screen.queryByTitle("Mapa")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Abrir aqui" }));
  expect(screen.getByTitle("Mapa")).toHaveAttribute("src", "https://example.com/embed");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test app/components/tool-card.test.tsx`

Expected: FAIL with module `./tool-card` not found.

- [ ] **Step 3: Implement `ToolCard` as a focused Client Component**

Start `app/components/tool-card.tsx` with `"use client"`. Render title, category and description for all modes. For `embed`, render a button labelled `Abrir aqui`; on click, replace the button area with an `<iframe>` using `title={tool.title}`, `loading="lazy"`, `src={tool.embedUrl}`, and `sandbox="allow-scripts allow-forms allow-popups allow-same-origin"`. Render a persistent external `<a>` with `target="_blank"` and `rel="noreferrer"`. For `external`, render only the external link with label `Abrir ferramenta`.

- [ ] **Step 4: Implement the share button safely**

Start `app/components/share-button.tsx` with `"use client"`. Accept `title` and `url`. On click, use `navigator.share({ title, url })` when available; otherwise use `navigator.clipboard.writeText(url)`, show `Link copiado`, and restore `Compartilhar` after 2 seconds. Catch rejected sharing and leave the default label intact.

- [ ] **Step 5: Run component tests**

Run: `bun test app/components/tool-card.test.tsx`

Expected: PASS with one test.

- [ ] **Step 6: Commit the isolated interactive components**

```bash
git add app/components/tool-card.tsx app/components/tool-card.test.tsx app/components/share-button.tsx
git commit -m "feat: add safe tool and share controls"
```

### Task 3: Build the server-rendered hub and visual system

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace starter markup with semantic sections**

Use `tools` and `contents` from `app/lib/content`, and render the sections below in `app/page.tsx`:

```tsx
<main>
  <section className="hero" aria-labelledby="hero-title">…</section>
  <section className="manifesto" id="manifesto" aria-labelledby="manifesto-title">…</section>
  <section className="tools-section" id="ferramentas" aria-labelledby="tools-title">…</section>
  <section className="content-section" id="conteudos" aria-labelledby="content-title">…</section>
  <section className="contribute" aria-labelledby="contribute-title">…</section>
</main>
```

The header links to the three section IDs. The hero uses the approved headline `IDEIAS GANHAM MOVIMENTO.` with only `MOVIMENTO.` in a red accent. The manifesto is a concise invitation to organize, share and act. Map the tool array to `ToolCard`. Map contents to article cards with a CSS-only pastel visual, title, kind, description, credit, tags and `ShareButton`. The final section states that community uploads will open soon and does not render a non-functional form.

- [ ] **Step 2: Replace global starter styling with the approved visual language**

In `app/globals.css`, retain `@import "tailwindcss"` and define CSS variables for `--lavender: #dfe4f4`, `--ink: #202a5c`, `--paper: #fffaf2`, `--coral: #ec3a32`, plus rose, sage and sky pastels. Implement a max-width shell, fluid `clamp()` heading sizes, responsive grids that collapse to one column, a visible `:focus-visible` outline in coral, card hover states that do not depend on color alone, and this motion protection:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
}
```

Use coral only on actions, hero emphasis, focus and the contribution CTA. Do not add a dark-mode override: the public visual direction is the approved light palette.

- [ ] **Step 3: Update root metadata and language**

Set root `<html lang="pt-BR">`. Replace generated metadata with:

```ts
export const metadata: Metadata = {
  title: "Vira Voto — ideias em movimento",
  description: "Ferramentas e conteúdos para fortalecer conversas que movem o Brasil.",
};
```

Keep the root layout’s required `html` and `body` elements and its font variables.

- [ ] **Step 4: Run all automated verification**

Run: `bun test && bun run lint && bun run build`

Expected: all tests pass, lint exits 0 and Next.js finishes a production build.

- [ ] **Step 5: Manually verify the rendered page**

Run: `bun run dev`

Verify at the local URL: desktop and 375px layouts; anchor navigation; keyboard focus; an embedded tool’s external fallback; a video card; and reduced-motion styling using browser emulation.

- [ ] **Step 6: Commit the hub**

```bash
git add app/page.tsx app/globals.css app/layout.tsx
git commit -m "feat: launch vira voto community hub"
```

### Task 4: Prepare the Supabase handoff without exposing credentials

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document the future data mapping**

Add a `## Supabase` section that lists the proposed `tools`, `contents`, and `submissions` tables from the approved design. State that the visual launch reads from `app/lib/content.ts` until the authenticated MCP-backed migration is deliberately applied, and that service-role credentials must never be exposed in browser variables.

- [ ] **Step 2: Verify no credentials were added**

Run: `rg -n "(service_role|SUPABASE.*KEY|eyJ[a-zA-Z0-9_-]{20,})" app README.md --glob '!*.test.*'`

Expected: no matches.

- [ ] **Step 3: Commit the integration handoff**

```bash
git add README.md
git commit -m "docs: add supabase hub handoff"
```

## Self-review

- Spec coverage: Tasks 1–3 cover the approved palette, hero, manifesto, tools, embedded/external fallback, content cards, sharing, accessibility, metadata and responsive verification. Task 4 covers the Supabase-ready boundary and credential safety. The intentionally deferred upload and moderation flow remains explicitly outside this implementation.
- Placeholder scan: no implementation placeholder remains; deferred systems have a defined ownership boundary and a named later table.
- Type consistency: `Tool.accessMode`, `Tool.embedUrl`, `Content.kind`, `Content.embedUrl`, `ToolCard`, and `ShareButton` use the same names in test, contract and rendering tasks.
