import { App, Button, Popconfirm } from "antd"

import { useApproveReturn } from "../hooks/useManageReturnStatus"

type ApproveButtonProps = {
  returnId: number
}

export function ApproveButton({ returnId }: ApproveButtonProps) {
  const { message } = App.useApp()

  const { mutate: approveReturn, isPending } = useApproveReturn(returnId)

  const handleApprove = () => {
    approveReturn(undefined, {
      onSuccess: () => message.success("반품 요청을 승인했습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <Popconfirm
      title="반품 요청을 승인하시겠습니까?"
      placement="topRight"
      onConfirm={handleApprove}
    >
      <Button loading={isPending}>승인</Button>
    </Popconfirm>
  )
}
