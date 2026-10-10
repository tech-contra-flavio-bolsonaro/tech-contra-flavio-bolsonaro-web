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
afterEach(() => { reduced = false; animations.length = 0; visibility = undefined; onReducedChange = undefined; vi.unstubAllGlobals(); document.body.innerHTML = ""; });

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
  expect(root.querySelectorAll(".home-hero-motion-letter")).toHaveLength(10);
  motion.dispose();
  expect(root.innerHTML).toBe(before);
});

it("keeps every finite entrance within the same 2200ms timeline and defers loops until it ends", () => {
  const root = fixture(); const motion = createHeroMotion(root);
  const options = vi.mocked(Element.prototype.animate).mock.calls.map(call => call[1] as KeyframeAnimationOptions);
  const finite = options.filter(option => option.iterations !== Infinity);
  const loops = options.filter(option => option.iterations === Infinity);
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
