# Issue 71 — evidências locais

Branch `feat/manifesto-signatures`, worktree `.worktrees/feat-manifesto-signatures`, base `tech-contra-flavio-web/main` = `069a6bb7`. Sem commit/push/release remoto.

Referência MCP Penpot: arquivo **Vira Voto — Landing page neobrutalista (cópia)**, Page 1 `f5f30d69-ccc3-808f-8008-c2deec680988`; frame **VIRA VOTO — Manifesto** `f3274f73-645d-56b8-ac3b-7dda0a59fb9f`, 1440 × 2347. Não é um dos dois frames Home. Grid do hero medido via MCP: vertical 90px/1px, horizontal 74.333333px/0.532524px, branco a 15% de opacidade. Arte SVG nativa do grupo Circuito coletivo `e1d3130b-e38e-5a09-b2fa-c121c96251c5`, com fontes Barlow Condensed incorporadas a partir do asset Penpot existente.

Adaptações aprovadas, ausentes do frame Manifesto: CTA inicial de assinatura e seção final com formulário. Sua referência é Enviar `2fc2f195-1337-5226-a193-05a76c7bc2ff`: painel coral 640px, padding 40px, borda 3px, raio 8px, sombra 10px, gaps 28px, labels Inter 16/700, inputs 62px, borda 3px/raio 4px. A adição não é alegada como 1:1 do frame Manifesto. CTA inicial aumenta a altura do hero; conteúdo subsequente mantém identidade e composição do frame. Adaptações responsivas derivadas do desktop, pois não há Manifesto mobile no arquivo. Última orientação do usuário: o campo é **área de atuação na tecnologia**, com exemplos Front-end/Back-end/Dados/UX/UI.

## App e Supabase

App **bun dev local**, `http://localhost:3071/manifesto`. Docker somente para Supabase. Stack preservada: orquestrador `vira-voto-issue67-supabase-1`; API 54321, DB 54322, serviços `bigtlgeteefbeatjmbdn`. Mounts foram inspecionados; a stack aponta para `issue-67-exact-penpot-hero/supabase`. Somente as novas pastas de função/validação e configuração local foram adicionadas ao mount. `supabase functions serve` no orquestrador atualizou o runtime de funções, mantendo submit-tool/submit-content. Não houve reset de banco nem reinício do orquestrador que contém reset no entrypoint. Env local ignored, modo 600, sem credenciais impressas.

Migration `supabase/migrations/20261009010000_manifesto_signatures.sql` aplicada com psql `ON_ERROR_STOP` e transação no container DB local. Seed separado `supabase/seed-manifesto.local.sql` executado duas vezes: `INSERT 0 1`, depois `INSERT 0 0`. Nenhum seed entrou no fluxo de produção.

`python3 supabase/tests/manifesto-local.py` executado com êxito real:

- Insert pelo endpoint: HTTP 200, exatamente `{"ok":true}`.
- Replay de token: HTTP 400, sem assinatura adicional.
- Duplicata email normalizado: mesma resposta 200; hash da linha anterior e timestamp inalterados, uma linha apenas.
- Telefone normalizado E.164 +55 com DDD; versões de manifesto/aceite e timestamp armazenados.
- Nome/email/telefone/DDD/área/consentimento/limites/token ausente inválidos: HTTP 400; body excedente rejeitado, GET 405, OPTIONS 200.
- REST direto SELECT/INSERT/UPDATE/DELETE e RPC negados para anon e authenticated nas duas tabelas privadas; RLS ativo, zero políticas públicas.
- Todos os contatos são fictícios em domínio reservado `.invalid`. Nenhum dado de assinatura é devolvido ou registrado em logs/analytics.

O navegador local também enviou assinatura fictícia via widget real de teste Turnstile + endpoint real; registro confirmado por consulta booleana no DB. Confirmação genérica recebeu foco, campos limpos, consentimento voltou a false. Toast de sucesso/erro, expiração do desafio, conservação dos dados/retry e trava síncrona de duplo envio têm testes de componente. A trava cobre a corrida de dois submit simultâneos, mantendo botão disabled até a primeira requisição terminar.

**Turnstile local:** as chaves oficiais de teste aceitam tokens de teste; o widget usa um token dummy fixo. O replay persistente também rejeita esse dummy durante 10 minutos após um envio. Para testes automatizados com endpoint real, o script fornece tokens fictícios únicos verificados pela chave local de teste, e repete um deles para provar replay. Nenhum bypass de produção foi introduzido. Em revisão de múltiplos envios pelo widget local, considere essa limitação do token dummy.

## Verificação e capturas

131 testes passaram (21 arquivos); lint e TypeScript passaram; build passou, incluindo `/manifesto`; diff-check passou. Build final repetido e aprovado após o último ajuste. Não houve alteração SEO/domínio. Home preservada exceto texto solicitado do CTA; feeds/cards mantidos.

Capturas iniciais em `/private/tmp/issue71-qa/`, modo 600: `desktop-1440.png`, `tablet-900.png`, `mobile-390.png`. O portal pode arredondar dimensões em 1px: as capturas desktop/tablet desta implementação ficaram em 1441/901; mobile chegou a 390 exatos. QA independente deve verificar 1440/900 exatos. Foi identificado overflow de 5px no SVG e corrigido; revisão final deve obter 900 exatos e capturas novas nos três tamanhos, inclusive princípios/formulário, estados e Home.

