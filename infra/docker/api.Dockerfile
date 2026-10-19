# Image backend satu aplikasi. Contoh: docker build -f infra/docker/api.Dockerfile --build-arg APP=hris .
FROM oven/bun:1.4.2 AS build
WORKDIR /repo
COPY . .
RUN bun install --frozen-lockfile
ARG APP
RUN cd apps/${APP}/api && bun run build

FROM oven/bun:1.4.2-slim
ARG APP
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /repo/apps/${APP}/api/dist ./dist
COPY --from=build /repo/apps/${APP}/api/src/db/migrations ./dist/db/migrations
USER bun
# Migrasi dijalankan sebelum server start: docker compose run --rm <app>-api bun dist/db/migrate.js
CMD ["bun", "dist/index.js"]
