package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
public enum ReportType {
    REVENUE("REVENUE"),
    OCCUPANCY("OCCUPANCY"),
    CUSTOMER("CUSTOMER"),
    SERVICE("SERVICE"),
    MAINTENANCE("MAINTENANCE");

    private String reportType;
}
