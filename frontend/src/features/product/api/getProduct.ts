import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type { ProductListResponse, ProductResponse } from "../types/dto"
import type { GetProductsParams } from "../types/params"

export const getProduct = async (
  productId: number
): Promise<ProductResponse> => {
  const response = await apiClient.get<ApiResponse<ProductResponse>>(
    `/products/${productId}`
  )
  return response.data.data
}

export const getProducts = async (
  params: GetProductsParams
): Promise<PageResponse<ProductListResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<ProductListResponse>>
  >("/products", { params })
  return response.data.data
}
