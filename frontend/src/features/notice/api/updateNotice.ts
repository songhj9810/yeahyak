import { apiClient } from "@/shared/api/client"

import type { NoticeUpdateRequest } from "../types/dto"

export const updateNotice = async (
  noticeId: number,
  request: NoticeUpdateRequest,
  files?: File[]
): Promise<void> => {
  const formData = new FormData()
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  )
  files?.forEach((file) => formData.append("files", file))

  await apiClient.patch(`/notices/${noticeId}`, formData)
}
