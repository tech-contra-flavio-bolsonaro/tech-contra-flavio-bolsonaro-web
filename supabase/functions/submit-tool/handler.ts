import { cors } from "../_shared/cors.ts";
import { parsePublicHttpsUrl } from "../_shared/public-https-url.ts";

export type ToolRow = { title: string; description: string; category: string; credit: string; url: string; status: "pending" };

export type Deps = {
  verifyTurnstile: (token: string, remoteip: string | null) => Promise<boolean>;
  insertTool: (row: ToolRow) => Promise<void>;
};

export { parsePublicHttpsUrl };

function reply(request: Request, body: Record<string, string | boolean>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(request), "Content-Type": "application/json" } });
}

const inRange = (value: string, min: number, max: number) => value.length >= min && value.length <= max;

export function createHandler({ verifyTurnstile, insertTool }: Deps) {
  return async (request: Request) => {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors(request) });
    if (request.method !== "POST") return reply(request, { error: "Método não permitido." }, 405);

    try {
      let form: FormData;
      try { form = await request.formData(); }
      catch { return reply(request, { error: "Envie os campos em um formulário válido." }, 400); }
      const token = String(form.get("cf-turnstile-response") ?? "");
      const remoteip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
      if (!token || !(await verifyTurnstile(token, remoteip))) return reply(request, { error: "Não foi possível confirmar a proteção contra spam." }, 400);

      const field = (name: string) => String(form.get(name) ?? "").trim();
      const title = field("title");
      const description = field("description");
      const category = field("category");
      const credit = field("credit");
      if (!inRange(title, 3, 160) || !inRange(description, 10, 2000) || !inRange(category, 2, 60) || !inRange(credit, 2, 160)) return reply(request, { error: "Revise os campos obrigatórios." }, 400);
      const url = parsePublicHttpsUrl(field("url"));
      if (!url) return reply(request, { error: "Informe um link HTTPS público válido." }, 400);

      await insertTool({ title, description, category, credit, url, status: "pending" });
      return reply(request, { ok: true });
    } catch {
      return reply(request, { error: "Não foi possível receber a ferramenta." }, 500);
    }
  };
}
