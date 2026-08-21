import { apiClient } from "@/shared/api/client"
import type { ApiResponse } from "@/shared/api/types"

import type { ProductCreateRequest, ProductCreateResponse } from "../types/dto"

export const createProduct = async (
  request: ProductCreateRequest,
  image?: File
): Promise<ProductCreateResponse> => {
  const formData = new FormData()
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  )
  if (image) formData.append("image", image)

  const response = await apiClient.post<ApiResponse<ProductCreateResponse>>(
    "/products",
    formData
  )
  return response.data.data
}
