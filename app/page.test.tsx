import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("server-only", () => ({}));

vi.mock("@/app/components/home-blog", () => ({ HomeBlog: () => <section aria-labelledby="blog-title"><h2 id="blog-title">Blog</h2></section>, HomeBlogLoading: () => null }));

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
  const art = decoration?.querySelector("svg");
  expect(art).toHaveAttribute("viewBox", "-5 0 471.116 520");
  expect(art?.querySelectorAll("text").length).toBeGreaterThan(0);
  expect(art?.querySelector("style")?.textContent).not.toContain("data:font");
  expect(decoration?.querySelectorAll("img")).toHaveLength(0);
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

it("places the manifesto CTA in the hero and the hub CTA in the coral band", () => {
 render(<Home />);
 const manifesto = screen.getByRole("link", { name: /Leia e assine o manifesto/ });
 expect(manifesto).toHaveAttribute("href", "/manifesto");
 expect(manifesto.closest(".home-hero")).not.toBeNull();
 const hub = screen.getByRole("link", { name: /Conheça nosso hub/ });
 expect(hub).toHaveAttribute("href", "/ferramentas");
 expect(hub.closest(".home-manifesto")).toHaveTextContent("NOSSO HUB");
 expect(hub.closest(".home-manifesto")).toHaveTextContent("A democracia também se constrói em rede.");
});

it("places Blog between Ferramentas and Conteúdos before the final CTA", () => {
 const { container } = render(<Home />);
 const sections = [...container.querySelectorAll("main > section")].map(section => section.getAttribute("aria-labelledby"));
 expect(sections).toEqual(["hero-title", "manifesto-title", "tools-title", "blog-title", "content-title", "submit-title"]);
});


it("ships complete usable hero content without prototype or motion controls", () => {
  const { container } = render(<Home />);
  const hero = container.querySelector(".home-hero")!;
  expect(hero.querySelectorAll("button")).toHaveLength(0);
  expect(hero.querySelectorAll("h1")).toHaveLength(1);
  expect(hero.querySelector("h1")).toHaveTextContent("IDEIAS GANHAM MOVIMENTO.");
  expect(hero.querySelector(".home-hero-motion-letter")).toBeNull();
  expect(hero).not.toHaveTextContent(/Replay|Pausar|Variante/);
});
