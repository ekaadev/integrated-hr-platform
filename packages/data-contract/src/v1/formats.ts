import { FormatRegistry } from '@sinclair/typebox'

// TypeBox tidak membawa validator format bawaan. Elysia mendaftarkan format sendiri,
// tetapi package ini juga dipakai di luar Elysia (seed, test, import file), jadi
// format yang dipakai Data Contract didaftarkan di sini bila belum ada.
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
