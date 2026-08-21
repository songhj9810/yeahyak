import { apiClient } from "@/shared/api/client"

import type { ReturnRejectRequest } from "../types/dto"

export const approveReturn = async (returnId: number): Promise<void> => {
  await apiClient.patch(`/returns/${returnId}/approve`)
}

export const rejectReturn = async (
  returnId: number,
  body: ReturnRejectRequest
): Promise<void> => {
  await apiClient.patch(`/returns/${returnId}/reject`, body)
}

export const processReturn = async (returnId: number): Promise<void> => {
  await apiClient.patch(`/returns/${returnId}/process`)
}

export const completeReturn = async (returnId: number): Promise<void> => {
  await apiClient.patch(`/returns/${returnId}/complete`)
}
