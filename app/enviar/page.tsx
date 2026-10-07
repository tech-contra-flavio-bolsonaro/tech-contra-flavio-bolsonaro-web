import { SiteNav } from "@/app/components/site-nav";
import { SubmissionForm } from "@/app/components/submission-form";

export default function EnviarPage() {
  return (
    <main>
      <SiteNav />
      <section className="submission-page" aria-labelledby="send-title">
        <div className="submission-intro">
          <p className="submission-eyebrow">ACERVO COLETIVO</p>
          <h1 id="send-title">COMPARTILHE UMA <span>IDEIA.</span></h1>
          <p className="submission-lede">Conteúdos, referências e materiais para fortalecer a conversa. Todo envio passa por curadoria antes de aparecer no hub.</p>
          <ol className="submission-steps" aria-label="Como funciona">
            <li><span>01</span><div><strong>Envie</strong><small>Imagem, vídeo ou referência.</small></div></li>
            <li><span>02</span><div><strong>Curadoria</strong><small>A comunidade confere o material.</small></div></li>
            <li><span>03</span><div><strong>Compartilhe</strong><small>O conteúdo aprovado chega ao hub.</small></div></li>
          </ol>
        </div>
        <div className="submission-panel">
          <div className="submission-panel-heading">
            <p>ENVIAR MATERIAL</p>
            <h2>Conta pra gente</h2>
            <span>Os campos com * são obrigatórios.</span>
          </div>
          <SubmissionForm />
        </div>
      </section>
    </main>
  );
}
