import { HttpErrorCode } from '@hr/data-contract/v1'
import { Elysia } from 'elysia'
import { auth } from '../auth'

// The Better Auth handler is attached explicitly at /api/auth/* (not .mount() at the root,
// which would swallow every unknown request and lose the 404 error format). The `auth: true`
// route macro requires a session and provides `user` and `session` to the handler.
export const authPlugin = new Elysia({ name: 'auth' })
  .all('/api/auth/*', ({ request }) => auth.handler(request), { detail: { hide: true } })
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const result = await auth.api.getSession({ headers })
        if (!result) {
          return status(401, {
            error: {
              code: HttpErrorCode.UNAUTHORIZED,
              message: 'Sesi tidak valid atau kedaluwarsa',
            },
          })
        }
        return { user: result.user, session: result.session }
      },
    },
  })
