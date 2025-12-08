package com.hotelvista.model.enums;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public enum BookingStatus {
    WAITING("Waiting"),
    PENDING("Pending"),
    CHECKED_IN("Checked In"),
    CHECKED_OUT("Checked Out"),
    CANCELLED("Cancelled");

    private String status;
}
