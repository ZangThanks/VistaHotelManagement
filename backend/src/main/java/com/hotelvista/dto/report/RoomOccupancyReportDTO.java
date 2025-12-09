package com.hotelvista.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomOccupancyReportDTO {
    private String period;
    private Integer totalRooms;
    private Integer bookedRooms;
    private Double occupancyRate;
    private Double averageRate;
    private Double totalRevenue;
}
