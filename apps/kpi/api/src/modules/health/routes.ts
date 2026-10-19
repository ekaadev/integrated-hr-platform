import { Elysia } from 'elysia'
import { HealthResponse } from './schema'
import type { HealthService } from './service'

export const healthRoutes = (service: HealthService) =>
  new Elysia({ name: 'module.health', prefix: '/health' }).get('', () => service.check(), {
    response: HealthResponse,
    detail: { tags: ['System'], summary: 'Status aplikasi dan koneksi database' },
  })
