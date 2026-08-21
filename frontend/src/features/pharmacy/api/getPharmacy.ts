import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type { PharmacyListResponse, PharmacyResponse } from "../types/dto"
import type { GetPharmaciesParams } from "../types/params"

export const getMyPharmacy = async (): Promise<PharmacyResponse> => {
  const response =
    await apiClient.get<ApiResponse<PharmacyResponse>>("/pharmacies/me")
  return response.data.data
}

export const getPharmacy = async (
  pharmacyId: number
): Promise<PharmacyResponse> => {
  const response = await apiClient.get<ApiResponse<PharmacyResponse>>(
    `/pharmacies/${pharmacyId}`
  )
  return response.data.data
}

export const getPharmacies = async (
  params: GetPharmaciesParams
): Promise<PageResponse<PharmacyListResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<PharmacyListResponse>>
  >("/pharmacies", { params })
  return response.data.data
}
