const blockedSuffixes = [".localhost", ".local", ".internal", ".lan", ".home.arpa", ".intranet", ".corp"];

/** Public HTTPS only: no credentials, IP literals, single-label or local names. */
export function parsePublicHttpsUrl(value: string) {
  if (!value || value.length > 2048) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/\.$/, "");
  const invalid =
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    !host.includes(".") ||
    host.startsWith("[") ||
    /^[\d.]+$/.test(host) ||
    blockedSuffixes.some((suffix) => host.endsWith(suffix));
  return invalid || url.href.length > 2048 ? null : url.href;
}
