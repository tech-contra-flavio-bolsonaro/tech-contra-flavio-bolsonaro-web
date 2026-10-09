import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HomeArrow } from "@/app/components/home-arrow";
import { SiteNav } from "@/app/components/site-nav";
import { ToolFeed } from "@/app/components/tool-feed";

export const metadata: Metadata = {
  title: "Ferramentas",
  description:
    "Explore ferramentas da comunidade para planejar, criar e colocar ideias em movimento.",
};

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
              Ferramentas da comunidade para planejar, criar e colocar ideias
              em movimento.
            </p>
          </div>
          <div className="tools-window" aria-label="Ferramentas da comunidade">
            <div className="tools-window-bar">
              <span className="tools-window-controls" aria-hidden="true">
                <Image src="/images/ferramentas/window-control.svg" alt="" width={9} height={9} unoptimized />
                <Image src="/images/ferramentas/window-control.svg" alt="" width={9} height={9} unoptimized />
                <Image src="/images/ferramentas/window-control.svg" alt="" width={9} height={9} unoptimized />
              </span>
              <span>ferramentas_da_comunidade</span>
            </div>
            <div className="tools-window-content">
              <p>&gt; ferramentas_publicadas_</p>
              <h2>EM MOVIMENTO.</h2>
              <div className="tools-progress" aria-hidden="true">
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
            <p>PUBLICADAS PELA COMUNIDADE</p>
          </div>
          <ToolFeed variant="home" />
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
