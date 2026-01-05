FROM node:24.12.0-slim AS builder
WORKDIR /tmp
# Install deps
COPY package*.json /tmp
RUN ls
RUN npm ci

# Copy source
ARG blub=daa
COPY tsconfig*.json /tmp
COPY src /tmp/src
RUN npm run build
# Remove dev dependencies
RUN npm prune --omit=dev

FROM node:24.12.0-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /tmp/dist ./dist
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /tmp/package.json ./package.json

# NestJS port
EXPOSE 3000

# Run compiled app
CMD ["node", "dist/main.js"]
