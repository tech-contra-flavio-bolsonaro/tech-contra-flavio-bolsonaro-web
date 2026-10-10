import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { resolveServerSupabaseUrl } from "@/app/lib/supabase-url";

export type PublishedContent = {
  id: string;
  title: string;
  description: string;
  credit: string;
  priority: number;
  media_path: string | null;
  mediaUrl: string | null;
  video_url: string | null;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function database() {
  const url = resolveServerSupabaseUrl();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase não está configurado.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function listPublishedContentIds(): Promise<string[]> {
  const { data, error } = await database()
    .from("submissions")
    .select("id")
    .eq("status", "approved")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as { id: string }[]).map(({ id }) => id);
}

export const findPublishedContent = cache(async (id: string): Promise<PublishedContent | null> => {
  if (!uuidPattern.test(id)) return null;

  const client = database();
  const { data, error } = await client
    .from("submissions")
    .select("id,title,description,credit,priority,media_path,video_url")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const content = data as Omit<PublishedContent, "mediaUrl">;
  if (!content.media_path) return { ...content, mediaUrl: null };

  const { data: signed, error: signedError } = await client.storage
    .from("community-submissions")
    .createSignedUrl(content.media_path, 60 * 15);
  if (signedError) throw signedError;
  return { ...content, mediaUrl: signed.signedUrl };
});
