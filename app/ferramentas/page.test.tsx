import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import FerramentasPage from "./page";

vi.mock("next/navigation", () => ({ usePathname: () => "/ferramentas" }));

afterEach(cleanup);

it("shows the community tools launch page and its three upcoming categories", () => {
  render(<FerramentasPage />);

  expect(screen.getByRole("heading", { name: "O QUE AJUDA A AGIR." })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "RECURSOS DA COMUNIDADE" })).toBeInTheDocument();
  for (const title of ["Calculadoras", "Guias", "Formulários"]) {
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  }
  expect(screen.getAllByText("Em breve")).toHaveLength(3);
  expect(screen.getByRole("link", { name: /Sugerir uma ferramenta/ })).toHaveAttribute(
    "href",
    "/ferramentas/enviar",
  );
  expect(screen.getByRole("link", { name: "Ferramentas" })).toHaveAttribute("aria-current", "page");
});
