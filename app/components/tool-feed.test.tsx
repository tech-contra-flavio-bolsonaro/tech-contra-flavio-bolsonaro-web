import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ToolFeed } from "./tool-feed";

const item = (id: number) => ({ id: String(id), slug: `mapa-${id}`, title: `Mapa ${id}`, description: "Caminhos disponíveis", category: "Planejamento", credit: "Comunidade", url: "https://example.com" });
const response = (ids: number[], hasMore = false) => ({ ok: true, json: async () => ({ items: ids.map(item), hasMore }) });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("loads later pages, retains existing tools on failure, and retries the same page", async () => {
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

it("limits homepage tools to four without fetching extra pages", async () => {
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
