import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import Home from "./page";

afterEach(cleanup);

it("uses the Streamline Pixel icons as decorative hero art", () => {
  const { container } = render(<Home />);

  expect(container.querySelector("[data-testid='hero-decoration']")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /ideias ganham movimento/i })).toBeInTheDocument();
  const heroIcons = Array.from(container.querySelectorAll("[data-testid='hero-decoration'] img"));

  expect(heroIcons).toHaveLength(6);
  expect(heroIcons.every((icon) => icon.getAttribute("src")?.includes("/icons/streamline-pixel/"))).toBe(true);
});

it("uses contextual eyebrows instead of repeating the section titles", () => {
  render(<Home />);

  expect(screen.getByText("HUB DE MOBILIZAÇÃO")).toBeInTheDocument();
  expect(screen.getByText("ACERVO COLETIVO")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Ferramentas" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Conteúdos" })).toBeInTheDocument();
  expect(screen.queryByText("FERRAMENTAS")).not.toBeInTheDocument();
  expect(screen.queryByText("CONTEÚDOS")).not.toBeInTheDocument();
});
