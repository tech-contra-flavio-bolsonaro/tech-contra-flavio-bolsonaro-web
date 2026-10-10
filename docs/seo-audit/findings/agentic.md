# Preparo para agentes de IA: techcontraflaviobolsonaro.dev

Verificado em 10/10/2026.

## Lighthouse Agentic Browsing
Indisponível, porque o PageSpeed Insights retornou HTTP 429 (limite diário) para mobile e desktop. Configurar uma chave de API do Google e rodar de novo.

## Heurística de experiência para agentes: 100/100
É separada do Lighthouse.
- A árvore de acessibilidade tem 312 nós, 25 links e 1 botão.
- Nenhum elemento interativo sem nome e nenhum campo sem rótulo. Há 19 landmarks e nenhum widget feito com div + onclick.
- O `alt=""` nas imagens da home está certo onde a imagem é decorativa. Veja em `images.md` a questão do link do logo.

## Achados
- **P0: nenhum.** São 202 palavras renderizadas no servidor sem JS, o robots.txt retorna 200 e URLs inexistentes na raiz retornam 404 de verdade.
- **P1: não há Content-Signal nem grupos específicos para IA no robots.txt.**
  - O robots.txt tem só `User-agent: *`, `Allow: /`, `Host` e `Sitemap`.
  - Para declarar uma política, acrescentar grupos nomeados e uma linha como `Content-Signal: search=yes, ai-input=yes, ai-train=no`.
  - Isso é uma preferência, não um bloqueio, e o Google não age com base nela.
- **P1: não há llms.txt.** `/llms.txt` e `/llms-full.txt` retornam 404. A Busca do Google ignora esse arquivo.
- **P2: WebMCP e o formulário `/enviar` (oportunidade).**
  - Não há `registerTool` nem `navigator.modelContext`.
  - `/enviar` tem `<form aria-label="Formulário de envio de conteúdo">` com Turnstile (`render=explicit`), que vai bloquear agentes autônomos. Provavelmente é intencional.
  - O formulário não foi enviado durante os testes.
- **P3: entrega em Markdown.** O servidor envia `Vary: Accept`, mas `Accept: text/markdown` retorna HTML e `/index.md` retorna 404.
- **P3: arquivos de descoberta.** ai-catalog.json, api-catalog, agent-card.json e os well-knowns de OAuth retornam 404. Só vale criar se houver um serviço correspondente.

## Tratamento do tráfego de agentes pelo WAF
`/`, `/enviar` e `/ferramentas` retornaram 200 para os user agents Mozilla, ClaudeBot, GPTBot, Claude-User e python-requests. O comportamento de Bot Fight Mode e de desafios além do código de status não foi testado.

## Política de acesso
- Rastreadores de treinamento: liberados (caem no `*`).
- Rastreadores de busca: liberados.
- Agentes acionados pelo usuário: liberados.

## Situação dos padrões (em 23/09/2026)
- WebMCP: rascunho de Community Group do W3C.
- Content-Signal: política da Cloudflare e rascunho do IETF.
- ai-catalog.json e Web Bot Auth: rascunhos ou propostas.
