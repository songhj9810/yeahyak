import { lazy } from "react"
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"

import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import LoginPage from "@/pages/auth/LoginPage"
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage"
import SignupPage from "@/pages/auth/SignupPage"
import ForbiddenPage from "@/pages/error/ForbiddenPage"
import NotFoundPage from "@/pages/error/NotFoundPage"
import RouteErrorPage from "@/pages/error/RouteErrorPage"

import { useAuthStore } from "@/features/auth"

import { PATHS } from "@/shared/config/paths"

import AppLayout from "../layouts/AppLayout"
import BranchLayout from "../layouts/BranchLayout"
import HqLayout from "../layouts/HqLayout"
import { authLoader } from "./loaders/authLoader"
import { guestLoader } from "./loaders/guestLoader"
import { resetPasswordLoader } from "./loaders/resetPasswordLoader"
import { signupLoader } from "./loaders/signupLoader"

// hq
const HqDashboardPage = lazy(() => import("@/pages/hq/DashboardPage"))
const HqProfilePage = lazy(() => import("@/pages/hq/ProfilePage"))
const HqOrdersPage = lazy(() => import("@/pages/hq/OrdersPage"))
const HqReturnsPage = lazy(() => import("@/pages/hq/ReturnsPage"))
const HqInventoryPage = lazy(() => import("@/pages/hq/InventoryPage"))
const HqPharmaciesPage = lazy(() => import("@/pages/hq/PharmaciesPage"))
const HqInvitationsPage = lazy(() => import("@/pages/hq/InvitationsPage"))

// branch
const BranchDashboardPage = lazy(() => import("@/pages/branch/DashboardPage"))
const BranchProfilePage = lazy(() => import("@/pages/branch/ProfilePage"))
const BranchOrdersPage = lazy(() => import("@/pages/branch/OrdersPage"))
const BranchReturnsPage = lazy(() => import("@/pages/branch/ReturnsPage"))
const BranchInventoryPage = lazy(() => import("@/pages/branch/InventoryPage"))
const BranchWalletPage = lazy(() => import("@/pages/branch/WalletPage"))

// common
const ProductListPage = lazy(() => import("@/pages/common/ProductListPage"))
const ProductDetailPage = lazy(() => import("@/pages/common/ProductDetailPage"))
const ProductCreatePage = lazy(() => import("@/pages/common/ProductCreatePage"))
const ProductEditPage = lazy(() => import("@/pages/common/ProductEditPage"))
const NoticeListPage = lazy(() => import("@/pages/common/NoticeListPage"))
const NoticeDetailPage = lazy(() => import("@/pages/common/NoticeDetailPage"))
const NoticeCreatePage = lazy(() => import("@/pages/common/NoticeCreatePage"))
const NoticeEditPage = lazy(() => import("@/pages/common/NoticeEditPage"))

const router = createBrowserRouter([
  {
    index: true,
    loader: () => {
      const { accessToken, role } = useAuthStore.getState()
      if (!accessToken) return redirect(PATHS.AUTH.LOGIN)
      return redirect(
        role === "ADMIN" ? PATHS.HQ.DASHBOARD : PATHS.BRANCH.DASHBOARD
      )
    },
  },
  {
    element: <AppLayout />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          // 비로그인 사용자만 접근 가능
          {
            loader: guestLoader,
            children: [
              { path: "/login", element: <LoginPage /> },
              {
                path: "/signup",
                loader: signupLoader,
                element: <SignupPage />,
              },
            ],
          },

          // 공통 페이지
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          {
            path: "/reset-password",
            loader: resetPasswordLoader,
            element: <ResetPasswordPage />,
          },
          { path: "/403", element: <ForbiddenPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },

  // ADMIN 권한 사용자만 접근 가능
  {
    path: "/hq",
    loader: authLoader("ADMIN"),
    element: <HqLayout />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { path: "dashboard", element: <HqDashboardPage /> },
          { path: "profile", element: <HqProfilePage /> },
          { path: "orders", element: <HqOrdersPage /> },
          { path: "returns", element: <HqReturnsPage /> },
          { path: "products", element: <ProductListPage /> },
          { path: "products/new", element: <ProductCreatePage /> },
          { path: "products/:id", element: <ProductDetailPage /> },
          { path: "products/:id/edit", element: <ProductEditPage /> },
          { path: "inventory", element: <HqInventoryPage /> },
          { path: "pharmacies", element: <HqPharmaciesPage /> },
          { path: "invitations", element: <HqInvitationsPage /> },
          { path: "notices", element: <NoticeListPage /> },
          { path: "notices/new", element: <NoticeCreatePage /> },
          { path: "notices/:id", element: <NoticeDetailPage /> },
          { path: "notices/:id/edit", element: <NoticeEditPage /> },
        ],
      },
    ],
  },

  // PHARMACY 권한 사용자만 접근 가능
  {
    path: "/branch",
    loader: authLoader("PHARMACY"),
    element: <BranchLayout />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { path: "dashboard", element: <BranchDashboardPage /> },
          { path: "profile", element: <BranchProfilePage /> },
          { path: "orders", element: <BranchOrdersPage /> },
          { path: "returns", element: <BranchReturnsPage /> },
          { path: "products", element: <ProductListPage /> },
          { path: "products/:id", element: <ProductDetailPage /> },
          { path: "inventory", element: <BranchInventoryPage /> },
          { path: "wallet", element: <BranchWalletPage /> },
          { path: "notices", element: <NoticeListPage /> },
          { path: "notices/:id", element: <NoticeDetailPage /> },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
