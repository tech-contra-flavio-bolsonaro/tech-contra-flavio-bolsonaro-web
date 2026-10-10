import { PressSurface } from "@/components/ui/press-surface";
import { HomeArrow } from "./home-arrow";
import type { BlogFailure } from "@/app/lib/blog/types";
import { BlogRetry } from "./blog-retry";
export function BlogUnavailable({ reason }: { reason: BlogFailure["reason"]; detail?: boolean }) {
  const message =
    reason === "rate-limit"
      ? "O DEV.to atingiu o limite de solicitações. Aguarde um pouco e tente novamente."
      : reason === "timeout"
        ? "O DEV.to demorou para responder. Tente novamente."
        : "Não foi possível carregar os artigos do DEV.to agora. Tente novamente.";
  return (
    <section className="blog-status" role="status">
      <h2>Artigos temporariamente indisponíveis</h2>
      <p>{message}</p>
      <BlogRetry home />
    </section>
  );
}
export function BlogContribution({ detail = false }: { detail?: boolean }) {
  return (
    <section
      className={`blog-contribution${detail ? " blog-contribution-detail" : ""}`}
    >
      <div className="blog-contribution-copy">
        <h2>
          {detail ? "VAI COMPARTILHAR UMA IDEIA?" : "TEM UMA HISTÓRIA BOA?"}
        </h2>
        <p>
          {detail
            ? "Convide mais pessoas para construir junto."
            : "Compartilhe sua experiência e inspire outras pessoas a agir."}
        </p>
      </div>
      <a className="home-button home-button-yellow" href="/enviar"><PressSurface>
        Enviar uma ideia <HomeArrow />
      </PressSurface></a>
    </section>
  );
}
