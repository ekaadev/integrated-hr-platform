import { type ErrorResponse, HttpErrorCode, ValidationErrorCode } from '@hr/data-contract/v1'
import { Elysia } from 'elysia'
import { log } from './logger'

const body = (code: string, message: string, field?: string): ErrorResponse => ({
  error: field ? { code, message, field } : { code, message },
})

// Consistent error format across all apps: { error: { code, message, field? } }.
export const errorPlugin = new Elysia({ name: 'error' }).onError(
  { as: 'global' },
  ({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = 400
        const first = error.all[0]
        const field = first && 'path' in first ? first.path.replace(/^\//, '') : undefined
        return body(ValidationErrorCode.INVALID_FORMAT, 'Parameter tidak valid', field || undefined)
      }
      case 'NOT_FOUND':
        set.status = 404
        return body(HttpErrorCode.NOT_FOUND, 'Endpoint tidak ditemukan')
      case 'PARSE':
        set.status = 400
        return body(ValidationErrorCode.INVALID_FORMAT, 'Body request tidak dapat dibaca')
      default: {
        const status = typeof set.status === 'number' && set.status >= 400 ? set.status : 500
        if (status >= 500) log.error({ err: error }, 'unhandled error')
        set.status = status
        return body(HttpErrorCode.INTERNAL, 'Terjadi kesalahan di server')
      }
    }
  },
)
