package com.hotelvista.dto.hourlyrate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HourlyRateCalculationDTO {
    private Double basePrice;
    private Integer hours;
    private Integer basePercentage;
    private Boolean isWeekend;
    private Integer weekendSurcharge;
    private Integer totalPercentage;
    private Double totalAmount;
    private List<String> breakdown;
}
