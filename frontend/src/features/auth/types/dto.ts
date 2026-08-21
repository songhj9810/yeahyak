import type { AdminDepartment } from "@/features/admin"
import type { PharmacyRegion } from "@/features/pharmacy"

import type { UserRole } from "./enums"

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  role: UserRole
}

export type MailSendRequest = {
  email: string
}

export type PasswordResetRequest = {
  token: string
  newPassword: string
}

export type AdminSignupRequest = {
  token: string
  password: string
  employeeId: string
  name: string
  department: AdminDepartment
}

export type PharmacySignupRequest = {
  token: string
  password: string
  brn: string
  representative: string
  name: string
  postcode: string
  address: string
  addressDetails?: string
  region: PharmacyRegion
  contact?: string
}
