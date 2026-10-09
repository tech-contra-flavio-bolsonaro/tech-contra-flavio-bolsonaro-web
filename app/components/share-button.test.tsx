import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ShareButton } from "./share-button";

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(navigator, "userAgent");
  Reflect.deleteProperty(navigator, "clipboard");
  Reflect.deleteProperty(navigator, "canShare");
  Reflect.deleteProperty(navigator, "share");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it("opens sharing actions in a dialog", async () => {
  render(<ShareButton title="Card" url="https://example.com/card" />);
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));

  expect(
    screen.getByRole("button", { name: "Compartilhar via WhatsApp" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Compartilhar via Instagram" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Compartilhar no X" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Compartilhar no Threads" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Copiar link" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Compartilhar via WhatsApp" }),
  ).toHaveClass("share-action-whatsapp");
  expect(
    screen.getByRole("button", { name: "Compartilhar via Instagram" }),
  ).toHaveClass("share-action-instagram");
  expect(screen.getByRole("button", { name: "Compartilhar no X" })).toHaveClass(
    "share-action-x",
  );
  expect(
    screen.getByRole("button", { name: "Compartilhar no Threads" }),
  ).toHaveClass("share-action-threads");
  expect(screen.getByRole("button", { name: "Copiar link" })).toHaveClass(
    "share-action-copy",
  );
  for (const name of [
    "Compartilhar via WhatsApp",
    "Compartilhar via Instagram",
    "Compartilhar no X",
    "Compartilhar no Threads",
  ]) {
    const button = screen.getByRole("button", { name });
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  }
});

it.each(["default", "home", "listing", "home-colors"] as const)(
  "gives the %s share trigger an accessible name",
  (variant) => {
    render(<ShareButton title="Conteúdo real" url="/conteudos/real" variant={variant} />);
    expect(screen.getByRole("button", { name: "Compartilhar" })).toHaveAccessibleName("Compartilhar");
  },
);

it("keeps the default presentation with home colors", async () => {
  render(
    <ShareButton
      title="Manifesto Tech Contra Flávio Bolsonaro"
      description="Ação coletiva."
      url="/manifesto"
      variant="home-colors"
      className="inline-block ml-4"
    />,
  );
  const trigger = screen.getByRole("button", { name: "Compartilhar" });

  expect(trigger).toHaveClass(
    "share-trigger inline-block ml-4",
  );
  expect(trigger).toHaveAttribute("data-variant", "default");
  expect(trigger).toHaveClass("h-10");
  expect(trigger).toHaveAttribute("aria-label", "Compartilhar");
  expect(trigger).not.toHaveTextContent("Compartilhar");
  expect(trigger.querySelectorAll("svg")).toHaveLength(1);
  expect(trigger.querySelector(".home-arrow")).toBeNull();

  fireEvent.click(trigger);
  expect(
    screen.getByRole("heading", { name: "Compartilhar conteúdo" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Ação coletiva.")).toBeInTheDocument();
  expect(screen.queryByText("Manifesto Vira Voto")).not.toBeInTheDocument();
});

it.each([
  ["X", "Compartilhar no X", "https://twitter.com/intent/tweet"],
  ["Threads", "Compartilhar no Threads", "https://www.threads.com/intent/post"],
])(
  "opens the %s intent with encoded content text and its canonical URL",
  async (_platform, name, endpoint) => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const title = "Ideias com ação — já!";
    const description = "Ação coletiva: cuidado, diálogo & respeito.";
    const url = "https://example.com/conteudos/ação?id=1&origem=hub";
    render(<ShareButton title={title} description={description} url={url} />);
    fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
    fireEvent.click(await screen.findByRole("button", { name }));

    const intent = new URL(open.mock.calls[0][0] as string);
    expect(intent.origin + intent.pathname).toBe(endpoint);
    expect(intent.searchParams.get("text")).toBe(`${title}\n\n${description}`);
    expect(intent.searchParams.get("url")).toBe(new URL(url).toString());
    expect(open).toHaveBeenCalledWith(
      intent.toString(),
      "_blank",
      "noopener,noreferrer",
    );
  },
);

it("copies the absolute canonical URL when given a relative permalink", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  render(<ShareButton title="Card" url="/conteudos/card-id" />);
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  fireEvent.click(await screen.findByRole("button", { name: "Copiar link" }));

  await waitFor(() =>
    expect(writeText).toHaveBeenCalledWith(
      "http://localhost:3000/conteudos/card-id",
    ),
  );
});

it("copies image content to the clipboard", async () => {
  const write = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { write },
  });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["image bytes"], { type: "image/png" }),
    }),
  );
  class ClipboardItemMock {
    constructor(readonly items: Record<string, Blob | Promise<Blob>>) {}
  }
  vi.stubGlobal("ClipboardItem", ClipboardItemMock);

  render(
    <ShareButton
      title="Card"
      url="https://example.com/card"
      imageUrl="https://example.com/card.png"
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  fireEvent.click(await screen.findByRole("button", { name: "Copiar imagem" }));

  await waitFor(() => expect(write).toHaveBeenCalledTimes(1));
  const clipboardItem = write.mock.calls[0][0][0] as ClipboardItemMock;
  await expect(clipboardItem.items["image/png"]).resolves.toBeInstanceOf(Blob);
});