O portal às vezes executou cliques/Enter sem ativar o elemento, especialmente fora da viewport durante scroll suave. A ação DOM `.click()` no link confirmou hash `#assinar-manifesto`, foco no título e offset acessível de 100px em mobile. `.requestSubmit()` do formulário disparou o fluxo real sem mock de rede; não confundir essa limitação de automação com comportamento do app. QA deve verificar teclado independentemente.

## Release

Workflow: preview/apply migrations → deploy submit-tool → deploy submit-manifesto → hook Vercel. Não executado. Service role somente na Edge Function; tabela de assinatura + hashes de desafio sem acesso público. Manifesto e consentimento versão `2026-10-09-v1`; texto exato de aceite no módulo `_shared/manifesto.ts`, finalidade exclusiva assinatura, sem marketing/lista pública. Hash de desafio expira em 10 minutos e é limpo em transações subsequentes; nenhum IP armazenado.

**GO explícito do QA independente via Maestri após retestes finais. Sem achados bloqueantes remanescentes.** O QA confirmou diretamente os frames Manifesto/Enviar no MCP e reexecutou o endpoint/RLS/revokes locais. Encontrou e foi corrigida a precedência da regra legada `section > p:not(:first-child)`: os parágrafos Circulação/Ação coletiva usam agora seletor `.manifesto-page .manifesto-statement > p` e `max-width: none`, preservando Home. Entrelinha dos links do header também ajustada de 24px para 19.2px (1.2) somente por `.manifesto-page .site-nav a:not(.site-nav-cta)`, conforme MCP. Reteste do QA computou 654px/22px/35.2px no desktop 1440 e 346px/18px/28.8px no mobile 390. O QA confirmou também entrelinha 19.2px do header em 1440/900/390, menu/hover/foco, ausência de pageerrors e overflow, e a mudança única do CTA Home com navegação correta.

Logs finais locais, diretório `/private/tmp/issue71-qa` modo 700 e arquivos modo 600: `lint.log`, `tests.log` (131/21), `types.log`, `build.log`, `diff-check.log`, `supabase-local.log`, `seed-local.log` (nova execução idempotente `INSERT 0 0`) e `schema-local.log` (RLS true, acesso direto/RPC anon/authenticated false, um seed). Build e lint repetidos após a correção CSS.


## Parecer independente final

QA revisou diff tracked e todos os arquivos novos, confirmou/exportou diretamente via MCP o frame Manifesto e conferiu Enviar para a adaptação. PASS visual completo: header; hero e arte Circuito coletivo; Circulação (inclusive borda verde autoritativa); Ação coletiva; princípios/CTA ferramentas; formulário adaptado; footer. Foram comparados textos/composição/hierarquia, cores/contraste, ícones/elementos, fontes/pesos/tamanhos/entrelinha/tracking, backgrounds/grid, bordas/raios/sombras, gaps/alinhamentos e estados. As seis fontes WOFF2 do SVG estão incorporadas, sem URLs remotas. Adições aprovadas aumentam hero em 86px e reposicionam footer; não há alegação de altura total 2347px idêntica ao frame.

Capturas independentes exatas 1440/900/390 preservadas em `/private/tmp/issue71-qa/`: `qa71-manifesto-WIDTH.png`, `qa71-form-WIDTH.png`, `qa71-errors-WIDTH.png`, `qa71-retry-WIDTH.png`, `qa71-success-WIDTH.png`, `qa71-home-cta-WIDTH.png`, `qa71-menu-900.png`, `qa71-menu-390.png`, além de `qa71-metrics.json` e `qa71-state-metrics.json`. WIDTH = 1440, 900 ou 390. ScrollWidth igual à viewport e overflow vazio nas três larguras. Estas substituem as capturas iniciais do portal com arredondamento em 1px.

QA teclado/estados PASS nos três tamanhos: Enter no CTA leva ao hash e foco em `assinar-manifesto` com offset 140px desktop/tablet e 100px mobile; cinco erros inline e foco no primeiro inválido; aria-invalid/describedby; aceite inicialmente false; erro genérico + toast conserva valores/aceite e foca feedback; retry com novo desafio mostra sucesso genérico + toast/foco e limpa campos/aceite. Duplo submit durante pending não duplica requests; disabled e aria-busy corretos. Hover/foco visíveis e menu mobile abre quatro links/fecha com Escape. Esses estados de browser usaram interceptação isolada, sem persistência; segurança/normalização/replay/idempotência foram verificados separadamente no endpoint real local. Nenhum pageerror.

QA reexecutou independentemente 131 testes/21 arquivos, lint, tsc, diff-check e integração Supabase real; examinou build final após último CSS, seed e schema logs: todos PASS. Service role somente backend, nenhum console/analytics/resposta com dados de assinatura, versões servidor, RPC transacional e duplicata sem sobrescrita. Nenhum reset/release/commit/push executado pelo QA. GO restrito ao escopo local revisado; publicação permanece sob controle do usuário.
