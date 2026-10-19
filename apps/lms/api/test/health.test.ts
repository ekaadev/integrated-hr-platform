import { describe, expect, test } from 'bun:test'
import { createApp } from '../src/app'
import { createHealthService } from '../src/modules/health/service'

const appWith = (pingDb: () => Promise<unknown>) =>
  createApp({ health: createHealthService({ app: 'lms', pingDb }) })

describe('GET /v1/health', () => {
  test('ok bila database merespons', async () => {
    const res = await appWith(async () => 1).handle(new Request('http://localhost/v1/health'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ status: 'ok', app: 'lms', database: 'up' })
  })

  test('degraded bila database tidak tersedia', async () => {
    const res = await appWith(() => Promise.reject(new Error('down'))).handle(
      new Request('http://localhost/v1/health'),
    )
    expect(await res.json()).toMatchObject({ status: 'degraded', database: 'down' })
  })
})

describe('format error', () => {
  test('route tidak dikenal memakai format error Data Contract', async () => {
    const res = await appWith(async () => 1).handle(new Request('http://localhost/v1/unknown'))
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({
      error: { code: 'E404', message: 'Endpoint tidak ditemukan' },
    })
  })

  test('/v1/me tanpa session ditolak 401', async () => {
    const res = await appWith(async () => 1).handle(new Request('http://localhost/v1/me'))
    expect(res.status).toBe(401)
    expect(await res.json()).toMatchObject({ error: { code: 'E401' } })
  })
})
