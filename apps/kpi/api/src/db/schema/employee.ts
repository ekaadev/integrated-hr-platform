import { date, index, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const employeeStatus = pgEnum('employee_status', ['active', 'on_leave', 'terminated'])

// Employee master data following the `employee` entity in Data Contract v1.
// In HRIS this table is the source of employee_id; in the other apps the same table is a local copy.
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
