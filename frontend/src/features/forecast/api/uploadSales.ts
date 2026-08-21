import { apiClient } from "@/shared/api/client"

export const uploadSales = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)

  await apiClient.post("/stocks/me/sales", formData)
}
