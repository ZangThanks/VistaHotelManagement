package com.hotelvista.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public enum NotificationPriority {
    LOW("LOW"),
    NORMAL("NORMAL"),
    HIGH("HIGH"),
    URGENT("URGENT");

    private String notificationPriority;

    @JsonCreator
    public static NotificationPriority fromString(String value) {
        if (value == null) return NORMAL;
        for (NotificationPriority p : values()) {
            if (p.name().equalsIgnoreCase(value) ||
                    p.notificationPriority.equalsIgnoreCase(value)) {
                return p;
            }
        }
        return NORMAL;
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}