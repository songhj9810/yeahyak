package com.yeahyak.backend.domain.forecast.service;

import com.yeahyak.backend.domain.forecast.dto.flask.FlaskForecastRequest;
import com.yeahyak.backend.domain.forecast.dto.flask.FlaskForecastResponse;
import com.yeahyak.backend.domain.forecast.dto.request.ForecastRequest;
import com.yeahyak.backend.domain.forecast.dto.response.ForecastResponse;
import com.yeahyak.backend.domain.forecast.dto.response.LastSalesUploadResponse;
import com.yeahyak.backend.domain.product.entity.Product;
import com.yeahyak.backend.domain.stock.entity.PharmacyStockTx;
import com.yeahyak.backend.domain.stock.repository.PharmacyStockTxRepository;
import com.yeahyak.backend.domain.user.entity.Pharmacy;
import com.yeahyak.backend.domain.user.repository.PharmacyRepository;
import com.yeahyak.backend.global.exception.CustomException;
import com.yeahyak.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ForecastService {

    private static final int OUTDATED_DAYS = 3;
    private final PharmacyRepository pharmacyRepository;
    private final PharmacyStockTxRepository pharmacyStockTxRepository;
    private final RestTemplate restTemplate;

    @Value("${app.flask-url}")
    private String flaskUrl;

    // 마지막 판매 데이터 업로드 날짜 조회
    public LastSalesUploadResponse getLastSalesUpload(Long userId) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));

        LocalDateTime lastSalesUpload = pharmacyStockTxRepository.findLastSalesUpload(pharmacy.getId())
                .orElse(null);

        boolean outdated = lastSalesUpload == null ||
                lastSalesUpload.toLocalDate().isBefore(LocalDate.now().minusDays(OUTDATED_DAYS));

        return new LastSalesUploadResponse(lastSalesUpload, outdated);
    }

    // 발주 추천
    public List<ForecastResponse> forecast(Long userId, ForecastRequest request, String token) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PHARMACY_NOT_FOUND));

        // SALE_OUT 트랜잭션 전체 조회
        LocalDate from = LocalDate.now().minusYears(3);
        List<PharmacyStockTx> txList = pharmacyStockTxRepository.findAllSaleOut(pharmacy.getId(), from);

        if (txList.isEmpty()) {
            throw new CustomException(ErrorCode.SALES_DATA_NOT_FOUND);
        }

        // 상품별로 그룹핑
        Map<Long, List<PharmacyStockTx>> grouped = txList.stream()
                .collect(Collectors.groupingBy(tx -> tx.getPharmacyStock().getProduct().getId()));

        // Flask 요청 데이터 구성
        List<FlaskForecastRequest.Product> products = grouped.entrySet().stream()
                .map(entry -> {
                    PharmacyStockTx sample = entry.getValue().getFirst();
                    Product product = sample.getPharmacyStock().getProduct();

                    List<FlaskForecastRequest.SalesHistory> salesHistory = entry.getValue().stream()
                            .map(tx -> new FlaskForecastRequest.SalesHistory(
                                    tx.getSaleDate().toString(),
                                    tx.getQuantity()))
                            .toList();

                    return new FlaskForecastRequest.Product(
                            product.getId(),
                            product.getMainCategory().name(),
                            product.getSubCategory().name(),
                            sample.getPharmacyStock().getStock(),
                            salesHistory);
                })
                .toList();

        FlaskForecastRequest flaskRequest = new FlaskForecastRequest(
                pharmacy.getId(),
                products,
                request.forecastDays(),
                LocalDate.now().toString());

        // Flask 호출 (JWT 전달)
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<FlaskForecastRequest> entity = new HttpEntity<>(flaskRequest, headers);

        FlaskForecastResponse[] flaskResponse;
        try {
            flaskResponse = restTemplate.postForEntity(
                    flaskUrl + "/ai/forecast",
                    entity,
                    FlaskForecastResponse[].class).getBody();
        } catch (Exception e) {
            throw new CustomException(ErrorCode.SERVICE_UNAVAILABLE);
        }
        if (flaskResponse == null) {
            throw new CustomException(ErrorCode.SERVICE_UNAVAILABLE);
        }

        // Flask 응답 + 상품 정보 조합
        Map<Long, PharmacyStockTx> productMap = grouped.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().getFirst()));

        return Arrays.stream(flaskResponse)
                .map(item -> {
                    Product product = productMap.get(item.productId()).getPharmacyStock().getProduct();
                    return ForecastResponse.from(
                            product,
                            item.currentStock(),
                            item.forecastQty(),
                            item.recommendQty());
                })
                .toList();
    }
}
