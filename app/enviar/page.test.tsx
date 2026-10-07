import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import EnviarPage from "./page";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
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
  document.body.append(token);

  render(<EnviarPage />);
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
