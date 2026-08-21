import { apiClient } from "@/shared/api/client"

export const deleteProduct = async (productId: number): Promise<void> => {
  await apiClient.delete(`/products/${productId}`)
}
