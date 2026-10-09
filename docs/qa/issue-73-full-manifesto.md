# Issue 73 — manifesto integral

Base fresh fetch `tech-contra-flavio-web/main` = `61a027b7`; branch `feat/issue-73-full-manifesto`; worktree `/private/tmp/vira-voto-issue-73`. Sem commit/push/PR/merge por este implementer; fluxo final pelo Tech lead.

## Fonte e implementação

Texto extraído integralmente de [issue 73](https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/73), bloco “Texto integral fornecido pelo solicitante”. A fixture bruta `app/manifesto/__fixtures__/issue-73.txt` é independente dos literais de produção. Teste compara todos os blocos e texto integral normalizando somente espaços HTML; título h2, sete parágrafos, nove pautas h3/p, pontuação e ordem. Redação oficial preservada sem edição ou argumentos adicionais. QA deve consultar GitHub independentemente para detectar erro de captura, além de comparar fixture.

Componente server `ManifestoFullText`, HTML selecionável, primeira seção após hero. CTA principal “Leia o manifesto completo” amarelo, `#manifesto-completo`, transfere foco ao h2 sem impedir scroll nativo. Assinatura inicial preservada como ação secundária branca; formulário final/backend71/Turnstile/RHF/SEO/Env preservados. Links têm margem de scroll 140px desktop/tablet e 100px mobile. Home “Leia e assine o manifesto” preservada.

## Adaptação visual

MCP Penpot Page 1 `f5f30d69-ccc3-808f-8008-c2deec680988`, frame Manifesto `f3274f73-645d-56b8-ac3b-7dda0a59fb9f`, 1440 × 2347. Consulta MCP confirma Barlow Condensed800 headings, Inter400 body, IBM Plex Mono500 eyebrows; azul #1900d0, amarelo #fcf050, branco e coral.

**Nova leitura integral não existe no mockup.** Adaptação: superfície branca/azul, headings Barlow800 e corpo Inter400, espaçamento do sistema existente. Novo CTA principal e assinatura branca secundária explicitamente adaptados. Texto oficial vem da issue, nunca do mockup. Formulário final é a adaptação já aprovada da #71. A inserção aumenta a altura total e desloca as seções seguintes: não há alegação de altura total 1:1. Arte, Circulação/borda verde autoritativa, Ação coletiva, princípios, CTA ferramentas, header e footer preservados.

A referência inicial 68ch produziu 858px e linhas cheias de 76–91 caracteres com Inter20px. Medição do primeiro parágrafo real usando Range no navegador motivou **56ch**, aproximadamente707px, com linhas cheias66–73 caracteres. Corpo desktop/tablet20px/35px; mobile18px/31,5px, coluna346px em390. h2 clamp40–56px/1.1; h3 clamp28–36px/1.2; gaps parágrafos28px, headings/p16px, pautas40px (32px mobile). Contraste azul/branco10,76:1. Sem alturas fixas nem manifesto em SVG.

## Ambiente e checks

App `bun dev --port 3073`, hotreload local `http://localhost:3073/manifesto`. Env copiado do ambiente local existente, ignored, modo600, URL verificada localhost54321, sem credenciais impressas. Supabase local Docker seeded preservado; nenhum reset/release remoto/app Docker.

Red-green: dois testes novos falharam por seção ausente/CTA ausente antes da implementação; três testes da página passam depois. Suite inteira139 testes/21arquivos PASS; lint, tsc e build PASS. Lint/build repetidos após último ajuste56ch. Logs do implementer em `/private/tmp/issue73-implementation/`. `git diff --check` é parte da revisão final.

## Revisão independente

QA solicitado via CLI Maestri com texto fonte direto GitHub, consulta/exportação MCP e comparação completa de todas as seções/estados, capturas1440/900/390 e zoom real200%, sem clipping/horizscroll, âncoras mouse/teclado e regressões Home/Ferramentas/Conteúdos/Enviar/assinatura. Evidências finais em `/private/tmp/issue73-qa/`; parecer final GO registrado abaixo e em `/private/tmp/issue73-qa/review.md`. Medições iniciais do portal do implementer podem arredondar900 para899: não substituem capturas exatas do QA.

## Diagnóstico do build durante QA

