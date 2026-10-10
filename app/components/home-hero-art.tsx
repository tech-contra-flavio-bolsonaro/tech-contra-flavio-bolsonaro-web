import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderHeroArtwork } from "@/app/lib/hero-art";

const art = renderHeroArtwork(readFileSync(join(process.cwd(), "public/images/hero-ideas-network.svg"), "utf8"));

export function HomeHeroArt() {
  return <>
    {art.fonts.filter(font => font.unicodeRange.startsWith("U+0000")).map(font => <link key={font.href} rel="preload" href={font.href} as="font" type="font/woff2" crossOrigin="anonymous" />)}
    <div data-testid="hero-decoration" className="home-hero-decoration" aria-hidden="true" dangerouslySetInnerHTML={{ __html: art.markup }} />
  </>;
}
