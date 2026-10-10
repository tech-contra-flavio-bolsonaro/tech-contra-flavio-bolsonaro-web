import { existsSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { findTool, findToolEmbed } from "@/app/lib/tools-server";
import ToolPage, { generateMetadata } from "./page";
import { defaultShareImages } from "@/app/lib/page-metadata";

vi.mock("next/navigation", () => ({
  usePathname: () => "/ferramentas/virada-no-bairro",
  notFound: () => {
    throw new Error("not-found");
  },
}));
vi.mock("@/app/lib/tools-server", () => ({
  findTool: vi.fn(),
  findToolEmbed: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const tool = {
  id: "tool-1",
  slug: "virada-no-bairro",
  title: "Virada no Bairro",
  description: "Encontre iniciativas para mobilização local.",
  category: "Mapa da virada",
  credit: "Comunidade Vira Voto",
  url: "https://example.com/virada",
  priority: 0,
  is_internal: false,
};
const props = (slug: string) => ({ params: Promise.resolve({ slug }) });

it("treats an unknown tool as not found while resolving metadata", async () => {
  vi.mocked(findTool).mockResolvedValue(null);

  await expect(generateMetadata(props("xyz"))).rejects.toThrow("not-found");
  await expect(ToolPage(props("xyz"))).rejects.toThrow("not-found");
});

it("keeps a published tool indexable with its own canonical", async () => {
  vi.mocked(findTool).mockResolvedValue(tool);

  const metadata = await generateMetadata(props("virada-no-bairro"));

  expect(metadata.robots).toBeUndefined();
  expect(metadata.alternates?.canonical).toBe("/ferramentas/virada-no-bairro");
});

// A loading boundary starts streaming with HTTP 200 before notFound() runs,
// which turns a missing tool into a soft 404 (issue #101).
it("has no loading boundary, so a missing tool can still answer 404", () => {
  expect(existsSync(join(process.cwd(), "app/ferramentas/[slug]/loading.tsx"))).toBe(false);
});

it("uses the shared Ferramentas header and detail-page button styles", async () => {
  vi.mocked(findTool).mockResolvedValue(tool);
  vi.mocked(findToolEmbed).mockResolvedValue(null);

  const page = await ToolPage({ params: Promise.resolve({ slug: "virada-no-bairro" }) });
  const { container } = render(page);

  expect(container.querySelector("main")).toHaveClass("tools-page", "tool-detail-page");
  expect(container.querySelector(".site-header-brand img")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Virada no Bairro" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "← TODAS AS FERRAMENTAS" })).toHaveAttribute("href", "/ferramentas");
  expect(screen.getByRole("link", { name: "Abrir no site de origem (nova aba)" })).toHaveClass("action-link");
});

it("shares a tool as a website with the default image", async () => {
  vi.mocked(findTool).mockResolvedValue({
    id: "tool-1",
    slug: "virada-no-bairro",
    title: "Virada no Bairro",
    description: "Encontre iniciativas para mobilização local.",
    category: "Mapa da virada",
    credit: "Comunidade Vira Voto",
    url: "https://example.com/virada",
  });

  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "virada-no-bairro" }) });

  expect(metadata.openGraph).toMatchObject({ type: "website", images: defaultShareImages });
});
