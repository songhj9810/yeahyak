import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { getMyAdmin } from "../api/getAdmin"

export const useMyAdmin = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.admin.me(),
    queryFn: getMyAdmin,
    enabled: options?.enabled,
  })
}
