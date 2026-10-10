"use client";

import { PressSurface } from "@/components/ui/press-surface";
import { HomeArrow } from "./home-arrow";
export function ManifestoSignLink() {
  return <a className="home-button home-button-white manifesto-sign-link" href="#assinar-manifesto" onClick={() => document.getElementById("assinar-manifesto")?.focus({ preventScroll: true })}><PressSurface>Assinar o manifesto <HomeArrow /></PressSurface></a>;
}
