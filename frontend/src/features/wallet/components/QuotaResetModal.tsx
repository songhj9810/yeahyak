import { useState } from "react"
import { App, Button, Form, InputNumber, Modal } from "antd"

import { UI_WIDTH } from "@/shared/config/constants"

import { useResetQuota } from "../hooks/useResetQuota"
import type { QuotaResetRequest } from "../types/dto"

type QuotaResetModalProps = {
  pharmacyId: number
  currentQuota?: number
}

export function QuotaResetModal({
  pharmacyId,
  currentQuota,
}: QuotaResetModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<QuotaResetRequest>()

  const [open, setOpen] = useState(false)

  const { mutate: resetQuota, isPending } = useResetQuota(pharmacyId)

  const onFinish = (values: QuotaResetRequest) => {
    resetQuota(values.newQuota, {
      onSuccess: () => {
        message.success("한도를 재설정했습니다")
        setOpen(false)
      },
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <>
      <Button block onClick={() => setOpen(true)} loading={isPending}>
        한도 재설정
      </Button>

      <Modal
        title="한도 재설정"
        open={open}
        width={UI_WIDTH.MODAL}
        centered
        okText="저장"
        cancelText="취소"
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
        confirmLoading={isPending}
        destroyOnHidden
      >
        <Form
          form={form}
          validateTrigger="onBlur"
          onFinish={onFinish}
          clearOnDestroy
        >
          <Form.Item style={{ marginBottom: 8 }} label="기존 한도">
            <InputNumber
              style={{ width: "100%" }}
              variant="borderless"
              value={currentQuota}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              suffix="원"
              readOnly
            />
          </Form.Item>

          <Form.Item
            name="newQuota"
            label="새 한도"
            validateFirst
            rules={[
              { required: true, message: "새 한도를 입력해주세요" },
              {
                type: "number",
                min: 0,
                message: "한도는 0원 이상이어야 합니다",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              step={100000}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number(v?.replace(/\D/g, ""))}
              suffix="원"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
