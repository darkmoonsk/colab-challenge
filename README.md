# Colab Challenge

Aplicação full stack para registro e classificacao de relatos de zeladoria urbana usando IA.

## Arquitetura

- `apps/frontend`: Next.js
- `apps/backend`: NestJS + Prisma
- `packages/shared`: tipos e schemas compartilhados
- `postgres`: banco de dados via Docker

## Executando com Docker (desenvolvimento)

1. Copie o arquivo de exemplo de ambiente na raiz:

```bash
cp .env.example .env
```

2. Preencha `GEMINI_API_KEY` no arquivo `.env`.

3. Suba os servicos:

```bash
docker compose up --build
```

## Endpoints locais

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)
- PostgreSQL: `localhost:5432`

## Observacoes

- O backend usa `DATABASE_URL` interno para o host `postgres` dentro da rede do Compose.
- O frontend usa `NEXT_PUBLIC_API_URL=http://localhost:3001` para chamadas feitas pelo navegador.
- O backend executa `prisma db push` na inicializacao do container para sincronizar schema no ambiente de desenvolvimento.
