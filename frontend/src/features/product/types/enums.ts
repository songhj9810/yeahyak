export type ProductMainCategory = "ETC" | "OTC" | "MEDICAL_GOODS"

export type ProductSubCategory =
  | "ETC_A"
  | "ETC_B"
  | "ETC_C"
  | "ETC_D"
  | "ETC_G"
  | "ETC_H"
  | "ETC_J"
  | "ETC_L"
  | "ETC_M"
  | "ETC_N"
  | "ETC_P"
  | "ETC_R"
  | "ETC_S"
  | "ETC_V"
  | "OTC_A"
  | "OTC_B"
  | "OTC_C"
  | "OTC_D"
  | "OTC_G"
  | "OTC_H"
  | "OTC_J"
  | "OTC_L"
  | "OTC_M"
  | "OTC_N"
  | "OTC_P"
  | "OTC_R"
  | "OTC_S"
  | "OTC_V"
  | "QUASI_DRUG"
  | "MEDICAL_DEVICE"

// 메인 카테고리에 따른 서브 카테고리 매핑
export const MAIN_TO_SUB_CATEGORY: Record<
  ProductMainCategory,
  ProductSubCategory[]
> = {
  ETC: [
    "ETC_A",
    "ETC_B",
    "ETC_C",
    "ETC_D",
    "ETC_G",
    "ETC_H",
    "ETC_J",
    "ETC_L",
    "ETC_M",
    "ETC_N",
    "ETC_P",
    "ETC_R",
    "ETC_S",
    "ETC_V",
  ],
  OTC: [
    "OTC_A",
    "OTC_B",
    "OTC_C",
    "OTC_D",
    "OTC_G",
    "OTC_H",
    "OTC_J",
    "OTC_L",
    "OTC_M",
    "OTC_N",
    "OTC_P",
    "OTC_R",
    "OTC_S",
    "OTC_V",
  ],
  MEDICAL_GOODS: ["QUASI_DRUG", "MEDICAL_DEVICE"],
}

// 한글 매핑
export const PRODUCT_MAIN_CATEGORY_LABEL: Record<ProductMainCategory, string> =
  {
    ETC: "전문의약품",
    OTC: "일반의약품",
    MEDICAL_GOODS: "의약외품 및 의료기기",
  }

export const PRODUCT_SUB_CATEGORY_LABEL: Record<ProductSubCategory, string> = {
  ETC_A: "소화기관 및 대사",
  ETC_B: "혈액 및 조혈기관",
  ETC_C: "심혈관계",
  ETC_D: "피부계",
  ETC_G: "비뇨생식기계 및 성호르몬",
  ETC_H: "전신용 호르몬 제제",
  ETC_J: "전신용 항감염제",
  ETC_L: "항악성종양제 및 면역조절제",
  ETC_M: "근골격계",
  ETC_N: "신경계",
  ETC_P: "항기생충제, 살충제 및 방충제",
  ETC_R: "호흡기계",
  ETC_S: "감각기관",
  ETC_V: "기타제제",
  OTC_A: "소화기관 및 대사",
  OTC_B: "혈액 및 조혈기관",
  OTC_C: "심혈관계",
  OTC_D: "피부계",
  OTC_G: "비뇨생식기계 및 성호르몬",
  OTC_H: "전신용 호르몬 제제",
  OTC_J: "전신용 항감염제",
  OTC_L: "항악성종양제 및 면역조절제",
  OTC_M: "근골격계",
  OTC_N: "신경계",
  OTC_P: "항기생충제, 살충제 및 방충제",
  OTC_R: "호흡기계",
  OTC_S: "감각기관",
  OTC_V: "기타제제",
  QUASI_DRUG: "의약외품",
  MEDICAL_DEVICE: "의료기기",
}
