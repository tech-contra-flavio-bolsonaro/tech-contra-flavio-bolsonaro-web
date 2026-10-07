"use client";

import Script from "next/script";
import { FormEvent, useState } from "react";
import { ArrowRight, Link as LinkIcon, ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      <form data-testid="submission-form-surface" className="submission-form" aria-label="Formulário de envio de conteúdo" onSubmit={onSubmit}>
        <div className="submission-field">
          <Label htmlFor="title">Título *</Label>
          <Input id="title" name="title" type="text" minLength={3} maxLength={160} required placeholder="Dê um nome para o material" />
        </div>
        <div className="submission-field">
          <Label htmlFor="description">Descrição *</Label>
          <Textarea id="description" name="description" minLength={10} maxLength={2000} required placeholder="Contextualize o que você está compartilhando" />
        </div>
        <div className="submission-field">
          <Label htmlFor="credit">Crédito *</Label>
          <Input id="credit" name="credit" type="text" minLength={2} maxLength={160} required placeholder="Seu nome, coletivo ou fonte" />
        </div>
        <div className="submission-media">
          <div className="submission-field">
            <Label htmlFor="file"><Upload aria-hidden="true" /> Arquivo</Label>
            <Input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4" />
            <p>JPG, PNG, WebP, GIF ou MP4 de até 25 MB.</p>
          </div>
          <span className="submission-or">ou</span>
          <div className="submission-field">
            <Label htmlFor="video-url"><LinkIcon aria-hidden="true" /> Link de vídeo</Label>
            <Input id="video-url" name="videoUrl" type="url" placeholder="https://" />
            <p>Envie um arquivo ou informe um link.</p>
          </div>
        </div>
        <div className="turnstile-shell">
          <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </div>
        <div className="submission-form-footer">
          <p><ShieldCheck aria-hidden="true" /> Seu envio só aparece após a curadoria.</p>
          <Button type="submit" size="lg" disabled={isSending}>{isSending ? "Enviando…" : "Enviar para curadoria"}<ArrowRight aria-hidden="true" /></Button>
        </div>
      </form>
    </>
  );
}
