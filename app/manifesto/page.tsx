import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/app/components/site-nav";
import { HomeArrow } from "@/app/components/home-arrow";
import { ManifestoSignLink } from "@/app/components/manifesto-sign-link";
import { ManifestoReadLink } from "@/app/components/manifesto-read-link";
import { ManifestoFullText } from "@/app/components/manifesto-full-text";
import { ManifestoSignatureForm } from "@/app/components/manifesto-signature-form";
import { pageMetadata } from "@/app/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Manifesto",
  description:
    "Entenda a proposta do Vira Voto: ideias ganham força quando circulam, encontram pessoas e viram ação coletiva.",
  path: "/manifesto",
});

const principles = [
  {
    title: "CLAREZA",
    text: "Dar nome ao que queremos transformar. Compartilhar ideias de um jeito que convide à compreensão e abra espaço para perguntas.",
  },
  {
    title: "AFETO",
    text: "Escutar com atenção e reconhecer quem está ao nosso lado. Fazer da conversa um lugar de acolhimento, respeito e encontro.",
  },
  {
    title: "CORAGEM",
    text: "Sair da intenção e experimentar caminhos. Sustentar a conversa, aprender no percurso e dar o próximo passo com outras pessoas.",
  },
];

export default function ManifestoPage() {
  return (
    <main className="manifesto-page">
      <SiteNav variant="home" />
      <section className="manifesto-hero" aria-labelledby="manifesto-title">
        <div className="manifesto-presentation">
          <p className="home-eyebrow">NOSSO MANIFESTO</p>
          <h1 id="manifesto-title">
            VIRAR É FAZER
            <br /> JUNTO.
          </h1>
          <p className="manifesto-conviction">
            Acreditamos que boas ideias ficam mais fortes quando circulam,
            encontram pessoas e viram ação coletiva.
          </p>
          <p className="manifesto-purpose">
            Este hub reúne ferramentas, referências e criações para quem quer
            mobilizar a sua comunidade com clareza, afeto e coragem.
          </p>
          <div className="manifesto-hero-actions">
            <ManifestoReadLink />
            <ManifestoSignLink />
          </div>
        </div>
        <div className="manifesto-art" aria-hidden="true">
          <Image
            src="/images/manifesto-collective-circuit.svg"
            alt=""
            width={470}
            height={452}
            unoptimized
            priority
          />
        </div>
      </section>
      <ManifestoFullText />
      <section
        className="manifesto-statement manifesto-circulation"
        aria-labelledby="circulation-title"
      >
        <div>
          <p className="home-eyebrow">CIRCULAÇÃO</p>
          <h2 id="circulation-title">IDEIA BOA NÃO FICA PARADA.</h2>
        </div>
        <p>
          Circular é deixar uma ideia encontrar novos olhares. É compartilhar o
          que inspira, ouvir o que volta e abrir caminhos para que a conversa
          continue. Uma ideia em movimento é um convite para participar.
        </p>
      </section>
      <section
        className="manifesto-statement manifesto-collective"
        aria-labelledby="collective-title"
      >
        <div>
          <p className="home-eyebrow">AÇÃO COLETIVA</p>
          <h2 id="collective-title">NINGUÉM VIRA O JOGO SOZINHO.</h2>
        </div>
        <p>
          Fazer junto é somar diferentes experiências em torno de uma intenção
          comum. É transformar a escuta em encontro e o encontro em ação,
          respeitando o tempo e a contribuição de cada pessoa.
        </p>
      </section>
      <section
        className="manifesto-principles"
        aria-labelledby="principles-title"
      >
        <p className="home-eyebrow">O QUE MOVE A GENTE</p>
        <h2 id="principles-title">COMO QUEREMOS FAZER.</h2>
        <div className="manifesto-principle-grid">
          {principles.map((principle) => (
            <article key={principle.title}>
              <span aria-hidden="true" />
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
        <div className="manifesto-next">
          <p>DA IDEIA AO PRÓXIMO PASSO.</p>
          <Link href="/ferramentas" className="home-button home-button-yellow">
            Conheça as ferramentas <HomeArrow />
          </Link>
        </div>
      </section>
      <section
        className="manifesto-signature"
        aria-labelledby="assinar-manifesto"
      >
        <div className="manifesto-signature-intro">
          <p className="home-eyebrow">FAZER JUNTO</p>
          <h2 id="assinar-manifesto" tabIndex={-1}>
            ASSINE O MANIFESTO.
          </h2>
          <p>Some sua assinatura a esta intenção comum.</p>
          <p>
            Usaremos seus dados exclusivamente para registrar e validar sua
            assinatura deste manifesto. Eles serão mantidos privados, sem
            publicação de contatos nem envio de marketing.
          </p>
        </div>
        <div className="manifesto-signature-panel">
          <h3>Sua assinatura</h3>
          <p>Todos os campos são obrigatórios.</p>
          <ManifestoSignatureForm />
        </div>
      </section>
    </main>
  );
}
