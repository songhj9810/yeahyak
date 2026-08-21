import { Suspense, useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  BellOutlined,
  FileTextOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  ProductOutlined,
  RollbackOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons"
import { Button, Dropdown, Layout, Menu, Spin } from "antd"

import { useLogout } from "@/features/auth"
import { Chatbot } from "@/features/chatbot"
import { useMyPharmacy } from "@/features/pharmacy"

import { UI_WIDTH } from "@/shared/config/constants"
import { PATHS } from "@/shared/config/paths"

import { initial, logo } from "@/assets"

import styles from "./BranchLayout.module.css"

const siderItems = [
  {
    key: PATHS.BRANCH.DASHBOARD,
    icon: <HomeOutlined />,
    label: <Link to={PATHS.BRANCH.DASHBOARD}>대시보드</Link>,
  },
  {
    key: PATHS.BRANCH.ORDERS,
    icon: <ShoppingCartOutlined />,
    label: <Link to={PATHS.BRANCH.ORDERS}>발주 관리 / 장바구니</Link>,
  },
  {
    key: PATHS.BRANCH.RETURNS,
    icon: <RollbackOutlined />,
    label: <Link to={PATHS.BRANCH.RETURNS}>반품 관리</Link>,
  },
  {
    key: PATHS.BRANCH.PRODUCTS.LIST,
    icon: <MedicineBoxOutlined />,
    label: <Link to={PATHS.BRANCH.PRODUCTS.LIST}>상품 목록</Link>,
  },
  {
    key: PATHS.BRANCH.INVENTORY,
    icon: <ProductOutlined />,
    label: <Link to={PATHS.BRANCH.INVENTORY}>약국 재고 관리</Link>,
  },
  {
    key: PATHS.BRANCH.WALLET,
    icon: <WalletOutlined />,
    label: <Link to={PATHS.BRANCH.WALLET}>지갑 / 거래 내역</Link>,
  },
  {
    key: PATHS.BRANCH.NOTICES.LIST,
    icon: <FileTextOutlined />,
    label: <Link to={PATHS.BRANCH.NOTICES.LIST}>공지사항</Link>,
  },
]

export default function BranchLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)

  const { data: pharmacy } = useMyPharmacy()

  const { mutate: logout } = useLogout()

  const dropdownItems = [
    {
      key: "profile",
      label: "내 프로필",
      onClick: () => navigate(PATHS.BRANCH.PROFILE),
    },
    {
      key: "password",
      label: "비밀번호 변경",
      onClick: () => navigate(PATHS.AUTH.FORGOT_PASSWORD),
    },
    {
      key: "logout",
      label: "로그아웃",
      danger: true,
      onClick: () => logout(),
    },
  ]

  const selectedKey = siderItems.find((item) =>
    location.pathname.startsWith(item.key)
  )?.key

  return (
    <Layout className={styles.layout}>
      <Layout.Sider
        className={styles.sidebar}
        theme="light"
        width={UI_WIDTH.SIDEBAR}
        collapsible
        breakpoint="lg" // 992px 이하에서 자동으로 collapsed 상태로 전환
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Link className={styles.logo} to={PATHS.BRANCH.DASHBOARD}>
          {collapsed ? (
            <img src={initial} alt="로고" />
          ) : (
            <img src={logo} alt="로고" />
          )}
        </Link>

        <Menu
          items={siderItems}
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
        />
      </Layout.Sider>

      <Layout className={styles.main}>
        <Layout.Header className={styles.header}>
          {/* TODO: 알림 기능 추가 */}
          <Dropdown placement="bottomRight" trigger={["click"]} disabled>
            <Button type="text" icon={<BellOutlined />} shape="circle" />
          </Dropdown>

          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />}>
              {pharmacy?.name}
            </Button>
          </Dropdown>
        </Layout.Header>

        <Layout.Content className={styles.content}>
          <Suspense
            fallback={
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </Layout.Content>
      </Layout>
      <Chatbot />
    </Layout>
  )
}
