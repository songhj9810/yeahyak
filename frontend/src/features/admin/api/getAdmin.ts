import { apiClient } from "@/shared/api/client"
import type { ApiResponse } from "@/shared/api/types"

import type { AdminResponse } from "../types/dto"

export const getMyAdmin = async (): Promise<AdminResponse> => {
  const response = await apiClient.get<ApiResponse<AdminResponse>>("/admins/me")
  return response.data.data
}
