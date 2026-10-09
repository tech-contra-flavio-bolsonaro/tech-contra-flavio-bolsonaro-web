// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { findPublishedContent } from "./published-content";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const id = "123e4567-e89b-42d3-a456-426614174000";
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

it("only resolves approved content and returns a fresh URL for uploaded media", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://database.example.com");
  vi.stubEnv("SUPABASE_SECRET_KEY", "test-service-key");
  const fetch = vi.fn()
    .mockResolvedValueOnce(json({
      id,
      title: "Conteúdo aprovado",
      description: "Descrição pública",
      credit: "Comunidade",
      media_path: "approved/image.png",
      video_url: null,
    }))
    .mockResolvedValueOnce(json({ signedURL: "/object/sign/community-submissions/approved/image.png?token=temporary" }));
  vi.stubGlobal("fetch", fetch);

  await expect(findPublishedContent(id)).resolves.toMatchObject({
    id,
    title: "Conteúdo aprovado",
    mediaUrl: "https://database.example.com/storage/v1/object/sign/community-submissions/approved/image.png?token=temporary",
  });
  const query = new URL(fetch.mock.calls[0][0] as string);
  expect(query.searchParams.get("status")).toBe("eq.approved");
  expect(query.searchParams.get("id")).toBe(`eq.${id}`);
});

it("does not query the database for malformed IDs", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);

  await expect(findPublishedContent("pending")).resolves.toBeNull();
  expect(fetch).not.toHaveBeenCalled();
});

it("returns no detail when the item is not approved or does not exist", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://database.example.com");
  vi.stubEnv("SUPABASE_SECRET_KEY", "test-service-key");
  const fetch = vi.fn().mockResolvedValue(json(null));
  vi.stubGlobal("fetch", fetch);

  await expect(findPublishedContent(id)).resolves.toBeNull();
  expect(new URL(fetch.mock.calls[0][0] as string).searchParams.get("status")).toBe("eq.approved");
});
