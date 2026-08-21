import { apiClient } from "@/shared/api/client"

export const deleteNotice = async (noticeId: number): Promise<void> => {
  await apiClient.delete(`/notices/${noticeId}`)
}
