import { apiClient } from "@/shared/api/client"
import type { ApiResponse } from "@/shared/api/types"

import type { LoginRequest, LoginResponse } from "../types/dto"

export const loginAdmin = async (
  body: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login/admin",
    body
  )
  return response.data.data
}

export const loginPharmacy = async (
  body: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login/pharmacy",
    body
  )
  return response.data.data
}
