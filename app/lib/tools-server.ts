import { createClient } from "@supabase/supabase-js";
import { httpsUrl, type PublishedTool, type ToolCategory } from "./tools";

const fields = "id,slug,title,description,category,credit,url";
const pageSize = 10;

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase não está configurado.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function listTools(page: number, category?: string) {
  let query = database().from("tool_submissions").select(fields).eq("status", "approved");
  if (category) query = query.eq("category", category);
  const { data, error } = await query
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize);
  if (error) throw error;
  return { items: (data ?? []).slice(0, pageSize) as PublishedTool[], hasMore: (data ?? []).length > pageSize };
}

// Categories come from approved tools only, so a filter never leads to an empty published list.
export async function listToolCategories(): Promise<ToolCategory[]> {
  const { data, error } = await database().from("tool_submissions").select("category").eq("status", "approved");
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const { category } of (data ?? []) as { category: string }[]) counts.set(category, (counts.get(category) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"));
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
