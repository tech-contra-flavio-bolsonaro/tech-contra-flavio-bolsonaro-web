import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { listTools } from "@/app/lib/tools-server";
import { HomeTools } from "./home-tools";

vi.mock("@/app/lib/tools-server", () => ({ listTools: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

const tool = (id: number) => ({ id: String(id), slug: `mapa-${id}`, title: `Mapa ${id}`, description: "Caminhos", category: "Mapa da virada", credit: "Comunidade", url: "https://example.com" });

it("renders the three latest tools as links on the server", async () => {
  vi.mocked(listTools).mockResolvedValue({ items: [1, 2, 3, 4].map(tool), hasMore: false });
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);

  render(await HomeTools());

  expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(["/ferramentas/mapa-1", "/ferramentas/mapa-2", "/ferramentas/mapa-3"]);
  expect(listTools).toHaveBeenCalledWith(0);
  expect(fetch).not.toHaveBeenCalled();
});

it("falls back to loading in the browser when the database is unavailable", async () => {
  vi.mocked(listTools).mockRejectedValue(new Error("offline"));
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [tool(1)], hasMore: false }) }));

  render(await HomeTools());

  expect(log).toHaveBeenCalledWith("home: falha ao listar ferramentas", expect.any(Error));
  expect(await screen.findByText("Mapa 1")).toBeInTheDocument();
});
