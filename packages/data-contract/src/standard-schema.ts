import type { Static, TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import './v1/formats'

// Subset antarmuka Standard Schema v1 (https://standardschema.dev) yang dibutuhkan
// TanStack Form. TypeBox 0.34 belum mengimplementasikannya, jadi schema dibungkus di sini.
export interface StandardSchemaV1<Output> {
  readonly '~standard': {
    readonly version: 1
    readonly vendor: string
    readonly validate: (
      value: unknown,
    ) =>
      | { readonly value: Output; readonly issues?: undefined }
      | { readonly issues: ReadonlyArray<{ message: string; path?: ReadonlyArray<PropertyKey> }> }
    readonly types?: { readonly input: Output; readonly output: Output }
  }
}

export function toStandardSchema<T extends TSchema>(
  schema: T,
  messages: Partial<Record<string, string>> = {},
): StandardSchemaV1<Static<T>> {
  return {
    '~standard': {
      version: 1,
      vendor: 'typebox',
      validate(value) {
        if (Value.Check(schema, value)) return { value: value as Static<T> }
        const issues = [...Value.Errors(schema, value)].map((e) => {
          const path = e.path.split('/').filter(Boolean)
          return { message: messages[path.join('.')] ?? e.message, path }
        })
        return { issues }
      },
    },
  }
}
