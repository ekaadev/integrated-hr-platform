import { Elysia } from 'elysia'
import pino from 'pino'
import { env } from '../env'

export const log = pino({ level: env.LOG_LEVEL, base: { app: 'lms-api' } })

// Log satu baris per request beserta durasinya.
export const loggerPlugin = new Elysia({ name: 'logger' })
  .derive({ as: 'global' }, () => ({ startedAt: performance.now() }))
  .onAfterResponse({ as: 'global' }, ({ request, set, startedAt }) => {
    log.info(
      {
        method: request.method,
        path: new URL(request.url).pathname,
        status: set.status,
        ms: Math.round(performance.now() - startedAt),
      },
      'request',
    )
  })
