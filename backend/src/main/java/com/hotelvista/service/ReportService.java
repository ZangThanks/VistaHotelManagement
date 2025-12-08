package com.hotelvista.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import com.hotelvista.dto.report.BookingReportDTO;
import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingCancellation;
import com.hotelvista.model.EarlyCheckin;
import com.hotelvista.model.LateCheckout;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.model.enums.BookingStatus;
import com.hotelvista.repository.BookingCancellationRepository;
import com.hotelvista.repository.BookingRepository;
import com.hotelvista.repository.EarlyCheckinRepository;
import com.hotelvista.repository.LateCheckoutRepository;
import org.springframework.stereotype.Service;

import com.hotelvista.dto.report.LoyaltyReportDTO;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.model.enums.ReportPeriod;
import com.hotelvista.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final LateCheckoutRepository lateCheckoutRepository;
    private final EarlyCheckinRepository earlyCheckinRepository;
    private final BookingCancellationRepository bookingCancellationRepository;

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
