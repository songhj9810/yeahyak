import { apiClient } from "@/shared/api/client"
import type { ApiResponse } from "@/shared/api/types"

import type { LastSalesUploadResponse } from "../types/dto"

export const getLastSalesUpload =
  async (): Promise<LastSalesUploadResponse> => {
    const response = await apiClient.get<ApiResponse<LastSalesUploadResponse>>(
      "/forecast/last-sales-upload"
    )
    return response.data.data
  }
