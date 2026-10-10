import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { SiteFooter } from "./site-footer";
const route = vi.hoisted(() => ({ pathname: "/conteudos" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
afterEach(() => {
  cleanup();
  route.pathname = "/conteudos";
});

it.each([
  "/",
  "/manifesto",
  "/ferramentas",
  "/ferramentas/mapa-da-virada",
  "/enviar",
  "/conteudos",
])("uses the complete Penpot footer on %s", (pathname) => {
  route.pathname = pathname;
  render(<SiteFooter />);
  expect(screen.getByRole("contentinfo")).toHaveClass("home-footer");
  for (const [name, href] of [
    ["Manifesto", "/manifesto"],
    ["Ferramentas", "/ferramentas"],
    ["Conteúdos", "/conteudos"],
    ["Enviar conteúdo", "/enviar"],
  ]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  }
  expect(
    screen.getByText("VIRA VOTO — IDEIAS EM MOVIMENTO."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("CONSTRUÍDO EM REDE. PARA VIRAR O JOGO."),
  ).toBeInTheDocument();
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
  const kwaiIcon = screen
    .getByRole("link", { name: "Kwai" })
    .querySelector("svg");
  expect(kwaiIcon).toHaveClass("share-platform-icon-kwai");
  expect(kwaiIcon).toHaveAttribute("width", "21");
  expect(kwaiIcon).toHaveAttribute("height", "24");
  expect(
    screen.queryByRole("link", { name: "Voltar ao topo" }),
  ).not.toBeInTheDocument();
});

it("uses the Home footer and original logo on detail while preserving navigation", () => {
  render(<SiteFooter />);
  expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "href",
    "/blog",
  );
  cleanup();
  route.pathname = "/blog/1/acao";
  render(<SiteFooter />);
  expect(screen.getByRole("contentinfo")).toHaveClass("home-footer");
  expect(
    screen.getByRole("link", { name: "VIRA VOTO" }).querySelector("img"),
  ).toHaveAttribute("src", "/images/home-pixel-logo.svg");
  for (const href of [
    "/manifesto",
    "/ferramentas",
    "/conteudos",
    "/blog",
    "/enviar",
  ]) {
    expect(
      screen.getByRole("contentinfo").querySelector(`a[href="${href}"]`),
    ).not.toBeNull();
  }
  expect(screen.getByRole("link", { name: "Voltar ao topo" })).toHaveAttribute(
    "href",
    "#top",
  );
});

it("retains the compact footer on Blog listing", () => {
  route.pathname = "/blog";
  render(<SiteFooter />);
  expect(screen.getByRole("contentinfo")).toHaveClass("blog-footer");
});
