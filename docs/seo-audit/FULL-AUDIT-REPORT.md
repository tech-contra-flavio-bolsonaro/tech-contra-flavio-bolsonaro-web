# Auditoria de SEO: techcontraflaviobolsonaro.dev ("Vira Voto")

**Data:** 10/10/2026
**Escopo:** site completo. São 35 URLs do sitemap (5 páginas principais, cerca de 29 páginas de ferramentas e 1 item de conteúdo), mais `/enviar`, `/ferramentas/enviar`, um post do blog e testes de 404.
**Tipo de site:** hub de mobilização cívica e política (publicação/comunidade), em português, voltado ao segundo turno da eleição presidencial de 2026. Next.js na Vercel, atrás da Cloudflare.
**Contexto:** o segundo turno é em **25/10/2026**, 15 dias depois desta auditoria. O que for alterado agora pode não ser rastreado e ranqueado antes da votação.

Esta auditoria avalia só SEO e qualidade de conteúdo. Não avalia as posições políticas do site.

---

## Resumo executivo

### Nota de saúde de SEO: 49 / 100

| Categoria | Peso | Nota | Ponderada |
|---|---|---|---|
| SEO técnico | 22% | 72 | 15,8 |
| Qualidade do conteúdo | 23% | 30 | 6,9 |
| SEO on-page | 20% | 46 | 9,2 |
| Schema / dados estruturados | 10% | 12 | 1,2 |
| Performance (laboratório) | 10% | 86 | 8,6 |
| Preparo para busca com IA | 10% | 39 | 3,9 |
| Imagens | 5% | 72 | 3,6 |
| **Total** | | | **49** |

O site é rápido no desktop, os rastreadores conseguem acessá-lo e os metadados foram escritos à mão, sem modelo. A nota baixa vem de três coisas:

1. **Quase não há o que ranquear.** O manifesto (cerca de 1.400 palavras) é a única página com conteúdo de verdade. Cada uma das cerca de 28 páginas de ferramenta tem de 50 a 70 palavras: um nome, uma frase, uma linha de crédito e um link para outro site. Nas buscas que essas ferramentas poderiam atender, o Google mostra matérias explicativas e listas.
2. **Ninguém aparece como responsável pelo site.** `/quem-somos`, `/contato`, `/privacidade` e `/termos` retornam 404. Ferramentas que fazem afirmações sobre candidatos têm o crédito "Iniciativa independente". O Google aplica a conteúdo eleitoral o padrão de confiança mais rigoroso. O formulário do manifesto coleta dados pessoais sem política de privacidade, o que também é uma questão de LGPD e de regras do TSE para um advogado avaliar.
3. **As listas de ferramentas não estão no HTML que os rastreadores recebem.** `/`, `/ferramentas`, `/conteudos` e `/blog` chegam com "Carregando…" e só se preenchem com uma busca feita no navegador. O HTML da home tem 0 links para páginas de ferramenta, e `/ferramentas` tem 2. Na prática, as ferramentas só são encontradas pelo sitemap.

### Os 5 problemas críticos
1. Não há páginas "quem somos", contato, privacidade ou termos, nem organizador ou contato identificado.
2. As listas de ferramentas, conteúdos e blog só aparecem no navegador. As páginas de ferramenta quase não recebem links internos no HTML.
3. As páginas de ferramenta são resumos de 50 a 70 palavras que só levam para outro site.
4. A imagem de `/conteudos` usa uma URL assinada do Supabase, numa pasta `pending/`, que expira cerca de 15 minutos depois que a página é servida.
5. O site não tem nenhum dado estruturado.

### As 5 vitórias rápidas
1. Chamar `notFound()` para `/ferramentas/[slug]` inexistente. Hoje é um soft 404, com tags robots conflitantes.
2. Colar o JSON-LD de Organization + WebSite de `findings/schema.md`.
3. Tirar `loading="lazy"` do hero e do logo da home e pré-carregar só 1 ou 2 fontes.
4. Aplicar `noindex` ou metadados próprios em `/enviar` e `/ferramentas/enviar`.
5. Enviar o sitemap ao Google Search Console e ao Bing Webmaster Tools e ativar o IndexNow.

---

## SEO técnico (72/100)

Detalhes em `findings/technical.md` e `findings/sitemap.md`.

