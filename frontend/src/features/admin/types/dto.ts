import type { AdminDepartment } from "./enums"

export type AdminUpdateRequest = {
  newName?: string
  newDepartment?: AdminDepartment
}

export type AdminResponse = {
  id: number
  email: string
  employeeId: string
  name: string
  department: AdminDepartment
  createdAt: string
  updatedAt: string
}
