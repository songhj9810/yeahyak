import { useNavigate } from "react-router-dom"
import { Button, Result } from "antd"

import { useRole } from "@/features/auth"

import { PATHS } from "@/shared/config/paths"

export default function NotFoundPage() {
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
      status="404"
      title="404"
      subTitle="페이지를 찾을 수 없습니다"
      extra={
        <Button type="primary" onClick={() => navigate(redirectPath)}>
          돌아가기
        </Button>
      }
    />
  )
}
