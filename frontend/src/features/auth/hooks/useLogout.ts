import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useOrderCartActions } from "@/features/order"

import { PATHS } from "@/shared/config/paths"

import { logout } from "../api/logout"
import { useAuthActions } from "../store"

export const useLogout = () => {
  const navigate = useNavigate()
  const { clearAuth } = useAuthActions()
  const { clearCart } = useOrderCartActions()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear() // 쿼리 캐시 초기화
      clearAuth() // 인증 초기화
      clearCart() // 카트 초기화
      navigate(PATHS.AUTH.LOGIN) // 로그인 페이지로 이동
    },
  })
}
