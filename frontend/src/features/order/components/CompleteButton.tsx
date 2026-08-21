import { App, Button, Popconfirm } from "antd"

import { useCompleteOrder } from "../hooks/useManageOrderStatus"

type CompleteButtonProps = {
  orderId: number
}

export function CompleteButton({ orderId }: CompleteButtonProps) {
  const { message } = App.useApp()

  const { mutate: completeOrder, isPending } = useCompleteOrder(orderId)

  const handleComplete = () => {
    completeOrder(undefined, {
      onSuccess: () => message.success("발주 요청을 완료 상태로 변경했습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <Popconfirm
      title="발주 요청을 완료 상태로 변경하시겠습니까?"
      placement="topRight"
      onConfirm={handleComplete}
    >
      <Button loading={isPending}>완료</Button>
    </Popconfirm>
  )
}