it("shares the actual image file with the source and title", async () => {
  const share = vi.fn(async (data: ShareData) => {
    expect(data.files).toHaveLength(1);
  });
  Object.defineProperty(navigator, "canShare", {
    configurable: true,
    value: vi.fn(() => true),
  });
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: share,
  });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["image bytes"], { type: "image/png" }),
    }),
  );

  render(
    <ShareButton
      title="Card"
      url="https://example.com/card"
      imageUrl="https://example.com/card.png"
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  fireEvent.click(
    await screen.findByRole("button", { name: "Compartilhar via WhatsApp" }),
  );

  await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
  const shareData = share.mock.calls[0][0];
  expect(shareData.text).toBe("Card\n\nhttps://example.com/card");
  expect(shareData.files?.[0]).toMatchObject({
    name: "image.png",
    type: "image/png",
  });
});

it("shares the title and canonical URL when there is no image", async () => {
  const open = vi.spyOn(window, "open").mockImplementation(() => null);
  render(<ShareButton title="Card" url="https://example.com/card" />);
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  fireEvent.click(
    await screen.findByRole("button", { name: "Compartilhar via WhatsApp" }),
  );

  const whatsappUrl = new URL(open.mock.calls[0][0] as string);
  expect(whatsappUrl.searchParams.get("text")).toBe(
    "Card\nhttps://example.com/card",
  );
});

it("shares a title image on mobile when there is no image URL", async () => {
  Object.defineProperty(navigator, "userAgent", {
    configurable: true,
    value: "Android",
  });
  const gradient = { addColorStop: vi.fn() };
  const fillText = vi.fn();
  const context = {
    createLinearGradient: vi.fn(() => gradient),
    fillRect: vi.fn(),
    fillText,
    measureText: vi.fn(() => ({ width: 100 })),
  };
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: () => context,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    configurable: true,
    value: (callback: BlobCallback) =>
      callback(new Blob(["story image"], { type: "image/png" })),
  });
  const canShare = vi.fn((data: ShareData) => Boolean(data.files?.length));
  const share = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "canShare", {
    configurable: true,
    value: canShare,
  });
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: share,
  });

  render(<ShareButton title="Card" url="https://example.com/card" />);
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Compartilhar via Instagram" }),
  );

  await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
  expect(fillText).toHaveBeenCalledWith("Card", 540, 400, 840);
  expect(fillText).toHaveBeenCalledWith(
    "https://example.com/card",
    540,
    1000,
    888,
  );
  expect(fillText).toHaveBeenCalledWith(
    "@techcontrabolsonaro.dev",
    96,
    1670,
    888,
  );
  expect(fillText).toHaveBeenCalledWith(
    "https://techcontraflaviobolsonaro.dev/",
    96,
    1610,
    888,
  );
  expect(gradient.addColorStop).toHaveBeenNthCalledWith(1, 0, "#1800d8");
  expect(gradient.addColorStop).toHaveBeenNthCalledWith(2, 1, "#1000aa");
  const canShareData = canShare.mock.calls[0]?.[0];
  expect(canShareData?.files?.[0]).toMatchObject({
    name: "story.png",
    type: "image/png",
  });
  expect(share.mock.calls[0][0]).toEqual({
    files: [expect.objectContaining({ name: "story.png", type: "image/png" })],
  });
});

it("shares only the image file to Instagram when an image exists", async () => {
  Object.defineProperty(navigator, "userAgent", {
    configurable: true,
    value: "Android",
  });
  const share = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "canShare", {
    configurable: true,
    value: vi.fn(() => true),
  });
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: share,
  });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["image bytes"], { type: "image/png" }),
    }),
  );

  render(
    <ShareButton
      title="Card"
      url="https://example.com/card"
      imageUrl="https://example.com/card.png"
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  fireEvent.click(
    await screen.findByRole("button", { name: "Compartilhar via Instagram" }),
  );

  await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
  const shareData = share.mock.calls[0][0];
  expect(Object.keys(shareData)).toEqual(["files"]);
  expect(shareData.files?.[0]).toMatchObject({
    name: "image.png",
    type: "image/png",
  });
});

it("only opens Instagram on desktop, even when the content has an image", async () => {
  const open = vi.spyOn(window, "open").mockImplementation(() => null);
  const share = vi.fn();
  const writeText = vi.fn();
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: share,
  });
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });

  render(
    <ShareButton
      title="Card"
      url="https://example.com/card"
      imageUrl="https://example.com/card.png"
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Compartilhar via Instagram" }),
  );

  expect(open).toHaveBeenCalledWith(
    "https://www.instagram.com/",
    "_blank",
    "noopener,noreferrer",
  );
  expect(share).not.toHaveBeenCalled();
  expect(writeText).not.toHaveBeenCalled();
});
