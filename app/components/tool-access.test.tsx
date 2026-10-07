import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ToolAccess } from "./tool-access";

const props = { slug: "mapa", title: "Mapa", url: "https://example.com", canEmbed: true };
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("rechecks approval on click before loading a sandboxed iframe", async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ embedUrl: "https://example.com/embed" }) });
  vi.stubGlobal("fetch", fetch);
  render(<ToolAccess {...props} />);
  expect(screen.queryByTitle("Mapa")).not.toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Abrir ferramenta aqui" }));
  const frame = await screen.findByTitle("Mapa");
  expect(frame).toHaveAttribute("src", "https://example.com/embed");
  expect(frame.getAttribute("sandbox")).not.toContain("allow-same-origin");
  expect(screen.getByRole("link")).toHaveAttribute("href", props.url);
});

it.each([null, "javascript:alert(1)"])("keeps external access if embedding is revoked or unsafe (%s)", async (embedUrl) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ embedUrl }) }));
  render(<ToolAccess {...props} />);
  fireEvent.click(screen.getByRole("button"));
  expect(await screen.findByRole("status")).toHaveTextContent("link externo");
  expect(screen.queryByTitle("Mapa")).not.toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", props.url);
});

it("offers a retry and an external link on network failure", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  render(<ToolAccess {...props} />);
  fireEvent.click(screen.getByRole("button"));
  expect(await screen.findByRole("status")).toHaveTextContent("Tente novamente");
  expect(screen.getByRole("button")).toBeEnabled();
  expect(screen.getByRole("link")).toHaveAttribute("href", props.url);
});
