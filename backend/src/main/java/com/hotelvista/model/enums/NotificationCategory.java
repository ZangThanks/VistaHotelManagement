package com.hotelvista.model.enums;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public enum NotificationCategory {
    EARLY_CHECKIN("EARLY_CHECKIN"),
    LATE_CHECKOUT("LATE_CHECKOUT"),
    CANCELLATION("CANCELLATION"),
    PAYMENT_ISSUE("PAYMENT_ISSUE"),
    MAINTENANCE("MAINTENANCE"),
    HOUSEKEEPING("HOUSEKEEPING"),
    PROMOTION("PROMOTION"),
    SECURITY("SECURITY"),
    OTHER("OTHER");
    private String notificationCategory;
}