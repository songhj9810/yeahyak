import { useLoaderData } from "react-router-dom"
import { Flex, Typography } from "antd"

import type { signupLoader } from "@/app/router/loaders/signupLoader"

import { AdminSignupForm, PharmacySignupForm } from "@/features/auth"

import { logo, signupBanner } from "@/assets"

import styles from "./SignupPage.module.css"

const { Title } = Typography

export default function SignupPage() {
  const { email, role, token } = useLoaderData<typeof signupLoader>()

  return (
    <div className={styles.container}>
      {/* 좌측 이미지 영역 */}
      <div className={styles.banner}>
        <img src={signupBanner} alt="" aria-hidden="true" />
      </div>
      {/* 우측 폼 영역 */}
      <div className={styles.content}>
        <Flex vertical justify="center" align="center" gap="small">
          <img src={logo} alt="로고" />
          <Title level={3}>
            {role === "ADMIN" ? "본사 직원 회원가입" : "가맹점 약국 회원가입"}
          </Title>
        </Flex>

        {role === "ADMIN" ? (
          <AdminSignupForm email={email} token={token} />
        ) : (
          <PharmacySignupForm email={email} token={token} />
        )}
      </div>
    </div>
  )
}
