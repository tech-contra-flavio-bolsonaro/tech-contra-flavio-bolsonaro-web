import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import NotFound from "./not-found";
import ErrorState from "./error";
import { BlogUnavailable } from "@/app/components/blog-status";
const refresh = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/app/components/site-nav", () => ({ SiteNav: () => <nav>Menu</nav> }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
it("preserves the missing article destination with Home SVG", () => {
  render(<NotFound />);
  const back = screen.getByRole("link", { name: "Voltar para o Blog" });
  expect(back).toHaveAttribute("href", "/blog");
  expect(back).toHaveClass("home-button");
  expect(back.querySelector("svg.home-arrow")).not.toBeNull();
});
it("preserves unexpected error retry using the Home Button", () => {
  const retry = vi.fn();
  render(<ErrorState retry={retry} />);
  const button = screen.getByRole("button", { name: "Tentar novamente" });
  expect(button).toHaveClass("home-button");
  fireEvent.click(button);
  expect(retry).toHaveBeenCalledOnce();
});
it("uses Home retry on listing and detail while refreshing the route", () => {
  render(<BlogUnavailable reason="timeout" />);
  expect(screen.getByRole("button", { name: "Tentar novamente" })).toHaveClass("home-button");
  cleanup();
  render(<BlogUnavailable reason="timeout" detail />);
  const button = screen.getByRole("button", { name: "Tentar novamente" });
  expect(button).toHaveClass("home-button");
  fireEvent.click(button);
  expect(refresh).toHaveBeenCalledOnce();
});
