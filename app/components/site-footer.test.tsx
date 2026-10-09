import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { SiteFooter } from "./site-footer";
const route = vi.hoisted(() => ({ pathname: "/conteudos" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
afterEach(() => { cleanup(); route.pathname = "/conteudos"; });

it("renders a shared accessible footer with a return-to-top control", () => {
  route.pathname = "/ferramentas";
  render(<SiteFooter />);

  expect(screen.getByRole("contentinfo")).toHaveClass("site-footer");
  expect(screen.getByRole("link", { name: "VIRA VOTO" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Voltar ao topo" })).toHaveAttribute("href", "#top");
});

it.each(["/", "/manifesto", "/enviar", "/conteudos"])("uses the complete Penpot footer on %s", (pathname) => {
  route.pathname = pathname;
  render(<SiteFooter />);
  expect(screen.getByRole("contentinfo")).toHaveClass("home-footer");
  for (const [name, href] of [["Manifesto", "/manifesto"], ["Ferramentas", "/ferramentas"], ["Conteúdos", "/conteudos"], ["Enviar conteúdo", "/enviar"]]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  }
  expect(screen.getByText("VIRA VOTO — IDEIAS EM MOVIMENTO.")).toBeInTheDocument();
  expect(screen.getByText("CONSTRUÍDO EM REDE. PARA VIRAR O JOGO.")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Voltar ao topo" })).not.toBeInTheDocument();
});
