import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";
export default function NotFound() {
  return (
    <>
      <SiteNav variant="home" />
      <main className="blog-content">
        <section className="blog-status">
          <h1>Artigo não encontrado</h1>
          <p>Esta publicação não está disponível no Blog da comunidade.</p>
          <Link className="blog-button" href="/blog">
            Voltar para o Blog
          </Link>
        </section>
      </main>
    </>
  );
}
