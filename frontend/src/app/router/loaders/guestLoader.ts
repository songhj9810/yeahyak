import { redirect } from "react-router-dom"

import { useAuthStore } from "@/features/auth"

import { PATHS } from "@/shared/config/paths"

export const guestLoader = async () => {
  let { accessToken, role } = useAuthStore.getState()

  if (!accessToken) {
    try {
      accessToken = await useAuthStore.getState().actions.reissue()
      role = useAuthStore.getState().role
    } catch {
      return null
    }
  }

  if (accessToken)
    throw redirect(
      role === "ADMIN" ? PATHS.HQ.DASHBOARD : PATHS.BRANCH.DASHBOARD
    )

  return null
}
