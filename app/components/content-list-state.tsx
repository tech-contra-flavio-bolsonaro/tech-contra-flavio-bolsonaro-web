import type { MouseEventHandler, Ref } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeArrow } from "./home-arrow";

export function ContentListContribution() {
  return <div className="content-list-contribution"><span aria-hidden="true" /><Link className="home-button home-button-yellow" href="/enviar">Enviar um conteúdo<HomeArrow /></Link></div>;
}

export function ContentListState({ state, onRetry, pending, retryRef }: { state: "empty" | "loading" | "error"; onRetry?: MouseEventHandler<HTMLButtonElement>; pending?: boolean; retryRef?: Ref<HTMLButtonElement> }) {
  const title = state === "empty" ? "O acervo está sendo preparado" : state === "loading" ? "Carregando conteúdos…" : "Não foi possível carregar conteúdos.";
  return (
    <div className="content-list-panel" data-state={state}>
      <div className="content-list-status"><p>ACERVO / {state === "empty" ? "EM PREPARAÇÃO" : state === "loading" ? "CARREGANDO" : "INDISPONÍVEL"}</p><span className="content-list-pixels" aria-hidden="true"><i /><i /><i /></span></div>
      <div className="content-list-message">
        <Image src="/images/content-archive.svg" alt="" width={72} height={72} unoptimized />
        {state === "empty" ? <h2 id="content-list-state-title" tabIndex={-1}>{title}</h2> : <div role={state === "error" ? "alert" : "status"}><h2 id="content-list-state-title" tabIndex={-1}>{title}</h2>{state === "error" ? <p>Tente novamente para acessar o acervo.</p> : null}</div>}
      </div>
      {state !== "error" ? <div className="content-list-placeholders" aria-hidden="true">{["image", "video", "reference"].map(format => <div key={format}><Image src={`/images/content-${format}.svg`} alt="" width={48} height={48} unoptimized /></div>)}</div> : <button ref={retryRef} aria-disabled={pending} aria-busy={pending} className="home-button home-button-white content-list-retry" type="button" onClick={onRetry}>Tentar novamente</button>}
      <ContentListContribution />
    </div>
  );
}
