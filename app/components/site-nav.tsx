"use client";

import { PressSurface } from "@/components/ui/press-surface";
import Link from "next/link";
import Image from "next/image";
import { HomeArrow } from "./home-arrow";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  ["/manifesto", "Manifesto"],
  ["/ferramentas", "Ferramentas"],
  ["/conteudos", "Conteúdos"],
  ["/blog", "Blog"],
] as const;

export function SiteNav({ variant = "default" }: { variant?: "default" | "home" }) {
  const [isOpen, setIsOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggle.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);
  const current = (href: string) =>
    pathname === href || (href === "/ferramentas" && pathname?.startsWith(`${href}/`) || (href === "/blog" && pathname?.startsWith("/blog/")))
      ? "page"
      : undefined;

  return (
    <header className="site-header" ref={header}>
      <Link className="site-header-brand" href="/" onClick={close}>{variant === "home" ? <Image src="/images/home-pixel-logo.svg" alt="" width={36} height={36} unoptimized /> : null}VIRA VOTO</Link>
      <button
        ref={toggle}
        className="site-nav-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="site-nav-links"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        Menu
      </button>
      <nav id="site-nav-links" className="site-nav" aria-label="Navegação principal" data-open={isOpen}>
        {links.map(([href, label]) => <Link href={href} key={href} aria-current={current(href)} onClick={close}>{label}</Link>)}
        <Link className="site-nav-cta" href="/enviar" aria-current={current("/enviar")} onClick={close}><PressSurface>Enviar conteúdo{variant === "home" ? <HomeArrow /> : null}</PressSurface></Link>
      </nav>
    </header>
  );
}
