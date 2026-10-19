import { Elysia } from 'elysia'
import { authPlugin } from '../../plugins/auth'
import { MeResponse } from './schema'
import { toMeResponse } from './service'

// Example of a route that requires login (macro `auth: true`).
export const meRoutes = new Elysia({ name: 'module.me', prefix: '/me' })
  .use(authPlugin)
  .get('', ({ user }) => toMeResponse(user), {
    auth: true,
    response: MeResponse,
    detail: { tags: ['Auth'], summary: 'User yang sedang login' },
  })
