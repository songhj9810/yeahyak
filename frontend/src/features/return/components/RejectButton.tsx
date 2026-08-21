import { useState } from "react"
import { App, Button, Form, Input, Modal } from "antd"

import { UI_WIDTH } from "@/shared/config/constants"

import { useRejectReturn } from "../hooks/useManageReturnStatus"
import type { ReturnRejectRequest } from "../types/dto"

type RejectButtonProps = {
  returnId: number
}

export function RejectButton({ returnId }: RejectButtonProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<ReturnRejectRequest>()

  const [open, setOpen] = useState(false)

  const { mutate: rejectReturn, isPending } = useRejectReturn(returnId)

  const handleReject = (values: ReturnRejectRequest) => {
    rejectReturn(values.rejectReason, {
      onSuccess: () => {
        message.success("반품 요청을 반려했습니다")
        setOpen(false)
      },
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <>
      <Button danger onClick={() => setOpen(true)} loading={isPending}>
        반려
      </Button>

      <Modal
        title="반품 요청을 반려하시겠습니까?"
        open={open}
        width={UI_WIDTH.MODAL}
        centered
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
        confirmLoading={isPending}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          validateTrigger="onBlur"
          onFinish={handleReject}
          clearOnDestroy
        >
          <Form.Item
            name="rejectReason"
            label="반려 사유"
            rules={[{ required: true, message: "반려 사유를 입력해주세요" }]}
          >
            <Input
              variant="underlined"
              placeholder="반려 사유 입력"
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
