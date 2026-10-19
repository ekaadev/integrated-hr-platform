import { type Static, Type } from '@sinclair/typebox'
import { IsoDate, IsoDateTime } from './common'

export const EmployeeStatus = Type.Union(
  [Type.Literal('active'), Type.Literal('on_leave'), Type.Literal('terminated')],
  { $id: 'EmployeeStatus' },
)
export type EmployeeStatus = Static<typeof EmployeeStatus>

// Shared employee entity. HRIS is the primary source; KPI, 360 Feedback, and LMS keep a
// minimal copy filled through import or API with the same schema.
export const Employee = Type.Object(
  {
    employee_id: Type.String({ minLength: 1, maxLength: 32, examples: ['EMP-0042'] }),
    full_name: Type.String({ minLength: 1 }),
    division_id: Type.String({ minLength: 1 }),
    division_name: Type.String({ minLength: 1 }),
    position_id: Type.String({ minLength: 1 }),
    position_name: Type.String({ minLength: 1 }),
    supervisor_id: Type.Union([Type.String({ maxLength: 32 }), Type.Null()]),
    hire_date: IsoDate,
    termination_date: Type.Union([IsoDate, Type.Null()]),
    status: EmployeeStatus,
    updated_at: IsoDateTime,
  },
  { $id: 'Employee' },
)
export type Employee = Static<typeof Employee>
