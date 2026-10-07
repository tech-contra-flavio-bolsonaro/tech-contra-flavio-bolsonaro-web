import Link from "next/link";

const links = [
  ["/manifesto", "Manifesto"],
  ["/ferramentas", "Ferramentas"],
  ["/conteudos", "Conteúdos"],
  ["/enviar", "Enviar conteúdo"],
] as const;

export function SiteNav() {
  return <header><Link href="/">VIRA VOTO</Link><nav aria-label="Navegação principal">{links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav></header>;
}
