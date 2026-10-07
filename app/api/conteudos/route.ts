import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { resolveServerSupabaseUrl } from "@/app/lib/supabase-url";

const pageSize = 10;

type Submission = {
  id: string;
  title: string;
  description: string;
  credit: string;
  media_path: string | null;
  video_url: string | null;
};

function supabase() {
  const url = resolveServerSupabaseUrl();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase não está configurado.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET(request: NextRequest) {
  try {
    const pageValue = Number(request.nextUrl.searchParams.get("page") ?? "0");
    const page = Number.isSafeInteger(pageValue) && pageValue >= 0 ? pageValue : 0;
    const client = supabase();
    const { data, error } = await client
      .from("submissions")
      .select("id,title,description,credit,media_path,video_url")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(page * pageSize, page * pageSize + pageSize);
    if (error) throw error;

    const hasMore = (data ?? []).length > pageSize;
    const items = await Promise.all(((data ?? []) as Submission[]).slice(0, pageSize).map(async (submission) => {
      if (!submission.media_path) return { ...submission, mediaUrl: null };
      const { data: signed, error: signedError } = await client.storage
        .from("community-submissions")
        .createSignedUrl(submission.media_path, 60 * 15);
      if (signedError) throw signedError;
      return { ...submission, mediaUrl: signed.signedUrl };
    }));
    return NextResponse.json({ items, hasMore });
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar conteúdos." }, { status: 500 });
  }
}
