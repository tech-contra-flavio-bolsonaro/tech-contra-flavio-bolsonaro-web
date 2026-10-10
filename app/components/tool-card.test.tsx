import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ToolCard } from "./tool-card";

afterEach(cleanup);
const tool = { id: "real", slug: "mapa-de-iniciativas-locais", title: "Mapa de iniciativas locais", category: "Participação", description: "Projetos reais da comunidade", credit: "Rede Aberta", url: "https://example.com/mapa", priority: 0 };
it("labels the Home action for the real destination while keeping the catalog action", () => {
  const { rerender } = render(<ToolCard tool={tool} variant="home" index={1} />);
  expect(screen.getByRole("link", { name: "Explorar o mapa" })).toHaveAttribute("href", "/ferramentas/mapa-de-iniciativas-locais");
  rerender(<ToolCard tool={{ ...tool, slug: "painel-de-dados-comunitarios", title: "Painel de dados comunitários" }} variant="home" />);
  expect(screen.getByRole("link", { name: "Explorar o painel" })).toHaveAttribute("href", "/ferramentas/painel-de-dados-comunitarios");
  rerender(<ToolCard tool={tool} />);
  expect(screen.getByRole("link", { name: "Conhecer ferramenta" })).toHaveAttribute("href", "/ferramentas/mapa-de-iniciativas-locais");
});

it.each([
  ["gerador-de-qr-code", "Gerar QR code"],
  ["calendario-de-mobilizacao", "Ver calendário"],
  ["outra-ferramenta", "Abrir ferramenta"],
])("keeps the Home action tied to slug %s when the title changes", (slug, label) => {
  render(<ToolCard tool={{ ...tool, slug, title: "Título editado: mapa" }} variant="home" />);
  expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", `/ferramentas/${slug}`);
});
