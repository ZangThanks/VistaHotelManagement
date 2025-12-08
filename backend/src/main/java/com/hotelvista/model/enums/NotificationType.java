package com.hotelvista.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public enum NotificationType {
    REQUEST("REQUEST"),
    INFO("INFO"),
    ALERT("ALERT"),
    SYSTEM("SYSTEM");

    private String notificationType;

    @JsonCreator
    public static NotificationType fromString(String value) {
        if (value == null) return INFO;
        for (NotificationType t : values()) {
            if (t.name().equalsIgnoreCase(value) ||
                    t.notificationType.equalsIgnoreCase(value)) {
                return t;
            }
        }
        return INFO;
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}