**O que funciona:**
- Todas as URLs retornam 200, com títulos e descrições únicos.
- As canônicas apontam para a própria página e as páginas usam `index, follow` e `lang="pt-BR"`.
- http → https e a barra final redirecionam com 308.
- Caminhos inexistentes na raiz retornam 404 de verdade.
- O sitemap é válido e tem 35 URLs.
- Os cabeçalhos HSTS, CSP, nosniff, X-Frame-Options e Referrer-Policy estão presentes.

**Alta**
- **As listas dependem de renderização no cliente.** O HTML bruto de `/` (202 palavras), `/ferramentas`, `/conteudos` (68) e `/blog` (167) traz "Carregando…". O primeiro H1 de `/blog` é `Carregando artigos…`. Num navegador de verdade, a lista carrega (29 ferramentas). Rastreadores sem JavaScript nunca a veem, e o Google pode demorar a processá-la.
  - **Correção:** buscar as listas em Server Components ou com ISR, para que o HTML já contenha `<a href="/ferramentas/…">`.
  - **Como verificar:** `curl -s https://techcontraflaviobolsonaro.dev/ferramentas | grep -c 'href="/ferramentas/'` deve retornar 28 ou mais.
- **Soft 404.** `/ferramentas/xyz` retorna 200, com título "Ferramenta não encontrada | Vira Voto" e as tags `noindex` e `index, follow` ao mesmo tempo. **Correção:** `notFound()`.

**Média**
- A página 404 tem a mesma meta robots duplicada e o título genérico da home.
- `/enviar` e `/ferramentas/enviar` têm o título genérico "Vira Voto — ideias em movimento", não têm canônica e não estão no sitemap.
- Os posts do blog apontam a canônica para o dev.to. Isso está certo para conteúdo republicado, mas assim o blog nunca vai ranquear.
- O sitemap não tem `lastmod`.
- A CSP permite `unsafe-inline` e `unsafe-eval`, e `connect-src`/`frame-src` aceitam qualquer `https:`.

**Baixa**
- `www` → sem www usa 307; o certo é 308.
- O HSTS não tem `includeSubDomains; preload`.
- A linha `Host:` no robots.txt e as tags `changefreq`/`priority` do sitemap podem sair.
- O cabeçalho `access-control-allow-origin: *` aparece nas respostas HTML.
- A canônica da home não tem a barra final, e o sitemap tem.

## Qualidade do conteúdo (30/100)

Detalhes em `findings/content.md`.

**Crítica**
- **Falta identificação e transparência.** Não há páginas "quem somos", contato, privacidade nem termos. Os perfis sociais usam nomes diferentes entre si (Instagram `techcontrabolsonaro.dev`, X `techcontra_dev`, TikTok/Kwai `techcontraflavio`). O formulário de assinatura do manifesto exige dados pessoais e tem só uma frase sobre privacidade.
  - Criar `/quem-somos` com os organizadores ou o coletivo, contato, financiamento e eventual ligação com partido ou campanha.
  - Criar `/privacidade` (LGPD) e linkar ao lado do formulário.
  - Pôr no rodapé uma linha dizendo quem é o responsável pelo site.
  - Pedir a um advogado que confira as regras do TSE sobre identificação em propaganda eleitoral na internet.
- **Afirmações políticas sem autoria.** Ferramentas que fazem afirmações sobre candidatos (mapa-do-segundo-turno, super-flavio-world) têm o crédito "Iniciativa independente" ou "voluntária". Cada página de ferramenta deve mostrar o responsável, as fontes, a data da última checagem e um jeito de relatar erros.

**Alta**
- **Páginas de ferramenta rasas:** de 48 a 69 palavras cada. Vale ampliar as que continuam úteis depois da eleição e aplicar `noindex` ou consolidar as outras (veja SXO abaixo).
- **Blog fora do tema:** o único post é um tutorial de JavaScript de 2025, importado do dev.to e destacado na home em "HISTÓRIAS DA COMUNIDADE". Filtrar o feed por tag ou esconder a seção.
- **Nome indefinido:** "Vira Voto", "Tech Contra Bolsonaro", o domínio "techcontraflaviobolsonaro", e o manifesto nunca diz "Vira Voto". "Vira voto" também é uma expressão comum de campanha. Escolher um nome principal e explicar a relação entre eles na página "quem somos". Reescrever o H1 da home ("IDEIAS GANHAM MOVIMENTO.") para dizer o que o site é.
- **Item de `/conteudos`:** 17 palavras, e a imagem fica em `community-submissions/pending/`, com URL assinada que expira. Servir a mídia aprovada a partir de uma URL pública estável.

