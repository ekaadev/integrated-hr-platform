import type { MeResponse } from './schema'

type SessionUser = { id: string; name: string; email: string; employeeId?: string | null }

export function toMeResponse(user: SessionUser): MeResponse {
  return { id: user.id, name: user.name, email: user.email, employee_id: user.employeeId ?? null }
}
