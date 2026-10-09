import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHandler } from "./handler.ts";
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
Deno.serve(createHandler({
  verifyTurnstile: async (token) => {
    const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (!secret) throw new Error("Protection unavailable");
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body: new URLSearchParams({ secret, response: token }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Protection unavailable");
    return ((await response.json()) as { success?: boolean }).success === true;
  },
  recordSignature: async (row, tokenHash) => {
    const { data, error } = await supabase.rpc("record_manifesto_signature", {
      p_name: row.name, p_email: row.email, p_phone: row.phone, p_work_area: row.work_area,
      p_consent: row.consent, p_manifesto_version: row.manifesto_version, p_consent_version: row.consent_version, p_token_hash: tokenHash,
    });
    if (error) throw new Error("Storage unavailable");
    return data === true;
  },
}));
