import { App, Button, Popconfirm } from "antd"

import { useProcessReturn } from "../hooks/useManageReturnStatus"

type ProcessButtonProps = {
  returnId: number
}

export function ProcessButton({ returnId }: ProcessButtonProps) {
  const { message } = App.useApp()

  const { mutate: processReturn, isPending } = useProcessReturn(returnId)

  const handleProcess = () => {
    processReturn(undefined, {
      onSuccess: () => message.success("반품 요청을 처리 중으로 변경했습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <Popconfirm
      title="반품 요청을 처리 중으로 변경하시겠습니까?"
      placement="topRight"
      onConfirm={handleProcess}
    >
      <Button loading={isPending}>처리</Button>
    </Popconfirm>
  )
}
