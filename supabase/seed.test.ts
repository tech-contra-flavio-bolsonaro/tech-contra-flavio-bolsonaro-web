import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

const seed = readFileSync(join(process.cwd(), "supabase/seed.sql"), "utf8");

it("provides deterministic moderation scenarios without personal data", () => {
  expect(seed).toContain("'approved'");
  expect(seed).toContain("'pending'");
  expect(seed).toContain("'rejected'");
  expect(seed).toContain("on conflict (id) do update");
  expect(seed).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(seed).not.toMatch(/(secret|password|service_role|sb_secret)/i);
});
