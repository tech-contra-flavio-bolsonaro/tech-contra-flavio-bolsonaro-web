# Experiência de busca (SXO): techcontraflaviobolsonaro.dev

**Nota de lacuna SXO: 17/100 no modelo de página de ferramenta** (separada da nota de saúde de SEO) · 10/10/2026

## Principal achado: toda página de ferramenta é só uma passagem para outro site
Seis páginas de ferramenta foram renderizadas (`render_page.py --mode always`): meu-candidato-2026, do-seu-bolso, mapa-do-segundo-turno, voto-la-fora, o-que-esta-em-jogo-na-sua-cidade e em-frente-calendario-de-protestos.

Todas seguem o mesmo modelo:
- o H1 com o nome da ferramenta
- "Crédito: X"
- uma frase que repete a meta description
- "Esta ferramenta é usada no site de origem" e um link externo

Cada página tem de 50 a 72 palavras, sem H2/H3, JSON-LD ou og:image. A ferramenta em si não está na página. Em todas as buscas testadas, o Google mostra matérias explicativas, listas ou jornalismo de dados.

**Descoberta:**
- Na renderização do agente, a home ainda mostrava "Carregando ferramentas…", com 0 links de ferramenta, e `/ferramentas` tinha 2.
- A auditoria visual esperou mais e viu as 29 ferramentas carregarem. Ou seja, a lista funciona, mas depende de uma busca lenta no cliente.
- O `htmldate` lê 01/11/2024 em todas as páginas, uma data padrão desatualizada.
- A busca pela marca não encontrou presença indexada.

**Prazo:** o segundo turno é em **25/10/2026**, 15 dias depois desta auditoria. Páginas reescritas podem não ser rastreadas e ranqueadas antes da votação. Priorizar o rastreamento e, em seguida, as ferramentas que continuam úteis depois da eleição.

## Descompasso de tipo de página por ferramenta
| Ferramenta | Busca provável | O que o Google ranqueia | Gravidade |
|---|---|---|---|
| meu-candidato-2026 | "propostas Lula e Flávio", "comparar planos de governo 2026" | Matérias comparativas e explicativas (Gazeta SP, abcdoabc, Congresso em Foco, O Liberal) | Crítica |
| do-seu-bolso | "lista remédios grátis Farmácia Popular 2026" | Listas (meutudo, Estado de Minas, Diário do Pará): 41 itens, documentos, como retirar | Crítica |
| mapa-do-segundo-turno | "mapa segundo turno 2026" | Mapas de resultados por município (O POVO+) e matérias sobre a data. A ferramenta são páginas de fatos, então o nome atrai a intenção errada | Crítica (nome) |
| voto-la-fora | "votar no exterior segundo turno 2026" | Matérias explicativas (Metrópoles, InvestNews, A Crítica), TSE, consulados | Alta (a ferramenta atende uma necessidade vizinha: carona e hospedagem) |
| em-frente-calendario-de-protestos | "agenda de atos 2026", "calendário de manifestações" | Nenhum calendário brasileiro ranqueia (resultados de Bogotá e do México, uma matéria do Metrópoles de 2021) | Descompasso alto, mas é o espaço mais livre |
| o-que-esta-em-jogo-na-sua-cidade | "serviços federais por município/CEP" | PDFs acadêmicos e de prefeituras | Demanda baixa |

## Dimensões SXO (modelo)
| Dimensão | Nota |
|---|---|
| Tipo de página | 3/15 |
| Profundidade | 1/15 |
| UX | 5/15 |
| Schema | 0/15 |
| Mídia | 2/15 |
| Autoridade | 4/15 |
| Atualidade | 2/10 |

## Personas (da mais fraca para a mais forte)
1. **Jornalista/pesquisador: 25.** Não há metodologia, fontes, data nem um resumo citável. Acrescentar "Metodologia e fontes", data e contato do responsável.
2. **Usuário da Farmácia Popular: 30.** Acrescentar um H2 com a lista dos 41 itens, os documentos necessários e os valores mensais calculados pela ferramenta, em texto.
3. **Eleitor indeciso: 35.** Um comparador num site com lado político claro precisa de transparência:
   - quem fez a ferramenta e como os temas foram escolhidos
   - links para os planos registrados no TSE
   - os 12 temas em texto na página

   Isso vale para qualquer comparação hospedada num site com lado político.
