# Tarefas de SEO / AEO / GEO — triagem da auditoria de 10/10/2026

Lista de tarefas criada a partir de `FULL-AUDIT-REPORT.md`, `ACTION-PLAN.md` e `findings/`, depois de conferir cada achado no código e no site no ar.

- **Código conferido:** `origin/main` em `d6958db` (merge do PR #94, `fix/seo-indexacao`). A branch local `feat/seo-changes` está **um merge atrás** de `main`. Antes de começar qualquer tarefa, atualizar a branch a partir de `main`.
- **Site conferido:** `https://techcontraflaviobolsonaro.dev` em 10/10/2026, com `curl`.
- **Prazo:** o segundo turno é em **25/10/2026**. Uma mudança publicada depois de ~18/10 dificilmente será rastreada e ranqueada antes da votação. Por isso a ordem abaixo põe primeiro o que destrava o rastreamento e o que é barato.
- **Fluxo de entrega (AGENTS.md):** cada tarefa de código segue implementação → testes + lint + build + `git diff --check` → QA pelo Maestri → PR só depois do **GO** → merge em `main` só depois do GO.

## Como ler esta lista

| Campo | Valores |
|---|---|
| **Severidade** | Crítica · Alta · Média · Baixa, considerando o impacto na busca e o prazo da eleição |
| **Impacto** | **SEO** (Google/Bing clássicos) · **AEO** (respostas diretas: AI Overviews, trechos em destaque) · **GEO** (ser citado por ChatGPT, Perplexity, Copilot, Gemini) |
| **Esforço** | **P** = até 2 h · **M** = ½ a 1 dia · **G** = mais de 1 dia |
| **Ganho** | Alto · Médio · Baixo, ou seja, quanto a correção deve mover indexação, ranqueamento ou citação |
| **Tipo** | `código` (vira PR) · `conteúdo` (alguém do time precisa escrever) · `ops` (painel da Vercel/Cloudflare/GSC/Bing) · `jurídico` · `decisão` |

---

## Resumo da verificação

O que a auditoria acertou, o que exagerou e o que errou.

| Achado da auditoria | Situação | O que o código mostra |
|---|---|---|
| Listas de ferramentas e conteúdos só aparecem no navegador | ✅ Confirmado | `ToolFeed` e `ContentFeed` são `"use client"` e buscam em `/api/ferramentas` e `/api/conteudos`. O HTML da home tem 0 links `/ferramentas/…`, e `/ferramentas` tem 1. |
| Lista do blog só aparece no navegador | ⚠️ Parcial | `/blog` é Server Component. O conteúdo **está** no HTML, mas chega por streaming depois do `loading.tsx`, que tem um `<h1>Carregando artigos…</h1>`. O problema real é o H1 duplicado, não a renderização. |
| Soft 404 em `/ferramentas/xyz` | ✅ Confirmado (causa diferente) | A página **já chama** `notFound()`. A causa é o `app/ferramentas/[slug]/loading.tsx`: o streaming começa com status 200 antes do `notFound()`, e o Next só consegue injetar `noindex`. A correção sugerida pela auditoria ("chamar `notFound()`") não resolve. |
| Meta robots duplicada nas páginas de erro | ✅ Confirmado | `app/layout.tsx` define `robots: { index: true, follow: true }` para o site todo. Nas páginas de erro, isso soma com o `noindex` do Next. |
| Não há quem somos, contato, privacidade nem termos | ✅ Confirmado | Todas retornam 404. O formulário do manifesto coleta nome, e-mail, telefone e área de atuação, e tem só o texto de consentimento. |
| Ferramentas sem autoria | ✅ Confirmado | No catálogo inicial, 15 ferramentas têm o crédito "Iniciativa independente/voluntária". |
| Páginas de ferramenta rasas | ✅ Confirmado | A tabela `tool_submissions` só tem `title`, `description`, `category`, `credit`, `url` e `embed_url`. **Não há campo para conteúdo longo**, então ampliar as páginas exige migração. |
| Imagem de `/conteudos` expira | ✅ Confirmado | O bucket `community-submissions` é privado. O arquivo continua em `pending/…` depois de aprovado, e a URL é assinada por 15 min (`createSignedUrl(…, 60 * 15)`) em cada requisição. |
| Nenhum dado estruturado | ✅ Confirmado | Nenhum `application/ld+json` no código nem no site. |
| Hero com `loading="lazy"` e 6 fontes pré-carregadas | ✅ Confirmado | `next/image` sem `priority`/`preload`. São 3 famílias do `next/font`, com 6 arquivos pré-carregados. O SVG do hero tem **280 KB** no repositório. |
| Link do logo sem nome acessível | ❌ Falso | O link contém o texto "VIRA VOTO" ao lado da imagem com `alt=""`. O nome acessível existe. Não há tarefa para isso. |
| Ferramentas sem `og:image` | ✅ Confirmado e **maior** do que o relatado | Também faltam em `/ferramentas`, `/conteudos`, `/blog` e `/conteudos/[id]`. O helper `pageMetadata` sobrescreve `openGraph` sem `images`, e a imagem do `app/opengraph-image.png` se perde. Só a home, `/manifesto` e `/enviar` têm imagem. |
| `/enviar` e `/ferramentas/enviar` com metadados genéricos | ✅ Confirmado | Nenhuma das duas exporta `metadata`. |
| Sitemap sem `lastmod`, com `changefreq`/`priority`, e `Host:` no robots | ✅ Confirmado | `app/sitemap.ts` e `app/robots.ts`. |
| `www` redireciona com 307 | ✅ Confirmado | Configuração de domínio, não está no código. |
| CSP com `unsafe-inline`/`unsafe-eval` | ✅ Confirmado | `next.config.ts`. É uma questão de **segurança**, não de SEO. |
| `access-control-allow-origin: *` no HTML | ❓ Não está no código | Vem da Vercel ou da Cloudflare. Investigar no painel. |
| Descrições com mais de 160 caracteres | ✅ Confirmado | prensa (203) e o-que-esta-em-jogo-na-sua-cidade (190). Os dados estão no banco. |
| Canônica da home sem barra final | ℹ️ Sem ação | `https://…dev` e `https://…dev/` são equivalentes para o Google. |
| Texto em CAIXA ALTA no HTML | ℹ️ Sem ação | É escolha de design. O impacto em busca é desprezível. |

---

## Relação com issues e PRs abertos (conferido em 10/10/2026)

Issues abertas: #14, #16, #19, #21, #28, #55, #77, #78. PR aberto: #96. Também foram consultadas as issues fechadas #22/#23 e a spec aprovada `docs/superpowers/specs/2026-10-09-blog-devto-design.md`.

| Issue/PR | Relação | Tarefas afetadas | O que fazer |
|---|---|---|---|
| **#19** Definir política de assinatura do Manifesto | **Sobreposição.** #19 já pede a decisão sobre dados mínimos, consentimento, visibilidade pública, retenção e responsável pelo tratamento, que é o miolo da página `/privacidade`. | SEO-07, SEO-17 | A parte de privacidade de SEO-07 depende de #19, e não deve virar uma issue paralela. O contador e a lista de signatários de SEO-17 dependem da decisão de "visibilidade pública" de #19. |
| **#22/#23 (fechadas) + spec do blog** | **Contradição.** A spec aprovada diz "No tag parameter or category filter… ALL organization posts are required", e reafirma a canônica no DEV.to. | SEO-16, D3 | O filtro por tag de SEO-16 contraria uma decisão aprovada. O caminho compatível é a governança da organização no DEV.to (#21). A D3 já está decidida: canônica no DEV.to. |
| **#21** Governança da comunidade dev.to | **Sobreposição.** Pede convenção de tags e critérios de publicação, e é por aí que se evita post fora do tema. | SEO-16 | SEO-16 vira um critério a acrescentar em #21, mais (no máximo) esconder a prévia da home até haver post no tema, o que também precisa de aval. |
| **#78** Atualizar logo (waiting design) | **Dependência.** Inclui favicon e imagens de compartilhamento quando houver variantes aprovadas, e exige "sem mudanças involuntárias em SEO". | SEO-08, SEO-15 | O `logo` do JSON-LD (SEO-08) deve ler o mesmo asset centralizado que #78 vai criar. O desenho da imagem OG por ferramenta (SEO-15) precisa de referência de design, ou vai ser refeito depois de #78. #78 deixa o rebranding fora do escopo, então a D1 continua em aberto. |
| **#77** Seção Denúncias (waiting design) | **Risco de repetir o problema.** O escopo pede listagem paginada "seguindo o fluxo existente", com estados de loading, ou seja, a mesma listagem só no cliente de SEO-03. Também cria páginas com relatos não verificados num site sobre eleição (YMYL). | SEO-03, SEO-09, SEO-19 | Acrescentar a #77 antes de começar: listagem renderizada no servidor, metadados e canônica próprios, decisão explícita sobre indexação (`noindex` é o mais seguro para relatos não verificados), `rel="ugc nofollow"` nos links externos e entrada no sitemap só se for indexável. |
| **#55** Diretório da comunidade | **Risco de repetir o problema.** Tem busca e filtros por estado e tema. | SEO-03, SEO-18 | Acrescentar a #55: resultados renderizados no servidor e filtros em URLs rastreáveis (query string lida no servidor). |
| **#28** / **PR #96** Previews na Vercel | **Baixo risco.** Deploys de preview em `*.vercel.app` recebem `X-Robots-Tag: noindex` da Vercel. Já o domínio de testes que #28 pede (domínio próprio) não recebe. | — | Acrescentar a #28: o domínio de testes responde com `X-Robots-Tag: noindex` e usa `NEXT_PUBLIC_SITE_URL` próprio, para não gerar conteúdo duplicado nem sitemap apontando para produção. |
| **#14**, **#16** Handoff de design e ícones do Instagram | **Sem conflito direto.** Mas o projeto exige fidelidade ao Figma, com QA visual. | SEO-12, SEO-21 | Mudar o H1 da home (SEO-12) e o tamanho de links e chips (SEO-21) altera o design aprovado. As duas tarefas precisam de aval da design antes. |

Nenhuma issue aberta já cobre SEO técnico (renderização no servidor, 404, schema, sitemap, og:image, desempenho). As tarefas SEO-01 a SEO-06 e SEO-08 a SEO-11 não são redundantes.

---

## Decisões pendentes (bloqueiam algumas tarefas)

| # | Decisão | Quem decide | Tarefas bloqueadas |
|---|---|---|---|
| D1 | **Marca principal:** "Vira Voto" ou "Tech Contra Bolsonaro", e como explicar a relação entre os nomes (e o domínio e os perfis sociais). | Time | SEO-08, SEO-12, parte de SEO-07 |
| D2 | **Quem assina o site:** coletivo, pessoas, contato público, financiamento, eventual ligação com partido ou campanha. A parte de tratamento de dados já está em **#19**. | Time + jurídico | SEO-07 |
| D3 | ~~Estratégia do blog~~ **Já decidida** na spec do blog (#22/#23): canônica no DEV.to e todos os posts da organização. Só reabrir se o time quiser mudar a spec. | — | SEO-16 |
| D4 | **Quais ferramentas ganham página completa:** a sugestão é Do Seu Bolso, Voto Lá Fora e o calendário de protestos, e alguém precisa escrever o texto. | Time | SEO-14 |
| D5 | **`/enviar` e `/ferramentas/enviar`:** indexar ou aplicar `noindex`. A recomendação é `noindex, follow`. | Time (pode ficar com o padrão) | SEO-09 |

---

## Ordem sugerida

| Onda | Quando | Tarefas |
|---|---|---|
| **1. Destravar o rastreamento** | até ~13/10 | SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06 |
| **2. Confiança e entidade** | até ~18/10 | SEO-07, SEO-08, SEO-09, SEO-10, SEO-11, SEO-12, SEO-13 |
| **3. Conteúdo duradouro** | começa antes de 25/10 e continua depois | SEO-14, SEO-15, SEO-16, SEO-17, SEO-18, SEO-19 |
| **4. Backlog** | depois da eleição | SEO-20 a SEO-25 |

---

## Tarefas

### SEO-01 — Enviar o sitemap ao Google Search Console e ao Bing Webmaster Tools

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Crítica** | SEO, GEO | P (30 min) | Alto | `ops` |

**Por quê:** a busca `site:` no Bing não retornou nada. O ChatGPT Search e o Copilot dependem do índice do Bing, então hoje o site não pode ser citado por eles. É a ação mais barata da lista e a que mais depende de tempo: o prazo de rastreamento corre a partir dela.

**O que fazer**
- Verificar o domínio no Google Search Console (pelo DNS da Cloudflare) e enviar `https://techcontraflaviobolsonaro.dev/sitemap.xml`.
- Verificar no Bing Webmaster Tools (dá para importar do GSC) e enviar o mesmo sitemap.
- Ativar o IndexNow pelo Cloudflare (**Caching → Configuration → Crawler Hints**).
- Pedir indexação manual de `/`, `/ferramentas`, `/manifesto` e das 3 a 5 ferramentas principais.
- Em Cloudflare → Security → Bots / AI Crawl Control, confirmar que os rastreadores de busca de IA (OAI-SearchBot, PerplexityBot, Claude-SearchBot) não estão bloqueados.

**Critérios de aceitação**
- [ ] Sitemap enviado e com status "Sucesso" no GSC e no Bing WMT.
- [ ] Crawler Hints/IndexNow ativo no Cloudflare.
- [ ] Inspeção de URL no GSC para `/ferramentas` mostrando o HTML que o Google renderizou (serve de base para comparar com SEO-03).
- [ ] Configuração de bots de IA do Cloudflare anotada nesta issue.

**Bloqueado por:** nada.

---

### SEO-02 — Retornar 404 de verdade para ferramenta inexistente e tirar a meta robots duplicada

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Alta** | SEO | P (1–2 h) | Médio | `código` |

**Por quê:** `/ferramentas/qualquer-coisa` responde **200**, com título "Ferramenta não encontrada" e duas metas robots que se contradizem (`noindex` e `index, follow`). O Google trata isso como soft 404, desperdiça rastreamento e pode indexar páginas vazias. As páginas 404 do site todo também carregam o `index, follow` do layout raiz.

**Causa (conferida no código):** a página já chama `notFound()`. O problema é o `app/ferramentas/[slug]/loading.tsx`, que cria um limite de Suspense: o Next começa a enviar a resposta com status 200, e quando o `notFound()` roda, o cabeçalho já foi enviado. Além disso, o `generateMetadata` devolve metadados de "não encontrada" em vez de chamar `notFound()`.

**O que construir**
- Em `app/ferramentas/[slug]/page.tsx`, chamar `notFound()` dentro do `generateMetadata` quando a ferramenta não existir, como `app/blog/[id]/[slug]/page.tsx` já faz.
- Remover `app/ferramentas/[slug]/loading.tsx`, ou mover o estado de carregamento para dentro da página, abaixo da checagem de existência. A consulta é uma linha no Supabase e não precisa de streaming.
- Remover `robots: { index: true, follow: true }` de `app/layout.tsx`. Indexável já é o padrão, e assim as páginas de erro ficam só com o `noindex` do Next.
- Conferir `/conteudos/[id]` com um UUID inexistente e aplicar o mesmo padrão se precisar.
- Antes de escrever o código, ler o guia de `notFound`/streaming em `node_modules/next/dist/docs/`, porque o Next 16 mudou o comportamento de metadados com streaming.

**Critérios de aceitação**
- [ ] `curl -sI https://…/ferramentas/xyz` retorna **404**, com user agent comum e com `-A "Googlebot"`.
- [ ] `curl -s https://…/ferramentas/xyz | grep -c 'name="robots"'` retorna 1, com `noindex`.
- [ ] `curl -s https://…/nada-aqui | grep -c 'name="robots"'` retorna 1.
- [ ] Páginas de ferramenta válidas continuam 200, sem meta robots `noindex`.
- [ ] Testes cobrindo ferramenta inexistente → `notFound()` em `generateMetadata` e na página.

**Bloqueado por:** nada.

---

### SEO-03 — Renderizar no servidor a lista de ferramentas (home e `/ferramentas`)

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Crítica** | SEO, AEO, GEO | M (½–1 dia) | Alto | `código` |

**Por quê:** o HTML que os robôs recebem de `/` e `/ferramentas` diz "Carregando ferramentas…" e não tem links para as páginas de ferramenta. O Google só acha as ferramentas pelo sitemap e precisa executar JavaScript para ver a lista. Rastreadores de IA (GPTBot, PerplexityBot, ClaudeBot) não executam JS e nunca veem a lista. Sem links internos, as páginas de ferramenta não recebem autoridade da home.

**O que construir**
- Em `app/ferramentas/page.tsx` e `app/page.tsx`, buscar as ferramentas aprovadas e as categorias no servidor (`listTools`, `listToolCategories` de `app/lib/tools-server.ts`) e passar como dados iniciais ao `ToolFeed`.
- O `ToolFeed` continua cuidando do filtro e de "carregar mais" no cliente, mas a primeira renderização já sai com os cards (`<a href="/ferramentas/…">`) no HTML.
- Em `/ferramentas`, garantir que **todas** as ferramentas aprovadas estejam em links no HTML. Hoje são cerca de 29; há duas opções:
  - renderizar a lista completa no servidor, porque o volume é pequeno;
  - ou transformar "Carregar mais" em paginação com links rastreáveis (`?pagina=2`).
- Ler `?categoria=` em `searchParams` no servidor, para que a URL filtrada também venha renderizada.
- Se o banco falhar, a página deve renderizar o estado de erro, e não quebrar (seguir o padrão `safely` do `sitemap.ts`).

**Critérios de aceitação**
- [ ] `curl -s https://…/ferramentas | grep -o 'href="/ferramentas/[a-z0-9-]*"' | sort -u | wc -l` ≥ número de ferramentas aprovadas (descontando `/ferramentas/enviar`).
- [ ] `curl -s https://…/ | grep -c 'href="/ferramentas/'` ≥ 3.
- [ ] O HTML do servidor não contém "Carregando ferramentas…" quando há dados.
- [ ] Filtro por categoria e "carregar mais" continuam funcionando no navegador, sem CLS novo.
- [ ] Testes atualizados para o `ToolFeed` com dados iniciais.

**Bloqueado por:** nada. Destrava SEO-11 (ItemList) e SEO-18 (links internos).

---

### SEO-04 — Tirar o H1 "Carregando artigos…" do carregamento do blog

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | SEO, GEO | P (30 min) | Baixo | `código` |

**Por quê:** o artigo do blog **está** no HTML (renderização no servidor com streaming), mas o fallback de `app/blog/(listing)/loading.tsx` vem antes e tem um `<h1>`. Resultado: o primeiro H1 da página para robôs e leitores de IA é "Carregando artigos…", e a página fica com dois H1.

**O que construir**
- Trocar o `<h1>` do `loading.tsx` por um elemento que não seja título (por exemplo `<p role="status">`), ou remover o `loading.tsx` se a resposta do dev.to (com cache de 300 s) for rápida o bastante.

**Critérios de aceitação**
- [ ] `curl -s https://…/blog | grep -o '<h1' | wc -l` retorna 1.
- [ ] O estado de carregamento continua anunciado para leitores de tela.

**Bloqueado por:** nada.

---

### SEO-05 — Corrigir a imagem de compartilhamento que some em várias páginas

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Alta** | SEO (indireto), distribuição | P (1–2 h) | Alto | `código` |

**Por quê:** **achado novo, que a auditoria não pegou por inteiro.** O helper `pageMetadata` (`app/lib/page-metadata.ts`) define um `openGraph` sem `images`. Como o Next junta metadados de forma rasa, a imagem padrão (`app/opengraph-image.png`) se perde. Hoje `/ferramentas`, `/conteudos`, `/blog`, cada `/ferramentas/[slug]` e cada `/conteudos/[id]` são compartilhados **sem imagem** no WhatsApp, no X e no Telegram. O WhatsApp é o principal canal de divulgação do site.

**O que construir**
- Fazer `pageMetadata` e os `generateMetadata` das páginas de ferramenta e de conteúdo herdarem a imagem padrão. Por exemplo, exportar `siteOpenGraph.images` com a imagem 1200×630, ou criar um `opengraph-image` por segmento.
- Trocar `og:type` de `article` para `website` nas páginas de ferramenta.
- Esta tarefa usa só a imagem padrão. Imagem própria por ferramenta fica em SEO-15.

**Critérios de aceitação**
- [ ] `/`, `/ferramentas`, `/conteudos`, `/blog`, `/manifesto`, uma ferramenta e um conteúdo têm `og:image` e `twitter:image` absolutos.
- [ ] Teste em `page-metadata.test.ts` garantindo que `images` está presente.
- [ ] Prévia conferida em um depurador de compartilhamento (opengraph.xyz ou similar).

**Bloqueado por:** nada.

---

### SEO-06 — Prioridade do hero, fontes e CSS para o LCP no mobile

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | SEO | M (½ dia) | Médio | `código` |

**Por quê:** o LCP no mobile é de 4,4 s na home (ruim; o limite bom é 2,5 s) e de 3,8 a 3,9 s nas outras páginas. No desktop está tudo bem (99–100). As Core Web Vitals são um fator de ranqueamento de desempate, e a maior parte do público vem do celular.

**O que construir**
- **Hero da home:** tirar o `loading="lazy"` de `.home-hero-art` (`app/page.tsx`) com a prop de prioridade do `next/image`. No Next 16 o `priority` pode ter sido substituído por `preload`/`fetchPriority`; conferir em `node_modules/next/dist/docs/`.
- **SVG do hero:** otimizar `public/images/hero-ideas-network.svg` (280 KB) com o svgo. Fazer o mesmo com `manifesto-collective-circuit.svg` (160 KB).
- **Fontes:** `app/layout.tsx` pré-carrega 6 arquivos. Usar `preload: false` nas fontes que não aparecem no topo da página (provavelmente a IBM Plex Mono e o peso 800 da Barlow). Conferir quais são usadas acima da dobra.
- **CSS:** avaliar `experimental.inlineCss` (conferir se existe no Next 16) ou dividir o `globals.css` por rota.
- Rodar o Lighthouse mobile 3 vezes antes e depois e anotar a mediana.

**Critérios de aceitação**
- [ ] O HTML da home tem o hero sem `loading="lazy"` e com `fetchpriority="high"`.
- [ ] No máximo 2 `<link rel="preload" as="font">` por página.
- [ ] O SVG do hero tem menos de 120 KB, sem mudança visual (comparar capturas).
- [ ] Mediana do LCP mobile da home abaixo de 3,0 s no Lighthouse local (meta final: 2,5 s).

**Bloqueado por:** nada.

---

### SEO-07 — Páginas "Quem somos" e "Privacidade", e responsável no rodapé

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Crítica** | SEO, AEO, GEO, legal | P no código · M no conteúdo · jurídico à parte | Alto | `código` + `conteúdo` + `jurídico` + `decisão` |

**Por quê:** conteúdo eleitoral é tratado pelo Google como YMYL ("Your Money or Your Life"), com o padrão de confiança mais rígido (E-E-A-T). Hoje não há como saber quem mantém o site: `/quem-somos`, `/contato`, `/privacidade` e `/termos` retornam 404, e o rodapé só tem slogans. Mecanismos de IA também evitam citar fontes sem entidade identificável. Fora do SEO, o formulário do manifesto coleta **nome, e-mail, telefone e área de atuação** sem política de privacidade publicada, o que é uma questão de LGPD, e há regras do TSE sobre identificação em propaganda eleitoral na internet.

**O que construir**
- `/quem-somos`: quem organiza (coletivo e/ou pessoas), contato público (e-mail), financiamento, eventual ligação com partido ou campanha e a explicação dos nomes (Vira Voto, Tech Contra Bolsonaro, domínio e perfis).
- `/privacidade`: controlador, dados coletados (assinatura do manifesto, envio de conteúdo, envio de ferramenta), finalidade, base legal, prazo de guarda, como pedir exclusão e contato do encarregado.
- Link para `/privacidade` ao lado do consentimento em `manifesto-signature-form.tsx`, `submission-form.tsx` e `tool-submission-form.tsx`.
- No rodapé (`site-footer.tsx`): uma linha "Mantido por …", e links para Quem somos e Privacidade. Acrescentar as duas rotas a `VALID_PATHS`.
- Incluir as duas páginas no `sitemap.ts`, com `pageMetadata`.

**Critérios de aceitação**
- [ ] `/quem-somos` e `/privacidade` retornam 200, com conteúdo final (sem texto provisório), H1 único e canônica.
- [ ] Os três formulários linkam a política ao lado do consentimento.
- [ ] O rodapé mostra o responsável e os links nas páginas onde aparece.
- [ ] Texto revisado por quem responde juridicamente pelo site.

**Bloqueado por:** D1 (marca), D2 (quem assina), **#19** (política de assinatura: dados, retenção e responsável, que formam o conteúdo de `/privacidade`) e revisão jurídica. O código pode ser preparado antes, com o conteúdo entrando depois. Não abrir uma issue de privacidade paralela a #19; a issue de SEO-07 deve referenciá-la.

---

### SEO-08 — JSON-LD de Organization e WebSite

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Alta** | GEO, AEO, SEO | P (2 h) | Médio-Alto | `código` |

**Por quê:** não há nenhum dado estruturado no site. Com seis variações de nome entre site e perfis, os mecanismos de busca e de IA não conseguem ligar "Vira Voto", "Tech Contra Bolsonaro" e os perfis sociais à mesma entidade. Organization com `alternateName` e `sameAs` é o sinal mais direto para isso.

**O que construir**
- Um helper pequeno (por exemplo `app/lib/json-ld.tsx`) que renderiza `<script type="application/ld+json">` escapando `<` como `<`.
- No layout raiz ou na home: um `@graph` com `Organization` (`name`, `alternateName[]`, `url`, `logo` em PNG de pelo menos 112 px, como `app/apple-icon.png` ou `icon1.png`, e `sameAs` com os 4 perfis do rodapé) e `WebSite` (`name`, `inLanguage: pt-BR`, `publisher`). Ponto de partida em `findings/schema.md`.
- Ler os links sociais da mesma constante do rodapé (`SOCIAL_MEDIA_LINKS`), para não duplicar dados.
- **Não** usar `SearchAction` (o site não tem busca).

**Critérios de aceitação**
- [ ] O Teste de pesquisa aprimorada do Google e o validator.schema.org não mostram erros para a home.
- [ ] `name` e `alternateName` seguem a decisão D1.
- [ ] Teste unitário do helper de escape.

**Bloqueado por:** D1, só para os valores de `name`/`alternateName`. Dá para publicar com os nomes atuais e ajustar depois. O `logo` deve vir do mesmo asset centralizado que **#78** (nova logo) vai criar, para que a troca de logo atualize o schema sozinha.

---

### SEO-09 — Metadados de `/enviar` e `/ferramentas/enviar`

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | SEO | P (30 min) | Baixo | `código` |

**Por quê:** as duas páginas estão no menu e são indexáveis, mas herdam o título e a descrição da raiz ("Vira Voto — ideias em movimento"), não têm canônica e não estão no sitemap. São páginas de formulário, sem valor de busca.

**O que construir**
- Exportar `metadata` nas duas páginas com título e descrição próprios, canônica e `robots: { index: false, follow: true }` (recomendação da D5).

**Critérios de aceitação**
- [ ] As duas páginas têm título único, canônica e `noindex, follow` (ou ficam indexáveis e entram no sitemap, se a D5 decidir assim).

**Bloqueado por:** D5, que pode ficar com o padrão recomendado.

---

### SEO-10 — URL estável para as mídias de `/conteudos`

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | SEO (imagens), distribuição | M (3–4 h) | Médio | `código` |

**Por quê:** as imagens e vídeos aprovados ficam num bucket privado, em `pending/…`, e são servidos por URLs assinadas que expiram em 15 minutos e mudam a cada requisição. O Google Imagens não indexa uma URL que muda e expira, a imagem não pode virar `og:image` nem `contentUrl` no schema, e quem copia o link da imagem recebe um link quebrado depois. Hoje há só 1 item, mas o acervo vai crescer.

**O que construir**
- A opção recomendada é uma rota no próprio domínio, por exemplo `app/conteudos/[id]/midia/route.ts`:
  - confere se o conteúdo está aprovado;
  - busca o arquivo no Supabase com a chave de servidor;
  - responde com `Cache-Control: public, max-age=…, immutable`.

  Isso mantém o bucket privado. A alternativa é mover os arquivos aprovados para um bucket público.
- Usar essa URL em `published-content.ts`, `/api/conteudos`, nos cards e na página de detalhe.
- Usar a imagem como `og:image` em `/conteudos/[id]` e trocar o `twitter.card` para `summary_large_image` quando houver imagem.
- Aproveitar para servir o tamanho certo: a imagem "Passagem pra grupo" tem 1.122 px e aparece com 331 px no mobile.

**Critérios de aceitação**
- [ ] A URL da mídia é a mesma em duas requisições seguidas e continua válida depois de 15 min.
- [ ] Conteúdo não aprovado retorna 404 na rota de mídia.
- [ ] `/conteudos/[id]` tem `og:image` com a mídia do item.
- [ ] Testes da rota (aprovado, pendente, inexistente).

**Bloqueado por:** nada. Destrava o ImageObject em SEO-11 e SEO-20.

---

### SEO-11 — BreadcrumbList, WebApplication, ItemList e WebPage nas páginas internas

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | SEO, GEO | M (3–4 h) | Médio | `código` |

**Por quê:** o BreadcrumbList gera o caminho no resultado do Google, e o WebApplication/ItemList deixa explícito para máquinas o que cada página é. Não há resultado enriquecido garantido para WebApplication sem avaliações, mas a marcação ajuda os mecanismos de IA a entender a entidade.

**O que construir** (usando o helper de SEO-08)
- `/ferramentas/[slug]`: `WebApplication` (nome, descrição, `url`, `isBasedOn` apontando para `tool.url`, `isAccessibleForFree`, `inLanguage`, `publisher`) e `BreadcrumbList` (Início > Ferramentas > Nome).
- `/ferramentas`: `CollectionPage` + `ItemList`, gerados a partir dos **mesmos dados** da lista renderizada no servidor (SEO-03), e `BreadcrumbList`.
- `/manifesto`: `WebPage`/`AboutPage` com `datePublished`/`dateModified` (ver SEO-17) e `BreadcrumbList`.
- `/blog` e posts: `Blog`/`BlogPosting`, conforme a decisão D3.
- `/conteudos/[id]`: `ImageObject`/`VideoObject`, só depois de SEO-10.
- **Não** usar Review, AggregateRating, FAQPage, HowTo nem marcação Person de candidatos.

**Critérios de aceitação**
- [ ] Teste de pesquisa aprimorada sem erros em uma ferramenta, em `/ferramentas` e em `/manifesto`.
- [ ] O ItemList tem o mesmo número de itens que a lista renderizada.

**Bloqueado por:** SEO-08 (helper) e SEO-03 (dados no servidor). O ImageObject depende de SEO-10.

---

### SEO-12 — Aplicar a marca escolhida e reescrever H1 e descrição da home

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Alta** | GEO, AEO, SEO | P (2 h, depois da decisão) | Médio-Alto | `código` + `conteúdo` |

**Por quê:** o H1 da home ("IDEIAS GANHAM MOVIMENTO.") e a descrição não dizem o que o site é nem citam a eleição, 2026 ou o segundo turno. "Vira voto" é também uma expressão comum de campanha, que não identifica uma entidade só. Mecanismos de IA resumem uma página pelo título, pelo H1 e pelo primeiro parágrafo; hoje esse resumo seria "um hub de ideias".

**O que construir**
- Aplicar a decisão D1 em `title.template`, `applicationName`, `og:site_name`, no rodapé e no JSON-LD (SEO-08).
- Reescrever o H1 ou o subtítulo da home, e a meta description, dizendo o que o site é: por exemplo, ferramentas e conteúdos de trabalhadores de tecnologia para o segundo turno de 2026. O slogan pode continuar como frase de efeito, desde que o subtítulo ou o eyebrow carregue a descrição.
- Revisar a descrição do `/manifesto`, que hoje não fala do posicionamento real do texto.

**Critérios de aceitação**
- [ ] O título, o H1 ou o subtítulo, e a descrição da home dizem o que o site é e para quem.
- [ ] O nome da marca é o mesmo no título, no `og:site_name`, no rodapé e no JSON-LD.
- [ ] Os testes de home e layout foram atualizados.

**Bloqueado por:** D1 e aval da design. O H1 da home faz parte do design aprovado no Figma (#14), e a QA confere fidelidade visual.

---

### SEO-13 — Títulos e descrições das ferramentas pensados para busca

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | SEO, AEO | P (código) + P (conteúdo) | Médio | `código` + `conteúdo` + `decisão` |

**Por quê:** títulos como "Prensa | Vira Voto", "Fura Bolha" e "Diretório 13" não correspondem a nenhuma busca. "Mapa do Segundo Turno" atrai quem procura **mapa de resultados por município** e entrega fatos sobre candidatos, o que gera rejeição. Duas descrições passam de 160 caracteres.

**O que construir**
- Migração adicionando `seo_title text null` (e, se fizer sentido, `seo_description`) em `tool_submissions`. O `title` continua sendo o nome da ferramenta no H1 e nos cards, e o `generateMetadata` usa `seo_title ?? title`.
- Preencher para as ferramentas principais no formato "Nome: o que faz | Marca". Exemplo: "Do Seu Bolso: calculadora de economia com a Farmácia Popular".
- Mudar o **título** (não o slug, que é estável conforme ADR 0003) de mapa-do-segundo-turno para algo como "Fatos com fonte sobre Lula e Flávio".
- Encurtar as descrições de `prensa` (203) e `o-que-esta-em-jogo-na-sua-cidade` (190) para cerca de 155 caracteres.
- Atualizar `docs/tool-curation.md` com a regra do título para SEO.

**Critérios de aceitação**
- [ ] As ferramentas principais têm título descritivo no `<title>` e no `og:title`.
- [ ] Nenhuma meta description passa de 160 caracteres.
- [ ] O slug de mapa-do-segundo-turno não mudou.

**Bloqueado por:** a escolha das palavras-chave e dos textos, que cabe ao time.

---

### SEO-14 — Página completa para ferramentas duradouras (modelo de dados + template)

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Alta** | SEO, AEO, GEO | G (1–2 dias de código) + G (conteúdo) | Alto (depois de 25/10) | `código` + `conteúdo` + `decisão` |

**Por quê:** cada página de ferramenta tem de 50 a 70 palavras: nome, crédito, uma frase e um link para outro site. Nas buscas que essas ferramentas atendem ("lista remédios grátis Farmácia Popular 2026", "votar no exterior segundo turno"), o Google mostra matérias explicativas com listas, passo a passo e fontes. Sem texto próprio, a página não tem o que ranquear nem o que ser citado por IA. Também falta transparência: quem fez, de onde vêm os dados e quando foi checado. Hoje o banco **não tem onde guardar** esse conteúdo.

**Direção escolhida (híbrida):** criar o modelo e o template para todas, escrever o conteúdo completo de 2 ou 3 ferramentas duradouras, manter as outras indexáveis com o bloco de transparência e reavaliar depois de 25/10.

**O que construir**
- Migração em `tool_submissions` com campos opcionais:
  - `summary` (resposta curta de cerca de 40 palavras);
  - `body` (Markdown ou HTML sanitizado: como usar, fatos, perguntas frequentes);
  - `sources` (lista de URLs com rótulo);
  - `maintainer`;
  - `contact_url`;
  - `last_checked_at`;
  - `updated_at`.
- Template em `app/ferramentas/[slug]/page.tsx`:
  - o resumo logo abaixo do H1;
  - a ferramenta incorporada (já existe via `embed_url`) ou uma captura de tela;
  - as seções do `body`, com H2;
  - um bloco **"Quem fez e fontes"**: responsável, fontes, "checado em", e um link "Relatar erro" (que pode apontar para o contato de SEO-07 ou para uma issue);
  - o link para o site de origem.
- Sanitizar com a mesma abordagem de `app/lib/blog/sanitize.ts`.
- Usar `updated_at` no `lastmod` (SEO-19) e no `dateModified` (SEO-11).
- Documentar em `docs/tool-curation.md` como a curadoria preenche os campos.
- **Conteúdo (time):** Do Seu Bolso, Voto Lá Fora e o calendário de protestos, com 500 a 900 palavras cada, seguindo o roteiro de `findings/sxo.md`.

**Critérios de aceitação**
- [ ] Ferramentas sem os campos novos renderizam como hoje, sem seções vazias.
- [ ] As 2 ou 3 ferramentas escolhidas têm resumo, "como usar", fontes, data de checagem e responsável, todos visíveis no HTML do servidor.
- [ ] Todas as ferramentas mostram crédito, data e o link "Relatar erro".
- [ ] O HTML do `body` é sanitizado e tem testes de XSS.

**Bloqueado por:** D4 (quais ferramentas e quem escreve). O código pode ir antes do conteúdo.

---

### SEO-15 — Imagem de compartilhamento por ferramenta

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | Distribuição, GEO | M (3–4 h) | Médio | `código` |

**Por quê:** depois de SEO-05, todas as páginas terão a imagem padrão. Uma imagem com o nome e a frase da ferramenta aumenta os cliques no WhatsApp e serve de `image` no schema.

**O que construir**
- `app/ferramentas/[slug]/opengraph-image.tsx` gerando, com `ImageResponse`, uma imagem 1200×630 com o nome, a categoria e a marca, seguindo a identidade visual (fontes e cores do `globals.css`).
- Conferir no guia do Next 16 se as imagens OG por arquivo funcionam com `generateMetadata` dinâmico.

**Critérios de aceitação**
- [ ] Cada ferramenta tem um `og:image` próprio, de 1200×630 e com menos de 300 KB.
- [ ] Ferramenta inexistente não gera imagem (404).

**Bloqueado por:** SEO-05, e uma referência de design para o layout da imagem. **#78** prevê atualizar as imagens de compartilhamento com a nova logo, então fazer esta tarefa antes de #78 significa refazê-la depois.

---

### SEO-16 — Blog: tirar o post fora do tema da home e definir a estratégia

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | SEO, GEO | P (1 h) | Médio | `código` + `decisão` |

**Por quê:** o único post é um tutorial de condicionais em JavaScript, de fevereiro de 2025, e aparece na home em "Histórias da comunidade". Para quem chega e para os mecanismos de IA, ele é a única data e o único texto datado do site, e não tem relação com o tema. Como a canônica aponta para o dev.to, o blog também não ranqueia.

> ⚠️ **Conflito com uma decisão aprovada.** A spec do blog (`docs/superpowers/specs/2026-10-09-blog-devto-design.md`, issues #22/#23) exige mostrar **todos** os posts da organização, **sem filtro por tag**, com canônica no DEV.to. O filtro por tag que a auditoria sugere contraria essa spec. Esta tarefa foi reescrita para respeitar a spec.

**O que fazer**
- **Sem código:** acrescentar à issue **#21** (governança do dev.to) o critério editorial de que a organização `techcontrabolsonaro` só publica conteúdo no tema do site, e decidir o que fazer com o post atual (por exemplo, tirá-lo da organização no DEV.to).
- **Opcional, com aval de quem aprovou a spec:** esconder a prévia do blog na home enquanto não houver post no tema. A spec original dizia "No Home preview addition", e a prévia veio depois em #89.
- Não mexer na canônica. A D3 já foi decidida.

**Critérios de aceitação**
- [ ] #21 tem o critério editorial de tema registrado.
- [ ] A home não destaca post fora do tema, seja porque a organização só tem posts no tema, seja porque a prévia foi escondida com aval.

**Bloqueado por:** #21 (Pachi, responsável pelo dev.to).

---

### SEO-17 — Manifesto mais fácil de citar: resumo, data, assinaturas e fontes

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | GEO, AEO | M (½ dia) | Médio | `código` + `conteúdo` |

**Por quê:** o manifesto é a única página com texto de verdade (cerca de 1.400 palavras), mas a posição só aparece no 4º parágrafo. O texto não tem data nem número de assinaturas, e as afirmações factuais (escala 6x1, consumo de água de data centers, SERPRO/DATAPREV/CEITEC) não têm fonte. Mecanismos de IA citam trechos curtos e autossuficientes, com data e fonte.

**O que construir**
- Um resumo de 40 a 60 palavras logo abaixo do H1, com a posição explícita.
- "Publicado em / Atualizado em" visíveis, com `<time datetime>`, e `datePublished`/`dateModified` no schema (SEO-11).
- Número de assinaturas, contado no servidor a partir de `manifesto_signatures` com cache, sem expor dados pessoais.
- Um H3 por reivindicação, começando por uma frase que se sustente sozinha.
- Links para as fontes das afirmações factuais.

**Critérios de aceitação**
- [ ] O resumo, a data e o número de assinaturas aparecem no HTML do servidor.
- [ ] Cada afirmação factual tem fonte linkada.
- [ ] O texto oficial alterado foi aprovado por quem responde pelo manifesto.

**Bloqueado por:** o conteúdo e a aprovação do time. O número de assinaturas e a eventual lista de signatários dependem da decisão de visibilidade pública de **#19**.

---

### SEO-18 — Links internos entre ferramentas e para as categorias

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Média** | SEO | M (2–3 h) | Médio | `código` |

**Por quê:** as páginas de ferramenta são becos sem saída: só linkam para `/ferramentas` e para o site externo. Links entre ferramentas da mesma categoria distribuem autoridade e ajudam o rastreador a achar páginas novas sem depender do sitemap.

**O que construir**
- Na página de ferramenta, um bloco "Outras ferramentas de {categoria}" com 3 ou 4 links, renderizado no servidor.
- A categoria no eyebrow vira link para `/ferramentas?categoria=…`, que precisa estar renderizada no servidor (SEO-03).

**Critérios de aceitação**
- [ ] Cada página de ferramenta tem pelo menos 3 links internos para outras ferramentas no HTML do servidor.
- [ ] O link da categoria abre a lista já filtrada e renderizada.

**Bloqueado por:** SEO-03.

---

### SEO-19 — Limpeza do sitemap e do robots.txt

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Baixa** | SEO | P (1–2 h) | Baixo-Médio | `código` |

**Por quê:** o Google ignora `changefreq` e `priority` e usa o `lastmod` só quando ele é confiável. Sem `lastmod`, o Google não sabe que uma ferramenta mudou. A linha `Host:` no robots.txt não é padrão.

**O que construir**
- `app/sitemap.ts`: remover `changeFrequency` e `priority`. Acrescentar `lastModified` real:
  - ferramentas e conteúdos: `updated_at` (SEO-14) ou `reviewed_at`/`created_at`;
  - páginas fixas: uma data mantida no código;
  - **nunca** a data do build.
- `listToolSlugs` e `listPublishedContentIds` passam a devolver a data junto.
- `app/robots.ts`: remover `host`.
- Incluir `/quem-somos` e `/privacidade` quando existirem (SEO-07).

**Critérios de aceitação**
- [ ] Todas as entradas do sitemap têm `<lastmod>` com data real e nenhuma tem `changefreq`/`priority`.
- [ ] O robots.txt não tem `Host:`.
- [ ] `app/sitemap.test.ts` foi atualizado.

**Bloqueado por:** nada. Fica melhor depois de SEO-14 (`updated_at`).

---

### SEO-20 — Itens de `/conteudos`: texto mínimo e indexação

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Baixa** | SEO | M (½ dia) | Baixo | `código` + `conteúdo` |

**Por quê:** o item atual tem 17 palavras e um UUID na URL. Páginas sem texto e com URL opaca não ranqueiam e diluem a qualidade do site.

**O que construir**
- Aplicar `noindex` a itens com descrição curta (abaixo de um limite, por exemplo 40 palavras) e tirá-los do sitemap.
- Opcional: slug legível (`/conteudos/{slug}-{id-curto}`), com redirecionamento 308 da URL com UUID.
- Exigir na curadoria um texto de contexto mínimo (atualizar o formulário de envio e a documentação).

**Critérios de aceitação**
- [ ] Itens com pouco texto têm `noindex` e não estão no sitemap.
- [ ] As URLs antigas continuam funcionando, se os slugs forem implementados.

**Bloqueado por:** SEO-10.

---

### SEO-21 — Áreas de toque de pelo menos 44 px no mobile

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Baixa** | UX/acessibilidade (SEO indireto) | P (1–2 h) | Baixo | `código` |

**Por quê:** os links do rodapé e "← TODAS AS FERRAMENTAS" têm 17 px de altura, e os chips de filtro têm 40 px. O impacto em SEO é pequeno, mas é uma melhoria de acessibilidade barata.

**O que construir**
- `min-height: 44px` e padding nos links do rodapé, no link de voltar da ferramenta, nos chips de filtro e em "Carregar mais".
- **Fora de escopo:** o link do logo. A auditoria apontou falta de nome acessível, mas o link já tem o texto "VIRA VOTO".

**Critérios de aceitação**
- [ ] Todos os elementos citados têm pelo menos 44 px de altura em 375 px de largura, sem quebrar o layout (comparar capturas).

**Bloqueado por:** aval da design, porque muda medidas do design aprovado (#14). Dá para aumentar a área de toque sem mudar o visual, com padding e margem negativa, o que tende a passar na QA de fidelidade.

---

### SEO-22 — `www` com 308 e HSTS completo

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Baixa** | SEO | P (30 min) | Baixo | `ops` (+ `código` para o HSTS) |

**O que fazer**
- Na Vercel (Domains), configurar `www.techcontraflaviobolsonaro.dev` → raiz como redirecionamento **permanente (308)**. Hoje é 307.
- Descobrir de onde vem o `access-control-allow-origin: *` no HTML (Vercel ou Cloudflare) e limitar às rotas `/api/*`, se fizer sentido.
- Quando todos os subdomínios estiverem prontos para HTTPS, acrescentar `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` em `next.config.ts`.

**Critérios de aceitação**
- [ ] `curl -sI https://www.techcontraflaviobolsonaro.dev` retorna 308.
- [ ] A origem do cabeçalho CORS foi registrada na issue e há uma decisão sobre ela.

**Bloqueado por:** acesso aos painéis.

---

### SEO-23 — `llms.txt` e política para rastreadores de IA

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Baixa** | GEO | P (1–2 h) | Baixo | `código` + `decisão` |

**Por quê:** é opcional e o Google ignora, mas alguns agentes e ferramentas de IA leem o arquivo. Custa pouco se for gerado a partir dos mesmos dados.

**O que construir**
- `app/llms.txt/route.ts`, gerado dinamicamente:
  - um parágrafo descrevendo a entidade (marca de D1);
  - links para o manifesto, `/ferramentas` e `/quem-somos`;
  - uma linha por ferramenta aprovada, com o título e o resumo.
- Opcional: decidir se o robots.txt declara `Content-Signal` (por exemplo `search=yes, ai-input=yes, ai-train=no`). É uma preferência declarada, não um bloqueio.

**Critérios de aceitação**
- [ ] `/llms.txt` retorna 200 como `text/plain`, com a lista atual de ferramentas.

**Bloqueado por:** D1, para o texto da entidade.

---

### SEO-24 — Endurecer a CSP (segurança, não SEO)

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Baixa** para SEO | Segurança | M–G | — (para SEO) | `código` |

**Por quê:** o `script-src` tem `'unsafe-inline'` e `'unsafe-eval'`, e `connect-src`/`frame-src` aceitam qualquer `https:`. A auditoria apontou isso, mas **não afeta a busca**. Fica registrado para não se perder.

**O que construir**
- CSP com nonce via proxy/middleware (conferir no guia do Next 16; nonces forçam renderização dinâmica). Tirar o `unsafe-eval` em produção e restringir `frame-src` aos domínios em `tool_embed_domains`.

**Critérios de aceitação**
- [ ] Nenhum erro de CSP no console nas páginas principais, no Turnstile e nos embeds de ferramentas.

**Bloqueado por:** nada. Vale tratar fora do esforço de SEO.

---

### SEO-25 — Presença fora do site e medição

| Severidade | Impacto | Esforço | Ganho | Tipo |
|---|---|---|---|---|
| **Baixa** (agora) | GEO, SEO | contínuo | Médio a longo prazo | `ops` + `conteúdo` |

**Por quê:** fora os perfis sociais, não há menções à marca na web (Wikipédia, imprensa, YouTube). Os mecanismos de IA dão peso a entidades citadas por outras fontes.

**O que fazer**
- Pedir aos autores das ferramentas um link de volta para a página da ferramenta no hub.
- Considerar vídeos explicativos curtos no YouTube para as ferramentas duradouras (com `VideoObject` depois).
- Unificar os nomes dos perfis sociais, se possível (D1).
- Medição: acompanhar no GSC as impressões de `/ferramentas/*` 1 a 2 semanas depois de SEO-03; rodar o Lighthouse mobile a cada deploy relevante; e, se houver chave de API, acompanhar o CrUX.

**Bloqueado por:** SEO-01 (para medir).

---

## Achados descartados ou sem ação

| Achado | Motivo |
|---|---|
| Link do logo sem nome acessível | Falso. O link contém o texto "VIRA VOTO". |
| Canônica da home sem barra final | Equivalente para o Google. Não vale o risco de mexer. |
| Texto em CAIXA ALTA no código-fonte | Escolha de design, com impacto desprezível na busca. |
| Entrega em Markdown (`Accept: text/markdown`), WebMCP, ai-catalog, agent-card | Padrões em rascunho, sem serviço correspondente no site. Rever em 2027. |
| `htmldate` lendo 01/11/2024 | Efeito da falta de datas no HTML. Resolvido por SEO-17 e SEO-11. |
| Import dinâmico do JS das ferramentas (INP) | O TBT é de 0 a 40 ms e não há dado de campo. Rever se o CrUX mostrar problema. |
