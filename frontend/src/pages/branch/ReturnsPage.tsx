import { useState } from "react"
import type { BadgeProps, TableProps } from "antd"
import {
  App,
  Badge,
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Typography,
} from "antd"

import { OrderSelectModal, useReturnableOrder } from "@/features/order"
import {
  CartTable,
  type MyReturnListResponse,
  RETURN_STATUS_LABEL,
  type ReturnCartItem,
  type ReturnCreateRequest,
  ReturnExpandedRow,
  type ReturnStatus,
  useCreateReturn,
  useMyReturns,
  useReturnCartActions,
  useReturnCartItems,
  useReturnCartOrderId,
} from "@/features/return"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { formatDateTime, formatLocalDateTime } from "@/shared/lib/formatDate"

import styles from "./ReturnsPage.module.css"

const { Title } = Typography

const statusOptions = [
  { value: "all", label: "전체 상태" },
  ...Object.entries(RETURN_STATUS_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]

const columns: TableProps<MyReturnListResponse>["columns"] = [
  {
    title: "번호",
    dataIndex: "id",
    key: "id",
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
    title: "요청일시",
    dataIndex: "createdAt",
    key: "createdAt",
    render: formatDateTime,
  },
]

export default function ReturnsPage() {
  const { message } = App.useApp()
  const [form] = Form.useForm<Pick<ReturnCreateRequest, "returnReason">>()

  const [status, setStatus] = useState<ReturnStatus | "all">("all")
  const [start, setStart] = useState<string | undefined>()
  const [end, setEnd] = useState<string | undefined>()
  const [page, setPage] = useState(0) // 현재 페이지 0-indexed

  const orderId = useReturnCartOrderId()
  const items = useReturnCartItems()
  const { addToCart, clearCart } = useReturnCartActions()

  const [selectedOrderItemId, setSelectedOrderItemId] = useState()
  const [quantity, setQuantity] = useState(1)

  const { data: returnableOrder } = useReturnableOrder(orderId)
  const { data: returns, isLoading: isReturnsLoading } = useMyReturns({
    status: status === "all" ? undefined : status,
    start,
    end,
    page,
    size: PAGE_SIZE,
  })

  const { mutate: createReturn, isPending } = useCreateReturn()

  const selectedOrderItem = returnableOrder?.orderItems.find(
    (item) => item.id === selectedOrderItemId
  )

  // 선택된 상품의 반품 가능 수량 - 이미 카트에 담긴 수량
  const remaining = selectedOrderItem
    ? selectedOrderItem.returnableQuantity -
      (items.find((i) => i.orderItemId === selectedOrderItem.id)?.quantity ?? 0)
    : 0

  const handleAddToCart = () => {
    if (!selectedOrderItem) return
    const item: ReturnCartItem = {
      orderItemId: selectedOrderItem.id,
      returnableQuantity: selectedOrderItem.returnableQuantity,
      productId: selectedOrderItem.productId,
      productName: selectedOrderItem.name,
      subCategory: selectedOrderItem.subCategory,
      price: selectedOrderItem.price,
      imageUrl: selectedOrderItem.imageUrl,
      quantity,
    }
    addToCart(item)
    setSelectedOrderItemId(undefined)
    setQuantity(1)
  }

  const handleReturn = (values: Pick<ReturnCreateRequest, "returnReason">) => {
    if (!orderId) return
    createReturn(
      {
        orderId,
        returnReason: values.returnReason,
        returnOrderItems: items.map(({ orderItemId, quantity }) => ({
          orderItemId,
          quantity,
        })),
      },
      {
        onSuccess: () => {
          message.success("반품을 요청했습니다")
          clearCart()
          form.resetFields()
          setSelectedOrderItemId(undefined)
        },
        onError: (error) => message.error(error.message),
      }
    )
  }

  return (
    <div className={styles.container}>
      <Title level={3}>반품 관리</Title>

      <Flex justify="start" align="center" gap="small">
        <OrderSelectModal />

        <Button danger onClick={clearCart} disabled={items.length === 0}>
          초기화
        </Button>
      </Flex>

      {orderId && (
        <Title level={5}>{`발주 #${orderId}에 대한 반품 진행 중`}</Title>
      )}

      <Flex justify="space-between" align="center" gap="small" wrap>
        <Space align="center" wrap>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="상품 선택"
            layout="vertical"
          >
            <Select
              style={{ width: "fit-content" }}
              options={returnableOrder?.orderItems
                .filter((item) => {
                  const inCart =
                    items.find((i) => i.orderItemId === item.id)?.quantity ?? 0
                  return item.returnableQuantity - inCart > 0
                })
                .map((item) => ({ value: item.id, label: item.name }))}
              value={selectedOrderItemId}
              placeholder="상품 선택"
              popupMatchSelectWidth={false}
              onChange={(value) => {
                setSelectedOrderItemId(value)
                setQuantity(1)
              }}
              disabled={!orderId}
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="반품 가능 수량"
            layout="vertical"
          >
            <InputNumber
              style={{ width: 80 }}
              value={remaining || undefined}
              suffix="개"
              readOnly
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="수량 선택"
            layout="vertical"
          >
            <InputNumber
              style={{ width: UI_WIDTH.SPINNER }}
              mode="spinner"
              min={1}
              max={remaining || undefined}
              value={quantity}
              onChange={(value) => setQuantity(value ?? 1)}
              disabled={!selectedOrderItemId}
            />
          </Form.Item>
        </Space>

        <Button
          type="primary"
          onClick={handleAddToCart}
          disabled={!selectedOrderItem}
        >
          항목 추가
        </Button>
      </Flex>

      <CartTable />

      <Form form={form} onFinish={handleReturn} clearOnDestroy>
        <Form.Item name="returnReason" label="반품 사유">
          <Input.TextArea
            variant="filled"
            placeholder="반품 사유를 입력해주세요 (선택)"
            rows={2}
            allowClear
          />
        </Form.Item>

        <Flex justify="end" align="center">
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            disabled={!orderId || items.length === 0}
          >
            반품 요청
          </Button>
        </Flex>
      </Form>

      <Divider />

      <Title level={4}>반품 내역</Title>

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
