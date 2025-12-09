package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
}