import { apiClient } from "@/shared/api/client"
import type { ApiResponse } from "@/shared/api/types"

import type { ForecastRequest, ForecastResponse } from "../types/dto"

export const forecast = async (
  body: ForecastRequest
): Promise<ForecastResponse[]> => {
  const response = await apiClient.post<ApiResponse<ForecastResponse[]>>(
    "/forecast",
    body
  )
  return response.data.data
}
