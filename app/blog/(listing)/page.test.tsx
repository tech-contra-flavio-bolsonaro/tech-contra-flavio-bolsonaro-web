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
  expect(screen.getByRole("link", { name: "Enviar uma ideia" })).toHaveAttribute("href", "/enviar");
  expect(document.querySelector(".blog-card-copy .blog-featured-label")).toHaveTextContent("EM DESTAQUE");
});

it("renders Home SVG actions throughout listing and pagination", async () => {
  vi.mocked(getBlogPage).mockResolvedValue({ status: "ok", articles: [article], hasNext: true });
  render(await BlogPage({ searchParams: Promise.resolve({ page: "2" }) }));
  for (const name of [/Conheça no DEV.to/, /Ler artigo/, /Enviar uma ideia/, /Anterior/, /Próxima/]) {
    const link = screen.getByRole("link", { name });
    expect(link).toHaveClass("home-button");
    expect(link.querySelector("svg.home-arrow")).toHaveAttribute("width", "24");
    expect(link.textContent).not.toMatch(/[↗←→]/u);
  }
});

it("uses the Home retry primitive for listing failure", async () => {
  vi.mocked(getBlogPage).mockResolvedValue({ status: "unavailable", reason: "timeout" });
  render(await BlogPage({ searchParams: Promise.resolve({}) }));
  const retry = screen.getByRole("button", { name: "Tentar novamente" });
  expect(retry).toHaveClass("home-button");
  expect(retry.querySelector("svg.home-arrow")).toHaveAttribute("width", "24");
});

it("preserves featured media, mixed grid covers and every real permalink", async () => {
  const articles = [
    { ...article, coverImage: "https://media2.dev.to/featured.png" },
    { ...article, id: 2, slug: "sem-capa", title: "História sem capa" },
    { ...article, id: 3, slug: "com-capa", title: "História com capa", coverImage: "https://media2.dev.to/grid.png" },
  ];
  vi.mocked(getBlogPage).mockResolvedValue({ status: "ok", articles, hasNext: false });
  render(await BlogPage({ searchParams: Promise.resolve({}) }));
  const cards = document.querySelectorAll("article.blog-card");
  expect(cards).toHaveLength(3);
  expect(cards[0]).toHaveClass("blog-card-featured");
  expect(cards[0].querySelector("img")).toHaveAttribute("src", articles[0].coverImage);
  expect(cards[1]).toHaveClass("blog-card-no-cover");
  expect(cards[1].querySelector("img")).toBeNull();
  expect(cards[2].querySelector("img")).toHaveAttribute("src", articles[2].coverImage);
  expect(document.querySelectorAll(".blog-grid article")).toHaveLength(2);
  for (const [index, link] of screen.getAllByRole("link", { name: "Ler artigo" }).entries()) {
    expect(link).toHaveAttribute("href", `/blog/${articles[index].id}/${articles[index].slug}`);
    expect(link.querySelector("svg.home-arrow")).not.toBeNull();
  }
});
