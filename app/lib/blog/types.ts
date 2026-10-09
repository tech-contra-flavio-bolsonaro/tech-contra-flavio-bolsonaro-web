export type BlogArticle = {
  id: number;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  author: { name: string; username: string };
  coverImage: string | null;
  sourceUrl: string;
  bodyHtml?: string;
};
export type BlogFailure = {
  status: "unavailable";
  reason: "rate-limit" | "timeout" | "origin";
};
export type BlogDetailResult =
  | { status: "ok"; article: BlogArticle }
  | { status: "not-found" }
  | BlogFailure;
export type BlogPageResult =
  { status: "ok"; articles: BlogArticle[]; hasNext: boolean } | BlogFailure;
