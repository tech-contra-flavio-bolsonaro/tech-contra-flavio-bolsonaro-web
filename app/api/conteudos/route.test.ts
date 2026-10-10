import { NextRequest } from "next/server";
import { afterEach, expect, it, vi } from "vitest";
import { GET } from "./route";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it("returns priority in submission listings and orders by priority before recency", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://database.example.com");
  vi.stubEnv("SUPABASE_SECRET_KEY", "test-service-key");
  const submission = {
    id: "submission-1",
    title: "Conteúdo prioritário",
    description: "Descrição pública",
    credit: "Comunidade",
    priority: 12,
    media_path: null,
    video_url: null,
  };
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([submission]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }));
  vi.stubGlobal("fetch", fetch);

  const response = await GET(new NextRequest("http://localhost/api/conteudos?page=0"));

  expect(await response.json()).toEqual({ items: [{ ...submission, mediaUrl: null }], hasMore: false });
  const query = new URL(fetch.mock.calls[0][0] as string).searchParams;
  expect(query.get("select")).toBe("id,title,description,credit,priority,media_path,video_url");
  expect(query.get("order")).toBe("priority.desc,created_at.desc,id.desc");
});
