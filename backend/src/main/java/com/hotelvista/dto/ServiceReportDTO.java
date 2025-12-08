package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceReportDTO {
    private String date;
    private Double foodBeverage;
    private Double laundry;
    private Double spa;
    private Double transport;
    private Double tour;
    private Double others;
    private Integer totalOrders;
    private Double avgOrderValue;
}
