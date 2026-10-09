"use client";
import { HomeArrow } from "./home-arrow";
export function ManifestoSignLink() {
  return <a className="home-button home-button-white manifesto-sign-link" href="#assinar-manifesto" onClick={() => document.getElementById("assinar-manifesto")?.focus({ preventScroll: true })}>Assinar o manifesto <HomeArrow /></a>;
}
