# Stage 1: base
FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.4

# Stage 2: deps
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --filter @leadflow/shared --filter @leadflow/backend

# Stage 3: build
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY backend ./backend
RUN pnpm --filter @leadflow/shared run build
RUN pnpm --filter @leadflow/backend run build

# Stage 4: production
FROM node:20-alpine AS production
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=build /app/backend/node_modules ./backend/node_modules

USER node
ENV NODE_ENV=production
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:5000/api/health || exit 1

CMD ["node", "backend/dist/server.js"]
