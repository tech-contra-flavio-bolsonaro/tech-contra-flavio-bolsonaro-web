import { afterEach, expect, it, vi } from "vitest";
import { createHeroMotion } from "./home-hero-motion-runtime";
import { readFileSync } from "node:fs";
import { renderHeroArtwork } from "@/app/lib/hero-art";

const animations: { playState: string; pause: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> }[] = [];
let reduced = false;
let onReducedChange: (() => void) | undefined;
let visibility: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
function fixture() {
  document.body.innerHTML = `<section><div class="home-hero-copy"><h1 id="hero-title"><span>IDEIAS</span> <span>GANHAM</span> <span class="home-hero-title-accent">MOVIMENTO.</span></h1><p class="home-hero-description">Copy</p><div class="home-hero-actions"><a href="/manifesto">CTA</a></div></div><div class="home-hero-decoration">${renderHeroArtwork(readFileSync('public/images/hero-ideas-network.svg','utf8')).markup}</div></section>`;
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
  vi.stubGlobal("matchMedia", (query: string) => ({ get matches() { return query.includes("reduced-motion") ? reduced : false; }, addEventListener: vi.fn((_event, listener) => { if (query.includes("reduced-motion")) onReducedChange = listener; }), removeEventListener: vi.fn() }));
  vi.stubGlobal("IntersectionObserver", class { constructor(callback: typeof visibility) { visibility = callback; } observe() {} disconnect() {} });
  Element.prototype.animate = vi.fn(() => {
    const animation = { playState: "running", pause: vi.fn(function(this: {playState:string}) { this.playState = "paused"; }), play: vi.fn(function(this: {playState:string}) { this.playState = "running"; }), cancel: vi.fn(), finished: new Promise<Animation>(() => {}) };
    animations.push(animation); return animation as unknown as Animation;
  });
  return document.querySelector("section")!;
}
afterEach(() => { reduced = false; animations.length = 0; visibility = undefined; onReducedChange = undefined; vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = ""; });

it("keeps the complete static artwork and single semantic heading when reduced motion is requested", () => {
  reduced = true; const root = fixture(); const before = root.innerHTML;
  const motion = createHeroMotion(root);
  expect(animations).toHaveLength(0);
  expect(root.innerHTML).toBe(before);
  motion.dispose();
});

it("pauses animation offscreen and in hidden tabs, then cleans up on unmount", () => {
  const root = fixture(); const before = root.innerHTML;
  const motion = createHeroMotion(root);
  expect(animations.length).toBeGreaterThan(0);
  visibility!([{ isIntersecting: false }]); expect(animations.every(a => a.playState === "paused")).toBe(true);
  visibility!([{ isIntersecting: true }]);
  Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange"));
  expect(animations.every(a => a.playState === "paused")).toBe(true);
  motion.dispose();
  expect(animations.every(a => a.cancel.mock.calls.length === 1)).toBe(true);
  expect(root.innerHTML).toBe(before);
});


it("immediately restores the complete static hero when reduced motion changes at runtime", () => {
  const root = fixture(); const before = root.innerHTML;
  const motion = createHeroMotion(root);
  expect(root.querySelectorAll(".home-hero-motion-letter")).toHaveLength(10);
  reduced = true; onReducedChange!();
  expect(root.innerHTML).toBe(before);
  expect(animations.every(a => a.cancel.mock.calls.length === 1)).toBe(true);
  reduced = false; onReducedChange!();
  expect(root.querySelectorAll(".home-hero-motion-letter")).toHaveLength(0);
  motion.dispose();
  expect(root.innerHTML).toBe(before);
});

it("keeps every finite entrance within the same 2200ms timeline and defers loops until it ends", () => {
  const root = fixture(); const motion = createHeroMotion(root);
  const options = vi.mocked(Element.prototype.animate).mock.calls.map(call => call[1] as KeyframeAnimationOptions);
  const finite = options.filter(option => Number(option.delay) < 2200);
  const loops = options.filter(option => Number(option.delay) >= 2200);
  expect(Math.max(...finite.map(option => Number(option.duration) + Number(option.delay)))).toBeCloseTo(2200);
  expect(loops.length).toBe(16);
  expect(loops.every(option => Number(option.delay) >= 2200)).toBe(true);
  motion.dispose();
});

it("rolls back a partial enhancement if the animation API fails", () => {
  const root = fixture(); const before = root.innerHTML;
  vi.mocked(Element.prototype.animate).mockImplementationOnce(() => { throw new Error("unsupported animation"); });
  const motion = createHeroMotion(root);
  expect(root.innerHTML).toBe(before);
  motion.dispose();
  expect(root.innerHTML).toBe(before);
});

it("restores the approved title fade while leaving the SSR text complete", () => {
  const root = fixture();
  expect(root.querySelector("h1")).toHaveTextContent("IDEIAS GANHAM MOVIMENTO.");
  const words = [...root.querySelector("h1")!.children];
  const motion = createHeroMotion(root);
  const calls = vi.mocked(Element.prototype.animate).mock.calls;
  const targets = vi.mocked(Element.prototype.animate).mock.contexts;
  words.forEach(word => {
    const frames = calls[targets.indexOf(word)][0] as Keyframe[];
    expect(frames.map(frame => frame.opacity)).toEqual([0, 1, 1]);
  });
  motion.dispose();
  expect(root.querySelector("h1")).toHaveTextContent("IDEIAS GANHAM MOVIMENTO.");
  expect(root.querySelector("h1")!.getAnimations?.() ?? []).toHaveLength(0);
});

