import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";
import { ToolFeed } from "@/app/components/tool-feed";
import { ContentFeed } from "@/app/components/content-feed";

export default function Home() {
  return (
    <main>
      <SiteNav />
      <section id="inicio" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p>UM HUB PARA QUEM QUER VIRAR O JOGO</p>
          <h1 id="hero-title">IDEIAS GANHAM <span>MOVIMENTO.</span></h1>
          <Link href="/ferramentas">Conhecer o hub ↓</Link>
        </div>
        <div data-testid="hero-decoration" className="hero-decoration" aria-hidden="true">
          <Image className="hero-icon hero-icon-computer" src="/icons/streamline-pixel/computers-devices-electronics/computers-devices-electronics-vintage-mac.svg" alt="" width={256} height={256} />
          <Image className="hero-icon hero-icon-keyboard" src="/icons/streamline-pixel/computers-devices-electronics/computers-devices-electronics-keyboard.svg" alt="" width={176} height={176} />
          <Image className="hero-icon hero-icon-mouse" src="/icons/streamline-pixel/computers-devices-electronics/computers-devices-electronics-mouse.svg" alt="" width={112} height={112} />
          <Image className="hero-icon hero-icon-cloud" src="/icons/streamline-pixel/internet-network/internet-network-computer-upload.svg" alt="" width={112} height={112} />
          <Image className="hero-icon hero-icon-sparkles" src="/icons/streamline-pixel/design/design-magic-wand.svg" alt="" width={88} height={88} />
          <Image className="hero-icon hero-icon-paperclip" src="/icons/streamline-pixel/interface-essential/interface-essential-link.svg" alt="" width={80} height={80} />
        </div>
      </section>

      <section aria-labelledby="tools-title">
        <div className="section-heading">
          <p className="section-eyebrow">HUB DE MOBILIZAÇÃO</p>
          <h2 id="tools-title">Ferramentas</h2>
        </div>
        <ToolFeed limit={4} />
        <Link className="action-link" href="/ferramentas">Ver todas as ferramentas</Link>
      </section>

      <section aria-labelledby="content-title">
        <div className="section-heading">
          <p className="section-eyebrow">ACERVO COLETIVO</p>
          <h2 id="content-title">Conteúdos</h2>
        </div>
        <ContentFeed limit={4} />
        <a className="action-link" href="/conteudos">Ver todos os conteúdos</a>
      </section>
    </main>
  );
}
