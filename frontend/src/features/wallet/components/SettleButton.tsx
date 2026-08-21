import { App, Button, Popconfirm } from "antd"

import { useSettle } from "../hooks/useSettle"

type SettleButtonProps = {
  pharmacyId: number
  pharmacyName: string
}

export function SettleButton({ pharmacyId, pharmacyName }: SettleButtonProps) {
  const { message } = App.useApp()

  const { mutate: settle, isPending } = useSettle(pharmacyId)

  const handleSettle = () => {
    settle(undefined, {
      onSuccess: () => message.success("정산처리가 완료되었습니다"),
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <Popconfirm
      title={`${pharmacyName} 정산처리 하시겠습니까?`}
      placement="topRight"
      onConfirm={handleSettle}
    >
      <Button block loading={isPending}>
        정산
      </Button>
    </Popconfirm>
  )
}
