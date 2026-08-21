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

import {
  CancelButton,
  CompleteButton,
  ORDER_STATUS_LABEL,
  OrderExpandedRow,
  type OrderListResponse,
  type OrderStatus,
  ProcessButton,
  useOrders,
  useOrderStatistics,
} from "@/features/order"
import { PHARMACY_REGION_LABEL, type PharmacyRegion } from "@/features/pharmacy"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { formatDateTime, formatLocalDateTime } from "@/shared/lib/formatDate"

import styles from "./OrdersPage.module.css"

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
  ...Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const columns: TableProps<OrderListResponse>["columns"] = [
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
    render: (status: OrderStatus) => {
      const STATUS: Record<OrderStatus, BadgeProps["status"]> = {
        PENDING: "processing",
        PROCESSING: "warning",
        COMPLETED: "success",
        CANCELED: "default",
      }
      return <Badge status={STATUS[status]} text={ORDER_STATUS_LABEL[status]} />
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
              <ProcessButton orderId={record.id} />
              <CancelButton orderId={record.id} />
            </>
          )}
          {record.status === "PROCESSING" && (
            <CompleteButton orderId={record.id} />
          )}
        </>
      </Flex>
    ),
  },
]

export default function HqOrdersPage() {
  const [region, setRegion] = useState<PharmacyRegion | "all">("all")
  const [status, setStatus] = useState<OrderStatus | "all">("all")
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const { data: stats, isLoading: isStatsLoading } = useOrderStatistics()
  const { data: orders, isLoading: isOrdersLoading } = useOrders({
    region: region === "all" ? undefined : region,
    status: status === "all" ? undefined : status,
    start,
    end,
    page,
    size: PAGE_SIZE,
  })

  return (
    <div className={styles.container}>
      <Title level={3}>발주 요청 관리</Title>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="당월 발주 요청"
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
              title="당월 발주 총액"
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
        dataSource={orders?.content}
        loading={isOrdersLoading}
        sticky={{ offsetHeader: 64 }}
        scroll={{ x: "max-content" }}
        expandable={{
          expandedRowRender: (record) => (
            <OrderExpandedRow orderId={record.id} />
          ),
          expandRowByClick: true,
        }}
        pagination={{
          current: (orders?.page ?? 0) + 1,
          pageSize: PAGE_SIZE,
          total: orders?.totalElements,
          onChange: (page) => setPage(page - 1),
          placement: ["bottomCenter"],
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
