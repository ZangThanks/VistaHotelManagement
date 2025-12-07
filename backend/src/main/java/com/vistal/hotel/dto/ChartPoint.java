package com.vistal.hotel.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChartPoint {
    private String label;
    private BigDecimal value;
}

