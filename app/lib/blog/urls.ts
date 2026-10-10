export const BLOG_ORGANIZATION = "techcontrabolsonaro";
const imageHosts = new Set([
  "media.dev.to",
  "media2.dev.to",
  "dev-to-uploads.s3.amazonaws.com",
  "dev-to-uploads.s3.us-east-2.amazonaws.com",
]);
function httpsUrl(value: string): URL | null {
  try {
    if (value.trim().startsWith("//") || value.includes("\\")) return null;
    const url = new URL(value);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port
      ? url
      : null;
  } catch {
    return null;
  }
}
export function safeBlogLink(value: string | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\"))
    return httpsUrl(`https://dev.to${value}`)?.href ?? null;
  return httpsUrl(value)?.href ?? null;
}
export function safeBlogImage(value: string | null | undefined): string | null {
  if (!value) return null;
  const url = httpsUrl(value);
  return url && imageHosts.has(url.hostname) ? url.href : null;
}
export function blogPermalink(article: { id: number; slug: string }): string {
  return `/blog/${article.id}/${encodeURIComponent(article.slug)}`;
}
export function blogSourceUrl(
  article: { slug: string },
  value?: string | null,
): string {
  const expected = `https://dev.to/${BLOG_ORGANIZATION}/${encodeURIComponent(article.slug)}`;
  const url = value ? httpsUrl(value) : null;
  return url?.hostname === "dev.to" &&
    url.pathname === new URL(expected).pathname &&
    !url.search &&
    !url.hash
    ? url.href
    : expected;
}
export function blogPageNumber(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d{0,3}$/.test(value)) return 1;
  return Number(value);
}
export function blogDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
