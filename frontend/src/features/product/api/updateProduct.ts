import { apiClient } from "@/shared/api/client"

import type { ProductUpdateRequest } from "../types/dto"

export const updateProduct = async (
  productId: number,
  request: ProductUpdateRequest,
  image?: File
): Promise<void> => {
  const formData = new FormData()
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  )
  if (image) formData.append("image", image)

  await apiClient.patch(`/products/${productId}`, formData)
}
