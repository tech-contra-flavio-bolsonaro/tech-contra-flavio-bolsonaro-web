import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import EnviarPage from "./page";

it("offers an enabled action to send content for curation", () => {
  render(<EnviarPage />);

  expect(screen.getByTestId("submission-form-surface")).toBeInTheDocument();
  expect(screen.getByLabelText("Título *")).toHaveAttribute("name", "title");
  expect(screen.getByLabelText("Descrição *")).toHaveAttribute("name", "description");
  expect(
    screen.getByRole("button", { name: "Enviar para curadoria" }),
  ).toBeEnabled();
});
