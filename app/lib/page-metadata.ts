import type { Metadata } from "next";

export const siteOpenGraph = {
  siteName: "Vira Voto",
  locale: "pt_BR",
} as const;

// Next merges metadata shallowly, so a page that omits openGraph inherits the
// home og:url. Every indexable page declares its own canonical and og:url.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string | { absolute: string };
  description: string;
  path: string;
}): Metadata {
  const shareTitle = typeof title === "string" ? title : title.absolute;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...siteOpenGraph,
      type: "website",
      title: shareTitle,
      description,
      url: path,
    },
  };
}
