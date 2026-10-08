"use client";

import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";

export default function ToolError({ reset }: { reset: () => void }) {
  return <main><SiteNav /><section className="tool-detail"><h1>Não foi possível carregar a ferramenta.</h1><p role="alert">Tente novamente em instantes.</p><button className="load-more" onClick={reset}>Tentar novamente</button><p><Link href="/ferramentas">Voltar às ferramentas</Link></p></section></main>;
}
