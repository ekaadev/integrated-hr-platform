import employees from '@hr/data-contract/fixtures/employees.json'
import type { Employee } from '@hr/data-contract/v1'
import { db, sql } from './client'
import { employee } from './schema'

// Standardized demo seed data: a local copy of the employee master data from HRIS.
// In a real environment this table is filled through import or API from the team's HRIS or the client's HRIS.
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
