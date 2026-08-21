import { apiClient } from "@/shared/api/client"
import type { ApiResponse } from "@/shared/api/types"

import type { NoticeCreateRequest, NoticeCreateResponse } from "../types/dto"

export const createNotice = async (
  request: NoticeCreateRequest,
  files?: File[]
): Promise<NoticeCreateResponse> => {
  const formData = new FormData()
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  )
  files?.forEach((file) => formData.append("files", file))

  const response = await apiClient.post<ApiResponse<NoticeCreateResponse>>(
    "/notices",
    formData
  )
  return response.data.data
}
