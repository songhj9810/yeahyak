import { AntdProvider } from "./AntdProvider"
import { QueryProvider } from "./QueryProvider"

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AntdProvider>{children}</AntdProvider>
    </QueryProvider>
  )
}
