"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, UserRound } from "lucide-react";
import { ContentListState, ContentListContribution } from "./content-list-state";
import { ListingContentCard } from "./listing-content-card";
import { HomeContentCard } from "./home-content-card";
import { ShareButton } from "@/app/components/share-button";
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

export function ContentFeed({ limit, variant = "default" }: { limit?: number; variant?: "default" | "home" | "listing" }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const inFlight = useRef(false);
  const generation = useRef(0);
  const sentinel = useRef<HTMLDivElement>(null);

  const knownIds = useRef(new Set<string>());
  const moreControl = useRef<HTMLButtonElement>(null);
  const retryControl = useRef<HTMLButtonElement>(null);
  const focusRequest = useRef<{ control: HTMLButtonElement; target?: string } | null>(null);

  useEffect(() => {
    if (isLoading || !focusRequest.current) return;
    const { control, target } = focusRequest.current;
    focusRequest.current = null;
    if (document.activeElement !== control && document.activeElement !== document.body) return;
    const destination = error ? retryControl.current : hasMore ? moreControl.current : (document.getElementById(target ?? "content-list-state-title") ?? document.getElementById("content-list-state-title"));
    destination?.focus();
  }, [isLoading, error, hasMore]);

  const loadPage = useCallback(async (nextPage: number, control?: HTMLButtonElement) => {
    if (inFlight.current) return;
    inFlight.current = true;
    const requestGeneration = generation.current;
    setIsLoading(true);
    if (variant === "listing" && control && document.activeElement === control) focusRequest.current = { control };
    try {
      const response = await fetch(`/api/conteudos?page=${nextPage}`);
      if (!response.ok) throw new Error("request failed");
      const result = (await response.json()) as { items: ContentItem[]; hasMore: boolean };
      if (requestGeneration !== generation.current) return;
      const firstNew = result.items.find(item => !knownIds.current.has(item.id));
      if (focusRequest.current) focusRequest.current.target = firstNew ? `conteudo-${firstNew.id}` : "content-list-end";
      if (nextPage === 0) knownIds.current.clear();
      for (const item of result.items) knownIds.current.add(item.id);
      setError(false);
      setItems((current) => {
        const unique = new Map<string, ContentItem>();
        for (const item of nextPage === 0 ? result.items : [...current, ...result.items]) unique.set(item.id, item);
        return [...unique.values()];
      });
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch {
      if (requestGeneration === generation.current) setError(true);
    } finally {
      if (requestGeneration === generation.current) {
        inFlight.current = false;
        setIsLoading(false);
      }
    }
  }, [variant]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadPage(0); }, 0);
    return () => { window.clearTimeout(timer); generation.current += 1; inFlight.current = false; };
  }, [loadPage]);

  useEffect(() => {
    if (limit || error || !sentinel.current || !hasMore || isLoading || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadPage(page + 1);
    });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [error, hasMore, isLoading, limit, loadPage, page]);

  if (variant === "listing" && items.length === 0) return <ContentListState state={error ? "error" : isLoading ? "loading" : "empty"} pending={isLoading} retryRef={retryControl} onRetry={(event) => void loadPage(0, event.currentTarget)} />;
  if (!error && !isLoading && items.length === 0) return (
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
      <div className={variant === "listing" ? "content-list-grid" : "card-grid"} aria-busy={isLoading}>
        {items.slice(0, limit).map((item) => variant === "home" ? <HomeContentCard item={item} key={item.id} /> : variant === "listing" ? <ListingContentCard item={item} key={item.id} /> : (
          <Card className="content-card" key={item.id}>
            {item.mediaUrl?.match(/\.mp4($|\?)/i) ? <video controls src={item.mediaUrl} /> : null}
            {item.mediaUrl && !item.mediaUrl.match(/\.mp4($|\?)/i) ? <Image src={item.mediaUrl} alt={item.title} width={800} height={600} unoptimized /> : null}
            <CardHeader><div className="content-card-kicker"><ImageIcon aria-hidden="true" /> Conteúdo da comunidade</div><CardTitle>{item.title}</CardTitle></CardHeader>
            <CardContent><p>{item.description}</p><small><UserRound aria-hidden="true" /> {item.credit}</small>{item.video_url ? <a href={item.video_url} target="_blank" rel="noreferrer">Abrir vídeo ↗</a> : null}</CardContent>
            <CardFooter><ShareButton title={item.title} url={item.video_url ?? window.location.href} imageUrl={item.mediaUrl ?? undefined} /></CardFooter>
          </Card>
        ))}
      </div>
      {error ? <div className="content-feed-error"><p role="alert">Não foi possível carregar conteúdos. Tente novamente.</p><button ref={retryControl} aria-disabled={isLoading} aria-busy={isLoading} className="home-button home-button-white" type="button" onClick={(event) => void loadPage(items.length ? page + 1 : 0, event.currentTarget)}>Tentar novamente</button></div> : null}
      {!limit ? <><div ref={sentinel} className="scroll-sentinel" aria-hidden="true" />
      {isLoading ? <p role="status">Carregando conteúdos…</p> : null}
      {hasMore && (items.length > 0 || !isLoading) && !error ? <button ref={moreControl} aria-disabled={isLoading} aria-busy={isLoading} className={variant === "listing" ? "home-button home-button-yellow content-list-more" : "load-more"} type="button" onClick={(event) => void loadPage(page + 1, event.currentTarget)}>Carregar mais</button> : null}</> : null}
      {variant === "listing" && !hasMore ? <p id="content-list-end" className="sr-only" role="status" tabIndex={-1}>Todos os conteúdos foram carregados.</p> : null}
      {variant === "listing" ? <ContentListContribution /> : null}
    </>
  );
}
