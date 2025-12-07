package com.vistal.hotel.dto;

import java.math.BigDecimal;
import java.util.List;
import com.vistal.hotel.service.RevenueData;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RevenueResponse {
    private List<RevenueData> items;
    private BigDecimal totalRoomRevenue;
    private BigDecimal totalServiceRevenue;
    private BigDecimal totalRevenue;
    private Integer totalBookings;
}

