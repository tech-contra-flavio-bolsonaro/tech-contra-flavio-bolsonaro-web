import type { MetadataRoute } from "next";
import { contentPermalink } from "@/app/lib/content-permalink";
import { listPublishedContentIds } from "@/app/lib/published-content";
import { absoluteUrl } from "@/app/lib/site-url";
import { listToolSlugs } from "@/app/lib/tools-server";

export const dynamic = "force-dynamic";

type Entry = MetadataRoute.Sitemap[number];

const staticPages: Entry[] = [
  { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
  { url: absoluteUrl("/ferramentas"), changeFrequency: "daily", priority: 0.9 },
  { url: absoluteUrl("/conteudos"), changeFrequency: "daily", priority: 0.8 },
  { url: absoluteUrl("/blog"), changeFrequency: "daily", priority: 0.7 },
  { url: absoluteUrl("/manifesto"), changeFrequency: "monthly", priority: 0.7 },
];

// A database outage must not take the sitemap down with it.
async function safely(list: () => Promise<string[]>) {
  try {
    return await list();
  } catch (error) {
    console.error("sitemap: falha ao listar páginas dinâmicas", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [toolSlugs, contentIds] = await Promise.all([
    safely(listToolSlugs),
    safely(listPublishedContentIds),
  ]);

  return [
    ...staticPages,
    ...toolSlugs.map((slug): Entry => ({
      url: absoluteUrl(`/ferramentas/${encodeURIComponent(slug)}`),
      changeFrequency: "weekly",
      priority: 0.6,
    })),
    ...contentIds.map((id): Entry => ({
      url: absoluteUrl(contentPermalink(id)),
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  ];
}
