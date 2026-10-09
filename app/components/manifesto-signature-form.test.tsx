import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ManifestoSignatureForm } from "./manifesto-signature-form";
import { ManifestoSignLink } from "./manifesto-sign-link";
const script=vi.hoisted(()=>({ready:undefined as (()=>void)|undefined}));
vi.mock("next/script",()=>({default:({onReady}:{onReady:()=>void})=>{script.ready=onReady;return null;}}));
const notifications=vi.hoisted(()=>({add:vi.fn()}));vi.mock("@/components/ui/toast",()=>({toast:notifications}));
const reset=vi.fn(); const remove=vi.fn(); let solve:(token:string)=>void; let expire:()=>void;
beforeEach(()=>{
 reset.mockClear();remove.mockClear();notifications.add.mockClear();
 vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL","http://localhost:54321");vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY","test");
 vi.stubGlobal("turnstile",{reset,remove,render:(_el:HTMLElement,options:{callback:typeof solve;"expired-callback":()=>void})=>{solve=options.callback;expire=options["expired-callback"];return "signature-widget";}});
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.unstubAllEnvs();});
function fill(){
 render(<ManifestoSignatureForm/>);act(()=>script.ready?.());
 for(const [label,value] of [["Nome *","Pessoa Fictícia"],["E-mail *"," QA@example.invalid "],["Telefone com DDD *","(11) 99999-0000"],["Área de atuação na tecnologia *","Tecnologia"]])fireEvent.change(screen.getByLabelText(label),{target:{value}});
 fireEvent.click(screen.getByRole("checkbox"));
}
it("shows errors below required fields and focuses first invalid input without native popovers",async()=>{
 const fetch=vi.fn();vi.stubGlobal("fetch",fetch);render(<ManifestoSignatureForm/>);
 expect(screen.getByRole("checkbox")).not.toBeChecked();expect(screen.getByRole("form")).toHaveAttribute("novalidate");
 fireEvent.submit(screen.getByRole("form"));await waitFor(()=>expect(screen.getAllByRole("alert")).toHaveLength(5));
 expect(screen.getByLabelText("Nome *")).toHaveFocus();expect(fetch).not.toHaveBeenCalled();
 for(const label of ["Nome *","E-mail *","Telefone com DDD *","Área de atuação na tecnologia *"])expect(screen.getByLabelText(label)).toHaveAttribute("aria-invalid","true");
});
it("requires explicit consent and rejects invalid DDD/email inline",async()=>{
 const fetch=vi.fn();vi.stubGlobal("fetch",fetch);fill();fireEvent.click(screen.getByRole("checkbox"));
 fireEvent.change(screen.getByLabelText("Telefone com DDD *"),{target:{value:"(20) 99999-0000"}});fireEvent.change(screen.getByLabelText("E-mail *"),{target:{value:"invalid"}});
 fireEvent.submit(screen.getByRole("form"));await waitFor(()=>expect(screen.getAllByRole("alert")).toHaveLength(3));expect(fetch).not.toHaveBeenCalled();
});
it("requires a fresh challenge when expired",async()=>{
 const fetch=vi.fn();vi.stubGlobal("fetch",fetch);fill();act(()=>solve("token"));act(()=>expire());fireEvent.submit(screen.getByRole("form"));
 expect(await screen.findByRole("alert")).toHaveTextContent("Confirme a proteção");expect(fetch).not.toHaveBeenCalled();
});
it("does not move focus to form feedback",async()=>{
 const fetch=vi.fn();vi.stubGlobal("fetch",fetch);fill();
 const consent=screen.getByRole("checkbox");consent.focus();fireEvent.submit(screen.getByRole("form"));
 const feedback=await screen.findByRole("alert");expect(feedback).toHaveTextContent("Confirme a proteção");expect(consent).toHaveFocus();
});
it("sends normalized values, resets consent/challenge and announces generic success without PII",async()=>{
 const fetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({ok:true})});vi.stubGlobal("fetch",fetch);fill();act(()=>solve("token"));fireEvent.submit(screen.getByRole("form"));
 const feedback=await screen.findByRole("status");expect(feedback).toHaveTextContent("Solicitação de assinatura recebida");expect(feedback).not.toHaveFocus();
 expect(screen.getByLabelText("Nome *")).toHaveValue("");expect(screen.getByRole("checkbox")).not.toBeChecked();
 const body=fetch.mock.calls[0][1].body;expect(body.get("phone")).toBe("+5511999990000");expect(body.get("email")).toBe("qa@example.invalid");expect(body.get("consent")).toBe("true");
 expect(reset).toHaveBeenCalledWith("signature-widget");expect(JSON.stringify(notifications.add.mock.calls)).not.toContain("qa@example");expect(JSON.stringify(notifications.add.mock.calls)).not.toContain("Pessoa Fictícia");
});
it("preserves data on errors, hides provider detail and retries with a new challenge",async()=>{
 const fetch=vi.fn().mockResolvedValueOnce({ok:false,json:async()=>({error:"private provider data"})}).mockResolvedValueOnce({ok:true,json:async()=>({ok:true})});vi.stubGlobal("fetch",fetch);fill();act(()=>solve("token1"));fireEvent.submit(screen.getByRole("form"));
 const feedback=await screen.findByRole("alert");expect(feedback).not.toHaveFocus();expect(feedback).not.toHaveTextContent("private");expect(screen.getByLabelText("Nome *")).toHaveValue("Pessoa Fictícia");
 fireEvent.submit(screen.getByRole("form"));await waitFor(()=>expect(screen.getByRole("alert")).toHaveTextContent("Confirme a proteção"));expect(fetch).toHaveBeenCalledTimes(1);
 act(()=>solve("token2"));fireEvent.submit(screen.getByRole("form"));expect(await screen.findByRole("status")).toBeInTheDocument();expect(fetch).toHaveBeenCalledTimes(2);
});
it("prevents simultaneous submissions",async()=>{
 let done:(r:unknown)=>void=()=>{};const fetch=vi.fn().mockReturnValue(new Promise(r=>{done=r}));vi.stubGlobal("fetch",fetch);fill();act(()=>solve("token"));
 fireEvent.submit(screen.getByRole("form"));fireEvent.submit(screen.getByRole("form"));await waitFor(()=>expect(fetch).toHaveBeenCalledTimes(1));
 expect(screen.getByRole("button")).toBeDisabled();await act(async()=>done({ok:true,json:async()=>({ok:true})}));
});
it("moves keyboard focus to the signature heading via the initial anchor",()=>{
 render(<><ManifestoSignLink/><h2 id="assinar-manifesto" tabIndex={-1}>Assine o manifesto.</h2></>);fireEvent.click(screen.getByRole("link"));expect(screen.getByRole("heading")).toHaveFocus();
});
