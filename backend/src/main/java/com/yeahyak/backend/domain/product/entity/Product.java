package com.yeahyak.backend.domain.product.entity;

import com.yeahyak.backend.domain.stock.entity.HqStock;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String kdCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductMainCategory mainCategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductSubCategory subCategory;

    @Column(nullable = false)
    private String manufacturer;

    private String unit;

    @Column(nullable = false)
    private Integer price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private String imageKey;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private HqStock hqStock;

    @Builder
    private Product(String name, String kdCode, ProductMainCategory mainCategory, ProductSubCategory subCategory,
                    String manufacturer, String unit, Integer price,
                    String description, String imageUrl, String imageKey) {
        this.name = name;
        this.kdCode = kdCode;
        this.mainCategory = mainCategory;
        this.subCategory = subCategory;
        this.manufacturer = manufacturer;
        this.unit = unit;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.imageKey = imageKey;
    }

    public static Product create(String name, String kdCode, ProductMainCategory mainCategory, ProductSubCategory subCategory,
                                 String manufacturer, String unit, Integer price,
                                 String description, String imageUrl, String imageKey) {
        return Product.builder()
                .name(name)
                .kdCode(kdCode)
                .mainCategory(mainCategory)
                .subCategory(subCategory)
                .manufacturer(manufacturer)
                .unit(unit)
                .price(price)
                .description(description)
                .imageUrl(imageUrl)
                .imageKey(imageKey)
                .build();
    }

    public void initHqStock() {
        this.hqStock = HqStock.create(this);
    }

    public void update(String newName, ProductMainCategory newMainCategory, ProductSubCategory newSubCategory,
                       String newManufacturer, String newUnit, Integer newPrice, String newDescription) {
        if (newName != null) this.name = newName;
        if (newMainCategory != null) this.mainCategory = newMainCategory;
        if (newSubCategory != null) this.subCategory = newSubCategory;
        if (newManufacturer != null) this.manufacturer = newManufacturer;
        if (newUnit != null) this.unit = newUnit;
        if (newPrice != null) this.price = newPrice;
        if (newDescription != null) this.description = newDescription;
    }

    public void updateImage(String newImageUrl, String newImageKey) {
        this.imageUrl = newImageUrl;
        this.imageKey = newImageKey;
    }
}
