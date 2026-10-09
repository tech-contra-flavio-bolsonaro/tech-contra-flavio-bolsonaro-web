import Image from "next/image";
import { SiteNav } from "@/app/components/site-nav";
import { SubmissionForm } from "@/app/components/submission-form";

export default function EnviarPage() {
  return (
    <main className="content-submission-page">
      <SiteNav variant="home" />
      <section className="submission-page" aria-labelledby="send-title">
        <div className="submission-intro">
          <p className="submission-eyebrow">ACERVO COLETIVO</p>
          <h1 id="send-title">COMPARTILHE<br />UMA IDEIA.</h1>
          <p className="submission-lede">Conteúdos, referências e materiais para fortalecer a conversa. Todo envio passa por curadoria antes de aparecer no hub.</p>
          <ol className="submission-steps" aria-label="Como funciona">
            <li><span>01</span><p><strong>Envie:</strong> imagem, vídeo ou referência</p></li>
            <li><span>02</span><p><strong>Curadoria:</strong> a comunidade confere o material</p></li>
            <li><span>03</span><p><strong>Compartilhe:</strong> o conteúdo aprovado chega ao hub</p></li>
          </ol>
          <div className="submission-collective"><Image src="/images/send-star.svg" alt="" width={90} height={90} unoptimized /><p>FEITO DE GENTE. MOVIDO POR IDEIAS.</p></div>
        </div>
        <div className="submission-panel">
          <div className="submission-panel-heading">
            <h2>CONTA PRA GENTE</h2>
            <span>Os campos com * são obrigatórios.</span>
          </div>
          <SubmissionForm />
        </div>
      </section>
    </main>
  );
}
