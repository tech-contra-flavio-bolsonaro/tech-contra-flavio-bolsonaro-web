import { createClient } from "@supabase/supabase-js";
import { resolveServerSupabaseUrl } from "./supabase-url";
import { httpsUrl, type PublishedTool } from "./tools";

const fields = "id,slug,title,description,category,credit,url";
const pageSize = 10;

function database() {
  const url = resolveServerSupabaseUrl();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase não está configurado.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function listTools(page: number) {
  const { data, error } = await database().from("tool_submissions")
    .select(fields).eq("status", "approved")
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize);
  if (error) throw error;
  return { items: (data ?? []).slice(0, pageSize) as PublishedTool[], hasMore: (data ?? []).length > pageSize };
}

export async function findTool(slug: string): Promise<PublishedTool | null> {
  const { data, error } = await database().from("tool_submissions")
    .select(fields).eq("status", "approved").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as PublishedTool | null;
}

// Re-read both publication status and domain approval when the visitor opens a tool.
export async function findToolEmbed(slug: string): Promise<string | null> {
  const client = database();
  const { data, error } = await client.from("tool_submissions")
    .select("embed_url").eq("status", "approved").eq("slug", slug).maybeSingle();
  if (error) throw error;
  const url = data?.embed_url ? httpsUrl(data.embed_url) : null;
  if (!url || (url.port && url.port !== "443")) return null;
  const { data: domain, error: domainError } = await client.from("tool_embed_domains")
    .select("hostname").eq("hostname", url.hostname).maybeSingle();
  if (domainError) throw domainError;
  return domain ? url.href : null;
}
