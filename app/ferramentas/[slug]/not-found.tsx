import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";

export default function ToolNotFound() {
  return <main><SiteNav /><section className="tool-detail"><h1>Ferramenta não encontrada.</h1><p>Ela pode não estar publicada ou o endereço pode estar incorreto.</p><Link href="/ferramentas">Ver ferramentas disponíveis</Link></section></main>;
}
