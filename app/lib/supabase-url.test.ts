import { describe, expect, it } from "vitest";
import { resolveServerSupabaseUrl } from "./supabase-url";

describe("resolveServerSupabaseUrl", () => {
  it("prefers the private network URL when one is configured", () => {
    expect(resolveServerSupabaseUrl({
      SUPABASE_URL_INTERNAL: "http://host.docker.internal:54321",
      NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321",
    })).toBe("http://host.docker.internal:54321");
  });

  it("uses the public URL in production when no private URL exists", () => {
    expect(resolveServerSupabaseUrl({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co" }))
      .toBe("https://example.supabase.co");
  });
});
