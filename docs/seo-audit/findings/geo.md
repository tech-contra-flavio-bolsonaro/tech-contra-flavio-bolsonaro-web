# Preparo para busca com IA (GEO): techcontraflaviobolsonaro.dev

**Nota: 39/100** · 10/10/2026. Neutro em relação à política: avalia só como as máquinas leem o site.

## Notas por dimensão
| Dimensão | Peso | Nota | Principais motivos |
|---|---|---|---|
| Citabilidade | 25% | 35 | O manifesto (~1.400 palavras, renderizado no servidor) é a única página com conteúdo. As páginas de ferramenta têm ~47 palavras sem contar o texto fixo. Não há dados nem fontes. |
| Leitura da estrutura | 20% | 45 | Os títulos do manifesto estão bem aninhados, mas são slogans em caixa alta. `/blog` tem dois H1, e um deles é "Carregando artigos…". |
| Multimídia | 15% | 35 | O og:image funciona (1200×630). Não há vídeo, embora algumas ferramentas sejam sobre vídeos. |
| Autoridade e marca | 20% | 15 | Sem JSON-LD, autor, datas ou "quem somos". Seis variações de nome e perfil. Nenhuma menção na web. |
| Técnica | 20% | 65 | Todos os rastreadores são liberados. Next.js renderizado no servidor, com sitemap, canônicas e lang. As listas de ferramentas dependem de JS. Sem llms.txt. O www redireciona com 307. |

## Acesso de rastreadores de IA
O robots.txt tem `User-Agent: *` / `Allow: /` + Sitemap (e um Host fora do padrão). Não há regras por robô nem linhas gerenciadas pela Cloudflare.

Todos os user agents abaixo receberam HTTP 200, com os mesmos 36.761 bytes e sem cabeçalho de desafio: OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, bingbot, GPTBot, ClaudeBot, Google-Extended e CCBot.

Ressalva: os testes simularam o user agent a partir de um IP que não é de rastreador. A Cloudflare verifica rastreadores reais pelo IP, e os 200 sugerem que o "Block AI bots" está desligado. Confirmar em Cloudflare → Security → Bots / AI Crawl Control.

## Arquivos de descoberta e licenciamento
`/llms.txt`, `/llms-full.txt`, `/.well-known/ai.txt` e `/license.xml` (RSL) retornam 404.

## P1
1. **O conteúdo das ferramentas exige JS e as páginas de ferramenta são rasas.** De 1 a 2 dias:
   - Renderizar a lista no servidor.
   - Dar a cada página de ferramenta um bloco de 130 a 170 palavras (o que faz, para quem é, fonte dos dados, como usar) e 2 ou 3 perguntas e respostas.
   - Tirar o texto provisório do HTML do servidor.
2. **Marca inconsistente e genérica.** Cerca de 2 h.
   - O site aparece como "Vira Voto", "Vira Voto – Tech Contra Bolsonaro", "Tech Contra Bolsonaro" e pelo domínio "techcontraflaviobolsonaro". Os perfis são @techcontrabolsonaro.dev, @techcontra_dev e @techcontraflavio.
   - "Vira voto" é uma expressão comum de campanha (muito usada em 2022), então não identifica uma única entidade.
   - Escolher uma forma oficial, por exemplo "Vira Voto (Tech Contra Bolsonaro)", e acrescentar JSON-LD de Organization com `alternateName` e `sameAs`.
3. **Não há sinais de autoridade nem de confiança.** Cerca de ½ dia.
   - Acrescentar ao manifesto "Publicado em / Atualizado em" e `datePublished`/`dateModified`.
   - Criar uma página "Quem somos".
   - Linkar o autor de cada ferramenta.

## P2
4. **O manifesto é difícil de citar.** A posição só aparece no 4º parágrafo.
   - Abrir com um resumo de 40 a 60 palavras.
   - Começar cada proposta com uma frase que se sustente sozinha.
   - Citar fontes para as afirmações factuais (escala 6x1, consumo de água de data centers, SERPRO/DATAPREV/CEITEC).
   - Escrever os títulos com só a primeira letra maiúscula.
5. **Não há llms.txt.** Um parágrafo descrevendo a entidade, links para o manifesto, o diretório de ferramentas e cada ferramenta com um resumo de uma linha. O Google ignora esse arquivo. Cerca de 1 h.
6. **O post do dev.to fora do tema**, na home e em `/blog`, é a única data que os mecanismos encontram. Filtrar o feed e deixar um H1 por página.

## P3
7. Trocar o 307 do www por 308. Dar slugs descritivos e mais texto a `/conteudos/<uuid>`. Usar VideoObject onde as ferramentas tiverem vídeo.
8. Presença fora do site: não há entidade na Wikipédia, canal no YouTube nem cobertura de imprensa. Caminhos possíveis: vídeos explicativos no YouTube, discussões em comunidades e links de volta a partir dos sites dos autores das ferramentas.

## Menções à marca
- Wikipédia (pt): nada para "Tech Contra Bolsonaro" nem para o domínio. Os resultados para "Vira Voto" não têm relação com o site.
- A busca `site:` no Bing não retornou nada. É possível que o site não esteja indexado, o que também impede o ChatGPT Search e o Copilot. Conferir no Bing Webmaster Tools.
- DuckDuckGo: nada. Reddit: não verificado (a API bloqueou). YouTube e LinkedIn: nada.
- Há perfis no Instagram, X, TikTok e Kwai, com nomes de perfil diferentes.

## Estimativas por plataforma
| Plataforma | Nota | Motivo |
|---|---|---|
| Google AI Overviews | 30 | Acesso ok, pouco conteúdo, sem dados de entidade |
| ChatGPT Search | 30 | Depende do índice do Bing, e o domínio não aparece no Bing |
| Perplexity | 35 | O manifesto pode ser citado, mas não há autoridade |
| Bing Copilot | 20 | O site não aparece no Bing. Enviar o sitemap e ativar o IndexNow |

## Ordem das correções
1. JSON-LD de Organization e um único nome de marca (~2 h)
2. Renderizar a lista de ferramentas no servidor (~½ a 1 dia)
3. llms.txt (~1 h)
4. Descrições de 130 a 170 palavras nas ferramentas (~1 a 2 dias)
5. Resumo, data e fontes no manifesto (~½ dia)
6. Bing Webmaster Tools e IndexNow (~30 min)
