import { describe, expect, test } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import employees from '../fixtures/employees.json'
import { Employee } from '../src/v1'

describe('fixtures/employees.json', () => {
  test('setiap record valid terhadap schema Employee v1', () => {
    for (const row of employees) {
      expect(Value.Check(Employee, row)).toBe(true)
    }
  })

  test('employee_id unik dan supervisor_id merujuk karyawan yang ada', () => {
    const ids = new Set(employees.map((e) => e.employee_id))
    expect(ids.size).toBe(employees.length)
    for (const e of employees) {
      if (e.supervisor_id) expect(ids.has(e.supervisor_id)).toBe(true)
    }
  })
})
