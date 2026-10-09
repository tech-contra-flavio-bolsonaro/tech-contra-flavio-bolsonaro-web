import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { SiteFooter } from "./site-footer";

it("renders a shared accessible footer with a return-to-top control", () => {
  render(<SiteFooter />);

  expect(screen.getByRole("contentinfo")).toHaveClass("site-footer");
  expect(screen.getByRole("link", { name: "VIRA VOTO" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Voltar ao topo" })).toHaveAttribute("href", "#top");
});
