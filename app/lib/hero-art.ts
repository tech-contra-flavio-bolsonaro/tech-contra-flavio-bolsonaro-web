import { createHash } from "node:crypto";

/** Convert only the embedded font transport; original vectors, text and metrics stay intact. */
export function renderHeroArtwork(source: string) {
  const fonts: { href: string; family: string; weight: string; unicodeRange: string }[] = [];
  let markup = source.replace(/@font-face\s*\{[^}]+\}/g, face => {
    const encoded = face.match(/data:font\/woff2;base64,([A-Za-z0-9+/=]+)/)?.[1];
    if (!encoded) return face;
    const hash = createHash("sha256").update(Buffer.from(encoded, "base64")).digest("hex").slice(0, 16);
    const href = `/fonts/hero/${hash}.woff2`;
    fonts.push({ href, family: face.match(/font-family:\s*'([^']+)'/)![1], weight: face.match(/font-weight:\s*(\d+)/)![1], unicodeRange: face.match(/unicode-range:\s*([^;]+)/)![1] });
    return face.replace(`data:font/woff2;base64,${encoded}`, href);
  });
  // Prevent the SVG's embedded faces from replacing the page's next/font faces.
  markup = markup.replaceAll("IBM Plex Mono", "Hero IBM Plex Mono").replaceAll("Barlow Condensed", "Hero Barlow Condensed");
  markup = markup.replace("<svg ", '<svg class="home-hero-art" aria-hidden="true" ');
  return { markup, fonts };
}
