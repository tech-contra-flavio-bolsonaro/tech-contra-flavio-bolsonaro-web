import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ShareButton } from "./share-button";

it("opens sharing actions in a dialog", async () => {

  render(<ShareButton title="Card" url="https://example.com/card" />);
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));

  expect(screen.getByRole("button", { name: "WhatsApp" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Abrir Instagram" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Copiar link" })).toBeInTheDocument();
});
