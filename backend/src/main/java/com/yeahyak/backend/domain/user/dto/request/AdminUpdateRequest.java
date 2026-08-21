package com.yeahyak.backend.domain.user.dto.request;

import com.yeahyak.backend.domain.user.entity.AdminDepartment;

public record AdminUpdateRequest(
        String newName,
        AdminDepartment newDepartment) {
}
