import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { SiteFooter } from "./site-footer";
const route = vi.hoisted(() => ({ pathname: "/conteudos" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
afterEach(() => { cleanup(); route.pathname = "/conteudos"; });

it.each(["/", "/manifesto", "/ferramentas", "/ferramentas/mapa-da-virada", "/enviar", "/conteudos"])("uses the complete Penpot footer on %s", (pathname) => {
  route.pathname = pathname;
  render(<SiteFooter />);
  expect(screen.getByRole("contentinfo")).toHaveClass("home-footer");
  for (const [name, href] of [["Manifesto", "/manifesto"], ["Ferramentas", "/ferramentas"], ["Conteúdos", "/conteudos"], ["Enviar conteúdo", "/enviar"]]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  }
  expect(screen.getByText("VIRA VOTO — IDEIAS EM MOVIMENTO.")).toBeInTheDocument();
  expect(screen.getByText("CONSTRUÍDO EM REDE. PARA VIRAR O JOGO.")).toBeInTheDocument();
  for (const [name, href] of [
    ["Instagram", "https://www.instagram.com/techcontrabolsonaro.dev"],
    ["X", "https://x.com/techcontra_dev"],
    ["TikTok", "https://www.tiktok.com/@techcontraflavio"],
    ["Kwai", "https://k.kwai.com/u/@techcontraflavio/BUOCAPC4"],
  ]) {
    const socialLink = screen.getByRole("link", { name });
    expect(socialLink).toHaveAttribute("href", href);
    expect(socialLink).toHaveAttribute("target", "_blank");
    expect(socialLink).toHaveAttribute("rel", "noopener noreferrer");
  }
  const kwaiIcon = screen.getByRole("link", { name: "Kwai" }).querySelector("svg");
  expect(kwaiIcon).toHaveClass("share-platform-icon-kwai");
  expect(kwaiIcon).toHaveAttribute("width", "21");
  expect(kwaiIcon).toHaveAttribute("height", "24");
  expect(screen.queryByRole("link", { name: "Voltar ao topo" })).not.toBeInTheDocument();
});

it.each(["/ferramentas/mapa-da-virada/embed", "/ferramentas-extra/mapa-da-virada"])("does not treat unrelated paths as tool details: %s", (pathname) => {
  route.pathname = pathname;
  render(<SiteFooter />);
  expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
});
