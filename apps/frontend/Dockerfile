FROM node:22-alpine

WORKDIR /workspace

COPY packages/shared ./packages/shared
COPY apps/frontend/package.json apps/frontend/package-lock.json ./apps/frontend/

RUN cd packages/shared && npm ci
RUN cd apps/frontend && npm ci

COPY apps/frontend ./apps/frontend

RUN cd packages/shared && npm run build

WORKDIR /workspace/apps/frontend

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
