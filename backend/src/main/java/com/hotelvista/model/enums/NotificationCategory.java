package com.hotelvista.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
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

    @JsonCreator
    public static NotificationCategory fromString(String value) {
        if (value == null) return OTHER;
        for (NotificationCategory cat : values()) {
            if (cat.name().equalsIgnoreCase(value) ||
                    cat.notificationCategory.equalsIgnoreCase(value)) {
                return cat;
            }
        }
        return OTHER;
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}