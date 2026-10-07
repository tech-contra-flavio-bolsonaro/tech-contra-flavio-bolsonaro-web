import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ShareButton } from "./share-button";

afterEach(() => {
  Reflect.deleteProperty(navigator, "clipboard");
  vi.unstubAllGlobals();
});

it("opens sharing actions in a dialog", async () => {
  render(<ShareButton title="Card" url="https://example.com/card" />);
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar" }));

  expect(screen.getByRole("button", { name: "WhatsApp" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Abrir Instagram" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Copiar link" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "WhatsApp" })).toHaveClass(
    "share-action-whatsapp",
  );
  expect(screen.getByRole("button", { name: "Abrir Instagram" })).toHaveClass(
    "share-action-instagram",
  );
  expect(screen.getByRole("button", { name: "Copiar link" })).toHaveClass(
    "share-action-copy",
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
