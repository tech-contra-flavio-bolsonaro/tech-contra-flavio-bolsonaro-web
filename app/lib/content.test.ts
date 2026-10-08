import { describe, expect, it } from "vitest";
import { contents } from "./content";

describe("curated hub content", () => {
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
