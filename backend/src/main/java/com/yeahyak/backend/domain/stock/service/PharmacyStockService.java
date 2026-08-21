package com.yeahyak.backend.domain.stock.service;

import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.product.repository.ProductRepository;
import com.yeahyak.backend.domain.stock.dto.request.SalesUploadRequest;
import com.yeahyak.backend.domain.stock.dto.request.StockAdjustRequest;
import com.yeahyak.backend.domain.stock.dto.response.PharmacyStockResponse;
import com.yeahyak.backend.domain.stock.dto.response.PharmacyStockTxResponse;
import com.yeahyak.backend.domain.stock.entity.PharmacyStock;
import com.yeahyak.backend.domain.stock.entity.PharmacyStockEvent;
import com.yeahyak.backend.domain.stock.entity.PharmacyStockTx;
import com.yeahyak.backend.domain.stock.repository.PharmacyStockRepository;
import com.yeahyak.backend.domain.stock.repository.PharmacyStockTxRepository;
import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.domain.user.repository.PharmacyRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PharmacyStockService {

    private final PharmacyStockRepository stockRepository;
    private final PharmacyStockTxRepository txRepository;
    private final PharmacyRepository pharmacyRepository;
    private final ProductRepository productRepository;

    // 입고 (발주 완료 시) - 기존 약국 재고 없으면 새로 생성
    @Transactional
    public void orderIn(Long pharmacyId, Long productId, Integer quantity, Long orderItemId) {
        PharmacyStock stock = stockRepository.findByPharmacyIdAndProductIdWithLock(pharmacyId, productId)
                .orElseGet(() -> {
                    Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                            .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));
                    return stockRepository.save(PharmacyStock.create(pharmacy, product));
                });
        PharmacyStockTx tx = stock.orderIn(quantity, orderItemId);
        txRepository.save(tx);
    }

    // 출고 (반품 승인 시)
    @Transactional
    public void returnOrderOut(Long pharmacyId, Long productId, Integer quantity, Long returnOrderItemId) {
        PharmacyStock stock = stockRepository.findByPharmacyIdAndProductIdWithLock(pharmacyId, productId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        PharmacyStockTx tx = stock.returnOrderOut(quantity, returnOrderItemId);
        txRepository.save(tx);
    }

    // 재고 수동 조정
    @Transactional
    public void adjust(Long userId, Long pharmacyStockId, StockAdjustRequest request) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        PharmacyStock stock = stockRepository.findByIdWithLock(pharmacyStockId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        if (!stock.getPharmacy().getId().equals(pharmacy.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        PharmacyStockTx tx = stock.adjust(request.newStock());
        txRepository.save(tx);
    }

    // 재고 조회
    public PageResponse<PharmacyStockResponse> getPharmacyStocks(Long userId,
                                                                 ProductMainCategory mainCategory,
                                                                 ProductSubCategory subCategory,
                                                                 String keyword,
                                                                 Integer threshold,
                                                                 Pageable pageable) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        return PageResponse.from(
                stockRepository.searchPharmacyStocks(pharmacy.getId(), mainCategory, subCategory, keyword, threshold, pageable)
                        .map(PharmacyStockResponse::from));
    }

    // 재고 단건 조회
    public PharmacyStockResponse getPharmacyStock(Long userId,
                                                  Long pharmacyStockId) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        PharmacyStock stock = stockRepository.findById(pharmacyStockId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        if (!stock.getPharmacy().getId().equals(pharmacy.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        return PharmacyStockResponse.from(stock);
    }

    // 재고 변동 내역 조회
    public PageResponse<PharmacyStockTxResponse> getPharmacyStockTxs(Long userId,
                                                                     Long pharmacyStockId,
                                                                     PharmacyStockEvent event,
                                                                     LocalDateTime start,
                                                                     LocalDateTime end,
                                                                     Pageable pageable) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));
        PharmacyStock stock = stockRepository.findById(pharmacyStockId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        if (!stock.getPharmacy().getId().equals(pharmacy.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        return PageResponse.from(
                txRepository.searchPharmacyStockTxs(pharmacyStockId, event, start, end, pageable)
                        .map(PharmacyStockTxResponse::from));
    }

    // 판매 데이터 업로드
    @Transactional
    public void uploadSales(Long userId, MultipartFile file) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));

        List<SalesUploadRequest> rows = parseCsv(file);

        for (SalesUploadRequest row : rows) {
            Product product = productRepository.findById(row.productId())
                    .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

            PharmacyStock stock = stockRepository.findByPharmacyIdAndProductIdWithLock(pharmacy.getId(), row.productId())
                    .orElseGet(() -> stockRepository.save(PharmacyStock.create(pharmacy, product)));

            Optional<PharmacyStockTx> existing = txRepository
                    .findByPharmacyStockIdAndEventAndSaleDate(stock.getId(), PharmacyStockEvent.SALE_OUT, row.date());
            if (existing.isPresent()) {
                PharmacyStockTx tx = existing.get();
                stock.revertSaleOut(tx.getQuantity()); // 기존 차감 롤백
                stock.saleOut(row.quantity(), row.date()); // 새로 차감
                tx.update(row.quantity(), tx.getStockBefore(), stock.getStock()); // 트랜잭션 수정
            } else {
                PharmacyStockTx tx = stock.saleOut(row.quantity(), row.date());
                txRepository.save(tx);
            }
        }
    }

    private List<SalesUploadRequest> parseCsv(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            return reader.lines()
                    .skip(1) // 헤더 스킵
                    .filter(line -> !line.isBlank())
                    .map(line -> {
                        String[] col = line.split(",");
                        return new SalesUploadRequest(
                                LocalDate.parse(col[0].trim()),
                                Long.parseLong(col[1].trim()),
                                Integer.parseInt(col[2].trim()));
                    })
                    .toList();
        } catch (IOException e) {
            throw new CustomException(ErrorCode.INVALID_FILE);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_FILE_FORMAT);
        }
    }
}
