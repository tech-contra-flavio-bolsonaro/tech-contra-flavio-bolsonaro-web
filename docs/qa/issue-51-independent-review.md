# Issue 51 — revisão independente final

**GO no escopo integrado revisado. Sem findings abertos.**

Worktree `/private/tmp/vira-voto-issue-51`, branch `feat/issue-51-content-list-penpot`, HEAD/base `0b268465`. App Bun local `http://localhost:3051`; Supabase local existente, sem reset. Revisão de diff e todos os arquivos novos, capturas reais Chromium, comparação visual MCP e matriz funcional. Nenhuma implementação editada pelo QA; nenhum commit/push/merge, dado persistido ou acesso a backend de produção.

## Referências e comparação visual

Arquivo Penpot `17193a1f-939a-80b5-8008-c2e37c935208`, Page1. Exportações independentes salvas em `/private/tmp/issue51-qa/` (todos os nomes de evidência abaixo referem-se a esse diretório):

- Conteúdos empty autoritativo `969f1963-482a-5c8a-ad4a-25f282a4cc9e`: `penpot-empty.png`, `penpot-measurements.json`.
- Blog desktop autorizado como fonte de composição populated `1dbf6d5c-73c9-59ea-8c50-f848bb97649c`: `penpot-blog-desktop.png`.
- Blog mobile autorizado `ba0ec9ec-3874-5730-b07c-e1169e45093d`: `penpot-blog-mobile.png`; medidas de ambos em `penpot-blog-measurements.json`.

**Empty comparado integralmente:** header/logo/página ativa/links/CTA; hero/eyebrow/título/introdução/grid; painel/status/pixels/arquivo/heading/placeholders/ícones/separador/contribuição; footer/logo/links/créditos. Conferidos composição e hierarquia, textos estáticos, cores, fontes/pesos/tamanhos/entrelinha/tracking, fundos, bordas/raios/sombras, gaps/paddings/alinhamentos e estados de interação. A exportação dos ícones conserva bleed de stroke após refino. Sem desvio visual material remanescente.

| Evidência desktop empty | Medida final |
| --- | --- |
| Página | 1440 × 1577 |
| Header | 112px |
| Hero | y112, altura419; padding88/80/64, gap28 |
| Título | Barlow Condensed800, 132px/.94, tracking0 |
| Introdução | x80/y396, 820×71, Inter40022/35.2; quebra após “para” |
| Painel | x80/y555, 1280×784, raio8, inset3, sombra10 |
| Heading preparação | 72px/72px, peso800, caixa original |
| Placeholders | três colunas, 210px altura, gap28, opacity.17 |
| Contribuição | separador64×3, CTA258×58 |
| Footer | y1439, altura138; conteúdo estático corresponde |

**Populated comparado ao grid Blog autorizado, mantendo identidade Conteúdos.** Desktop: três cards400px/gap40/borda2/sombra7/faixa12. Tablet: duas colunas/gap28. Mobile: uma coluna346px/gap20, sem overflow. Hierarquia de crédito/formato/título/descrição/ações coerente; referências sem mídia não recebem thumbnail ou slot vazio. Mídias reais usam preview210px/contain. Após correção, cards e ações alinham por linha em desktop/tablet; mobile mantém alturas naturais. Excerpts de heading/descrição em três linhas somente na listagem; modal recebe conteúdo integral.

Populated **não é reprodução 1:1 de Blog**. Diferenças intencionais explicitadas no handoff/plano/docs: Barlow/Inter/IBM em vez de Arial/Arial Black; headings36/32 e corpo16; faixa azul#1900d0 em vez de amarelo#ffef35; coral#ff8575 em vez de#ff8077; mobile faixa superior8px em vez de lateral9px/cards64px compactos. Crédito/mídia/ações existentes explicam a adaptação funcional; diferenças de design são registradas separadamente do dataset. Não foram importados textos, taxonomias, filtros ou destinos Blog. Header/hero/empty/footer continuam Conteúdos.

Capturas completas finais: `empty-{1440,900,390}.png`, `real-{1440,900,390}.png`, `mixed-{1440,900,390}.png`. Detalhes empty em `empty-detail-WIDTH.png`; dialogs reais em `real-dialog-WIDTH.png`; dialogs mixed por tipo em `mixed-dialog-{portrait,landscape,video,reference,long}-WIDTH.png`, incluindo scroll até ações em `mixed-dialog-long-bottom-WIDTH.png`. Medidas completas/tokens/erros/overflow em `visual-metrics.json` e `matrix.json`.

## Matriz funcional e integração

