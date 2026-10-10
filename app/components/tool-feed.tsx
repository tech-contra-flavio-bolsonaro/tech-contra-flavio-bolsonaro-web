"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import type { PublishedTool, ToolCategory } from "@/app/lib/tools";
import { ToolCard } from "./tool-card";

type Page = { items: PublishedTool[]; hasMore: boolean; categories?: ToolCategory[] };

// The category lives in ?categoria= so a filtered list can be shared and survives a reload.
function categoryFromUrl() {
  return new URLSearchParams(window.location.search).get("categoria")?.trim() || null;
}

export function ToolFeed({ limit, variant = "default" }: { limit?: number; variant?: "default" | "home" }) {
  const filterable = !limit;
  const [items, setItems] = useState<PublishedTool[]>([]);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  // undefined until the URL has been read, so the first request already carries the shared category.
  const [category, setCategory] = useState<string | null | undefined>(filterable ? undefined : null);
  const [page, setPage] = useState(-1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const pending = useRef(false);
  const current = useRef<string | null | undefined>(category);
  const sentinel = useRef<HTMLDivElement>(null);

  const loadPage = useCallback(async (next: number, selected: string | null, signal?: AbortSignal) => {
    if (next > 0 && pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(false);
    try {
      const query = `page=${next}${selected ? `&categoria=${encodeURIComponent(selected)}` : ""}`;
      const response = await fetch(`/api/ferramentas?${query}`, { signal, cache: "no-store" });
      if (!response.ok) throw new Error("request failed");
      const result = await response.json() as Page;
      // A slower answer for a previous category must not land in the current list.
      if (signal?.aborted || selected !== current.current) return;
      if (result.categories) setCategories(result.categories);
      setItems((loaded) => {
        let items = result.items;
        if (next !== 0) {
          const ids = new Set(loaded.map((tool) => tool.id));
          items = [...loaded, ...result.items.filter((tool) => !ids.has(tool.id))];
        }
        return items.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
      });
      setPage(next);
      setHasMore(result.hasMore);
    } catch {
      if (!signal?.aborted && selected === current.current) setError(true);
    } finally {
      pending.current = false;
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (category !== undefined) return;
    const timer = window.setTimeout(() => setCategory(categoryFromUrl()), 0);
    return () => window.clearTimeout(timer);
  }, [category]);

  useEffect(() => {
    if (category === undefined) return;
    current.current = category;
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadPage(0, category, controller.signal), 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [category, loadPage]);

  useEffect(() => {
    if (limit || error || !sentinel.current || !hasMore || loading || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadPage(page + 1, category ?? null);
    });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [category, error, hasMore, limit, loadPage, loading, page]);

  function choose(next: string | null) {
    if (next === category) return;
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("categoria", next); else url.searchParams.delete("categoria");
    window.history.replaceState(null, "", url);
    setItems([]);
    setHasMore(false);
    setCategory(next);
  }

  const total = categories.reduce((sum, item) => sum + item.count, 0);
  const shown = category ? categories.find((item) => item.name === category)?.count ?? 0 : total;
  const settled = !loading && !error && category !== undefined;

  return (
    <div aria-busy={loading}>
      {filterable && categories.length > 1 ? (
        <div className="tool-filters">
          <div className="tool-filter-list" role="group" aria-label="Filtrar ferramentas por categoria">
            <button type="button" aria-pressed={category === null} onClick={() => choose(null)}>
              Todas <span aria-hidden="true">{total}</span><span className="sr-only">, {total} ferramentas</span>
            </button>
            {categories.map((item) => (
              <button key={item.name} type="button" aria-pressed={category === item.name} onClick={() => choose(item.name)}>
                {item.name} <span aria-hidden="true">{item.count}</span><span className="sr-only">, {item.count} {item.count === 1 ? "ferramenta" : "ferramentas"}</span>
              </button>
            ))}
          </div>
          {settled && items.length > 0 ? (
            <p className="tool-filter-count" role="status">
              {shown} {shown === 1 ? "ferramenta" : "ferramentas"}{category ? ` em ${category}` : ""}
            </p>
          ) : null}
        </div>
      ) : null}
      {settled && items.length === 0 && category ? (
        <div className="content-empty-state">
          <div className="content-empty-icon"><Wrench aria-hidden="true" /></div>
          <div><h3>Nenhuma ferramenta publicada em “{category}”.</h3>
            <p>Veja todas as categorias ou sugira uma ferramenta para a curadoria.</p>
            <button type="button" className="content-empty-action" onClick={() => choose(null)}>Ver todas as ferramentas</button>{" "}
            <Link className="content-empty-action" href="/ferramentas/enviar">Sugerir uma ferramenta</Link>
          </div>
        </div>
      ) : null}
      {settled && items.length === 0 && !category ? (
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
      {error ? <div role="alert"><p>Não foi possível carregar ferramentas.</p><button className="load-more" onClick={() => void loadPage(page + 1, category ?? null)}>Tentar novamente</button></div> : null}
      {!limit ? <div ref={sentinel} className="scroll-sentinel" aria-hidden="true" /> : null}
      {!limit && hasMore && !loading && !error ? <button className="load-more" onClick={() => void loadPage(page + 1, category ?? null)}>Carregar mais ferramentas</button> : null}
    </div>
  );
}
