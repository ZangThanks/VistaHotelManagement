package com.hotelvista.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Double totalRevenue;
    private Double revenueChange;
    private Integer totalBookings;
    private Double bookingsChange;
    private Double occupancyRate;
    private Double occupancyChange;
    private Integer totalGuests;
    private Double guestsChange;
    private Integer availableRooms;
    private Integer bookedRooms;
    private Integer maintenanceRooms;
    private Integer cleaningRooms;
    private Double avgRating;
    private Integer totalReviews;
    private Integer pendingCheckIns;
    private Integer pendingCheckOuts;

    private List<Map<String, Object>> revenueData;
    private List<Map<String, Object>> roomTypeData;
    private List<Map<String, Object>> bookingStatusData;
    private List<Map<String, Object>> dailyOccupancy;
    private List<Map<String, Object>> popularServices;
}
