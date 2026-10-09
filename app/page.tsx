import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";
import { ToolFeed } from "@/app/components/tool-feed";
import { ContentFeed } from "@/app/components/content-feed";

const Arrow = () => <span aria-hidden="true">→</span>;

export default function Home() {
  return (
    <main className="home-page">
      <SiteNav />
      <section className="home-hero" id="inicio" aria-labelledby="hero-title">
        <div className="home-hero-copy">
          <p className="home-eyebrow">UM HUB PARA QUEM QUER VIRAR O JOGO</p>
          <h1 id="hero-title">IDEIAS GANHAM <span>MOVIMENTO.</span></h1>
          <p className="home-hero-description">Um espaço para conectar pessoas, compartilhar ferramentas e transformar ideias em ação coletiva.</p>
          <div className="home-hero-actions"><Link className="home-button home-button-yellow" href="/ferramentas">Conhecer o hub <Arrow /></Link><p>ABERTO PARA TODO MUNDO.<br />INCLUSIVE VOCÊ.</p></div>
        </div>
        <div className="home-network" aria-hidden="true"><p className="home-network-sticker">IDEIA → AÇÃO</p><span className="home-network-star">✳</span><div className="home-network-window"><div className="home-window-bar"><span>● ● ●</span> ideias_em_movimento</div><div className="home-window-message"><p>&gt; conectar. criar. mobilizar.</p><strong>UMA IDEIA.<br />MUITAS VOZES.</strong><small><i /> rede em construção coletiva_</small></div></div><p className="home-network-note">O PRÓXIMO PASSO É NOSSO.</p><small className="home-network-caption">FEITO DE GENTE. MOVIDO POR IDEIAS.</small></div>
      </section>
      <section className="home-manifesto" aria-labelledby="manifesto-title"><div><p className="home-eyebrow">NOSSO MANIFESTO</p><h2 id="manifesto-title">A democracia também se constrói em rede.</h2></div><Link className="home-button home-button-white" href="/manifesto">Leia o manifesto <Arrow /></Link></section>
      <section className="home-preview home-tools" aria-labelledby="tools-title"><header className="home-section-heading"><div><p className="home-eyebrow">FERRAMENTAS PARA AGIR</p><h2 id="tools-title">Ferramentas</h2></div><p>Recursos práticos para transformar intenção em ação coletiva.</p></header><div className="home-preview-feed"><ToolFeed limit={3} /></div><Link className="home-button home-button-outline" href="/ferramentas">Ver todas as ferramentas <Arrow /></Link></section>
      <section className="home-preview home-content" aria-labelledby="content-title"><header className="home-section-heading"><div><p className="home-eyebrow">ACERVO COLETIVO</p><h2 id="content-title">Conteúdos</h2></div><p>Ideias, referências e histórias que ajudam a movimentar o agora.</p></header><div className="home-preview-feed"><ContentFeed limit={1} /></div><Link className="home-button home-button-outline" href="/conteudos">Ver todos os conteúdos <Arrow /></Link></section>
      <section className="home-submit" aria-labelledby="submit-title"><span aria-hidden="true">✳</span><div><p className="home-eyebrow">ENVIE UMA IDEIA</p><h2 id="submit-title">Tem algo que pode movimentar pessoas?</h2><p>Compartilhe com a comunidade e ajude a construir o acervo coletivo.</p></div><Link className="home-button home-button-yellow" href="/enviar">Enviar conteúdo <Arrow /></Link></section>
    </main>
  );
}
