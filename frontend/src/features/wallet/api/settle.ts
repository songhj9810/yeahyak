import { apiClient } from "@/shared/api/client"

export const settle = async (pharmacyId: number): Promise<void> => {
  await apiClient.post(`/wallets/${pharmacyId}/settle`)
}
