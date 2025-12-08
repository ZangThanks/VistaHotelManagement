package com.hotelvista.dto.promotion;

import com.hotelvista.model.enums.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class DiscountPromotionDTO {
    private String roomTypeID;
    private String promotionID;
    private DiscountType discountType;
    private Double discountValue;
}
