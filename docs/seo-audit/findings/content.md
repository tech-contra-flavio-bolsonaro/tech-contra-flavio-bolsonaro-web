# Qualidade do conteúdo e on-page: techcontraflaviobolsonaro.dev ("Vira Voto")

**Qualidade do conteúdo: 30/100 · SEO on-page: 46/100** · Páginas coletadas em 10/10/2026

Só SEO e qualidade de conteúdo. As posições políticas não foram avaliadas.

## Páginas coletadas (19)
- Principais: home (HTML do servidor e renderizado), `/manifesto`, `/ferramentas`, `/blog`, `/conteudos` e `/conteudos/04137a2d-…`.
- Ferramentas (10): o-que-esta-em-jogo-na-sua-cidade, isso-e-bom-ou-ruim, do-seu-bolso, fura-bolha, meu-candidato-2026, super-flavio-world, bora-lula, mapa-do-segundo-turno, diretorio-13 e prensa.
- Fora do sitemap: o post do blog e `/enviar`.
- Testes: `/sobre`, `/contato`, `/privacidade`, `/quem-somos` e `/termos` retornam **404**.

## E-E-A-T (ponderação interna): ~26/100
| Fator | Nota | Base |
|---|---|---|
| Experiência | 35 | Ferramentas originais, alguns autores identificados |
| Especialidade | 25 | Sem autores, credenciais nem métodos |
| Autoridade | 25 | Só perfis sociais e uma organização no dev.to |
| Confiança | 22 | Sem "quem somos", contato, pessoa jurídica ou página de privacidade, mesmo coletando dados de assinatura |

Preparo para citação por IA: 18/100.

A checagem de metadados em modelo (19 páginas) deu risco baixo, com `templated_ratio` 0,0. Títulos e descrições foram escritos à mão.

## Crítica

### C1. Ninguém aparece como responsável pelo site
- Todas as URLs de "quem somos", contato, privacidade e termos retornam 404. Não há e-mail, organizador, organização nem linha de "responsável".
- A identidade vem só dos links sociais e de uma organização no dev.to, com nomes de perfil diferentes: Instagram `techcontrabolsonaro.dev`, X `techcontra_dev`, TikTok/Kwai `techcontraflavio`.
- O manifesto fala apenas como "nós, do setor de tecnologia".
- O formulário de assinatura do manifesto coleta dados pessoais ("Todos os campos são obrigatórios"), com uma frase sobre privacidade e nenhuma página de política.
- **Correção:**
  - Criar `/quem-somos`, com organizadores, contato, financiamento e eventual ligação com partido ou campanha.
  - Criar `/privacidade` segundo a LGPD, com base legal, controlador, prazo de guarda e como pedir exclusão.
  - Pôr no rodapé uma linha dizendo quem é o responsável.
  - Pedir uma revisão jurídica das regras do TSE sobre propaganda eleitoral na internet (exigências de identificação). Não é uma questão de SEO, mas afeta diretamente a confiança.

### C2. Afirmações políticas sem autoria
- A maioria das ferramentas tem o crédito "Iniciativa independente", "Iniciativa voluntária" ou "Eleitor voluntário", inclusive as que fazem afirmações sobre candidatos.
  - mapa-do-segundo-turno: "fatos sobre Flávio e Lula (Banco Master, escala 6x1, Pix, milícia…)".
  - super-flavio-world: "a ficha de Flávio".
- Só algumas citam uma pessoa (Miro Medeiros, arthruur, Matheus C. Pestana).
- **Correção:** em cada página de ferramenta, informar o responsável e um contato, as fontes de dados, a data da última checagem e como relatar um erro.

## Alta
- **H1. As páginas de ferramenta são só passagens para outro site.**
  - Têm de 48 a 69 palavras cada: uma frase (igual à meta description), uma linha de crédito e "Esta ferramenta é usada no site de origem. Abrir no site de origem (nova aba)".
  - Cerca de 28 páginas indexáveis acrescentam quase nada além do link de saída.
  - **Correção:** escrever 300 palavras ou mais de conteúdo próprio por página (o que faz, para quem é, como usar, fontes e metodologia, data de atualização, captura de tela), ou aplicar `noindex` a elas.
