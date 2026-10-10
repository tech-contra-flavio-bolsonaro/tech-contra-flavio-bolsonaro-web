"use client";

import { PressSurface } from "@/components/ui/press-surface";
import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";

export default function ToolError({ reset }: { reset: () => void }) {
  return (
    <main className="tools-page tool-detail-page">
      <SiteNav variant="home" />
      <section className="tool-detail" aria-labelledby="tool-title">
        <p className="tool-detail-eyebrow">FERRAMENTAS / ERRO</p>
        <h1 id="tool-title">Não foi possível carregar a ferramenta.</h1>
        <p role="alert">Tente novamente em instantes.</p>
        <button className="home-button home-button-yellow" type="button" onClick={reset}><PressSurface>Tentar novamente</PressSurface></button>
        <Link className="tool-detail-back" href="/ferramentas">Voltar às ferramentas</Link>
      </section>
    </main>
  );
}
