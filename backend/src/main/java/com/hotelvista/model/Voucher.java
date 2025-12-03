package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private Double discountPercentage;

    @Column(name = "discount_value")
    private Double discountValue;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "discount_type")
    private String discountType;

    @Column(name = "is_active")
    private boolean isActive;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "voucher")
    private List<CustomerVoucher> customerVouchers;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "voucher")
    private List<HolidayVoucher> holidayVouchers;
}
