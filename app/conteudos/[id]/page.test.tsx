import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import ContentDetailPage, { generateMetadata } from "./page";
import { findPublishedContent } from "@/app/lib/published-content";

vi.mock("@/app/lib/published-content", () => ({ findPublishedContent: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

const id = "123e4567-e89b-42d3-a456-426614174000";
const item = { id, title: "Conteúdo aprovado", description: "Descrição integral", credit: "Comunidade", priority: 0, media_path: null, mediaUrl: null, video_url: null };
const params = Promise.resolve({ id });

it.each(["data:text/html,<p>unsafe</p>", "javascript:alert(1)", "http://example.com/video", "not a URL"])(
  "omits the original video link for an invalid URL: %s",
  async (video_url) => {
    vi.mocked(findPublishedContent).mockResolvedValue({ ...item, video_url });
    render(await ContentDetailPage({ params }));
    expect(screen.queryByRole("link", { name: "Abrir vídeo original ↗" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: item.title })).toBeInTheDocument();
    expect(screen.getByText(item.description)).toBeInTheDocument();
  },
);

it("preserves a normalized HTTPS video link, uploaded media, and permalink metadata", async () => {
  vi.mocked(findPublishedContent).mockResolvedValue({ ...item, video_url: "HTTPS://EXAMPLE.COM/video", media_path: "approved/image.png", mediaUrl: "https://example.com/image.png" });
  render(await ContentDetailPage({ params }));
  expect(screen.getByRole("link", { name: "Abrir vídeo original ↗" })).toHaveAttribute("href", "https://example.com/video");
  expect(screen.getByRole("img", { name: item.title })).toHaveAttribute("src", "https://example.com/image.png");
  expect(await generateMetadata({ params })).toEqual({
    title: item.title,
    description: item.description,
    alternates: { canonical: `/conteudos/${id}` },
    openGraph: { siteName: "Vira Voto", locale: "pt_BR", title: item.title, description: item.description, type: "article", url: `/conteudos/${id}` },
    twitter: { card: "summary", title: item.title, description: item.description },
  });
});
