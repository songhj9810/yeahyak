import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/queryKeys"
import { PATHS } from "@/shared/config/paths"

import { createProduct } from "../api/createProduct"
import type { ProductCreateRequest } from "../types/dto"

export const useCreateProduct = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      request,
      image,
    }: {
      request: ProductCreateRequest
      image?: File
    }) => createProduct(request, image),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.all() })
      navigate(PATHS.HQ.PRODUCTS.DETAIL(data.id))
    },
  })
}
