import { App, Button, Popconfirm } from "antd"

import { useProcessOrder } from "../hooks/useManageOrderStatus"

type ProcessButtonProps = {
  orderId: number
}

export function ProcessButton({ orderId }: ProcessButtonProps) {
  const { message } = App.useApp()

  const { mutate: processOrder, isPending } = useProcessOrder(orderId)

  const handleProcess = () => {
    processOrder(undefined, {
      onSuccess: () => message.success("발주 요청을 처리 중으로 변경했습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <Popconfirm
      title="발주 요청을 처리 중으로 변경하시겠습니까?"
      placement="topRight"
      onConfirm={handleProcess}
    >
      <Button loading={isPending}>처리</Button>
    </Popconfirm>
  )
}
