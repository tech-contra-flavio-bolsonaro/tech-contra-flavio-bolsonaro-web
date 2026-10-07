# Tech Contra Flávio Bolsonaro

Hub comunitário que reúne ferramentas de mobilização, manifesto e conteúdos enviados pela comunidade. A aplicação usa Next.js, Vercel e Supabase.

## Arquitetura

```text
Navegador
  │
  ├─ Aplicação Next.js
  │    ├─ páginas: início, manifesto, ferramentas, conteúdos e envio
  │    ├─ rota de API: feed de conteúdos aprovados
  │    └─ interface: componentes shadcn/Base UI, Tailwind e ícones
  │
  └─ Supabase
       ├─ Postgres: registros de submissões
       ├─ Storage privado: arquivos comunitários
       └─ Edge Function: recebimento e validação de envios
            └─ Turnstile: proteção contra spam

CI/CD
  ├─ aplica migrations pendentes
  └─ dispara o deploy de produção somente após sucesso
```

### Aplicação web

- A página inicial apresenta até quatro ferramentas e quatro conteúdos. As páginas dedicadas mostram o catálogo completo.
- O feed de conteúdos carrega dez itens por vez, com scroll infinito e botão de carregamento como alternativa acessível.
- Ferramentas incorporáveis são abertas dentro do site; as demais têm links externos com contexto.
- A identidade visual e os componentes de interface ficam no frontend; dados publicados vêm exclusivamente da camada de conteúdo aprovada.

### Conteúdo e curadoria

1. A pessoa informa título, descrição, crédito e envia um arquivo ou link de vídeo.
2. O formulário valida a proteção anti-spam antes de enviar os dados.
3. A função de backend valida campos, tipo e tamanho do arquivo.
4. Arquivos são guardados no armazenamento privado e o conteúdo entra como `pending`.
5. A curadoria altera o status para `approved` ou `rejected`.
6. Somente conteúdos `approved` entram no feed público.

O status é controlado pelo enum `submission_status`: `pending`, `approved` e `rejected`. A tabela possui RLS ativado; acessos públicos diretos são bloqueados e a função de backend executa as operações privilegiadas necessárias.

### Segurança

- O endpoint de envio é público para permitir contribuições da comunidade, mas exige validação anti-spam no servidor antes de acessar dados ou arquivos.
- O armazenamento de mídia é privado; o navegador não recebe privilégios de escrita direta.
- Segredos ficam exclusivamente nos provedores de ambiente. Nunca devem ser versionados, expostos no cliente ou incluídos em logs.

## Desenvolvimento

```bash
bun install --frozen-lockfile
cp .env.example .env.local
bun dev
```

Validação obrigatória antes de uma PR:

```bash
bun run test
bun run lint
bun run build
git diff --check
```

## Configuração de ambiente

O arquivo `.env.example` lista os nomes das variáveis necessárias, sem valores reais. Há grupos separados para:

- conexão pública do cliente com o backend;
- chave pública da proteção anti-spam;
- segredo de validação do anti-spam na função de backend;
- credenciais privilegiadas de servidor;
- conexão do pipeline de migrations;
- gatilho do deploy de produção.

Configure os valores no ambiente local e nos provedores de produção. Nunca use valores de exemplos, documentação ou screenshots.

## Banco, migrations e deploy

As migrations vivem em `supabase/migrations/` e são a fonte de verdade do schema. Ao entrar uma alteração em `main`, o pipeline:

1. pré-visualiza as migrations pendentes;
2. aplica somente migrations que ainda não constam no histórico do banco;
3. dispara o deploy de produção apenas se a aplicação terminar com sucesso.

Esse encadeamento impede que uma versão da aplicação seja publicada antes de sua estrutura de banco necessária.

## Estrutura principal

```text
app/
  api/                  # dados públicos e paginação
  components/           # navegação, cards, feed, envio e compartilhamento
  conteudos/            # catálogo de conteúdos
  enviar/               # formulário comunitário
  ferramentas/          # catálogo de ferramentas
  manifesto/            # manifesto
components/ui/          # primitives de interface
supabase/
  functions/            # recebimento de submissões
  migrations/           # schema e políticas versionados
.github/workflows/      # migrations e release
```

## Operação da curadoria

No painel administrativo do banco, revise os registros pendentes e altere o campo `status` para `approved` ou `rejected`. O feed público refletirá somente os itens aprovados.
