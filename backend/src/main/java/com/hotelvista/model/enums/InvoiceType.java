package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public enum InvoiceType {
    ROOM_BOOKING("Room booking"),
    SERVICE("Service"),
    ADDITIONAL_FEE("Additional fee"),
    REFUND("Refund");

    private String invoiceType;
}
