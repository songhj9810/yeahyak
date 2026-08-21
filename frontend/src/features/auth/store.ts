import axios from "axios"
import { create } from "zustand"

import type { ApiResponse } from "@/shared/api/types"

import type { UserRole } from "./types/enums"

type ReissueResponse = {
  accessToken: string
  role: UserRole
}

interface AuthState {
  // 상태
  accessToken: string | null
  role: UserRole | null

  // 액션
  actions: {
    setAuth: (accessToken: string, role: UserRole) => void
    clearAuth: () => void
    reissue: () => Promise<string | null>
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  role: null,

  actions: {
    // 로그인 시
    setAuth: (accessToken, role) => set({ accessToken, role }),

    // 로그아웃 시
    clearAuth: () => set({ accessToken: null, role: null }),

    // 토큰 재발급
    reissue: async () => {
      try {
        const { data } = await axios.post<ApiResponse<ReissueResponse>>(
          "/api/auth/reissue",
          {},
          { withCredentials: true }
        )
        set({ accessToken: data.data.accessToken, role: data.data.role })
        return data.data.accessToken
      } catch {
        set({ accessToken: null, role: null })
        return null
      }
    },
  },
}))

export const useAccessToken = () => useAuthStore((state) => state.accessToken)
export const useRole = () => useAuthStore((state) => state.role)

export const useAuthActions = () => useAuthStore((state) => state.actions)
