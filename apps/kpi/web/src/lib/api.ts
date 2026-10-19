import { treaty } from '@elysiajs/eden'
import type { App } from '@hr/kpi-api'
import { config } from './config'

// Eden Treaty: tipe request/response mengalir dari Elysia tanpa codegen.
// credentials: 'include' agar cookie session Better Auth ikut terkirim lintas origin.
export const api = treaty<App>(config.apiUrl, {
  fetch: { credentials: 'include' },
})
