package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@ToString
public enum PaymentStatus {
    PENDING("Pending"),
    COMPLETED("Completed"),
    PERCENTAGE_30("30% Paid"),
    PERCENTAGE_50("50% Paid"),
    PAID("Paid"),
    FAILED("Failed"),
    REFUNDED("Refunded"),
    CANCELLED("Cancelled");

    private String paymentStatus;
}
