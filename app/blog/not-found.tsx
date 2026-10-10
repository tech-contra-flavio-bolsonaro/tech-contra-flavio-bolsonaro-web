import ListingLayout from "./(listing)/layout";
import { HomeArrow } from "@/app/components/home-arrow";
import Link from "next/link";
import { SiteNav } from "@/app/components/site-nav";
export default function NotFound() {
  return (
    <ListingLayout>
      <SiteNav variant="home" />
      <main className="blog-content">
        <section className="blog-status">
          <h1>Artigo não encontrado</h1>
          <p>Esta publicação não está disponível no Blog da comunidade.</p>
          <Link className="home-button home-button-yellow" href="/blog">
            Voltar para o Blog <HomeArrow />
          </Link>
        </section>
      </main>
    </ListingLayout>
  );
}
