import { describe, expect, it } from "vitest";
import { contents, tools } from "./content";

describe("curated hub content", () => {
  it("provides a usable destination for every tool", () => {
    for (const tool of tools) {
      expect(tool.url).toMatch(/^https:\/\//);
      expect(tool.accessMode).toMatch(/^(embed|external)$/);

      if (tool.accessMode === "embed") {
        expect(tool.embedUrl).toMatch(/^https:\/\//);
      }
    }
  });

  it("provides share metadata for every published content card", () => {
    expect(contents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "image", credit: expect.any(String) }),
        expect.objectContaining({
          kind: "video",
          embedUrl: expect.stringMatching(/^https:\/\//),
        }),
      ]),
    );
  });
});