- **H2. As páginas de listagem dependem de JavaScript.**
  - HTML do servidor: home com 116 palavras (226 renderizada), `/ferramentas` com 34 e `/conteudos` com 22 ("ACERVO / CARREGANDO").
  - O primeiro H1 de `/blog` é `Carregando artigos…`.
  - **Correção:** renderizar as listas no servidor.
- **H3. Blog fora do tema.**
  - O único post, "Revisão rápida de condicionais em JS", de Pachi (dev.to, 26/02/2025), tem 264 palavras sobre `if`/`switch` em JS.
  - Aparece na home em "HISTÓRIAS DA COMUNIDADE".
  - **Correção:** filtrar o feed do dev.to por tag (por exemplo `#viravoto`, `#eleicoes2026`) ou esconder a seção.
- **H4. Nome e posicionamento inconsistentes.**
  - O título da home é "Vira Voto – Tech Contra Bolsonaro" e as páginas internas usam "| Vira Voto". O domínio é "techcontraflaviobolsonaro".
  - O H2 do manifesto é "TRABALHADORES DE TECNOLOGIA CONTRA FLÁVIO BOLSONARO, VOTO CRÍTICO EM LULA 13", e o texto nunca cita "Vira Voto".
  - O H1 da home, "IDEIAS GANHAM MOVIMENTO.", não diz o que o site é.
  - **Correção:** escolher uma marca principal, explicar a relação com os outros nomes na página "quem somos" e usá-la nos títulos, no og:site_name e no rodapé. Reescrever o H1 e a introdução para dizer claramente o que o site é.
- **H5. O item de `/conteudos` é raso e a imagem expira.**
  - Tem 17 palavras: "Passagem pra grupo", "Imagem com passagem bíblica pra grupos de whatsapp" e o crédito "Tech group".
  - A imagem é uma URL assinada do Supabase em `community-submissions/pending/`, que expira cerca de 15 minutos depois que a página é servida.
  - **Correção:** servir a mídia aprovada a partir de uma URL pública estável, usar slugs no lugar de UUIDs, acrescentar texto de contexto e aplicar `noindex` aos itens sem texto.

## Média
- **M1. Os títulos não correspondem às buscas.** "Prensa | Vira Voto", "Fura Bolha", "Bora Lula", "Diretório 13". Usar "Nome: palavras-chave descritivas | Vira Voto", por exemplo "Do Seu Bolso: calculadora de economia com a Farmácia Popular | Vira Voto", e repetir a frase no H1 ou num subtítulo.
- **M2. Legibilidade do manifesto.**
  - O corpo tem cerca de 1.000 palavras. O índice Flesch (adaptação de Martins para o português) fica em torno de 27, ou seja, muito difícil.
  - As frases têm em média 26 palavras; cinco passam de 40 e a mais longa tem 69.
  - O vocabulário é denso ("reprimarização", "divisão internacional do trabalho").
  - **Correção:** acrescentar um resumo, dividir as frases longas e usar um H3 por reivindicação.
- **M3. O manifesto não mostra atualidade nem credibilidade.** Não tem data, número de assinaturas nem signatários, embora cite o resultado do primeiro turno. Acrescentar data, número de assinaturas e signatários ou organizações, com consentimento.
- **M4. Não há dados estruturados.** Veja `schema.md`.
- **M5. Metadados de compartilhamento.** As páginas de ferramenta usam `og:type=article`, não têm og:image e o og:title não traz a marca.
- **M6. `/enviar`.** Tem título genérico, não tem canônica e não está no sitemap.

## Baixa
- **L1.** A meta description da home não cita a eleição, 2026 nem o segundo turno.
- **L2.** O texto em CAIXA ALTA deveria vir do CSS, não do texto-fonte.
- **L3.** Há descrições com mais de 160 caracteres (o-que-esta-em-jogo-na-sua-cidade, prensa). Encurtar para cerca de 155.
- **L4.** Não há links entre as ferramentas. Acrescentar "ferramentas relacionadas" e links para os hubs de categoria.

## O que funciona
- Títulos e descrições únicos, escritos à mão.
- `lang="pt-BR"`, `index,follow` e canônicas próprias.
- A canônica do blog para o dev.to evita duplicidade.
- Algumas ferramentas citam fontes primárias ("link para o documento original", "trecho do plano registrado no TSE"). Vale mostrar isso na própria página.
