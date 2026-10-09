// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createHandler } from "./handler";
const valid = { name: "Pessoa Fictícia", email: "  QA@EXAMPLE.INVALID ", phone: "(11) 99999-0000", work_area: "Tecnologia", consent: "true", "cf-turnstile-response": "unique-token" };
function setup() {
  const verifyTurnstile = vi.fn().mockResolvedValue(true);
  const recordSignature = vi.fn().mockResolvedValue(true);
  const handler = createHandler({ verifyTurnstile, recordSignature });
  const post = (override: Record<string, string> = {}) => {
    const body = new FormData();
    for (const [key,value] of Object.entries({...valid,...override})) body.set(key,value);
    return handler(new Request("http://localhost/functions/v1/submit-manifesto", {method:"POST",body}));
  };
  return {post, verifyTurnstile, recordSignature, handler};
}
describe("manifesto signatures", () => {
  it("normalizes contact and defines consent versions server-side without returning PII", async () => {
    const {post,recordSignature}=setup(); const response=await post({manifesto_version:"evil",consent_version:"evil"});
    expect(response.status).toBe(200); expect(await response.json()).toEqual({ok:true});
    expect(recordSignature.mock.calls[0][0]).toEqual(expect.objectContaining({name:valid.name,email:"qa@example.invalid",phone:"+5511999990000",work_area:"Tecnologia",manifesto_version:"2026-10-09-v1",consent_version:"2026-10-09-v1",consent:true}));
    expect(recordSignature.mock.calls[0][1]).toMatch(/^[a-f0-9]{64}$/);
  });
  it.each([{name:" "},{email:"a@b"},{email:"x".repeat(255)+"@example.com"},{phone:"(20) 99999-0000"},{phone:"119999"},{phone:"letters11999990000"},{work_area:" "},{name:"a".repeat(161)},{work_area:"a".repeat(121)},{consent:"false"},{consent:""}])("rejects invalid required input %j",async override=>{
    const {post,recordSignature}=setup();expect((await post(override)).status).toBe(400);expect(recordSignature).not.toHaveBeenCalled();
  });
  it("rejects missing/failed protection and persistent replay",async()=>{
    const {post,verifyTurnstile,recordSignature}=setup();
    expect((await post({"cf-turnstile-response":""})).status).toBe(400);expect(verifyTurnstile).not.toHaveBeenCalled();
    verifyTurnstile.mockResolvedValueOnce(false);expect((await post()).status).toBe(400);expect(recordSignature).not.toHaveBeenCalled();
    recordSignature.mockResolvedValueOnce(false);expect((await post()).status).toBe(400);
  });
  it("returns the same generic success for accepted new and duplicate signatures",async()=>{
    const {post}=setup();expect(await (await post()).json()).toEqual(await (await post()).json());
  });
  it("does not leak provider/storage errors",async()=>{
    const {post,recordSignature}=setup();recordSignature.mockRejectedValue(new Error("sensitive provider detail"));
    const r=await post();expect(r.status).toBe(500);expect(await r.text()).not.toContain("sensitive");
  });
  it("rejects malformed and oversized requests",async()=>{
    const {handler}=setup();
    expect((await handler(new Request("http://localhost",{method:"POST",body:"bad"}))).status).toBe(400);
    expect((await handler(new Request("http://localhost",{method:"POST",headers:{"content-length":"40000"},body:"bad"}))).status).toBe(413);
  });
});
