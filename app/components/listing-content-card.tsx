import Image from "next/image";
import type { ContentItem } from "./content-feed";
import { HomeArrow } from "./home-arrow";
import { ShareButton } from "./share-button";
import { safeHttpsUrl } from "@/app/lib/safe-https-url";

/** Populated adaptation of the authorized Penpot Blog grid with the Conteúdos identity. */
export function ListingContentCard({ item }: { item: ContentItem }) {
  const videoLink = safeHttpsUrl(item.video_url);
  const mediaUrl = item.mediaUrl ?? (videoLink?.match(/\.(mp4|webm|mov)($|\?)/i) ? videoLink : null);
  const isVideo = Boolean(mediaUrl?.match(/\.(mp4|webm|mov)($|\?)/i));
  return (
    <article className="listing-content-card" tabIndex={-1} aria-labelledby={`conteudo-title-${item.id}`} data-media={mediaUrl ? "preview" : "reference"} id={`conteudo-${item.id}`}>
      {mediaUrl ? <div className="listing-content-media">{isVideo ? <video controls preload="metadata" src={mediaUrl} aria-label={item.title} /> : <Image src={mediaUrl} alt={item.title} width={800} height={600} unoptimized />}</div> : null}
      <div className="listing-content-info">
        <div className="listing-content-meta"><p className="listing-content-credit">{item.credit}</p><p className="listing-content-format">{isVideo ? "VÍDEO" : mediaUrl ? "IMAGEM" : "REFERÊNCIA"}</p></div>
        <div className="listing-content-description">{!mediaUrl ? <Image className="listing-reference-icon" src="/images/content-reference.svg" alt="" width={24} height={24} unoptimized /> : null}<h2 id={`conteudo-title-${item.id}`}>{item.title}</h2><p>{item.description}</p></div>
        {videoLink && videoLink !== mediaUrl ? <a className="listing-content-link" href={videoLink} target="_blank" rel="noreferrer">Abrir referência<HomeArrow /></a> : null}
        <ShareButton variant="listing" title={item.title} description={item.description} credit={item.credit} url={videoLink ?? `${window.location.origin}/conteudos#conteudo-${item.id}`} imageUrl={isVideo ? undefined : mediaUrl ?? undefined} videoUrl={isVideo ? mediaUrl ?? undefined : undefined} associatedVideoUrl={mediaUrl && videoLink && videoLink !== mediaUrl ? videoLink : undefined} />
      </div>
    </article>
  );
}
