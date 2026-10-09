import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, expect, it } from "vitest";
import ManifestoPage from "./page";
afterEach(cleanup);
it("preserves the approved sections and accessible signature destination",()=>{
 render(<ManifestoPage />);
 for(const name of ["VIRAR É FAZER JUNTO.","IDEIA BOA NÃO FICA PARADA.","NINGUÉM VIRA O JOGO SOZINHO.","COMO QUEREMOS FAZER.","CLAREZA","AFETO","CORAGEM"]) expect(screen.getByRole("heading",{name})).toBeInTheDocument();
 expect(screen.getByRole("link",{name:/Assinar o manifesto/})).toHaveAttribute("href","#assinar-manifesto");
 expect(screen.getByRole("form",{name:/Assinatura do manifesto/})).toHaveAttribute("novalidate");
 expect(screen.getByRole("checkbox")).not.toBeChecked();
});

const canonical = readFileSync("app/manifesto/__fixtures__/issue-73.txt", "utf8");
const blocks = canonical.trim().split("\n\n");
const normalizeHtmlSpace = (text: string) => text.replace(/\s+/g, " ").trim();

it("renders the entire issue 73 text, punctuation and block order immediately after the hero", () => {
  const { container } = render(<ManifestoPage />);
  const sections = container.querySelectorAll("main > section");
  const reading = sections[1];
  expect(sections[0]).toHaveClass("manifesto-hero");
  expect(reading).toHaveAttribute("aria-labelledby", "manifesto-completo");
  const content = Array.from(reading.querySelectorAll("h2, h3, p"));
  expect(content.map(node => normalizeHtmlSpace(node.textContent ?? ""))).toEqual(
    [blocks[0], ...blocks.slice(1, 8), ...blocks.slice(8).flatMap(block => block.split("\n"))].map(normalizeHtmlSpace),
  );
  expect(normalizeHtmlSpace(content.map(node => node.textContent).join(" "))).toBe(normalizeHtmlSpace(canonical));
  expect(within(reading as HTMLElement).getAllByRole("heading", { level: 2 })).toHaveLength(1);
  expect(within(reading as HTMLElement).getAllByRole("heading", { level: 3 }).map(node => node.textContent)).toEqual(blocks.slice(8).map(block => block.split("\n")[0]));
  expect(reading.querySelectorAll(".manifesto-full-intro > p")).toHaveLength(7);
  expect(reading.querySelectorAll(".manifesto-full-demand > p")).toHaveLength(9);
  expect(reading.querySelector("svg, img")).toBeNull();
  expect(sections[sections.length - 1]).toHaveClass("manifesto-signature");
});

it("offers reading first, then signature, with focusable anchor destinations", () => {
  const { container } = render(<ManifestoPage />);
  const hero = container.querySelector(".manifesto-hero") as HTMLElement;
  const links = within(hero).getAllByRole("link");
  expect(links.map(link => link.textContent?.trim())).toEqual(["Leia o manifesto completo", "Assinar o manifesto"]);
  expect(links[0]).toHaveAttribute("href", "#manifesto-completo");
  const readingTitle = screen.getByRole("heading", { name: blocks[0], level: 2 });
  expect(readingTitle).toHaveAttribute("tabindex", "-1");
  fireEvent.click(links[0]);
  expect(readingTitle).toHaveFocus();
  fireEvent.click(links[1]);
  expect(screen.getByRole("heading", { name: "ASSINE O MANIFESTO." })).toHaveFocus();
});
