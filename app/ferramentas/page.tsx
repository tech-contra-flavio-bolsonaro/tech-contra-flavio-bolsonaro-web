import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HomeArrow } from "@/app/components/home-arrow";
import { SiteNav } from "@/app/components/site-nav";
import { ToolFeed, type InitialTools } from "@/app/components/tool-feed";
import { pageMetadata } from "@/app/lib/page-metadata";
import { listAllTools, listToolCategories } from "@/app/lib/tools-server";

export const metadata: Metadata = pageMetadata({
  title: "Ferramentas",
  description:
    "Explore ferramentas da comunidade para planejar, criar e colocar ideias em movimento.",
  path: "/ferramentas",
});

// Every approved tool is rendered on the server so crawlers find the links without
// JavaScript (issue #102). A database failure falls back to the browser fetch.
async function loadCatalog(category: string | null): Promise<InitialTools | undefined> {
  try {
    const [items, categories] = await Promise.all([listAllTools(category ?? undefined), listToolCategories()]);
    return { items, hasMore: false, categories, category };
  } catch (error) {
    console.error("ferramentas: falha ao listar ferramentas", error);
    return undefined;
  }
}

export default async function FerramentasPage({ searchParams }: { searchParams: Promise<{ categoria?: string | string[] }> }) {
  const requested = (await searchParams).categoria;
  const category = (Array.isArray(requested) ? requested[0] : requested)?.trim() || null;
  // Same limit as /api/ferramentas; anything longer cannot be a real category.
  const initial = await loadCatalog(category && category.length <= 60 ? category : null);

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
          <ToolFeed variant="home" initial={initial} />
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
