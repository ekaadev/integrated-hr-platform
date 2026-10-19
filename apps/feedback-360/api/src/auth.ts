import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/client'
import * as schema from './db/schema'
import { env, webOrigins } from './env'

// Better Auth: session berbasis cookie httpOnly, disimpan di database aplikasi ini.
// Plugin (organization, admin, api-key, two-factor) ditambahkan saat SRS membutuhkannya;
// setiap perubahan plugin wajib diikuti `bun run auth:generate` dan `bun run db:generate`.
export const auth = betterAuth({
  appName: '360 Feedback',
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: webOrigins,
  database: drizzleAdapter(db, { provider: 'pg', schema, usePlural: false }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      // Setiap user dikaitkan ke employee_id dari Data Contract.
      employeeId: { type: 'string', required: false, input: false },
    },
  },
  advanced: {
    // Di production API berada di belakang reverse proxy (Caddy) yang meneruskan IP klien.
    ipAddress: { ipAddressHeaders: ['x-forwarded-for'] },
    // Frontend dan API berbeda origin: cookie harus SameSite=None + Secure di production.
    defaultCookieAttributes:
      env.NODE_ENV === 'production'
        ? { sameSite: 'none', secure: true, httpOnly: true }
        : { sameSite: 'lax', secure: false, httpOnly: true },
  },
  rateLimit: { enabled: true, window: 60, max: 100 },
})
