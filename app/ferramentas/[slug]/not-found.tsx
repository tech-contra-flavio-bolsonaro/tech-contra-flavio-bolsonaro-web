import { PressSurface } from "@/components/ui/press-surface";
import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";
import { notFoundMetadata } from "@/app/lib/page-metadata";

export const metadata = notFoundMetadata;

export default function ToolNotFound() {
  return (
    <main className="tools-page tool-detail-page">
      <SiteNav variant="home" />
      <section className="tool-detail" aria-labelledby="tool-title">
        <p className="tool-detail-eyebrow">FERRAMENTAS / 404</p>
        <h1 id="tool-title">Ferramenta não encontrada.</h1>
        <p>Ela pode não estar publicada ou o endereço pode estar incorreto.</p>
        <Link className="tool-detail-action" href="/ferramentas"><PressSurface>Ver ferramentas disponíveis</PressSurface></Link>
      </section>
    </main>
  );
}
