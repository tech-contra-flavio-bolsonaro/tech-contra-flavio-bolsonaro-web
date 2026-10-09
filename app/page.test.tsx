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
