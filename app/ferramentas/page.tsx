import type { Metadata } from "next";
import { SiteNav } from "@/app/components/site-nav";
import Link from "next/link";
import { ToolFeed } from "@/app/components/tool-feed";

export const metadata: Metadata = {
  title: "Ferramentas",
  description:
    "Explore ferramentas e recursos para planejar, comunicar e transformar ideias em ação.",
};

export default function FerramentasPage() {
  return (
    <main>
      <SiteNav />
      <section className="tools-list" aria-labelledby="tools-title">
        <h1 id="tools-title">O QUE AJUDA A AGIR.</h1>
        <div className="page-copy">
          <p>
            Recursos da comunidade para planejar, criar e colocar ideias em movimento.
          </p>
          <Link className="action-link" href="/ferramentas/enviar">Sugerir uma ferramenta</Link>
        </div>
        <ToolFeed />
      </section>
    </main>
  );
}
