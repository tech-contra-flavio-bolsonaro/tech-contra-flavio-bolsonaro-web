# Plano de ação: techcontraflaviobolsonaro.dev

O plano está organizado em torno do segundo turno, em **25/10/2026** (15 dias depois da auditoria).
- **Rastreamento primeiro:** essas correções vêm antes porque destravam todo o resto.
- **Reescrita das ferramentas:** foca nas que continuam úteis depois da eleição.
- **Estimativas de esforço:** consideram alguém que conheça o código Next.js.

## Crítico: esta semana

| # | Ação | Onde | Esforço |
|---|---|---|---|
| 1 | Renderizar no servidor as listas de ferramentas, conteúdos e blog, para que o HTML tenha links `<a href="/ferramentas/…">` de verdade, e remover o H1 provisório "Carregando…" | `app/page.tsx`, `app/ferramentas/page.tsx`, `app/conteudos`, `app/blog` (Server Components / ISR) | ½ a 1 dia |
| 2 | Retornar 404 de verdade para ferramentas inexistentes (`notFound()`) e remover a meta robots `index, follow` duplicada das páginas de não encontrado | `app/ferramentas/[slug]/page.tsx`, metadados do layout raiz | 30 min |
| 3 | Publicar `/quem-somos` (quem mantém o site, contato, financiamento, eventual ligação com partido ou campanha) e `/privacidade` (LGPD), linkar a política ao lado do formulário do manifesto e pôr no rodapé quem é o responsável | Páginas novas + rodapé | ½ dia + revisão jurídica |
| 4 | Servir a mídia de `/conteudos` a partir de uma URL pública estável, em vez de links assinados da pasta `pending/` | Storage do Supabase / rota de conteúdo | 1 a 2 h |
| 5 | Adicionar JSON-LD de Organization + WebSite na home e BreadcrumbList nas páginas internas | Layout raiz; os trechos estão em `findings/schema.md` | 2 h |
| 6 | Enviar o sitemap ao Google Search Console e ao Bing Webmaster Tools, ativar o IndexNow e pedir indexação de `/ferramentas` e das ferramentas principais | GSC, Bing WMT, Cloudflare | 30 min |

**Como confirmar que funcionou:**
- `curl -s https://techcontraflaviobolsonaro.dev/ferramentas | grep -c 'href="/ferramentas/'` retorna 28 ou mais.
- `curl -sI https://techcontraflaviobolsonaro.dev/ferramentas/xyz` retorna 404.
- O Teste de pesquisa aprimorada mostra a Organization.

## Alto: próximas 1 a 2 semanas

| # | Ação | Esforço |
|---|---|---|
| 7 | Reescrever **Do Seu Bolso**, **Voto Lá Fora** e o **calendário de protestos** como páginas completas, de 500 a 900 palavras: resposta curta, como usar, fatos com fontes, perguntas frequentes, crédito e metodologia, link para a ferramenta | 1 a 2 dias |
| 8 | Em toda página de ferramenta, mostrar o responsável, as fontes, a data da última checagem e como relatar erros | ½ dia |
| 9 | Títulos descritivos no formato "Nome: o que faz \| Vira Voto", por exemplo "Do Seu Bolso: calculadora de economia com a Farmácia Popular" | 2 h |
| 10 | Renomear ou reposicionar mapa-do-segundo-turno, por exemplo "Fatos com fonte sobre Lula e Flávio" | 30 min |
| 11 | Escolher um nome principal e usá-lo nos títulos, no og:site_name e no rodapé, explicar a relação entre os nomes em `/quem-somos` e reescrever o H1 e a descrição da home para dizer o que o site é | 2 h |
| 12 | JSON-LD WebApplication em cada ferramenta e marcação `Event` no calendário de protestos, se os eventos estiverem na própria página | 2 a 3 h |
| 13 | Aplicar `noindex`, ou metadados próprios + canônica, em `/enviar` e `/ferramentas/enviar` | 30 min |
| 14 | Filtrar o feed do blog no dev.to por tag, ou tirar a seção do blog da home | 1 h |
| 15 | LCP no mobile: `priority` no hero e no logo, pré-carregar só 1 ou 2 fontes, otimizar o SVG do hero com o svgo e embutir o CSS crítico | ½ dia |

## Médio: em até um mês

| # | Ação | Esforço |
|---|---|---|
| 16 | Aplicar `noindex` às páginas de ferramenta rasas restantes, ou juntá-las numa página `/ferramentas` mais forte, com descrições por categoria renderizadas no servidor | ½ dia |
| 17 | Manifesto: resumo de 40 a 60 palavras no topo, data, número de assinaturas, um H3 por reivindicação e fontes para as afirmações factuais | ½ dia |
| 18 | Imagem de compartilhamento (og:image) para cada ferramenta | 1 dia |
| 19 | Acessibilidade: nome para o link do logo e áreas de toque de pelo menos 44 px (rodapé, link de voltar, chips de filtro) | 2 h |
| 20 | Adicionar `lastmod` ao sitemap, remover `changefreq`/`priority` e tirar o `Host:` do robots.txt | 1 h |
| 21 | Links de "ferramentas relacionadas" entre as ferramentas e para os hubs de categoria | 2 h |

## Baixo: backlog

- Redirecionamento do `www`: trocar 307 por 308.
- Adicionar `includeSubDomains; preload` ao HSTS.
- Endurecer a CSP: usar nonces e tirar o `unsafe-eval`.
- Limitar o cabeçalho `access-control-allow-origin: *` às rotas de API.
- Publicar o `llms.txt`.
- Opcional: política para IA / Content-Signal no robots.txt.
- Slugs descritivos para `/conteudos/<uuid>`.
- Encurtar as descrições com mais de 160 caracteres.
- Presença fora do site: vídeos explicativos no YouTube e links de volta a partir dos sites dos autores das ferramentas.

## Como saber se está funcionando

- **Search Console:** páginas indexadas e impressões de `/ferramentas/*`. O efeito deve aparecer em 1 a 2 semanas depois da correção nº 1.
- **Bing Webmaster Tools:** site indexado, o que libera o ChatGPT Search e o Copilot.
- **Conferência do HTML bruto:** rodar o comando da correção nº 1 a cada deploy.
- **Lighthouse mobile:** LCP da home abaixo de 2,5 s.
- **Depois de 25/10:** o tráfego das ferramentas duradouras (Do Seu Bolso, Voto Lá Fora, calendário) deve se manter, enquanto as ferramentas só de eleição perdem acesso.
