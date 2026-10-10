import type { Metadata } from "next";
import Link from "next/link";
import { HomeArrow } from "@/app/components/home-arrow";
import { SiteNav } from "@/app/components/site-nav";
import { BlogArt } from "@/app/components/blog-art";
import { BlogCard } from "@/app/components/blog-card";
import {
  BlogContribution,
  BlogUnavailable,
} from "@/app/components/blog-status";
import { getBlogPage } from "@/app/lib/blog/server";
import { blogPageNumber } from "@/app/lib/blog/urls";
import { pageMetadata } from "@/app/lib/page-metadata";
export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Inspiração, ferramentas e histórias reais da comunidade Tech Contra Bolsonaro.",
  path: "/blog",
});
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const page = blogPageNumber((await searchParams).page);
  const result = await getBlogPage(page);
  return (
    <>
      <SiteNav variant="home" />
      <main className="blog-content" id="blog-main">
        <section className="blog-hero">
          <div>
            <p className="blog-label">HISTÓRIAS DA COMUNIDADE</p>
            <h1>
              IDEIAS QUE
              <br />
              <span>MOVIMENTAM</span>
              <br />A DEMOCRACIA.
            </h1>
            <p className="blog-intro blog-intro-desktop">
              Inspiração, ferramentas e histórias reais para transformar
              <br className="blog-desktop-break" /> boas ideias em ação
              coletiva.
            </p>
            <p className="blog-intro blog-intro-mobile">Histórias para transformar boas ideias<br /> em ação coletiva.</p>
          </div>
          <BlogArt />
        </section>
        <div className="blog-source-bar">
          <b>BLOG DA COMUNIDADE</b>
          <p>Todos os artigos publicados pela Tech Contra Bolsonaro.</p>
          <a
            className="home-button home-button-white"
            href="https://dev.to/techcontrabolsonaro"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conheça no DEV.to <HomeArrow />
          </a>
        </div>
        {result.status === "unavailable" ? (
          <BlogUnavailable reason={result.reason} />
        ) : result.articles.length ? (
          <>
            <p className="blog-label blog-section-label blog-featured-label-desktop">
              {page === 1 ? "EM DESTAQUE" : `PÁGINA ${page}`}
            </p>
            <BlogCard article={result.articles[0]} featured featuredLabel={page === 1 ? "EM DESTAQUE" : `PÁGINA ${page}`} />
            {result.articles.length > 1 ? (
              <>
                <div className="blog-section-heading">
                  <p className="blog-label">MAIS IDEIAS</p>
                  <span>
                    {(page - 1) * 6 + 2} —{" "}
                    {(page - 1) * 6 + result.articles.length}
                  </span>
                </div>
                <div className="blog-grid">
                  {result.articles.slice(1).map((article) => (
                    <BlogCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            ) : null}
            {page > 1 || result.hasNext ? (
              <nav
                className="blog-pagination"
                aria-label="Paginação dos artigos"
              >
                {page > 1 ? (
                  <Link className="home-button home-button-white" href={`/blog?page=${page - 1}`}><span className="blog-arrow-previous"><HomeArrow /></span> Anterior</Link>
                ) : (
                  <span />
                )}
                <span aria-current="page">Página {page}</span>
                {result.hasNext ? (
                  <Link className="home-button home-button-white" href={`/blog?page=${page + 1}`}>Próxima <span className="blog-arrow-next"><HomeArrow /></span></Link>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </>
        ) : (
          <section className="blog-status">
            <h2>Nenhum artigo nesta página</h2>
            <p>Os artigos publicados pela organização aparecerão aqui.</p>
            {page > 1 ? (
              <Link className="home-button home-button-yellow" href="/blog">Voltar à primeira página <HomeArrow /></Link>
            ) : null}
          </section>
        )}
        <BlogContribution />
      </main>
    </>
  );
}
