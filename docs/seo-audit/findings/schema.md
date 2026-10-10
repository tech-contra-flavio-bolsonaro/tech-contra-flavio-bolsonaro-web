# Auditoria de schema: techcontraflaviobolsonaro.dev (10/10/2026)

Detecção: 9 URLs coletadas (home, /manifesto, /ferramentas, /blog, 1 post do blog, /conteudos/04137a2d-... e 3 ferramentas). Todas retornaram HTTP 200, com HTML bruto. Nenhuma página tem JSON-LD, microdata (itemscope) ou RDFa. Nota: 12/100.

URLs sociais do rodapé (reais): instagram https://www.instagram.com/techcontrabolsonaro.dev ; x https://x.com/techcontra_dev ; tiktok https://www.tiktok.com/@techcontraflavio ; kwai https://k.kwai.com/u/@techcontraflavio/BUOCAPC4

## Home (Organization + WebSite)
```json
{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"https://techcontraflaviobolsonaro.dev/#organization","name":"Tech Contra Bolsonaro","alternateName":"Vira Voto","url":"https://techcontraflaviobolsonaro.dev/","logo":{"@type":"ImageObject","url":"https://techcontraflaviobolsonaro.dev/apple-icon.png","width":180,"height":180},"sameAs":["https://www.instagram.com/techcontrabolsonaro.dev","https://x.com/techcontra_dev","https://www.tiktok.com/@techcontraflavio","https://k.kwai.com/u/@techcontraflavio/BUOCAPC4"]},
{"@type":"WebSite","@id":"https://techcontraflaviobolsonaro.dev/#website","url":"https://techcontraflaviobolsonaro.dev/","name":"Vira Voto","alternateName":"Vira Voto – Tech Contra Bolsonaro","description":"Vira Voto reúne ferramentas, conteúdos e referências para transformar ideias em ação coletiva.","inLanguage":"pt-BR","publisher":{"@id":"https://techcontraflaviobolsonaro.dev/#organization"}}]}
```
Não acrescentar SearchAction: o site não tem busca interna, e a caixa de busca de sitelinks foi descontinuada.

## /ferramentas (CollectionPage + ItemList + Breadcrumb)
```json
{"@context":"https://schema.org","@graph":[
{"@type":"CollectionPage","@id":"https://techcontraflaviobolsonaro.dev/ferramentas#page","url":"https://techcontraflaviobolsonaro.dev/ferramentas","name":"Ferramentas","description":"Explore ferramentas da comunidade para planejar, criar e colocar ideias em movimento.","inLanguage":"pt-BR","isPartOf":{"@id":"https://techcontraflaviobolsonaro.dev/#website"},"mainEntity":{"@type":"ItemList","itemListElement":[
{"@type":"ListItem","position":1,"url":"https://techcontraflaviobolsonaro.dev/ferramentas/meu-candidato-2026","name":"Meu Candidato 2026"},
{"@type":"ListItem","position":2,"url":"https://techcontraflaviobolsonaro.dev/ferramentas/do-seu-bolso","name":"Do Seu Bolso"},
{"@type":"ListItem","position":3,"url":"https://techcontraflaviobolsonaro.dev/ferramentas/fura-bolha","name":"Fura Bolha"}]}},
{"@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Início","item":"https://techcontraflaviobolsonaro.dev/"},
{"@type":"ListItem","position":2,"name":"Ferramentas"}]}]}
```
(Gerar o ItemList a partir da mesma fonte de dados que renderiza os cards das ferramentas.)

## Página de ferramenta (exemplo: meu-candidato-2026; repetir em cada ferramenta)
O resultado enriquecido de SoftwareApplication exige offers ou avaliações. Mesmo sem ele, a marcação WebApplication é válida e ajuda a deixar a entidade clara. Não inventar avaliações.
```json
{"@context":"https://schema.org","@graph":[
{"@type":"WebApplication","@id":"https://techcontraflaviobolsonaro.dev/ferramentas/meu-candidato-2026#app","name":"Meu Candidato 2026","url":"https://techcontraflaviobolsonaro.dev/ferramentas/meu-candidato-2026","description":"Compara as propostas de Lula e Flávio em 12 temas, com resumo simples e link para o documento original de cada proposta.","applicationCategory":"UtilitiesApplication","operatingSystem":"Any","browserRequirements":"Requires JavaScript","inLanguage":"pt-BR","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"BRL"},"publisher":{"@id":"https://techcontraflaviobolsonaro.dev/#organization"}},
{"@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Início","item":"https://techcontraflaviobolsonaro.dev/"},
{"@type":"ListItem","position":2,"name":"Ferramentas","item":"https://techcontraflaviobolsonaro.dev/ferramentas"},
{"@type":"ListItem","position":3,"name":"Meu Candidato 2026"}]}]}
```
Valores por ferramenta (nome e descrição tirados da meta):
- do-seu-bolso: "Calculadora: marque os remédios que você pega de graça na Farmácia Popular e veja quanto custariam por mês, por ano e em quatro anos." (applicationCategory: FinanceApplication ou UtilitiesApplication)
- fura-bolha: "Vídeos da eleição com resumo e transcrição, ordenados pelo que mais circula, com botão para baixar ou mandar no WhatsApp." (applicationCategory: NewsApplication / MultimediaApplication)