4. **Eleitor no exterior: 46.**
   - Acrescentar perguntas frequentes curtas: só se vota para presidente e vice, nos consulados, no horário local, e como achar a seção no site do TSE.
   - Depois, explicar a função de carona e hospedagem e as regras de privacidade (dados apagados até 15/11/2026).
5. **Ativista/voluntário: 63.** Acrescentar passos de como usar e uma imagem de compartilhamento por ferramenta.

## Correções
1. **P0:** renderizar a lista de ferramentas no servidor, acrescentar `lastmod`, corrigir os metadados de data e pedir indexação no Search Console.
2. **P0:** reescrever 2 ou 3 ferramentas duradouras (Do Seu Bolso, Voto Lá Fora, calendário de protestos) como páginas híbridas, com 500 a 900 palavras:
   - resposta de ~40 palavras
   - a ferramenta incorporada ou uma captura de tela
   - "Como usar" em 3 passos
   - fatos com fontes
   - perguntas frequentes curtas
   - crédito e metodologia
   - chamada para o site de origem
3. **P1:** aplicar `noindex` às cerca de 20 páginas rasas restantes, ou juntá-las numa página `/ferramentas` forte, com descrições por categoria renderizadas no servidor.
4. **P1, schema:**
   - WebApplication em cada ferramenta (`isBasedOn` apontando para a origem).
   - Itens `Event` no calendário de protestos, se os eventos estiverem na página. É a melhor chance de resultado enriquecido.
   - BreadcrumbList.
5. **P1:** renomear ou reposicionar mapa-do-segundo-turno, por exemplo "Fatos com fonte sobre Lula e Flávio: o que cada um fez".
6. **P2:** imagem de compartilhamento (og:image) por ferramenta.

## Limites
- A busca na web retorna resumos, sem "As pessoas também perguntam", AI Overview ou posições.
- Não há dados de volume de busca.
- Os sites externos das ferramentas não foram avaliados.
- As notas valem para o modelo de página, não para cada página.
- Os resultados refletem 10/10/2026.

## Fontes
- https://www.gazetasp.com.br/politica/eleicoes-2026-compare-as-propostas-de-governo-de-flavio-bolsonaro-e-lula-para-os-proximos-quatro-anos/
- https://abcdoabc.com.br/eleicoes-2026-saiba-planos-governo-lula-flavio
- https://www.congressoemfoco.com.br/artigo/119689/propostas-economicas-e-fiscais-dos-principais-candidatos-de-2026
- https://www.oliberal.com/politica/documentadas-no-tse-as-propostas-dos-postulantes-ao-palacio-do-planalto-1.1176773
- https://meutudo.com.br/blog/lista-remedios-farmacia-popular-2025/
- https://www.em.com.br/emfoco/2026/08/04/farmacia-popular-entrega-41-medicamentos-e-itens-de-graca-para-toda-a-populacao-veja-o-que-levar/
- https://diariodopara.com.br/seu-bolso/farmacia-popular-veja-lista-de-remedios-de-graca-como-retirar-e-tudo-mais/
- https://www.metropoles.com/mundo/voto-brasileiros-exterior-eleicoes-2026
- https://investnews.com.br/economia/voto-no-exterior/amp/
- https://acritica.net/eleicoes-2026/quase-1-milhao-de-brasileiros-no-exterior-poderao-votar-nas-eleicoes-de-2026/
- https://mais.opovo.com.br/reportagens-especiais/resultado-presidente-eleicoes-2026/2026/10/05/com-flavio-e-lula-no-2-turno-mapa-mostra-votos-absolutos-para-presidente-por-municipio.html
- https://www.band.com.br/politica/eleicoes/2026/quando-e-o-segundo-turno-das-eleicoes-2026-202607211852
