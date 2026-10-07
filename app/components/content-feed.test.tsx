import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { ContentFeed } from "./content-feed";

it("loads approved content in batches of ten", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ items: [{ id: "1", title: "Card", description: "Conteúdo aprovado", credit: "Vira Voto", media_path: null, mediaUrl: null, video_url: null }], hasMore: true }),
  }));
  vi.stubGlobal("IntersectionObserver", undefined);

  render(<ContentFeed />);

  expect(await screen.findByRole("button", { name: "Carregar mais" })).toBeEnabled();
  expect(fetch).toHaveBeenCalledWith("/api/conteudos?page=0");
});

it("gives the empty content state a clear next action", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ items: [], hasMore: false }),
  }));

  render(<ContentFeed limit={4} />);

  expect(await screen.findByText("Ainda não há conteúdos publicados.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Enviar o primeiro conteúdo" })).toHaveAttribute("href", "/enviar");
});
