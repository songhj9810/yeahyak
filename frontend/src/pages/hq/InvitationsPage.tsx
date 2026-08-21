import { useState } from "react"
import type { BadgeProps, TableProps } from "antd"
import { Badge, Flex, Radio, Space, Table, Typography } from "antd"
import dayjs from "dayjs"

import { useMyAdmin } from "@/features/admin"
import { USER_ROLE_LABEL, type UserRole } from "@/features/auth"
import {
  INVITATION_STATUS_LABEL,
  type InvitationResponse,
  type InvitationStatus,
  InviteModal,
  useInvitations,
} from "@/features/invitation"

import { PAGE_SIZE } from "@/shared/config/constants"
import { formatDateTime } from "@/shared/lib/formatDate"

import styles from "./InvitationsPage.module.css"

const { Title } = Typography

const roleOptions = [
  { value: "all", label: "전체" },
  ...Object.entries(USER_ROLE_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const statusOptions = [
  { value: "all", label: "전체" },
  ...Object.entries(INVITATION_STATUS_LABEL)
    .filter(([value]) => value !== "EXPIRED") // EXPIRED는 프론트엔드에서 계산하므로 필터 옵션에서 제외
    .map(([value, label]) => ({ value, label })),
]

const columns: TableProps<InvitationResponse>["columns"] = [
  {
    title: "번호",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "이메일",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "권한",
    dataIndex: "role",
    key: "role",
    render: (role: UserRole) => USER_ROLE_LABEL[role],
  },
  {
    title: "상태",
    dataIndex: "status",
    key: "status",
    render: (status: InvitationStatus, record) => {
      const value =
        status === "PENDING" && dayjs().isAfter(dayjs(record.expiresAt))
          ? "EXPIRED"
          : status
      const STATUS: Record<InvitationStatus, BadgeProps["status"]> = {
        PENDING: "processing",
        USED: "success",
        EXPIRED: "default",
      }
      return (
        <Badge status={STATUS[value]} text={INVITATION_STATUS_LABEL[value]} />
      )
    },
  },
  {
    title: "생성일시",
    dataIndex: "createdAt",
    key: "createdAt",
    render: formatDateTime,
  },
  {
    title: "만료일시",
    dataIndex: "expiresAt",
    key: "expiresAt",
    render: formatDateTime,
  },
  {
    title: "담당자",
    key: "admin",
    render: (_, record) => `${record.adminName} (${record.adminEmployeeId})`,
  },
]

export default function InvitationsPage() {
  const [role, setRole] = useState<UserRole | "all">("all")
  const [status, setStatus] = useState<InvitationStatus | "all">("all")
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const { data: admin } = useMyAdmin()
  const { data: invitations, isLoading } = useInvitations({
    role: role === "all" ? undefined : role,
    status: status === "all" ? undefined : status,
    page,
    size: PAGE_SIZE,
  })

  const canInvite = admin?.department === "MANAGEMENT"

  return (
    <div className={styles.container}>
      <Flex justify="space-between" align="center" gap="small" wrap>
        <Title level={3}>초대 목록</Title>

        <InviteModal disabled={!canInvite} />
      </Flex>

      <Space align="center" wrap>
        <Radio.Group
          name="role"
          value={role}
          options={roleOptions}
          optionType="button"
          onChange={(e) => {
            setRole(e.target.value)
            setPage(0)
          }}
        />

        <Radio.Group
          name="status"
          value={status}
          options={statusOptions}
          optionType="button"
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(0)
          }}
        />
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={invitations?.content}
        loading={isLoading}
        sticky={{ offsetHeader: 64 }}
        scroll={{ x: "max-content" }}
        pagination={{
          current: (invitations?.page ?? 0) + 1,
          pageSize: PAGE_SIZE,
          total: invitations?.totalElements,
          onChange: (page) => setPage(page - 1),
          placement: ["bottomCenter"],
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
