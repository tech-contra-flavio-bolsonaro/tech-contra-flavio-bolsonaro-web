import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="site-footer-brand" href="/">
        VIRA VOTO
      </Link>
      <Link className="site-footer-top" href="#top">
        <span>Voltar ao topo</span>
        <ArrowUp aria-hidden="true" />
      </Link>
    </footer>
  );
}
