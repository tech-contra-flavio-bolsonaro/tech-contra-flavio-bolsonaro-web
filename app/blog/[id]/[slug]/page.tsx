import { PressSurface } from "@/components/ui/press-surface";
import styles from "./detail.module.css";
import { HomeArrow } from "@/app/components/home-arrow";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DetailShell } from "./detail-shell";
import { ShareButton } from "@/app/components/share-button";
import { BlogTags } from "@/app/components/blog-card";
import {
  BlogContribution,
  BlogUnavailable,
} from "@/app/components/blog-status";
import { getBlogArticle } from "@/app/lib/blog/server";
import { blogDate, blogPermalink } from "@/app/lib/blog/urls";
import { sanitizeBlogHtml } from "@/app/lib/blog/sanitize";
type Props = { params: Promise<{ id: string; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getBlogArticle(id);
  if (result.status === "not-found") notFound();
  if (result.status !== "ok")
    return {
      title: "Artigo indisponível",
      robots: { index: false, follow: true },
    };
  const { article } = result;
  return {
    title: article.title,
    description: article.description,
    authors: [
      {
        name: article.author.name,
        url: `https://dev.to/${article.author.username}`,
      },
    ],
    alternates: { canonical: article.sourceUrl },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: blogPermalink(article),
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      ...(article.coverImage
        ? { images: [article.coverImage] }
        : { images: [] }),
    },
    twitter: {
      card: article.coverImage ? "summary_large_image" : "summary",
      title: article.title,
      description: article.description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}
export default async function BlogDetailPage({ params }: Props) {
  const { id, slug } = await params;
  const result = await getBlogArticle(id);
  if (result.status === "not-found") notFound();
  if (result.status === "unavailable")
    return (
      <DetailShell>
        <main className="blog-content">
          <Link className="blog-back" href="/blog">
            <span className={styles.backArrow}><HomeArrow /></span> Voltar para o Blog
          </Link>
          <BlogUnavailable reason={result.reason} detail />
        </main>
      </DetailShell>
    );
  const { article } = result;
  if (slug !== article.slug) redirect(blogPermalink(article));
  return (
    <DetailShell>
      <main className="blog-content blog-detail">
        <Link className="blog-back" href="/blog">
          <span className={styles.backArrow}><HomeArrow /></span> Voltar para o Blog
        </Link>
        <header className="blog-detail-hero">
          <BlogTags tags={article.tags} />
          <h1>{article.title}</h1>
          <p>{article.description}</p>
        </header>
        {article.coverImage ? (
          <Image
            className="blog-detail-cover"
            src={article.coverImage}
            alt=""
            width={1280}
            height={600}
            unoptimized
          />
        ) : null}
        <div className="blog-byline">
          <p>
            POR{" "}
            <a
              href={`https://dev.to/${article.author.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.author.name}
            </a>{" "}
            ·{" "}
            <time dateTime={article.publishedAt}>
              {blogDate(article.publishedAt)}
            </time>{" "}
            · {article.readingMinutes} MIN DE LEITURA
          </p>
          <ShareButton
            variant="listing"
            className="home-button home-button-yellow"
            title={article.title}
            url={blogPermalink(article)}
            credit={article.author.name}
          />
        </div>
        <div className="blog-reading-layout">
          <article className="blog-prose">
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeBlogHtml(article.bodyHtml ?? ""),
              }}
            />
            <p className="blog-attribution">
              Por {article.author.name} (@{article.author.username}), na
              organização Tech Contra Bolsonaro.
              <br />
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ler publicação original no DEV.to <HomeArrow />
              </a>
            </p>
          </article>
          <aside className="blog-aside" aria-label="Continue explorando">
            <section>
              <p className="blog-label">CONTINUE EXPLORANDO</p>
              <h2>
                <span>IDEIAS BOAS</span>
                <br />
                NÃO FICAM
                <br />
                PARADAS.
              </h2>
              <Link className="home-button home-button-white" href="/blog"><PressSurface>Conheça mais histórias <HomeArrow /></PressSurface></Link>
            </section>
            <section>
              <h2>
                FAÇA PARTE
                <br />
                <span className="blog-aside-conversation">DESSA CONVERSA.</span>
              </h2>
              <p>Tem uma ideia ou experiência?</p>
              <Link className="home-button home-button-yellow" href="/enviar"><PressSurface>
                Compartilhar ideia <HomeArrow />
              </PressSurface></Link>
            </section>
          </aside>
        </div>
        <section className="blog-share-callout">
          <p>UMA HISTÓRIA QUE TE INSPIROU?</p>
          <ShareButton
            variant="listing"
            className="home-button home-button-yellow"
            title={article.title}
            url={blogPermalink(article)}
            credit={article.author.name}
          />
        </section>
        <BlogContribution detail />
      </main>
    </DetailShell>
  );
}
