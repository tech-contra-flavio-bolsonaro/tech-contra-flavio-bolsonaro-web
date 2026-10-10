import { expect, it, vi } from "vitest";
import { metadata } from "./layout";

vi.mock("next/font/google", () => {
  const font = () => ({ variable: "font" });
  return { Barlow_Condensed: font, Inter: font, IBM_Plex_Mono: font };
});

// Pages are indexable by default. A site-wide robots tag would be emitted next to
// the noindex that Next injects on not-found pages, sending conflicting signals.
it("leaves robots to each page instead of forcing index, follow site-wide", () => {
  expect(metadata.robots).toBeUndefined();
});
