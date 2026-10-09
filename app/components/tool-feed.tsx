"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import type { PublishedTool } from "@/app/lib/tools";
import { ToolCard } from "./tool-card";

export function ToolFeed({ limit, variant = "default" }: { limit?: number; variant?: "default" | "home" }) {
  const [items, setItems] = useState<PublishedTool[]>([]);
  const [page, setPage] = useState(-1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const pending = useRef(false);

  const loadPage = useCallback(async (next: number, signal?: AbortSignal) => {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`/api/ferramentas?page=${next}`, { signal, cache: "no-store" });
      if (!response.ok) throw new Error("request failed");
      const result = await response.json() as { items: PublishedTool[]; hasMore: boolean };
      if (signal?.aborted) return;
      setItems((current) => {
        if (next === 0) return result.items;
        const loaded = new Set(current.map((tool) => tool.id));
        return [...current, ...result.items.filter((tool) => !loaded.has(tool.id))];
      });
      setPage(next);
      setHasMore(result.hasMore);
    } catch {
      if (!signal?.aborted) setError(true);
    } finally {
      pending.current = false;
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadPage(0, controller.signal), 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [loadPage]);

  return (
    <div aria-busy={loading}>
      {!loading && !error && items.length === 0 ? (
        <div className="content-empty-state">
          <div className="content-empty-icon"><Wrench aria-hidden="true" /></div>
          <div><h3>Ainda não há ferramentas publicadas.</h3>
            <p>Conhece uma ferramenta útil? Envie uma sugestão para a curadoria.</p>
            <Link className="content-empty-action" href="/ferramentas/enviar">Sugerir uma ferramenta</Link>
          </div>
        </div>
      ) : null}
      {items.length > 0 ? <div className="card-grid">{items.slice(0, limit).map((tool, index) => <ToolCard key={tool.id} tool={tool} variant={variant} index={index} />)}</div> : null}
      {loading ? <p role="status">Carregando ferramentas…</p> : null}
      {error ? <div role="alert"><p>Não foi possível carregar ferramentas.</p><button className="load-more" onClick={() => void loadPage(page + 1)}>Tentar novamente</button></div> : null}
      {!limit && hasMore && !loading && !error ? <button className="load-more" onClick={() => void loadPage(page + 1)}>Carregar mais ferramentas</button> : null}
    </div>
  );
}
