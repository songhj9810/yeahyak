import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"

import { PATHS } from "@/shared/config/paths"

import { resetPassword } from "../api/resetPassword"
import { useRole } from "../store"

export const useResetPassword = () => {
  const navigate = useNavigate()
  const role = useRole()

  const redirectPath =
    role === "ADMIN"
      ? PATHS.HQ.DASHBOARD
      : role === "PHARMACY"
        ? PATHS.BRANCH.DASHBOARD
        : PATHS.AUTH.LOGIN

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate(redirectPath) // 역할에 맞는 페이지로 이동
    },
  })
}