## Post do blog (BlogPosting)
Observação: a canônica do post é https://dev.to/techcontrabolsonaro/... (post republicado), enquanto o og:url é a URL local. Há duas opções: manter a canônica no dev.to, e aí o BlogPosting aqui ajuda pouco no ranqueamento, ou usar canônica própria. O mainEntityOfPage deve bater com a canônica escolhida.
```json
{"@context":"https://schema.org","@graph":[
{"@type":"BlogPosting","headline":"Revisão rápida de condicionais em JS","description":"Oi pessoas 👋🏼 Fazia um tempo que eu não usava JavaScript então fui fazer uma revisão básica...","datePublished":"2025-02-26T13:32:30Z","dateModified":"2025-02-26T13:32:30Z","inLanguage":"pt-BR","author":{"@type":"Person","name":"Pachi"},"publisher":{"@id":"https://techcontraflaviobolsonaro.dev/#organization"},"mainEntityOfPage":"https://techcontraflaviobolsonaro.dev/blog/2299146/revisao-rapida-de-condicionais-em-js-5emd","image":["https://techcontraflaviobolsonaro.dev/opengraph-image.png"]},
{"@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Início","item":"https://techcontraflaviobolsonaro.dev/"},
{"@type":"ListItem","position":2,"name":"Blog","item":"https://techcontraflaviobolsonaro.dev/blog"},
{"@type":"ListItem","position":3,"name":"Revisão rápida de condicionais em JS"}]}]}
```
No HTML, a autora aparece como "Pachi 🥑 (she/her)". Usar só o nome ou confirmar com ela. Trocar a imagem pela capa do post, se houver. Índice /blog: CollectionPage/Blog + Breadcrumb (Início > Blog).

## /conteudos/{id} (CreativeWork do tipo ImageObject)
```json
{"@context":"https://schema.org","@graph":[
{"@type":"ImageObject","@id":"https://techcontraflaviobolsonaro.dev/conteudos/04137a2d-76c8-4a10-9880-2ea373b9cac5#content","name":"Passagem pra grupo","description":"Imagem com passagem bíblica pra grupos de whatsapp","inLanguage":"pt-BR","contentUrl":"<STABLE public image URL>","url":"https://techcontraflaviobolsonaro.dev/conteudos/04137a2d-76c8-4a10-9880-2ea373b9cac5","isPartOf":{"@id":"https://techcontraflaviobolsonaro.dev/#website"},"publisher":{"@id":"https://techcontraflaviobolsonaro.dev/#organization"}},
{"@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Início","item":"https://techcontraflaviobolsonaro.dev/"},
{"@type":"ListItem","position":2,"name":"Conteúdos"},
{"@type":"ListItem","position":3,"name":"Passagem pra grupo"}]}]}
```
Substituir o contentUrl provisório antes de publicar (veja o achado abaixo). Acrescentar datePublished quando houver.

## /manifesto
WebPage (ou AboutPage) + Breadcrumb (Início > Manifesto), isPartOf WebSite, publisher Organization, inLanguage pt-BR.

## Achados
| Prioridade | Achado | Correção |
|---|---|---|
| Crítica | Nenhum dado estruturado no site | Injetar o JSON-LD no servidor (rota de metadados do Next.js ou `<script type="application/ld+json">` no layout ou na página; escapar `<` como `\u003c`) |
| Alta | Não há entidade Organization/WebSite; faltam logo e sameAs | Trecho da home acima |
| Alta | Nenhuma página interna tem BreadcrumbList | Trechos por página |
| Média | A canônica do blog aponta para o dev.to e o og:url é local | Definir a canônica e alinhar o mainEntityOfPage |
| Média | As páginas de ferramenta não têm WebApplication e /ferramentas não tem ItemList | Trechos acima |
| Média | A imagem de /conteudos é uma URL assinada do Supabase, em `pending/`, que expira | Não referenciar no schema; servir de uma URL pública estável |
| Baixa | Só a home tem og:image; as páginas de ferramenta também não têm imagem para o X | Imagem por página, que também alimenta o `image` do schema |
| Baixa | As páginas de ferramenta usam og:type article | Usar website |
| Info | Escolha do logo: existe /images/home-pixel-logo.svg, mas o logo deve ter pelo menos 112 px, de preferência em bitmap | Usar um PNG |
Não recomendado: HowTo, FAQPage, SpecialAnnouncement e marcação de candidato/Person. Evitar Review/AggregateRating, porque não há avaliações reais.
