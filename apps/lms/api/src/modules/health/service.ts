import { CONTRACT_VERSION } from '@hr/data-contract/v1'
import type { HealthResponse } from './schema'

// Service tidak bergantung pada Elysia: dependensi (ping database) disuntikkan
// sehingga mudah diuji tanpa server maupun database.
export function createHealthService(deps: { app: string; pingDb: () => Promise<unknown> }) {
  return {
    async check(): Promise<HealthResponse> {
      const database = await deps
        .pingDb()
        .then(() => 'up' as const)
        .catch(() => 'down' as const)
      return {
        status: database === 'up' ? 'ok' : 'degraded',
        app: deps.app,
        contract_version: CONTRACT_VERSION,
        database,
        time: new Date().toISOString(),
      }
    },
  }
}
export type HealthService = ReturnType<typeof createHealthService>
