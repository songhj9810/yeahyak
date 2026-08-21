import { useState } from "react"
import { App, Button, Form, InputNumber, Modal } from "antd"

import { UI_WIDTH } from "@/shared/config/constants"

import {
  useAdjustHqStock,
  useAdjustPharmacyStock,
} from "../hooks/useAdjustStock"
import type { StockAdjustRequest } from "../types/dto"

type StockAdjustModalProps = {
  type: "hq" | "pharmacy"
  stockId: number
  currentStock?: number
}

export function StockAdjustModal({
  type,
  stockId,
  currentStock,
}: StockAdjustModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<StockAdjustRequest>()

  const [open, setOpen] = useState(false)

  const { mutate: adjustHqStock, isPending: isHqPending } =
    useAdjustHqStock(stockId)
  const { mutate: adjustPharmacyStock, isPending: isPharmacyPending } =
    useAdjustPharmacyStock(stockId)

  const adjustStock = type === "hq" ? adjustHqStock : adjustPharmacyStock
  const isPending = type === "hq" ? isHqPending : isPharmacyPending

  const onFinish = (values: StockAdjustRequest) => {
    adjustStock(values.newStock, {
      onSuccess: () => {
        message.success("재고를 조정했습니다")
        setOpen(false)
      },
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <>
      <Button block onClick={() => setOpen(true)} loading={isPending}>
        재고 조정
      </Button>

      <Modal
        title="재고 조정"
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
          <Form.Item style={{ marginBottom: 8 }} label="기존 재고">
            <InputNumber
              style={{ width: "100%" }}
              variant="borderless"
              value={currentStock}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              suffix="개"
              readOnly
            />
          </Form.Item>

          <Form.Item
            name="newStock"
            label="새 재고"
            validateFirst
            rules={[
              { required: true, message: "새 재고를 입력해주세요" },
              {
                type: "number",
                min: 0,
                message: "재고는 0개 이상이어야 합니다",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              step={10}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number(v?.replace(/,/g, ""))}
              suffix="개"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
