package com.yeahyak.backend.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Auth
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다"),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다"),

    // Invitation
    INVITATION_NOT_FOUND(HttpStatus.NOT_FOUND, "회원가입 초대를 찾을 수 없습니다"),
    EXPIRED_INVITATION(HttpStatus.GONE, "만료된 회원가입 초대입니다"),
    INVITATION_ALREADY_USED(HttpStatus.UNPROCESSABLE_ENTITY, "이미 처리된 회원가입 초대입니다"),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다"),
    ADMIN_NOT_FOUND(HttpStatus.NOT_FOUND, "관리자를 찾을 수 없습니다"),
    PHARMACY_NOT_FOUND(HttpStatus.NOT_FOUND, "약국을 찾을 수 없습니다"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용중인 이메일입니다"),
    EMPLOYEE_ID_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용중인 사번입니다"),
    BRN_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용중인 사업자등록번호입니다"),
    SAME_AS_OLD_PASSWORD(HttpStatus.BAD_REQUEST, "현재 사용중인 비밀번호와 동일한 비밀번호로 변경할 수 없습니다"),

    // Product
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다"),
    KD_CODE_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용중인 보험코드입니다"),
    CATEGORY_MISMATCH(HttpStatus.BAD_REQUEST, "소분류가 대분류에 속하지 않습니다"),

    // Stock
    INSUFFICIENT_STOCK(HttpStatus.UNPROCESSABLE_ENTITY, "재고가 부족합니다"),
    INVALID_FILE(HttpStatus.BAD_REQUEST, "유효하지 않은 파일입니다."),
    INVALID_FILE_FORMAT(HttpStatus.BAD_REQUEST, "지원하지 않는 파일 형식입니다."),

    // Order
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "발주 내역을 찾을 수 없습니다"),
    ORDER_ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "발주 내역에서 상품을 찾을 수 없습니다"),
    ORDER_NOT_CANCELABLE(HttpStatus.UNPROCESSABLE_ENTITY, "취소할 수 없는 발주입니다"),
    UNPROCESSABLE_ORDER(HttpStatus.UNPROCESSABLE_ENTITY, "처리할 수 없는 발주입니다"),

    // Return Order
    RETURN_ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "반품 내역을 찾을 수 없습니다"),
    UNPROCESSABLE_RETURN_ORDER(HttpStatus.UNPROCESSABLE_ENTITY, "처리할 수 없는 반품입니다"),
    INSUFFICIENT_RETURNABLE_QUANTITY(HttpStatus.UNPROCESSABLE_ENTITY, "반품 가능 수량을 초과했습니다"),

    // Wallet
    WALLET_NOT_FOUND(HttpStatus.NOT_FOUND, "지갑을 찾을 수 없습니다"),
    INSUFFICIENT_BALANCE(HttpStatus.UNPROCESSABLE_ENTITY, "잔액이 부족합니다"),

    // Notice
    NOTICE_NOT_FOUND(HttpStatus.NOT_FOUND, "공지사항을 찾을 수 없습니다"),

    // Forecast
    SALES_DATA_NOT_FOUND(HttpStatus.NOT_FOUND, "판매 이력을 찾을 수 없습니다"),

    // Common
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "BAD_REQUEST"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "NOT_FOUND"),
    CONFLICT(HttpStatus.CONFLICT, "CONFLICT"),
    GONE(HttpStatus.GONE, "GONE"),
    UNPROCESSABLE_ENTITY(HttpStatus.UNPROCESSABLE_ENTITY, "UNPROCESSABLE_ENTITY"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "SERVICE_UNAVAILABLE");

    private final HttpStatus status;
    private final String message;
}
