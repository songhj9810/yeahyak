package com.yeahyak.backend.global.service;

import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import io.awspring.cloud.s3.S3Exception;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Template s3Template;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    // 업로드
    public String[] upload(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
        String key = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        try {
            S3Resource resource = s3Template.upload(bucket, key, file.getInputStream());
            return new String[]{resource.getURL().toString(), key};
        } catch (IOException | S3Exception e) {
            throw new CustomException(ErrorCode.SERVICE_UNAVAILABLE);
        }
    }

    // 삭제
    public void delete(String key) {
        if (key == null) return;
        try {
            s3Template.deleteObject(bucket, key);
        } catch (S3Exception e) {
            throw new CustomException(ErrorCode.SERVICE_UNAVAILABLE);
        }
    }
}
