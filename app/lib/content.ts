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
