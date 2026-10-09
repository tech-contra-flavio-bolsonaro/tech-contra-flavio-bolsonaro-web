import { MANIFESTO_VERSION, CONSENT_VERSION, normalizeEmail, normalizePhone, validText } from "../_shared/manifesto.ts";
export type SignatureRow = { name: string; email: string; phone: string; work_area: string; consent: true; manifesto_version: string; consent_version: string };
type Deps = { verifyTurnstile: (token: string) => Promise<boolean>; recordSignature: (row: SignatureRow, tokenHash: string) => Promise<boolean> };
const maxBody = 16384;
const protectionError = "Não foi possível confirmar a proteção contra spam. Tente novamente.";
function cors(request: Request) {
  return { "Access-Control-Allow-Origin": request.headers.get("origin") ?? "null", "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", Vary: "Origin" };
}
function reply(request: Request, body: { ok?: boolean; error?: string }, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(request), "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
async function readBoundedForm(request: Request): Promise<FormData | null> {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBody) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new Response(bytes, { headers: { "content-type": request.headers.get("content-type") ?? "" } }).formData();
}
export function createHandler({ verifyTurnstile, recordSignature }: Deps) {
  return async (request: Request) => {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors(request) });
    if (request.method !== "POST") return reply(request, { error: "Método não permitido." }, 405);
    if (Number(request.headers.get("content-length")) > maxBody) return reply(request, { error: "Formulário muito grande." }, 413);
    try {
      let form: FormData | null;
      try { form = await readBoundedForm(request); } catch { return reply(request, { error: "Envie um formulário válido." }, 400); }
      if (!form) return reply(request, { error: "Envie um formulário válido." }, 400);
      const field = (name: string) => { const value = form!.get(name); return typeof value === "string" ? value : ""; };
      const name = field("name").trim();
      const email = normalizeEmail(field("email"));
      const phone = normalizePhone(field("phone"));
      const work_area = field("work_area").trim();
      if (!validText(name, 160) || !email || !phone || !validText(work_area, 120) || field("consent") !== "true") return reply(request, { error: "Revise os campos obrigatórios e o aceite para assinar o manifesto." }, 400);
      const token = field("cf-turnstile-response");
      if (!token || token.length > 2048 || !(await verifyTurnstile(token))) return reply(request, { error: protectionError }, 400);
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
      const tokenHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
      const accepted = await recordSignature({ name, email, phone, work_area, consent: true, manifesto_version: MANIFESTO_VERSION, consent_version: CONSENT_VERSION }, tokenHash);
      if (!accepted) return reply(request, { error: protectionError }, 400);
      return reply(request, { ok: true });
    } catch { return reply(request, { error: "Não foi possível registrar sua assinatura. Tente novamente em instantes." }, 500); }
  };
}
