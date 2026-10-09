"use client";

import Image from "next/image";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { HomeArrow } from "./home-arrow";

type SubmissionValues = { title: string; description: string; credit: string; file: FileList; videoUrl: string };
type Turnstile = {
  render: (element: HTMLElement, options: { sitekey: string; size: "flexible"; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
const turnstile = () => (window as Window & { turnstile?: Turnstile }).turnstile;
const mediaTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4"]);
const successMessage = "Conteúdo recebido. Ele será publicado após a curadoria.";

export function SubmissionForm() {
  const [isSending, setIsSending] = useState(false);
  const [fileName, setFileName] = useState("");
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLParagraphElement>(null);
  const protection = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const token = useRef("");
  const pending = useRef(false);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const { formState: { errors }, handleSubmit, register, reset, setError, setFocus, clearErrors, resetField } = useForm<SubmissionValues>();

  const initialize = useCallback(() => {
    if (!protection.current || !sitekey || widget.current !== null || !turnstile()) return;
    widget.current = turnstile()!.render(protection.current, {
      sitekey, size: "flexible", callback: value => { token.current = value; },
      "expired-callback": () => { token.current = ""; },
      "error-callback": () => { token.current = ""; setFeedback({ type: "error", message: "Não foi possível carregar a proteção contra spam. Recarregue a página." }); },
    });
  }, [sitekey]);
  useEffect(() => {
    initialize();
    return () => { if (widget.current !== null) turnstile()?.remove(widget.current); widget.current = null; token.current = ""; };
  }, [initialize]);
  useEffect(() => { if (feedback) result.current?.focus(); }, [feedback]);

  async function onSubmit(values: SubmissionValues) {
    if (pending.current) return;
    setFeedback(null);
    const file = values.file?.[0];
    const videoUrl = values.videoUrl.trim();
    if (Boolean(file) === Boolean(videoUrl)) {
      const message = file ? "Escolha apenas um arquivo ou um link de vídeo." : "Envie um arquivo ou informe um link de vídeo.";
      setError("file", { type: "validate", message });
      setError("videoUrl", { type: "validate", message });
      setFocus("file");
      return;
    }
    // Scope the response to this form: another page's widget cannot authorize this submission.
    const turnstileToken = token.current || form.current?.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value;
    if (!turnstileToken) {
      setFeedback({ type: "error", message: "Confirme a proteção contra spam antes de enviar." });
      toast.add({ type: "warning", title: "Confirme a proteção contra spam" });
      return;
    }
    const data = new FormData();
    data.set("title", values.title.trim());
    data.set("description", values.description.trim());
    data.set("credit", values.credit.trim());
    if (file) data.set("file", file);
    if (videoUrl) data.set("videoUrl", videoUrl);
    data.set("cf-turnstile-response", turnstileToken);
    pending.current = true;
    setIsSending(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) throw new Error("O envio não está configurado.");
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-content`, { method: "POST", body: data });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Não foi possível enviar o conteúdo.");
      reset();
      setFileName("");
      setFeedback({ type: "success", message: successMessage });
      toast.add({ type: "success", title: "Conteúdo recebido", description: "Ele será publicado após a curadoria." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Tente novamente.";
      setFeedback({ type: "error", message });
      toast.add({ type: "error", title: "Não foi possível enviar", description: message });
    } finally {
      pending.current = false;
      setIsSending(false);
      token.current = "";
      if (widget.current !== null) turnstile()?.reset(widget.current);
    }
  }

  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={initialize} onError={() => setFeedback({ type: "error", message: "Não foi possível carregar a proteção contra spam. Recarregue a página." })} />
    <form ref={form} data-testid="submission-form-surface" className="submission-form" aria-label="Formulário de envio de conteúdo" aria-busy={isSending} noValidate onSubmit={event => { void handleSubmit(onSubmit)(event); }}>
      <div className="submission-field">
        <Label htmlFor="title">Título*</Label>
        <Input id="title" aria-label="Título *" type="text" required disabled={isSending} maxLength={160} placeholder="Dê um nome ao material" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : undefined} {...register("title", { validate: value => value.trim().length >= 3 || (value.trim() ? "O título precisa ter pelo menos 3 caracteres." : "Informe um título para o material.") })} />
        {errors.title && <p id="title-error" className="submission-field-error" role="alert">{errors.title.message}</p>}
      </div>
      <div className="submission-field">
        <Label htmlFor="description">Descrição*</Label>
        <Textarea id="description" aria-label="Descrição *" required disabled={isSending} maxLength={2000} placeholder="Descreva o que você quer compartilhar" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} {...register("description", { validate: value => value.trim().length >= 10 || (value.trim() ? "A descrição precisa ter pelo menos 10 caracteres." : "Conte um pouco mais sobre o material.") })} />
        {errors.description && <p id="description-error" className="submission-field-error" role="alert">{errors.description.message}</p>}
      </div>
      <div className="submission-field">
        <Label htmlFor="credit">Crédito*</Label>
        <Input id="credit" aria-label="Crédito *" type="text" required disabled={isSending} maxLength={160} placeholder="Nome de quem criou o material" aria-invalid={Boolean(errors.credit)} aria-describedby={errors.credit ? "credit-error" : undefined} {...register("credit", { validate: value => value.trim().length >= 2 || (value.trim() ? "O crédito precisa ter pelo menos 2 caracteres." : "Informe o crédito do material.") })} />
        {errors.credit && <p id="credit-error" className="submission-field-error" role="alert">{errors.credit.message}</p>}
      </div>
      <div className="submission-media">
        <div className="submission-field">
          <Label htmlFor="file">Arquivo</Label>
          <div className="submission-upload" data-invalid={Boolean(errors.file)} data-disabled={isSending}>
            <input id="file" type="file" disabled={isSending} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4" aria-invalid={Boolean(errors.file)} aria-describedby={`file-formats${errors.file ? " file-error" : ""}`} {...register("file", {
              onChange: event => { setFileName(event.target.files?.[0]?.name ?? ""); clearErrors(["file", "videoUrl"]); },
              validate: files => {
                const file = files?.[0];
                if (!file) return true;
                if (file.size === 0) return "O arquivo não pode estar vazio.";
                if (!mediaTypes.has(file.type)) return "Envie JPG, PNG, WebP, GIF ou MP4.";
                return file.size <= 25 * 1024 * 1024 || "O arquivo deve ter até 25 MB.";
              },
            })} />
            <svg className="submission-upload-border" width="100%" height="100%" aria-hidden="true"><rect width="100%" height="100%" rx="4" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="12 12" /></svg>
            <span className="submission-upload-icon" aria-hidden="true"><Image src="/images/send-upload.svg" alt="" width={54} height={54} unoptimized /></span>
            <span className="submission-upload-action">{fileName || "Selecionar arquivo"}</span>
            <p id="file-formats">JPG, PNG, WebP, GIF ou MP4 até 25 MB</p>
          </div>
          {fileName && <button className="submission-remove" type="button" disabled={isSending} onClick={() => { resetField("file"); setFileName(""); clearErrors(["file", "videoUrl"]); setFocus("file"); }}>Remover arquivo</button>}
          {errors.file && <p id="file-error" className="submission-field-error" role="alert">{errors.file.message}</p>}
        </div>
        <span className="submission-or">ou</span>
        <div className="submission-field">
          <Label htmlFor="video-url">Link de vídeo</Label>
          <Input id="video-url" type="url" disabled={isSending} placeholder="https://" aria-invalid={Boolean(errors.videoUrl)} aria-describedby={`video-url-hint${errors.videoUrl ? " video-url-error" : ""}`} {...register("videoUrl", {
            onChange: () => clearErrors(["file", "videoUrl"]),
            validate: value => {
              if (!value.trim()) return true;
              try { return ["https:", "http:"].includes(new URL(value.trim()).protocol) || "Informe um link de vídeo válido."; }
              catch { return "Informe um link de vídeo válido."; }
            },
          })} />
          <p id="video-url-hint">Envie um arquivo ou informe um link.</p>
          {errors.videoUrl && <p id="video-url-error" className="submission-field-error" role="alert">{errors.videoUrl.message}</p>}
        </div>
      </div>
      <div ref={protection} className="turnstile-shell" />
      {feedback && <p ref={result} className="submission-feedback" tabIndex={-1} role={feedback.type === "error" ? "alert" : "status"}>{feedback.message}</p>}
      <div className="submission-form-footer">
        <p>Seu envio só aparece após a curadoria.</p>
        <Button type="submit" size="lg" disabled={isSending}>{isSending ? "Enviando…" : "Enviar para curadoria"}<HomeArrow /></Button>
      </div>
    </form>
  </>;
}
