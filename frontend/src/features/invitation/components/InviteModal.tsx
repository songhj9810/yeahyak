import { useEffect, useState } from "react"
import { MailOutlined } from "@ant-design/icons"
import { App, Button, Form, Input, Modal, Radio } from "antd"

import { USER_ROLE_LABEL } from "@/features/auth"

import { UI_WIDTH } from "@/shared/config/constants"

import { useInvite } from "../hooks/useInvite"
import type { InvitationCreateRequest } from "../types/dto"

type InviteModalProps = {
  disabled: boolean
}

const roleOptions = Object.entries(USER_ROLE_LABEL).map(([value, label]) => ({
  value,
  label,
}))

export function InviteModal({ disabled }: InviteModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<InvitationCreateRequest>()
  const values = Form.useWatch([], form)

  const [open, setOpen] = useState(false)
  const [submittable, setSubmittable] = useState(false) // validation 통과 여부

  const { mutate: invite, isPending } = useInvite()

  const onFinish = (values: InvitationCreateRequest) => {
    invite(values, {
      onSuccess: () => {
        message.success("초대 메일을 발송했습니다")
        setOpen(false)
      },
      onError: (error) => message.error(error.message),
    })
  }

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false))
  }, [form, values])

  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        loading={isPending}
        disabled={disabled}
      >
        초대 메일 발송
      </Button>

      <Modal
        title="초대 메일 발송"
        open={open}
        width={UI_WIDTH.MODAL}
        centered
        okText="발송"
        cancelText="취소"
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
        confirmLoading={isPending}
        okButtonProps={{ disabled: !submittable }}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          validateTrigger="onBlur"
          onFinish={onFinish}
          clearOnDestroy
        >
          <Form.Item
            name="email"
            label="이메일"
            validateFirst
            rules={[
              { required: true, message: "이메일을 입력해주세요" },
              { type: "email", message: "유효하지 않은 이메일 형식입니다" },
            ]}
          >
            <Input
              styles={{ prefix: { marginInlineEnd: 8 } }}
              prefix={<MailOutlined />}
              placeholder="user@yeahyak.com"
              inputMode="email"
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="권한"
            rules={[{ required: true, message: "권한을 선택해주세요" }]}
          >
            <Radio.Group options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
