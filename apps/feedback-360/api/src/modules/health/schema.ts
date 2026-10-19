import { type Static, Type } from '@sinclair/typebox'

export const HealthResponse = Type.Object({
  status: Type.Union([Type.Literal('ok'), Type.Literal('degraded')]),
  app: Type.String(),
  contract_version: Type.String(),
  database: Type.Union([Type.Literal('up'), Type.Literal('down')]),
  time: Type.String({ format: 'date-time' }),
})
export type HealthResponse = Static<typeof HealthResponse>
