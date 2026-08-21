export type PharmacyRegion =
  | "SEOUL"
  | "GYEONGGI"
  | "INCHEON"
  | "GANGWON"
  | "CHUNGBUK"
  | "SEJONG"
  | "CHUNGNAM"
  | "DAEJEON"
  | "GYEONGBUK"
  | "DAEGU"
  | "ULSAN"
  | "BUSAN"
  | "GYEONGNAM"
  | "JEONBUK"
  | "JEONNAM"
  | "GWANGJU"
  | "JEJU"

// 한글 매핑
export const PHARMACY_REGION_LABEL: Record<PharmacyRegion, string> = {
  SEOUL: "서울",
  GYEONGGI: "경기",
  INCHEON: "인천",
  GANGWON: "강원",
  CHUNGBUK: "충북",
  SEJONG: "세종",
  CHUNGNAM: "충남",
  DAEJEON: "대전",
  GYEONGBUK: "경북",
  DAEGU: "대구",
  ULSAN: "울산",
  BUSAN: "부산",
  GYEONGNAM: "경남",
  JEONBUK: "전북",
  JEONNAM: "전남",
  GWANGJU: "광주",
  JEJU: "제주",
}
