// Trailing slashes are stripped so joined paths never produce "//".
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techcontraflaviobolsonaro.dev"
).replace(/\/+$/, "");

export function absoluteUrl(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
