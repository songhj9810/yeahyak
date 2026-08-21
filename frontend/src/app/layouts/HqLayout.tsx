import { Suspense, useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  BellOutlined,
  FileTextOutlined,
  HomeOutlined,
  InboxOutlined,
  MedicineBoxOutlined,
  ProductOutlined,
  RollbackOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Button, Dropdown, Layout, Menu, Spin } from "antd"

import { useMyAdmin } from "@/features/admin"
import { useLogout } from "@/features/auth"

import { UI_WIDTH } from "@/shared/config/constants"
import { PATHS } from "@/shared/config/paths"

import { initial, logo } from "@/assets"

import styles from "./HqLayout.module.css"

const siderItems = [
  {
    key: PATHS.HQ.DASHBOARD,
    icon: <HomeOutlined />,
    label: <Link to={PATHS.HQ.DASHBOARD}>대시보드</Link>,
  },
  {
    key: PATHS.HQ.ORDERS,
    icon: <InboxOutlined />,
    label: <Link to={PATHS.HQ.ORDERS}>발주 요청 관리</Link>,
  },
  {
    key: PATHS.HQ.RETURNS,
    icon: <RollbackOutlined />,
    label: <Link to={PATHS.HQ.RETURNS}>반품 요청 관리</Link>,
  },
  {
    key: PATHS.HQ.PRODUCTS.LIST,
    icon: <MedicineBoxOutlined />,
    label: <Link to={PATHS.HQ.PRODUCTS.LIST}>상품 관리</Link>,
  },
  {
    key: PATHS.HQ.INVENTORY,
    icon: <ProductOutlined />,
    label: <Link to={PATHS.HQ.INVENTORY}>본사 재고 관리</Link>,
  },
  {
    key: PATHS.HQ.PHARMACIES,
    icon: <ShopOutlined />,
    label: <Link to={PATHS.HQ.PHARMACIES}>약국 관리</Link>,
  },
  {
    key: PATHS.HQ.INVITATIONS,
    icon: <UsergroupAddOutlined />,
    label: <Link to={PATHS.HQ.INVITATIONS}>초대 목록</Link>,
  },
  {
    key: PATHS.HQ.NOTICES.LIST,
    icon: <FileTextOutlined />,
    label: <Link to={PATHS.HQ.NOTICES.LIST}>공지사항</Link>,
  },
]

export default function HqLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)

  const { data: admin } = useMyAdmin()

  const { mutate: logout } = useLogout()

  const dropdownItems = [
    {
      key: "profile",
      label: "내 프로필",
      onClick: () => navigate(PATHS.HQ.PROFILE),
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
        <Link className={styles.logo} to={PATHS.HQ.DASHBOARD}>
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
              {admin?.name}
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
    </Layout>
  )
}
