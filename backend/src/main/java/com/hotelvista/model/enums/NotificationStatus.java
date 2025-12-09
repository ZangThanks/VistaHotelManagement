package com.hotelvista.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public enum NotificationStatus {
    PENDING("PENDING"),
    APPROVED("APPROVED"),
    REJECTED("REJECTED"),
    CANCELLED("CANCELLED"),
    DISMISSED("DISMISSED"),
    SENT("SENT"),
    FAILED("FAILED");

    private String notificationStatus;

    @JsonCreator
    public static NotificationStatus fromString(String value) {
        if (value == null) return PENDING;
        for (NotificationStatus s : values()) {
            if (s.name().equalsIgnoreCase(value) ||
                    s.notificationStatus.equalsIgnoreCase(value)) {
                return s;
            }
        }
        return PENDING;
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}