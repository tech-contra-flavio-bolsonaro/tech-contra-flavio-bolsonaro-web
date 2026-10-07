"use client";

import Script from "next/script";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function SubmissionForm() {
  const [isSending, setIsSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const turnstileToken = document.querySelector<HTMLInputElement>(
      'input[name="cf-turnstile-response"]',
    )?.value;

    if (!turnstileToken) {
      toast.add({ type: "warning", title: "Confirme a proteção contra spam" });
      return;
    }

    setIsSending(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) throw new Error("O envio não está configurado.");
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-content`, {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Não foi possível enviar o conteúdo.");

      form.reset();
      toast.add({ type: "success", title: "Conteúdo recebido", description: "Ele será publicado após a curadoria." });
    } catch (error) {
      toast.add({ type: "error", title: "Não foi possível enviar", description: error instanceof Error ? error.message : "Tente novamente." });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <form className="upload-form" aria-label="Formulário de envio de conteúdo" onSubmit={onSubmit}>
        <label htmlFor="title">Título</label>
        <input id="title" name="title" type="text" minLength={3} maxLength={160} required />
        <label htmlFor="description">Descrição</label>
        <textarea id="description" name="description" minLength={10} maxLength={2000} required />
        <label htmlFor="credit">Crédito</label>
        <input id="credit" name="credit" type="text" minLength={2} maxLength={160} required />
        <label htmlFor="file">Imagem ou vídeo (até 25 MB)</label>
        <input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4" />
        <label htmlFor="video-url">ou link de vídeo</label>
        <input id="video-url" name="videoUrl" type="url" placeholder="https://" />
        <p className="form-hint">Escolha um arquivo ou informe um link de vídeo.</p>
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        <Button type="submit" disabled={isSending}>{isSending ? "Enviando…" : "Enviar para curadoria"}</Button>
      </form>
    </>
  );
}
