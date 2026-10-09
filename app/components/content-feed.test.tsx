import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

const approvedItem = (id: string) => ({ id, title: `Conteúdo ${id}`, description: "Descrição aprovada completa", credit: "Crédito original", media_path: null, mediaUrl: null, video_url: null });

it("uses the Penpot preparation only for an empty listing", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], hasMore: false }) }));
  render(<ContentFeed variant="listing" />);
  expect(await screen.findByRole("heading", { name: "O acervo está sendo preparado" })).toBeInTheDocument();
  expect(screen.getByText("ACERVO / EM PREPARAÇÃO")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Enviar um conteúdo" })).toHaveAttribute("href", "/enviar");
});

it("retries an initial failure without calling an empty acervo prepared", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true, json: async () => ({ items: [approvedItem("1")], hasMore: false }) }));
  render(<ContentFeed variant="listing" />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível carregar conteúdos");
  expect(screen.queryByText("O acervo está sendo preparado")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  expect(await screen.findByRole("heading", { name: "Conteúdo 1" })).toBeInTheDocument();
});

it("retains loaded cards during incremental failure and retries the same page with deduplication", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ items: [approvedItem("1")], hasMore: true }) }).mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true, json: async () => ({ items: [approvedItem("1"), approvedItem("2"), approvedItem("2")], hasMore: false }) }));
  render(<ContentFeed variant="listing" />);
  fireEvent.click(await screen.findByRole("button", { name: "Carregar mais" }));
  await screen.findByRole("alert");
  expect(screen.getByRole("heading", { name: "Conteúdo 1" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  await screen.findByRole("heading", { name: "Conteúdo 2" });
  expect(screen.getAllByRole("heading", { name: "Conteúdo 1" })).toHaveLength(1);
  expect(screen.getAllByRole("heading", { name: "Conteúdo 2" })).toHaveLength(1);
  expect(vi.mocked(fetch).mock.calls.map(([url]) => url)).toEqual(["/api/conteudos?page=0", "/api/conteudos?page=1", "/api/conteudos?page=1"]);
});

it("shares uploaded webm as video with all real listing metadata", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [{ ...approvedItem("video"), media_path: "real.webm", mediaUrl: "https://example.com/real.webm?token=local", video_url: "https://example.com/associated" }], hasMore: false }) }));
  const { container } = render(<ContentFeed variant="listing" />);
  await screen.findByRole("heading", { name: "Conteúdo video" });
  expect(container.querySelector("video")).toHaveAttribute("src", "https://example.com/real.webm?token=local");
  expect(screen.queryByRole("img", { name: "Conteúdo video" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  const dialog = await screen.findByRole("dialog");
  expect(dialog).toHaveTextContent("Descrição aprovada completa");
  expect(dialog).toHaveTextContent("Crédito original");
  expect(dialog.querySelector("video")).toHaveAttribute("src", "https://example.com/real.webm?token=local");
  expect(screen.getByRole("button", { name: "Copiar link" })).toBeInTheDocument();
});

it("keeps image-free references intentional and points to their real supported URL", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [{ ...approvedItem("link"), video_url: "https://www.youtube.com/watch?v=localtest" }], hasMore: false }) }));
  const { container } = render(<ContentFeed variant="listing" />);
  await screen.findByRole("heading", { name: "Conteúdo link" });
  expect(container.querySelector(".listing-content-media")).toBeNull();
  expect(screen.getByRole("link", { name: "Abrir referência" })).toHaveAttribute("href", "https://www.youtube.com/watch?v=localtest");
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  expect(await screen.findByRole("dialog")).toHaveTextContent("Crédito original");
  expect(screen.getByRole("button", { name: "Copiar link" })).toBeInTheDocument();
});

it("coalesces repeated observer entries into one incremental request", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ items: [approvedItem("1")], hasMore: true }) }).mockResolvedValueOnce({ ok: true, json: async () => ({ items: [approvedItem("2")], hasMore: false }) }));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(private callback: (entries: { isIntersecting: boolean }[]) => void) {}
    observe() { this.callback([{ isIntersecting: true }]); this.callback([{ isIntersecting: true }]); }
    disconnect() {}
  });
  render(<ContentFeed variant="listing" />);
  await screen.findByRole("heading", { name: "Conteúdo 2" });
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(vi.mocked(fetch).mock.calls.map(([url]) => url)).toEqual(["/api/conteudos?page=0", "/api/conteudos?page=1"]);
});

it.each([false, true])("keeps the focused pagination control mounted pending and focuses the first new card after completion (retry=%s)", async (retry) => {
  vi.stubGlobal("IntersectionObserver", undefined);
  let resolvePage!: (value: unknown) => void;
  const pending = new Promise(resolve => { resolvePage = resolve; });
  const request = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ items: [approvedItem("1")], hasMore: true }) });
  if (retry) request.mockResolvedValueOnce({ ok: false });
  request.mockReturnValueOnce(pending);
  vi.stubGlobal("fetch", request);
  render(<ContentFeed variant="listing" />);
  const more = await screen.findByRole("button", { name: "Carregar mais" });
  if (retry) { fireEvent.click(more); await screen.findByRole("alert"); }
  const control = screen.getByRole("button", { name: retry ? "Tentar novamente" : "Carregar mais" });
  control.focus();
  fireEvent.click(control);
  expect(control).toBeInTheDocument();
  expect(control).toHaveFocus();
  expect(control).toHaveAttribute("aria-disabled", "true");
  fireEvent.click(control);
  expect(request).toHaveBeenCalledTimes(retry ? 3 : 2);
  await act(async () => { resolvePage({ ok: true, json: async () => ({ items: [approvedItem("1"), approvedItem("2")], hasMore: false }) }); });
  await waitFor(() => expect(screen.getByRole("article", { name: "Conteúdo 2" })).toHaveFocus());
});
