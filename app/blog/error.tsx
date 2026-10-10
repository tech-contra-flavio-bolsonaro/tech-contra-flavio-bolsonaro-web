"use client";

import { PressSurface } from "@/components/ui/press-surface";
import ListingLayout from "./(listing)/layout";
import { HomeArrow } from "@/app/components/home-arrow";
import { SiteNav } from "@/app/components/site-nav";
export default function BlogError({ retry }: { retry: () => void }) {
  return (
    <ListingLayout>
      <SiteNav variant="home" />
      <main className="blog-content">
        <section className="blog-status" role="alert">
          <h1>Não foi possível carregar o Blog</h1>
          <p>Tente novamente em instantes.</p>
          <button className="home-button home-button-yellow" onClick={() => retry()}><PressSurface>
            Tentar novamente <HomeArrow />
          </PressSurface></button>
        </section>
      </main>
    </ListingLayout>
  );
}
