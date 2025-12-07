package com.vistal.hotel.service;

import java.time.LocalDate;
import java.util.List;
// ...existing imports...
import com.vistal.hotel.dto.RevenueResponse;
import com.vistal.hotel.dto.ChartPoint;

public interface RevenueService {
    // ...existing code...

    List<RevenueData> getRevenueByDateRange(LocalDate startDate, LocalDate endDate, String period);

    // New methods for FE
    RevenueResponse getRevenueWithSummary(LocalDate startDate, LocalDate endDate, String period);

    List<ChartPoint> getRevenueChartData(LocalDate startDate, LocalDate endDate, String period);

    // ...existing code...
}

