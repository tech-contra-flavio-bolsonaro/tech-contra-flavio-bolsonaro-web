# Plano: usabilidade mobile do Vira Voto

Branch: `fix/mobile-usability` · Data da auditoria: 2026-10-07

## 1. Como a auditoria foi feita

- Leitura de `app/globals.css`, `site-nav.tsx`, `submission-form.tsx`, `content-feed.tsx`, `tool-card.tsx`, `share-button.tsx` e das páginas `/`, `/manifesto`, `/ferramentas`, `/conteudos` e `/enviar`.
- Capturas de tela em **360px de largura real**. O Chrome headless tem largura mínima de janela, então as páginas foram renderizadas dentro de um `<iframe width=360>` para os media queries refletirem 360px.
- Limitações:
  - Sem dispositivo físico, sem teste de teclado virtual e sem teste de rotação.
  - `/api/conteudos` retorna 500 localmente (falta `.env` do Supabase), então cards de conteúdo e estado vazio **não foram vistos renderizados**. Ficam para a verificação final.
  - Não foram testados o diálogo de compartilhar nem o iframe de ferramentas embutidas, só lidos no código.

## 2. Achados

Severidade: **A** = quebra uso ou leitura, **M** = degrada, **B** = polimento.

| # | Sev | Achado | Evidência | Causa |
|---|-----|--------|-----------|-------|
| 1 | A | Navegação em duas linhas: "Enviar conteúdo" cai para a segunda linha, e o espaçamento `space-between` deixa a primeira linha desigual. | Captura 360px, todas as páginas | 4 links em `<nav>` com `flex-wrap`, fonte `.72rem` (`globals.css:104-108`) |
| 2 | A | Alvos de toque dos links do menu com ~12px de altura, muito abaixo dos 44px recomendados. | Captura | `nav a` sem padding nem `min-height` |
| 3 | A | Palavras quebradas no meio nos títulos: "MOVIMENT/O." na home e "COMPAR/TILHE" em `/enviar`. | Capturas home e enviar | `h1 { overflow-wrap: anywhere }` (`globals.css:125`) com `clamp(2.75rem, 14vw, …)`, grande demais para 360px. Em `/enviar`, `.submission-intro h1` ainda tem `max-width: 7ch` e `font-size: clamp(3rem…)`, que não é reduzido no mobile. |
| 4 | M | Vão enorme entre o header e o título na home e nas páginas internas. O conteúdo fica centralizado em uma altura de tela inteira. | Capturas home e conteudos | `#inicio` e `.page-intro` com `min-height: calc(100svh - 112px)` e `justify-content: center`. O `112px` é um valor chutado que não bate com a altura real do header. |
| 5 | M | Em `/conteudos`, o `100svh` forçado empurra o feed e o botão "Enviar um conteúdo" para baixo, e a página parece vazia. | Captura conteudos | `ContentFeed` está dentro de `.page-intro` |
| 6 | M | "Conhecer o hub ↓" na hero aparece como texto simples, sem aparência de botão. | Captura home | O seletor `#inicio > a` não casa: o link está dentro de `.hero-copy` |
| 7 | M | O header não tem destaque nem posição fixa. Depois de rolar, não há como navegar sem voltar ao topo. | Código | `header` estático |
| 8 | M | Seletores globais `header`, `nav`, `main`, `section`, `h1`, `h2` afetam tudo (inclusive futuras páginas e shadcn). Isso causa regressões e obriga a duplicar regras em `@media`. | `globals.css:14-19,34-37,190` | CSS sem escopo por classe |
| 9 | M | Botões do shadcn pequenos para toque: `sm` tem 28px, o padrão tem 32px e `lg` tem 36px. O botão "Compartilhar" usa `size="sm"`. | `components/ui/button.tsx` | Tamanhos desktop-first |
| 10 | M | "Carregar mais" e `.action-link` têm ~40px de altura, e `.action-link` não tem `min-height`. | `globals.css:44,55` | Sem altura mínima de toque |
| 11 | M | O iframe das ferramentas embutidas (`.tool-embed iframe`) não tem CSS e usa 300×150 padrão, pequeno e sem rolagem confortável no mobile. | `tool-card.tsx:29-37`, `globals.css` sem regra | Estilo ausente |
| 12 | M | O Turnstile tem largura fixa de 300px. Em 320px, com padding do painel, pode ultrapassar. | `submission-form.tsx:78`, `.turnstile-shell` | Sem tratamento de overflow |
| 13 | B | O texto "Nenhum arquivo escolhido" fica truncado no input de arquivo ("Nenh…colhido"). | Captura enviar | Largura do campo |
| 14 | B | `box-shadow` de 12px no `.submission-panel` e 8px no empty state somam largura visual em telas estreitas. | `globals.css:83,218` | Sombra fixa |
| 15 | B | Nenhum `viewport` ou `themeColor` explícito. O Next injeta o padrão, mas a barra do navegador mobile fica sem a cor da marca. | `app/layout.tsx` | Configuração ausente |
| 16 | B | Hero: só o ícone do computador aparece, com 22% de opacidade. Fica ambíguo se é decoração ou erro. | Captura home | `.hero-decoration { opacity: .22 }` |
| 17 | B | `100svh` e `calc(100svh - 80px)` ignoram `env(safe-area-inset-*)` (iPhone com notch). | CSS | Sem safe-area |

