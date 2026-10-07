export type Tool = {
  id: string;
  title: string;
  description: string;
  category: string;
  accessMode: "embed" | "external";
  url: string;
  embedUrl?: string;
};

export type Content = {
  id: string;
  title: string;
  description: string;
  kind: "image" | "video";
  credit: string;
  tags: string[];
  accent: "rose" | "sage" | "sky";
  url: string;
  embedUrl?: string;
};

export const tools: Tool[] = [
  {
    id: "mapa-de-acoes",
    title: "Mapa de ações",
    description: "Encontre territórios, trace caminhos e comece uma conversa perto de você.",
    category: "Planejamento",
    accessMode: "embed",
    url: "https://www.openstreetmap.org/",
    embedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-48.1%2C-15.9%2C-47.7%2C-15.6&layer=mapnik",
  },
  {
    id: "gerador-de-qr",
    title: "Gerador de QR code",
    description: "Transforme um link importante em um convite rápido para compartilhar.",
    category: "Comunicação",
    accessMode: "external",
    url: "https://www.qrcode-monkey.com/",
  },
  {
    id: "calendario",
    title: "Calendário de mobilização",
    description: "Organize encontros, datas importantes e tarefas coletivas.",
    category: "Organização",
    accessMode: "external",
    url: "https://calendar.google.com/",
  },
];

export const contents: Content[] = [
  {
    id: "card-conversa",
    title: "Toda conversa pode abrir caminho",
    description: "Card para usar quando você quiser começar por escuta e presença.",
    kind: "image",
    credit: "Acervo Vira Voto",
    tags: ["conversa", "escuta"],
    accent: "rose",
    url: "https://vira-voto.vercel.app/#conteudos",
  },
  {
    id: "card-cuidado",
    title: "Cuidar também é mobilizar",
    description: "Imagem para lembrar que mudança se faz em rede, todos os dias.",
    kind: "image",
    credit: "Acervo Vira Voto",
    tags: ["comunidade", "cuidado"],
    accent: "sage",
    url: "https://vira-voto.vercel.app/#conteudos",
  },
  {
    id: "video-exemplo",
    title: "Roda de conversa em movimento",
    description: "Vídeo de referência para compartilhar junto de um convite de ação.",
    kind: "video",
    credit: "Acervo Vira Voto",
    tags: ["vídeo", "ação"],
    accent: "sky",
    url: "https://www.youtube.com/",
    embedUrl: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
  },
];
