import { apiClient } from "@/shared/api/client"

export const cancelOrder = async (orderId: number): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/cancel`)
}

export const processOrder = async (orderId: number): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/process`)
}

export const completeOrder = async (orderId: number): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/complete`)
}
