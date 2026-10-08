import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHandler } from "./handler.ts";

async function verifyTurnstile(token: string, remoteip: string | null) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) {
    console.error("submit-tool: TURNSTILE_SECRET_KEY is not configured.");
    throw new Error("Turnstile is not configured");
  }
  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set("remoteip", remoteip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  return ((await response.json()) as { success?: boolean }).success === true;
}

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(createHandler({
  verifyTurnstile,
  insertTool: async (row) => {
    const { error } = await supabase.from("tool_submissions").insert(row);
    if (error) throw error;
  },
}));