**Média**
- O manifesto é difícil de ler (Flesch adaptado ao português ≈ 27; frases com média de 26 palavras, a mais longa com 69). Acrescentar um resumo no topo, um H3 por reivindicação, a data e o número de assinaturas.
- As páginas de ferramenta usam `og:type=article` e não têm og:image.

## SEO on-page (46/100)

- **Os títulos não correspondem às buscas.** "Prensa | Vira Voto", "Fura Bolha", "Bora Lula", "Diretório 13". Usar o formato "Nome: palavras-chave descritivas | Vira Voto", por exemplo "Do Seu Bolso: calculadora de economia com a Farmácia Popular | Vira Voto".
- **O H1 e a descrição da home são vagos.** Nenhum dos dois cita a eleição, 2026 ou o segundo turno.
- **mapa-do-segundo-turno atrai a intenção errada.** Quem busca "mapa segundo turno" quer um mapa de resultados por município, mas a ferramenta é um conjunto de páginas de fatos. Renomear, por exemplo, para "Fatos com fonte sobre Lula e Flávio".
- **Descrições com mais de 160 caracteres** em o-que-esta-em-jogo-na-sua-cidade e prensa.
- **Não há links internos entre ferramentas** nem para os hubs de categoria.
- **`/blog` tem mais de um H1** (um deles é o texto de carregamento).

### Intenção de busca por ferramenta (da análise SXO, `findings/sxo.md`)
| Ferramenta | Busca provável | O que ranqueia | Lacuna |
|---|---|---|---|
| meu-candidato-2026 | "propostas Lula e Flávio" | Matérias comparativas (Gazeta SP, Congresso em Foco, O Liberal) | Crítica |
| do-seu-bolso | "lista remédios grátis Farmácia Popular 2026" | Listas: 41 itens, documentos, como retirar | Crítica |
| mapa-do-segundo-turno | "mapa segundo turno 2026" | Mapas de resultados (O POVO+) | Crítica (nome) |
| voto-la-fora | "votar no exterior segundo turno 2026" | Matérias explicativas, TSE | Alta |
| em-frente-calendario-de-protestos | "agenda de atos 2026" | Nenhum calendário brasileiro ranqueia | Alta, mas é um espaço livre |

As ferramentas que mais valem ser reescritas são as que continuam úteis depois de 25/10: **Do Seu Bolso**, **Voto Lá Fora** e o **calendário de protestos**. Cada uma deve ter de 500 a 900 palavras:
- uma resposta de cerca de 40 palavras no topo
- a ferramenta incorporada ou uma captura de tela
- "Como usar" em 3 passos
- os fatos, com fontes
- perguntas frequentes curtas
- crédito e metodologia
- um link para a ferramenta original

## Schema / dados estruturados (12/100)

Detalhes e JSON-LD prontos para colar em `findings/schema.md`.

- Nenhum JSON-LD, microdata ou RDFa nas 9 páginas verificadas.
- Na home, usar Organization + WebSite, com `alternateName` cobrindo todas as variações de nome e `sameAs` para Instagram, X, TikTok e Kwai.
- Em `/ferramentas`, usar CollectionPage + ItemList, gerados a partir dos mesmos dados dos cards.
- Em cada página de ferramenta, usar WebApplication + BreadcrumbList, sem avaliações inventadas.
- Se o calendário de protestos listar os eventos na própria página, a marcação `Event` é a melhor chance de resultado enriquecido, porque nenhum concorrente ocupa esse espaço.
- Não usar HowTo, FAQPage novo pensando no resultado de busca, Review/AggregateRating nem marcação Person de candidatos.

## Performance (86/100, só laboratório)

Detalhes em `findings/performance.md`.

| Página | LCP mobile | LCP desktop | CLS | TBT |
|---|---|---|---|---|
| / | **4,4 s** (ruim) | 1,0 s | 0 | 40 ms |
| /ferramentas | 3,9 s | 0,7 s | 0 | 20 ms |
| /ferramentas/meu-candidato-2026 | 3,8 s | 1,0 s | 0 | 20 ms |

