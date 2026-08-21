package com.yeahyak.backend.domain.user.entity;

import com.yeahyak.backend.domain.wallet.entity.Wallet;
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
@Table(name = "pharmacies")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String brn;

    @Column(nullable = false)
    private String representative;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String postcode;

    @Column(nullable = false)
    private String address;

    private String addressDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PharmacyRegion region;

    private String contact;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "pharmacy", cascade = CascadeType.ALL, orphanRemoval = true)
    private Wallet wallet;

    @Builder
    private Pharmacy(User user, String brn, String representative, String name,
                     String postcode, String address, String addressDetails,
                     PharmacyRegion region, String contact) {
        this.user = user;
        this.brn = brn;
        this.representative = representative;
        this.name = name;
        this.postcode = postcode;
        this.address = address;
        this.addressDetails = addressDetails;
        this.region = region;
        this.contact = contact;
    }

    public static Pharmacy create(User user, String brn, String representative, String name,
                                  String postcode, String address, String addressDetails,
                                  PharmacyRegion region, String contact) {
        return Pharmacy.builder()
                .user(user)
                .brn(brn)
                .representative(representative)
                .name(name)
                .postcode(postcode)
                .address(address)
                .addressDetails(addressDetails)
                .region(region)
                .contact(contact)
                .build();
    }

    public void initWallet() {
        this.wallet = Wallet.create(this);
    }

    public void update(String newRepresentative, String newName,
                       String newPostcode, String newAddress, String newAddressDetails,
                       PharmacyRegion newRegion, String newContact) {
        if (newRepresentative != null) this.representative = newRepresentative;
        if (newName != null) this.name = newName;
        if (newPostcode != null) this.postcode = newPostcode;
        if (newAddress != null) this.address = newAddress;
        if (newAddressDetails != null) this.addressDetails = newAddressDetails;
        if (newRegion != null) this.region = newRegion;
        if (newContact != null) this.contact = newContact;
    }
}
