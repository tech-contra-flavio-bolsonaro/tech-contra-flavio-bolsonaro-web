import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import NotFound from "./not-found";

vi.mock("next/navigation", () => ({ usePathname: () => "/missing-page" }));

afterEach(cleanup);

it("explains the missing page and offers clear navigation options", () => {
  render(<NotFound />);

  expect(
    screen.getByRole("heading", { name: "ESSA PÁGINA NÃO EXISTE." }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "O endereço pode estar incorreto ou a página pode ter mudado de lugar. Vamos encontrar outro caminho?",
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Voltar para o início/ }),
  ).toHaveAttribute("href", "/");
});
