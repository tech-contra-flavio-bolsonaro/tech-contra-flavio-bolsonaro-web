import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { HomeHeroMotion } from "./home-hero-motion";
import type { HeroMotionState } from "./home-hero-motion-runtime";

const runtime = vi.hoisted(() => ({ togglePause: vi.fn(), dispose: vi.fn(), state: undefined as undefined | ((state: HeroMotionState) => void) }));
vi.mock("./home-hero-motion-runtime", () => ({
  createHeroMotion: vi.fn((_root, state) => { runtime.state = state; state("running"); return runtime; }),
}));
function setup(reduced = false) {
  vi.stubGlobal("matchMedia", () => ({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  Element.prototype.animate = vi.fn();
  Object.defineProperty(document, "fonts", { configurable: true, value: { ready: Promise.resolve() } });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { callback(0); return 1; });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal("requestIdleCallback", (callback: () => void) => { callback(); return 1; });
  vi.stubGlobal("cancelIdleCallback", vi.fn());
  return render(<HomeHeroMotion><h1 id="hero-title">IDEIAS GANHAM MOVIMENTO.</h1></HomeHeroMotion>);
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.clearAllMocks(); runtime.state = undefined; });
it("offers a native accessible pause control and an honest disabled completion state", async () => {
  setup();
  const button = await screen.findByRole("button", { name: "Pausar animação" });
  expect(button.tagName).toBe("BUTTON");
  fireEvent.click(button); expect(runtime.togglePause).toHaveBeenCalledOnce();
  act(() => runtime.state!("paused"));
  expect(screen.getByRole("button", { name: "Retomar animação" })).toBe(button);
  fireEvent.click(button); expect(runtime.togglePause).toHaveBeenCalledTimes(2);
  act(() => runtime.state!("completed"));
  expect(screen.getByRole("button", { name: "Animação concluída" })).toBeDisabled();
  expect(screen.queryByRole("button", { name: /Retomar|Replay/ })).not.toBeInTheDocument();
});
it("starts reduced motion static with no misleading controls", async () => {
  setup(true);
  await waitFor(() => expect(screen.getByRole("heading")).toHaveTextContent("IDEIAS GANHAM MOVIMENTO."));
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(runtime.state).toBeUndefined();
});
it("removes unavailable controls and disposes the runtime on unmount", async () => {
  const view = setup(); await screen.findByRole("button", { name: "Pausar animação" });
  act(() => runtime.state!("unavailable"));
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  view.unmount(); expect(runtime.dispose).toHaveBeenCalledOnce();
});
