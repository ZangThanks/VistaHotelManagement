package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
public enum PaymentMethod {
    VNPAY_QR("VNPAY QR"),
    CREDIT_CARD("CREDIT CARD"),
    BANK_TRANSFER("BANK TRANSFER"),
    CASH("CASH");

    private String paymentMethod;
}
