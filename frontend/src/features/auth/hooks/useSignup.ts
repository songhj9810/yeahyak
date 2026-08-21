import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"

import { PATHS } from "@/shared/config/paths"

import { signupAdmin, signupPharmacy } from "../api/signup"

export const useSignupAdmin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signupAdmin,
    onSuccess: () => {
      navigate(PATHS.AUTH.LOGIN)
    },
  })
}

export const useSignupPharmacy = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signupPharmacy,
    onSuccess: () => {
      navigate(PATHS.AUTH.LOGIN)
    },
  })
}
