import { cyan } from "@ant-design/colors"
import { App, ConfigProvider, type ThemeConfig } from "antd"
import koKR from "antd/locale/ko_KR"
import dayjs from "dayjs"

import "dayjs/locale/ko"

dayjs.locale("ko") // 한국어 설정

const theme: ThemeConfig = {
  token: {
    colorPrimary: cyan.primary,
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
    colorLink: "inherit",
  },
  components: {
    Typography: {
      titleMarginTop: 0, // 모든 Typography.Title의 상단 마진 제거
      titleMarginBottom: 0, // 모든 Typography.Title의 하단 마진 제거
    },
    Layout: {
      headerBg: "#ffffff",
    },
  },
}

export const AntdProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider locale={koKR} theme={theme}>
      <App>{children}</App>
    </ConfigProvider>
  )
}
