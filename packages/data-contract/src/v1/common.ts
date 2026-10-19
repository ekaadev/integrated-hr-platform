import './formats'
import { type Static, type TSchema, Type } from '@sinclair/typebox'

// Data Contract v1 general conventions: ISO 8601 dates (YYYY-MM-DD), ISO 8601 date-times with a time zone.
export const IsoDate = Type.String({ format: 'date', examples: ['2026-10-18'] })
export const IsoDateTime = Type.String({
  format: 'date-time',
  examples: ['2026-10-18T14:05:00+07:00'],
})

// Same error format in every app. `message` is written in Indonesian, as the Data Contract requires.
export const ErrorResponse = Type.Object(
  {
    error: Type.Object({
      code: Type.String({ examples: ['E003'] }),
      message: Type.String({ examples: ['Parameter period tidak valid'] }),
      field: Type.Optional(Type.String()),
    }),
  },
  { $id: 'ErrorResponse' },
)
export type ErrorResponse = Static<typeof ErrorResponse>

// Pagination: page and page_size (default 500, max 1,000).
export const PAGE_SIZE_DEFAULT = 500
export const PAGE_SIZE_MAX = 1000

export const PaginationQuery = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  page_size: Type.Optional(
    Type.Integer({ minimum: 1, maximum: PAGE_SIZE_MAX, default: PAGE_SIZE_DEFAULT }),
  ),
  updated_since: Type.Optional(IsoDateTime),
})
export type PaginationQuery = Static<typeof PaginationQuery>

export const PageMeta = Type.Object({
  total: Type.Integer({ minimum: 0 }),
  page: Type.Integer({ minimum: 1 }),
  page_size: Type.Integer({ minimum: 1 }),
  next_page: Type.Union([Type.Integer({ minimum: 2 }), Type.Null()]),
})
export type PageMeta = Static<typeof PageMeta>

export const Paginated = <T extends TSchema>(item: T) =>
  Type.Object({ data: Type.Array(item), meta: PageMeta })
