# Stage 1: build
FROM node:20-alpine AS build
RUN npm install -g pnpm@9.15.4

WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY backend ./backend

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @leadflow/shared run build
RUN pnpm --filter @leadflow/backend run build

# Stage 2: production
FROM node:20-alpine AS production
RUN apk add --no-cache curl
WORKDIR /app

# Copy built outputs and necessary workspace configuration from build stage
COPY --from=build /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml /app/tsconfig.base.json ./
COPY --from=build /app/packages/shared/package.json ./packages/shared/
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/backend/package.json ./backend/
COPY --from=build /app/backend/dist ./backend/dist

# Install only production dependencies
RUN npm install -g pnpm@9.15.4
RUN pnpm install --prod --frozen-lockfile

USER node
ENV NODE_ENV=production
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:5000/api/health || exit 1

CMD ["node", "backend/dist/server.js"]
