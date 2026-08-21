import { redirect } from "react-router-dom"

import { useAuthStore, type UserRole } from "@/features/auth"

import { PATHS } from "@/shared/config/paths"

export const authLoader = (allowed: UserRole) => async () => {
  let { accessToken, role } = useAuthStore.getState()

  if (!accessToken) {
    try {
      accessToken = await useAuthStore.getState().actions.reissue()
      role = useAuthStore.getState().role
    } catch {
      throw redirect(PATHS.AUTH.LOGIN)
    }
  }

  if (!accessToken) throw redirect(PATHS.AUTH.LOGIN)
  if (role !== allowed) throw redirect(PATHS.ERROR.FORBIDDEN)

  return null
}
