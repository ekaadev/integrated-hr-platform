import { FormatRegistry } from '@sinclair/typebox'

// TypeBox ships no built-in format validators. Elysia registers its own formats, but this
// package is also used outside Elysia (seed, tests, file import), so the formats the Data
// Contract uses are registered here when missing.
const DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/i

if (!FormatRegistry.Has('date')) {
  FormatRegistry.Set('date', (v) => DATE.test(v) && !Number.isNaN(Date.parse(v)))
}
if (!FormatRegistry.Has('date-time')) {
  FormatRegistry.Set('date-time', (v) => DATE_TIME.test(v) && !Number.isNaN(Date.parse(v)))
}
if (!FormatRegistry.Has('email')) {
  FormatRegistry.Set('email', (v) => EMAIL.test(v))
}
