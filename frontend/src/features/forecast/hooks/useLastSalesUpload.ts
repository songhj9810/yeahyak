import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"

import { getLastSalesUpload } from "../api/getLastSalesUpload"

export const useLastSalesUpload = () => {
  return useQuery({
    queryKey: queryKeys.forecast.lastUpload(),
    queryFn: getLastSalesUpload,
  })
}
