import { SiteNav } from "@/app/components/site-nav";
import { SubmissionForm } from "@/app/components/submission-form";

export default function EnviarPage() {
  return (
    <main>
      <SiteNav />
      <section className="page-intro" aria-labelledby="send-title">
        <p>ACERVO COLETIVO</p>
        <h1 id="send-title">COMPARTILHE UMA IDEIA.</h1>
        <div className="page-copy">
          <p>Todo envio passa por curadoria antes de aparecer no hub.</p>
          <SubmissionForm />
        </div>
      </section>
    </main>
  );
}
