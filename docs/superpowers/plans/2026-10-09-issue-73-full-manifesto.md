# Issue 73 — manifesto integral

**Goal:** publicar texto canônico da issue 73 imediatamente abaixo do hero com navegação de leitura e assinatura inicial secundária.

**Architecture:** componente server dedicado, texto literal separado da fixture independente extraída do GitHub. Pequeno link client de leitura para transferência de foco, seguindo o padrão de assinatura existente. Estilos restritos à página Manifesto.

**Tech stack:** Next 16.3.7, React 19, CSS existente, Vitest/Testing Library, bun dev local 3073, Supabase Docker existente 54321. Base fresh fetch 61a027b7; branch feat/issue-73-full-manifesto; worktree /private/tmp/vira-voto-issue-73. Execução inline autorizada, sem novos gates/commit/push; integração final pelo Tech lead.

- [x] Ler issue integral, AGENTS e guias locais Next de pages/CSS/links; consultar frame Manifesto via MCP.
- [x] Adicionar fixture bruta app/manifesto/__fixtures__/issue-73.txt e testes em app/manifesto/page.test.tsx: igualdade integral normalizando apenas espaços HTML, 7 parágrafos, 9 headings h3/textos/ordem, primeira seção depois do hero, links/foco de leitura e assinatura. Rodar bun run test app/manifesto/page.test.tsx e observar falhas antes da implementação.
- [x] Criar app/components/manifesto-full-text.tsx: section com h2 canônico tabIndex -1, sete p e nove pares h3/p, sem argumentos adicionais. Criar manifesto-read-link.tsx com href #manifesto-completo e foco preventScroll. Inserir ambos em page.tsx, mantendo ManifestoSignLink como ação secundária e formulário final intacto.
- [x] CSS local em globals.css: corpo Inter 20px/1.75, coluna inicial 68ch, ajustada para 56ch após medição real (707px e linhas cheias 66–73 caracteres), headings Barlow Condensed 800, cores branca/azul e padrões de espaçamento existentes; mobile 18px, títulos longos com wrap, sem altura fixa. CTA leitura amarelo e assinatura branca. Âncora com margem 140px/100px.
- [x] Rodar testes completos, bun run lint, bunx tsc --noEmit, bun run build e git diff --check. Copiar somente env local ignored existente, sem imprimir credenciais, confirmar URL localhost 54321, rodar bun dev --port 3073 (nenhum reset Docker/remoto).
- [x] QA independente via maestri ask QA: conferir texto com GitHub diretamente, frame MCP e todas as seções/elementos/estados em 1440/900/390 e zoom real 200%, âncoras teclado/mouse e regressões Home/feeds/Enviar/assinatura. Registrar capturas, métricas, limitações e diferenças autorizadas do mockup em docs/qa/issue-73-full-manifesto.md.
- [x] Reportar checks, plano, evidências e GO ao Tech lead antes de commit/push; lead conduz commit/PR/merge.

A nova seção textual e o CTA adicional não existem no mockup: adaptação explícita à identidade atual. Não alegar altura total 1:1. Preservar demais textos, arte, header/footer, FormRHF, Turnstile, SEO e backend71. Nenhuma alteração separada em 18/49.
