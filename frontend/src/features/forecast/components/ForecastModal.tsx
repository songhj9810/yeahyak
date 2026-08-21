import { useState } from "react"
import { RocketOutlined } from "@ant-design/icons"
import {
  App,
  Button,
  Form,
  InputNumber,
  Modal,
  Popover,
  Typography,
} from "antd"

import { UI_WIDTH } from "@/shared/config/constants"
import { formatRelativeTime } from "@/shared/lib/formatDate"

import { useForecast } from "../hooks/useForecast"
import { useLastSalesUpload } from "../hooks/useLastSalesUpload"
import type { ForecastRequest } from "../types/dto"

const { Text, Paragraph } = Typography

export function ForecastModal() {
  const { message } = App.useApp()
  const [form] = Form.useForm<ForecastRequest>()

  const [open, setOpen] = useState(false)

  const { data: lastUpload } = useLastSalesUpload()

  const { mutate: forecast, isPending } = useForecast()

  const onFinish = (values: ForecastRequest) => {
    forecast(values, {
      onSuccess: () => {
        message.success("AI 발주 추천이 완료되었습니다")
        setOpen(false)
      },
      onError: (error) => message.error(error.message),
    })
  }

  return (
    <>
      <Popover
        content={
          <Text type={lastUpload?.outdated ? "danger" : "secondary"}>
            {lastUpload?.createdAt
              ? `마지막 업로드: ${formatRelativeTime(lastUpload.createdAt)}`
              : "판매 데이터가 없어 추천을 받을 수 없습니다"}
          </Text>
        }
        placement="right"
      >
        <Button
          icon={<RocketOutlined />}
          onClick={() => setOpen(true)}
          loading={isPending}
          disabled={lastUpload?.outdated}
        >
          AI 발주 추천 받기
        </Button>
      </Popover>

      <Modal
        title="AI 발주 추천"
        open={open}
        width={UI_WIDTH.MODAL}
        centered
        okText="추천 받기"
        cancelText="취소"
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
        confirmLoading={isPending}
        destroyOnHidden
      >
        <Paragraph strong>
          <Text strong type={lastUpload?.outdated ? "warning" : "success"}>
            {formatRelativeTime(lastUpload?.createdAt)}
          </Text>{" "}
          판매 데이터를 기반으로 추천을 진행합니다
        </Paragraph>

        <Paragraph type="secondary">
          누적된 판매 데이터를 기반으로 발주량을 예측합니다 따라서 최신 데이터가
          아닐 경우 예측에 오차가 발생할 수 있습니다
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ forecastDays: 3 }}
          validateTrigger="onBlur"
          onFinish={onFinish}
          clearOnDestroy
        >
          <Form.Item
            name="forecastDays"
            label="앞으로 며칠 간의 발주량을 예측할까요?"
            validateFirst
            rules={[
              { required: true, message: "예측 일수를 입력해주세요" },
              {
                type: "number",
                min: 1,
                message: "예측 일수는 1일 이상이어야 합니다",
              },
            ]}
          >
            <InputNumber min={1} max={14} suffix="일" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
