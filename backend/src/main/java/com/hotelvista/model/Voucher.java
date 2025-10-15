package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vouchers")
public class Voucher {
    @Id
    @Column(name = "voucher_id")
    private String voucherID;

    @Column(name = "voucher_name", columnDefinition = "NVARCHAR(255)")
    private String voucherName;

    @Column(name = "discount_percentage")
    private double discountPercentage;

    @Column(name = "discount_value")
    private double discountValue;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "discount_type")
    private String discountType;

    @Column(name = "is_active")
    private boolean isActive;

    @ToString.Exclude
    @OneToMany(mappedBy = "voucher")
    private List<CustomerVoucher> customerVouchers;
}
