# Issue 51 — Conteúdos Penpot

Base fresh fetch `tech-contra-flavio-web/main` = `0b268465` (PR75), branch `feat/issue-51-content-list-penpot`, worktree `/private/tmp/vira-voto-issue-51`. App local Bun hotreload3051; Supabase Docker existente `vira-voto-issue67`, API54321/DB54322. Env ignored/mode600/local verificado, sem reset, app Docker ou writes de produção.

## Fontes confirmadas pelo MCP e escopo

Arquivo Penpot `17193a1f-939a-80b5-8008-c2e37c935208`, Page1 `f5f30d69-ccc3-808f-8008-c2deec680988`.

- **Conteúdos vazio/página:** `969f1963-482a-5c8a-ad4a-25f282a4cc9e`,1440×1577, único frame Conteúdos confirmado. Header112, hero419, seção de acervo908, footer138.
- **Referência populated AUTORIZADA posteriormente pelo usuário:** Blog listagem desktop `1dbf6d5c-73c9-59ea-8c50-f848bb97649c`,1440×1760, e mobile `ba0ec9ec-3874-5730-b07c-e1169e45093d`,390×1020. São Blog, não foram identificados como Conteúdos. Reaproveita composição/grid/cards/ritmo; nenhuma rota Blog, filtro, categoria, duração de leitura, texto de artigo ou destino inventado.
- Inventário Page1: Home duplicada `33682299-25d8-514c-85d4-13f25668848a` e `8b03347b-c666-5843-a8b5-b497dee7ba50`; Enviar/Ferramentas/Manifesto; Blog listagem/detalhe desktop e mobile; Comunidade desktop/mobile. **Não existe frame Conteúdos mobile ou populated confirmado.**

## Implementação e adaptações declaradas

Hero mantém “ACERVO COLETIVO”, “FEITO PARA CIRCULAR.” e introdução exata. Background amarelo#fcf050, azul#1900d0, grid90×83,8, padding88/80/64, heading Barlow Condensed800132/.94, corpo Inter40022/35,2 e largura820. Quebra desktop da introdução segue a captura autoritativa; mobile flui naturalmente. Header/footer reutilizam componentes existentes com pixel/links/CTA e página ativa.

**Preparação apenas após resposta vazia bem-sucedida.** Painel inset3px/preto, raio8, sombra10, padding38/64/80, gap56; estado mono12/15, sinal3pixels, símbolo nominal72, heading72/1, placeholders210×3gap28/opacity.17, separador64×3, CTA258×58. SVGs dos símbolos imagem/vídeo/referência/arquivo são exportações originais MCP; paths preservados. Viewports arquivo/imagem/referência expandem respectivamente1,25/1px para conservar stroke externo, com CSS compensando a geometria nominal. Borda dashed é extraída da exportação original do placeholder, sem ícone duplicado.

**Populated derivado Blog:** grid3×400 em1440/gap40; tablet2col/gap28, mobile1col/gap20. Cards com borda2, faixa12 (8mobile), sombra7 e superfícies branca/coral. Referência Blog utiliza ArialBlack22/Arial13; harmonização deliberada com identidade atual: headings Barlow70036desktop/32mobile, corpo Inter40016/25,6 e créditos IBM Plex Mono60011/14. Não troca fontes globais. Populated **não é1:1** com Blog: faixa superior azul#1900d0 da identidade Conteúdos em vez amarelo#ffef35 do Blog desktop; coral sistema#ff8575 em vez#ff8077 da fonte Blog. Mobile mantém faixa superior8px (desktop12px), em vez borda lateral9px/cards compactos64px do Blog mobile. Estas são adaptações deliberadas de identidade e hierarquia para acomodar mídia real, crédito e ações existentes; não são diferenças causadas pelo dataset. Mantém estrutura visual de grid, borda2/sombra7, alternância branca/coral e responsividade derivadas da referência autorizada, sem importar taxonomias/textos/destinos. Altura é compartilhada por linha via grid stretch desktop/tablet, com mínimos348 na área de informação; ações ficam alinhadas no fundo sem inserir slot de mídia fictício. Mobile flui com altura natural. Heading/descrição são excerpts de até3linhas no listing para dados extensos; modal existente preserva texto integral, crédito e mídia.

Uploads/URLs diretasmp4/webm/mov exibem mídia real com preview210/object-fitcontain, sem cortar retrato/paisagem. Vídeo usa controles nativos/preloadmetadata. Referência externa sem arquivo não cria thumbnail/blankslot: ícone original24 junto da hierarquia textual, crédito e destino reais. `video_url` é o campo existente para URL, chamado “link de vídeo” pelo formulário; UI exigehttp(s), backend aceitaURL válida, upload permiteJPG/PNG/WebP/GIF/MP4 até25MB. Não há novo tipo de conteúdo/campo, scraper, metadados remotos ou backend alterado; extensão reconhecida é apresentação, não ampliação do contrato de upload.

**Compartilhar reutiliza ShareButton/Dialog existentes.** Variante listing muda apresentação do trigger e habilita metadados completos/preview como Home. Imagem/video íntegros no modal, crédito/descrição reais, destinos reais e associatedVideoUrl quando existente. Clipboard imagem/link, WhatsApp/Instagram, feedback/toasts e Escape/foco são os fluxos existentes. Baseline não tinha download; nenhuma ação download foi adicionada.

