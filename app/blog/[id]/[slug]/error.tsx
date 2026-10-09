"use client";
import { Button } from "@/components/ui/button";
import { HomeArrow } from "@/app/components/home-arrow";
import { DetailShell } from "./detail-shell";

export default function BlogDetailError({ retry }: { retry: () => void }) {
  return (
    <DetailShell>
      <main className="blog-content">
        <section className="blog-status" role="alert">
          <h1>Não foi possível carregar o Blog</h1>
          <p>Tente novamente em instantes.</p>
          <Button className="home-button home-button-yellow" size="lg" onClick={retry}>Tentar novamente <HomeArrow /></Button>
        </section>
      </main>
    </DetailShell>
  );
}
