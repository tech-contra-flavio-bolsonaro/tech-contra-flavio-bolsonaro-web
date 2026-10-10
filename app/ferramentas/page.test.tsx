import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import FerramentasPage from "./page";

vi.mock("next/navigation", () => ({ usePathname: () => "/ferramentas" }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

it("shows tools from the API in the community tools page", async () => {
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
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      items: [publishedTool],
      hasMore: false,
      categories: [{ name: "Mobilização", count: 1 }, { name: "Organização", count: 2 }],
    }),
  });
  vi.stubGlobal("fetch", fetch);
  render(<FerramentasPage />);

  expect(screen.getByRole("heading", { name: "O QUE AJUDA A AGIR." })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "RECURSOS DA COMUNIDADE" })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Mapa da comunidade" })).toBeInTheDocument();
  expect(screen.getByText("Encontre ações e iniciativas próximas.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Mobilização/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explorar o mapa" })).toHaveAttribute(
    "href",
    "/ferramentas/mapa-de-iniciativas-locais",
  );
  expect(fetch).toHaveBeenCalledWith("/api/ferramentas?page=0", {
    signal: expect.any(AbortSignal),
    cache: "no-store",
  });
  expect(screen.getByRole("link", { name: /Sugerir uma ferramenta/ })).toHaveAttribute(
    "href",
    "/ferramentas/enviar",
  );
  expect(screen.getByRole("link", { name: "Ferramentas" })).toHaveAttribute("aria-current", "page");
  expect(screen.queryByText("EM BREVE / AINDA NÃO DISPONÍVEIS")).not.toBeInTheDocument();
});
