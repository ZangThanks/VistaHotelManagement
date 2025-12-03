package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "holiday_vouchers")
public class HolidayVoucher {
    @Id
    @Column(name = "holiday_id")
    private String holidayId;

    @Column(name = "holiday_name")
    private String holidayName;

    @Column(name = "holiday_date")
    private LocalDate holidayDate;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @Column(name = "is_active")
    private boolean isActive;
}
