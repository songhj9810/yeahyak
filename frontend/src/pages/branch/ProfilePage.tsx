import { useEffect } from "react"
import { App, Button, Flex, Form, Input, Skeleton, Typography } from "antd"

import {
  AddressSearchModal,
  type PharmacyUpdateRequest,
  useMyPharmacy,
  useUpdatePharmacy,
} from "@/features/pharmacy"

import styles from "./ProfilePage.module.css"

const { Title } = Typography

export default function ProfilePage() {
  const { message } = App.useApp()
  const [form] = Form.useForm<PharmacyUpdateRequest>()

  const { data: pharmacy, isLoading } = useMyPharmacy()

  const { mutate: updatePharmacy, isPending } = useUpdatePharmacy()

  useEffect(() => {
    if (pharmacy) {
      form.setFieldsValue({
        newRepresentative: pharmacy.representative,
        newName: pharmacy.name,
        newPostcode: pharmacy.postcode,
        newAddress: pharmacy.address,
        newAddressDetails: pharmacy.addressDetails ?? "",
        newRegion: pharmacy.region,
        newContact: pharmacy.contact ?? "",
      })
    }
  }, [pharmacy, form])

  const onFinish = (values: PharmacyUpdateRequest) => {
    updatePharmacy(
      {
        newRepresentative: values.newRepresentative,
        newName: values.newName,
        newPostcode: values.newPostcode,
        newAddress: values.newAddress,
        newAddressDetails: values.newAddressDetails,
        newRegion: values.newRegion,
        newContact: values.newContact,
      },
      {
        onSuccess: () => message.success("내 정보를 수정했습니다"),
        onError: (error) => message.error(error.message),
      }
    )
  }

  if (isLoading) return <Skeleton active />
  if (!pharmacy) return null

  return (
    <div className={styles.container}>
      <Title level={3}>내 정보</Title>

      <Form
        form={form}
        layout="vertical"
        validateTrigger="onBlur"
        onFinish={onFinish}
      >
        {/* 이메일 비활성화 */}
        <Form.Item label="이메일">
          <Input value={pharmacy.email} variant="underlined" disabled />
        </Form.Item>

        {/* 사업자등록번호 비활성화 */}
        <Form.Item label="사업자등록번호">
          <Input value={pharmacy.brn} variant="underlined" disabled />
        </Form.Item>

        <Form.Item
          name="newRepresentative"
          label="대표자명"
          rules={[{ required: true, message: "대표자명을 입력해주세요" }]}
        >
          <Input variant="underlined" />
        </Form.Item>

        <Form.Item
          name="newName"
          label="약국명"
          rules={[{ required: true, message: "약국명을 입력해주세요" }]}
        >
          <Input variant="underlined" />
        </Form.Item>

        <Flex justify="space-between" align="center" gap="small">
          {/* 우편번호 읽기 전용 */}
          <Form.Item name="newPostcode" label="우편번호">
            <Input variant="filled" readOnly />
          </Form.Item>

          <AddressSearchModal
            onComplete={(data) =>
              form.setFieldsValue({
                newPostcode: data.postcode,
                newAddress: data.address,
                newRegion: data.region,
              })
            }
          />
        </Flex>

        {/* 주소 읽기 전용 */}
        <Form.Item name="newAddress" label="주소">
          <Input variant="filled" readOnly />
        </Form.Item>

        <Form.Item name="newAddressDetails" label="상세주소">
          <Input variant="underlined" />
        </Form.Item>

        {/* 지역 숨김 */}
        <Form.Item name="newRegion" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="newContact"
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
            variant="underlined"
            placeholder="하이픈(-) 없이 입력해주세요"
            inputMode="numeric"
            maxLength={13}
          />
        </Form.Item>

        <Button block type="primary" htmlType="submit" loading={isPending}>
          저장
        </Button>
      </Form>
    </div>
  )
}
