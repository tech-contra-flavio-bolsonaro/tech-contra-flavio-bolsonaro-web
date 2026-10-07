import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const bucket = "community-submissions";
const maxFileSize = 25 * 1024 * 1024;
const allowedMediaTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4"]);

function cors(request: Request) {
  return {
    "Access-Control-Allow-Origin": request.headers.get("origin") ?? "null",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function reply(request: Request, body: Record<string, string | boolean>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(request), "Content-Type": "application/json" } });
}

async function verifyTurnstile(token: string, remoteip: string | null) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set("remoteip", remoteip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  return ((await response.json()) as { success?: boolean }).success === true;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: cors(request) });
  if (request.method !== "POST") return reply(request, { error: "Método não permitido." }, 405);

  try {
    const form = await request.formData();
    const token = String(form.get("cf-turnstile-response") ?? "");
    const remoteip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    if (!token || !(await verifyTurnstile(token, remoteip))) return reply(request, { error: "Não foi possível confirmar a proteção contra spam." }, 400);

    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const credit = String(form.get("credit") ?? "").trim();
    const videoUrl = String(form.get("videoUrl") ?? "").trim();
    const candidate = form.get("file");
    const file = candidate instanceof File && candidate.size > 0 ? candidate : null;
    if (title.length < 3 || title.length > 160 || description.length < 10 || description.length > 2000 || credit.length < 2 || credit.length > 160) return reply(request, { error: "Revise os campos obrigatórios." }, 400);
    if (Boolean(file) === Boolean(videoUrl)) return reply(request, { error: "Envie um arquivo ou um link de vídeo." }, 400);
    if (videoUrl) try { new URL(videoUrl); } catch { return reply(request, { error: "Informe um link de vídeo válido." }, 400); }
    if (file && (!allowedMediaTypes.has(file.type) || file.size > maxFileSize)) return reply(request, { error: "Envie JPG, PNG, WebP, GIF ou MP4 de até 25 MB." }, 400);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const mediaPath = file ? `pending/${crypto.randomUUID()}.${file.type.split("/")[1]}` : null;
    if (file && mediaPath) {
      const { error } = await supabase.storage.from(bucket).upload(mediaPath, file, { contentType: file.type, upsert: false });
      if (error) throw error;
    }
    const { error } = await supabase.from("submissions").insert({ title, description, credit, media_path: mediaPath, video_url: videoUrl || null, status: "pending" });
    if (error) {
      if (mediaPath) await supabase.storage.from(bucket).remove([mediaPath]);
      throw error;
    }
    return reply(request, { ok: true });
  } catch {
    return reply(request, { error: "Não foi possível receber o conteúdo." }, 500);
  }
});
