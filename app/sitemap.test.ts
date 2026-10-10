// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";

vi.mock("@/app/lib/tools-server", () => ({ listToolSlugs: vi.fn() }));
vi.mock("@/app/lib/published-content", () => ({ listPublishedContentIds: vi.fn() }));

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

async function load(siteUrl?: string) {
  if (siteUrl) vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
  const { listToolSlugs } = await import("@/app/lib/tools-server");
  const { listPublishedContentIds } = await import("@/app/lib/published-content");
  return { sitemap: (await import("./sitemap")).default, listToolSlugs: vi.mocked(listToolSlugs), listPublishedContentIds: vi.mocked(listPublishedContentIds) };
}

it("lists every published tool and content without double slashes", async () => {
  const { sitemap, listToolSlugs, listPublishedContentIds } = await load("https://vira.example/");
  listToolSlugs.mockResolvedValue(["radar", "mapa de voto"]);
  listPublishedContentIds.mockResolvedValue(["7b0c1e9a-1111-4222-8333-444455556666"]);

  const urls = (await sitemap()).map((entry) => entry.url);

  expect(urls).toEqual([
    "https://vira.example/",
    "https://vira.example/ferramentas",
    "https://vira.example/conteudos",
    "https://vira.example/blog",
    "https://vira.example/manifesto",
    "https://vira.example/ferramentas/radar",
    "https://vira.example/ferramentas/mapa%20de%20voto",
    "https://vira.example/conteudos/7b0c1e9a-1111-4222-8333-444455556666",
  ]);
  expect(urls.every((url) => !url.replace("https://", "").includes("//"))).toBe(true);
});

it("keeps the static pages when the database is unavailable", async () => {
  const { sitemap, listToolSlugs, listPublishedContentIds } = await load();
  vi.spyOn(console, "error").mockImplementation(() => {});
  listToolSlugs.mockRejectedValue(new Error("offline"));
  listPublishedContentIds.mockRejectedValue(new Error("offline"));

  expect((await sitemap()).map((entry) => entry.url)).toEqual([
    "https://techcontraflaviobolsonaro.dev/",
    "https://techcontraflaviobolsonaro.dev/ferramentas",
    "https://techcontraflaviobolsonaro.dev/conteudos",
    "https://techcontraflaviobolsonaro.dev/blog",
    "https://techcontraflaviobolsonaro.dev/manifesto",
  ]);
});
