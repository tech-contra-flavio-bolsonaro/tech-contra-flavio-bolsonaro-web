# Issue 51 — Conteúdos Penpot Implementation Plan

**Goal:** Aplicar Page 1 / Conteúdos à página inteira, com feed real e estados acessíveis.
**Architecture:** Página server com shell existente, feed client incremental, componentes listing isolados. Variante Home preservada. Sem alteração de backend privado/approved/página10.
**Tech stack:** Next16.3.7, React19, Bun, Vitest, Supabase local existente.

## Fonte e escopo confirmado

Fresh fetch main0b268465, worktree /private/tmp/vira-voto-issue-51, branch feat/issue-51-content-list-penpot. MCP arquivo17193a1f-939a-80b5-8008-c2e37c935208, Page1f5f30d69-ccc3-808f-8008-c2deec680988. Frame Conteúdos969f1963-482a-5c8a-ad4a-25f282a4cc9e1440x1577 único confirmado. Home duplicada; Blog listagem/detalhe e Comunidade desktop/mobile NÃO são frames de Conteúdos. Nenhum mobile Conteúdos. Steering posterior AUTORIZA Blog listagem desktop/mobile como referência populated, mantendo hero/empty Conteúdos. Usuário confirmou execução autônoma e adaptação populada usando Blog listagem autorizado e identidade do mesmo arquivo; preparação somente empty. QA GO obrigatório antes commit/push.

## Execução

- [x] Ler AGENTS e guias Next layouts/pages e server/client no pacote local antes de código.
- [x] Exportar frame e inventariar texto/geometria/tipografia/cores/ícones/raios/sombras via MCP.
- [x] Test-first: empty listing distinto de Home; retry inicial e incremental preservando itens; duplicatas e requests concorrentes; vídeo mp4/webm com preview correto; share com título/descrição/crédito reais.
- [x] Criar content-list-state.tsx e listing-content-card.tsx; estilos isolados em conteudos/conteudos.css; página com SiteNav home e footer existente habilitado para /conteudos.
- [x] Feed: variante listing, dedup id, lock request, ignorar respostas obsoletas ao desmontar, limite Home sem paginação extra, retry explícito sem loop automático em erro. Manter API page10, approved e Storage signed URLs.
- [x] Empty desktop: header112; hero88/80/64, eyebrow12/15, heading132/.94, body22/1.6 largura820; content padding24/80/100, painel1280x784 inset3px/radius8/shadow10, gaps56 e padding38/64/80; símbolo72, heading72/1; placeholders3x210 gap28 opacity.17; CTA258x58; footer138.
- [x] Populated adaptação documentada: Blog desktop1dbf6d5c-73c9-59ea-8c50-f848bb97649c/mobileba0ec9ec-3874-5730-b07c-e1169e45093d; grid3col400/gap40, tablet2colgap28, mobile1colgap20; borda2/faixa12/sombra7; superfícies branca/coral. Mídia real contain210 sem cortar retrato, links sem slot vazio e íconeoriginal; crédito mono, heading Barlow36/32, descrição Inter16. ShareButton/dialog existentes apenas variante listing; sem ações novas/download. Sem dados fixos no app.
- [x] Loading/error usam mesma composição, feedback real/status/alert, retry; empty único contém preparação. Mobile900/390 mantém ordem e hierarquia, menu existente, cards em uma coluna, Blog mobile autorizado apenas para referência da responsividade populated.
- [x] App bun dev --port3051; env local ignored600, localhost54321/54322, Docker Supabase existing vira-voto-issue67 somente, sem reset nem writes produção. Testar integração seeded separado de fixtures browser.
- [x] QA independente via Maestri: visual todas seções empty vs MCP e populated;1440/900/390, zoom200 real, mídia portrait/landscape/video, paginação+duplicatas, empty/loading/error/retry, teclado/foco/Escape/menu/share/toasts, regressões Home/Manifesto/Enviar.
- [x] Executar bun run test; bun run lint; bunx tsc --noEmit --incremental false; bun run build; git diff --check. Inspecionar evidências/capturas, corrigir achados, documentar métricas e parecer GO, comunicar Tech lead antes entrega.

## Steering e correções de revisão

- [x] Corrigir expectativa footer, preservando cobertura legado em /ferramentas.
- [x] Preservar foco mais/retry pending, lock concorrência; foco intencional ao primeiro item novo ao esgotar. Dois novos testes regressivos.
- [x] Grid stretch por linha desktop/tablet com ações alinhadas; excerpts3linhas title/description no listing, texto integral no modal existente.
- [x] Adição usuário Home: hero Leia e assine o manifesto /manifesto; coral Conheça nosso hub /ferramentas. Eyebrow coral NOSSO HUB (steering final); preservar frase/arte/fontes/metadata; teste labels/destinos/localização, largura CTA mínima necessária.
- [x] Checks frescos151testesPASS, lint0, TypeScript0, build0; diffcheck0. Evidências issue51-implementation/*-final.log.
- [x] Receber e registrar GO visual integrado independente antes entrega. Sem commit/push conforme orientação final Tech lead.

Adaptações explícitas populated vs Blog: faixa azul#1900d0 em vez amarelo#ffef35 desktop; coral sistema#ff8575 em vez#ff8077; mobile faixa superior8px em vez lateral9px/card64px compacto. Identidade Conteúdos e mídia/crédito/ações existentes justificam escopo; não afirmar correspondência1:1 nem atribuir ao dataset. Empty é a correspondência autoritativa integral.

GO integrado final recebido do QA, sem findings: docs/qa/issue-51-independent-review.md.151testes/21arquivos +lint/tsc/build/diff-check exit0 independentes e implementer. Home final NOSSO HUB; sem commit/push conforme orientação.
