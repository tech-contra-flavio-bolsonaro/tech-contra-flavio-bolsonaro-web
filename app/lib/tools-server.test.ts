// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { findTool, findToolEmbed, listToolCategories, listTools } from "./tools-server";
import { resolveServerSupabaseUrl } from "./supabase-url";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://database.example.com");
  vi.stubEnv("SUPABASE_SECRET_KEY", "test-service-key");
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

it("prefers SUPABASE_URL_INTERNAL over NEXT_PUBLIC_SUPABASE_URL for server calls", async () => {
  vi.stubEnv("SUPABASE_URL_INTERNAL", "http://host.docker.internal:54321");
  const fetch = vi.fn().mockResolvedValue(json([]));
  vi.stubGlobal("fetch", fetch);
  await listTools(0);
  expect(new URL(fetch.mock.calls[0][0]).origin).toBe("http://host.docker.internal:54321");
});

it("requests only approved public fields with stable ordering and a pagination lookahead", async () => {
  const fetch = vi.fn().mockResolvedValue(json(Array.from({ length: 11 }, (_, id) => ({ id: String(id) }))));
  vi.stubGlobal("fetch", fetch);
  const result = await listTools(2);
  expect(result.items).toHaveLength(10);
  expect(result.hasMore).toBe(true);
  const query = new URL(fetch.mock.calls[0][0]).searchParams;
  expect(query.get("status")).toBe("eq.approved");
  expect(query.get("select")).toBe("id,slug,title,description,category,credit,url,priority,is_internal");
  expect(query.get("offset")).toBe("20");
  expect(query.get("limit")).toBe("11");
  expect(query.get("order")).toBe("priority.desc,created_at.desc,id.desc");
});

it("uses the internal Supabase URL for server-side tool queries when configured", async () => {
  vi.stubEnv("SUPABASE_URL_INTERNAL", "http://supabase.internal:54321");
  const fetch = vi.fn().mockResolvedValue(json([]));
  vi.stubGlobal("fetch", fetch);

  await listTools(0);

  expect(new URL(fetch.mock.calls[0][0]).origin).toBe("http://supabase.internal:54321");
  expect(resolveServerSupabaseUrl()).toBe("http://supabase.internal:54321");
});

it("returns no detail when an approved slug is absent, without querying pending records", async () => {
  const fetch = vi.fn().mockResolvedValue(json([]));
  vi.stubGlobal("fetch", fetch);
  expect(await findTool("pending-tool")).toBeNull();
  const query = new URL(fetch.mock.calls[0][0]).searchParams;
  expect(query.get("status")).toBe("eq.approved");
  expect(query.get("slug")).toBe("eq.pending-tool");
});

it("requires exact hostname approval and checks publication again for an embed", async () => {
  const fetch = vi.fn().mockResolvedValueOnce(json([{ embed_url: "https://tools.example.com/embed" }])).mockResolvedValueOnce(json([{ hostname: "tools.example.com" }]));
  vi.stubGlobal("fetch", fetch);
  expect(await findToolEmbed("mapa")).toBe("https://tools.example.com/embed");
  expect(new URL(fetch.mock.calls[0][0]).searchParams.get("status")).toBe("eq.approved");
  expect(new URL(fetch.mock.calls[1][0]).searchParams.get("hostname")).toBe("eq.tools.example.com");
});

it("falls back to external access when approval has been revoked", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(json([{ embed_url: "https://tools.example.com/embed" }])).mockResolvedValueOnce(json([])));
  expect(await findToolEmbed("mapa")).toBeNull();
});

it.each(["javascript:alert(1)", "http://example.com", "https://user:pass@example.com", "https://example.com:8443/embed"])("rejects unsafe embed URLs before checking the allowlist: %s", async (embed_url) => {
  const fetch = vi.fn().mockResolvedValue(json([{ embed_url }]));
  vi.stubGlobal("fetch", fetch);
  expect(await findToolEmbed("mapa")).toBeNull();
  expect(fetch).toHaveBeenCalledTimes(1);
});

it("does not turn database failures into an empty published collection", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ message: "unavailable" }, 401)));
  await expect(listTools(0)).rejects.toMatchObject({ message: "unavailable" });
});

it("filters the approved listing by exact category", async () => {
  const fetch = vi.fn().mockResolvedValue(json([]));
  vi.stubGlobal("fetch", fetch);
  await listTools(0, "Mapa da virada");
  const query = new URL(fetch.mock.calls[0][0]).searchParams;
  expect(query.get("status")).toBe("eq.approved");
  expect(query.get("category")).toBe("eq.Mapa da virada");
});

it("counts categories from approved tools only, largest first", async () => {
  const fetch = vi.fn().mockResolvedValue(json([{ category: "Jogos" }, { category: "Mapa da virada" }, { category: "Mapa da virada" }, { category: "Chegar à urna" }]));
  vi.stubGlobal("fetch", fetch);
  expect(await listToolCategories()).toEqual([{ name: "Mapa da virada", count: 2 }, { name: "Chegar à urna", count: 1 }, { name: "Jogos", count: 1 }]);
  const query = new URL(fetch.mock.calls[0][0]).searchParams;
  expect(query.get("status")).toBe("eq.approved");
  expect(query.get("select")).toBe("category");
});
