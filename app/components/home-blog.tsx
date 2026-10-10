import { PressSurface } from "@/components/ui/press-surface";
import type { ReactNode } from "react";
import Link from "next/link";
import { BlogCard } from "./blog-card";
import { HomeArrow } from "./home-arrow";
import { getBlogPage } from "@/app/lib/blog/server";

function HomeBlogSection({ children }: { children: ReactNode }) {
  return (
    <section className="home-preview home-blog" aria-labelledby="blog-title">
      <header className="home-section-heading">
        <div><p className="home-eyebrow">HISTÓRIAS DA COMUNIDADE</p><h2 id="blog-title">Blog</h2></div>
        <p>Inspiração, ferramentas e histórias reais para transformar boas ideias em ação coletiva.</p>
      </header>
      {children}
      <Link className="home-button home-button-yellow home-blog-all" href="/blog"><PressSurface>Ver todos os artigos <HomeArrow /></PressSurface></Link>
    </section>
  );
}

export function HomeBlogLoading() {
  return <HomeBlogSection><p className="home-blog-status" role="status">Carregando artigos…</p></HomeBlogSection>;
}

export async function HomeBlog() {
  // The organization endpoint orders by published_at DESC before pagination.
  const result = await getBlogPage(1);
  return (
    <HomeBlogSection>
      {result.status === "unavailable" ? (
        <p className="home-blog-status" role="status">Não foi possível carregar os artigos agora. Acesse o Blog para tentar novamente.</p>
      ) : result.articles.length ? (
        <div className="home-blog-grid">
          {result.articles.slice(0, 4).map(article => <BlogCard key={article.id} article={article} variant="home" />)}
        </div>
      ) : (
        <p className="home-blog-status">Ainda não há artigos publicados pela comunidade.</p>
      )}
    </HomeBlogSection>
  );
}
