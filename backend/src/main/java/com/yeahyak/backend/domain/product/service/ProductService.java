package com.yeahyak.backend.domain.product.service;

import com.yeahyak.backend.domain.product.dto.request.ProductCreateRequest;
import com.yeahyak.backend.domain.product.dto.request.ProductUpdateRequest;
import com.yeahyak.backend.domain.product.dto.response.ProductCreateResponse;
import com.yeahyak.backend.domain.product.dto.response.ProductListResponse;
import com.yeahyak.backend.domain.product.dto.response.ProductResponse;
import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.product.repository.ProductRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.response.PageResponse;
import com.yeahyak.backend.global.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final S3Service s3Service;

    // 상품 등록
    @Transactional
    public ProductCreateResponse createProduct(ProductCreateRequest request, MultipartFile image) {
        if (productRepository.existsByKdCode(request.kdCode())) {
            throw new CustomException(ErrorCode.KD_CODE_ALREADY_EXISTS);
        }
        if (request.subCategory().getMainCategory() != request.mainCategory()) {
            throw new CustomException(ErrorCode.CATEGORY_MISMATCH);
        }

        String[] uploaded = new String[]{null, null};
        if (image != null && !image.isEmpty()) {
            uploaded = s3Service.upload(image, "products");
        }

        Product product = Product.create(
                request.name(),
                request.kdCode(),
                request.mainCategory(),
                request.subCategory(),
                request.manufacturer(),
                request.unit(),
                request.price(),
                request.description(),
                uploaded[0],
                uploaded[1]);
        product.initHqStock();
        productRepository.save(product);

        return new ProductCreateResponse(product.getId());
    }

    // 상품 수정
    @Transactional
    public void updateProduct(Long productId, ProductUpdateRequest request, MultipartFile image) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        if (request.clearImage()) {
            s3Service.delete(product.getImageKey());
            product.updateImage(null, null);
        } else if (image != null && !image.isEmpty()) {
            s3Service.delete(product.getImageKey());
            String[] uploaded = s3Service.upload(image, "products");
            product.updateImage(uploaded[0], uploaded[1]);
        }

        product.update(
                request.newName(),
                request.newMainCategory(),
                request.newSubCategory(),
                request.newManufacturer(),
                request.newUnit(),
                request.newPrice(),
                request.newDescription());
    }

    // 상품 삭제
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
        if (product.getImageKey() != null) {
            s3Service.delete(product.getImageKey());
        }
        productRepository.delete(product);
    }

    // 상품 목록 조회
    public PageResponse<ProductListResponse> getProducts(ProductMainCategory mainCategory,
                                                         ProductSubCategory subCategory,
                                                         String keyword,
                                                         Pageable pageable) {
        return PageResponse.from(
                productRepository.searchProducts(mainCategory, subCategory, keyword, pageable)
                        .map(ProductListResponse::from));
    }

    // 상품 상세 조회
    public ProductResponse getProduct(Long productId) {
        Product product = productRepository.findByIdWithHqStock(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
        return ProductResponse.from(product);
    }
}
