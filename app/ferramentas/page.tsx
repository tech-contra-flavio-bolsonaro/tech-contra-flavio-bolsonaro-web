import { SiteNav } from "@/app/components/site-nav";

export default function FerramentasPage() {
  return (
    <main>
      <SiteNav />
      <section className="page-intro" aria-labelledby="tools-title">
        <p>FERRAMENTAS</p>
        <h1 id="tools-title">O QUE AJUDA A AGIR.</h1>
        <div className="page-copy">
          <p>
            Em breve, este espaço vai concentrar as ferramentas da comunidade:
            calculadoras, guias, formulários e acessos diretos para a ação.
          </p>
          <a className="action-link" href="/enviar">Sugerir uma ferramenta ↓</a>
        </div>
      </section>
    </main>
  );
}
