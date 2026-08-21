export const queryKeys = {
  // 초대
  invitation: {
    all: () => ["invitation"] as const,
    list: (filters: object) => ["invitation", "list", filters] as const,
  },

  // 유저
  admin: {
    me: () => ["admin", "me"] as const,
  },
  pharmacy: {
    all: () => ["pharmacy"] as const,
    list: (filters: object) => ["pharmacy", "list", filters] as const,
    detail: (id: number) => ["pharmacy", id] as const,
    me: () => ["pharmacy", "me"] as const,
  },

  // 지갑
  wallet: {
    all: () => ["wallet"] as const,
    detail: (pharmacyId: number) => ["wallet", pharmacyId] as const,
    txList: (pharmacyId: number, filters: object) =>
      ["wallet", pharmacyId, "txs", filters] as const,
    me: () => ["wallet", "me"] as const,
    myTxList: (filters: object) => ["wallet", "me", "txs", filters] as const,
  },

  // 상품
  product: {
    all: () => ["product"] as const,
    list: (filters: object) => ["product", "list", filters] as const,
    detail: (id: number) => ["product", id] as const,
  },

  // 예측
  forecast: {
    lastUpload: () => ["forecast", "lastUpload"] as const,
  },

  // 발주
  order: {
    all: () => ["order"] as const,
    statistics: () => ["order", "statistics"] as const,
    list: (filters: object) => ["order", "list", filters] as const,
    detail: (id: number) => ["order", id] as const,
    returnable: (id: number | undefined) =>
      ["order", id, "returnable"] as const,
    myList: (filters: object) => ["order", "me", filters] as const,
  },

  // 반품
  return: {
    all: () => ["return"] as const,
    statistics: () => ["return", "statistics"] as const,
    list: (filters: object) => ["return", "list", filters] as const,
    detail: (id: number) => ["return", id] as const,
    myList: (filters: object) => ["return", "me", filters] as const,
  },

  // 본사 재고
  hqStock: {
    all: () => ["hqStock"] as const,
    list: (filters: object) => ["hqStock", "list", filters] as const,
    detail: (id: number | undefined) => ["hqStock", id] as const,
    txList: (id: number | undefined, filters: object) =>
      ["hqStock", id, "txs", filters] as const,
  },

  // 약국 재고
  pharmacyStock: {
    all: () => ["pharmacyStock"] as const,
    list: (filters: object) => ["pharmacyStock", "list", filters] as const,
    detail: (id: number | undefined) => ["pharmacyStock", id] as const,
    txList: (id: number | undefined, filters: object) =>
      ["pharmacyStock", id, "txs", filters] as const,
  },

  // 공지사항
  notice: {
    all: () => ["notice"] as const,
    latest: () => ["notice", "latest"] as const,
    list: (filters: object) => ["notice", "list", filters] as const,
    detail: (id: number) => ["notice", id] as const,
  },
} as const
