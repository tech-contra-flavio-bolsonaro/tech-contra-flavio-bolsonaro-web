import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { listAllTools, listToolCategories } from "@/app/lib/tools-server";
import FerramentasPage from "./page";

vi.mock("next/navigation", () => ({ usePathname: () => "/ferramentas" }));
vi.mock("@/app/lib/tools-server", () => ({ listAllTools: vi.fn(), listToolCategories: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  window.history.replaceState(null, "", "/");
});

const publishedTool = {
  id: "tool-1",
  slug: "mapa-de-iniciativas-locais",
  title: "Mapa da comunidade",
  description: "Encontre ações e iniciativas próximas.",
  category: "Mobilização",
  credit: "Rede Vira Voto",
  url: "https://example.com/mapa",
  priority: 0,
  is_internal: false,
};
const categories = [{ name: "Mobilização", count: 1 }, { name: "Organização", count: 2 }];
const page = (searchParams: Record<string, string> = {}) => FerramentasPage({ searchParams: Promise.resolve(searchParams) });

// Crawlers that skip JavaScript must find every tool link in the server HTML (issue #102).
it("renders every published tool on the server, without waiting for the API", async () => {
  vi.mocked(listAllTools).mockResolvedValue([publishedTool]);
  vi.mocked(listToolCategories).mockResolvedValue(categories);
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);

  render(await page());

  expect(screen.getByRole("heading", { name: "O QUE AJUDA A AGIR." })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "RECURSOS DA COMUNIDADE" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Mapa da comunidade" })).toBeInTheDocument();
  expect(screen.getByText("Encontre ações e iniciativas próximas.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Mobilização/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explorar o mapa" })).toHaveAttribute("href", "/ferramentas/mapa-de-iniciativas-locais");
  expect(screen.queryByText("Carregando ferramentas…")).not.toBeInTheDocument();
  expect(listAllTools).toHaveBeenCalledWith(undefined);
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByRole("link", { name: /Sugerir uma ferramenta/ })).toHaveAttribute("href", "/ferramentas/enviar");
  expect(screen.getByRole("link", { name: "Ferramentas" })).toHaveAttribute("aria-current", "page");
});

it("renders a shared category link already filtered", async () => {
  vi.mocked(listAllTools).mockResolvedValue([publishedTool]);
  vi.mocked(listToolCategories).mockResolvedValue(categories);
  vi.stubGlobal("fetch", vi.fn());

  render(await page({ categoria: " Mobilização " }));

  expect(listAllTools).toHaveBeenCalledWith("Mobilização");
  expect(screen.getByRole("button", { name: /Mobilização/ })).toHaveAttribute("aria-pressed", "true");
});

it("falls back to loading in the browser when the database is unavailable", async () => {
  vi.mocked(listAllTools).mockRejectedValue(new Error("offline"));
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(listToolCategories).mockResolvedValue(categories);
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [publishedTool], hasMore: false, categories }) });
  vi.stubGlobal("fetch", fetch);

  render(await page());

  expect(log).toHaveBeenCalledWith("ferramentas: falha ao listar ferramentas", expect.any(Error));
  expect(await screen.findByRole("heading", { name: "Mapa da comunidade" })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith("/api/ferramentas?page=0", { signal: expect.any(AbortSignal), cache: "no-store" });
});
