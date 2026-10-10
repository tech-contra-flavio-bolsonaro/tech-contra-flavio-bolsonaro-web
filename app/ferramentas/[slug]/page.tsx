import type { Metadata } from "next";
import { siteOpenGraph } from "@/app/lib/page-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/app/components/site-nav";
import { ToolAccess } from "@/app/components/tool-access";
import { findTool, findToolEmbed } from "@/app/lib/tools-server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await findTool(slug);

  if (!tool) {
    return {
      title: "Ferramenta não encontrada",
      description: "A ferramenta solicitada não foi encontrada no Vira Voto.",
    };
  }

  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: `/ferramentas/${slug}`,
    },
    openGraph: {
      ...siteOpenGraph,
      title: tool.title,
      description: tool.description,
      type: "article",
      url: `/ferramentas/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await findTool(slug);
  if (!tool) notFound();
  // A failed domain lookup must never prevent external access to an approved tool.
  const embedUrl = await findToolEmbed(slug).catch(() => null);
  return (
    <main><SiteNav /><section className="tool-detail" aria-labelledby="tool-title">
      <Link href="/ferramentas">Todas as ferramentas</Link>
      <h1 id="tool-title">{tool.title}</h1>
      <p>{tool.category} · Crédito: {tool.credit}</p>
      <p className="tool-description">{tool.description}</p>
      <ToolAccess slug={tool.slug} title={tool.title} url={tool.url} canEmbed={Boolean(embedUrl)} />
    </section></main>
  );
}
