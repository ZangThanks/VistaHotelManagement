package com.hotelvista.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

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
}
