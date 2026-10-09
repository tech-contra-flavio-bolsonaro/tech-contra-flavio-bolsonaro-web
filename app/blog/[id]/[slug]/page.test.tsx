import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import DetailPage, { generateMetadata } from "./page";
import { getBlogArticle } from "@/app/lib/blog/server";
vi.mock("server-only", () => ({}));
vi.mock("@/app/lib/blog/server", () => ({ getBlogArticle: vi.fn() }));
vi.mock("@/app/components/site-nav", () => ({
  SiteNav: () => <nav>Menu</nav>,
}));
vi.mock("@/app/components/share-button", () => ({
  ShareButton: ({ url }: { url: string }) => (
    <button data-url={url}>Compartilhar</button>
  ),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  redirect: (url: string) => {
    throw new Error("redirect:" + url);
  },
  notFound: () => {
    throw new Error("not-found");
  },
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const article = {
  id: 1,
  slug: "acao",
  title: "Ação real",
  description: "História publicada",
  publishedAt: "2025-02-26T13:32:30Z",
  readingMinutes: 1,
  tags: ["javascript"],
  author: { name: "Pachi", username: "pachi" },
  coverImage: null,
  sourceUrl: "https://dev.to/techcontrabolsonaro/acao",
  bodyHtml: "<p>educação <code>if</code></p><script>alert(1)</script>",
};
const props = { params: Promise.resolve({ id: "1", slug: "acao" }) };
it("uses source SEO canonical and local share/OG URL with author", async () => {
  vi.mocked(getBlogArticle).mockResolvedValue({ status: "ok", article });
  render(await DetailPage(props));
  expect(
    screen.getAllByRole("button", { name: "Compartilhar" })[0],
  ).toHaveAttribute("data-url", "/blog/1/acao");
  expect(screen.getByRole("link", { name: "Pachi" })).toHaveAttribute(
    "href",
    "https://dev.to/pachi",
  );
  expect(screen.getByText(/educação/)).toBeInTheDocument();
  expect(document.querySelector("script")).toBeNull();
  const metadata = await generateMetadata(props);
  expect(metadata.alternates).toEqual({ canonical: article.sourceUrl });
  expect(metadata.openGraph).toMatchObject({
    url: "/blog/1/acao",
    type: "article",
  });
});
it("redirects wrong slug only after organization validation", async () => {
  vi.mocked(getBlogArticle).mockResolvedValue({ status: "ok", article });
  await expect(
    DetailPage({ params: Promise.resolve({ id: "1", slug: "wrong" }) }),
  ).rejects.toThrow("redirect:/blog/1/acao");
});
it("404 only for missing/foreign, not origin failure", async () => {
  vi.mocked(getBlogArticle).mockResolvedValue({ status: "not-found" });
  await expect(DetailPage(props)).rejects.toThrow("not-found");
  vi.mocked(getBlogArticle).mockResolvedValue({
    status: "unavailable",
    reason: "timeout",
  });
  render(await DetailPage(props));
  expect(screen.getByText(/demorou/)).toBeInTheDocument();
  expect((await generateMetadata(props)).robots).toEqual({
    index: false,
    follow: true,
  });
});

it("uses the approved detail invitation instead of listing copy", async () => {
  vi.mocked(getBlogArticle).mockResolvedValue({ status: "ok", article });
  render(await DetailPage(props));
  expect(
    screen.getByRole("heading", { name: "VAI COMPARTILHAR UMA IDEIA?" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Convide mais pessoas para construir junto."),
  ).toBeInTheDocument();
  expect(screen.queryByText("TEM UMA HISTÓRIA BOA?")).not.toBeInTheDocument();
});
