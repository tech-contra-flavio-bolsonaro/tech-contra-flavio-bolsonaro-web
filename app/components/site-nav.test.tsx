import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SiteNav } from "./site-nav";

const route = vi.hoisted(() => ({ pathname: "/manifesto" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

afterEach(() => {
  cleanup();
  route.pathname = "/manifesto";
});

it("keeps the brand and a closed menu toggle on a single header row", () => {
  render(<SiteNav />);

  const toggle = screen.getByRole("button", { name: /menu/i });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(toggle).toHaveAttribute("aria-controls", "site-nav-links");
  expect(screen.getByRole("link", { name: "VIRA VOTO" })).toHaveAttribute("href", "/");
  expect(document.getElementById("site-nav-links")).toHaveAttribute("data-open", "false");
});

it("opens and closes the link panel from the toggle", () => {
  render(<SiteNav />);
  const toggle = screen.getByRole("button", { name: /menu/i });

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(document.getElementById("site-nav-links")).toHaveAttribute("data-open", "true");

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "false");
});

it("closes the panel on Escape and returns focus to the toggle", () => {
  render(<SiteNav />);
  const toggle = screen.getByRole("button", { name: /menu/i });

  fireEvent.click(toggle);
  fireEvent.keyDown(document, { key: "Escape" });

  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(toggle).toHaveFocus();
});

it("closes the panel when a link is chosen or the page outside is tapped", () => {
  render(<SiteNav />);
  const toggle = screen.getByRole("button", { name: /menu/i });

  fireEvent.click(toggle);
  fireEvent.click(screen.getByRole("link", { name: "Ferramentas" }));
  expect(toggle).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(toggle);
  fireEvent.pointerDown(document.body);
  expect(toggle).toHaveAttribute("aria-expanded", "false");
});

it("lists every destination, marks the current page and highlights the send action", () => {
  render(<SiteNav />);

  for (const name of ["Manifesto", "Ferramentas", "Conteúdos", "Enviar conteúdo"]) {
    expect(screen.getByRole("link", { name })).toBeInTheDocument();
  }
  expect(screen.getByRole("link", { name: "Manifesto" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Ferramentas" })).not.toHaveAttribute("aria-current");
  expect(screen.getByRole("link", { name: "Enviar conteúdo" })).toHaveClass("site-nav-cta");
});

it("marks Ferramentas current on a tool detail route", () => {
  route.pathname = "/ferramentas/virada-no-bairro";
  render(<SiteNav variant="home" />);

  expect(screen.getByRole("link", { name: "Ferramentas" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "VIRA VOTO" })).toHaveAttribute("href", "/");
  
});
  
it("exposes Blog alongside existing destinations", () => {
  render(<SiteNav />);
  expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "href",
    "/blog",
  );
});
