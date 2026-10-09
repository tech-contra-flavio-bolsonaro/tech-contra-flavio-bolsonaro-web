-- Initial tool catalog (issue #25). Every site was opened and checked online on 2026-10-09.
-- Rows enter approved; the slug comes from the title through assign_tool_slug.
-- Idempotent: skips a tool whose URL already exists, including one sent through the submission form.

insert into public.tool_submissions (title, description, category, credit, url, status, reviewed_at)
select v.title, v.description, v.category, v.credit, v.url, 'approved', now()
from (values
  -- Mapa da virada
  ('Virada no Bairro',
   'Mostra, por estado, cidade e bairro, quantas pessoas não escolheram ninguém no 1º turno e quantos votos dá para garantir em cada lugar (6% de quem não votou, votou branco ou nulo). Dados do TSE por seção.',
   'Mapa da virada', 'Iniciativa independente (@viravoto)', 'https://viradanobairro.app/'),
  ('Votos para vencer por local de votação',
   'Escolha estado, município e o seu local de votação e veja quantos votos novos fazem Lula passar Flávio ali, comparando o 2º turno de 2022 com o 1º turno de 2026. Dados abertos do TSE.',
   'Mapa da virada', 'tatipara', 'https://tatipara.github.io/vira_voto/'),
  ('Onde dá pra conversar',
   'Mapa dos lugares de votação perto de você onde brancos, nulos e abstenções já bastariam para virar, com o que fazer e como puxar a conversa.',
   'Mapa da virada', 'Matheus C. Pestana (@ondedapraconversar)', 'https://www.ondedapraconversar.com.br/'),
  ('Dá pra Virar',
   'Página de cada uma das 5.571 cidades com quantos não votaram e o que cada pessoa pode fazer, de pessoa para pessoa: escolher três nomes e saber o que dizer a cada um.',
   'Mapa da virada', 'Iniciativa individual (@dapravirar)', 'https://dapravirar.vercel.app/'),
  ('Caça ao Voto',
   'Mapa dos municípios onde a disputa ficou apertada no 1º turno e onde a abstenção subiu em relação a 2022, para decidir onde vale concentrar esforço.',
   'Mapa da virada', 'Comunidade Tech contra Flávio Bolsonaro', 'https://radardavirada.pages.dev/mapa'),
  ('Mapa do Duplas',
   'Para o porta a porta na Paraíba, em Pernambuco e na Bahia: cada local de votação com o que fazer em volta, quem procurar e o roteiro da conversa.',
   'Mapa da virada', 'Iniciativa independente', 'https://mapa-duplas.vercel.app/'),

  -- Argumento com fonte
  ('Brasil em Jogo',
   'O programa de governo de Flávio tema por tema, os governos Lula e Bolsonaro e os números, cada ponto com o documento de origem.',
   'Argumento com fonte', 'Iniciativa independente', 'https://obrasilemjogo.com.br/'),
  ('Mapa do Segundo Turno',
   'Páginas temáticas com fatos sobre Flávio e Lula (Banco Master, escala 6x1, Pix, milícia e outros), cada afirmação com fonte e imagem pronta para stories.',
   'Argumento com fonte', 'Miro Medeiros', 'https://mapasegundoturno.com.br/resumo'),
  ('Meu Candidato 2026',
   'Compara as propostas de Lula e Flávio em 12 temas, com resumo simples e link para o documento original de cada proposta.',
   'Argumento com fonte', 'Iniciativa independente', 'https://meucandidato2026.com.br/'),
  ('Quem compara vota Lula',
   'Cards e dados de bolso tirados dos guias comparativos, separados por tema, com botão para baixar ou mandar no WhatsApp.',
   'Argumento com fonte', 'Iniciativa voluntária', 'https://quemcomparavotalula13.netlify.app/'),
  ('O Brasil mudou?',
   'Compara indicadores dos governos Bolsonaro e Lula III em 22 temas, de emprego a meio ambiente, com as fontes de cada número.',
   'Argumento com fonte', 'Iniciativa independente', 'https://nadamudou.com.br/'),
  ('Do Seu Bolso',
   'Calculadora: marque os remédios que você pega de graça na Farmácia Popular e veja quanto custariam por mês, por ano e em quatro anos.',
   'Argumento com fonte', 'Iniciativa independente', 'https://doseubolso.com.br/'),
  ('Ideias em Comum',
   'Para quem votou em Cury, Renan ou Caiado no 1º turno: mostra, tema por tema, onde as propostas do seu candidato e as de Lula coincidem, com o trecho do plano registrado no TSE.',
   'Argumento com fonte', 'Eleitor voluntário', 'https://ideiasemcomum.com/'),
  ('O que está em jogo na sua cidade',
   'Digite a cidade ou o CEP e veja no mapa os serviços do seu município que dependem de programas federais (unidades do SUS, CRAS, agências da Caixa e do BB), cada um com a reportagem que mostra o risco.',
   'Argumento com fonte', 'Iniciativa independente', 'https://oqueestaemjogo.ascaribe.tech/'),

  -- Organização e rua
  ('Brigadas do vira-voto',
   'Ache um grupo de rua ou digital da sua cidade para conversar com quem não escolheu ninguém no 1º turno, ou cadastre o seu.',
   'Organização e rua', 'Virada no Bairro', 'https://viradanobairro.app/brigadas'),
  ('Em Frente: calendário de protestos',
   'Agenda de atos com mapa, rota no Google Maps ou Waze e botão para salvar na agenda do celular. Qualquer pessoa pode anunciar um ato, que entra após aprovação.',
   'Organização e rua', 'Em Frente', 'https://em-frente.com/calendario'),
  ('Fandoms pelo Brasil',
   'Agenda da Marcha pela Democracia com os atos de fandoms nas cidades, gerador de post e kit de divulgação.',
   'Organização e rua', 'Fandoms pelo Brasil (@fandomspelobr)', 'https://fandomspelobrasil.com/'),
  ('Seu Voto Decide',
   'Pautas com informação checada para quem quer gravar vídeo para a família ou para o próprio público, com orientação jurídica voluntária para criadores com contrato de marca.',
   'Organização e rua', 'Seu Voto Decide', 'https://seuvotodecide.com.br/'),

  -- Vídeos e materiais
  ('Fura Bolha',
   'Vídeos da eleição com resumo e transcrição, ordenados pelo que mais circula, com botão para baixar ou mandar no WhatsApp.',
   'Vídeos e materiais', 'Iniciativa voluntária', 'https://fura-bolha.com/'),
  ('Bora Lula',
   'Imagens, vídeos e cards do 2º turno com o que está em alta no dia, prontos para WhatsApp, Status, Instagram, TikTok, Telegram e X.',
   'Vídeos e materiais', 'Iniciativa voluntária', 'https://bora-lula.online/'),
  ('Acervo da Vitória',
   'Biblioteca de vídeos, artes, lambes e guias com busca por nome ou tag; os arquivos abrem e baixam pelo Google Drive.',
   'Vídeos e materiais', 'Iniciativa voluntária', 'https://acervodavitoria.pages.dev/'),
  ('Curadoria de materiais por público',
   'Poucos materiais por tipo de eleitor (idosos, autônomos, quem votou em outros, pobre de direita e outros), para conversar com cada um.',
   'Vídeos e materiais', 'Iniciativa voluntária', 'https://acervolula13.lovable.app/'),
  ('Diretório 13',
   'Índice de sites, drives, guias, jogos, materiais para impressão e agendas de atos da campanha, atualizado com frequência.',
   'Vídeos e materiais', 'Iniciativa voluntária', 'https://www.diretorio13.com/'),

  -- Jogos
  ('Super Flávio World',
   'Jogo de plataforma em dois cartuchos sobre a ficha de Flávio e o Brasil sob Flávio; as fontes aparecem ao fim de cada fase.',
   'Jogos', 'Iniciativa independente', 'https://www.superflavio.com/'),
  ('Isso é bom ou ruim?',
   'Baralho de 32 frases: você julga cada uma sem saber de quem é e no fim descobre com quem se identifica mais. Serve de puxa-conversa na barraquinha.',
   'Jogos', 'Iniciativa independente', 'https://baralhointerativo.netlify.app/'),

  -- Produção de vídeo
  ('Prensa',
   'Transforma um vídeo em cortes para TikTok, Reels, Shorts, Kwai e Status, com gancho e legenda palavra a palavra. Roda no celular, sem conta e sem enviar o vídeo a servidor. Software livre.',
   'Produção de vídeo', 'arthruur', 'https://arthruur-prensa.static.hf.space/'),

  -- Chegar à urna
  ('Voto Lá Fora',
   'Liga quem oferece carona ou lugar para dormir a quem vota no exterior e mora longe da seção. Sem cadastro; os dados são apagados até 15/11/2026.',
   'Chegar à urna', 'Brasileiros no exterior, iniciativa independente', 'https://votolafora.com.br/'),

  -- Monitoramento
  ('Radar da Virada',
   'O que está em alta no X, no Google, no TikTok, no YouTube e no Kwai, dos dois lados, com os vídeos que mais crescem e os temas que viram voto.',
   'Monitoramento', 'Comunidade Tech contra Flávio Bolsonaro', 'https://radardavirada.pages.dev/'),
  ('A Batalha dos Influs',
   'Placar de influenciadores que declararam voto em Lula ou em Flávio, lido de uma planilha colaborativa, com link para a declaração de cada um.',
   'Monitoramento', 'the-mojo', 'https://batalhadosinflus.the-mojo.studio/')
) as v(title, description, category, credit, url)
where not exists (select 1 from public.tool_submissions t where t.url = v.url);
