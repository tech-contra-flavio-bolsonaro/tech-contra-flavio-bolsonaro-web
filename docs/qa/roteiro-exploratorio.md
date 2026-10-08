# Roteiro de QA exploratório da v1

Entrega da [issue #29](https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/29): roteiro e formulários de registro. A execução é uma tarefa separada, após o merge. Este documento não registra testes executados nem certifica a v1.

## Ambiente e preparação

Use a `main` atual, Docker Compose local e os dados fictícios de `supabase/seed.sql`. Registre o SHA com `git rev-parse HEAD` e confira os pré-requisitos de cada caso antes de executá-lo.

```bash
docker compose -f docker-compose.test.yml up --build
docker compose -f docker-compose.test.yml logs --tail=100 app supabase
```

Abra `http://localhost:3000` depois que o serviço Supabase estiver saudável. Veja [o ambiente local no README](../../README.md#ambiente-local-integrado). No PowerShell, se a porta estiver ocupada, defina `$env:APP_PORT = '3001'` antes de subir o Compose e registre a URL escolhida.

Para voltar à base inicial, encerre e recrie somente a stack local:

```bash
docker compose -f docker-compose.test.yml down -v
docker compose -f docker-compose.test.yml up --build
```

O seed tem 11 conteúdos aprovados, um pendente e um rejeitado. Após a pilha de ferramentas #33–#36, tem duas ferramentas aprovadas (uma incorporável), uma pendente e uma rejeitada. As URLs `.example.test` são fictícias: falha de DNS desses destinos não é bug do hub. Para validar carregamento externo real, use uma fixture controlada pela equipe no ambiente local.

Nos casos que alteram dados, confirme primeiro que app, API e banco são locais. Use arquivos e créditos fictícios. Moderação, remoção de registros e mudanças na allowlist são feitas apenas no banco local, conforme [o guia de curadoria](../tool-curation.md).

Produção permite somente smoke de leitura: abrir páginas e links, conferir conteúdo e navegação. Não envie formulários, altere dados, faça testes de falha ou spam, nem abra ações de compartilhamento para contatos reais. Preview depende da [#28](https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/28); não presuma que ele exista ou esteja isolado de produção.

## Matriz obrigatória

| Perfil | Combinações | Como registrar |
|---|---|---|
| Desktop | Windows, Chrome e Firefox; largura de 1280px | Versões do sistema/navegador e viewport |
| Mobile | Safari iOS e Chrome Android; larguras-alvo 360, 390 e 768px | Dispositivo real e viewport efetivo; complementar larguras emuladas |
| Teclado | Desktop, sem mouse, nos dois navegadores | Teclas usadas, ordem e foco observado |
| Leitor de tela | NVDA + Chrome Windows; VoiceOver + Safari iOS | Versões, sequência de gestos/teclas e transcrição dos anúncios |
| Complementar | TalkBack + Chrome Android | Opcional; não substitui os leitores obrigatórios |

Emulação de viewport não comprova funcionamento em Safari/iOS ou Chrome/Android reais. Marque cada evidência como **real** ou **emulada**. Sem dispositivo ou leitor exigido, registre o caso como não executado e a cobertura pendente; não marque como aprovado. Os fluxos mobile, teclado e leitor têm casos próprios abaixo.

## Registro por execução

Copie esta ficha para cada combinação executada. Todos os casos herdam os campos de ambiente e evidência; a coluna de passos informa ações, e a de esperado informa a verificação.

```text
ID do caso / data / pessoa responsável:
Ambiente: local / produção (somente leitura) / preview isolado:
URL e SHA da main ou SHA/data do deploy:
Sistema, navegador, versões, dispositivo e viewport:
Dispositivo real ou emulado / leitor de tela e versão:
Pré-requisitos e dados fictícios usados:
Passos efetivamente executados (incluindo desvios):
Resultado esperado e referência do combinado:
Resultado observado:
Status: aprovado / falhou / bloqueado / não executado:
Evidência: print ou vídeo; console; transcrição dos anúncios:
Issue existente ou nova / motivo do bloqueio:
```

Preserve prints/vídeos, URL, SHA ou data do deploy, navegador/dispositivo e console relevante (ou informe ausência de erros). Em testes de leitor, transcreva os anúncios. Remova dados pessoais, tokens, cookies, credenciais e identificadores privados antes de anexar qualquer evidência. Evidência sem esses metadados não permite concluir cobertura.

## Casos (30)

### Ambiente — AMB

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| AMB-01 | Docker ativo; subir a stack, aguardar saúde do Supabase e abrir `/`. | App responde na porta definida; logs não indicam erro de prontidão/configuração. | Saúde dos serviços, página e logs sanitizados. |
| AMB-02 | Local; executar reset acima e visitar `/conteudos`; repetir o reset. | Base fictícia reaparece sem duplicação: 11 aprovados; pendente/rejeitado não públicos. | Contagem nas duas execuções e registros locais. |

### Inicial — HOME

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| HOME-01 | Seed carregado; abrir `/`, seguir navegação para Manifesto, Ferramentas, Conteúdos e Enviar; voltar ao início. | Destinos existentes abrem, retorno funciona e navegação indica a página ativa. | Sequência de URLs e prints. |
| HOME-02 | Abrir `/`; comparar cards com catálogos completos. | Inicial mostra até quatro itens de cada catálogo; somente aprovados. Com seed, ferramentas dependem da pilha #33–#36. | Cards e comparação com catálogos. |

### Manifesto — MAN

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| MAN-01 | Abrir `/manifesto`; ler títulos, parágrafos e links, também com zoom de 200%. | Conteúdo legível e estrutura compreensível. Texto provisório não é julgado como manifesto final; texto oficial depende da #18. | Página inteira e leitura com zoom. |

### Conteúdos — CONT

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| CONT-01 | Local com seed; abrir `/conteudos`, alcançar o fim e carregar a próxima página. | 11 aprovados no total, dez por página, sem duplicatas; pendente/rejeitado ausentes. | Primeira/segunda página e IDs públicos. |
| CONT-02 | Local; em DevTools, bloquear `/api/conteudos*` e recarregar; remover bloqueio e recarregar. | Erro compreensível, sem falso estado vazio; ao restaurar a rede, feed volta. | Alerta, bloqueio e recuperação. |
| CONT-03 | Local; retirar temporariamente aprovados no banco, abrir catálogo e seguir CTA; depois resetar. | Estado vazio explica ausência e conduz ao envio; sem cards inventados. | Estado vazio e destino do CTA. |
| CONT-04 | Abrir compartilhar em um card; testar copiar link/imagem e abrir destinos, sem enviar mensagens reais. | Comparar com o combinado vigente; consultar #9 antes de reportar, sem duplicá-la ou reclassificá-la. | Ação, conteúdo copiado e contexto de permissões da área de transferência. |

### Envio de conteúdo — ENV

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| ENV-01 | Local; abrir `/enviar`, preencher título/descrição/crédito fictícios e URL de vídeo válida, resolver Turnstile e enviar. | Confirmação, um registro pendente local, nenhum novo item público antes da aprovação. | Formulário, confirmação e status local sem segredos. |
| ENV-02 | Local; enviar vazio, depois preencher textos sem arquivo/link, depois informar URL inválida. | Erros identificam campos e correção; não há persistência dos envios inválidos. | Mensagens e requisições/registros locais. |
| ENV-03 | Local; enviar PNG fictício válido; depois tentar arquivo incompatível ou maior que 25 MB. | Válido fica pendente; inválido recebe rejeição clara e não é publicado/persistido como válido. | Tipo/tamanho, retorno e estado local. |
| ENV-04 | Local; bloquear a chamada `submit-content` durante envio válido; restaurar rede e tentar novamente. | Erro sem falsa confirmação; botão volta a permitir ação e retentativa funciona. | Rede, erro e sucesso após recuperação. |
| ENV-05 | Local; bloquear script Turnstile, recarregar e tentar enviar; restaurar e repetir. | Sem token, não cria submissão; mensagem orienta resolver proteção. Token válido libera o fluxo. | Aviso, rede e persistência. |

### Ferramentas — FERR

Disponível após #33–#36 e respectivas migrations/funções; confirme presença na `main` executada. Sem elas, registre bloqueio por versão, não bug.

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| FERR-01 | Local com seed; abrir `/ferramentas` e detalhes de cada aprovado. | Só dois aprovados; títulos/créditos/URLs corretos, slugs estáveis e links externos visíveis. | Listagem, slugs e destinos (DNS fictício não é falha). |
| FERR-02 | Local; enviar ferramenta válida em `/ferramentas/enviar`; aprovar no banco; abrir catálogo e detalhe; renomear título. | Envio começa pendente/invisível; aprovação publica; slug e link continuam após renomear. | Confirmação, status e URL antes/depois. |
| FERR-03 | Local; tentar título/URL inválidos e envio sem token Turnstile; depois bloquear `submit-tool` durante envio válido. | Inválidos não persistem; falha de rede informa erro, libera nova tentativa e não afirma sucesso. | Mensagens, rede e registros locais. |
| FERR-04 | Local; abrir ferramenta incorporável, inspecionar rede antes/depois da ação; revogar host e recarregar. | Iframe só após ação e allowlist válida; host revogado impede nova abertura. Link externo persiste; fixture DNS não prova carga real. | DOM/rede e fallback após revogação. |
| FERR-05 | Local; obter slugs pendente/rejeitado no banco e visitar; visitar slug inexistente. | Nenhum detalhe ou metadado privado exposto; estado não encontrado e saída navegável. | Três URLs e estados. |
| FERR-06 | Local; bloquear `/api/ferramentas*`, recarregar e restaurar; depois retirar aprovados no banco e resetar ao terminar. | Falha mostra erro e permite recuperação; catálogo sem aprovados tem estado vazio útil, sem confundir vazio com erro. | Erro, recuperação e estado vazio. |

### Funcionalidades futuras — ASS, BLOG, DIR

Esqueletos, sem passos detalhados até a feature ser entregue. **Feature ausente não é bug.** Rotas e critérios finais serão obtidos das issues; não presumir que `/blog` ou `/comunidade` existam.

| ID | Objetivo e dependência | Passos após entrega | Resultado esperado / evidência |
|---|---|---|---|
| ASS-01 | Assinatura: política #19 e implementação [#20](https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/20). | Completar a ficha e os passos de sucesso, inválido e erro a partir do critério aprovado. | Persistência, consentimento e visibilidade conforme política; confirmação e status sem dados pessoais. |
| BLOG-01 | Feed dev.to: [#22](https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/22), origem #21 e navegação #23. | Completar passos de leitura, paginação, vazio e falha da origem. | Autoria/origem preservadas e falha externa tratada; URLs, cards e rede. |
| DIR-01 | Diretório: [#24](https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/24); categorias #25 se entregues. | Completar passos de descoberta, abertura de destinos e estados vazios. | Somente aprovados e destinos corretos; URLs e resultados. |

### Mobile — MOB (ponta a ponta)

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| MOB-01 | Matriz mobile; abrir menu na home, ir ao manifesto, ler, voltar e visitar catálogos. | Menu abre/fecha, links funcionam; texto/cards sem corte ou scroll horizontal indevido nas larguras-alvo. | Vídeo por navegador real e prints das larguras emuladas. |
| MOB-02 | Local; navegar ao envio, preencher com teclado virtual, escolher arquivo e enviar; executar fluxo de ferramenta quando disponível. | Campos, erro, Turnstile e CTA alcançáveis; teclado virtual não impede completar o envio. | Vídeo, orientação e viewport reais. |

### Teclado — TEC (ponta a ponta)

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| TEC-01 | Desktop sem mouse; Tab/Shift+Tab pela navegação e catálogo; abrir compartilhamento, usar ações e fechar com Escape. | Foco visível/ordenado; controles acionáveis; modal não deixa foco escapar e devolve ao acionador ao fechar. | Vídeo com sequência de teclas e foco. |
| TEC-02 | Local sem mouse; navegar até `/enviar`, enviar inválido, corrigir e enviar válido; repetir em ferramentas quando disponível. | Rótulos/erros localizáveis, sem armadilha; confirmação e todos os controles alcançáveis. | Fluxo completo e ordem de foco. |
| TEC-03 | Local com seed; em `/conteudos`, bloquear o scroll automático via DevTools desativando `IntersectionObserver` antes da carga; usar Tab e Enter em Carregar mais. | Alternativa manual acessível carrega a segunda página sem mouse, sem perda de foco ou duplicação. | Teclas, estado da API/DOM e 11 itens finais. |

### Leitor de tela — SR (ponta a ponta)

| ID | Pré-requisito e passos | Resultado esperado | Evidência específica |
|---|---|---|---|
| SR-01 | NVDA+Chrome e VoiceOver+Safari; navegar home → manifesto → catálogo → compartilhar → fechar. | Landmarks/títulos úteis, nomes de controles, estado do modal e retorno ao acionador compreensíveis; decoração não polui leitura. | Transcrição e sequência de navegação de ambos leitores. |
| SR-02 | Local com ambos leitores; preencher envio, provocar erro, corrigir e enviar; ferramenta quando disponível. | Campos têm nomes, obrigatoriedade/erro associados; envio, falha e confirmação anunciados sem depender só de cor. | Transcrição de campos/erros/status e resultado local. |

## Registro e triagem de issues

Antes de abrir, [busque issues abertas com bug ou triagem](https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues?q=is%3Aissue%20is%3Aopen%20label%3Abug%2Ctriagem) e também por palavras do sintoma, incluindo fechadas. Compartilhamento já é acompanhado na [#9](https://github.com/tech-contra-flavio-bolsonaro/tech-contra-flavio-bolsonaro-web/issues/9): acrescente evidência útil à existente, sem abrir duplicata.

Bug confirmado exige duas reproduções com passos escritos na `main` atual, referência do comportamento combinado e ausência de duplicata. Se intermitente ou sem acesso ao ambiente exigido, registre observação/bloqueio na execução; não declare bug confirmado. Não alterar infraestrutura de produção para reproduzir.

Classificação pelos mantenedores com permissão de triagem:

- **bug:** diverge de critério de issue fechada, spec aprovada ou requisito WCAG aplicável. Cite a referência exata. Design ainda em definição não sustenta bug visual.
- **enhancement:** pedido novo, mudança de escopo ou funcionalidade ainda não entregue. Feature ausente não é bug.
- **accessibility:** barreira de acessibilidade confirmada recebe `bug` + `accessibility`, citando requisito e impacto no fluxo.

Os forms `bug.yml` e `melhoria.yml` entram com `triagem`; mantenedores verificam reprodução/duplicata, pedem informação quando faltar e substituem `triagem` por `bug` ou `enhancement`. A label `triagem` deve ser criada no GitHub **após merge, com autorização**, antes de contar com sua aplicação automática. Até lá, um mantenedor identifica manualmente novas issues pendentes. Não aplicar labels de prioridade. Issues em branco seguem habilitadas e passam pela mesma triagem.

Impacto obrigatório no corpo da issue:

| Impacto | Regra |
|---|---|
| Crítico | Exposição de dados ou indisponibilidade generalizada de fluxos essenciais. Evidência pública sempre sanitizada. |
| Alto | Fluxo essencial bloqueado, inclusive por acessibilidade, sem alternativa viável. |
| Médio | Falha parcial com alternativa viável ou limitação a uma combinação da matriz. |
| Baixo | Incômodo pontual com uso preservado. |

Use o form de bug para ambiente, duas reproduções, observado, esperado/referência, impacto, evidência e critério verificável de correção. Use melhoria para problema, proposta, impacto e critério de aceite. Impacto descreve o efeito; não determina automaticamente prioridade.

## Conclusão de uma execução

Consolide casos aprovados/falhos/bloqueados/não executados por combinação da matriz, links das issues e cobertura pendente. Um futuro ainda não entregue fica bloqueado pela issue correspondente. Não conclua que a v1 passou sem executar os fluxos e leitores obrigatórios. A entrega deste roteiro não substitui essa execução.

Referências dos formulários: [sintaxe de issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) e [configuração de templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository).
