"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { httpsUrl } from "@/app/lib/tools";

export function ToolAccess({ slug, title, url, canEmbed }: { slug: string; title: string; url: string; canEmbed: boolean }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function open() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/ferramentas/${encodeURIComponent(slug)}/embed`, { cache: "no-store" });
      if (!response.ok) throw new Error("request failed");
      const result = await response.json() as { embedUrl: string | null };
      if (result.embedUrl && httpsUrl(result.embedUrl)) setEmbedUrl(result.embedUrl);
      else setMessage("Esta ferramenta está disponível pelo link externo.");
    } catch {
      setMessage("Não foi possível abrir aqui. Tente novamente ou use o link externo.");
    } finally { setLoading(false); }
  }

  return (
    <div className="tool-access">
      {canEmbed && !embedUrl ? <Button type="button" disabled={loading} onClick={() => void open()}>{loading ? "Abrindo…" : "Abrir ferramenta aqui"}</Button> : null}
      {message ? <p role="status">{message}</p> : null}
      {embedUrl ? <iframe src={embedUrl} title={title} sandbox="allow-scripts allow-forms allow-popups" referrerPolicy="no-referrer" /> : null}
      <p>{canEmbed ? "Se a ferramenta não carregar, use o link externo." : "Esta ferramenta é usada no site de origem."}</p>
      {httpsUrl(url) ? <a className="action-link" href={url} target="_blank" rel="noopener noreferrer">Abrir no site de origem (nova aba)</a> : <p role="status">O link desta ferramenta está indisponível.</p>}
    </div>
  );
}
