"use client";

import { HomeArrow } from "./home-arrow";

export function ManifestoReadLink() {
  return (
    <a
      className="home-button home-button-yellow manifesto-read-link"
      href="#manifesto-completo"
      onClick={() => document.getElementById("manifesto-completo")?.focus({ preventScroll: true })}
    >
      Leia o manifesto completo <HomeArrow />
    </a>
  );
}
