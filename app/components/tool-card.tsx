import { PressSurface } from "@/components/ui/press-surface";
import Link from "next/link";
import Image from "next/image";
import { HomeArrow } from "./home-arrow";
import { Clapperboard, FileSearch, Gamepad2, MapPinned, Megaphone, Radar, Scissors, Vote, Wrench, type LucideIcon } from "lucide-react";
import type { PublishedTool } from "@/app/lib/tools";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const homeActions: Record<string, { label: string; icon: string }> = {
  "painel-de-dados-comunitarios": { label: "Explorar o painel", icon: "/icons/streamline-pixel/interface-essential/interface-essential-pie-chart-poll-report-1.svg" },
  "mapa-de-iniciativas-locais": { label: "Explorar o mapa", icon: "/images/home-tool-map.svg" },
  "mapa-de-acoes": { label: "Explorar o mapa", icon: "/images/home-tool-map.svg" },
  "gerador-de-qr-code": { label: "Gerar QR code", icon: "/images/home-tool-qr.svg" },
  "calendario-de-mobilizacao": { label: "Ver calendário", icon: "/images/home-tool-organize.svg" },
};

// Category is free text normalized by curators; unknown categories keep the generic icon.
const categoryIcons: Record<string, { icon: LucideIcon; tone: string }> = {
  "Argumento com fonte": { icon: FileSearch, tone: "yellow" },
  "Mapa da virada": { icon: MapPinned, tone: "coral" },
  "Vídeos e materiais": { icon: Clapperboard, tone: "lilac" },
  "Organização e rua": { icon: Megaphone, tone: "coral" },
  "Jogos": { icon: Gamepad2, tone: "lilac" },
  "Monitoramento": { icon: Radar, tone: "yellow" },
  "Chegar à urna": { icon: Vote, tone: "yellow" },
  "Produção de vídeo": { icon: Scissors, tone: "lilac" },
};

export function ToolCard({ tool, variant = "default", index = 0 }: { tool: PublishedTool; variant?: "default" | "home"; index?: number }) {
  if (variant === "home") {
    const action = Object.hasOwn(homeActions, tool.slug) ? homeActions[tool.slug] : undefined;
    const tones = ["yellow", "coral", "white"];
    return (
      <article className="home-tool-card" data-tone={tones[index % tones.length]}>
        <div className="home-tool-identity">{action ? <Image src={action.icon} alt="" width={56} height={56} unoptimized /> : <Wrench className="home-tool-fallback-icon" aria-hidden="true" />}<div className="home-tool-labels"><p>{tool.category}</p>{tool.is_internal ? <span className="tool-internal-badge">Ferramenta interna</span> : null}</div></div>
        <h3>{tool.title}</h3>
        <p className="home-tool-description">{tool.description}</p>
        <p className="sr-only">Crédito: {tool.credit}</p>
        <Link href={`/ferramentas/${tool.slug}`} className="home-button home-tool-action"><PressSurface>{action?.label ?? "Abrir ferramenta"} <HomeArrow /></PressSurface></Link>
      </article>
    );
  }
  const { icon: Icon, tone } = Object.hasOwn(categoryIcons, tool.category) ? categoryIcons[tool.category] : { icon: Wrench, tone: "white" };
  return (
    <Card className="tool-card">
      <CardHeader>
        <div className="tool-card-icon" data-tone={tone}><Icon aria-hidden="true" /></div>
        <div className="tool-card-heading"><CardTitle>{tool.title}</CardTitle><p>{tool.category}</p>{tool.is_internal ? <span className="tool-internal-badge">Ferramenta interna</span> : null}</div>
      </CardHeader>
      <CardContent><p>{tool.description}</p><small>Crédito: {tool.credit}</small></CardContent>
      <CardFooter><Link href={`/ferramentas/${tool.slug}`} className="text-link">Conhecer ferramenta</Link></CardFooter>
    </Card>
  );
}
