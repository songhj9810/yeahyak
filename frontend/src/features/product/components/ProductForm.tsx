import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PlusOutlined } from "@ant-design/icons"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import type { UploadFile } from "antd"
import {
  App,
  Button,
  Card,
  Cascader,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Upload,
} from "antd"

import { PATHS } from "@/shared/config/paths"

import { useCreateProduct } from "../hooks/useCreateProduct"
import { useUpdateProduct } from "../hooks/useUpdateProduct"
import type { ProductResponse } from "../types/dto"
import {
  MAIN_TO_SUB_CATEGORY,
  PRODUCT_MAIN_CATEGORY_LABEL,
  PRODUCT_SUB_CATEGORY_LABEL,
  type ProductMainCategory,
  type ProductSubCategory,
} from "../types/enums"

import styles from "./ProductForm.module.css"

type ProductFormProps = {
  productId?: number
  product?: ProductResponse
}

type ProductFormValues = {
  name: string
  kdCode: string
  category: [ProductMainCategory, ProductSubCategory]
  manufacturer: string
  unit: string
  price: number
}

const cascaderOptions = Object.entries(PRODUCT_MAIN_CATEGORY_LABEL).map(
  ([value, label]) => ({
    value: value as ProductMainCategory,
    label: label,
    children: MAIN_TO_SUB_CATEGORY[value as ProductMainCategory].map((sub) => ({
      value: sub,
      label: PRODUCT_SUB_CATEGORY_LABEL[sub],
    })),
  })
)

export function ProductForm({ productId, product }: ProductFormProps) {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm<ProductFormValues>()

  const [fileList, setFileList] = useState<UploadFile[]>(
    product?.imageUrl
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: product.imageUrl,
          },
        ]
      : []
  )

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(
    productId!
  )

  // 에디터 준비
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: true,
  })

  useEffect(() => {
    if (product && editor) {
      form.setFieldsValue({
        name: product.name,
        kdCode: product.kdCode,
        category: [product.mainCategory, product.subCategory],
        manufacturer: product.manufacturer,
        unit: product.unit ?? undefined,
        price: product.price,
      })
      editor.commands.setContent(product.description)
    }
  }, [product, editor, form])

  const onFinish = (values: ProductFormValues) => {
    const [mainCategory, subCategory] = values.category
    const description = editor.getHTML()
    const image = fileList.find((file) => file.status !== "done")
      ?.originFileObj as File | undefined

    if (product) {
      updateProduct(
        {
          request: {
            newName: values.name,
            newMainCategory: mainCategory,
            newSubCategory: subCategory,
            newManufacturer: values.manufacturer,
            newUnit: values.unit,
            newPrice: values.price,
            newDescription: description,
            clearImage: fileList.length === 0,
          },
          image,
        },
        {
          onSuccess: () => message.success("상품을 수정했습니다"),
          onError: (error) => message.error(error.message),
        }
      )
    } else {
      createProduct(
        {
          request: {
            name: values.name,
            kdCode: values.kdCode,
            mainCategory,
            subCategory,
            manufacturer: values.manufacturer,
            unit: values.unit,
            price: values.price,
            description,
          },
          image,
        },
        {
          onSuccess: () => message.success("상품을 등록했습니다"),
          onError: (error) => message.error(error.message),
        }
      )
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      validateTrigger="onBlur"
      onFinish={onFinish}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Form.Item label="이미지">
            <Upload
              className={styles.upload}
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false} // 자동 업로드 방지
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              {fileList.length < 1 && <PlusOutlined />}
            </Upload>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Flex vertical>
            <Form.Item
              name="category"
              label="분류"
              rules={[
                { required: true, message: "대분류 및 소분류를 선택해주세요" },
              ]}
            >
              <Cascader
                options={cascaderOptions}
                placeholder="대분류/소분류 선택"
              />
            </Form.Item>

            <Form.Item
              name="name"
              label="상품명"
              rules={[{ required: true, message: "상품명을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="kdCode"
              label="표준코드"
              rules={[{ required: true, message: "표준코드를 입력해주세요" }]}
            >
              <Input disabled={!!product} />
            </Form.Item>
          </Flex>
        </Col>

        <Col xs={24} md={8}>
          <Flex vertical>
            <Form.Item
              name="manufacturer"
              label="제조사"
              rules={[{ required: true, message: "제조사를 입력해주세요" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="unit" label="단위">
              <Input placeholder="예: 상자, 정, 캡슐, mL" />
            </Form.Item>

            <Form.Item
              name="price"
              label="판매가"
              rules={[
                { required: true, message: "판매가를 입력해주세요" },
                {
                  type: "number",
                  min: 0,
                  message: "판매가는 0원 이상이어야 합니다",
                },
                {
                  type: "number",
                  max: 1000000,
                  message: "판매가는 1백만 원을 초과할 수 없습니다",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => Number(v?.replace(/\D/g, ""))}
                suffix="원"
              />
            </Form.Item>
          </Flex>
        </Col>
      </Row>

      <Form.Item label="설명">
        <Card>
          <EditorContent editor={editor} />
        </Card>
      </Form.Item>

      <Flex justify="end" align="center" gap="small">
        <Button
          onClick={() =>
            navigate(
              product
                ? PATHS.HQ.PRODUCTS.DETAIL(productId!)
                : PATHS.HQ.PRODUCTS.LIST
            )
          }
        >
          취소
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          loading={isCreating || isUpdating}
        >
          {product ? "수정" : "등록"}
        </Button>
      </Flex>
    </Form>
  )
}
