import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ToolCard } from "./tool-card";

it("loads an embeddable tool only after the visitor requests it", () => {
  render(
    <ToolCard
      tool={{
        id: "mapa",
        title: "Mapa",
        description: "Descubra caminhos.",
        category: "Planejamento",
        accessMode: "embed",
        url: "https://example.com",
        embedUrl: "https://example.com/embed",
      }}
    />,
  );

  expect(screen.getByTestId("tool-card-icon")).toBeInTheDocument();
  expect(screen.queryByTitle("Mapa")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Abrir aqui" }));

  expect(screen.getByTitle("Mapa")).toHaveAttribute(
    "src",
    "https://example.com/embed",
  );
});
