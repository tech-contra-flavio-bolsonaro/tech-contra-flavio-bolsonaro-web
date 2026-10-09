# Issue 71 — Manifesto e assinaturas

Escopo aprovado pelo usuário; execução inline, sem commit/push.

- [x] Reproduzir frame Manifesto `f3274f73-645d-56b8-ac3b-7dda0a59fb9f`, Page 1: textos, tipografia, cores, bordas, sombras, composição. Preservar Home e SEO; mudar somente CTA Home.
- [x] Acrescentar CTA inicial com âncora/foco e formulário final RHF/primitives, baseado no frame Enviar `2fc2f195-1337-5226-a193-05a76c7bc2ff` (adaptação, não parte 1:1 do Manifesto). Nome, e-mail, telefone com DDD e área de atuação na tecnologia obrigatórios, consentimento explícito, finalidade exclusiva assinatura, erros inline, retry/toast sem PII.
- [x] Testar e implementar normalização/validação compartilhada, Edge Function submit-manifesto com Turnstile e proteção persistente de replay. Resposta idempotente por email, sem atualizar assinatura anterior. Versões e timestamp definidos no servidor.
- [x] Migration incremental: manifesto_signatures privada RLS/revoke; registro temporário de hashes de desafios para replay, sem IP. RPC transacional acessível somente service_role. Seed separado fictício, local e idempotente.
- [x] Release: migration → função nova → hook Vercel, sem executar release nesta tarefa.
- [x] Validar Docker existente via mounts, sem reset: migration/seed/endpoint real/duplicata/replay/revoke anon e authenticated. App bun dev local, estados e acessibilidade 1440/900/390 com capturas.
- [x] Testes/lint/tsc/build/diff-check; QA independente via Maestri; reporte completo ao Tech lead. Nenhum commit/push.

GO independente final do QA recebido após retestes visuais/estados/segurança. Reporte completo ao Tech lead via Maestri; nenhum commit/push/release. Evidências: `docs/qa/issue-71-manifesto.md`.
