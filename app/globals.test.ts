import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

const styles = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

it("uses a dark, high-contrast surface for community cards", () => {
  expect(styles).toContain("--tech-card: #1000aa;");
  expect(styles).toContain("--tech-card-foreground: #f8f7ff;");
  expect(styles).toContain(".tool-card, .content-card { background: var(--tech-card);");
  expect(styles).toContain("color: var(--tech-card-foreground);");
});

it("reduces the hero heading scale on small screens", () => {
  expect(styles).toContain(".hero-copy h1 { font-size: clamp(2.75rem, 14vw, 4.5rem); }");
});

it("keeps the submission panel above the editorial heading", () => {
  expect(styles).toContain(".submission-panel { position: relative; z-index: 1;");
  expect(styles).toContain(".submission-intro h1 { max-width: 7ch; color: #f8f7ff; font-size: clamp(3rem, 4.5vw, 4.75rem);");
});
