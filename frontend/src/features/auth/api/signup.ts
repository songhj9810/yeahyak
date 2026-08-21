import { apiClient } from "@/shared/api/client"

import type { AdminSignupRequest, PharmacySignupRequest } from "../types/dto"

export const signupAdmin = async (body: AdminSignupRequest): Promise<void> => {
  await apiClient.post("/auth/signup/admin", body)
}

export const signupPharmacy = async (
  body: PharmacySignupRequest
): Promise<void> => {
  await apiClient.post("/auth/signup/pharmacy", body)
}
