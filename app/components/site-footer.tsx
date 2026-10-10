"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

const VALID_PATHS = [
  "/",
  "/manifesto",
  "/ferramentas",
  "/enviar",
  "/conteudos",
  "/blog",
];

export function SiteFooter() {
  const pathname = usePathname();

  if (!VALID_PATHS.includes(pathname) && !pathname?.startsWith("/blog/")) return null;

  return (
    <footer className="site-footer home-footer">
      <div className="home-footer-main">
        <Link className="site-footer-brand" href="/">
          <Image
            src="/images/home-pixel-logo.svg"
            alt=""
            width={28}
            height={28}
            unoptimized
          />
          VIRA VOTO
        </Link>
        <nav aria-label="Navegação do rodapé">
          <Link href="/manifesto">Manifesto</Link>
          <Link href="/ferramentas">Ferramentas</Link>
          <Link href="/conteudos">Conteúdos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/enviar">Enviar conteúdo</Link>
        </nav>
      </div>
      {pathname?.startsWith("/blog/") ? <Link className="site-footer-top" href="#top"><span>Voltar ao topo</span><ArrowUp aria-hidden="true" /></Link> : null}
      <div className="home-footer-credits">
        <p>VIRA VOTO — IDEIAS EM MOVIMENTO.</p>
        <p>CONSTRUÍDO EM REDE. PARA VIRAR O JOGO.</p>
      </div>
    </footer>
  );
}
