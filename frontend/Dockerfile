# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Caddy
FROM caddy:2-alpine
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
