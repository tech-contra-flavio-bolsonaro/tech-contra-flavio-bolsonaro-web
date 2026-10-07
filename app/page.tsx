import Image from "next/image";
import { SiteNav } from "@/app/components/site-nav";
import { ToolCard } from "@/app/components/tool-card";
import { tools } from "@/app/lib/content";
import { ContentFeed } from "@/app/components/content-feed";

export default function Home() {
  return (
    <main>
      <SiteNav />
      <section id="inicio" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p>UM HUB PARA QUEM QUER VIRAR O JOGO</p>
          <h1 id="hero-title">IDEIAS GANHAM <span>MOVIMENTO.</span></h1>
          <a href="/ferramentas">Conhecer o hub ↓</a>
        </div>
        <div data-testid="hero-decoration" className="hero-decoration" aria-hidden="true">
          <Image className="hero-icon hero-icon-computer" src="/brand-icons/retro-computer.svg" alt="" width={256} height={256} />
          <Image className="hero-icon hero-icon-keyboard" src="/brand-icons/keyboard.svg" alt="" width={176} height={176} />
          <Image className="hero-icon hero-icon-mouse" src="/brand-icons/mouse.svg" alt="" width={112} height={112} />
          <Image className="hero-icon hero-icon-cloud" src="/brand-icons/upload-cloud.svg" alt="" width={112} height={112} />
          <Image className="hero-icon hero-icon-sparkles" src="/brand-icons/pixel-sparkles.svg" alt="" width={88} height={88} />
          <Image className="hero-icon hero-icon-paperclip" src="/brand-icons/paperclip.svg" alt="" width={80} height={80} />
        </div>
      </section>

      <section aria-labelledby="tools-title">
        <p>FERRAMENTAS</p>
        <h2 id="tools-title">Ferramentas</h2>
        <div className="card-grid">
          {tools.slice(0, 4).map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
        <a className="action-link" href="/ferramentas">Ver todas as ferramentas</a>
      </section>

      <section aria-labelledby="content-title">
        <p>CONTEÚDOS</p>
        <h2 id="content-title">Conteúdos</h2>
        <ContentFeed limit={4} />
        <a className="action-link" href="/conteudos">Ver todos os conteúdos</a>
      </section>
    </main>
  );
}
