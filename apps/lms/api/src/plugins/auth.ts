import { HttpErrorCode } from '@hr/data-contract/v1'
import { Elysia } from 'elysia'
import { auth } from '../auth'

// Handler Better Auth dipasang eksplisit di /api/auth/* (bukan .mount() di root, yang
// akan menelan semua request tak dikenal sehingga format error 404 hilang). Macro `auth: true` pada route
// mewajibkan session dan menyediakan `user` serta `session` ke handler.
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
