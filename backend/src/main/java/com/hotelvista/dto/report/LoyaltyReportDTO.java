package com.hotelvista.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyReportDTO {
    private String month;
    private Integer bronze;
    private Integer silver;
    private Integer gold;
    private Integer platinum;
    private Long totalPoints;
    private Long redemptions;
}
