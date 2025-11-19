package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@ToString
public enum PaymentStatus {
    PENDING("PENDING"),
    COMPLETED("COMPLETED"),
    FAILED("FAILED"),
    REFUNDED("REFUNDED"),
    CANCELLED("CANCELLED");

    private String paymentStatus;
}
