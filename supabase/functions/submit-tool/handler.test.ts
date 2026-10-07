// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createHandler, parsePublicHttpsUrl } from "./handler";

const valid = {
  title: "Calculadora de impostos",
  description: "Simula quanto cada pessoa paga de imposto.",
  category: "Economia",
  credit: "Maria",
  url: "https://example.com/calc",
  "cf-turnstile-response": "token",
};

function setup(turnstile = true) {
  const insertTool = vi.fn().mockResolvedValue(undefined);
  const verifyTurnstile = vi.fn().mockResolvedValue(turnstile);
  const handler = createHandler({ verifyTurnstile, insertTool });
  const post = (fields: Record<string, string>) => {
    const body = new FormData();
    for (const [key, value] of Object.entries(fields)) body.set(key, value);
    return handler(new Request("https://fn.test", { method: "POST", body, headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } }));
  };
  return { insertTool, verifyTurnstile, handler, post };
}

describe("submit-tool", () => {
  it("creates a pending submission and ignores privileged fields", async () => {
    const { post, insertTool, verifyTurnstile } = setup();
    const response = await post({ ...valid, status: "approved", slug: "x", embed_url: "https://evil.example", reviewed_by: "u" });
    expect(response.status).toBe(200);
    expect(verifyTurnstile).toHaveBeenCalledWith("token", "1.2.3.4");
    expect(insertTool).toHaveBeenCalledExactlyOnceWith({
      title: valid.title, description: valid.description, category: valid.category, credit: valid.credit, url: "https://example.com/calc", status: "pending",
    });
  });

  it("rejects failed Turnstile without inserting", async () => {
    const { post, insertTool } = setup(false);
    expect((await post(valid)).status).toBe(400);
    expect(insertTool).not.toHaveBeenCalled();
  });

  it("rejects a missing token without calling Turnstile", async () => {
    const { post, insertTool, verifyTurnstile } = setup();
    expect((await post({ ...valid, "cf-turnstile-response": "" })).status).toBe(400);
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(insertTool).not.toHaveBeenCalled();
  });

  it.each([
    ["short title", { title: "ab" }],
    ["short description", { description: "curta" }],
    ["blank category", { category: " " }],
    ["long credit", { credit: "x".repeat(161) }],
    ["http url", { url: "http://example.com" }],
    ["missing url", { url: "" }],
  ])("rejects invalid input: %s", async (_name, override) => {
    const { post, insertTool } = setup();
    expect((await post({ ...valid, ...override })).status).toBe(400);
    expect(insertTool).not.toHaveBeenCalled();
  });

  it("returns 500 when storage fails and 405 for non-POST", async () => {
    const { post, insertTool, handler } = setup();
    insertTool.mockRejectedValue(new Error("db"));
    expect((await post(valid)).status).toBe(500);
    expect((await handler(new Request("https://fn.test"))).status).toBe(405);
  });

  it("rejects a malformed request without treating it as a server failure", async () => {
    const { handler, insertTool } = setup();
    const response = await handler(new Request("https://fn.test", { method: "POST", body: "not a form" }));
    expect(response.status).toBe(400);
    expect(insertTool).not.toHaveBeenCalled();
  });

  it("reports verification service failures as server errors, without inserting", async () => {
    const { post, verifyTurnstile, insertTool } = setup();
    verifyTurnstile.mockRejectedValue(new Error("configuration or network failure"));
    expect((await post(valid)).status).toBe(500);
    expect(insertTool).not.toHaveBeenCalled();
  });
});

describe("parsePublicHttpsUrl", () => {
  it.each([
    "http://example.com", "ftp://example.com", "javascript:alert(1)", "https://user:pw@example.com",
    "https://localhost", "https://app.localhost", "https://intranet", "https://printer.local", "https://db.internal",
    "https://127.0.0.1", "https://10.0.0.5", "https://192.168.1.1", "https://169.254.169.254", "https://2130706433",
    "https://0x7f.1", "https://[::1]", "https://[fd00::1]", "not a url", "",
  ])("rejects %s", (value) => expect(parsePublicHttpsUrl(value)).toBeNull());

  it("accepts public HTTPS and normalizes", () => {
    expect(parsePublicHttpsUrl("https://Example.com/a?b=1")).toBe("https://example.com/a?b=1");
    expect(parsePublicHttpsUrl("https://sub.example.com:8443/")).toBe("https://sub.example.com:8443/");
  });

  it("rejects a URL whose encoded form exceeds the database limit", () => {
    expect(parsePublicHttpsUrl("https://example.com/" + "á".repeat(400))).toBeNull();
  });
});
