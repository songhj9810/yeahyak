import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"
import { PATHS } from "@/shared/config/paths"

import { updateProduct } from "../api/updateProduct"
import type { ProductUpdateRequest } from "../types/dto"

export const useUpdateProduct = (productId: number) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      request,
      image,
    }: {
      request: ProductUpdateRequest
      image?: File
    }) => updateProduct(productId, request, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.all() })
      navigate(PATHS.HQ.PRODUCTS.DETAIL(productId))
    },
  })
}
