import { PressSurface } from "@/components/ui/press-surface";
import ListingLayout from "./(listing)/layout";
import { HomeArrow } from "@/app/components/home-arrow";
import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";
import { notFoundMetadata } from "@/app/lib/page-metadata";

export const metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <ListingLayout>
      <SiteNav variant="home" />
      <main className="blog-content">
        <section className="blog-status">
          <h1>Artigo não encontrado</h1>
          <p>Esta publicação não está disponível no Blog da comunidade.</p>
          <Link className="home-button home-button-yellow" href="/blog"><PressSurface>
            Voltar para o Blog <HomeArrow />
          </PressSurface></Link>
        </section>
      </main>
    </ListingLayout>
  );
}
