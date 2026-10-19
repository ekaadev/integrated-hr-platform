import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/client'
import * as schema from './db/schema'
import { env, webOrigins } from './env'

// Better Auth: httpOnly cookie-based session, stored in this app's database.
// Plugins (organization, admin, api-key, two-factor) are added when the SRS needs them;
// every plugin change must be followed by `bun run auth:generate` and `bun run db:generate`.
export const auth = betterAuth({
  appName: 'KPI/Performance',
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: webOrigins,
  database: drizzleAdapter(db, { provider: 'pg', schema, usePlural: false }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      // Every user is linked to an employee_id from the Data Contract.
      employeeId: { type: 'string', required: false, input: false },
    },
  },
  advanced: {
    // In production the API sits behind a reverse proxy (Caddy) that forwards the client IP.
    ipAddress: { ipAddressHeaders: ['x-forwarded-for'] },
    // Frontend and API are on different origins: cookies must be SameSite=None + Secure in production.
    defaultCookieAttributes:
      env.NODE_ENV === 'production'
        ? { sameSite: 'none', secure: true, httpOnly: true }
        : { sameSite: 'lax', secure: false, httpOnly: true },
  },
  rateLimit: { enabled: true, window: 60, max: 100 },
})
