const ENTRANCE_MS = 2200;
const LOOP_MS = 5000;
const TOTAL_MS = ENTRANCE_MS + LOOP_MS;
const SETTLE_MS = 500;
const SCALE = ENTRANCE_MS / 3600;
const SVG_NS = "http://www.w3.org/2000/svg";
const LAYERS = {
  frames: "e6b23f6e-cf88-5216-a29e-0e940224d73f",
  window: "bf61b08e-7d2f-5e8b-a5d0-17085d22aa28",
  sticker: "a6af453d-7e8d-5d7e-9fd5-96f53eb51962",
  star: "1fb29ff9-6ff1-592d-b006-0ed7c5b7e3a3",
  banner: "aec37adf-a376-5566-9c0a-d16719ef794f",
  cursor: "494ddca4-05af-5877-b109-b1039133397f",
  footer: "1420c214-833c-5348-b62d-453ff1a08336",
};
const REVEALS = [
  "f3133cab-98b6-57be-b343-4f04aa112f96", "83f9190a-7430-525d-b704-17d027a1244f", "2091ec2c-19dc-5793-8047-7120d560f506",
  "1b9fb1ff-a702-5670-b200-e0cc2f227a0b", "c042a21d-550e-5941-909e-d2acacc3b110", "fc411d58-da32-5b5e-a8b2-6ec3f924470f", "8c1ff2d8-1cf1-511c-a15a-9f63279be025",
];

export type HeroMotionState = "unavailable" | "running" | "paused" | "completed";

