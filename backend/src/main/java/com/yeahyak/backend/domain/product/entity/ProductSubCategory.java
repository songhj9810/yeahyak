package com.yeahyak.backend.domain.product.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProductSubCategory {

    // 전문의약품
    ETC_A(ProductMainCategory.ETC), // 소화기관 및 대사
    ETC_B(ProductMainCategory.ETC), // 혈액 및 조혈기관
    ETC_C(ProductMainCategory.ETC), // 심혈관계
    ETC_D(ProductMainCategory.ETC), // 피부계
    ETC_G(ProductMainCategory.ETC), // 비뇨생식기계 및 성호르몬
    ETC_H(ProductMainCategory.ETC), // 전신용 호르몬 제제(성호르몬, 인슐린 제외)
    ETC_J(ProductMainCategory.ETC), // 전신용 항감염제
    ETC_L(ProductMainCategory.ETC), // 항악성종양제 및 면역조절제
    ETC_M(ProductMainCategory.ETC), // 근골격계
    ETC_N(ProductMainCategory.ETC), // 신경계
    ETC_P(ProductMainCategory.ETC), // 항기생충제, 살충제 및 방충제
    ETC_R(ProductMainCategory.ETC), // 호흡기계
    ETC_S(ProductMainCategory.ETC), // 감각기관
    ETC_V(ProductMainCategory.ETC), // 기타제제

    // 일반의약품
    OTC_A(ProductMainCategory.OTC), // 소화기관 및 대사
    OTC_B(ProductMainCategory.OTC), // 혈액 및 조혈기관
    OTC_C(ProductMainCategory.OTC), // 심혈관계
    OTC_D(ProductMainCategory.OTC), // 피부계
    OTC_G(ProductMainCategory.OTC), // 비뇨생식기계 및 성호르몬
    OTC_H(ProductMainCategory.OTC), // 전신용 호르몬 제제(성호르몬, 인슐린 제외)
    OTC_J(ProductMainCategory.OTC), // 전신용 항감염제
    OTC_L(ProductMainCategory.OTC), // 항악성종양제 및 면역조절제
    OTC_M(ProductMainCategory.OTC), // 근골격계
    OTC_N(ProductMainCategory.OTC), // 신경계
    OTC_P(ProductMainCategory.OTC), // 항기생충제, 살충제 및 방충제
    OTC_R(ProductMainCategory.OTC), // 호흡기계
    OTC_S(ProductMainCategory.OTC), // 감각기관
    OTC_V(ProductMainCategory.OTC), // 기타제제

    // 의약외품 및 의료기기
    QUASI_DRUG(ProductMainCategory.MEDICAL_GOODS),
    MEDICAL_DEVICE(ProductMainCategory.MEDICAL_GOODS);

    private final ProductMainCategory mainCategory;
}
