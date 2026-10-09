"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, UserRound } from "lucide-react";
import { HomeContentCard } from "./home-content-card";
import { ShareButton } from "@/app/components/share-button";
import { contentPermalink } from "@/app/lib/content-permalink";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  credit: string;
  media_path: string | null;
  mediaUrl: string | null;
  video_url: string | null;
};

export function ContentFeed({ limit, variant = "default" }: { limit?: number; variant?: "default" | "home" }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const loadPage = useCallback(async (nextPage: number) => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await fetch(`/api/conteudos?page=${nextPage}`);
      if (!response.ok) throw new Error("request failed");
      const result = (await response.json()) as { items: ContentItem[]; hasMore: boolean };
      setItems((current) => nextPage === 0 ? result.items : [...current, ...result.items]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadPage(0); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadPage]);

  useEffect(() => {
    if (!sentinel.current || !hasMore || isLoading || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadPage(page + 1);
    });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadPage, page]);

  if (error) return <p role="alert">Não foi possível carregar conteúdos. Tente novamente.</p>;
  if (!isLoading && items.length === 0) return (
    <div className="content-empty-state">
      <div className="content-empty-icon"><Image className="content-empty-pixel" src="/icons/streamline-pixel/photography/photography-picture-polaroid.svg" alt="" width={48} height={48} /></div>
      <div>
        <p className="eyebrow">ACERVO EM CONSTRUÇÃO</p>
        <h3>Ainda não há conteúdos publicados.</h3>
        <p>Compartilhe uma referência para inaugurar este espaço com a comunidade.</p>
        <a className="content-empty-action" href="/enviar">Enviar o primeiro conteúdo</a>
      </div>
    </div>
  );

  return (
    <>
      <div className="card-grid">
        {items.slice(0, limit).map((item) => variant === "home" ? <HomeContentCard item={item} key={item.id} /> : (
          <Card className="content-card" key={item.id}>
            {item.mediaUrl?.match(/\.mp4($|\?)/i) ? <video controls src={item.mediaUrl} /> : null}
            {item.mediaUrl && !item.mediaUrl.match(/\.mp4($|\?)/i) ? <Image src={item.mediaUrl} alt={item.title} width={800} height={600} unoptimized /> : null}
            <CardHeader><div className="content-card-kicker"><ImageIcon aria-hidden="true" /> Conteúdo da comunidade</div><CardTitle>{item.title}</CardTitle></CardHeader>
            <CardContent><p>{item.description}</p><small><UserRound aria-hidden="true" /> {item.credit}</small>{item.video_url ? <a href={item.video_url} target="_blank" rel="noreferrer">Abrir vídeo ↗</a> : null}</CardContent>
            <CardFooter><ShareButton title={item.title} description={item.description} url={contentPermalink(item.id)} imageUrl={item.mediaUrl ?? undefined} /></CardFooter>
          </Card>
        ))}
      </div>
      {!limit ? <><div ref={sentinel} className="scroll-sentinel" aria-hidden="true" />
      {isLoading ? <p role="status">Carregando conteúdos…</p> : null}
      {hasMore && !isLoading ? <button className="load-more" type="button" onClick={() => void loadPage(page + 1)}>Carregar mais</button> : null}</> : null}
    </>
  );
}
