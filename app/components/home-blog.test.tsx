import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { HomeBlog, HomeBlogLoading } from "./home-blog";
import { getBlogPage } from "@/app/lib/blog/server";
import type { BlogArticle } from "@/app/lib/blog/types";
vi.mock("@/app/lib/blog/server", () => ({ getBlogPage: vi.fn() }));
afterEach(() => { cleanup(); vi.resetAllMocks(); });
const article = (id: number): BlogArticle => ({ id, slug: `artigo-${id}`, title: `Artigo ${id}`, description: `Descrição ${id}`, author: { name: `Autora ${id}`, username: "autora" }, publishedAt: "2025-02-26T13:32:30Z", readingMinutes: 2, tags: ["javascript"], coverImage: null, sourceUrl: `https://dev.to/techcontrabolsonaro/artigo-${id}` });
it.each([0, 1, 4, 6])("shows only available articles up to four for %i results", async count => {
 vi.mocked(getBlogPage).mockResolvedValue({ status: "ok", articles: Array.from({ length: count }, (_, i) => article(i + 1)), hasNext: count === 6 });
 const { container } = render(await HomeBlog());
 expect(getBlogPage).toHaveBeenCalledWith(1);
 expect(container.querySelectorAll("article")).toHaveLength(Math.min(count, 4));
 expect(screen.getByRole("heading", { name: "Blog", level: 2 })).toBeInTheDocument();
 expect(screen.getByRole("link", { name: /Ver todos os artigos/ })).toHaveAttribute("href", "/blog");
 expect(container.querySelectorAll("img")).toHaveLength(0);
 if (count) {
  expect(screen.getByRole("heading", { name: "Artigo 1", level: 3 }).querySelector("a")).toHaveAttribute("href", "/blog/1/artigo-1");
  expect(screen.getByText("Autora 1")).toBeInTheDocument();
  expect(container.querySelector("time")).toHaveAttribute("datetime", article(1).publishedAt);
  expect(screen.queryByText(/Ainda não há artigos/)).not.toBeInTheDocument();
 } else expect(screen.getByText(/Ainda não há artigos/)).toBeInTheDocument();
});
it("keeps the real cover when present", async () => {
 vi.mocked(getBlogPage).mockResolvedValue({ status: "ok", articles: [{ ...article(1), coverImage: "https://dev.to/cover.png" }], hasNext: false });
 const { container } = render(await HomeBlog());
 expect(container.querySelector("img")).toHaveAttribute("src", "https://dev.to/cover.png");
});
it.each(["origin", "timeout", "rate-limit"] as const)("isolates %s failure without false empty state", async reason => {
 vi.mocked(getBlogPage).mockResolvedValue({ status: "unavailable", reason });
 render(await HomeBlog());
 expect(screen.getByRole("status")).toHaveTextContent("Não foi possível carregar os artigos agora.");
 expect(screen.queryByText(/Ainda não há artigos/)).not.toBeInTheDocument();
 expect(screen.getByRole("link", { name: /Ver todos os artigos/ })).toHaveAttribute("href", "/blog");
});
it("provides an honest scoped loading state and Blog access", () => {
 render(<HomeBlogLoading />);
 expect(screen.getByRole("status")).toHaveTextContent("Carregando artigos…");
 expect(screen.getByRole("link", { name: /Ver todos os artigos/ })).toHaveAttribute("href", "/blog");
});
