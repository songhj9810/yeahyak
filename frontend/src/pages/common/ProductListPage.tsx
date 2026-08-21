import { useNavigate } from "react-router-dom"
import type { TabsProps } from "antd"
import {
  Button,
  Col,
  Empty,
  Flex,
  Input,
  Pagination,
  Row,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from "antd"

import { useRole } from "@/features/auth"
import {
  MAIN_TO_SUB_CATEGORY,
  PRODUCT_MAIN_CATEGORY_LABEL,
  PRODUCT_SUB_CATEGORY_LABEL,
  ProductCard,
  type ProductMainCategory,
  useProductFilter,
  useProducts,
} from "@/features/product"

import { PAGE_SIZE, UI_WIDTH } from "@/shared/config/constants"
import { PATHS } from "@/shared/config/paths"

import styles from "./ProductListPage.module.css"

const { Title } = Typography

export default function ProductListPage() {
  const navigate = useNavigate()
  const role = useRole()

  const { mainCategory, subCategory, keyword, page, setFilter } =
    useProductFilter()

  const { data: products, isLoading } = useProducts({
    mainCategory,
    subCategory: subCategory === "all" ? undefined : subCategory,
    keyword,
    page,
    size: PAGE_SIZE,
  })

  const tabsItems: TabsProps["items"] = Object.entries(
    PRODUCT_MAIN_CATEGORY_LABEL
  ).map(([key, label]) => ({
    key,
    label,
    children: (
      <Space align="center" wrap>
        <Button
          type={subCategory === "all" ? "primary" : "default"}
          onClick={() => setFilter({ subCategory: "all" })}
        >
          전체
        </Button>
        {MAIN_TO_SUB_CATEGORY[key as ProductMainCategory].map((sub) => (
          <Button
            key={sub}
            type={subCategory === sub ? "primary" : "default"}
            onClick={() => setFilter({ subCategory: sub })}
          >
            {PRODUCT_SUB_CATEGORY_LABEL[sub]}
          </Button>
        ))}
      </Space>
    ),
  }))

  return (
    <div className={styles.container}>
      <Flex justify="space-between" align="center" gap="small" wrap>
        <Title level={3}>{role === "ADMIN" ? "상품 관리" : "상품 목록"}</Title>

        {role === "ADMIN" && (
          <Button
            type="primary"
            onClick={() => navigate(PATHS.HQ.PRODUCTS.NEW)}
          >
            상품 등록
          </Button>
        )}
      </Flex>

      <Tabs
        items={tabsItems}
        activeKey={mainCategory}
        onChange={(value) =>
          setFilter({ mainCategory: value as ProductMainCategory })
        }
      />

      <Input.Search
        style={{ width: UI_WIDTH.SEARCH }}
        key={mainCategory}
        defaultValue={keyword}
        placeholder="상품명 검색"
        allowClear
        onSearch={(value) => setFilter({ keyword: value })}
      />

      {isLoading ? (
        <Skeleton active />
      ) : !products || products.content.length === 0 ? (
        <Empty />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {products.content.map((product) => (
              <Col key={product.id} xs={12} md={8} xl={6} xxl={4}>
                <ProductCard
                  product={product}
                  path={
                    role === "ADMIN"
                      ? PATHS.HQ.PRODUCTS.DETAIL
                      : PATHS.BRANCH.PRODUCTS.DETAIL
                  }
                />
              </Col>
            ))}
          </Row>

          <Pagination
            current={(products?.page ?? 0) + 1}
            pageSize={PAGE_SIZE}
            total={products?.totalElements}
            onChange={(page) => setFilter({ page: page - 1 })}
            align="center"
            showSizeChanger={false}
          />
        </>
      )}
    </div>
  )
}
