import { type Static, Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const EnvSchema = Type.Object({
  NODE_ENV: Type.Union(
    [Type.Literal('development'), Type.Literal('test'), Type.Literal('production')],
    { default: 'development' },
  ),
  PORT: Type.Integer({ default: 4004 }),
  DATABASE_URL: Type.String({ minLength: 1 }),
  WEB_ORIGIN: Type.String({ minLength: 1 }),
  BETTER_AUTH_URL: Type.String({ minLength: 1 }),
  BETTER_AUTH_SECRET: Type.String({ minLength: 32 }),
  LOG_LEVEL: Type.String({ default: 'info' }),
})

export type Env = Static<typeof EnvSchema>

// Env is validated once at startup; the app fails fast when configuration is missing.
function loadEnv(): Env {
  const raw = Value.Default(EnvSchema, Value.Convert(EnvSchema, { ...process.env }))
  const errors = [...Value.Errors(EnvSchema, raw)]
  if (errors.length > 0) {
    const detail = errors.map((e) => `  ${e.path}: ${e.message}`).join('\n')
    throw new Error(`Environment variable tidak valid:\n${detail}`)
  }
  return raw as Env
}

export const env = loadEnv()
export const webOrigins = env.WEB_ORIGIN.split(',').map((o) => o.trim())
