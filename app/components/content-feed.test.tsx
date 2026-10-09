import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ContentFeed } from "./content-feed";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

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

it("shares the selected content's permanent detail link from the feed", async () => {
  const id = "123e4567-e89b-42d3-a456-426614174000";
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      items: [{ id, title: "Card", description: "Descrição do card", credit: "Vira Voto", media_path: null, mediaUrl: null, video_url: null }],
      hasMore: false,
    }),
  }));
  const open = vi.spyOn(window, "open").mockImplementation(() => null);

  render(<ContentFeed limit={1} />);
  fireEvent.click(await screen.findByRole("button", { name: "Compartilhar" }));
  fireEvent.click(await screen.findByRole("button", { name: "Compartilhar no X" }));

  const intent = new URL(open.mock.calls[0][0] as string);
  expect(intent.searchParams.get("url")).toBe(`http://localhost:3000/conteudos/${id}`);
  expect(intent.searchParams.get("text")).toBe("Card\n\nDescrição do card");
});

it("keeps real Home content and its complete media in the sharing dialog", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [{ id: "home", title: "Passagem real", description: "Descrição completa do item aprovado", credit: "Coletivo real", media_path: "real.png", mediaUrl: "https://example.com/real.png", video_url: "https://example.com/associated.mp4" }], hasMore: false }) }));
  render(<ContentFeed limit={1} variant="home" />);
  expect(await screen.findByText("Coletivo real")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Passagem real" })).toHaveAttribute("src", "https://example.com/real.png");
  expect(screen.queryByText("Conteúdo da comunidade")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  const dialog = await screen.findByRole("dialog");
  expect(dialog).toHaveTextContent("Descrição completa do item aprovado");
  expect(dialog).toHaveTextContent("Coletivo real");
  expect(screen.getByRole("button", { name: "Copiar imagem" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Abrir vídeo associado" })).toHaveAttribute("href", "https://example.com/associated.mp4");
  expect(screen.getByRole("img", { name: "Preview: Passagem real" })).toHaveAttribute("src", "https://example.com/real.png");
});

it.each([
  [null, "https://example.com/external.mp4", "https://example.com/external.mp4"],
  ["https://example.com/upload.mp4", "https://example.com/external.mp4", "https://example.com/upload.mp4"],
])("keeps the uploaded video primary and falls back to the external video only without an upload", async (mediaUrl, video_url, expected) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [{ id: "video", title: "Vídeo real", description: "Descrição real", credit: "Coletivo", media_path: null, mediaUrl, video_url }], hasMore: false }) }));
  const { container } = render(<ContentFeed limit={1} variant="home" />);
  await screen.findByRole("heading", { name: "Vídeo real" });
  expect(container.querySelector("video")).toHaveAttribute("src", expected);
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  const dialog = await screen.findByRole("dialog");
  expect(dialog.querySelector("video")).toHaveAttribute("src", expected);
  expect(screen.getByRole("button", { name: "Copiar link" })).toBeInTheDocument();
});
