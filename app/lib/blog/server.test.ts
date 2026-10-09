import { afterEach, expect, it, vi } from "vitest";
import { getBlogArticle, getBlogPage } from "./server";
vi.mock("server-only", () => ({}));
const post = {
  id: 1,
  slug: "acao",
  title: "Ação e código",
  description: "Descrição",
  published_at: "2025-02-26T13:32:30Z",
  reading_time_minutes: 1,
  tag_list: ["javascript", "other"],
  user: { name: "Pachi", username: "pachi" },
  organization: { username: "techcontrabolsonaro" },
  url: "https://dev.to/techcontrabolsonaro/acao",
  body_html: "<p>ação</p>",
  cover_image: null,
};
const fetcher = vi.fn();
afterEach(() => {
  vi.unstubAllGlobals();
  fetcher.mockReset();
});
function reply(data: unknown, status = 200) {
  vi.stubGlobal("fetch", fetcher);
  fetcher.mockResolvedValue(new Response(JSON.stringify(data), { status }));
}
it("fetches all tags from the fixed organization with 5-minute cache", async () => {
  reply([post]);
  const r = await getBlogPage(1);
  expect(r.status).toBe("ok");
  if (r.status === "ok") {
    expect(r.articles[0].tags).toEqual(["javascript", "other"]);
    expect(r.hasNext).toBe(false);
  }
  expect(fetcher).toHaveBeenCalledWith(
    "https://dev.to/api/organizations/techcontrabolsonaro/articles?page=1&per_page=6",
    expect.objectContaining({
      next: { revalidate: 300 },
      redirect: "error",
      headers: expect.objectContaining({
        Accept: "application/vnd.forem.api-v1+json",
        "User-Agent": expect.any(String),
      }),
    }),
  );
});
it("renders an explicit empty page", async () => {
  reply([]);
  expect(await getBlogPage(1)).toEqual({
    status: "ok",
    articles: [],
    hasNext: false,
  });
});
it.each([
  { organization: { username: "other" } },
  { published_at: null },
  { id: 2 },
])("rejects foreign, unpublished or mismatching detail %j", async (patch) => {
  reply({ ...post, ...patch });
  expect(await getBlogArticle("1")).toEqual({ status: "not-found" });
});
it("does not fetch invalid ids", async () => {
  reply(post);
  expect(await getBlogArticle("https://evil.test")).toEqual({
    status: "not-found",
  });
  expect(fetcher).not.toHaveBeenCalled();
});
it("accepts owned published detail and string detail tags", async () => {
  reply({ ...post, tag_list: "javascript, beginners" });
  const r = await getBlogArticle("1");
  expect(r.status).toBe("ok");
  if (r.status === "ok")
    expect(r.article.tags).toEqual(["javascript", "beginners"]);
});
it("distinguishes real missing from upstream errors", async () => {
  reply({}, 404);
  expect(await getBlogArticle("1")).toEqual({ status: "not-found" });
  reply({}, 500);
  expect(await getBlogArticle("1")).toEqual({
    status: "unavailable",
    reason: "origin",
  });
});
it("distinguishes throttling and timeout", async () => {
  reply({}, 429);
  expect(await getBlogArticle("1")).toEqual({
    status: "unavailable",
    reason: "rate-limit",
  });
  fetcher.mockRejectedValue(new DOMException("Timeout", "TimeoutError"));
  expect(await getBlogArticle("1")).toEqual({
    status: "unavailable",
    reason: "timeout",
  });
});
it("does not treat malformed successful payload as 404", async () => {
  reply({ wat: true });
  expect(await getBlogArticle("1")).toEqual({
    status: "unavailable",
    reason: "origin",
  });
  reply({ wat: true });
  expect(await getBlogPage(1)).toEqual({
    status: "unavailable",
    reason: "origin",
  });
});
it("rejects detail without an organization instead of exposing personal articles", async () => {
  reply({ ...post, organization: null });
  expect(await getBlogArticle("1")).toEqual({ status: "not-found" });
});
it("keeps page boundaries and uses one bounded lookahead only for full pages", async () => {
  vi.stubGlobal("fetch", fetcher);
  fetcher
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify(
          Array.from({ length: 6 }, (_, i) => ({ ...post, id: i + 1 })),
        ),
      ),
    )
    .mockResolvedValueOnce(new Response(JSON.stringify([{ ...post, id: 7 }])));
  const r = await getBlogPage(2);
  expect(r.status).toBe("ok");
  if (r.status === "ok") {
    expect(r.articles).toHaveLength(6);
    expect(r.hasNext).toBe(true);
  }
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(fetcher.mock.calls[0][0]).toContain("page=2&per_page=6");
  expect(fetcher.mock.calls[1][0]).toContain("page=3&per_page=6");
});

it.each([{}, { username: 123 }])("treats malformed organization %j as origin failure, without fake 404 or empty listing", async (organization) => {
  reply({ ...post, organization });
  expect(await getBlogArticle("1")).toEqual({ status: "unavailable", reason: "origin" });
  reply([{ ...post, organization }]);
  expect(await getBlogPage(1)).toEqual({ status: "unavailable", reason: "origin" });
});
