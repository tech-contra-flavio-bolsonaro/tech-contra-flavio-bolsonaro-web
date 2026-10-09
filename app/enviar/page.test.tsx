import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import EnviarPage from "./page";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  Reflect.deleteProperty(window, "turnstile");
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  document.querySelectorAll('input[name="cf-turnstile-response"]').forEach(element => element.remove());
});

it("offers an enabled action to send content for curation", () => {
  render(<EnviarPage />);

  expect(screen.getByTestId("submission-form-surface")).toBeInTheDocument();
  expect(screen.getByLabelText("Título *")).toHaveAttribute("name", "title");
  expect(screen.getByLabelText("Descrição *")).toHaveAttribute("name", "description");
  expect(
    screen.getByRole("button", { name: "Enviar para curadoria" }),
  ).toBeEnabled();
});

it("shows the required title error below its field instead of using browser validation", async () => {
  render(<EnviarPage />);

  const form = screen.getByTestId("submission-form-surface");
  fireEvent.submit(form);

  expect(form).toHaveAttribute("novalidate");
  expect(await screen.findByText("Informe um título para o material.")).toBeInTheDocument();
  expect(screen.getByLabelText("Título *")).toHaveAttribute("aria-invalid", "true");
});

it("sends the Turnstile token with a valid submission", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));
  const token = document.createElement("input");
  token.name = "cf-turnstile-response";
  token.value = "turnstile-token";
  render(<EnviarPage />);
  screen.getByTestId("submission-form-surface").append(token);
  fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "Material comunitário" } });
  fireEvent.change(screen.getByLabelText("Descrição *"), { target: { value: "Descrição suficiente para enviar o material." } });
  fireEvent.change(screen.getByLabelText("Crédito *"), { target: { value: "Coletivo" } });
  fireEvent.change(screen.getByLabelText("Link de vídeo"), { target: { value: "https://example.com/video" } });
  fireEvent.submit(screen.getByTestId("submission-form-surface"));

  await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
  const request = fetchMock.mock.calls[0]?.[1];
  expect(request?.body).toBeInstanceOf(FormData);
  expect((request?.body as FormData).get("cf-turnstile-response")).toBe("turnstile-token");
});

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "Material comunitário" } });
  fireEvent.change(screen.getByLabelText("Descrição *"), { target: { value: "Descrição suficiente para enviar o material." } });
  fireEvent.change(screen.getByLabelText("Crédito *"), { target: { value: "Coletivo" } });
}

it("rejects an upload and video URL together before the request", async () => {
  const request = vi.spyOn(global, "fetch");
  render(<EnviarPage />);
  fillRequiredFields();
  fireEvent.change(screen.getByLabelText("Arquivo"), { target: { files: [new File(["image"], "image.png", { type: "image/png" })] } });
  fireEvent.change(screen.getByLabelText("Link de vídeo"), { target: { value: "https://example.com/video" } });
  fireEvent.submit(screen.getByTestId("submission-form-surface"));
  expect(await screen.findAllByText("Escolha apenas um arquivo ou um link de vídeo.")).toHaveLength(2);
  expect(request).not.toHaveBeenCalled();
});

it("rejects a file above 25 MB inline before submitting", async () => {
  render(<EnviarPage />);
  fillRequiredFields();
  const file = new File(["video"], "video.mp4", { type: "video/mp4" });
  Object.defineProperty(file, "size", { value: 25 * 1024 * 1024 + 1 });
  fireEvent.change(screen.getByLabelText("Arquivo"), { target: { files: [file] } });
  fireEvent.submit(screen.getByTestId("submission-form-surface"));
  expect(await screen.findByText("O arquivo deve ter até 25 MB.")).toBeInTheDocument();
});

it("submits a file to the real endpoint contract and resets its displayed name on success", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  const request = vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
  render(<EnviarPage />);
  fillRequiredFields();
  const file = new File(["image"], "community.png", { type: "image/png" });
  fireEvent.change(screen.getByLabelText("Arquivo"), { target: { files: [file] } });
  const token = document.createElement("input");
  token.name = "cf-turnstile-response"; token.value = "test-token";
  screen.getByTestId("submission-form-surface").append(token);
  fireEvent.submit(screen.getByTestId("submission-form-surface"));
  expect(await screen.findByRole("status")).toHaveTextContent("Conteúdo recebido.");
  expect(request).toHaveBeenCalledWith("http://127.0.0.1:54321/functions/v1/submit-content", expect.objectContaining({ method: "POST" }));
  const body = request.mock.calls[0][1]?.body as FormData;
  expect(body.get("file")).toBe(file);
  expect(body.get("videoUrl")).toBeNull();
  expect(screen.getByLabelText("Título *")).toHaveValue("");
  expect(screen.getByText("Selecionar arquivo")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveFocus();
});