### Revalidação após `git pull` (main em `8f167ba`, PRs #6 a #10)

A branch foi atualizada por fast-forward. O que entrou no `main` mexeu em CSS e componentes:

- Formulário de envio migrado para `react-hook-form`, com erros inline.
- Estilos de toast e de diálogo.
- Botões de compartilhar estilizados.
- `README` e CI.

Nenhuma dessas mudanças tocou o header, a navegação, os títulos ou as alturas de tela inteira.

| # | Status | Observação |
|---|--------|------------|
| 1, 2, 7, 8 | **Continua** | `header`, `nav`, `nav a` e `.site-nav` inexistente; `@media` do header em `globals.css:107-109` inalterado |
| 3 | **Continua** | `h1 { overflow-wrap: anywhere }` em `globals.css:126` e `max-width: 7ch` no `.submission-intro h1` |
| 4, 5 | **Continua** | `min-height: calc(100svh - 112px)` em `#inicio` e `.page-intro` (linhas 110 e 117) |
| 6 | **Continua** | Seletor `#inicio > a` e link dentro de `.hero-copy`, sem alteração |
| 9 | **Parcial** | `.content-card .share-trigger` agora tem `min-height: 2.5rem` (40px) e `.share-action` tem `2.9rem`. Ainda faltam 44px e os demais botões (`default`, `lg`, "Abrir aqui") |
| 10 | **Continua** | `.action-link` e `.load-more` sem `min-height` |
| 11 | **Continua** | Nenhuma regra para `.tool-embed` ou `iframe` |
| 12 | **Continua** | `.turnstile-shell` sem tratamento de overflow |
| 13 | **Continua, a rechecar** | O formulário mudou, o input de arquivo é o mesmo componente |
| 14 | **Continua** | Sombras de 12px e 8px inalteradas. O diálogo ganhou outra de 12px (`globals.css`, bloco novo), então vale incluir na correção |
| 15, 17 | **Continua** | Sem `viewport`/`themeColor` em `layout.tsx` e sem `safe-area` |
| 16 | **Continua** | Opacidade `.22` dos ícones da hero |

Mudanças que **melhoram** o mobile e não precisam de trabalho:
- `dialog-content` com `width: min(100vw - 2rem, 32rem)` e `max-height: min(44rem, 100dvh - 2rem)`, com rolagem.
- `toast-viewport` com `width: min(100vw - 2rem, 24rem)`.

**Novo item a verificar na Fase 4:** as mensagens de erro inline (`.submission-field-error`, `#ba1a1a` sobre `#f8f7ff`) e os `aria-invalid` do formulário. Falta conferir o contraste e se o erro duplicado em "Arquivo" e "Link de vídeo" fica legível em 360px.

Não verificado visualmente: cards de ferramentas e de conteúdo, estado vazio, diálogo de compartilhar, páginas em 320px e em paisagem.

## 3. Plano de implementação

Ordem pensada para PRs pequenos e revisáveis. Todos seguem o fluxo do `AGENTS.md`: testes, lint, build e `git diff --check`, depois QA via Maestri, e só com **GO** abrir o PR e fazer merge em `main`.

### Fase 0 — Preparação (sem mudança visual)
- Ler o guia de `node_modules/next/dist/docs/` sobre Client Components e `viewport` antes de codar.
- Criar um `.env.local` de exemplo ou mock do `/api/conteudos` para ver cards e estado vazio.
- Escrever os testes de regressão descritos abaixo.

