# Vira Voto — Hub comunitário

## Objetivo

Criar uma página inicial editorial e acessível que concentre o manifesto do movimento, ferramentas de mobilização e conteúdos prontos para compartilhar. A interface deve ter personalidade digital e acolhedora, inspirada na energia popular da referência fornecida, sem copiar marca ou layout.

## Direção visual aprovada

- Paleta 60/30/10: lavanda clara como base, superfícies creme e pastéis como apoio e vermelho coral exclusivamente em ações, indicadores e palavras-chave.
- Tipografia de alto contraste: sans geométrica e pesada para mensagens de ação; serifada editorial para textos de manifesto.
- Layout espaçoso, responsivo e com poucas seções, priorizando leitura e descoberta rápida.
- Animação discreta e respeitosa a `prefers-reduced-motion`.

## Escopo da primeira versão

### Navegação e hero

Cabeçalho compacto com âncoras para Manifesto, Ferramentas e Conteúdos. O hero apresenta a proposta do hub e um CTA que conduz às ferramentas, sem carrosséis ou blocos promocionais extras.

### Manifesto

Uma seção curta de leitura editorial: tese, convite à participação e uma assinatura visual. O conteúdo é estático nesta etapa, mas isolado como dado para futura edição no Supabase.

### Ferramentas

Lista de cartões com nome, resumo, categoria e ação. Cada item declara um modo de acesso:

- `embed`: abre a ferramenta dentro do site em iframe, com título acessível, sandbox restritivo quando compatível e link alternativo para abrir em nova aba.
- `external`: abre a URL de origem em nova aba e explica por que não é incorporada.

O iframe não será carregado até que a pessoa escolha abrir a ferramenta, reduzindo rastreamento, custo e tempo de carregamento.

### Conteúdos

Grade de cartões compartilháveis para imagens e vídeos. Cada conteúdo possui título, formato, descrição, crédito, tags, data e URL de origem. Imagens usam URLs do Storage; vídeos, nesta primeira fase, são URLs incorporáveis de YouTube ou Vimeo. O compartilhamento oferece link direto da página; a implementação pode acrescentar Web Share API quando disponível.

### Envio comunitário

Uma chamada para envio sinaliza o fluxo de curadoria. Não haverá upload público nesta primeira entrega, pois o envio requer políticas de acesso, termos e moderação.

## Dados e evolução Supabase

A UI consome interfaces de domínio e dados de demonstração locais para permitir o lançamento visual sem credenciais. Ao conectar o Supabase, o adaptador trocará a origem dos dados sem mudar os componentes.

Tabelas previstas:

- `tools`: `id`, `title`, `description`, `category`, `access_mode`, `url`, `embed_url`, `is_published`, `sort_order`.
- `contents`: `id`, `title`, `description`, `kind`, `media_url`, `source_url`, `embed_url`, `credit`, `tags`, `published_at`, `is_published`.
- `submissions` (etapa posterior): os campos do conteúdo, `submitted_by`, `status`, `reviewed_at` e `reviewed_by`.

Os arquivos publicados serão armazenados em bucket público de somente leitura para visitantes; uploads usarão bucket privado e uma rota autenticada. A aprovação copiará ou promoverá a referência para o conteúdo publicado. Políticas Row Level Security impedirão leitura de rascunhos e escrita anônima fora do fluxo controlado.

## Segurança e acessibilidade

- Sem chaves do Supabase no navegador além da chave pública necessária para leituras permitidas por RLS.
- URLs externas validadas no servidor e permitidas apenas para provedores incorporáveis definidos.
- Iframes com `title`, carregamento adiado e fallback de link.
- Contraste adequado, foco visível, navegação por teclado e estrutura semântica.
- Imagens decorativas omitidas da árvore de acessibilidade; imagens informativas recebem texto alternativo.

## Verificação

- Typecheck/lint e build de produção.
- Verificação manual desktop e mobile.
- Conferir âncoras, foco, fallback de iframe e aparência com movimento reduzido.
- Ao ligar Supabase: validar RLS e provar que conteúdo não publicado não é retornado a visitantes.

## Fora de escopo

- Login, painel administrativo e envio de mídia público nesta entrega.
- Hospedagem de vídeo próprio.
- Migração de acervo de Drive ou Dropbox.
