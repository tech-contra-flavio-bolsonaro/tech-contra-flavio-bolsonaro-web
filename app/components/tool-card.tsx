"use client";

import { useState } from "react";
import { CalendarDays, MapPinned, QrCode, Wrench } from "lucide-react";
import type { Tool } from "@/app/lib/content";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ToolCardProps = {
  tool: Tool;
};

function ToolIcon({ id }: { id: string }) {
  const Icon = id === "mapa-de-acoes" || id === "mapa" ? MapPinned : id === "gerador-de-qr" ? QrCode : id === "calendario" ? CalendarDays : Wrench;
  return <Icon aria-hidden="true" />;
}

export function ToolCard({ tool }: ToolCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="tool-card">
      <CardHeader>
        <div data-testid="tool-card-icon" className="tool-card-icon"><ToolIcon id={tool.id} /></div>
        <div className="tool-card-heading"><p className="eyebrow">{tool.category}</p><CardTitle>{tool.title}</CardTitle></div>
      </CardHeader>
      <CardContent><p>{tool.description}</p>

      {tool.accessMode === "embed" && tool.embedUrl ? (
        <div className="tool-embed">
          {isOpen ? (
            <iframe
              src={tool.embedUrl}
              title={tool.title}
              loading="lazy"
              sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
            />
          ) : (
            <Button type="button" onClick={() => setIsOpen(true)}>Abrir aqui</Button>
          )}
        </div>
      ) : null}

      </CardContent><CardFooter><a href={tool.url} target="_blank" rel="noreferrer" className="text-link">
        {tool.accessMode === "embed" ? "Abrir em nova aba ↗" : "Abrir ferramenta ↗"}
      </a></CardFooter>
    </Card>
  );
}
