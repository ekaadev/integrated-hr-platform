import { date, index, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const employeeStatus = pgEnum('employee_status', ['active', 'on_leave', 'terminated'])

// Master data karyawan sesuai entitas `employee` di Data Contract v1.
// Di HRIS tabel ini adalah sumber employee_id; di aplikasi lain tabel yang sama adalah salinan lokal.
export const employee = pgTable(
  'employee',
  {
    employeeId: varchar('employee_id', { length: 32 }).primaryKey(),
    fullName: text('full_name').notNull(),
    divisionId: text('division_id').notNull(),
    divisionName: text('division_name').notNull(),
    positionId: text('position_id').notNull(),
    positionName: text('position_name').notNull(),
    supervisorId: varchar('supervisor_id', { length: 32 }),
    hireDate: date('hire_date', { mode: 'string' }).notNull(),
    terminationDate: date('termination_date', { mode: 'string' }),
    status: employeeStatus('status').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    index('employee_division_id_idx').on(table.divisionId),
    index('employee_updated_at_idx').on(table.updatedAt),
  ],
)
