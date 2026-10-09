import Image from "next/image";
import type { ContentItem } from "./content-feed";
import { ShareButton } from "./share-button";
import { HomeArrow } from "./home-arrow";
import { contentPermalink } from "@/app/lib/content-permalink";

export function HomeContentCard({ item }: { item: ContentItem }) {
  const mediaUrl = item.mediaUrl ?? (item.video_url?.match(/\.(mp4|webm)($|\?)/i) ? item.video_url : null);
  const isVideo = Boolean(mediaUrl?.match(/\.(mp4|webm)($|\?)/i));
  return (
    <article className="home-content-card">
      <div className="home-content-media">
        {mediaUrl ? isVideo ? <video controls src={mediaUrl} aria-label={item.title} /> : <Image src={mediaUrl} alt={item.title} width={800} height={600} unoptimized /> : item.video_url ? <a className="home-content-video-link" href={item.video_url} target="_blank" rel="noreferrer">Abrir vídeo <HomeArrow /></a> : null}
      </div>
      <div className="home-content-info">
        <div className="home-content-meta"><p className="home-content-credit">{item.credit}</p><p className="home-content-highlight">EM DESTAQUE <HomeArrow /></p></div>
        <div className="home-content-description"><h3>{item.title}</h3><p>{item.description}</p></div>
        <ShareButton variant="home" title={item.title} description={item.description} credit={item.credit} url={contentPermalink(item.id)} imageUrl={isVideo ? undefined : mediaUrl ?? undefined} videoUrl={isVideo ? mediaUrl ?? undefined : undefined} associatedVideoUrl={item.video_url && item.video_url !== mediaUrl ? item.video_url : undefined} />
      </div>
    </article>
  );
}
