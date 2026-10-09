"use client";
import { SiteNav } from "@/app/components/site-nav";
export default function BlogError({ retry }: { retry: () => void }) {
  return (
    <>
      <SiteNav variant="home" />
      <main className="blog-content">
        <section className="blog-status" role="alert">
          <h1>Não foi possível carregar o Blog</h1>
          <p>Tente novamente em instantes.</p>
          <button className="blog-button" onClick={() => retry()}>
            Tentar novamente
          </button>
        </section>
      </main>
    </>
  );
}
