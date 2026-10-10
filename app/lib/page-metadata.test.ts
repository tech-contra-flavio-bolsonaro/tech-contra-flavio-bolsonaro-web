import { expect, it, vi } from "vitest";
import { defaultShareImages } from "@/app/lib/page-metadata";

// Only the static metadata exports are under test; the pages' server data layer is irrelevant here.
vi.mock("server-only", () => ({}));
import { metadata as home } from "@/app/page";
import { metadata as ferramentas } from "@/app/ferramentas/page";
import { metadata as conteudos } from "@/app/conteudos/page";
import { metadata as manifesto } from "@/app/manifesto/page";
import { metadata as blog } from "@/app/blog/(listing)/page";

it("gives the home a descriptive title that skips the template", () => {
  expect(home.title).toEqual({ absolute: "Vira Voto – Tech Contra Bolsonaro" });
  expect(home.openGraph?.title).toBe("Vira Voto – Tech Contra Bolsonaro");
});

it.each([
  [home, "/"],
  [ferramentas, "/ferramentas"],
  [conteudos, "/conteudos"],
  [manifesto, "/manifesto"],
  [blog, "/blog"],
])("declares canonical and og:url for %#", (metadata, path) => {
  expect(metadata.alternates).toEqual({ canonical: path });
  expect(metadata.openGraph).toMatchObject({ url: path, siteName: "Vira Voto", locale: "pt_BR" });
});

it.each([
  ["app/not-found"],
  ["app/ferramentas/[slug]/not-found"],
  ["app/blog/not-found"],
  ["app/blog/[id]/[slug]/not-found"],
])("titles the %s page as not found, outside the site template", async (path) => {
  const { metadata } = await import(`@/${path}`);
  expect(metadata.title).toEqual({ absolute: "Vira Voto - Página Não Encontrada" });
});

it("points to the default share image at 1200x630", () => {
  expect(defaultShareImages).toEqual([{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Vira Voto" }]);
});

it.each([
  [ferramentas, "/ferramentas"],
  [conteudos, "/conteudos"],
  [blog, "/blog"],
])("shares %# with the default image instead of none", (metadata) => {
  expect(metadata.openGraph?.images).toEqual(defaultShareImages);
});

// A configured image beats the segment's opengraph-image file (checked on Next 16.3.7),
// so pages that ship their own file must not receive the default.
it.each([
  [home, "/"],
  [manifesto, "/manifesto"],
])("leaves %# to its own opengraph-image file", (metadata) => {
  expect(metadata.openGraph?.images).toBeUndefined();
});