Loading/error são adaptações do painel, sem declarar preparação durante falha/carregamento. Error inicial tem alert/retry; erro incremental preserva cards e retry da mesma página. Feed mantém página10/infinite+botão, dedup porid, lock requests concorrentes e ignora resposta obsoleta após unmount. Em erro não há loop de retry automático. Home continua usando HomeContentCard sem diff; limite Home impede paginação adicional. API, filtroapproved e bucketStorage privado/URLs assinadas15min preservados. API existente usa offsetpage, não cursor.

## Ajuste Home solicitado junto ao listing

Por adição explícita do usuário, hero Home troca “Conhecer o hub” por “Leia e assine o manifesto” para `/manifesto` (página inteira, sem hash de formulário). Steering final altera eyebrow da faixa coral para NOSSO HUB e mantém frase “A democracia também se constrói em rede.”, arte e composição; CTA passa a “Conheça nosso hub” para `/ferramentas`. Somente largura/altura automática e limite100% do CTA hero acomodam o texto maior, sem mudar tipografia ou metadata/SEO. Teste cobre labels/destinos e localização nas seções; QA revalida os doisCTAs1440/900/390.

Foco paginação: controles mais/retry permanecem montados durante pending, aria-disabled/busy com lock para não duplicar fetch. Ao finalizar, foco permanece no controle se há mais páginas, ou vai ao primeiro conteúdo novo/feedback quando esgota, apenas se usuário ainda mantém foco no controle. Retry mantém erro visível durante tentativa e preserva página/itens. Testes regressivos retêm request e verificam foco/lock e destino final.

## Verificação do implementer

Evidências `/private/tmp/issue51-implementation/`: red.log (4 novos testes falharam antes de implementação), green.log; tests-final.log (151/151 em21arquivos), lint-final.log/tsc-final.log/build-final.log (exit0); git diff --check exit0; visual-metrics.json; empty/real-{1440,900,390}.png; integration.json. Primeira suite detectou testefooter antigo: atualizado para /ferramentas com retorno-topo, footerPenpot parametrizado para /,/manifesto,/enviar,/conteudos. Sem adicionar UI extra ao frame.

Capturas próprias1440/900/390 conferidas visualmente: empty desktop altura1577 como frame, hero/painel/CTA/footer alinhados; scrollWidth igual viewport e0pageerrors nas seis capturas empty/real. Isso é evidência auxiliar, **não substitui comparação visual completa e parecer independente QA**.

Integração read-only API local retorna10+1 itens em2páginas,11IDs únicos/0duplicatas; seed contém `video_url`MP4 externos e0uploadsStorage. Não é evidência de upload/imagem/Storage playback; matriz mista deve usar mídia real em fixtures isoladas do browser, sem substituir dados do app. URLs externas do seed podem falhar por disponibilidade/rede. Nenhum dado fixo inserido no app para preencher mockup.

Capturas Home CTAs e `home-cta-metrics.json`: hero294,23×58 e coral256,77×58 em1440/900/390, scrollWidth=viewport, sem corte de label. Reteste independente mixed registra desktop1440 todoscards574 e offsetsação506; tablet900 mesmaaltura574/offset506 nospares com mídia, últimoexcerpt511,17/443,17 em linha própria; mobile alturas naturais. Captura completa mixed1440 conferida pelo implementer após correção, ritmo e botões alinhados semthumbnail fictício.

## Revisão independente

QA solicitado via CLI Maestri com exportação MCP das duas referências e comparação de **todas as seções**: composição/hierarquia, textos estáticos, elementos/ícones, fonts/pesos/tamanhos/entrelinhas/tracking, backgrounds/cores, bordas/raios/sombras, paddings/gaps/alinhamentos, mídia e estados. Matriz1440/900/390+zoomREAL200; mixedportrait/landscape/video/linksemthumbnail; empty/loading/error/retry/incremental/more/dedup/concurrency; teclado/foco/Escape/menu/modal/clipboard/destinos/toasts; Home/Manifesto(fulltext/assinaturas)/Enviar. QA registra capturas/métricas/checks/limites em `/private/tmp/issue51-qa/`.

**Status final: GO integrado independente, sem findings abertos.** QA confirmou comparação integral empty vs frame969f; populated vs Blog desktop/mobile com adaptações explícitas,1440/900/390, zoom nativo200%, mixedmídia, estados, concorrência/dedup, foco/Escape/menu/clipboard/toasts, SPA e regressões. Home final NOSSO HUB + CTAs/destinos corretos incluída. Checks independentes151/151 em21arquivos e lint/tsc/build/diff-check exit0 após último steering.

Parecer completo preservado em [issue-51-independent-review.md](issue-51-independent-review.md), fonte `/private/tmp/issue51-qa/review.md`. Capturas finais `/private/tmp/issue51-qa/empty-WIDTH.png`, `real-WIDTH.png`, `mixed-WIDTH.png`, `mixed-dialog-TYPE-WIDTH.png`, `home-hero-WIDTH.png`, `home-coral-WIDTH.png`, `zoom200-*.png`. Métricas `visual-metrics.json`, `matrix.json`, `focus-cases.json`, `media-interactions.json`, `home-cta.json`, `form-metrics.json`, `regressions.json` no mesmo diretório.

Limites: integração read-only seed11MP4externos/0uploadsStorage; fixtures browser isoladas validam portrait/landscape/vídeo/estados sem persistir dados. Não se afirma integração Storage/expiração signedURLs nem entrega em apps sociais. QA browser Chromium, sem cobertura adicional Safari/Firefox. Sem commit/push/merge/reset; branch permanece para revisão/integração do Tech lead.
