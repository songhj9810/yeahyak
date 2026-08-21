import { useState } from "react"
import { green, red } from "@ant-design/colors"
import type { BadgeProps, TableProps } from "antd"
import {
  App,
  Badge,
  Button,
  Col,
  DatePicker,
  Divider,
  Flex,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd"

import { ForecastModal } from "@/features/forecast"
import {
  CancelButton,
  CartTable,
  type MyOrderListResponse,
  ORDER_STATUS_LABEL,
  OrderExpandedRow,
  type OrderStatus,
  useCreateOrder,
  useMyOrders,
  useOrderCartActions,
  useOrderCartItems,
} from "@/features/order"
import { useMyWallet } from "@/features/wallet"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { formatDateTime, formatLocalDateTime } from "@/shared/lib/formatDate"

import styles from "./OrdersPage.module.css"

const { Title } = Typography

const statusOptions = [
  { value: "all", label: "전체 상태" },
  ...Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const columns: TableProps<MyOrderListResponse>["columns"] = [
  {
    title: "번호",
    dataIndex: "id",
    key: "id",
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
    title: "요청일시",
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
        onClick={(e) => e.stopPropagation()}
      >
        {record.status === "PENDING" && <CancelButton orderId={record.id} />}
      </Flex>
    ),
  },
]

export default function OrdersPage() {
  const { message } = App.useApp()

  const [status, setStatus] = useState<OrderStatus | "all">("all")
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const items = useOrderCartItems()
  const { clearCart } = useOrderCartActions()

  const { data: wallet, isLoading: isWalletLoading } = useMyWallet()
  const { data: orders, isLoading: isOrdersLoading } = useMyOrders({
    status: status === "all" ? undefined : status,
    start,
    end,
    page,
    size: PAGE_SIZE,
  })

  const { mutate: createOrder, isPending } = useCreateOrder()

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleOrder = () => {
    createOrder(
      {
        orderItems: items.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
      },
      {
        onSuccess: () => {
          message.success("발주를 요청했습니다")
          clearCart()
        },
        onError: (error) => message.error(error.message),
      }
    )
  }

  return (
    <div className={styles.container}>
      <Title level={3}>발주 관리 / 장바구니</Title>

      <Flex justify="space-between" align="center" gap="small" wrap>
        <Flex justify="start" align="center" gap="small">
          <ForecastModal />

          <Button danger onClick={clearCart} disabled={items.length === 0}>
            장바구니 비우기
          </Button>
        </Flex>

        <Button
          type="primary"
          onClick={handleOrder}
          loading={isPending}
          disabled={items.length === 0 || (wallet?.balance ?? 0) < totalPrice}
        >
          발주 요청
        </Button>
      </Flex>

      <CartTable />

      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col xs={24} md={8}>
          <Flex justify="center" align="center">
            <Statistic
              title="현재 잔액"
              value={wallet?.balance.toLocaleString() ?? 0}
              suffix="원"
              loading={isWalletLoading}
            />
          </Flex>
        </Col>

        <Col xs={24} md={8}>
          <Flex justify="center" align="center">
            <Statistic
              title="합계 금액"
              value={totalPrice.toLocaleString()}
              suffix="원"
            />
          </Flex>
        </Col>

        <Col xs={24} md={8}>
          <Flex justify="center" align="center">
            <Statistic
              styles={{
                content: {
                  color:
                    (wallet?.balance ?? 0) < totalPrice
                      ? red.primary
                      : green.primary,
                },
              }}
              title="주문 후 예상 잔액"
              value={((wallet?.balance ?? 0) - totalPrice).toLocaleString()}
              suffix="원"
              loading={isWalletLoading}
            />
          </Flex>
        </Col>
      </Row>

      <Divider />

      <Title level={4}>발주 내역</Title>

      <Space align="center" wrap>
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
