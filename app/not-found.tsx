import Image from "next/image";
import Link from "next/link";
import { HomeArrow } from "@/app/components/home-arrow";
import { SiteNav } from "@/app/components/site-nav";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <SiteNav variant="home" />
      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-copy">
          <p className="not-found-eyebrow">SINAL FORA DO MAPA</p>
          <p className="not-found-code" aria-hidden="true">
            404
          </p>
          <h1 id="not-found-title">ESSA PÁGINA NÃO EXISTE.</h1>
          <p className="not-found-description">
            O endereço pode estar incorreto ou a página pode ter mudado de
            lugar. Vamos encontrar outro caminho?
          </p>
          <div className="not-found-actions">
            <Link className="not-found-home-link" href="/">
              Voltar para o início
              <HomeArrow />
            </Link>
          </div>
        </div>
        <Image
          className="not-found-star"
          src="/images/home-collective-star.svg"
          alt=""
          width={102}
          height={102}
          unoptimized
        />
      </section>
    </main>
  );
}
