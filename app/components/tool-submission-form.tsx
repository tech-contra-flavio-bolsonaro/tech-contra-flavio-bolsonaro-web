"use client";

import Script from "next/script";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Turnstile = {
  render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
const turnstile = () => (window as Window & { turnstile?: Turnstile }).turnstile;

export function ToolSubmissionForm() {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const pending = useRef(false);
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const initialize = useCallback(() => {
    if (!container.current || !sitekey || widget.current !== null || !turnstile()) return;
    widget.current = turnstile()!.render(container.current, {
      sitekey, callback: (value) => { setToken(value); setError(""); }, "expired-callback": () => setToken(""),
      "error-callback": () => { setToken(""); setError("Não foi possível carregar a proteção contra spam. Recarregue a página."); },
    });
  }, [sitekey]);

  useEffect(() => {
    initialize();
    return () => {
      if (widget.current !== null) turnstile()?.remove(widget.current);
      widget.current = null;
    };
  }, [initialize]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    setSuccess(false);
    if (!token) { setError("Confirme a proteção contra spam antes de enviar."); return; }
    const form = event.currentTarget;
    const body = new FormData(form);
    body.set("cf-turnstile-response", token);
    pending.current = true;
    setSending(true);
    setError("");
    try {
      const response = await fetch(`${endpoint}/functions/v1/submit-tool`, { method: "POST", body });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (!response.ok || result?.ok !== true) {
        setError(typeof result?.error === "string" ? result.error : "Não foi possível enviar. Tente novamente em instantes.");
        return;
      }
      form.reset();
      setSuccess(true);
    } catch {
      setError("Não foi possível enviar. Verifique sua conexão e tente novamente.");
    } finally {
      pending.current = false;
      setSending(false);
      setToken("");
      if (widget.current !== null) turnstile()?.reset(widget.current);
    }
  }

  return (
    <>
      {sitekey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={initialize} onError={() => setError("Não foi possível carregar a proteção contra spam. Recarregue a página.")} /> : null}
      <form className="submission-form" aria-label="Envio de ferramenta" onSubmit={submit} aria-busy={sending}>
        <div className="submission-field"><Label htmlFor="tool-title">Nome *</Label><Input id="tool-title" name="title" required minLength={3} maxLength={160} placeholder="Nome da ferramenta" /></div>
        <div className="submission-field"><Label htmlFor="tool-description">Descrição *</Label><Textarea id="tool-description" name="description" required minLength={10} maxLength={2000} placeholder="O que ela faz e como pode ajudar?" /></div>
        <div className="submission-field"><Label htmlFor="tool-url">Link da ferramenta *</Label><Input id="tool-url" name="url" type="url" required maxLength={2048} placeholder="https://" /><p>Informe o endereço público da ferramenta, começando com https://.</p></div>
        <div className="submission-field"><Label htmlFor="tool-category">Categoria *</Label><Input id="tool-category" name="category" required minLength={2} maxLength={60} placeholder="Ex.: Planejamento, Comunicação" /></div>
        <div className="submission-field"><Label htmlFor="tool-credit">Crédito *</Label><Input id="tool-credit" name="credit" required minLength={2} maxLength={160} placeholder="Nome de quem criou, coletivo ou fonte" /></div>
        <div ref={container} className="turnstile-shell" />
        {!sitekey || !endpoint ? <p role="alert">O envio está temporariamente indisponível. Tente novamente mais tarde.</p> : null}
        {error ? <p role="alert">{error}</p> : null}
        {success ? <p role="status">Ferramenta recebida! Ela será publicada após a curadoria.</p> : null}
        <div className="submission-form-footer"><p>Seu envio só aparece após a curadoria.</p><Button type="submit" disabled={sending || !sitekey || !endpoint}>{sending ? "Enviando…" : "Enviar para curadoria"}</Button></div>
      </form>
    </>
  );
}
