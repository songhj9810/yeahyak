import { useNavigate } from "react-router-dom"
import { Button, Result } from "antd"

import { useRole } from "@/features/auth"

import { PATHS } from "@/shared/config/paths"

export default function ForbiddenPage() {
  const navigate = useNavigate()

  const role = useRole()
  const redirectPath =
    role === "ADMIN"
      ? PATHS.HQ.DASHBOARD
      : role === "PHARMACY"
        ? PATHS.BRANCH.DASHBOARD
        : PATHS.AUTH.LOGIN

  return (
    <Result
      status="403"
      title="403"
      subTitle="페이지 접근 권한이 없습니다"
      extra={
        <Button type="primary" onClick={() => navigate(redirectPath)}>
          돌아가기
        </Button>
      }
    />
  )
}
