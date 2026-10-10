import type { Metadata } from "next";
import { siteOpenGraph } from "@/app/lib/page-metadata";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/app/components/site-nav";
import { contentPermalink } from "@/app/lib/content-permalink";
import { findPublishedContent } from "@/app/lib/published-content";
import { safeHttpsUrl } from "@/app/lib/safe-https-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const content = await findPublishedContent(id);
  if (!content) {
    return {
      title: "Conteúdo não encontrado",
      description: "O conteúdo solicitado não está disponível no Vira Voto.",
    };
  }

  const canonical = contentPermalink(content.id);
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical },
    openGraph: {
      ...siteOpenGraph,
      title: content.title,
      description: content.description,
      type: "article",
      url: canonical,
    },
    twitter: {
      card: "summary",
      title: content.title,
      description: content.description,
    },
  };
}

export default async function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await findPublishedContent(id);
  if (!content) notFound();

  const videoLink = safeHttpsUrl(content.video_url);
  const isVideo = Boolean(content.mediaUrl?.match(/\.(mp4|webm)($|\?)/i));

  return (
    <main className="content-detail-page">
      <SiteNav />
      <article className="content-detail" aria-labelledby="content-detail-title">
        <Link className="content-detail-back" href="/conteudos">← Todos os conteúdos</Link>
        <p className="eyebrow">CONTEÚDO DA COMUNIDADE</p>
        <h1 id="content-detail-title">{content.title}</h1>
        <p className="content-detail-description">{content.description}</p>
        {content.mediaUrl && isVideo ? (
          <video className="content-detail-media" controls src={content.mediaUrl} aria-label={content.title} />
        ) : null}
        {content.mediaUrl && !isVideo ? (
          <Image
            className="content-detail-media"
            src={content.mediaUrl}
            alt={content.title}
            width={1200}
            height={900}
            unoptimized
          />
        ) : null}
        {videoLink ? (
          <p><a href={videoLink} target="_blank" rel="noreferrer">Abrir vídeo original ↗</a></p>
        ) : null}
        <p className="content-detail-credit">Crédito: {content.credit}</p>
      </article>
    </main>
  );
}
