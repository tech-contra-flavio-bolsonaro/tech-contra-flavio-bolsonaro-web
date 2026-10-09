import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HomeArrow } from "@/app/components/home-arrow";
import { SiteNav } from "@/app/components/site-nav";

export const metadata: Metadata = {
  title: "Ferramentas",
  description:
    "Em breve, ferramentas da comunidade para planejar, criar e colocar ideias em movimento.",
};

const categories = [
  { title: "Calculadoras", icon: "/images/ferramentas/calculator.svg", tone: "yellow" },
  { title: "Guias", icon: "/images/ferramentas/guides.svg", tone: "coral" },
  { title: "Formulários", icon: "/images/ferramentas/forms.svg", tone: "white" },
];

export default function FerramentasPage() {
  return (
    <main className="tools-page">
      <SiteNav variant="home" />
      <div className="tools-content">
        <section className="tools-hero" aria-labelledby="tools-title">
          <div className="tools-hero-copy">
            <p className="tools-eyebrow">DO PLANO À PRÁTICA</p>
            <h1 id="tools-title">O QUE AJUDA A AGIR.</h1>
            <p className="tools-intro">
              Em breve, este espaço vai concentrar as ferramentas da comunidade:
              calculadoras, guias, formulários e acessos diretos para a ação.
            </p>
          </div>
          <div className="tools-window" aria-label="Ferramentas da comunidade em construção">
            <div className="tools-window-bar">
              <span className="tools-window-controls" aria-hidden="true">
                <Image src="/images/ferramentas/window-control.svg" alt="" width={9} height={9} unoptimized />
                <Image src="/images/ferramentas/window-control.svg" alt="" width={9} height={9} unoptimized />
                <Image src="/images/ferramentas/window-control.svg" alt="" width={9} height={9} unoptimized />
              </span>
              <span>ferramentas_da_comunidade</span>
            </div>
            <div className="tools-window-content">
              <p>&gt; em construção coletiva_</p>
              <h2>EM BREVE.</h2>
              <div className="tools-progress" aria-label="Em preparação">
                <span /><span /><span /><span />
              </div>
            </div>
            <Image
              className="tools-window-star"
              src="/images/home-collective-star.svg"
              alt=""
              width={98}
              height={98}
              unoptimized
            />
          </div>
        </section>

        <section className="tools-categories" aria-labelledby="tools-categories-title">
          <div className="tools-section-heading">
            <h2 id="tools-categories-title">RECURSOS DA COMUNIDADE</h2>
            <p>EM BREVE / AINDA NÃO DISPONÍVEIS</p>
          </div>
          <div className="tools-category-grid">
            {categories.map((category) => (
              <article className="tools-category-card" data-tone={category.tone} key={category.title}>
                <Image src={category.icon} alt="" width={56} height={56} unoptimized />
                <h3>{category.title}</h3>
                <div className="tools-placeholder-lines" aria-hidden="true">
                  <span /><span />
                </div>
                <span className="tools-status"><span aria-hidden="true" />Em breve</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="tools-suggestion" aria-labelledby="tools-suggestion-title">
        <Image
          src="/images/home-collective-star.svg"
          alt=""
          width={92}
          height={92}
          unoptimized
        />
        <div className="tools-suggestion-copy">
          <p className="tools-suggestion-eyebrow">CONSTRUÇÃO COLETIVA</p>
          <h2 id="tools-suggestion-title">O PRÓXIMO PASSO É NOSSO.</h2>
        </div>
        <Link className="tools-suggestion-link" href="/ferramentas/enviar">
          Sugerir uma ferramenta
          <HomeArrow />
        </Link>
      </section>
    </main>
  );
}
