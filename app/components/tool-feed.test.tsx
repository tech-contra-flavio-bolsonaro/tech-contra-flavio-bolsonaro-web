import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ToolFeed } from "./tool-feed";

const item = (id: number) => ({ id: String(id), slug: `mapa-${id}`, title: `Mapa ${id}`, description: "Caminhos disponíveis", category: "Planejamento", credit: "Comunidade", url: "https://example.com" });
const response = (ids: number[], hasMore = false) => ({ ok: true, json: async () => ({ items: ids.map(item), hasMore }) });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); window.history.replaceState(null, "", "/"); });

it("loads later pages, retains existing tools on failure, and retries the same page", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const fetch = vi.fn().mockResolvedValueOnce(response([1], true)).mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(response([1, 2]));
  vi.stubGlobal("fetch", fetch);
  render(<ToolFeed />);
  expect(await screen.findByText("Mapa 1")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Carregar mais ferramentas" }));
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.getByText("Mapa 1")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  expect(await screen.findByText("Mapa 2")).toBeInTheDocument();
  expect(screen.getAllByText("Mapa 1")).toHaveLength(1);
  expect(fetch.mock.calls.map(([url]) => url)).toEqual(["/api/ferramentas?page=0", "/api/ferramentas?page=1", "/api/ferramentas?page=1"]);
  expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", "/ferramentas/mapa-1");
  await waitFor(() => expect(screen.queryByRole("button")).not.toBeInTheDocument());
});

it("loads the next page automatically when the feed sentinel enters view", async () => {
  let onIntersect: IntersectionObserverCallback | undefined;
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { onIntersect = callback; }
    observe() {}
    disconnect() {}
  });
  const fetch = vi.fn().mockResolvedValueOnce(response([1], true)).mockResolvedValueOnce(response([2], false));
  vi.stubGlobal("fetch", fetch);
  const { container } = render(<ToolFeed />);

  expect(await screen.findByText("Mapa 1")).toBeInTheDocument();
  expect(container.querySelector(".scroll-sentinel")).toBeInTheDocument();
  await waitFor(() => expect(onIntersect).toBeDefined());
  act(() => onIntersect?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));

  expect(await screen.findByText("Mapa 2")).toBeInTheDocument();
  expect(fetch.mock.calls.map(([url]) => url)).toEqual(["/api/ferramentas?page=0", "/api/ferramentas?page=1"]);
});

it("limits homepage tools to four without fetching extra pages", async () => {
  vi.stubGlobal("IntersectionObserver", class {
    constructor() {}
    observe() {}
    disconnect() {}
  });
  const fetch = vi.fn().mockResolvedValue(response([1, 2, 3, 4, 5], true));
  vi.stubGlobal("fetch", fetch);
  render(<ToolFeed limit={4} />);
  await screen.findByText("Mapa 4");
  expect(screen.queryByText("Mapa 5")).not.toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(1);
});

it("invites submissions when the approved collection is empty", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response([])));
  render(<ToolFeed />);
  expect(await screen.findByRole("link", { name: "Sugerir uma ferramenta" })).toHaveAttribute("href", "/ferramentas/enviar");
});

const categories = [{ name: "Planejamento", count: 2 }, { name: "Jogos", count: 1 }];
const withCategories = (ids: number[], category = "Planejamento") => ({ ok: true, json: async () => ({ items: ids.map((id) => ({ ...item(id), category })), hasMore: false, categories }) });

it("filters by category, keeps the choice in the URL and announces the result count", async () => {
  const fetch = vi.fn().mockResolvedValueOnce(withCategories([1, 2])).mockResolvedValueOnce(withCategories([3], "Jogos"));
  vi.stubGlobal("fetch", fetch);
  render(<ToolFeed />);
  expect(await screen.findByText("Mapa 1")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Todas/ })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: /Jogos/ }));
  expect(await screen.findByText("Mapa 3")).toBeInTheDocument();
  expect(screen.queryByText("Mapa 1")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Jogos/ })).toHaveAttribute("aria-pressed", "true");
  expect(window.location.search).toBe("?categoria=Jogos");
  expect(screen.getByText("1 ferramenta em Jogos")).toBeInTheDocument();
  expect(fetch.mock.calls.map(([url]) => url)).toEqual(["/api/ferramentas?page=0", "/api/ferramentas?page=0&categoria=Jogos"]);
});

it("restores a shared category and offers a way back when it has no tools", async () => {
  window.history.replaceState(null, "", "/ferramentas?categoria=Antiga");
  const fetch = vi.fn().mockResolvedValueOnce(withCategories([])).mockResolvedValueOnce(withCategories([1]));
  vi.stubGlobal("fetch", fetch);
  render(<ToolFeed />);
  expect(await screen.findByText("Nenhuma ferramenta publicada em “Antiga”.")).toBeInTheDocument();
  expect(fetch.mock.calls[0][0]).toBe("/api/ferramentas?page=0&categoria=Antiga");
  fireEvent.click(screen.getByRole("button", { name: "Ver todas as ferramentas" }));
  expect(await screen.findByText("Mapa 1")).toBeInTheDocument();
  expect(window.location.search).toBe("");
});

it("does not show category filters on the homepage", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(withCategories([1, 2])));
  render(<ToolFeed limit={4} />);
  await screen.findByText("Mapa 1");
  expect(screen.queryByRole("group", { name: "Filtrar ferramentas por categoria" })).not.toBeInTheDocument();
});

const initial = (ids: number[], category: string | null = null) => ({ items: ids.map(item), hasMore: false, categories, category });

it("renders server-provided tools as links without fetching on mount", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  render(<ToolFeed initial={initial([1, 2])} />);
  expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(["/ferramentas/mapa-1", "/ferramentas/mapa-2"]);
  expect(screen.queryByText("Carregando ferramentas…")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Todas/ })).toHaveAttribute("aria-pressed", "true");
  await act(async () => {});
  expect(fetch).not.toHaveBeenCalled();
});

it("keeps the server-selected category and filters through the API afterwards", async () => {
  const fetch = vi.fn().mockResolvedValueOnce(withCategories([1, 2]));
  vi.stubGlobal("fetch", fetch);
  render(<ToolFeed initial={initial([3], "Jogos")} />);
  expect(screen.getByRole("button", { name: /Jogos/ })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: /Todas/ }));
  expect(await screen.findByText("Mapa 1")).toBeInTheDocument();
  expect(fetch.mock.calls.map(([url]) => url)).toEqual(["/api/ferramentas?page=0"]);
});
