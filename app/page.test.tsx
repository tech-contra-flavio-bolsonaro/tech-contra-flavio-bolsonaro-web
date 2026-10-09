import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import Home from "./page";

afterEach(cleanup);

it("renders the Figma home sections while preserving the live feeds", () => {
  const { container } = render(<Home />);

  expect(container.querySelector(".home-page")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /ideias ganham movimento/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /a democracia também se constrói em rede/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Ferramentas" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Conteúdos" })).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /enviar conteúdo/i })).toHaveLength(2);
  expect(screen.getAllByRole("link", { name: /enviar conteúdo/i }).every((link) => link.getAttribute("href") === "/enviar")).toBe(true);
  expect(container.querySelectorAll(".home-preview-feed")).toHaveLength(2);
});

it("uses contextual eyebrows instead of repeating the section titles", () => {
  render(<Home />);

  expect(screen.getByText("FERRAMENTAS PARA AGIR")).toBeInTheDocument();
  expect(screen.getByText("ACERVO COLETIVO")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Ferramentas" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Conteúdos" })).toBeInTheDocument();
  expect(screen.queryByText("FERRAMENTAS")).not.toBeInTheDocument();
  expect(screen.queryByText("CONTEÚDOS")).not.toBeInTheDocument();
});

it("uses the existing pixel-icon collage for the hero decoration", () => {
  const { container } = render(<Home />);

  const decoration = container.querySelector('[data-testid="hero-decoration"]');
  expect(decoration).toBeInTheDocument();
  expect(decoration?.querySelector('[src*="vintage-mac.svg"]')).toBeInTheDocument();
  expect(decoration?.querySelector('[src*="keyboard.svg"]')).toBeInTheDocument();
  expect(decoration?.querySelector('[src*="mouse.svg"]')).toBeInTheDocument();
  expect(decoration?.querySelector('[src*="computer-upload.svg"]')).toBeInTheDocument();
  expect(decoration?.querySelector('[src*="magic-wand.svg"]')).toBeInTheDocument();
  expect(decoration?.querySelector('[src*="interface-essential-link.svg"]')).toBeInTheDocument();
  expect(container.querySelector(".home-network")).not.toBeInTheDocument();
});
