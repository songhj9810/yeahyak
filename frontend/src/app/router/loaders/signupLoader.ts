import type { UserRole } from "@/features/auth"

import { apiClient } from "@/shared/api/client"
import { ApiError, type ApiResponse } from "@/shared/api/types"

type InvitationValidateResponse = {
  email: string
  role: UserRole
}

export const signupLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")

  if (!token) throw new Response("올바르지 않은 접근입니다", { status: 400 })

  try {
    const { data } = await apiClient.get<
      ApiResponse<InvitationValidateResponse>
    >(`/invitations/${token}`)
    return { email: data.data.email, role: data.data.role, token }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "오류가 발생했습니다"
    const status = error instanceof ApiError ? error.status : 500
    throw new Response(message, { status })
  }
}
