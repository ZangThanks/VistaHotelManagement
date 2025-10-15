package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public enum OrderStatus {
    PLACE("PLACE"),
    PREPARING("PREPARING"),
    READY("READY"),
    DELIVERED("DELIVERED"),
    CANCELLED("CANCELLED");

    private String orderStatus;
}
