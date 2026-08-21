import { Link, useLoaderData } from "react-router-dom"
import { LeftOutlined } from "@ant-design/icons"
import { Flex, Typography } from "antd"

import type { resetPasswordLoader } from "@/app/router/loaders/resetPasswordLoader"

import { PasswordResetForm } from "@/features/auth"

import { PATHS } from "@/shared/config/paths"

import { resetPasswordBanner } from "@/assets"

import styles from "./ResetPasswordPage.module.css"

const { Text, Title } = Typography

export default function ResetPasswordPage() {
  const { token } = useLoaderData<typeof resetPasswordLoader>()

  return (
    <div className={styles.container}>
      {/* 좌측 이미지 영역 */}
      <div className={styles.banner}>
        <img src={resetPasswordBanner} alt="" aria-hidden="true" />
      </div>
      {/* 우측 폼 영역 */}
      <div className={styles.content}>
        <Flex vertical justify="center" align="center" gap="small">
          <Title level={3}>비밀번호 재설정</Title>
          <Text type="secondary">새로운 비밀번호를 입력해주세요</Text>
        </Flex>

        <PasswordResetForm token={token} />

        <Link to={PATHS.AUTH.LOGIN}>
          <Text className={styles.backLink} type="secondary">
            <LeftOutlined className={styles.backIcon} /> 로그인으로 돌아가기
          </Text>
        </Link>
      </div>
    </div>
  )
}
