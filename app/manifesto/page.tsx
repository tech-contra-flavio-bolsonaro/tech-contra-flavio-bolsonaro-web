import { SiteNav } from "@/app/components/site-nav";

export default function ManifestoPage() {
  return (
    <main>
      <SiteNav />
      <section className="page-intro" aria-labelledby="manifesto-title">
        <p>MANIFESTO</p>
        <h1 id="manifesto-title">VIRAR É FAZER JUNTO.</h1>
        <div className="page-copy">
          <p>
            Acreditamos que boas ideias ficam mais fortes quando circulam,
            encontram pessoas e viram ação coletiva.
          </p>
          <p>
            Este hub reúne ferramentas, referências e criações para quem quer
            mobilizar a sua comunidade com clareza, afeto e coragem.
          </p>
        </div>
      </section>
    </main>
  );
}
