package com.yeahyak.backend.domain.returnorder.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ReturnOrderRejectRequest(
        @NotBlank String rejectReason) {
}
