package com.yeahyak.backend.domain.stock.service;

import com.yeahyak.backend.domain.product.entity.ProductMainCategory;
import com.yeahyak.backend.domain.product.entity.ProductSubCategory;
import com.yeahyak.backend.domain.stock.dto.request.StockAdjustRequest;
import com.yeahyak.backend.domain.stock.dto.response.HqStockResponse;
import com.yeahyak.backend.domain.stock.dto.response.HqStockTxResponse;
import com.yeahyak.backend.domain.stock.entity.HqStock;
import com.yeahyak.backend.domain.stock.entity.HqStockEvent;
import com.yeahyak.backend.domain.stock.entity.HqStockTx;
import com.yeahyak.backend.domain.stock.repository.HqStockRepository;
import com.yeahyak.backend.domain.stock.repository.HqStockTxRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import com.yeahyak.backend.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HqStockService {

    private final HqStockRepository stockRepository;
    private final HqStockTxRepository txRepository;

    // 출고 (발주 생성 시)
    @Transactional
    public void orderOut(Long productId, Integer quantity, Long orderItemId) {
        HqStock hqStock = stockRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        HqStockTx tx = hqStock.orderOut(quantity, orderItemId);
        txRepository.save(tx);
    }

    // 입고 (발주 취소 시)
    @Transactional
    public void cancelIn(Long productId, Integer quantity, Long orderItemId) {
        HqStock hqStock = stockRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        HqStockTx tx = hqStock.cancelIn(quantity, orderItemId);
        txRepository.save(tx);
    }

    // 입고 (반품 완료 시)
    @Transactional
    public void returnOrderIn(Long productId, Integer quantity, Long returnOrderItemId) {
        HqStock hqStock = stockRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        HqStockTx tx = hqStock.returnOrderIn(quantity, returnOrderItemId);
        txRepository.save(tx);
    }

    // 재고 수동 조정
    @Transactional
    public void adjust(Long hqStockId, StockAdjustRequest request) {
        HqStock hqStock = stockRepository.findByIdWithLock(hqStockId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        HqStockTx tx = hqStock.adjust(request.newStock());
        txRepository.save(tx);
    }

    // 재고 목록 조회
    public PageResponse<HqStockResponse> getHqStocks(ProductMainCategory mainCategory,
                                                     ProductSubCategory subCategory,
                                                     String keyword,
                                                     Integer threshold,
                                                     Pageable pageable) {
        return PageResponse.from(
                stockRepository.searchHqStocks(mainCategory, subCategory, keyword, threshold, pageable)
                        .map(HqStockResponse::from));
    }

    // 재고 단건 조회
    public HqStockResponse getHqStock(Long hqStockId) {
        HqStock hqStock = stockRepository.findById(hqStockId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        return HqStockResponse.from(hqStock);
    }

    // 재고 변동 내역 조회
    public PageResponse<HqStockTxResponse> getHqStockTxs(Long hqStockId,
                                                         HqStockEvent event,
                                                         LocalDateTime start,
                                                         LocalDateTime end,
                                                         Pageable pageable) {
        return PageResponse.from(
                txRepository.searchHqStockTxs(hqStockId, event, start, end, pageable)
                        .map(HqStockTxResponse::from));
    }
}
