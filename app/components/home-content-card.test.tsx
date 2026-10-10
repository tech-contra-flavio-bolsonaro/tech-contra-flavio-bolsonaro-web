import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { HomeContentCard } from "./home-content-card";

it('shows the "Compartilhar" label on the home content card', () => {
  render(
    <HomeContentCard
      item={{
        id: "conteudo-1",
        title: "Ideias em movimento",
        description: "Descrição do conteúdo.",
        credit: "Crédito original",
        media_path: null,
        mediaUrl: null,
        video_url: null,
      }}
    />,
  );

  const shareButton = screen.getByRole("button", { name: "Compartilhar" });
  expect(shareButton).toHaveTextContent("Compartilhar");
});
