package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum RequestStatus {
    PENDING("PEDING"),
    COMPLETED("COMPLETED"),
    FAILED("FAILED");

    private String requestStatus;
}
