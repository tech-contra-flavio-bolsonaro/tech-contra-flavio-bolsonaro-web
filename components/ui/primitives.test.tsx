import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

describe("interface primitives", () => {
  it("renders the primary action with the Figma hard-border treatment", () => {
    render(<Button>Enviar conteúdo</Button>);

    const button = screen.getByRole("button", { name: "Enviar conteúdo" });
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button.className).toContain("border-[3px]");
    expect(button.className).toContain("shadow-[7px_7px_0px_0px_black]");
  });

  it("supports reusable card color intentions", () => {
    render(<Card tone="yellow">Mapa de ações</Card>);

    const card = screen.getByText("Mapa de ações");
    expect(card).toHaveAttribute("data-tone", "yellow");
    expect(card.className).toContain("rounded-[8px]");
    expect(card.className).toContain("shadow-[7px_7px_0px_0px_black]");
  });

  it("keeps field validity visible to assistive technology", () => {
    render(<Input aria-invalid="true" aria-label="Título" />);

    expect(screen.getByLabelText("Título")).toHaveAttribute("aria-invalid", "true");
  });
});

it("keeps the primitive ref and native disabled semantics on the stable outer button", () => {
  let control: HTMLButtonElement | null = null;
  render(<Button ref={(node) => { control = node; }} disabled type="submit" aria-label="Confirmar">Confirmar</Button>);
  const button = screen.getByRole("button", { name: "Confirmar" });
  expect(control).toBe(button);
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("type", "submit");
  expect(button.querySelector("[data-press-content]")).toHaveTextContent("Confirmar");
  expect(button.querySelectorAll("button")).toHaveLength(0);
});

it("preserves BaseUI anchor rendering and names without nesting interactive controls", () => {
  render(<Button nativeButton={false} render={<a href="#destino" />}>Abrir destino</Button>);
  const anchor = screen.getByRole("button", { name: "Abrir destino" });
  expect(anchor.tagName).toBe("A");
  expect(anchor).toHaveAttribute("href", "#destino");
  expect(anchor.querySelector("[data-press-content]")).toHaveTextContent("Abrir destino");
});

it("keeps editorial link and ghost variants outside the 3D surface recipe", () => {
  render(<><Button variant="link">Editorial</Button><Button variant="ghost">Fechar</Button></>);
  for (const name of ["Editorial", "Fechar"]) {
    expect(screen.getByRole("button", { name })).not.toHaveAttribute("data-press");
    expect(screen.getByRole("button", { name }).querySelector("[data-press-content]")).toBeNull();
  }
});
