import Link from "next/link";
import { Wrench } from "lucide-react";
import type { PublishedTool } from "@/app/lib/tools";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ToolCard({ tool }: { tool: PublishedTool }) {
  return (
    <Card className="tool-card">
      <CardHeader>
        <div className="tool-card-icon"><Wrench aria-hidden="true" /></div>
        <div className="tool-card-heading"><CardTitle>{tool.title}</CardTitle><p>{tool.category}</p></div>
      </CardHeader>
      <CardContent><p>{tool.description}</p><small>Crédito: {tool.credit}</small></CardContent>
      <CardFooter><Link href={`/ferramentas/${tool.slug}`} className="text-link">Conhecer ferramenta</Link></CardFooter>
    </Card>
  );
}
