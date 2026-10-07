import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Home from "./page";

it("keeps hero art decorative and outside the heading landmark", () => {
  const { container } = render(<Home />);

  expect(container.querySelector("[data-testid='hero-decoration']")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /ideias ganham movimento/i })).toBeInTheDocument();
  expect(container.querySelectorAll("[data-testid='hero-decoration'] img")).toHaveLength(6);
});
