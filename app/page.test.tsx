import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import Home from "./page";

afterEach(cleanup);

it("renders the home sections while preserving the live feeds", () => {
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

  expect(screen.getByText("DO PLANO À PRÁTICA")).toBeInTheDocument();
  expect(screen.getByText("ACERVO COLETIVO")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Ferramentas" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Conteúdos" })).toBeInTheDocument();
  expect(screen.queryByText("FERRAMENTAS")).not.toBeInTheDocument();
  expect(screen.queryByText("CONTEÚDOS")).not.toBeInTheDocument();
});

it("uses the Penpot network artwork for the hero decoration", () => {
  const { container } = render(<Home />);

  const decoration = container.querySelector('[data-testid="hero-decoration"]');
  expect(decoration).toBeInTheDocument();
  expect(decoration).toHaveAttribute("aria-hidden", "true");
  const image = decoration?.querySelector("img");
  expect(image).toHaveAttribute("src", "/images/hero-ideas-network.svg");
  expect(image).toHaveAttribute("alt", "");
  expect(decoration?.querySelectorAll("img")).toHaveLength(1);
});

it("shows the collective invitation from the authoritative frame", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { name: "Ideias boas não ficam paradas." })).toBeInTheDocument();
  expect(screen.getByText("O HUB TAMBÉM É SEU")).toBeInTheDocument();
  expect(screen.getByText("Tem algo para somar? Coloque sua ideia em movimento.")).toBeInTheDocument();
});

it("invites reading and signing the manifesto",()=>{
 render(<Home />);
 expect(screen.getByRole("link",{name:/Leia e assine o manifesto/})).toHaveAttribute("href","/manifesto");
});
