package com.yeahyak.backend.global.service;

import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import io.awspring.cloud.s3.S3Exception;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;
    private final S3Template s3Template;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    // 업로드
    public String[] upload(MultipartFile file, String folder) {
        validate(file, folder);

        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String suffix = StringUtils.hasText(extension) ? "." + extension.toLowerCase(Locale.ROOT) : "";
        String key = folder + "/" + UUID.randomUUID() + suffix;

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

    private void validate(MultipartFile file, String folder) {
        if (file == null || file.isEmpty() || file.getSize() > MAX_FILE_SIZE) {
            throw new CustomException(ErrorCode.INVALID_FILE);
        }
        if (!"products".equals(folder)) return;

        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String contentType = file.getContentType();
        if (!StringUtils.hasText(extension) || contentType == null) {
            throw new CustomException(ErrorCode.INVALID_FILE_FORMAT);
        }

        boolean validImage = switch (extension.toLowerCase(Locale.ROOT)) {
            case "jpg", "jpeg" -> contentType.equalsIgnoreCase("image/jpeg");
            case "png" -> contentType.equalsIgnoreCase("image/png");
            case "webp" -> contentType.equalsIgnoreCase("image/webp");
            default -> false;
        };
        if (!validImage) {
            throw new CustomException(ErrorCode.INVALID_FILE_FORMAT);
        }
    }
}