### Fase 1 — Navegação (achados 1, 2, 7, 8)
- `site-nav.tsx` vira Client Component com:
  - Logo à esquerda e botão "Menu" à direita, sempre em uma linha.
  - Painel com links empilhados, cada um com `min-height: 2.75rem`.
  - `aria-expanded`, `aria-controls`, fechamento com Esc, ao navegar e ao tocar fora do painel.
  - Acima de 768px, mantém a navegação horizontal atual, com `white-space: nowrap` nos links.
- "Enviar conteúdo" vira botão de ação (amarelo) no desktop e no painel.
- Header sticky com fundo `--tech-blue`, respeitando `safe-area-inset-top`.
- Trocar os seletores `header` e `nav` por `.site-header` e `.site-nav`, e remover as regras duplicadas do `@media (max-width: 600px)`.
- Testes: abre e fecha o menu, ARIA, Esc, link visível por padrão no desktop.

### Fase 2 — Tipografia e quebras (achado 3)
- Tirar `overflow-wrap: anywhere` dos `h1`. Usar `overflow-wrap: break-word` e `hyphens: manual`.
- Reduzir a escala mobile: `h1` com `clamp(2.25rem, 11vw, 4.5rem)`. Remover `max-width: 7ch` e `8ch` no mobile.
- Garantir que "MOVIMENTO." e "COMPARTILHE" cabem inteiros em 320px e 360px.
- Teste: `app/globals.test.ts` verifica a ausência de `overflow-wrap: anywhere` nos títulos e a presença do `clamp` mobile.

### Fase 3 — Alturas e espaçamento (achados 4, 5, 6, 16, 17)
- Trocar `min-height: calc(100svh - 112px)` por altura baseada na variável `--header-h`, definida em um único lugar.
- Mobile: `page-intro` com `min-height: auto` e `padding-block` fixo, sem centralização vertical.
- Mover o `ContentFeed` e o link "Enviar um conteúdo" para fora do bloco de altura de tela inteira.
- Corrigir o estilo do link "Conhecer o hub": usar `.action-link` ou ajustar o seletor.
- Aumentar a opacidade dos ícones da hero ou escondê-los no mobile.
- Aplicar `env(safe-area-inset-*)` e `viewport-fit=cover` via `export const viewport` em `layout.tsx`, com `themeColor: "#1800d8"`.

### Fase 4 — Alvos de toque e formulários (achados 9, 10, 12, 13, 14)
- Variante de botão com altura mínima de 44px no mobile (`size` ou classe utilitária), aplicada em "Compartilhar", "Carregar mais", "Abrir aqui" e `.action-link`.
- Turnstile: container com `overflow-x: auto` e opção de widget `compact` abaixo de 360px.
- Input de arquivo: permitir quebra do texto do botão nativo ou esconder o texto auxiliar no mobile.
- Reduzir as sombras fixas (`box-shadow`) abaixo de 600px.

### Fase 5 — Conteúdo embutido e cards (achado 11, itens não verificados)
- `.tool-embed iframe { width: 100%; aspect-ratio: 4/3; min-height: 20rem; border: 0 }` e opção de abrir em nova aba como ação principal no mobile.
- Revisar cards de conteúdo e de ferramentas, estado vazio e diálogo de compartilhar em 320px, 360px e 390px.

### Fase 6 — Verificação final
- Rodar `npm test`, lint, build e `git diff --check`.
- Capturas em 320px, 360px, 390px, 768px (retrato) e paisagem, de todas as páginas, via a técnica do iframe ou DevTools.
- Checar rolagem horizontal: `document.documentElement.scrollWidth <= innerWidth` em cada página e viewport.
- Checar o contraste do texto nos cards e do botão amarelo sobre azul.
- Pedir QA no Maestri. Com **GO**, abrir o PR e fazer merge.

## 4. Divisão sugerida de PRs

1. Fases 0 e 1: navegação mobile. É o item mais crítico e o que o usuário percebeu.
2. Fases 2 e 3: tipografia e alturas.
3. Fases 4 e 5: toque, formulário e embeds.
4. Fase 6 como checklist de cada PR, com um relatório final de capturas antes e depois.

## 5. Critérios de aceite

- Navegação sempre em uma linha no header e links com alvo de toque de pelo menos 44px.
- Nenhum título quebra palavra no meio em 320px a 430px.
- Nenhuma página com rolagem horizontal em 320px.
- Sem vão vazio maior que ~2rem entre o header e o conteúdo no mobile.
- Todo botão e link interativo com pelo menos 44px de altura no mobile.
- Testes, lint e build passando, e QA com **GO**.
