import { SiteNav } from "@/app/components/site-nav";
import { ContentFeed } from "@/app/components/content-feed";

export default function ConteudosPage() {
  return (
    <main>
      <SiteNav />
      <section className="page-intro" aria-labelledby="content-title">
        <p>CONTEÚDOS</p>
        <h1 id="content-title">FEITO PARA CIRCULAR.</h1>
        <div className="page-copy"><p>Imagens, vídeos e referências compartilhadas pela comunidade para informar, inspirar e fazer a conversa chegar mais longe.</p></div>
        <ContentFeed />
        <a className="action-link" href="/enviar">Enviar um conteúdo ↓</a>
      </section>
    </main>
  );
}
