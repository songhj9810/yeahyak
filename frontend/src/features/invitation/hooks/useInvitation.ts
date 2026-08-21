import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { getInvitations } from "../api/getInvitation"
import type { GetInvitationsParams } from "../types/params"

export const useInvitations = (params: GetInvitationsParams) => {
  return useQuery({
    queryKey: queryKeys.invitation.list(params),
    queryFn: () => getInvitations(params),
  })
}
