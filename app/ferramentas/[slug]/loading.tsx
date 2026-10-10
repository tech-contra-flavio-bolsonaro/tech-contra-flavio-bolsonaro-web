import { SiteNav } from "@/app/components/site-nav";

export default function LoadingTool() {
  return (
    <main className="tools-page tool-detail-page">
      <SiteNav variant="home" />
      <section className="tool-detail tool-detail-loading">
        <p className="tool-detail-eyebrow">FERRAMENTAS / CARREGANDO</p>
        <p role="status">Carregando ferramenta…</p>
      </section>
    </main>
  );
}
