"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Keep the server-rendered content usable; load optional motion during idle time. */
export function HomeHeroMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia || typeof Element.prototype.animate !== "function") return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let requested = false;
    let frame = 0;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let motion: { dispose(): void } | undefined;
    function schedule() {
      if (disposed || requested || reduced.matches) return;
      requested = true;
      frame = requestAnimationFrame(() => {
        const enhance = async () => {
          try {
            // The title and the SVG's original Latin faces must be ready before
            // measuring glyph advances. No fallback text is split or hidden.
            await document.fonts.ready;
            if (disposed) return;
            const { createHeroMotion } = await import("./home-hero-motion-runtime");
            if (!disposed) motion = createHeroMotion(root!);
          } catch {
            // Network/API failure leaves the complete server-rendered hero intact.
          }
        };
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(enhance, { timeout: 2000 });
        else timer = setTimeout(enhance, 100);
      });
    }
    reduced.addEventListener("change", schedule);
    schedule();
    return () => {
      disposed = true;
      reduced.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
      motion?.dispose();
    };
  }, []);
  return <section ref={ref} className="home-hero" id="inicio" aria-labelledby="hero-title">{children}</section>;
}
