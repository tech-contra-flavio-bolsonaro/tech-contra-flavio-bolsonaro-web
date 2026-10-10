import type { Metadata } from "next";

export const siteOpenGraph = {
  siteName: "Vira Voto",
  locale: "pt_BR",
} as const;

// app/opengraph-image.png. Pages that override openGraph lose the inherited file
// image (shallow merge), so they reference it explicitly.
export const defaultShareImages = [
  { url: "/opengraph-image.png", width: 1200, height: 630, alt: "Vira Voto" },
];

// Next merges metadata shallowly, so a page that omits openGraph inherits the
// home og:url. Every indexable page declares its own canonical and og:url.
export function pageMetadata({
  title,
  description,
  path,
  ownShareImage = false,
}: {
  title: string | { absolute: string };
  description: string;
  path: string;
  // The segment ships its own opengraph-image file. A configured image would
  // replace that file (verified on Next 16.3.7), so none is set here.
  ownShareImage?: boolean;
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
      ...(ownShareImage ? {} : { images: defaultShareImages }),
    },
  };
}

// Shared by every not-found.tsx; "absolute" keeps the "%s | Vira Voto" template out.
export const notFoundMetadata: Metadata = {
  title: { absolute: "Vira Voto - Página Não Encontrada" },
};
