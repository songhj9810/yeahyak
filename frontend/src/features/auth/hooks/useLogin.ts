import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"

import { PATHS } from "@/shared/config/paths"

import { loginAdmin, loginPharmacy } from "../api/login"
import { useAuthActions } from "../store"

export const useLoginAdmin = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthActions()

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.role)
      navigate(PATHS.HQ.DASHBOARD)
    },
  })
}

export const useLoginPharmacy = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthActions()

  return useMutation({
    mutationFn: loginPharmacy,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.role)
      navigate(PATHS.BRANCH.DASHBOARD)
    },
  })
}
