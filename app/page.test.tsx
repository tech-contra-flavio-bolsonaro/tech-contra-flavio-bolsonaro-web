import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Home from "./page";

it("uses the Streamline Pixel icons as decorative hero art", () => {
  const { container } = render(<Home />);

  expect(container.querySelector("[data-testid='hero-decoration']")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /ideias ganham movimento/i })).toBeInTheDocument();
  const heroIcons = Array.from(container.querySelectorAll("[data-testid='hero-decoration'] img"));

  expect(heroIcons).toHaveLength(6);
  expect(heroIcons.every((icon) => icon.getAttribute("src")?.includes("/icons/streamline-pixel/"))).toBe(true);
});
