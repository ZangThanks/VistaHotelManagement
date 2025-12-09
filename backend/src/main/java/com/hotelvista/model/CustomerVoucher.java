package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@IdClass(CustomerVoucher.CustomerVoucherId.class)
@Table(name = "customer_vouchers")
public class CustomerVoucher {
    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vouchers_id")
    private Voucher voucher;

    private boolean state;

    @EqualsAndHashCode
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CustomerVoucherId implements Serializable {
        private Customer customer;
        private Voucher voucher;
    }
}