it("freezes the entrance and clock manually, then spends only the remaining budget", () => {
  vi.useFakeTimers();
  const root = fixture(); const before = root.innerHTML; const state = vi.fn();
  const motion = createHeroMotion(root, state);
  vi.advanceTimersByTime(1000); motion.togglePause();
  expect(state).toHaveBeenLastCalledWith("paused");
  expect(animations.every(a => a.playState === "paused")).toBe(true);
  vi.advanceTimersByTime(20000);
  expect(root.querySelectorAll(".home-hero-motion-letter")).toHaveLength(10);
  motion.togglePause();
  expect(state).toHaveBeenLastCalledWith("running");
  vi.advanceTimersByTime(6199);
  expect(root.querySelectorAll(".home-hero-motion-letter")).toHaveLength(10);
  vi.advanceTimersByTime(1);
  expect(root.innerHTML).toBe(before);
  expect(state).toHaveBeenLastCalledWith("completed");
  motion.togglePause();
  root.dispatchEvent(new Event("pointerdown"));
  expect(state).toHaveBeenLastCalledWith("completed");
  expect(animations.every(a => a.cancel.mock.calls.length === 1)).toBe(true);
  motion.dispose();
});

it("keeps the full five-second loop budget after the 2200ms entrance", () => {
  vi.useFakeTimers();
  const root = fixture(); const before = root.innerHTML;
  const motion = createHeroMotion(root);
  vi.advanceTimersByTime(2200 + 2400); motion.togglePause();
  vi.advanceTimersByTime(30000); motion.togglePause();
  vi.advanceTimersByTime(2599);
  expect(root.innerHTML).not.toBe(before);
  vi.advanceTimersByTime(1);
  expect(root.innerHTML).toBe(before);
  expect(vi.getTimerCount()).toBe(0);
  motion.dispose();
});

it("preserves manual pause through offscreen and hidden-tab changes", () => {
  vi.useFakeTimers();
  const root = fixture(); const before = root.innerHTML;
  const motion = createHeroMotion(root);
  vi.advanceTimersByTime(3000);
  visibility!([{ isIntersecting: false }]);
  vi.advanceTimersByTime(10000);
  motion.togglePause(); visibility!([{ isIntersecting: true }]);
  expect(animations.every(a => a.playState === "paused")).toBe(true);
  Object.defineProperty(document, "hidden", { configurable: true, value: true });
  document.dispatchEvent(new Event("visibilitychange"));
  motion.togglePause(); vi.advanceTimersByTime(10000);
  expect(animations.every(a => a.playState === "paused")).toBe(true);
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
  document.dispatchEvent(new Event("visibilitychange"));
  vi.advanceTimersByTime(4199); expect(root.innerHTML).not.toBe(before);
  vi.advanceTimersByTime(1); expect(root.innerHTML).toBe(before);
  motion.dispose();
});

it("has finite loop keyframes settling exactly at identity within the final budget", () => {
  const root = fixture(); const motion = createHeroMotion(root);
  const calls = vi.mocked(Element.prototype.animate).mock.calls;
  expect(calls.every(call => (call[1] as KeyframeAnimationOptions).iterations !== Infinity)).toBe(true);
  const loops = calls.filter(call => Number((call[1] as KeyframeAnimationOptions).delay) >= 2200);
  expect(loops).toHaveLength(16);
  loops.forEach(([frames, options]) => {
    expect(Number((options as KeyframeAnimationOptions).delay) + Number((options as KeyframeAnimationOptions).duration)).toBe(7200);
    expect((frames as Keyframe[]).at(-1)!.transform).toBe("none");
  });
  motion.dispose();
});

it("cleans timers on dispose and reduced motion without restarting completed motion", () => {
  vi.useFakeTimers();
  const root = fixture(); const before = root.innerHTML; const state = vi.fn();
  const motion = createHeroMotion(root, state);
  vi.advanceTimersByTime(1000); reduced = true; onReducedChange!();
  expect(root.innerHTML).toBe(before); expect(vi.getTimerCount()).toBe(0);
  expect(state).toHaveBeenLastCalledWith("unavailable");
  reduced = false; onReducedChange!();
  expect(root.innerHTML).toBe(before);
  motion.dispose(); expect(vi.getTimerCount()).toBe(0);
});

it("still reports completion if WAAPI effects finish before the deadline task runs", async () => {
  vi.useFakeTimers(); const root = fixture(); const before = root.innerHTML; const state = vi.fn();
  vi.mocked(Element.prototype.animate).mockImplementation(() => ({
    playState: "running", cancel: vi.fn(), pause: vi.fn(), play: vi.fn(), finished: Promise.resolve(),
  } as unknown as Animation));
  const motion = createHeroMotion(root, state);
  await Promise.resolve(); await Promise.resolve();
  vi.advanceTimersByTime(7200);
  expect(root.innerHTML).toBe(before);
  expect(state).toHaveBeenLastCalledWith("completed");
  motion.dispose();
});
