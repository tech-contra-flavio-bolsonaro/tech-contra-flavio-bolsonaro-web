"use client";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { HomeArrow } from "./home-arrow";
import { CONSENT_TEXT, normalizeEmail, normalizePhone, validText } from "@/supabase/functions/_shared/manifesto";
type Values = { name: string; email: string; phone: string; work_area: string; consent: boolean };
type Turnstile = {
  render: (element: HTMLElement, options: { sitekey: string; size: "flexible"; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
const turnstile = () => (window as Window & { turnstile?: Turnstile }).turnstile;
const successMessage = "Solicitação de assinatura recebida. Obrigado por fazer junto!";
export function ManifestoSignatureForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ defaultValues: { name: "", email: "", phone: "", work_area: "", consent: false } });
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const pending = useRef(false);
  const feedback = useRef<HTMLParagraphElement>(null);
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const initialize = useCallback(() => {
    if (!container.current || !sitekey || widget.current !== null || !turnstile()) return;
    widget.current = turnstile()!.render(container.current, {
      sitekey, size: "flexible", callback: value => { setToken(value); setError(""); },
      "expired-callback": () => setToken(""),
      "error-callback": () => { setToken(""); setError("Não foi possível carregar a proteção contra spam. Recarregue a página."); },
    });
  }, [sitekey]);
  useEffect(() => {
    initialize();
    return () => { if (widget.current !== null) turnstile()?.remove(widget.current); widget.current = null; };
  }, [initialize]);
  useEffect(() => { if (error || success) feedback.current?.focus(); }, [error, success]);
  async function submit(values: Values) {
    if (pending.current) return;
    setSuccess(false);
    if (!token) { setError("Confirme a proteção contra spam antes de assinar."); return; }
    const body = new FormData();
    body.set("name", values.name.trim());
    body.set("email", normalizeEmail(values.email)!);
    body.set("phone", normalizePhone(values.phone)!);
    body.set("work_area", values.work_area.trim());
    body.set("consent", "true");
    body.set("cf-turnstile-response", token);
    pending.current = true;
    setSending(true);
    setError("");
    try {
      const response = await fetch(`${endpoint}/functions/v1/submit-manifesto`, { method: "POST", body, signal: AbortSignal.timeout(20000) });
      const result = await response.json().catch(() => null) as { ok?: boolean } | null;
      if (!response.ok || result?.ok !== true) throw new Error("Unable to submit");
      reset(); setSuccess(true);
      toast.add({ type: "success", title: "Solicitação de assinatura recebida", description: "Obrigado por fazer junto!" });
    } catch {
      const message = "Não foi possível registrar sua assinatura. Verifique sua conexão, confirme novamente a proteção contra spam e tente outra vez.";
      setError(message); toast.add({ type: "error", title: "Não foi possível assinar", description: message });
    } finally {
      pending.current = false; setSending(false); setToken("");
      if (widget.current !== null) turnstile()?.reset(widget.current);
    }
  }
  const fields = [
    { key: "name", label: "Nome *", type: "text", autoComplete: "name", max: 160, placeholder: "Seu nome", validate: (v: string) => validText(v, 160) || "Informe seu nome (2 a 160 caracteres)." },
    { key: "email", label: "E-mail *", type: "email", autoComplete: "email", max: 254, placeholder: "voce@exemplo.com", validate: (v: string) => Boolean(normalizeEmail(v)) || "Informe um e-mail válido." },
    { key: "phone", label: "Telefone com DDD *", type: "tel", autoComplete: "tel", max: 32, placeholder: "(11) 99999-0000", validate: (v: string) => Boolean(normalizePhone(v)) || "Informe um telefone brasileiro válido com DDD." },
    { key: "work_area", label: "Área de atuação na tecnologia *", type: "text", autoComplete: "organization-title", max: 120, placeholder: "Ex.: Front-end, Back-end, Dados, UX/UI", validate: (v: string) => validText(v, 120) || "Informe sua área de atuação na tecnologia (2 a 120 caracteres)." },
  ] as const;
  return <>
    {sitekey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={initialize} onError={() => setError("Não foi possível carregar a proteção contra spam. Recarregue a página.")} /> : null}
    <form className="submission-form manifesto-form" aria-label="Assinatura do manifesto" noValidate onSubmit={event => { void handleSubmit(submit)(event); }} aria-busy={sending}>
      {fields.map(field => <div className="submission-field" key={field.key}>
        <Label htmlFor={`signature-${field.key}`}>{field.label}</Label>
        <Input id={`signature-${field.key}`} type={field.type} autoComplete={field.autoComplete} maxLength={field.max} placeholder={field.placeholder} required aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `signature-${field.key}-error` : field.key === "phone" ? "signature-phone-hint" : undefined} {...register(field.key, { validate: field.validate })} />
        {field.key === "phone" && <p id="signature-phone-hint">Celular ou telefone fixo brasileiro, incluindo o DDD.</p>}
        {errors[field.key] && <p className="submission-field-error" id={`signature-${field.key}-error`} role="alert">{errors[field.key]?.message}</p>}
      </div>)}
      <div className="submission-field">
        <Label className="manifesto-consent" htmlFor="signature-consent"><input id="signature-consent" type="checkbox" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "signature-consent-error" : undefined} {...register("consent", { validate: value => value === true || "Confirme o aceite para assinar o manifesto." })} /><span>{CONSENT_TEXT}</span></Label>
        {errors.consent && <p className="submission-field-error" id="signature-consent-error" role="alert">{errors.consent.message}</p>}
      </div>
      <div ref={container} className="turnstile-shell" />
      {!sitekey || !endpoint ? <p role="alert">O envio está temporariamente indisponível. Tente novamente mais tarde.</p> : null}
      {error || success ? <p ref={feedback} className="manifesto-feedback" tabIndex={-1} role={error ? "alert" : "status"}>{error || successMessage}</p> : null}
      <Button className="manifesto-submit" type="submit" disabled={sending || !sitekey || !endpoint}>{sending ? "Enviando…" : "Confirmar assinatura"}<HomeArrow /></Button>
    </form>
  </>;
}
