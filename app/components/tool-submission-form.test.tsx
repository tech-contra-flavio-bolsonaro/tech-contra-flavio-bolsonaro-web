import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ToolSubmissionForm } from "./tool-submission-form";

const script = vi.hoisted(() => ({ ready: undefined as (() => void) | undefined }));
vi.mock("next/script", () => ({ default: ({ onReady }: { onReady: () => void }) => { script.ready = onReady; return null; } }));
const reset = vi.fn();
const remove = vi.fn();
let solve: (token: string) => void;
beforeEach(() => {
  reset.mockClear(); remove.mockClear();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://database.example.com");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
  vi.stubGlobal("turnstile", { reset, remove, render: (_element: HTMLElement, options: { callback: typeof solve }) => { solve = options.callback; return "widget-1"; } });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

function fill() {
  render(<ToolSubmissionForm />);
  act(() => script.ready?.());
  for (const [label, value] of [["Nome *", "Mapa de ações"], ["Descrição *", "Encontre ações na comunidade."], ["Link da ferramenta *", "https://example.com"], ["Categoria *", "Planejamento"], ["Crédito *", "Coletivo"]]) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
}

it("requires a challenge before submitting", () => {
  const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
  fill();
  fireEvent.submit(screen.getByRole("form"));
  expect(screen.getByRole("alert")).toHaveTextContent("Confirme a proteção");
  expect(fetch).not.toHaveBeenCalled();
});

it("confirms receipt, clears fields and resets the used challenge", async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetch); fill();
  act(() => solve("valid-token"));
  fireEvent.submit(screen.getByRole("form"));
  expect(await screen.findByRole("status")).toHaveTextContent("após a curadoria");
  expect(screen.getByLabelText("Nome *")).toHaveValue("");
  expect(fetch.mock.calls[0][1].body.get("cf-turnstile-response")).toBe("valid-token");
  expect(reset).toHaveBeenCalledWith("widget-1");
});

it("preserves fields on failure and requires a new challenge for the retry", async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Falha ao enviar." }) });
  vi.stubGlobal("fetch", fetch); fill();
  act(() => solve("valid-token"));
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Falha ao enviar."));
  expect(screen.getByLabelText("Nome *")).toHaveValue("Mapa de ações");
  expect(reset).toHaveBeenCalledWith("widget-1");
  fireEvent.submit(screen.getByRole("form"));
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("alert")).toHaveTextContent("Confirme a proteção");
});

it.each(["network", "gateway"])("shows Portuguese recovery text for a %s failure", async (failure) => {
  const fetch = failure === "network"
    ? vi.fn().mockRejectedValue(new Error("Failed to fetch"))
    : vi.fn().mockResolvedValue({ ok: false, json: async () => { throw new SyntaxError("Unexpected token"); } });
  vi.stubGlobal("fetch", fetch); fill();
  act(() => solve("valid-token"));
  fireEvent.submit(screen.getByRole("form"));
  expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível enviar");
  expect(screen.getByLabelText("Nome *")).toHaveValue("Mapa de ações");
});
