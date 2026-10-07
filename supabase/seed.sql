insert into public.submissions (id, title, description, credit, video_url, status, created_at)
values
  ('10000000-0000-4000-8000-000000000001', 'Guia de conversa no bairro', 'Roteiro fictício para organizar uma roda de conversa com vizinhas e vizinhos.', 'Coletivo Horizonte', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '1 hour'),
  ('10000000-0000-4000-8000-000000000002', 'Cartilha de direitos digitais', 'Material fictício com pontos de partida para uma conversa sobre tecnologia e cidadania.', 'Rede Aberta', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '2 hours'),
  ('10000000-0000-4000-8000-000000000003', 'Convite para mutirão', 'Exemplo de conteúdo para chamar a comunidade para um encontro presencial.', 'Bairro em Movimento', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '3 hours'),
  ('10000000-0000-4000-8000-000000000004', 'Como checar uma informação', 'Passos fictícios para verificar fontes antes de compartilhar uma mensagem.', 'Laboratório Cívico', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '4 hours'),
  ('10000000-0000-4000-8000-000000000005', 'Mapa de apoio local', 'Referência fictícia para identificar iniciativas e pontos de encontro no território.', 'Ponto de Virada', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '5 hours'),
  ('10000000-0000-4000-8000-000000000006', 'Perguntas para uma escuta ativa', 'Perguntas fictícias que ajudam a abrir conversas respeitosas na comunidade.', 'Escuta Coletiva', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '6 hours'),
  ('10000000-0000-4000-8000-000000000007', 'Oficina de segurança online', 'Divulgação fictícia de uma oficina comunitária sobre privacidade na internet.', 'Tecendo Redes', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '7 hours'),
  ('10000000-0000-4000-8000-000000000008', 'Ideias para mobilizar', 'Lista fictícia de ações simples para colocar uma campanha em movimento.', 'Ação de Rua', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '8 hours'),
  ('10000000-0000-4000-8000-000000000009', 'Checklist de evento acessível', 'Conteúdo fictício com lembretes para fazer encontros mais inclusivos.', 'Acesso Já', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '9 hours'),
  ('10000000-0000-4000-8000-000000000010', 'Rede de apoio entre coletivos', 'Exemplo fictício de chamada para conectar grupos que atuam no mesmo território.', 'Comum em Rede', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '10 hours'),
  ('10000000-0000-4000-8000-000000000011', 'Memória do encontro', 'Registro fictício de aprendizados compartilhados em uma plenária comunitária.', 'Vozes do Território', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'approved', now() - interval '11 hours'),
  ('10000000-0000-4000-8000-000000000012', 'Material aguardando curadoria', 'Item fictício propositalmente pendente para testar a moderação.', 'Fila de Curadoria', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'pending', now())
on conflict (id) do update
set title = excluded.title,
    description = excluded.description,
    credit = excluded.credit,
    video_url = excluded.video_url,
    status = excluded.status,
    created_at = excluded.created_at;
