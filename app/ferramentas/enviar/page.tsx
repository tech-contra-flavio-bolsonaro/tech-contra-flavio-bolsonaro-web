import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";
import { ToolSubmissionForm } from "@/app/components/tool-submission-form";

export default function SubmitToolPage() {
  return (
    <main><SiteNav /><section className="submission-page tool-submission-page" aria-labelledby="send-tool-title">
      <div className="submission-intro">
        <h1 id="send-tool-title">COMPARTILHE UMA <span>FERRAMENTA.</span></h1>
        <p className="submission-lede">Conhece um recurso que ajuda a agir? Envie o link e conte como ele pode ajudar a comunidade. A curadoria confere cada sugestão antes de publicar.</p>
        <Link className="action-link" href="/ferramentas">Ver ferramentas</Link>
      </div>
      <div className="submission-panel"><div className="submission-panel-heading"><h2>Conta pra gente</h2><span>Os campos com * são obrigatórios.</span></div><ToolSubmissionForm /></div>
    </section></main>
  );
}
