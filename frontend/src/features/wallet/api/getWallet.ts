import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type { WalletResponse, WalletTxResponse } from "../types/dto"
import type { GetWalletTxsParams } from "../types/params"

export const getMyWallet = async (): Promise<WalletResponse> => {
  const response =
    await apiClient.get<ApiResponse<WalletResponse>>("/wallets/me")
  return response.data.data
}

export const getMyWalletTxs = async (
  params: GetWalletTxsParams
): Promise<PageResponse<WalletTxResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<WalletTxResponse>>
  >("/wallets/me/transactions", { params })
  return response.data.data
}

export const getWallet = async (
  pharmacyId: number
): Promise<WalletResponse> => {
  const response = await apiClient.get<ApiResponse<WalletResponse>>(
    `/wallets/${pharmacyId}`
  )
  return response.data.data
}

export const getWalletTxs = async (
  pharmacyId: number,
  params: GetWalletTxsParams
): Promise<PageResponse<WalletTxResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<WalletTxResponse>>
  >(`/wallets/${pharmacyId}/transactions`, { params })
  return response.data.data
}
