import "server-only";
import { cache } from "react";
import type {
  BlogArticle,
  BlogDetailResult,
  BlogFailure,
  BlogPageResult,
} from "./types";
import { BLOG_ORGANIZATION, blogSourceUrl, safeBlogImage } from "./urls";
const API = "https://dev.to/api";
export const BLOG_PAGE_SIZE = 6;
function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
function parseArticle(
  value: unknown,
  detail = false,
): BlogArticle | "foreign" | null {
  const raw = record(value);
  if (!raw) return null;
  if (raw.organization === null) return "foreign";
  const organization = record(raw.organization);
  if (!organization || typeof organization.username !== "string") return null;
  if (organization.username !== BLOG_ORGANIZATION) return "foreign";
  if (raw.published_at === null || raw.published === false) return "foreign";
  const author = record(raw.user);
  if (
    typeof raw.id !== "number" ||
    !Number.isSafeInteger(raw.id) ||
    raw.id <= 0 ||
    typeof raw.slug !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw.slug) ||
    typeof raw.title !== "string" ||
    !raw.title.trim() ||
    typeof raw.published_at !== "string" ||
    !Number.isFinite(Date.parse(raw.published_at)) ||
    !author ||
    typeof author.name !== "string" ||
    typeof author.username !== "string" ||
    !/^[a-z0-9_-]+$/i.test(author.username) ||
    (detail && typeof raw.body_html !== "string")
  )
    return null;
  const tags = Array.isArray(raw.tag_list)
    ? raw.tag_list
    : Array.isArray(raw.tags)
      ? raw.tags
      : typeof raw.tag_list === "string"
        ? raw.tag_list.split(",").map((tag) => tag.trim())
        : [];
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: typeof raw.description === "string" ? raw.description : "",
    publishedAt: raw.published_at,
    readingMinutes:
      typeof raw.reading_time_minutes === "number" &&
      Number.isFinite(raw.reading_time_minutes)
        ? Math.max(1, Math.round(raw.reading_time_minutes))
        : 1,
    tags: tags.filter(
      (tag): tag is string => typeof tag === "string" && Boolean(tag.trim()),
    ),
    author: { name: author.name, username: author.username },
    coverImage: safeBlogImage(
      typeof raw.cover_image === "string" ? raw.cover_image : null,
    ),
    sourceUrl: blogSourceUrl(
      { slug: raw.slug },
      typeof raw.canonical_url === "string"
        ? raw.canonical_url
        : typeof raw.url === "string"
          ? raw.url
          : null,
    ),
    ...(detail ? { bodyHtml: raw.body_html as string } : {}),
  };
}
type RequestResult =
  { status: "ok"; data: unknown } | { status: "not-found" } | BlogFailure;
async function request(path: string): Promise<RequestResult> {
  try {
    const response = await fetch(`${API}${path}`, {
      headers: {
        Accept: "application/vnd.forem.api-v1+json",
        "User-Agent":
          "ViraVotoBlog/1.0 (+https://techcontraflaviobolsonaro.dev)",
      },
      next: { revalidate: 300 },
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 404) return { status: "not-found" };
    if (response.status === 429)
      return { status: "unavailable", reason: "rate-limit" };
    if (!response.ok) return { status: "unavailable", reason: "origin" };
    return { status: "ok", data: await response.json() };
  } catch (error) {
    return {
      status: "unavailable",
      reason:
        error !== null &&
        typeof error === "object" &&
        "name" in error &&
        ["TimeoutError", "AbortError"].includes(String(error.name))
          ? "timeout"
          : "origin",
    };
  }
}
async function pageArticles(page: number): Promise<BlogPageResult> {
  const response = await request(
    `/organizations/${BLOG_ORGANIZATION}/articles?page=${page}&per_page=${BLOG_PAGE_SIZE}`,
  );
  if (response.status !== "ok")
    return response.status === "not-found"
      ? { status: "unavailable", reason: "origin" }
      : response;
  if (!Array.isArray(response.data))
    return { status: "unavailable", reason: "origin" };
  const parsed = response.data.map((value) => parseArticle(value));
  if (parsed.some((article) => article === null))
    return { status: "unavailable", reason: "origin" };
  return {
    status: "ok",
    articles: parsed.filter(
      (article): article is BlogArticle =>
        article !== null && article !== "foreign",
    ),
    hasNext: response.data.length === BLOG_PAGE_SIZE,
  };
}
export const getBlogPage = cache(
  async (page: number): Promise<BlogPageResult> => {
    const safePage =
      Number.isSafeInteger(page) && page > 0 && page <= 9999 ? page : 1;
    const result = await pageArticles(safePage);
    if (result.status !== "ok" || !result.hasNext) return result;
    const next = await pageArticles(safePage + 1);
    return {
      ...result,
      hasNext: next.status === "ok" ? next.articles.length > 0 : true,
    };
  },
);
export const getBlogArticle = cache(
  async (id: string): Promise<BlogDetailResult> => {
    if (!/^[1-9]\d{0,14}$/.test(id) || !Number.isSafeInteger(Number(id)))
      return { status: "not-found" };
    const response = await request(`/articles/${id}`);
    if (response.status !== "ok") return response;
    const article = parseArticle(response.data, true);
    if (article === "foreign" || (article && article.id !== Number(id)))
      return { status: "not-found" };
    if (!article) return { status: "unavailable", reason: "origin" };
    return { status: "ok", article };
  },
);
