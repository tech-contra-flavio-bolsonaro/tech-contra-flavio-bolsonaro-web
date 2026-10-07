import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import EnviarPage from "./page";

it("offers an enabled action to send content for curation", () => {
  render(<EnviarPage />);

  expect(
    screen.getByRole("button", { name: "Enviar para curadoria" }),
  ).toBeEnabled();
});
