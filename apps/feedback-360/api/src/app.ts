import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { CONTRACT_VERSION } from '@hr/data-contract/v1'
import { sql as dbSql } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from './db/client'
import { webOrigins } from './env'
import { healthRoutes } from './modules/health/routes'
import { createHealthService, type HealthService } from './modules/health/service'
import { meRoutes } from './modules/me/routes'
import { authPlugin } from './plugins/auth'
import { errorPlugin } from './plugins/error'
import { loggerPlugin } from './plugins/logger'

export const APP_NAME = 'feedback-360'

type Deps = { health: HealthService }

const defaultDeps = (): Deps => ({
  health: createHealthService({ app: APP_NAME, pingDb: () => db.execute(dbSql`select 1`) }),
})

// App factory: dipakai index.ts (listen) dan test (app.handle) tanpa membuka port.
// Rantai .use() jangan diputus agar tipe App untuk Eden Treaty tetap utuh.
export const createApp = (deps: Deps = defaultDeps()) =>
  new Elysia()
    .use(errorPlugin)
    .use(loggerPlugin)
    .use(
      cors({
        origin: webOrigins,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    )
    .use(
      openapi({
        documentation: {
          info: { title: '360 Feedback API', version: CONTRACT_VERSION },
        },
      }),
    )
    .use(authPlugin)
    .group('/v1', (v1) => v1.use(healthRoutes(deps.health)).use(meRoutes))

export type App = ReturnType<typeof createApp>
