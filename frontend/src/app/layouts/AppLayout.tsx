import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { Layout, Spin } from "antd"

import styles from "./AppLayout.module.css"

export default function AppLayout() {
  return (
    <Layout className={styles.layout}>
      <Layout.Content className={styles.content}>
        <Suspense fallback={<Spin size="large" />}>
          <Outlet />
        </Suspense>
      </Layout.Content>
    </Layout>
  )
}
