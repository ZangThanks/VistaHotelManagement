package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
}