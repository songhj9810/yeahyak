import { useState } from "react"
import type { BadgeProps, TableProps } from "antd"
import {
  Badge,
  Card,
  Col,
  DatePicker,
  Flex,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd"

import { PHARMACY_REGION_LABEL, type PharmacyRegion } from "@/features/pharmacy"
import {
  ApproveButton,
  CompleteButton,
  ProcessButton,
  RejectButton,
  RETURN_STATUS_LABEL,
  ReturnExpandedRow,
  type ReturnListResponse,
  type ReturnStatus,
  useReturns,
  useReturnStatistics,
} from "@/features/return"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { formatDateTime, formatLocalDateTime } from "@/shared/lib/formatDate"

import styles from "./ReturnsPage.module.css"

const { Title } = Typography

const regionOptions = [
  { value: "all", label: "전체 지역" },
  ...Object.entries(PHARMACY_REGION_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const statusOptions = [
  { value: "all", label: "전체 상태" },
  ...Object.entries(RETURN_STATUS_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const columns: TableProps<ReturnListResponse>["columns"] = [
  {
    title: "번호",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "약국명",
    dataIndex: "pharmacyName",
    key: "pharmacyName",
  },
  {
    title: "상태",
    dataIndex: "status",
    key: "status",
    render: (status: ReturnStatus) => {
      const STATUS: Record<ReturnStatus, BadgeProps["status"]> = {
        PENDING: "processing",
        APPROVED: "default",
        REJECTED: "error",
        PROCESSING: "warning",
        COMPLETED: "success",
      }
      return (
        <Badge status={STATUS[status]} text={RETURN_STATUS_LABEL[status]} />
      )
    },
  },
  {
    title: "요약",
    dataIndex: "summary",
    key: "summary",
  },
  {
    title: "총액",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render: (totalPrice: number) => `${totalPrice.toLocaleString()}원`,
  },
  {
    title: "생성일시",
    dataIndex: "createdAt",
    key: "createdAt",
    render: formatDateTime,
  },
  {
    title: "",
    key: "actions",
    render: (_, record) => (
      <Flex
        justify="center"
        align="center"
        gap="small"
        onClick={(e) => e.stopPropagation()}
      >
        <>
          {record.status === "PENDING" && (
            <>
              <ApproveButton returnId={record.id} />
              <RejectButton returnId={record.id} />
            </>
          )}
          {record.status === "APPROVED" && (
            <ProcessButton returnId={record.id} />
          )}
          {record.status === "PROCESSING" && (
            <CompleteButton returnId={record.id} />
          )}
        </>
      </Flex>
    ),
  },
]

export default function HqReturnsPage() {
  const [region, setRegion] = useState<PharmacyRegion | "all">("all")
  const [status, setStatus] = useState<ReturnStatus | "all">("all")
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const { data: stats, isLoading: isStatsLoading } = useReturnStatistics()
  const { data: returns, isLoading: isReturnsLoading } = useReturns({
    region: region === "all" ? undefined : region,
    status: status === "all" ? undefined : status,
    start,
    end,
    page,
    size: PAGE_SIZE,
  })

  return (
    <div className={styles.container}>
      <Title level={3}>반품 요청 관리</Title>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="당월 반품 요청"
              value={stats?.total ?? 0}
              loading={isStatsLoading}
            />
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="처리 중"
              value={stats?.processing ?? 0}
              loading={isStatsLoading}
            />
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="처리 완료"
              value={stats?.completed ?? 0}
              loading={isStatsLoading}
            />
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="당월 반품 총액"
              value={stats?.totalAmount.toLocaleString() ?? 0}
              loading={isStatsLoading}
              suffix="원"
            />
          </Card>
        </Col>
      </Row>

      <Space align="center" wrap>
        <Select
          style={{ width: "fit-content" }}
          options={regionOptions}
          value={region}
          popupMatchSelectWidth={false}
          onChange={(value) => {
            setRegion(value)
            setPage(0)
          }}
        />
        <Select
          style={{ width: "fit-content" }}
          options={statusOptions}
          value={status}
          popupMatchSelectWidth={false}
          onChange={(value) => {
            setStatus(value)
            setPage(0)
          }}
        />
        <DatePicker.RangePicker
          style={{ width: UI_WIDTH.SEARCH }}
          allowEmpty={[true, true]}
          onChange={(values) => {
            setStart(formatLocalDateTime(values?.[0]))
            setEnd(formatLocalDateTime(values?.[1]))
            setPage(0)
          }}
        />
      </Space>

      <Table
        className={styles.table}
        rowKey="id"
        columns={columns}
        dataSource={returns?.content}
        loading={isReturnsLoading}
        sticky={{ offsetHeader: 64 }}
        scroll={{ x: "max-content" }}
        expandable={{
          expandedRowRender: (record) => (
            <ReturnExpandedRow returnId={record.id} />
          ),
          expandRowByClick: true,
        }}
        pagination={{
          current: (returns?.page ?? 0) + 1,
          pageSize: PAGE_SIZE,
          total: returns?.totalElements,
          onChange: (page) => setPage(page - 1),
          placement: ["bottomCenter"],
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
