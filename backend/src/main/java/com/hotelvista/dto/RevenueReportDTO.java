package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueReportDTO {
    private String date;
    private Double roomRevenue;
    private Double serviceRevenue;
    private Double totalRevenue;
    private Double bookingCount;
}