| Caso | Resultado/evidência |
| --- | --- |
| API real local aprovada | Páginas10+1; 11IDs únicos, sem duplicação. `api-page0.json`, `api-page1.json`, `matrix.json` real-pagination, `real-all-11-1440.png` |
| Loading inicial / erro / retry | Painel diferencia carregamento, erro e preparação. Retry retorna populated; capturas `loading-WIDTH.png`, `error-WIDTH.png` |
| Incremental loading / erro / retry | Cards conservados, retry da mesma página, sem loop automático; `incremental-{loading,error}-WIDTH.png` |
| Dedup / concorrência | Requests fixture `[0,0,1,1]` para erro+retry inicial/incremental; observers repetidos não duplicam fetch; ID duplicado atualiza metadata sem duplicar card |
| Teclado pending / final | Controle montado, aria-busy/disabled e lock; foco permanece pending, vai ao primeiro novo article no fim. `matrix.json` |
| Casos extras de foco | Retry→empty foca heading; última página sem novos itens foca feedback; foco movido pelo usuário não é roubado; Enter repetido gera somente um fetch. `focus-cases.json` |
| Portrait / landscape | PNGs reais de teste isolados240×960 e960×480, preview contain e imagem integral no modal; clipboard nativa PNG conserva dimensões originais |
| Vídeo válido | MP4 real flower reproduziu no card e no modal, readyState4/natural960×540/currentTime>0.15; `media-interactions.json`, `video-playing-dialog-WIDTH.png` |
| Referência sem imagem | Sem elemento de preview; ícone/crédito/título/descrição/destino reais. Link copiado correto |
| Imagem + referência associada | Imagem principal, Copiar imagem, link associado preservado no dialog |
| Dialog / teclado / Escape | Metadados íntegros, mídia correspondente, ações acessíveis por scroll em conteúdos longos; Escape retorna foco ao trigger após animação |
| Menu900/390 | Enter abre, Tab alcança Manifesto, Escape fecha e devolve foco ao Menu; `media-interactions.json` |
| Clipboard / toasts / links | PNG e link nativos passaram. Negação de clipboard foi simulada e exibiu toast de erro correto, sem atribuir falha ao código. WhatsApp/Instagram tiveram abertura interceptada para conferir destinos sem enviar conteúdo |
| Download | Ausente no baseline e na versão revisada; nenhuma ação acrescentada |

Fixtures só interceptam respostas no navegador; não foram gravadas no app/backend. Seed real possui11 `video_url` MP4 externos e **zero uploads Storage**. Integração de upload/Storage/expiração de URLs assinadas não foi exercitada com seed inexistente. URLs externas têm dependência de rede; playback determinístico usou bytes do MP4 real em rota isolada do browser. Compartilhamento nativo para apps externos/recebimento efetivo em WhatsApp e Instagram não foi exercitado; preserva baseline. QA de navegador realizado em Chromium; não constitui cobertura adicional Safari/Firefox.

## Zoom e regressões integradas

Zoom **nativo Chrome200%**, via `chrome.tabs.setZoom`, não CSS zoom nem emulação DPR: janela externa1442 permaneceu igual; viewport interno1440→720 e DPR1→2, CSS zoom1. Empty e populated sem overflow; painel/footer/cards e dialog inspecionados. Evidências `zoom-metrics.json`, `zoom-empty-metrics.json`, `zoom200-{hero,cards,dialog,dialog-bottom,empty-hero,empty-panel,empty-footer}.png`. Capturas zoom via CDP de viewport real para evitar artefatos de fullPage.

Home/Manifesto/Enviar/Ferramentas retornaram200, sem pageerrors/overflow em1440/900/390 (`regressions.json`, `regression-ROUTE-WIDTH.png`). Home conserva um card/uma chamada page0 sem paginação extra. Manifesto mantém sete parágrafos/nove pautas e foco `manifesto-completo`, consentimento desmarcado, cinco erros inline e foco no nome ao submit vazio. Enviar continua abrindo filechooser por clique real no centro do ícone, seleção/remoção de arquivo e três erros inline/foco título, sem POST.

Assinatura RHF em fixtures isoladas: erro conserva valores/consentimento e foca feedback; tentativa sem renovar token não envia; retry renovado tem proteção de duplo envio; sucesso reseta campos/aceite, mantém status e toast/foco. `form-metrics.json`, `form-{retry,success}-WIDTH.png`. Turnstile real local resolveu; SPA Manifesto→Enviar→Manifesto reutilizou um script, manteve um widget por montagem e marker de navegação, sem persistência (`turnstile-real-390.png`).

Último steering Home incluído: hero **Leia e assine o manifesto**→`/manifesto`, faixa coral **NOSSO HUB**, frase **A democracia também se constrói em rede.**, CTA **Conheça nosso hub**→`/ferramentas`. Hero CTA294.23×58 nos três widths, sem label cortada/arte sobreposta. Mouse/teclado e SPA para Manifesto/Ferramentas passaram preservando marker. Evidências `home-cta.json`, `home-{hero,coral}-WIDTH.png`, recapturadas após trocar eyebrow para NOSSO HUB.

## Findings resolvidos e checks finais

- Teste footer antigo ajustado para `/ferramentas`; footer Penpot parametrizado nas quatro rotas. Nenhuma UI extra inserida no frame.
- P2 foco perdido por desmontagem de load more/retry corrigido e retestado, incluindo feedback vazio e ausência de roubo de foco.
- P2 alturas/ações mixed desalinhadas corrigido por stretch por linha e excerpts locais; metadados integrais no dialog.
- Stroke bleed dos SVGs e quebra estática da introdução retestados contra export autoritativo.

Checks executados independentemente após último steering: **151/151 testes em21 arquivos, lint, tsc isolado e build exit0; diff --check exit0**. Logs `tests-final.log`, `lint-final.log`, `tsc-final.log`, `build-final.log`, `diff-final.log`. Build executado com escalada desde a primeira tentativa; sem falha/cache de sandbox neste worktree. `.env.local` ignored/mode600 confirmado, sem leitura/divulgação de valores. Metadata/API/backend/env sem mudanças de implementação no diff revisado.

**Parecer final: GO**, considerando adaptações documentadas e limites reais acima. Não equivale a reprodução 1:1 de Blog, integração de uploads inexistentes ou publicação. Sem commit/push/merge/reset.
