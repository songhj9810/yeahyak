import { App, Button, Popconfirm } from "antd"

import { useCompleteReturn } from "../hooks/useManageReturnStatus"

type CompleteButtonProps = {
  returnId: number
}

export function CompleteButton({ returnId }: CompleteButtonProps) {
  const { message } = App.useApp()

  const { mutate: completeReturn, isPending } = useCompleteReturn(returnId)

  const handleComplete = () => {
    completeReturn(undefined, {
      onSuccess: () => message.success("반품 요청을 완료 상태로 변경했습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <Popconfirm
      title="반품 요청을 완료 상태로 변경하시겠습니까?"
      placement="topRight"
      onConfirm={handleComplete}
    >
      <Button loading={isPending}>완료</Button>
    </Popconfirm>
  )
}
