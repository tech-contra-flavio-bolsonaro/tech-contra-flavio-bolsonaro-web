"use client";

import { PressSurface } from "@/components/ui/press-surface";
import { HomeArrow } from "./home-arrow";

export function ManifestoReadLink() {
  return (
    <a
      className="home-button home-button-yellow manifesto-read-link"
      href="#manifesto-completo"
      onClick={() => document.getElementById("manifesto-completo")?.focus({ preventScroll: true })}
    ><PressSurface>
      Leia o manifesto completo <HomeArrow />
    </PressSurface></a>
  );
}
