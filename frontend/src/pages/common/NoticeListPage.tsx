import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import type { TableProps, TabsProps } from "antd"
import {
  Button,
  Flex,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd"

import { useRole } from "@/features/auth"
import {
  NOTICE_CATEGORY_LABEL,
  type NoticeCategory,
  type NoticeListResponse,
  useNoticeFilter,
  useNotices,
} from "@/features/notice"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { PATHS } from "@/shared/config/paths"
import { formatDate } from "@/shared/lib/formatDate"

import styles from "./NoticeListPage.module.css"

const { Title } = Typography

const tabsItems: TabsProps["items"] = Object.entries(NOTICE_CATEGORY_LABEL).map(
  ([key, label]) => ({ key, label })
)

const filterOptions = [
  { value: "BOTH", label: "제목+내용" },
  { value: "TITLE", label: "제목" },
  { value: "CONTENT", label: "내용" },
]

export default function NoticeListPage() {
  const navigate = useNavigate()
  const role = useRole()

  const { category, filter, keyword, page, setFilter } = useNoticeFilter()

  // 검색 버튼을 누르기 전까지 필터 상태를 로컬로 관리
  const [pendingFilter, setPendingFilter] = useState<
    "BOTH" | "TITLE" | "CONTENT"
  >("BOTH")

  const { data: notices, isLoading } = useNotices({
    category,
    keyword,
    filter,
    page,
    size: PAGE_SIZE,
  })

  const columns: TableProps<NoticeListResponse>["columns"] = [
    {
      title: "번호",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      render: (title: string, record) => (
        <Link
          to={
            role === "ADMIN"
              ? PATHS.HQ.NOTICES.DETAIL(record.id)
              : PATHS.BRANCH.NOTICES.DETAIL(record.id)
          }
        >
          {title}
        </Link>
      ),
      width: "50%",
    },
    {
      title: "작성자",
      dataIndex: "adminName",
      key: "adminName",
      width: "15%",
    },
    {
      title: "작성일",
      dataIndex: "createdAt",
      key: "createdAt",
      render: formatDate,
      width: "25%",
    },
  ]

  return (
    <div className={styles.container}>
      <Flex justify="space-between" align="center" gap="small" wrap>
        <Title level={3}>공지사항</Title>

        {role === "ADMIN" && (
          <Button type="primary" onClick={() => navigate(PATHS.HQ.NOTICES.NEW)}>
            공지사항 작성
          </Button>
        )}
      </Flex>

      <Tabs
        items={tabsItems}
        activeKey={category}
        centered
        onChange={(value) => {
          setPendingFilter("BOTH")
          setFilter({ category: value as NoticeCategory })
        }}
      />

      <Space.Compact>
        <Select
          options={filterOptions}
          value={pendingFilter}
          popupMatchSelectWidth={false}
          onChange={(value) => setPendingFilter(value)}
        />

        <Input.Search
          style={{ width: UI_WIDTH.SEARCH }}
          key={category}
          defaultValue={keyword}
          placeholder="검색어 입력"
          allowClear
          onSearch={(value) => setFilter({ keyword: value, pendingFilter })}
        />
      </Space.Compact>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={notices?.content}
        loading={isLoading}
        sticky={{ offsetHeader: 64 }}
        scroll={{ x: "max-content" }}
        pagination={{
          current: (notices?.page ?? 0) + 1,
          pageSize: PAGE_SIZE,
          total: notices?.totalElements,
          onChange: (page) => setFilter({ page: page - 1 }),
          placement: ["bottomCenter"],
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
