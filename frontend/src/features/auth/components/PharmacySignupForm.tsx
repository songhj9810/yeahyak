import { LockOutlined } from "@ant-design/icons"
import { App, Button, Checkbox, Flex, Form, Input } from "antd"

import { AddressSearchModal } from "@/features/pharmacy"

import { useSignupPharmacy } from "../hooks/useSignup"
import type { PharmacySignupRequest } from "../types/dto"

type PharmacySignupFormProps = {
  email: string
  token: string
}

type PharmacySignupFormValues = Omit<PharmacySignupRequest, "token"> & {
  confirmPassword: string
  agreement: boolean
}

export function PharmacySignupForm({ email, token }: PharmacySignupFormProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<PharmacySignupFormValues>()
  const agreed = Form.useWatch("agreement", form)

  const { mutate: signupPharmacy, isPending } = useSignupPharmacy()

  const onFinish = (values: PharmacySignupFormValues) => {
    signupPharmacy(
      {
        token,
        password: values.password,
        brn: values.brn,
        representative: values.representative,
        name: values.name,
        postcode: values.postcode,
        address: values.address,
        addressDetails: values.addressDetails,
        region: values.region,
        contact: values.contact,
      },
      { onError: (error) => message.error(error.message) }
    )
  }

  return (
    <Form
      form={form}
      layout="vertical"
      validateTrigger="onBlur"
      onFinish={onFinish}
      scrollToFirstError
    >
      {/* 이메일 비활성화 */}
      <Form.Item label="이메일">
        <Input value={email} disabled />
      </Form.Item>

      <Form.Item
        name="password"
        label="비밀번호"
        hasFeedback
        validateFirst
        validateTrigger="onChange"
        rules={[
          { required: true, message: "비밀번호를 입력해주세요" },
          {
            pattern:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            message: "영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다",
          },
        ]}
      >
        <Input.Password
          styles={{ prefix: { marginInlineEnd: 8 } }}
          prefix={<LockOutlined />}
          placeholder="영문, 숫자, 특수문자 조합 (8자리 이상)"
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="비밀번호 확인"
        dependencies={["password"]}
        hasFeedback
        validateFirst
        validateTrigger="onChange"
        rules={[
          { required: true, message: "비밀번호 확인을 입력해주세요" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error("비밀번호가 일치하지 않습니다"))
            },
          }),
        ]}
      >
        <Input.Password
          styles={{ prefix: { marginInlineEnd: 8 } }}
          prefix={<LockOutlined />}
          placeholder="비밀번호 확인"
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="brn"
        label="사업자등록번호"
        validateFirst
        rules={[
          { required: true, message: "사업자등록번호를 입력해주세요" },
          {
            pattern: /^\d{3}-\d{2}-\d{5}$/,
            message: "유효하지 않은 형식입니다",
          },
        ]}
        normalize={(value) => {
          if (!value) return
          const digits = value.replace(/[^\d]/g, "")
          if (digits.length <= 3) return digits
          if (digits.length <= 5)
            return `${digits.slice(0, 3)}-${digits.slice(3)}`
          return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
        }}
      >
        <Input
          placeholder="하이픈(-) 없이 입력해주세요"
          inputMode="numeric"
          maxLength={12}
        />
      </Form.Item>

      <Form.Item
        name="representative"
        label="대표자명"
        rules={[{ required: true, message: "대표자명을 입력해주세요" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label="약국명"
        rules={[{ required: true, message: "약국명을 입력해주세요" }]}
      >
        <Input />
      </Form.Item>

      <Flex justify="space-between" align="center" gap="small">
        {/* 우편번호 읽기 전용 */}
        <Form.Item
          name="postcode"
          label="우편번호"
          rules={[{ required: true, message: "우편번호를 입력해주세요" }]}
        >
          <Input readOnly />
        </Form.Item>

        <AddressSearchModal onComplete={(data) => form.setFieldsValue(data)} />
      </Flex>

      {/* 주소 읽기 전용 */}
      <Form.Item
        name="address"
        label="주소"
        rules={[{ required: true, message: "주소를 입력해주세요" }]}
      >
        <Input readOnly />
      </Form.Item>

      <Form.Item name="addressDetails" label="상세주소">
        <Input />
      </Form.Item>

      {/* 지역 숨김 처리 */}
      <Form.Item name="region" hidden>
        <Input />
      </Form.Item>

      <Form.Item
        name="contact"
        label="연락처"
        rules={[
          {
            pattern: /^\d{2,3}-\d{3,4}-\d{4}$/,
            message: "유효하지 않은 형식입니다",
          },
        ]}
        normalize={(value) => {
          if (!value) return
          const digits = value.replace(/[^\d]/g, "")
          if (digits.startsWith("02")) {
            if (digits.length <= 2) return digits
            if (digits.length <= 6)
              return `${digits.slice(0, 2)}-${digits.slice(2)}`
            return digits.length === 10
              ? `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`
              : `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
          }
          if (digits.length <= 3) return digits
          if (digits.length <= 6)
            return `${digits.slice(0, 3)}-${digits.slice(3)}`
          return digits.length === 11
            ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
            : `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
        }}
      >
        <Input
          placeholder="하이픈(-) 없이 입력해주세요"
          inputMode="numeric"
          maxLength={13}
        />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("이용약관에 동의해주세요")),
          },
        ]}
      >
        <Checkbox>이용약관에 동의합니다.</Checkbox>
      </Form.Item>

      <Button
        block
        type="primary"
        htmlType="submit"
        loading={isPending}
        disabled={!agreed}
      >
        회원가입
      </Button>
    </Form>
  )
}