it("keeps content after a failure, prevents concurrent sends, and renews the challenge before retry", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-sitekey");
  let authorize: (token: string) => void = () => {};
  const challenge = {
    render: vi.fn((_element: HTMLElement, options: { callback: (token: string) => void }) => { authorize = options.callback; authorize("first-token"); return "content-widget"; }),
    reset: vi.fn(), remove: vi.fn(),
  };
  Object.assign(window, { turnstile: challenge });
  let finish: (response: Response) => void = () => {};
  const request = vi.spyOn(global, "fetch").mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
  render(<EnviarPage />);
  fillRequiredFields();
  fireEvent.change(screen.getByLabelText("Link de vídeo"), { target: { value: "https://example.com/video" } });
  fireEvent.submit(screen.getByTestId("submission-form-surface"));
  await waitFor(() => expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled());
  await act(async () => { fireEvent.submit(screen.getByTestId("submission-form-surface")); });
  expect(request).toHaveBeenCalledTimes(1);
  await act(async () => { finish(new Response(JSON.stringify({ error: "Falha temporária" }), { status: 503 })); });
  expect(await screen.findByText("Falha temporária")).toHaveFocus();
  expect(screen.getByLabelText("Título *")).toHaveValue("Material comunitário");
  expect(challenge.reset).toHaveBeenCalledWith("content-widget");
  fireEvent.submit(screen.getByTestId("submission-form-surface"));
  expect(await screen.findByText("Confirme a proteção contra spam antes de enviar.")).toBeInTheDocument();
  expect(request).toHaveBeenCalledTimes(1);
  act(() => authorize("renewed-token"));
  fireEvent.submit(screen.getByTestId("submission-form-surface"));
  await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
  expect((request.mock.calls[1][1]?.body as FormData).get("cf-turnstile-response")).toBe("renewed-token");
  expect(await screen.findByRole("status")).toHaveTextContent("Conteúdo recebido.");
  act(() => authorize("next-submission-token"));
  expect(screen.getByRole("status")).toHaveTextContent("Conteúdo recebido.");
  cleanup();
  Reflect.deleteProperty(window, "turnstile");
});

it("treats whitespace-only title as empty and focuses the invalid field", async () => {
  render(<EnviarPage />);
  fillRequiredFields();
  fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "   " } });
  fireEvent.submit(screen.getByTestId("submission-form-surface"));
  expect(await screen.findByText("Informe um título para o material.")).toBeInTheDocument();
  expect(screen.getByLabelText("Título *")).toHaveFocus();
});

it("lets a permitted slow upload complete after 20 seconds and guards duplicate submissions", async () => {
  vi.useFakeTimers();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  let finish: (response: Response) => void = () => {};
  const request = vi.spyOn(global, "fetch").mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  render(<EnviarPage />);
  fillRequiredFields();
  fireEvent.change(screen.getByLabelText("Arquivo"), { target: { files: [new File(["image"], "slow.png", { type: "image/png" })] } });
  const token = document.createElement("input"); token.name = "cf-turnstile-response"; token.value = "test-token";
  screen.getByTestId("submission-form-surface").append(token);
  await act(async () => { fireEvent.submit(screen.getByTestId("submission-form-surface")); });
  const signal = request.mock.calls[0][1]?.signal;
  expect(signal).toBeUndefined();
  await act(async () => { await vi.advanceTimersByTimeAsync(21000); });
  expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled();
  await act(async () => { fireEvent.submit(screen.getByTestId("submission-form-surface")); });
  expect(request).toHaveBeenCalledTimes(1);
  await act(async () => { finish(new Response(JSON.stringify({ ok: true }), { status: 200 })); });
  expect(screen.getByRole("status")).toHaveTextContent("Conteúdo recebido.");
  expect(screen.getByRole("button", { name: "Enviar para curadoria" })).toBeEnabled();
  vi.useRealTimers();
});
