import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

const styles = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

it("uses a dark, high-contrast surface for community cards", () => {
  expect(styles).toContain("--tech-card: var(--vv-color-blue);");
  expect(styles).toContain("--tech-card-foreground: var(--vv-color-white);");
  expect(styles).toContain(".tool-card, .content-card { background: var(--tech-card);");
  expect(styles).toContain("color: var(--tech-card-foreground);");
});

it("keeps the hero heading intact on small screens", () => {
  expect(styles).toContain(".hero-copy h1 { max-width: 9ch; font-size: clamp(2.5rem, 12vw, 4rem); overflow-wrap: normal; word-break: normal; }");
  const heroHeadingStyles = styles.match(/\.hero-copy h1 \{[^}]*\}/)?.[0] ?? "";
  expect(heroHeadingStyles).not.toContain("overflow-wrap: anywhere;");
});

it("uses a vertically stacked contextual heading for homepage sections", () => {
  expect(styles).toContain(".section-heading { display: grid; gap: .85rem; }");
  expect(styles).toContain(".page-intro > p:first-child, .section-eyebrow { margin: 0;");
  expect(styles).toContain(".section-eyebrow { color: var(--tech-yellow); }");
});

it("keeps the submission panel above the editorial heading", () => {
  expect(styles).toContain(".submission-panel { position: relative; z-index: 1;");
  expect(styles).toContain(".submission-intro h1 { max-width: 7ch; color: #f8f7ff; font-size: clamp(3rem, 4.5vw, 4.75rem);");
});

it("isolates toast and dialog typography from editorial headings", () => {
  expect(styles).toContain('[data-slot="toast-title"] {');
  expect(styles).toContain('font-size: 1rem !important;');
  expect(styles).toContain('[data-slot="dialog-title"] {');
  expect(styles).toContain('font-size: 2rem !important;');
});

it("preserves the Figma dialog frame after global styles are applied", () => {
  expect(styles).toContain('[data-slot="dialog-content"] { width: min(calc(100vw - 2rem), 32rem); max-height: min(44rem, calc(100dvh - 2rem)); gap: 1rem; overflow-y: auto; padding: 1.5rem; border: 3px solid #000; border-radius: 8px; background: #fff; color: #000; box-shadow: 10px 10px 0 #000; }');
});

it("keeps the content-card share trigger legible on hover", () => {
  expect(styles).toContain('.share-trigger:hover { --press-bg: var(--tech-yellow); background: var(--tech-yellow); color: var(--tech-blue); }');
});

it("applies home colors to the default share trigger presentation", () => {
  expect(styles).toContain(".share-trigger.share-trigger-home-colors { --press-border-color: #000; border-color: #000; --press-bg: var(--vv-color-yellow); background: var(--vv-color-yellow); color: #000; }");
  expect(styles).toContain(".share-trigger.share-trigger-home-colors:hover { --press-bg: var(--vv-color-coral); background: var(--vv-color-coral); color: #000; }");
  expect(styles).toContain(".share-trigger.share-trigger-home-colors:focus-visible { outline-color: var(--vv-color-blue); }");
});

it("defines the Figma brand, geometry, and spacing tokens", () => {
  expect(styles).toContain("--vv-color-blue: #1900d0;");
  expect(styles).toContain("--vv-color-yellow: #fcf050;");
  expect(styles).toContain("--vv-color-coral: #ff8d78;");
  expect(styles).toContain("--vv-border-width: 3px;");
  expect(styles).toContain("--vv-radius-control: 4px;");
  expect(styles).toContain("--vv-shadow-hard: 7px 7px 0 var(--vv-color-black);");
  expect(styles).toContain("--vv-space-10: 80px;");
  expect(styles).toContain("--vv-grid-unit: 90px;");
});

it("keeps the technical grid decorative and responsive", () => {
  expect(styles).toContain("background-size: var(--vv-grid-unit) var(--vv-grid-unit);");
  expect(styles).toContain("body { background-size: 48px 48px; }");
});

it("switches the header to its menu layout before desktop links can overflow", () => {
  expect(styles).toContain("@media (max-width: 1024px) {");
});

it("makes the header viewport-wide without allowing horizontal page scrolling", () => {
  expect(styles).toContain("html { overflow-x: clip; scroll-behavior: smooth; }");
  expect(styles).toContain(".site-header { position: sticky;");
  expect(styles).toContain("width: 100vw; max-width: 100vw;");
});

it("keeps the home layout responsive without replacing the desktop composition at tablet width", () => {
  expect(styles).toContain("@media (max-width: 1024px) { .home-page .site-header");
  expect(styles).toContain("@media (max-width: 600px) { .home-page .site-header");
});

it("renders the home content highlight as the Penpot horizontal editorial card", () => {
  expect(styles).toContain(".home-content .card-grid { display: block;");
  expect(styles).toContain(".home-content-card { position: relative; display: grid; grid-template-columns: 532px minmax(0, 1fr);");
  expect(styles).toContain("height: 350px;");
});

it("keeps portrait previews and sharing controls readable in the home highlight", () => {
  expect(styles).toContain("height: 350px;");
  expect(styles).toContain("object-fit: cover;");
  expect(styles).toContain(".home-content-info .share-trigger:hover { --press-bg: var(--vv-color-coral); background: var(--vv-color-coral); color: #000; }");
  expect(styles).toContain(".home-content-info .share-trigger:focus-visible { outline-color: var(--vv-color-blue); }");
  expect(styles).toContain(".home-share-dialog .share-preview { width: 100%; height: auto; max-height: 40vh; object-fit: contain; }");
});
