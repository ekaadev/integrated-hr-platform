import employees from '@hr/data-contract/fixtures/employees.json'
import type { Employee } from '@hr/data-contract/v1'
import { db, sql } from './client'
import { employee } from './schema'

// Seed data demo terstandar: salinan lokal master data karyawan dari HRIS.
// Di lingkungan nyata tabel ini diisi lewat import atau API dari HRIS tim atau HRIS klien.
const rows = (employees as Employee[]).map((e) => ({
  employeeId: e.employee_id,
  fullName: e.full_name,
  divisionId: e.division_id,
  divisionName: e.division_name,
  positionId: e.position_id,
  positionName: e.position_name,
  supervisorId: e.supervisor_id,
  hireDate: e.hire_date,
  terminationDate: e.termination_date,
  status: e.status,
  updatedAt: new Date(e.updated_at),
}))

await db.insert(employee).values(rows).onConflictDoNothing()
console.log(`Seed selesai: ${rows.length} karyawan`)
await sql.end()
