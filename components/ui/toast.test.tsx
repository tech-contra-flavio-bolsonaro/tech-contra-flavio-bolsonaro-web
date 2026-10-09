import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createToastManager, Toaster } from "@/components/ui/toast";

type ToastData = { actionLabel?: string };

describe("toast feedback", () => {
  it("does not render an empty action control when the toast has no action", () => {
    const manager = createToastManager<ToastData>();
    render(<Toaster toastManager={manager} />);

    act(() => {
      manager.add({
        type: "success",
        title: "Conteúdo recebido",
        description: "Ele será publicado após a curadoria.",
      });
    });

    expect(screen.getByText("Conteúdo recebido")).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="toast-action"]')).toHaveLength(0);
    expect(document.querySelector('[data-slot="toast-close"]')).toHaveAttribute(
      "aria-label",
      "Fechar notificação",
    );
  });

  it("renders an optional labelled action when provided", () => {
    const manager = createToastManager<ToastData>();
    render(<Toaster toastManager={manager} />);

    act(() => {
      manager.add({
        type: "warning",
        title: "Ação necessária",
        data: { actionLabel: "Revisar" },
        actionProps: { onClick: () => undefined },
      });
    });

    expect(screen.getByRole("button", { name: "Revisar" })).toBeInTheDocument();
  });
});
