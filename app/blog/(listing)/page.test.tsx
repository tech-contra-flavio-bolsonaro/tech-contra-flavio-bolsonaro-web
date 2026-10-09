import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import BlogPage from "./page";
import { getBlogPage } from "@/app/lib/blog/server";
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/app/lib/blog/server", () => ({ getBlogPage: vi.fn() }));
vi.mock("@/app/components/site-nav", () => ({
  SiteNav: () => <nav>Menu</nav>,
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
  tags: ["javascript", "beginners"],
  author: { name: "Pachi", username: "pachi" },
  coverImage: null,
  sourceUrl: "https://dev.to/techcontrabolsonaro/acao",
};
it("lists real published content and real tags without fake cover", async () => {
  vi.mocked(getBlogPage).mockResolvedValue({
    status: "ok",
    articles: [article],
    hasNext: false,
  });
  render(await BlogPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("link", { name: /Ler artigo/ })).toHaveAttribute(
    "href",
    "/blog/1/acao",
  );
  expect(screen.getByText("Ação real")).toBeInTheDocument();
  expect(screen.getByText("#javascript")).toBeInTheDocument();
  expect(screen.getByText("Pachi")).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});
it("shows empty separately from rate-limit failure and retry", async () => {
  vi.mocked(getBlogPage).mockResolvedValue({
    status: "ok",
    articles: [],
    hasNext: false,
  });
  render(await BlogPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByText(/Nenhum artigo/)).toBeInTheDocument();
  cleanup();
  vi.mocked(getBlogPage).mockResolvedValue({
    status: "unavailable",
    reason: "rate-limit",
  });
  render(await BlogPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByText(/limite de solicitações/)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Tentar novamente/ }),
  ).toBeInTheDocument();
});
it("preserves page boundaries and provides pagination", async () => {
  vi.mocked(getBlogPage).mockResolvedValue({
    status: "ok",
    articles: [article],
    hasNext: true,
  });
  render(await BlogPage({ searchParams: Promise.resolve({ page: "2" }) }));
  expect(getBlogPage).toHaveBeenCalledWith(2);
  expect(screen.getByRole("link", { name: /Próxima/ })).toHaveAttribute(
    "href",
    "/blog?page=3",
  );
  expect(screen.getByRole("link", { name: /Anterior/ })).toHaveAttribute(
    "href",
    "/blog?page=1",
  );
});

it("provides mobile editorial copy and a featured label inside the article copy", async () => {
  vi.mocked(getBlogPage).mockResolvedValue({ status: "ok", articles: [article], hasNext: false });
  render(await BlogPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByText("Histórias para transformar boas ideias em ação coletiva.")).toBeInTheDocument();
  expect(screen.getByText("TEM UMA IDEIA PARA CONTAR?").closest("a")).toHaveAttribute("href", "/enviar");
  expect(screen.getByText("Compartilhe com a comunidade")).toBeInTheDocument();
  expect(document.querySelector(".blog-card-copy .blog-featured-label")).toHaveTextContent("EM DESTAQUE");
});
