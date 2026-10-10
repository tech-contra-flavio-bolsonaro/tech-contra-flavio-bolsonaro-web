"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SharePlatformIcon, type SharePlatform } from "./share-platform-icon";
import { ArrowUp } from "lucide-react";

const VALID_PATHS = [
  "/",
  "/manifesto",
  "/ferramentas",
  "/enviar",
  "/conteudos",
  "/blog",
];

const SOCIAL_MEDIA_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/techcontrabolsonaro.dev",
    platform: "instagram",
  },
  { name: "X", href: "https://x.com/techcontra_dev", platform: "x" },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@techcontraflavio",
    platform: "tiktok",
  },
  {
    name: "Kwai",
    href: "https://k.kwai.com/u/@techcontraflavio/BUOCAPC4",
    platform: "kwai",
  },
] satisfies { name: string; href: string; platform: SharePlatform }[];

export function SiteFooter() {
  const pathname = usePathname();

  if (
    !VALID_PATHS.includes(pathname) &&
    !pathname?.startsWith("/blog/") &&
    !pathname?.startsWith("/ferramentas/")
  )
    return null;

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
          TECH CONTRA BOLSONARO
        </Link>
        <nav aria-label="Navegação do rodapé">
          <Link href="/manifesto">Manifesto</Link>
          <Link href="/ferramentas">Ferramentas</Link>
          <Link href="/conteudos">Conteúdos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/enviar">Enviar conteúdo</Link>
        </nav>
      </div>
      {pathname?.startsWith("/blog/") ? (
        <Link className="site-footer-top" href="#top">
          <span>Voltar ao topo</span>
          <ArrowUp aria-hidden="true" />
        </Link>
      ) : null}

      <div className="flex justify-between flex-wrap flex-col items-center gap-4 md:flex-row md:items-end">
        <div className="home-footer-credits">
          <p>TECH CONTRA BOLSONARO — IDEIAS EM MOVIMENTO.</p>
          <p>CONSTRUÍDO EM REDE. PARA VIRAR O JOGO.</p>
        </div>

        <div className="home-footer-social">
          {SOCIAL_MEDIA_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
            >
              <SharePlatformIcon platform={link.platform} />
              <span className="sr-only">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
