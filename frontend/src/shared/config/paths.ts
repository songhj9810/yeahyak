export const PATHS = {
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  ERROR: {
    FORBIDDEN: "/403",
    NOT_FOUND: "/404",
  },
  HQ: {
    DASHBOARD: "/hq/dashboard",
    PROFILE: "/hq/profile",
    ORDERS: "/hq/orders",
    RETURNS: "/hq/returns",
    PRODUCTS: {
      LIST: "/hq/products",
      NEW: "/hq/products/new",
      DETAIL: (id: number) => `/hq/products/${id}`,
      EDIT: (id: number) => `/hq/products/${id}/edit`,
    },
    INVENTORY: "/hq/inventory",
    PHARMACIES: "/hq/pharmacies",
    INVITATIONS: "/hq/invitations",
    NOTICES: {
      LIST: "/hq/notices",
      NEW: "/hq/notices/new",
      DETAIL: (id: number) => `/hq/notices/${id}`,
      EDIT: (id: number) => `/hq/notices/${id}/edit`,
    },
  },
  BRANCH: {
    DASHBOARD: "/branch/dashboard",
    PROFILE: "/branch/profile",
    ORDERS: "/branch/orders",
    RETURNS: "/branch/returns",
    PRODUCTS: {
      LIST: "/branch/products",
      DETAIL: (id: number) => `/branch/products/${id}`,
    },
    INVENTORY: "/branch/inventory",
    WALLET: "/branch/wallet",
    NOTICES: {
      LIST: "/branch/notices",
      DETAIL: (id: number) => `/branch/notices/${id}`,
    },
  },
} as const
