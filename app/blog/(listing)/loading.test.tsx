import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Loading from "./loading";

vi.mock("next/navigation", () => ({ usePathname: () => "/blog" }));

afterEach(cleanup);

// The fallback is streamed before the real page, so an h1 here becomes the first
// h1 crawlers read and leaves /blog with two (issue #103).
it("announces loading without taking the page h1", () => {
  render(<Loading />);

  expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Carregando artigos…");
});
