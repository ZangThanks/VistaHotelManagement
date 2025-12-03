package com.hotelvista.model.enums;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public enum BookingType {
    HOURLY("Hourly"),
    DAILY("Daily");

    private String bookingType;
}
