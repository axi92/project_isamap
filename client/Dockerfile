FROM node:24.12.0-slim AS builder
WORKDIR /tmp

ENV blub=aa
COPY package*.json tsconfig*.json vite.config.* postcss.config.* tailwind.config.* ./
COPY src ./src
COPY public ./public
COPY patches ./patches
COPY index.html ./index.html
RUN npm ci
RUN npm run postinstall
RUN npm run build

FROM caddy:2.10
WORKDIR /app
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /tmp/dist ./

# NestJS port
EXPOSE 8080

# Run compiled app
CMD ["/usr/bin/caddy", "run", "--config", "/etc/caddy/Caddyfile"]
