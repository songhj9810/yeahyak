import { apiClient } from "@/shared/api/client"

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout")
}
