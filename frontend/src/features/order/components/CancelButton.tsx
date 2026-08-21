import { App, Button, Popconfirm } from "antd"

import { useCancelOrder } from "../hooks/useManageOrderStatus"

type CancelButtonProps = {
  orderId: number
}

export function CancelButton({ orderId }: CancelButtonProps) {
  const { message } = App.useApp()

  const { mutate: cancelOrder, isPending } = useCancelOrder(orderId)

  const handleCancel = () => {
    cancelOrder(undefined, {
      onSuccess: () => message.success("발주 요청을 취소했습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <Popconfirm
      title="발주 요청을 취소하시겠습니까?"
      placement="topRight"
      okType="danger"
      cancelText="닫기"
      onConfirm={handleCancel}
    >
      <Button danger loading={isPending}>
        취소
      </Button>
    </Popconfirm>
  )
}