As tentativas do QA em sandbox falharam no PostCSS/Turbopack ao fazer binding TCP local (`Operation not permitted`). A falha persistiu no cache de build, inclusive em um retry com permissão ampliada. Um teste mínimo de socket com permissão ampliada passou. Conforme guia local Next16.3.7 `turbopackFileSystemCache`, somente `.next/cache/turbopack` foi movido para `/private/tmp/issue73-failed-turbopack-cache` (preservado para diagnóstico); `.next/dev/cache/turbopack` e app3073 permaneceram ativos. Sem mudança em código/config/env, o mesmo `bun run build` com permissão ampliada passou: exit0, compilação1806ms, TypeScript e19/19 páginas. Evidência final `/private/tmp/issue73-implementation/build-clean-cache.log`. Build independente do QA também passou após a recuperação do cache: `/private/tmp/issue73-qa/build.log`, exit0 em `checks.json`. As tentativas anteriores FAIL não são evidência do resultado final.


---

# Issue 73 — QA independente: GO

Preview real: http://localhost:3073/manifesto. Worktree /private/tmp/vira-voto-issue-73, branch feat/issue-73-full-manifesto, base informada 61a027b7. Nenhuma alteração da implementação, commit, push, merge, reset ou persistência de assinatura pelo QA.

## Conteúdo e semântica

Fonte consultada diretamente com `env -u GITHUB_TOKEN -u GH_TOKEN gh issue view 73 --repo tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web --json body`, salva em github-issue73.json. Comparação independente do bloco oficial com o DOM, normalizando somente whitespace HTML: título h2, sete parágrafos introdutórios e nove pares h3/p passaram integralmente, inclusive redação, pontuação e ordem, nas três larguras. Fixture da implementação não foi usada como fonte do QA. Texto selecionado também corresponde à fonte; conteúdo completo existe no HTML mesmo com JavaScript desabilitado. Primeira seção após hero confirmada.

## Comparação visual completa

Penpot MCP Page1, frame autoritativo f3274f73-645d-56b8-ac3b-7dda0a59fb9f, VIRA VOTO — Manifesto, 1440×2347. Exportação direta e propriedades salvas em penpot-manifesto.png e penpot-measurements.json.

| Região | Resultado |
| --- | --- |
| Header e footer | Marca/pixel, textos e destinos, fontes/pesos/entrelinhas/tracking, cores, alinhamentos, bordas e espaçamento preservados; menu nas larguras menores. |
| Hero e arte | Título, dois textos originais, grid azul, hierarquia, composição da arte, palavras/cores/elementos, fontes e espaçamentos preservados. CTA de leitura amarelo e assinatura branca são adaptações explícitas. |
| Leitura integral | Nova seção fora do mockup: branco/azul, Barlow Condensed800 para headings, Inter400 para corpo, hierarquia h2/h3/p e espaçamento legível. Títulos longos quebram sem cortes. |
| Circulação | Texto original, 72px/1 no heading desktop, corpo22px/35,2px, amarelo/azul e borda verde autoritativa preservados. |
| Ação coletiva | Texto original, tipografia/hierarquia, coral/preto, borda e alinhamentos preservados. |
| Princípios e próximo passo | Três cards, pixels16px, textos, ordem amarelo/coral/branco, headings52px800, corpo18px/28,8px, bordas3px/raios8px/sombras7px, gaps e CTA ferramentas preservados. |
| Assinatura final | Adaptação anterior #71 preservada: título/privacidade, área de atuação na tecnologia, campos, aceite desmarcado, Turnstile e CTA. Estados inline, foco e feedback conferidos. |

Foram conferidos composição/hierarquia, cores, elementos/ícones, textos estáticos, fontes/pesos/tamanho/entrelinha/tracking, backgrounds/grid, bordas/raios/sombras, gaps/alinhamentos, arte e estados hover/foco. Sem achado remanescente. A nova leitura, os CTAs e o formulário anterior não existem no frame original; a altura total não é comparada 1:1. Não há frame mobile: 900/390 preservam hierarquia e leitura adaptada.

## Medidas, âncoras e zoom

