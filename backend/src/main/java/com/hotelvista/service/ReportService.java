package com.hotelvista.service;

import com.hotelvista.dto.report.DashboardStatsDTO;
import com.hotelvista.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = now.withDayOfMonth(now.toLocalDate().lengthOfMonth()).withHour(23).withMinute(59).withSecond(59);

        LocalDateTime lastMonthStart = startOfMonth.minusMonths(1);
        LocalDateTime lastMonthEnd = startOfMonth.minusSeconds(1);

        // Current month stats
        Map<String, Object> currentStats = reportRepository.getDashboardStats(startOfMonth, endOfMonth);
        stats.setTotalRevenue(((Number) currentStats.get("totalRevenue")).doubleValue());
        stats.setTotalBookings(((Number) currentStats.get("totalBookings")).intValue());
        stats.setTotalGuests(((Number) currentStats.get("totalGuests")).intValue());

        // Last month stats for comparison
        Map<String, Object> lastMonthStats = reportRepository.getDashboardStats(lastMonthStart, lastMonthEnd);
        Double lastMonthRevenue = ((Number) lastMonthStats.get("totalRevenue")).doubleValue();
        Integer lastMonthBookings = ((Number) lastMonthStats.get("totalBookings")).intValue();
        Integer lastMonthGuests = ((Number) lastMonthStats.get("totalGuests")).intValue();

        // Calculate percentage changes
        stats.setRevenueChange(calculatePercentageChange(stats.getTotalRevenue(), lastMonthRevenue));
        stats.setBookingsChange(calculatePercentageChange(stats.getTotalBookings().doubleValue(), lastMonthBookings.doubleValue()));
        stats.setGuestsChange(calculatePercentageChange(stats.getTotalGuests().doubleValue(), lastMonthGuests.doubleValue()));

        // Room status distribution
        List<Map<String, Object>> roomStatus = reportRepository.getRoomStatusDistribution();
        for (Map<String, Object> status : roomStatus) {
            String statusName = (String) status.get("status");
            Integer count = ((Number) status.get("count")).intValue();

            switch (statusName) {
                case "AVAILABLE" -> stats.setAvailableRooms(count);
                case "BOOKED" -> stats.setBookedRooms(count);
                case "MAINTENANCE" -> stats.setMaintenanceRooms(count);
                case "CLEANING" -> stats.setCleaningRooms(count);
            }
        }

        // Occupancy rate
        Double currentOccupancy = reportRepository.getOccupancyRate();
        stats.setOccupancyRate(currentOccupancy != null ? currentOccupancy : 0.0);

        // For occupancy change, calculate from last month's average
        Double lastMonthOccupancy = 75.0; // You can implement a more precise calculation
        stats.setOccupancyChange(stats.getOccupancyRate() - lastMonthOccupancy);

        // Ratings
        Map<String, Object> ratings = reportRepository.getAverageRating();
        stats.setAvgRating(((Number) ratings.get("avgRating")).doubleValue());
        stats.setTotalReviews(((Number) ratings.get("totalReviews")).intValue());

        // Check-ins/Check-outs
        stats.setPendingCheckIns(reportRepository.getPendingCheckInsToday());
        stats.setPendingCheckOuts(reportRepository.getPendingCheckOutsToday());

        // Chart data
        stats.setRevenueData(reportRepository.getRevenueTrend());
        stats.setDailyOccupancy(reportRepository.getDailyOccupancy());
        stats.setRoomTypeData(reportRepository.getRoomTypeDistribution());
        stats.setBookingStatusData(reportRepository.getBookingStatusDistribution());
        stats.setPopularServices(reportRepository.getPopularServices());

        return stats;
    }

    private Double calculatePercentageChange(Double current, Double previous) {
        if (previous == 0) return 0.0;
        return ((current - previous) / previous) * 100;
    }
}
