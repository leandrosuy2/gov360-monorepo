# Gov360

Monorepo para a plataforma **Gov360** — gestão governamental integrada.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15 (App Router) + Tailwind + shadcn/ui |
| Backend | NestJS 11 + Prisma |
| Monorepo | pnpm workspaces + Turborepo |
| Linguagem | TypeScript |

## Estrutura

```
Gov360/
├── apps/
│   ├── web/          # Frontend Next.js (porta 3000)
│   └── api/          # Backend NestJS (porta 3001)
├── packages/
│   ├── ui/           # Componentes compartilhados (shadcn)
│   ├── types/        # Tipos TypeScript compartilhados
│   ├── api-client/   # SDK HTTP (axios)
│   ├── utils/        # Utilitários (cn, format)
│   ├── env/          # Schemas Zod para variáveis de ambiente
│   ├── eslint-config/
│   ├── typescript-config/
│   └── tailwind-config/
├── prisma/           # Schema e migrations centralizados
└── tooling/          # Scripts de desenvolvimento
```

## Pré-requisitos

- Node.js >= 20
- pnpm 9+
- MySQL 8+

## Setup

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env

# Gerar Prisma Client
pnpm db:generate

# Rodar migrations (requer MySQL acessível)
pnpm db:migrate

# Iniciar dev (web + api em paralelo)
pnpm dev
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia web e api em modo desenvolvimento |
| `pnpm build` | Build de todos os pacotes |
| `pnpm lint` | Lint em todo o monorepo |
| `pnpm typecheck` | Verificação de tipos |
| `pnpm clean` | Remove node_modules, .next, dist |
| `pnpm db:generate` | Gera Prisma Client |
| `pnpm db:migrate` | Executa migrations |
| `pnpm db:push` | Sincroniza schema sem migration |

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |
| POST | `/auth/register` | Cadastro |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Usuário autenticado |
| GET | `/users` | Listar usuários |
| GET | `/users/:id` | Buscar usuário |
| GET | `/opportunities` | Listar oportunidades (filtros) |
| POST | `/opportunities` | Criar oportunidade |
| GET | `/opportunities/:id` | Detalhe da oportunidade |
| PATCH | `/opportunities/:id` | Atualizar oportunidade |
| GET | `/tenders` | Listar licitações |
| POST | `/tenders` | Criar licitação |
| GET | `/tenders/:id` | Detalhe da licitação |
| PATCH | `/tenders/:id/status` | Atualizar status |
| GET | `/dashboard/stats` | Indicadores executivos |

## Usuário padrão (seed)

Após `pnpm db:seed`:

- **E-mail:** `admin@gov360.local`
- **Senha:** `admin123`

## Variáveis de ambiente

Veja `.env.example` para a lista completa.
