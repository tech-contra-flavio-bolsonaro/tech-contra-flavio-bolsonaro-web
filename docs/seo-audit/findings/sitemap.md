# Sitemap: techcontraflaviobolsonaro.dev

Verificado em 10/10/2026. Cópias brutas em `evidence/sitemap.xml` e `evidence/robots.txt`.

## O que passa
- `/sitemap.xml` retorna 200 como `application/xml`, com 35 entradas `<loc>` e o namespace correto.
- As 35 URLs retornam 200, sem redirecionamento, com `index, follow` e sem X-Robots-Tag.
- Todas as canônicas batem com a URL do sitemap. A canônica da home não tem barra final, mas é equivalente.
- Nenhuma URL não indexável está incluída.
- O robots.txt aponta para o sitemap com URL absoluta.

## Média
1. **Nenhuma URL tem `lastmod`.** Usar as datas reais de alteração do conteúdo, no formato W3C. Não carimbar a data do build em todas as URLs.
2. **`/enviar` está fora.** Está no menu, retorna 200 e tem `index, follow`, mas não tem canônica e tem título genérico. Decidir entre duas opções:
   - Indexar: incluir no sitemap, com canônica própria e título único.
   - Aplicar `noindex`.
3. **`/ferramentas/enviar` também está fora**, com os mesmos problemas. Como fica no espaço de URLs das ferramentas, pode parecer duplicata de `/enviar`.

## Baixa
4. Todas as URLs têm `changefreq` e `priority`. O Google ignora as duas tags, e os valores não são realistas (`daily` em `/ferramentas`, `/conteudos` e `/blog`). Remover.
5. A linha `Host:` do robots.txt é fora do padrão. Remover.
6. As URLs de posts do blog estão corretamente fora, porque a canônica aponta para o dev.to. Se depois a canônica passar a ser própria, incluí-las.
7. `/conteudos/*`: só existe um item, e ele está listado. Gerar o sitemap dinamicamente, para os itens novos entrarem.
8. O HTML estático de `/ferramentas` tem só 2 links de ferramenta, contra 30 URLs de ferramenta no sitemap. Hoje o sitemap é o principal caminho para os rastreadores acharem as ferramentas (veja `technical.md`).

## Não se aplica
- Critério de qualidade de páginas de localidade (o site não tem páginas de localidade).
