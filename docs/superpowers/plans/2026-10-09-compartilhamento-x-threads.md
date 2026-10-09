# Plano — compartilhamento no X e no Threads

## Objetivo

Adicionar ações de compartilhamento no X e no Threads ao diálogo comum usado pelos cartões de conteúdo, com ícones reconhecíveis das plataformas, URLs codificadas e um endereço permanente para cada conteúdo aprovado.

## Contexto verificado

- O diálogo compartilhado está em `app/components/share-button.tsx` e é usado tanto no feed `/conteudos` quanto na seção de conteúdos da Home.
- Os cartões recebem um `id` estável da tabela `submissions`, mas ainda não há rota individual para conteúdo. Quando falta `video_url`, os chamadores usam `window.location.href`, que pode apontar para a página errada e não identifica o item selecionado.
- A tabela `submissions` contém conteúdo pendente, aprovado e rejeitado. A consulta pública de detalhe deve filtrar por `status = approved`, como o feed atual.
- A documentação oficial atual do Threads define `https://www.threads.com/intent/post`, com parâmetros `text` e `url` codificados. A documentação legada oficial do botão do X redireciona para a página geral de desenvolvedores; será usado o fluxo Web Intent de publicação (`https://twitter.com/intent/tweet`), que redireciona para X, com `text` e `url`.
- Referências: [Threads Web Intents](https://developers.facebook.com/documentation/threads/threads-web-intents), [documentação de Web Intent do X/Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent).

## Decisões de implementação

- Criar a rota `/conteudos/[id]` como permalink canônico para cada conteúdo aprovado. A página revalida a publicação no servidor e retorna 404 para IDs inválidos, não encontrados ou não aprovados.
- Reutilizar o UUID do conteúdo para gerar o permalink em ambos os pontos de compartilhamento, sem expor URLs assinadas de mídia como links canônicos.
- O diálogo abre o compositor da plataforma em outra aba, com título e texto disponível separados do link. A pessoa pode revisar e confirmar a publicação na plataforma; o app não publica diretamente.
- Substituir os símbolos genéricos do WhatsApp e Instagram e adicionar símbolos reconhecíveis do X e Threads, mantendo os ícones decorativos fora do nome acessível dos controles.
- Preservar o compartilhamento nativo de arquivos, cópia, Instagram, WhatsApp e o layout existente do diálogo.

## Tarefas

- [x] Inspecionar o componente, chamadores, testes, dados de conteúdo e documentação de compartilhamento.
- [x] Implementar a leitura server-side de conteúdo aprovado e a página de permalink com metadados canônicos.
- [x] Atualizar os cartões da Home e do feed para compartilhar o permalink correto do item.
- [x] Implementar as ações X e Threads com parâmetros codificados e ícones de plataforma; revisar também WhatsApp e Instagram.
- [x] Cobrir URLs, texto com acentos/caracteres especiais, acessibilidade, conteúdo não aprovado e preservação das ações atuais nos testes.
- [x] Validar lint, testes focados, TypeScript, build e `git diff --check`.
- [ ] Conferir layout/interação em desktop, tablet e mobile e obter o GO de QA independente via Maestri.
- [ ] Solicitar QA independente via Maestri antes de qualquer criação/atualização de pull request.

## Critérios de aceite

- X e Threads aparecem nas duas superfícies que reutilizam o diálogo de compartilhamento.
- Cada ação abre o compositor certo com o título/texto disponível e permalink canônico do item selecionado.
- Acentos, espaços e caracteres especiais são preservados por codificação de URL.
- Cada plataforma tem seu próprio símbolo reconhecível e os ícones não duplicam o nome acessível.
- WhatsApp, Instagram, copiar e compartilhamento nativo permanecem funcionais.
- A rota individual serve somente conteúdos aprovados, com layout utilizável e responsivo.
- Botões/links funcionam por teclado e mantêm foco visível; não há cortes ou sobreposição.

## Resultado até aqui

- Testes focados: 19/19 passaram.
- Suíte completa: 144/146 passaram. As duas falhas restantes são em `app/manifesto/page.test.tsx` (texto integral e navegação por âncora), fora do escopo alterado.
- Lint, TypeScript, build e `git diff --check`: passaram.
- QA visual no navegador e revisão independente Maestri ainda pendentes.
