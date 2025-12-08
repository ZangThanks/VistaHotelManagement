package com.hotelvista.model.enums;

import lombok.*;

@Getter
@ToString
@AllArgsConstructor
public enum RefundMethod {
    BANK_TRANSFER("BANK_TRANSFER"),
    MOMO("MOMO"),
    ZALOPAY("ZALOPAY"),
    VNPAY("VNPAY");
    private String refundMethod;
}
