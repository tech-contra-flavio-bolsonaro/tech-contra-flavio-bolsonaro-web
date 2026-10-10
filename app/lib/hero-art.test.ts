import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { renderHeroArtwork } from "./hero-art";

const original = readFileSync("public/images/hero-ideas-network.svg", "utf8");
const source = new DOMParser().parseFromString(original, "image/svg+xml");

it("preserves the original artwork geometry and copy with self-hosted original fonts", () => {
  const { markup, fonts } = renderHeroArtwork(original);
  expect(fonts).toHaveLength(16);
  expect(markup).not.toContain("data:font");
  const rendered = new DOMParser().parseFromString(markup, "image/svg+xml");
  const geometry = (doc: Document) => [...doc.querySelectorAll("path,rect,ellipse,circle,text")].map(element => ({
    tag: element.tagName,
    attrs: [...element.attributes].map(attr => [attr.name, attr.value.replaceAll("Hero IBM Plex Mono", "IBM Plex Mono").replaceAll("Hero Barlow Condensed", "Barlow Condensed")]).sort(),
    text: element.textContent,
  }));
  expect(geometry(rendered)).toEqual(geometry(source));
  expect(rendered.documentElement.getAttribute("viewBox")).toBe(source.documentElement.getAttribute("viewBox"));
  const embedded = [...original.matchAll(/data:font\/woff2;base64,([A-Za-z0-9+/=]+)/g)];
  fonts.forEach((font, index) => {
    const bytes = readFileSync(`public${font.href}`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(createHash("sha256").update(Buffer.from(embedded[index][1], "base64")).digest("hex"));
  });
});
