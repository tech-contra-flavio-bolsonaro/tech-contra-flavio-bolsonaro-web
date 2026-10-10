# Imagens e visual/mobile: techcontraflaviobolsonaro.dev

**Nota de imagens: 72/100** · 10/10/2026

As páginas foram abertas com o Playwright em 1920×1080 e 375×812 (com emulação de toque). As capturas foram feitas depois do networkidle + 2,5 s.
- Capturas de tela: `screenshots/`
- Medições: `evidence/visual-measurements.txt`

## O que funciona
- **Topo da página no mobile:**
  - Home: o H1 "IDEIAS GANHAM MOVIMENTO." fica em y=155–317 e o botão "Leia e assine o manifesto" aparece sem rolar.
  - `/ferramentas`: o H1 fica em y=168–288, mas a primeira ferramenta não aparece na primeira tela, porque os filtros começam por volta de y=984.
  - Página de ferramenta: o H1 fica em y=240–335 e o botão "Abrir no site de origem" aparece sem rolar.
- Nada transborda para os lados em 375 nem em 1920.
- A meta viewport está presente e a fonte base é de 16 px.
- O estado "Carregando…" se resolve depois da hidratação. `/ferramentas` mostra 29 ferramentas, os filtros por categoria e o botão "Carregar mais ferramentas".
- O botão "Menu" está presente no mobile.

## Alta
1. **O link do logo não tem nome acessível.** `home-pixel-logo.svg` (no cabeçalho e no rodapé) tem `alt=""` e é o único conteúdo do link.
   - Definir `alt="Vira Voto"` na imagem ou `aria-label="Vira Voto – página inicial"` no link.
   - Manter `alt=""` na estrela decorativa e nos ícones de controle.
   - Dar uma descrição curta a `hero-ideas-network.svg` se ela tiver significado, ou usar `aria-hidden`.
   - Tornar descritivo o alt de "Passagem pra grupo".
2. **Áreas de toque pequenas no mobile** (o recomendado é de 44 a 48 px):
   - Link do logo no cabeçalho: 148×28.
   - Chips de filtro: 40 px de altura ("Todas" 90×40, "Jogos" 83×40).
   - Links do rodapé: 17 px de altura (o pior caso).
   - "← TODAS AS FERRAMENTAS": 17 px.
   - "Carregar mais ferramentas": 42 px.
   - **Correção:** acrescentar `min-height: 44px` e padding.

## Média
3. **Imagens do topo da página com carregamento adiado.** Todas as `img` usam `loading="lazy"`, inclusive o logo do cabeçalho e o hero. Usar `priority` / `fetchpriority="high"` nessas duas (veja `performance.md`).
4. **"Passagem pra grupo" é grande demais.** A imagem tem 1.122 px de largura real e é exibida com 529 px no desktop e 331 px no mobile. Conferir o `sizes`, para o mobile receber no máximo 700 px, e usar AVIF ou WebP.
5. **O texto de carregamento está no HTML estático.**
   - Renderizar a lista no servidor ou acrescentar um fallback em `<noscript>`.
   - Acrescentar `role="status"` / `aria-live="polite"` e um `min-height` no contêiner de carregamento.

## Baixa
6. As páginas de ferramenta não têm imagem (nem prévia, nem og:image).
7. Os ícones `control.svg` de 9×9 repetidos, com `alt=""`, estão corretos. Dá para trocar por CSS ou por SVG inline com `aria-hidden`.

## Não verificado
- Nomes acessíveis dos links sociais do rodapé.
- Viewports de tablet e notebook.
