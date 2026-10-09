import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";

export default function ToolNotFound() {
  return (
    <main className="tools-page tool-detail-page">
      <SiteNav variant="home" />
      <section className="tool-detail" aria-labelledby="tool-title">
        <p className="tool-detail-eyebrow">FERRAMENTAS / 404</p>
        <h1 id="tool-title">Ferramenta não encontrada.</h1>
        <p>Ela pode não estar publicada ou o endereço pode estar incorreto.</p>
        <Link className="tool-detail-action" href="/ferramentas">Ver ferramentas disponíveis</Link>
      </section>
    </main>
  );
}
