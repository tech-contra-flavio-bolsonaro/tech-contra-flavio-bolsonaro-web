import "./conteudos.css";
import type { Metadata } from "next";
import { SiteNav } from "@/app/components/site-nav";
import { ContentFeed } from "@/app/components/content-feed";

export const metadata: Metadata = {
  title: "Conteúdos",
  description:
    "Acesse referências, vídeos e materiais que ajudam a informar, inspirar e ampliar a conversa pública.",
};

export default function ConteudosPage() {
  return (
    <main className="content-list-page">
      <SiteNav variant="home" />
      <section className="content-list-hero" aria-labelledby="content-title">
        <p className="home-eyebrow">ACERVO COLETIVO</p>
        <h1 id="content-title">FEITO PARA CIRCULAR.</h1>
        <p className="content-list-intro">Imagens, vídeos e referências compartilhadas pela comunidade para<span className="content-intro-break"><br /></span>{" "}informar, inspirar e fazer a conversa chegar mais longe.</p>
      </section>
      <section className="content-list-acervo" aria-label="Acervo da comunidade">
        <ContentFeed variant="listing" />
      </section>
    </main>
  );
}
