import { useState } from "react"
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Flex,
  Modal,
  Pagination,
} from "antd"

import { useReturnCartActions } from "@/features/return"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { formatDateTime } from "@/shared/lib/formatDate"

import { useMyOrders } from "../hooks/useOrder"

export function OrderSelectModal() {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)

  const { setOrderId } = useReturnCartActions()

  const { data: orders, isLoading } = useMyOrders({
    status: "COMPLETED",
    page,
    size: PAGE_SIZE,
  })

  return (
    <>
      <Button onClick={() => setOpen(true)}>발주 선택</Button>

      <Modal
        title="반품할 발주 선택"
        open={open}
        width={UI_WIDTH.MODAL}
        centered
        footer={null}
        onCancel={() => setOpen(false)}
        loading={isLoading}
        destroyOnHidden
      >
        {orders?.content.length === 0 ? (
          <Empty />
        ) : (
          <Flex vertical gap="small">
            {orders?.content.map((order) => (
              <Card
                key={order.id}
                hoverable
                onClick={() => {
                  setOrderId(order.id)
                  setOpen(false)
                }}
              >
                <Descriptions
                  items={[
                    { key: "summary", label: "요약", children: order.summary },
                    {
                      key: "totalPrice",
                      label: "합계",
                      children: `${order.totalPrice.toLocaleString()}원`,
                    },
                    {
                      key: "createdAt",
                      label: "요청일시",
                      children: formatDateTime(order.createdAt),
                    },
                    {
                      key: "updateddAt",
                      label: "완료일시",
                      children: formatDateTime(order.updatedAt),
                    },
                  ]}
                  title={`발주 #${order.id}`}
                  column={2}
                  size="small"
                />
              </Card>
            ))}

            <Pagination
              current={(orders?.page ?? 0) + 1}
              pageSize={PAGE_SIZE}
              total={orders?.totalElements}
              onChange={(page) => setPage(page - 1)}
              size="small"
              align="center"
              showSizeChanger={false}
            />
          </Flex>
        )}
      </Modal>
    </>
  )
}
