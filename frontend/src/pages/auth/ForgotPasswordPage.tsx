import { useState } from "react"
import { Link } from "react-router-dom"
import { LeftOutlined } from "@ant-design/icons"
import { Flex, Typography } from "antd"

import { MailSendForm } from "@/features/auth"

import { PATHS } from "@/shared/config/paths"

import { forgotPasswordBannerAfter, forgotPasswordBannerBefore } from "@/assets"

import styles from "./ForgotPasswordPage.module.css"

const { Text, Title } = Typography

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleMailSent = (email: string) => {
    setEmail(email)
    setSent(true)
  }

  return (
    <div className={styles.container}>
      {/* 좌측 이미지 영역 */}
      <div className={styles.banner}>
        <img
          src={!sent ? forgotPasswordBannerBefore : forgotPasswordBannerAfter}
          alt=""
          aria-hidden="true"
        />
      </div>
      {/* 우측 폼 영역 */}
      <div className={styles.content}>
        {!sent ? (
          <>
            <Flex vertical justify="center" align="center" gap="small">
              <Title level={3}>비밀번호를 잊으셨나요?</Title>
              <Text type="secondary">
                가입하신 이메일 주소로 비밀번호 재설정 링크를 보내드립니다
              </Text>
            </Flex>

            <MailSendForm onMailSent={handleMailSent} />
          </>
        ) : (
          <>
            <Flex vertical justify="center" align="center" gap="small">
              <Title level={3}>메일을 보냈습니다</Title>
            </Flex>

            <Text>
              <Text mark>{email}</Text>으로 비밀번호 재설정 링크를 보냈습니다!
            </Text>
            <Text>메일이 보이지 않으면 스팸함을 확인해주세요.</Text>
          </>
        )}

        <Link to={PATHS.AUTH.LOGIN}>
          <Text className={styles.backLink} type="secondary">
            <LeftOutlined className={styles.backIcon} /> 로그인으로 돌아가기
          </Text>
        </Link>
      </div>
    </div>
  )
}
