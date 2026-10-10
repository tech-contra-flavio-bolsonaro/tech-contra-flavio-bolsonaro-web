# SEO técnico: techcontraflaviobolsonaro.dev

**Nota: 72/100** · Verificado em 10/10/2026

## O que funciona
- Todas as URLs da amostra retornam 200: `/`, `/ferramentas`, `/conteudos`, `/blog`, `/manifesto`, `/enviar`, 4 páginas `/ferramentas/*`, um `/conteudos/<uuid>` e um post do `/blog`.
- Títulos e descrições são únicos em todas as páginas da amostra, exceto `/enviar`.
- As canônicas apontam para a própria página e são absolutas. Batem com o og:url, exceto na home, onde falta a barra final.
- A meta robots é `index, follow` em todas as páginas da amostra.
- A viewport é `width=device-width, initial-scale=1`, e `<html lang="pt-BR">` está definido.
- http → https é um 308 direto para a URL final. URLs com barra final (`/manifesto/`) redirecionam com 308 para a versão sem barra.
- URLs inexistentes na raiz (`/nada-aqui`) retornam 404 de verdade.
- `/sitemap.xml` lista 35 URLs.
- Não há hreflang, o que é aceitável para um site só em português.
- Os cabeçalhos de segurança estão presentes: HSTS, CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` e `Referrer-Policy: strict-origin-when-cross-origin`.

## Alta

### 1. As páginas de listagem dependem de renderização no cliente
- O HTML bruto de `/`, `/ferramentas`, `/conteudos` e `/blog` traz "Carregando…". O primeiro H1 de `/blog` no HTML bruto é `Carregando artigos…`.
- Contagem de palavras no HTML bruto: `/` 202, `/conteudos` 68 e `/blog` 167. Só `/manifesto` (1.418 palavras) é totalmente renderizado no servidor.
- O HTML da home tem 0 links para `/ferramentas/*`, e `/ferramentas` tem 2. As cerca de 28 páginas de ferramenta só são encontradas pelo sitemap.
- Num navegador de verdade, a lista carrega depois da busca em JavaScript (29 ferramentas, veja `images.md`). Rastreadores que não executam JavaScript nunca a veem, e o Google pode indexá-la com atraso.
- **Correção:** buscar as listas de ferramentas, conteúdos e blog em Server Components ou com ISR, para que a lista chegue no HTML como links `<a href>`. Remover o H1 provisório.
- **Como verificar:** `curl -s https://techcontraflaviobolsonaro.dev/ferramentas | grep -c 'href="/ferramentas/'` deve retornar 28 ou mais.

### 2. Soft 404 em ferramentas inexistentes
- `/ferramentas/xyz` retorna **HTTP 200**, com o título "Ferramenta não encontrada | Vira Voto" e duas metas robots conflitantes (`noindex` e `index, follow`).
- **Correção:** chamar `notFound()` em `app/ferramentas/[slug]/page.tsx` quando o slug não existir e remover a meta robots duplicada.

## Média
3. **Os posts do blog apontam a canônica para o dev.to.**
   - `/blog/2299146/revisao-rapida-de-condicionais-em-js-5emd` tem canônica `https://dev.to/techcontrabolsonaro/...`.
   - Isso está certo para conteúdo republicado e evita penalização por duplicidade. Em compensação, a seção do blog nunca vai ranquear.
   - Há três caminhos: tratar `/blog` como uma página de links, publicar posts originais com canônica própria ou aplicar `noindex` às cópias.
4. **A página 404 tem metas robots conflitantes.** `/nada-aqui` retorna 404, mas traz `noindex` e `index, follow` ao mesmo tempo, além do título genérico da home. Tirar a meta robots padrão do layout da página de não encontrado.
5. **Metadados de `/enviar`.** O título é "Vira Voto — ideias em movimento" e a descrição é a mesma da raiz. Não há canônica e a página não está no sitemap. Usar `generateMetadata` com título e descrição próprios e `alternates.canonical`, ou aplicar `noindex` por ser uma página de formulário.
6. **Não há dados estruturados em lugar nenhum.** Veja `schema.md`.
7. **A canônica da home não tem barra final** (`https://techcontraflaviobolsonaro.dev`), enquanto o sitemap usa `/`. Não causa problema, mas vale deixar igual.
8. **CSP fraca.** O `script-src` permite `'unsafe-inline'` e `'unsafe-eval'`, e `connect-src` e `frame-src` aceitam qualquer `https:`. Usar nonces ou hashes e tirar o `unsafe-eval` em produção.

## Baixa
9. O HSTS tem só `max-age=63072000`. Acrescentar `includeSubDomains; preload` quando todos os subdomínios estiverem prontos para HTTPS.
10. `www` → sem www é um **307** (temporário). Usar 301 ou 308 nas configurações de domínio da Vercel ou da Cloudflare. `http://www` passa primeiro por `https://www` (308).
11. O robots.txt tem uma linha `Host:` fora do padrão. Remover.
12. `/llms.txt` retorna 404 (é opcional).
13. O cabeçalho `access-control-allow-origin: *` aparece nas respostas HTML. Limitar às rotas de API.
14. `cache-control: public, max-age=0, must-revalidate` no HTML está ok. Conferir se os arquivos estáticos e as imagens OG têm cache longo.

## Não testado
- Dados de campo das Core Web Vitals (o laboratório está em `performance.md`).
- Inspeção de URL de `/ferramentas` no Search Console, para confirmar o que o Google renderizou.