/** Optional enhancement: DOM is complete before this module is downloaded. */
export function createHeroMotion(root: HTMLElement, onState: (state: HeroMotionState) => void = () => {}) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const animations = new Set<Animation>();
  const restores: (() => void)[] = [];
  const pointers: SVGGElement[] = [];
  const ripples: SVGGElement[] = [];
  const waves = new Set<Animation>();
  let disposed = false;
  let completed = false;
  let started = false;
  let manualPause = false;
  let settling = false;
  let elapsed = 0;
  let runningSince: number | null = null;
  let clockTimer: ReturnType<typeof setTimeout> | undefined;
  let visible = true;
  let ready = false;
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let origin = document.timeline?.currentTime;
  const shouldPause = () => manualPause || reduced.matches || !visible || document.hidden;

  function clearClock() {
    if (clockTimer !== undefined) clearTimeout(clockTimer);
    clockTimer = undefined;
    runningSince = null;
  }
  function cancelMotion() {
    clearClock();
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    animations.forEach(animation => animation.cancel());
    animations.clear();
    waves.clear();
    restores.reverse().forEach(restore => restore());
    restores.length = 0;
    pointers.length = 0;
    ripples.length = 0;
    ready = false;
  }
  function syncPause() {
    if (disposed || completed || !started) return;
    const now = performance.now();
    if (runningSince !== null) elapsed += now - runningSince;
    clearClock();
    if (elapsed >= TOTAL_MS) {
      completed = true;
      cancelMotion();
      onState("completed");
      return;
    }
    if (!settling && elapsed >= TOTAL_MS - SETTLE_MS) settleInteractions();
    animations.forEach(animation => {
      if (shouldPause()) {
        if (animation.playState === "running" || animation.pending) animation.pause();
      } else if (animation.playState === "paused") animation.play();
    });
    if (shouldPause()) {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
    } else {
      runningSince = now;
      const boundary = settling ? TOTAL_MS : TOTAL_MS - SETTLE_MS;
      clockTimer = setTimeout(syncPause, Math.max(0, boundary - elapsed));
    }
  }
  function settleInteractions() {
    settling = true;
    ready = false;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    // Freeze the current interactive transforms before returning to the static art.
    const transforms = [...pointers, ...ripples].map(element => getComputedStyle(element).transform);
    waves.forEach(animation => { animations.delete(animation); animation.cancel(); });
    waves.clear();
    [...pointers, ...ripples].forEach((element, index) => {
      element.style.transform = "none";
      if (transforms[index] && transforms[index] !== "none") {
        animate(element, [{ transform: transforms[index] }, { transform: "none" }], {
          duration: TOTAL_MS - elapsed, easing: "ease-out",
        }, false);
      }
    });
  }
  // The last 500ms of the loop budget gently settle all idle layers to identity.
  function finiteLoop(framesAt: (time: number, envelope: number) => Keyframe, delay = 0) {
    const duration = LOOP_MS - delay;
    return Array.from({ length: 101 }, (_, step) => {
      const time = duration * step / 100;
      const remaining = LOOP_MS - delay - time;
      const progress = Math.max(0, Math.min(1, remaining / SETTLE_MS));
      const envelope = progress * progress * (3 - 2 * progress);
      return step === 100 ? { transform: "none" } : framesAt(time, envelope);
    });
  }
  function animate(element: Element, frames: Keyframe[], options: KeyframeAnimationOptions, shared = true) {
    const animation = element.animate(frames, options);
    if (shared && origin != null) animation.startTime = origin;
    animations.add(animation);
    if (shouldPause()) animation.pause();
    // Release finished entrance effects; the original artwork is the final state.
    if (options.iterations !== Infinity) animation.finished.then(() => {
      if (!disposed && animations.delete(animation)) animation.cancel();
    }).catch(() => {});
    return animation;
  }
  function wrap(element: Element) {
    const group = document.createElementNS(SVG_NS, "g");
    group.style.transformBox = "fill-box";
    group.style.transformOrigin = "center";
    element.replaceWith(group);
    group.append(element);
    restores.push(() => group.replaceWith(element));
    return group;
  }
  function enter(element: Element, delay: number, x: number, y: number) {
    return animate(element, [
      { opacity: 0, transform: `translate(${x}px, ${y}px) scale(.88)` },
      { opacity: 1, transform: "translate(0, -5px) scale(1.025)", offset: .72 },
      { opacity: 1, transform: "none" },
    ], { duration: 650 * SCALE, delay: delay * SCALE, easing: "cubic-bezier(.2,.75,.25,1)", fill: "backwards" });
  }
  function start() {
    if (disposed || completed || reduced.matches || typeof Element.prototype.animate !== "function") return;
    const svg = root.querySelector(".home-hero-art");
    const heading = root.querySelector("h1");
    if (!svg || !heading) return;
    origin = document.timeline?.currentTime;
    try {
      const groups = {} as Record<keyof typeof LAYERS, SVGGElement>;
      for (const [name, id] of Object.entries(LAYERS)) {
        const shape = svg.querySelector(`[id="shape-${id}"]`);
        if (!shape) throw new Error("Incomplete original hero artwork");
        groups[name as keyof typeof LAYERS] = wrap(shape);
      }
      enter(groups.window, 0, 0, 48);
      REVEALS.forEach((id, index) => {
        const shape = svg.querySelector(`[id="shape-${id}"]`);
        if (shape) animate(wrap(shape), [{ opacity: 0, transform: "translate(-14px, 0)" }, { opacity: 1, transform: "none" }], { duration: 480 * SCALE, delay: (480 + index * 210) * SCALE, fill: "backwards", easing: "ease-out" });
      });
      enter(groups.frames, 850, 0, 28);
      enter(groups.sticker, 1800, -35, 0);
      enter(groups.star, 2080, 0, -28);
      enter(groups.banner, 2540, 0, -55);
      enter(groups.footer, 2940, -18, 0);
      const lastEntrance = animate(groups.cursor, [
        { opacity: 0, transform: "translate(-135px,-85px)" },
        { opacity: 1, transform: "translate(-100px,-70px)", offset: .3 },
        { transform: "translate(-55px,-25px)", offset: .7 }, { opacity: 1, transform: "none" },
      ], { duration: 760 * SCALE, delay: 2840 * SCALE, fill: "backwards", easing: "ease-in-out" });
      lastEntrance.finished.then(() => { if (!disposed && !completed && !settling && !reduced.matches) ready = true; }).catch(() => {});
      const floatNames = ["window", "sticker", "star", "banner", "cursor", "footer"] as const;
      floatNames.forEach((name, index) => {
        // Separate transforms compose without altering the original shape attributes.
        const pointer = wrap(groups[name]);
        const idle = wrap(groups[name]);
        const ripple = wrap(groups[name]);
        pointers.push(pointer);
        ripples.push(ripple);
        const x = [3, -6, 7, -3, 4, -2][index];
        const y = [4, -7, -9, 6, -5, 2][index];
        const frames = finiteLoop((time, envelope) => {
          const t = time / (2900 + index * 380) * Math.PI * 2;
          const dx = x * (.8 * Math.sin(t) + .16 * Math.sin(2 * t));
          const dy = y * (.55 * (1 - Math.cos(t)) + .18 * Math.sin(t));
          const rotation = (index % 2 ? -1 : 1) * (1.15 * Math.sin(t) + .22 * Math.sin(2 * t));
          return { transform: `translate(${dx * envelope}px,${dy * envelope}px) rotate(${rotation * envelope}deg)` };
        });
        animate(idle, frames, { duration: LOOP_MS, delay: ENTRANCE_MS, easing: "linear" });
      });
      const words = [...heading.children];
      words.forEach((word, index) => animate(word, [
        { opacity: 0, transform: `translate(${index === 2 ? -42 : -24}px,${index === 2 ? 14 : 9}px)` },
        { opacity: 1, transform: `translate(${index === 2 ? 7 : 2}px,-2px)`, offset: .74 }, { opacity: 1, transform: "none" },
      ], { duration: (index === 2 ? 1600 : 850) * SCALE, delay: [100, 1000, 2000][index] * SCALE, fill: "backwards", easing: "cubic-bezier(.2,.75,.25,1)" }));
      root.querySelectorAll(".home-hero-description,.home-hero-actions").forEach(element => animate(element, [{ transform: "translateY(12px)" }, { transform: "none" }], { duration: 600 * SCALE, delay: 3000 * SCALE, fill: "backwards", easing: "ease-out" }));
      const accent = heading.querySelector(".home-hero-title-accent");
      if (accent && accent.firstChild?.nodeType === Node.TEXT_NODE) {
        const text = accent.textContent!;
        const originalNodes = [...accent.childNodes];
        const previousLabel = heading.getAttribute("aria-label");
        heading.setAttribute("aria-label", heading.textContent!.replace(/\s+/g, " ").trim());
        restores.push(() => {
          accent.replaceChildren(...originalNodes);
          if (previousLabel === null) heading.removeAttribute("aria-label");
          else heading.setAttribute("aria-label", previousLabel);
        });
        // Measure all glyph advances before writing; preserve kerning and the line width.
        const range = document.createRange();
        const positions = Array.from(text, (_, index) => {
          range.setStart(originalNodes[0], index);
          range.setEnd(originalNodes[0], index + 1);
          return typeof range.getBoundingClientRect === "function" ? range.getBoundingClientRect() : null;
        });
        const fontSize = parseFloat(getComputedStyle(accent).fontSize);
        const letters = Array.from(text, (letter, index) => {
          const span = document.createElement("span");
          span.className = "home-hero-motion-letter";
          span.setAttribute("aria-hidden", "true");
          span.textContent = letter;
          const position = positions[index];
          if (position && fontSize > 0) span.style.width = `${((positions[index + 1]?.left ?? position.right) - position.left) / fontSize}em`;
          return span;
        });
        accent.replaceChildren(...letters);
        letters.forEach((letter, index) => animate(letter, finiteLoop((time, envelope) => {
          const t = time / 2800 * Math.PI * 2;
          const lift = (1 - Math.cos(t)) / 2;
          return { transform: `translateY(${- .055 * lift * envelope}em) rotate(${- .9 * Math.sin(t) * lift * envelope}deg)` };
        }, index * 100), { duration: LOOP_MS - index * 100, delay: ENTRANCE_MS + index * 100, easing: "linear" }));
      }
      started = true;
      onState("running");
      syncPause();
    } catch {
      completed = true;
      cancelMotion();
      onState("unavailable"); // Every partial enhancement rolls back to the complete SSR art.
    }
  }
  function pointerMove(event: PointerEvent) {
    if (completed || settling || !ready || shouldPause() || !finePointer.matches || event.pointerType === "touch") return;
    const bounds = root.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (completed || settling || shouldPause()) return;
      pointers.forEach((pointer, index) => { pointer.style.transform = `translate(${pointerX * (index + 1) * 1.1}px,${pointerY * (index + 1) * .8}px)`; });
    });
  }
  function pointerLeave() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (!completed && !settling && !shouldPause()) pointers.forEach(pointer => { pointer.style.transform = "none"; });
  }
  function wave(event: Event) {
    if (completed || settling || !ready || shouldPause() || waves.size || (event.target instanceof Element && event.target.closest("a,button,input,textarea,select"))) return;
    ripples.forEach((ripple, index) => {
      const animation = animate(ripple, [{ transform: "none" }, { transform: `translateY(${index % 2 ? -14 : 12}px) rotate(${index % 2 ? -2 : 2}deg)`, offset: .45 }, { transform: "none" }], { duration: 800, delay: index * 85, easing: "ease-in-out" }, false);
      waves.add(animation);
      animation.finished.then(() => waves.delete(animation)).catch(() => waves.delete(animation));
    });
  }
  function onReducedChange() {
    if (!reduced.matches) return;
    completed = true;
    cancelMotion();
    onState("unavailable");
  }
  const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); syncPause(); }) : null;
  observer?.observe(root);
  reduced.addEventListener("change", onReducedChange);
  document.addEventListener("visibilitychange", syncPause);
  root.addEventListener("pointermove", pointerMove, { passive: true });
  root.addEventListener("pointerleave", pointerLeave, { passive: true });
  root.addEventListener("pointerdown", wave, { passive: true });
  root.addEventListener("focusin", wave);
  if (reduced.matches) completed = true;
  start();
  return {
    togglePause() {
      if (disposed || completed || reduced.matches || !started) return;
      manualPause = !manualPause;
      syncPause();
      if (!completed) onState(manualPause ? "paused" : "running");
    },
    dispose() {
      disposed = true;
      observer?.disconnect();
      reduced.removeEventListener("change", onReducedChange);
      document.removeEventListener("visibilitychange", syncPause);
      root.removeEventListener("pointermove", pointerMove);
      root.removeEventListener("pointerleave", pointerLeave);
      root.removeEventListener("pointerdown", wave);
      root.removeEventListener("focusin", wave);
      cancelMotion();
    },
  };
}
