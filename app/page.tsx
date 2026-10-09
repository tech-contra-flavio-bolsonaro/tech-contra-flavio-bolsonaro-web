import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/app/components/site-nav";
import { ToolFeed } from "@/app/components/tool-feed";
import { ContentFeed } from "@/app/components/content-feed";
import { HomeArrow } from "@/app/components/home-arrow";

export const metadata: Metadata = {
  title: "Início",
  description:
    "Vira Voto reúne ferramentas, conteúdos e referências para transformar ideias em ação coletiva.",
};

export default function Home() {
  return (
    <main className="home-page">
      <SiteNav variant="home" />
      <section className="home-hero" id="inicio" aria-labelledby="hero-title">
        <div className="home-hero-copy">
          <p className="home-eyebrow">UM HUB PARA QUEM QUER VIRAR O JOGO</p>
          <h1 id="hero-title"><span>IDEIAS</span>{" "}<span>GANHAM</span>{" "}<span className="home-hero-title-accent">MOVIMENTO.</span></h1>
          <p className="home-hero-description">Um espaço para conectar pessoas, compartilhar ferramentas e transformar ideias em ação coletiva.</p>
          <div className="home-hero-actions"><Link className="home-button home-button-yellow home-hero-manifesto-cta" href="/manifesto">Leia e assine o manifesto <svg className="home-hero-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M0,24L24,0M24,0L0,0M24,0L24,24" stroke="currentColor" strokeWidth="2.5" /></svg></Link><p>ABERTO PARA TODO MUNDO.<br />INCLUSIVE VOCÊ.</p></div>
        </div>
        <div data-testid="hero-decoration" className="home-hero-decoration" aria-hidden="true">
          <Image
            className="home-hero-art"
            src="/images/hero-ideas-network.svg"
            alt=""
            width={471.116}
            height={520}
            unoptimized
          />
        </div>
      </section>
      <section className="home-manifesto" aria-labelledby="manifesto-title"><div><p className="home-eyebrow">NOSSO HUB</p><h2 id="manifesto-title">A democracia também se constrói em rede.</h2></div><Link className="home-button home-button-white" href="/ferramentas">Conheça nosso hub <HomeArrow /></Link></section>
      <section className="home-preview home-tools" aria-labelledby="tools-title"><header className="home-section-heading"><div><p className="home-eyebrow">DO PLANO À PRÁTICA</p><h2 id="tools-title">Ferramentas</h2></div><p>Menos barreiras, mais ação. Recursos para fazer acontecer, juntos.</p></header><div className="home-preview-feed"><ToolFeed limit={3} variant="home" /></div></section>
      <section className="home-preview home-content" aria-labelledby="content-title"><header className="home-section-heading"><div><p className="home-eyebrow">ACERVO COLETIVO</p><h2 id="content-title">Conteúdos</h2></div><p>Ideias para circular. Conteúdos para levar a conversa mais longe.</p></header><div className="home-preview-feed"><ContentFeed limit={1} variant="home" /></div></section>
      <section className="home-submit" aria-labelledby="submit-title">
        <div className="home-submit-panel">
          <Image className="home-submit-star" src="/images/home-collective-star.svg" alt="" width={102} height={102} unoptimized />
          <div className="home-submit-copy">
            <p className="home-eyebrow">O HUB TAMBÉM É SEU</p>
            <h2 id="submit-title">Ideias boas não ficam paradas.</h2>
            <p>Tem algo para somar? Coloque sua ideia em movimento.</p>
          </div>
          <Link className="home-button home-button-yellow" href="/enviar">Enviar conteúdo <HomeArrow /></Link>
        </div>
      </section>
    </main>
  );
}
