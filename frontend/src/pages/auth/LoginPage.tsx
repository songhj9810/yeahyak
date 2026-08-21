import { Flex, Tabs, Typography } from "antd"

import { LoginForm } from "@/features/auth"

import { loginBanner, logo } from "@/assets"

import styles from "./LoginPage.module.css"

const { Title } = Typography

export default function LoginPage() {
  const tabsItems = [
    {
      key: "PHARMACY",
      label: "가맹점",
      children: <LoginForm role="PHARMACY" />,
    },
    {
      key: "ADMIN",
      label: "본사",
      children: <LoginForm role="ADMIN" />,
    },
  ]

  return (
    <div className={styles.container}>
      {/* 좌측 이미지 영역 */}
      <div className={styles.banner}>
        <img src={loginBanner} alt="" aria-hidden="true" />
      </div>
      {/* 우측 폼 영역 */}
      <div className={styles.content}>
        <Flex vertical justify="center" align="center" gap="small">
          <img src={logo} alt="로고" />
          <Title level={3}>로그인</Title>
        </Flex>

        <Tabs items={tabsItems} centered destroyOnHidden />
      </div>
    </div>
  )
}
