import { treaty } from '@elysiajs/eden'
import type { App } from '@hr/lms-api'
import { config } from './config'

// Eden Treaty: request/response types flow from Elysia without codegen.
// credentials: 'include' so the Better Auth session cookie is sent cross-origin.
export const api = treaty<App>(config.apiUrl, {
  fetch: { credentials: 'include' },
})
