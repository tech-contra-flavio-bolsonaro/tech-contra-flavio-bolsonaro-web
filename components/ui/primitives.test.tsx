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
