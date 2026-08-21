import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"

import { useAuthStore } from "@/features/auth/store"

import { PATHS } from "../config/paths"
import { ApiError, type ApiResponse } from "./types"

// 토큰 재발급 중복 요청 방지
let reissuePromise: Promise<string | null> | null = null

const applyInterceptors = (instance: AxiosInstance) => {
  // 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const { accessToken } = useAuthStore.getState()
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    }
  )

  // 응답 인터셉터: 401 Unauthorized 응답 처리
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiResponse<null>>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // 로그인/비밀번호 관련 API는 토큰 만료와 상관없이 401이 발생할 수 있으므로 재발급 로직에서 제외
      const bypass = ["/auth/login", "/auth/password"].some((url) =>
        originalRequest.url?.includes(url)
      )

      // 401 에러가 아니거나 이미 재시도했던 요청이면 바로 에러 반환
      if (error.response?.status !== 401 || originalRequest._retry || bypass) {
        const message = error.response?.data?.message ?? "오류가 발생했습니다"
        const status = error.response?.status ?? 500
        return Promise.reject(new ApiError(message, status))
      }

      originalRequest._retry = true // 무한 루프 방지

      if (!reissuePromise) {
        reissuePromise = useAuthStore
          .getState()
          .actions.reissue()
          .finally(() => {
            reissuePromise = null
          })
      }

      const accessToken = await reissuePromise

      if (!accessToken) {
        window.location.href = PATHS.AUTH.LOGIN
        return Promise.reject(
          new Error("인증이 만료되었습니다. 다시 로그인해주세요.")
        )
      }

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return instance(originalRequest)
    }
  )
}

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true, // refreshToken 쿠키 포함
})

export const aiClient = axios.create({
  baseURL: "/ai",
  withCredentials: true,
})

applyInterceptors(apiClient)
applyInterceptors(aiClient)
