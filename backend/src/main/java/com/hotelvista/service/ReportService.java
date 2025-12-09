package com.hotelvista.service;

import com.hotelvista.dto.ServiceReportDTO;
import com.hotelvista.dto.report.BookingReportDTO;
import com.hotelvista.dto.report.DashboardStatsDTO;
import com.hotelvista.dto.report.LoyaltyReportDTO;
import com.hotelvista.model.*;
import com.hotelvista.model.BookingService;
import com.hotelvista.model.enums.*;
import com.hotelvista.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final LateCheckoutRepository lateCheckoutRepository;
    private final EarlyCheckinRepository earlyCheckinRepository;
    private final BookingCancellationRepository bookingCancellationRepository;

    private final BookingServiceRepository bookingServiceRepository;
    private final ReportRepository reportRepository;


    /**
     * Lấy báo cáo dịch vụ theo khoảng thời gian
     *
     * @param startDate ngày bắt đầu
     * @param endDate   ngày kết thúc
     * @param period    loại báo cáo: daily, weekly, monthly, quarterly, yearly
     * @return danh sách ServiceReportDTO
     */
    public List<ServiceReportDTO> getServiceReport(LocalDate startDate, LocalDate endDate, String period) {
        List<com.hotelvista.model.BookingService> bookingServices = bookingServiceRepository.findByDateRange(startDate, endDate);

        // Group by period
        Map<String, List<com.hotelvista.model.BookingService>> groupedData = groupByPeriod(bookingServices, period);

        // Calculate statistics for each period
        List<ServiceReportDTO> reports = new ArrayList<>();
        for (Map.Entry<String, List<com.hotelvista.model.BookingService>> entry : groupedData.entrySet()) {
            reports.add(calculateReport(entry.getKey(), entry.getValue()));
        }

        // Sort by date
        reports.sort(Comparator.comparing(ServiceReportDTO::getDate));

        return reports;
    }

    /**
     * Group booking services by period
     */
    private Map<String, List<com.hotelvista.model.BookingService>> groupByPeriod(List<com.hotelvista.model.BookingService> bookingServices, String period) {
        DateTimeFormatter formatter;

        switch (period.toLowerCase()) {
            case "daily":
                formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                break;
            case "weekly":
                formatter = DateTimeFormatter.ofPattern("'Week' ww yyyy");
                break;
            case "monthly":
                formatter = DateTimeFormatter.ofPattern("MMM yyyy");
                break;
            case "quarterly":
                return groupByQuarter(bookingServices);
            case "yearly":
                formatter = DateTimeFormatter.ofPattern("yyyy");
                break;
            default:
                formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        }

        DateTimeFormatter finalFormatter = formatter;
        return bookingServices.stream()
                .collect(Collectors.groupingBy(bs ->
                        bs.getBooking().getCheckInDate().toLocalDate().format(finalFormatter)
                ));
    }

    /**
     * Group by quarter
     */
    private Map<String, List<com.hotelvista.model.BookingService>> groupByQuarter(List<com.hotelvista.model.BookingService> bookingServices) {
        return bookingServices.stream()
                .collect(Collectors.groupingBy(bs -> {
                    LocalDate date = bs.getBooking().getCheckInDate().toLocalDate();
                    int quarter = (date.getMonthValue() - 1) / 3 + 1;
                    return "Q" + quarter + " " + date.getYear();
                }));
    }

    /**
     * Calculate report statistics for a period
     */
    private ServiceReportDTO calculateReport(String date, List<com.hotelvista.model.BookingService> bookingServices) {
        ServiceReportDTO report = new ServiceReportDTO();
        report.setDate(date);

        double foodBeverageTotal = 0;
        double laundryTotal = 0;
        double spaTotal = 0;
        double transportTotal = 0;
        double tourTotal = 0;
        double othersTotal = 0;
        int totalOrders = bookingServices.size();

        for (BookingService bs : bookingServices) {
            ServiceCategory category = bs.getService().getServiceCategory();
            double amount = bs.getTotalAmount() != null ? bs.getTotalAmount() : 0;

            switch (category) {
                case FOOD_BEVERAGE:
                    foodBeverageTotal += amount;
                    break;
                case LAUNDRY:
                    laundryTotal += amount;
                    break;
                case SPA:
                    spaTotal += amount;
                    break;
                case TRANSPORT:
                    transportTotal += amount;
                    break;
                case TOUR:
                    tourTotal += amount;
                    break;
                default:
                    // WELLNESS, RECREATION, OTHER đều vào Others
                    othersTotal += amount;
                    break;
            }
        }

        report.setFoodBeverage(foodBeverageTotal);
        report.setLaundry(laundryTotal);
        report.setSpa(spaTotal);
        report.setTransport(transportTotal);
        report.setTour(tourTotal);
        report.setOthers(othersTotal);
        report.setTotalOrders(totalOrders);

        double totalRevenue = foodBeverageTotal + laundryTotal + spaTotal + transportTotal + tourTotal + othersTotal;
        double avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        report.setAvgOrderValue(avgOrderValue);

        return report;

    }
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
    /**
     * Lấy báo cáo loyalty theo period
     * @param startDate ngày bắt đầu
     * @param endDate ngày kết thúc
     * @param period loại period (DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY)
     * @return danh sách LoyaltyReportDTO
     */
    public List<LoyaltyReportDTO> getLoyaltyReport(LocalDate startDate, LocalDate endDate, ReportPeriod period) {
        switch (period) {
            case DAILY:
                return getLoyaltyReportDaily(startDate, endDate);
            case WEEKLY:
                return getLoyaltyReportWeekly(startDate, endDate);
            case MONTHLY:
                return getLoyaltyReportMonthly(startDate, endDate);
            case QUARTERLY:
                return getLoyaltyReportQuarterly(startDate, endDate);
            case YEARLY:
                return getLoyaltyReportYearly(startDate, endDate);
            default:
                return getLoyaltyReportMonthly(startDate, endDate);
        }
    }

    /**
     * Lấy báo cáo loyalty theo ngày
     */
    private List<LoyaltyReportDTO> getLoyaltyReportDaily(LocalDate startDate, LocalDate endDate) {
        List<LoyaltyReportDTO> reports = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd", Locale.ENGLISH);

        for (LocalDate current = startDate; !current.isAfter(endDate); current = current.plusDays(1)) {
            LoyaltyReportDTO dto = createLoyaltyReport(current, formatter.format(current));
            reports.add(dto);
        }

        return reports;
    }

    /**
     * Lấy báo cáo loyalty theo tuần
     */
    private List<LoyaltyReportDTO> getLoyaltyReportWeekly(LocalDate startDate, LocalDate endDate) {
        List<LoyaltyReportDTO> reports = new ArrayList<>();

        // Điều chỉnh startDate về thứ 2 của tuần
        LocalDate current = startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        while (!current.isAfter(endDate)) {
            LocalDate weekEnd = current.plusDays(6);
            if (weekEnd.isAfter(endDate)) {
                weekEnd = endDate;
            }

            String label = "Week " + current.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) +
                    " (" + current.format(DateTimeFormatter.ofPattern("MMM dd")) + ")";

            LoyaltyReportDTO dto = createLoyaltyReport(weekEnd, label);
            reports.add(dto);

            current = current.plusWeeks(1);
        }

        return reports;
    }

    /**
     * Lấy báo cáo loyalty theo tháng
     */
    private List<LoyaltyReportDTO> getLoyaltyReportMonthly(LocalDate startDate, LocalDate endDate) {
        List<LoyaltyReportDTO> reports = new ArrayList<>();

        YearMonth start = YearMonth.from(startDate);
        YearMonth end = YearMonth.from(endDate);

        for (YearMonth current = start;
             !current.isAfter(end);
             current = current.plusMonths(1)
        ) {
            LocalDate monthEnd = current.atEndOfMonth();

            // Đến số thành viên theo membership level tại tháng cuối
            Integer bronzeCount = customerRepository.countByMembershipLevelAndDate(
                    MemberShipLevel.BRONZE, monthEnd
            );
            Integer silverCount = customerRepository.countByMembershipLevelAndDate(
                    MemberShipLevel.SILVER, monthEnd
            );

            Integer goldCount = customerRepository.countByMembershipLevelAndDate(
                    MemberShipLevel.GOLD, monthEnd
            );

            Integer platinumCount = customerRepository.countByMembershipLevelAndDate(
                    MemberShipLevel.PLATINUM, monthEnd
            );

            Long totalPoints = customerRepository.getTotalLoyaltyPoints();

            String monthName = current.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            LoyaltyReportDTO dto = new LoyaltyReportDTO(
                    monthName,
                    bronzeCount != null ? bronzeCount : 0,
                    silverCount != null ? silverCount : 0,
                    goldCount != null ? goldCount : 0,
                    platinumCount != null ? platinumCount : 0,
                    totalPoints != null ? totalPoints : 0L,
                    0L
            );

            reports.add(dto);
        }

        return reports;
    }

    /**
     * Lấy báo cáo loyalty theo quý
     */
    private List<LoyaltyReportDTO> getLoyaltyReportQuarterly(LocalDate startDate, LocalDate endDate) {
        List<LoyaltyReportDTO> reports = new ArrayList<>();

        // Điều chỉnh về đầu quý
        int startQuarter = (startDate.getMonthValue() - 1) / 3;
        LocalDate current = startDate.withMonth(startQuarter * 3 + 1).withDayOfMonth(1);

        while (!current.isAfter(endDate)) {
            LocalDate quarterEnd = current.plusMonths(3).minusDays(1);
            if (quarterEnd.isAfter(endDate)) {
                quarterEnd = endDate;
            }

            int quarter = (current.getMonthValue() - 1) / 3 + 1;
            String label = "Q" + quarter + " " + current.getYear();

            LoyaltyReportDTO dto = createLoyaltyReport(quarterEnd, label);
            reports.add(dto);

            current = current.plusMonths(3);
        }

        return reports;
    }

    /**
     * Lấy báo cáo loyalty theo năm
     */
    private List<LoyaltyReportDTO> getLoyaltyReportYearly(LocalDate startDate, LocalDate endDate) {
        List<LoyaltyReportDTO> reports = new ArrayList<>();

        int startYear = startDate.getYear();
        int endYear = endDate.getYear();

        for (int year = startYear; year <= endYear; year++) {
            LocalDate yearEnd = LocalDate.of(year, 12, 31);
            if (yearEnd.isAfter(endDate)) {
                yearEnd = endDate;
            }

            String label = String.valueOf(year);
            LoyaltyReportDTO dto = createLoyaltyReport(yearEnd, label);
            reports.add(dto);
        }

        return reports;
    }

    /**
     * Helper method để tạo LoyaltyReportDTO
     */
    private LoyaltyReportDTO createLoyaltyReport(LocalDate date, String label) {
        Integer bronzeCount = customerRepository.countByMembershipLevelAndDate(
                MemberShipLevel.BRONZE, date
        );
        Integer silverCount = customerRepository.countByMembershipLevelAndDate(
                MemberShipLevel.SILVER, date
        );
        Integer goldCount = customerRepository.countByMembershipLevelAndDate(
                MemberShipLevel.GOLD, date
        );
        Integer platinumCount = customerRepository.countByMembershipLevelAndDate(
                MemberShipLevel.PLATINUM, date
        );
        Long totalPoints = customerRepository.getTotalLoyaltyPoints();

        return new LoyaltyReportDTO(
                label,
                bronzeCount != null ? bronzeCount : 0,
                silverCount != null ? silverCount : 0,
                goldCount != null ? goldCount : 0,
                platinumCount != null ? platinumCount : 0,
                totalPoints != null ? totalPoints : 0L,
                0L
        );
    }

    /**
     * Lấy báo cáo booking theo period
     * @param startDate ngày bắt đầu
     * @param endDate ngày kết thúc
     * @param period loại period (DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY)
     * @return danh sách BookingReportDTO
     */
    public List<BookingReportDTO> getBookingReport(LocalDate startDate, LocalDate endDate, ReportPeriod period) {
        switch (period) {
            case DAILY:
                return getBookingReportDaily(startDate, endDate);
            case WEEKLY:
                return getBookingReportWeekly(startDate, endDate);
            case MONTHLY:
                return getBookingReportMonthly(startDate, endDate);
            case QUARTERLY:
                return getBookingReportQuarterly(startDate, endDate);
            case YEARLY:
                return getBookingReportYearly(startDate, endDate);
            default:
                return getBookingReportMonthly(startDate, endDate);
        }
    }

    /**
     * Lấy báo cáo booking theo ngày
     */
    private List<BookingReportDTO> getBookingReportDaily(LocalDate startDate, LocalDate endDate) {
        List<BookingReportDTO> reports = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd", Locale.ENGLISH);

        for (LocalDate current = startDate;
             !current.isAfter(endDate);
             current = current.plusDays(1)
        ) {
            BookingReportDTO dto = createBookingReport(current, current, formatter.format(current));
            reports.add(dto);
        }

        return reports;
    }

    /**
     * Lấy báo cáo booking theo tuần
     */
    private List<BookingReportDTO> getBookingReportWeekly(LocalDate startDate, LocalDate endDate) {
        List<BookingReportDTO> reports = new ArrayList<>();

        LocalDate current = startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        while (!current.isAfter(endDate)) {
            LocalDate weekEnd = current.plusDays(6);
            if (weekEnd.isAfter(endDate)) {
                weekEnd = endDate;
            }

            String label = "Week " + current.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) +
                    " (" + current.format(DateTimeFormatter.ofPattern("MMM dd")) + ")";

            BookingReportDTO dto = createBookingReport(current, weekEnd, label);
            reports.add(dto);

            current = current.plusWeeks(1);
        }

        return reports;
    }

    /**
     * Lấy báo cáo booking theo tháng
     */
    private List<BookingReportDTO> getBookingReportMonthly(LocalDate startDate, LocalDate endDate) {
        List<BookingReportDTO> reports = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);

        YearMonth startMonth = YearMonth.from(startDate);
        YearMonth endMonth = YearMonth.from(endDate);

        YearMonth current = startMonth;
        while (!current.isAfter(endMonth)) {
            LocalDate monthStart = current.atDay(1);
            LocalDate monthEnd = current.atEndOfMonth();

            if (monthStart.isBefore(startDate)) {
                monthStart = startDate;
            }
            if (monthEnd.isAfter(endDate)) {
                monthEnd = endDate;
            }

            BookingReportDTO dto = createBookingReport(monthStart, monthEnd, formatter.format(monthStart));
            reports.add(dto);

            current = current.plusMonths(1);
        }

        return reports;
    }

    /**
     * Lấy báo cáo booking theo quý
     */
    private List<BookingReportDTO> getBookingReportQuarterly(LocalDate startDate, LocalDate endDate) {
        List<BookingReportDTO> reports = new ArrayList<>();

        LocalDate current = startDate.with(startDate.getMonth().firstMonthOfQuarter())
                .with(TemporalAdjusters.firstDayOfMonth());

        while (!current.isAfter(endDate)) {
            int quarter = current.get(IsoFields.QUARTER_OF_YEAR);
            int year = current.getYear();

            LocalDate quarterStart = current;
            LocalDate quarterEnd = quarterStart.plusMonths(3).minusDays(1);

            if (quarterStart.isBefore(startDate)) {
                quarterStart = startDate;
            }
            if (quarterEnd.isAfter(endDate)) {
                quarterEnd = endDate;
            }

            String label = "Q" + quarter + " " + year;
            BookingReportDTO dto = createBookingReport(quarterStart, quarterEnd, label);
            reports.add(dto);

            current = current.plusMonths(3);
        }

        return reports;
    }

    /**
     * Lấy báo cáo booking theo năm
     */
    private List<BookingReportDTO> getBookingReportYearly(LocalDate startDate, LocalDate endDate) {
        List<BookingReportDTO> reports = new ArrayList<>();

        int startYear = startDate.getYear();
        int endYear = endDate.getYear();

        for (int year = startYear; year <= endYear; year++) {
            LocalDate yearStart = LocalDate.of(year, 1, 1);
            LocalDate yearEnd = LocalDate.of(year, 12, 31);

            if (yearStart.isBefore(startDate)) {
                yearStart = startDate;
            }
            if (yearEnd.isAfter(endDate)) {
                yearEnd = endDate;
            }

            BookingReportDTO dto = createBookingReport(yearStart, yearEnd, String.valueOf(year));
            reports.add(dto);
        }

        return reports;
    }

    /**
     * Tạo booking report cho một khoảng thời gian
     */
    private BookingReportDTO createBookingReport(LocalDate startDate, LocalDate endDate, String periodLabel) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Get all bookings where bookingDate is in the period
        List<Booking> bookings = bookingRepository.findAllByBookingDateBetween(startDateTime, endDateTime);

        long totalBookings = bookings.size();

        // Đếm các booking hoàn thành
        long completedBookings = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CHECKED_OUT)
                .count();

        // Đếm các booking bị hủy
        long cancelledBookings = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                .count();

        // Tính tỷ lệ hủy
        double cancellationRate = totalBookings > 0
                ? (cancelledBookings * 100.0) / totalBookings
                : 0.0;

        // Tính tổng doanh thu từ các booking đã hoàn thành (checked out)
        double bookingRevenue = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CHECKED_OUT)
                .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0)
                .sum();

        // Tính tổng phí Late Checkout (APPROVED) trong khoảng thời gian
        double lateCheckoutFees = bookings.stream()
                .filter(b -> b.getLateCheckout() != null)
                .map(Booking::getLateCheckout)
                .filter(lc -> lc.getApprovalStatus() == ApprovalStatus.APPROVED)
                .mapToDouble(LateCheckout::getAdditionalFee)
                .sum();

        // Tính tổng phí Early Checkin (APPROVED) trong khoảng thời gian
        double earlyCheckinFees = bookings.stream()
                .filter(b -> b.getEarlyCheckin() != null)
                .map(Booking::getEarlyCheckin)
                .filter(ec -> ec.getApprovalStatus() == ApprovalStatus.APPROVED)
                .mapToDouble(EarlyCheckin::getAdditionalFee)
                .sum();

        // Tính tổng số tiền hoàn trả từ các booking bị hủy
        double totalRefunds = bookings.stream()
                .filter(b -> b.getCancellation() != null)
                .map(Booking::getCancellation)
                .filter(c -> c.getRefundAmount() != null)
                .mapToDouble(BookingCancellation::getRefundAmount)
                .sum();

        // Tổng doanh thu = Doanh thu booking + Phí late checkout + Phí early checkin - Hoàn trả
        double totalRevenue = bookingRevenue + lateCheckoutFees + earlyCheckinFees - totalRefunds;

        // Tính giá trị trung bình của booking (chỉ tính những booking hoàn thành)
        double averageBookingValue = completedBookings > 0
                ? bookingRevenue / completedBookings
                : 0.0;

        return new BookingReportDTO(
                periodLabel,
                totalBookings,
                completedBookings,
                cancelledBookings,
                Math.round(cancellationRate * 100.0) / 100.0, // Round to 2 decimal places
                Math.round(averageBookingValue * 100.0) / 100.0,
                Math.round(totalRevenue * 100.0) / 100.0
        );
    }
}
