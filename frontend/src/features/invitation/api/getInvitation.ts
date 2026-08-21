import { apiClient } from "@/shared/api/client"
import type { ApiResponse, PageResponse } from "@/shared/api/types"

import type { InvitationResponse } from "../types/dto"
import type { GetInvitationsParams } from "../types/params"

export const getInvitations = async (
  params: GetInvitationsParams
): Promise<PageResponse<InvitationResponse>> => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<InvitationResponse>>
  >("/invitations", { params })
  return response.data.data
}
