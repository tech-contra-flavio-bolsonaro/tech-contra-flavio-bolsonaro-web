"use client";

import Script from "next/script";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Link as LinkIcon, ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

type SubmissionValues = {
  title: string;
  description: string;
  credit: string;
  file: FileList;
  videoUrl: string;
};

export function SubmissionForm() {
  const [isSending, setIsSending] = useState(false);
  const { formState: { errors }, handleSubmit, register, reset, setError } = useForm<SubmissionValues>();

  async function onSubmit(values: SubmissionValues) {
    const file = values.file?.[0];
    const videoUrl = values.videoUrl.trim();
    if (!file && !videoUrl) {
      const message = "Envie um arquivo ou informe um link de vídeo.";
      setError("file", { type: "validate", message });
      setError("videoUrl", { type: "validate", message });
      return;
    }

    const data = new FormData();
    data.set("title", values.title.trim());
    data.set("description", values.description.trim());
    data.set("credit", values.credit.trim());
    if (file) data.set("file", file);
    if (videoUrl) data.set("videoUrl", videoUrl);
    const turnstileToken = document.querySelector<HTMLInputElement>(
      'input[name="cf-turnstile-response"]',
    )?.value;

    if (!turnstileToken) {
      toast.add({ type: "warning", title: "Confirme a proteção contra spam" });
      return;
    }
    data.set("cf-turnstile-response", turnstileToken);

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

      reset();
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
      <form data-testid="submission-form-surface" className="submission-form" aria-label="Formulário de envio de conteúdo" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="submission-field">
          <Label htmlFor="title">Título *</Label>
          <Input id="title" type="text" maxLength={160} placeholder="Dê um nome para o material" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : undefined} {...register("title", { required: "Informe um título para o material.", minLength: { value: 3, message: "O título precisa ter pelo menos 3 caracteres." } })} />
          {errors.title && <p id="title-error" className="submission-field-error" role="alert">{errors.title.message}</p>}
        </div>
        <div className="submission-field">
          <Label htmlFor="description">Descrição *</Label>
          <Textarea id="description" maxLength={2000} placeholder="Contextualize o que você está compartilhando" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} {...register("description", { required: "Conte um pouco mais sobre o material.", minLength: { value: 10, message: "A descrição precisa ter pelo menos 10 caracteres." } })} />
          {errors.description && <p id="description-error" className="submission-field-error" role="alert">{errors.description.message}</p>}
        </div>
        <div className="submission-field">
          <Label htmlFor="credit">Crédito *</Label>
          <Input id="credit" type="text" maxLength={160} placeholder="Seu nome, coletivo ou fonte" aria-invalid={Boolean(errors.credit)} aria-describedby={errors.credit ? "credit-error" : undefined} {...register("credit", { required: "Informe o crédito do material.", minLength: { value: 2, message: "O crédito precisa ter pelo menos 2 caracteres." } })} />
          {errors.credit && <p id="credit-error" className="submission-field-error" role="alert">{errors.credit.message}</p>}
        </div>
        <div className="submission-media">
          <div className="submission-field">
            <Label htmlFor="file"><Upload aria-hidden="true" /> Arquivo</Label>
            <Input id="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4" aria-invalid={Boolean(errors.file)} aria-describedby={errors.file ? "file-error" : undefined} {...register("file")} />
            <p>JPG, PNG, WebP, GIF ou MP4 de até 25 MB.</p>
            {errors.file && <p id="file-error" className="submission-field-error" role="alert">{errors.file.message}</p>}
          </div>
          <span className="submission-or">ou</span>
          <div className="submission-field">
            <Label htmlFor="video-url"><LinkIcon aria-hidden="true" /> Link de vídeo</Label>
            <Input id="video-url" type="url" placeholder="https://" aria-invalid={Boolean(errors.videoUrl)} aria-describedby={errors.videoUrl ? "video-url-error" : undefined} {...register("videoUrl", { pattern: { value: /^https?:\/\/.+/, message: "Informe um link de vídeo válido." } })} />
            <p>Envie um arquivo ou informe um link.</p>
            {errors.videoUrl && <p id="video-url-error" className="submission-field-error" role="alert">{errors.videoUrl.message}</p>}
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
