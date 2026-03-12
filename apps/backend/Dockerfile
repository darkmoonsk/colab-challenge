FROM node:22-alpine

WORKDIR /workspace

COPY packages/shared ./packages/shared
COPY apps/backend/package.json apps/backend/package-lock.json ./apps/backend/

RUN cd packages/shared && npm ci
RUN cd apps/backend && npm ci

COPY apps/backend ./apps/backend

RUN cd packages/shared && npm run build

WORKDIR /workspace/apps/backend

EXPOSE 3001

CMD ["sh", "-c", "npm run prisma:generate && npx prisma db push && npm run start:dev"]
