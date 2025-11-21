package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public enum DiscountType {
    PERCENT("Percentage (%)"),
    FIXED("Fixed Amount (VND)");

    private String discountName;
}
