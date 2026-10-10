# Performance: techcontraflaviobolsonaro.dev

**Nota: 86/100** (com peso maior para o mobile) · Só laboratório, 10/10/2026

## Fontes
- A API do PageSpeed Insights retornou HTTP 429 (limite diário) em todas as tentativas.
- O Lighthouse rodou localmente contra o site no ar, uma vez por página e dispositivo, com a limitação padrão de mobile e o preset de desktop.
- Não há dados de campo do CrUX, porque eles exigem uma chave de API.

## Resultados de laboratório
| Página | Dispositivo | Nota | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|
| / | mobile | 83 | **4,4 s** (ruim) | 0 | 40 ms | 1,6 s |
| / | desktop | 99 | 1,0 s | 0 | 0 | 0,4 s |
| /ferramentas | mobile | 87 | 3,9 s (precisa melhorar) | 0 | 20 ms | 1,7 s |
| /ferramentas | desktop | 100 | 0,7 s | 0 | 0 | 0,4 s |
| /ferramentas/meu-candidato-2026 | mobile | 88 | 3,8 s (precisa melhorar) | 0 | 20 ms | 1,6 s |
| /ferramentas/meu-candidato-2026 | desktop | 99 | 1,0 s | 0 | 0 | 0,4 s |

- O INP não pode ser medido em laboratório. O TBT de 0 a 40 ms sugere risco baixo, mas isso não foi confirmado.
- O CLS é 0 em todas as páginas. O TTFB vai de 20 a 250 ms, então a hospedagem não é o gargalo.
- **O único problema é o LCP no mobile.**

## Achados
1. **LCP da home: 4,4 s.**
   - O elemento de LCP é `img.home-hero-art`, um SVG de 191 KB com `loading="lazy"` e sem `fetchpriority`.
   - Divisão do tempo: TTFB 169 ms, atraso de carregamento 86 ms, duração do carregamento 43 ms e **atraso de renderização de 1.499 ms**.
2. **Atraso de renderização em todas as páginas mobile (1,1 a 1,5 s).**
   - Em `/ferramentas`, o LCP é o H1, com 1.089 ms de atraso de renderização. Na página de ferramenta, é `p.tool-description`, com 1.108 ms.
   - Dois arquivos CSS bloqueiam a renderização: `3akf66hrkl7a4.css` (23 KB) e outro de 2,5 KB.
   - Seis arquivos woff2 (cerca de 110 KB, um deles com 48 KB) são todos pré-carregados e disputam banda com o CSS e o hero.
3. **A lista de ferramentas buscada no cliente** não causou CLS nem é o LCP no laboratório. Vale conferir em condições reais.
4. **Cerca de 48 KB de JS sem uso** (dois blocos, com 36% e 76% sem uso). Prioridade baixa.
5. **A home pesa 1,3 MB.** Um JPEG de 707 KB carrega em cerca de 818 ms, abaixo da dobra. Confirmar que ele usa lazy e tem o tamanho certo.
6. O `beacon.min.js` da Cloudflare (10 KB) está na cadeia crítica. Impacto pequeno.

## Correções, em ordem
1. **Hero:** tirar `loading="lazy"` de `home-hero-art`, acrescentar `priority` / `fetchPriority="high"` e otimizar o SVG com o svgo. Ganho esperado: de 0,3 a 0,8 s no LCP mobile da home.
2. **Fontes:** pré-carregar só as 1 ou 2 fontes usadas no topo da página e deixar as outras carregarem com `font-display: swap`. Reduzir o arquivo de 48 KB a um subconjunto. Ganho esperado: de 0,3 a 0,7 s em todas as páginas.
3. **CSS:** embutir o CSS crítico (`experimental.inlineCss`) ou dividir o CSS por rota. Ganho esperado: de 150 a 600 ms.
4. **JavaScript:** usar import dinâmico na lista de ferramentas e no JS específico de cada ferramenta, para proteger o INP.
5. **Medição:** rodar o Lighthouse várias vezes, porque rodadas únicas oscilam, e acrescentar dados do CrUX ou de RUM.
