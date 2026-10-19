# Builds all five frontends (static SPAs) and serves them with Caddy.
# VITE_* is read at build time, so the production API URLs are passed as build args.
FROM oven/bun:1.4.2 AS build
WORKDIR /repo
COPY . .
RUN bun install --frozen-lockfile
ARG HRIS_API_URL
ARG KPI_API_URL
ARG FEEDBACK_360_API_URL
ARG LMS_API_URL
ARG PRISMA_API_URL
RUN cd apps/hris/web && VITE_API_URL=${HRIS_API_URL} bun run build \
 && cd ../../kpi/web && VITE_API_URL=${KPI_API_URL} bun run build \
 && cd ../../feedback-360/web && VITE_API_URL=${FEEDBACK_360_API_URL} bun run build \
 && cd ../../lms/web && VITE_API_URL=${LMS_API_URL} bun run build \
 && cd ../../prisma/web && VITE_API_URL=${PRISMA_API_URL} bun run build

FROM caddy:2.10-alpine
COPY infra/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/hris/web/dist/client /srv/hris
COPY --from=build /repo/apps/kpi/web/dist/client /srv/kpi
COPY --from=build /repo/apps/feedback-360/web/dist/client /srv/feedback-360
COPY --from=build /repo/apps/lms/web/dist/client /srv/lms
COPY --from=build /repo/apps/prisma/web/dist/client /srv/prisma
