package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ServiceCategory {
    FOOD_BEVERAGE("FOOD BEVERAGE"),
    LAUNDRY("LAUNDRY"),
    SPA("SPA"),
    TRANSPORT("TRANSPORT"),
    TOUR("TOUR"),
    OTHER("OTHER"),
    WELLNESS("WELLNESS"),
    TRANSPORTATION("TRANSPORTATION"),
    RECREATION("RECREATION");
}

    private String serviceCategory;
}
