import { SiteNav } from "@/app/components/site-nav";
export default function Loading() {
  return (
    <>
      <SiteNav variant="home" />
      <main className="blog-content">
        <section className="blog-status" role="status" aria-live="polite">
          <h1>Carregando artigos…</h1>
          <p>Buscando publicações da comunidade no DEV.to.</p>
        </section>
      </main>
    </>
  );
}