No desktop, as notas vão de 99 a 100. O único problema é o LCP no mobile, e a maior parte dele é **atraso de renderização** (1,1 a 1,5 s), não tempo de download.

**Correções:**
1. O hero da home, `img.home-hero-art` (SVG de 191 KB), usa `loading="lazy"`. Trocar por `priority` / `fetchpriority="high"` e otimizar o arquivo com o svgo.
2. Seis arquivos woff2 (cerca de 110 KB) são todos pré-carregados. Pré-carregar só as 1 ou 2 fontes usadas no topo da página.
3. Embutir o CSS crítico ou dividir o bloco de CSS de 23 KB.

O ganho total esperado é de 0,5 a 1,5 s no mobile, aproximadamente. A API do PageSpeed estava no limite de uso e não houve dados de campo (CrUX), então o INP não foi medido.

## Preparo para busca com IA (39/100)

Detalhes em `findings/geo.md` (busca com IA) e `findings/agentic.md` (agentes de IA).

- **O acesso está ok.** O robots.txt libera tudo. Os user agents de Googlebot, bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, GPTBot, ClaudeBot, Google-Extended e CCBot receberam 200. Os testes usaram user agents simulados, então vale confirmar no painel da Cloudflare as configurações para rastreadores de IA.
- **O site não aparece no Bing.** Isso também impede citações no ChatGPT Search e no Copilot. Enviar pelo Bing Webmaster Tools e ativar o IndexNow.
- **Pouco conteúdo citável.** O manifesto abre com um texto genérico, a posição só aparece no 4º parágrafo e não há fontes. Acrescentar um resumo de 40 a 60 palavras e fontes para as afirmações factuais.
- **Entidade pouco clara.** Há seis variações de nome e perfil. O JSON-LD de Organization com `alternateName` e `sameAs` ajuda.
- **Não há llms.txt.** É opcional, e o Google o ignora.
- **A experiência para agentes é limpa:** nenhum elemento interativo sem nome e nenhum campo sem rótulo. A nota de Agentic Browsing do Lighthouse não saiu porque a cota da API acabou.

## Imagens (72/100)

Detalhes em `findings/images.md`. Capturas de tela em `screenshots/`.

- **O que funciona:** no mobile, o H1 e o botão principal aparecem sem rolar a tela. Nada transborda para os lados. Depois do JavaScript, a lista mostra as 29 ferramentas.
- **O link do logo não tem nome acessível.** A imagem com `alt=""` é o único conteúdo do link. Definir `alt="Vira Voto"`.
- **Áreas de toque menores que 44 px no mobile:** links do rodapé com 17 px, "← TODAS AS FERRAMENTAS" com 17 px e chips de filtro com 40 px.
- **Imagens do topo da página com carregamento adiado** (veja Performance).
- **A imagem "Passagem pra grupo" tem 1.122 px** de largura, mas é exibida com 331 px no mobile.
- **Não há og:image nem imagem de prévia nas páginas de ferramenta.** Isso pesa porque o compartilhamento pelo WhatsApp é o principal meio de divulgação do site.

---

## Metodologia e limites

- As 35 URLs do sitemap foram rastreadas (status, canônica, robots), além das páginas linkadas no menu que não estão no sitemap. O conteúdo de 19 páginas foi analisado no HTML bruto e no renderizado.
- O Lighthouse rodou localmente, uma vez por página e dispositivo. A API do PageSpeed Insights retornou 429, então não há dados de campo (CrUX) nem a nota de Agentic Browsing do Lighthouse.
- As capturas de tela foram feitas com Playwright em 1920×1080 e 375×812.
- As comparações de resultados de busca usaram resumos de busca na web, sem posições exatas, "As pessoas também perguntam" ou AI Overview, e sem dados de volume de palavras-chave.
- Não houve acesso a Search Console, GA4, Moz ou ferramentas de visibilidade em IA. A indexação no Google não foi confirmada.
- Os testes de rastreadores de IA usaram user agents simulados, a partir de um IP que não é de rastreador.
- Os sites externos para onde as ferramentas apontam não foram avaliados.
