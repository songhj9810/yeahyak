import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type { NoticeListResponse, NoticeResponse } from "../types/dto"
import type { GetNoticesParams } from "../types/params"

export const getNotice = async (noticeId: number): Promise<NoticeResponse> => {
  const response = await apiClient.get<ApiResponse<NoticeResponse>>(
    `/notices/${noticeId}`
  )
  return response.data.data
}

export const getNotices = async (
  params: GetNoticesParams
): Promise<PageResponse<NoticeListResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<NoticeListResponse>>
  >("/notices", { params })
  return response.data.data
}

export const getLatestNotices = async (): Promise<NoticeListResponse[]> => {
  const response =
    await apiClient.get<ApiResponse<NoticeListResponse[]>>("/notices/latest")
  return response.data.data
}
