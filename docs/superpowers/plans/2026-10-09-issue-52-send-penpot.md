# Issue 52 — Enviar Penpot

Goal: reproduce the authorized Enviar frame while preserving real content submission.

Reference: MCP confirmed Vira Voto — Landing page neobrutalista (cópia), Page 1, 2fc2f195-1337-5226-a193-05a76c7bc2ff, 1440×1671. One Enviar root; similarly named Enviar uma ideia boards are Home CTAs. No mobile Enviar frame. 900/390 use the same tokens and reading hierarchy in one column.

- [x] Fetch tech-contra-flavio-web/main (2671285c), isolate feat/issue-52-send-penpot; read local Next client/CSS/scripts guides and existing RHF/backend.
- [x] Reuse SiteNav home variant and Penpot footer on Enviar only; preserve other routes and SEO.
- [x] Update app/enviar/page.tsx static composition and original SVG star. Scope CSS to content-submission-page to avoid tool/manifesto regression.
- [x] Update submission-form.tsx upload surface using native accessible file input, existing Input/Textarea/Button and original SVG upload/arrow. Match static copy and all measured type/border/spacing/background values.
- [x] Verify client validation matches backend: one file or video URL, allowed MIME, 25MB max, required trimmed text. Preserve endpoint and FormData. Reset consumed Turnstile for retry; maintain focus and feedback states.
- [x] Run meaningful form tests, full Vitest, lint, TypeScript/build. Serve bun dev3052 with ignored mode600 local env and seeded existing Supabase only.
- [ ] QA complete visual composition at1440/900/390, keyboard/focus/upload/link/validation/pending/reset/retry/toasts/anti-spam; isolate browser fixtures from real local integration and report dummy challenge limits.
- [ ] Obtain independent QA review. Report GO with evidence to Tech lead before commit/push; lead handles commit/PR/merge.

Implementation notes before QA signoff:
- Desktop challenge is a required production behavior absent from the reference. Visible Turnstile adds 75px plus28px gap, panel1332/section1524/footer y1636/total1774 rather than frame1671; all preceding field geometry remains aligned.
- Mobile panel padding22 leaves302px for the flexible challenge at390 and prevents inner horizontal scroll. Touch inputs use16px type. The same 3-step sequence, star, form and footer remain in reading order.
- No deadline on binary uploads: slow25MB requests remain pending, duplicate submits guarded. Tests advance fake timers21sec then complete successfully. Token renewed after attempts without removing success confirmation.
- Local env copied from the verified Manifesto worktree, ignored and mode600. No keys logged or production settings edited; real Supabase local endpoints unchanged.
- Latest verification:21 Vitest files/137 tests passed; lint, tsc and production build passed. Independent QA in progress; no commit/push in implementer role.

Final visual corrections before QA GO: upload border uses original SVG stroke4 clipped inward to2px, dash12/12; native resize decoration replaced by original rotated12×2 rectangle SVG. Upload icon uses full exported54px viewBox with7px bleed around40px logical slot, preserving full2.5px stroke and alignment.