Capturas com viewport exato 1440, 900 e 390, sem arredondamento. ScrollWidth igual ao viewport, nenhum elemento da página fora da largura e nenhum erro de página observado. Coluna final 56ch mede706,56px em1440/900; corpo20px/35px. Linhas completas dos sete parágrafos ficaram entre60 e76 caracteres, excluídas as últimas linhas curtas. A faixa60–75 é referência aproximada de leitura. Em390: coluna346px, corpo18px/31,5px. Gaps28px entre parágrafos,16px título/pauta-texto e40px entre pautas (32px mobile).

Leitura e assinatura recebem foco com mouse/teclado. Leitura: y140/140,86/100,70px; assinatura após scroll estabilizado: y140,41/140,30/100,20px, em1440/900/390. Títulos ficam abaixo do header. Href nativo preservado, leitura principal precede assinatura secundária.

Zoom REAL do navegador confirmado por chrome.tabs.setZoom/getZoom=2, conforme API oficial Chrome: https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom. Janela externa1442px permanece igual; innerWidth1440→720 e DPR1→2; visualViewport.scale=1 e CSS zoom=1. Layout completo em720px sem overflow; título focado emy140,11px e pautas longas legíveis. Capturas nativas feitas sem o redimensionamento de viewport da captura full-page. Não se usou CSS zoom ou apenas deviceScaleFactor para simular200%.

## Funcional e regressões

Em1440/900/390: RHF/noValidate, cinco erros inline e foco no Nome ao enviar vazio; aceite começa desmarcado. Estados isolados do browser: erro conserva valores/aceite e foca feedback; token é consumido e retry exige token novo; pending bloqueia envios duplicados; sucesso limpa campos/aceite, persiste após novo callback, foca feedback e mostra toast de sucesso real da UI. Dois requests interceptados por cenário (falha + sucesso), sem gravação no backend.

Turnstile oficial dummy montou e resolveu no browser real. SPA Manifesto→Enviar→Manifesto mantém documento, um script e uma shell/widget por página; remontagens de desenvolvimento ocorreram com limpeza correta. Não houve envio persistido de assinatura.

Home, Ferramentas, Conteúdos e Enviar: rotas200, sem erros de página/overflow em1440/900/390; capturas com dados reais locais seeded. Home CTA “Leia e assine o manifesto” continua /manifesto e navega para a página completa. Diff de Home/layout/SEO/backend vazio; formulário final e arte não foram alterados pela issue. Env ignored/mode600 confirmado sem imprimir valores.

## Checks

Execução independente:139/139 testes em21 arquivos, lint, tsc --noEmit --incremental false, build e git diff --check PASS. Logs em tests.log, lint.log, tsc.log, build.log; exits em checks.json. Build final compilou e gerou19/19 páginas, incluindo /manifesto.

Falhas anteriores do build ocorreram por binding de porta PostCSS em sandbox e foram reutilizadas pelo cache Turbopack. Implementer preservou/moveu SOMENTE cache de produção com erro, mantendo dev e código/config/env; build independente escalado passou depois. Não confundir logs de tentativas anteriores FAIL com o resultado final PASS.

## Evidências e limites

- manifesto-{1440,900,390}.png: página completa final após56ch.
- {hero,full,circulation,collective,principles,signature}-WIDTH.png: inspeção por seção.
- read-anchor-WIDTH.png e signature-errors-WIDTH.png: foco e validação.
- zoom200-{hero,reading,demands}.png e zoom-metrics.json: zoom nativo200%, janela desktop1440.
- form-{retry,success}-WIDTH.png, form-metrics.json e turnstile-real-390.png: estados isolados e widget real.
- regression-{home,ferramentas,conteudos,enviar}-WIDTH.png e regression-metrics.json.
- metrics.json, static-states.json, line-lengths.json, github-issue73.json, canonical-source.txt, penpot-measurements.json e penpot-manifesto.png.

Limites: Chromium local, sem certificação cross-browser; zoom nativo200% testado na janela desktop1440 (layout efetivo720). Turnstile dummy não certifica anti-abuso de produção. A revisão automática rejeitou o teste que criaria uma assinatura fictícia persistida por ausência de autorização explícita para esse registro; QA concluiu os estados por interceptações isoladas e o widget/SPA reais, sem nova gravação. Não foi revalidado insert real da assinatura nesta issue; backend/FormRHF permanecem inalterados. Capturas por seção/full-page podem mostrar header sticky no ponto de scroll e omitir pintura de iframe offscreen; capturas de viewport complementam esses detalhes.
