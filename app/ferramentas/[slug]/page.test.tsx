import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { findTool, findToolEmbed } from "@/app/lib/tools-server";
import ToolPage from "./page";

vi.mock("next/navigation", () => ({ usePathname: () => "/ferramentas/virada-no-bairro" }));
vi.mock("@/app/lib/tools-server", () => ({
  findTool: vi.fn(),
  findToolEmbed: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it("uses the shared Ferramentas header and detail-page button styles", async () => {
  vi.mocked(findTool).mockResolvedValue({
    id: "tool-1",
    slug: "virada-no-bairro",
    title: "Virada no Bairro",
    description: "Encontre iniciativas para mobilização local.",
    category: "Mapa da virada",
    credit: "Comunidade Vira Voto",
    url: "https://example.com/virada",
    priority: 0,
  });
  vi.mocked(findToolEmbed).mockResolvedValue(null);

  const page = await ToolPage({ params: Promise.resolve({ slug: "virada-no-bairro" }) });
  const { container } = render(page);

  expect(container.querySelector("main")).toHaveClass("tools-page", "tool-detail-page");
  expect(container.querySelector(".site-header-brand img")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Virada no Bairro" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "← TODAS AS FERRAMENTAS" })).toHaveAttribute("href", "/ferramentas");
  expect(screen.getByRole("link", { name: "Abrir no site de origem (nova aba)" })).toHaveClass("action-link");
});
