import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom"
import { Button, Result } from "antd"

import { useRole } from "@/features/auth"

import { PATHS } from "@/shared/config/paths"

export default function RouteErrorPage() {
  const navigate = useNavigate()

  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? error.data
    : "오류가 발생했습니다"

  const role = useRole()
  const redirectPath =
    role === "ADMIN"
      ? PATHS.HQ.DASHBOARD
      : role === "PHARMACY"
        ? PATHS.BRANCH.DASHBOARD
        : PATHS.AUTH.LOGIN

  return (
    <Result
      status="error"
      title={message}
      subTitle="요청하신 페이지를 불러오는 중에 오류가 발생했습니다"
      extra={
        <Button type="primary" onClick={() => navigate(redirectPath)}>
          돌아가기
        </Button>
      }
    />
  )
}
