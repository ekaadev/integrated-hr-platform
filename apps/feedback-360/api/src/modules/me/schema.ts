import { type Static, Type } from '@sinclair/typebox'

export const MeResponse = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  employee_id: Type.Union([Type.String(), Type.Null()]),
})
export type MeResponse = Static<typeof MeResponse>
