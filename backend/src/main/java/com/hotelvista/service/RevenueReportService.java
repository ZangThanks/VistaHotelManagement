package com.hotelvista.service;

import com.hotelvista.dto.RevenueReportDTO;
import com.hotelvista.dto.RevenueReportProjection;
import com.hotelvista.repository.RevenueReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class RevenueReportService {

    @Autowired
    private RevenueReportRepository reportRepository;

//    public List<RevenueReportProjection> getRevenueByType(
//            String type, LocalDate fromDate, LocalDate toDate) {
//
//        return switch (type.toUpperCase()) {
//            case "DAILY" -> reportRepository.getDaily(fromDate, toDate);
//            case "WEEKLY" -> reportRepository.getWeeklyByDay(fromDate, toDate);
//            case "MONTHLY" -> reportRepository.getMonthly(fromDate, toDate);
//            case "QUARTERLY" -> reportRepository.getQuarterly(fromDate, toDate);
//            case "YEARLY" -> reportRepository.getYearly(fromDate, toDate);
//            default -> throw new IllegalArgumentException("Invalid report type");
//        };
//    }

    public List<RevenueReportProjection> getDailyCurrentMonth() {

        LocalDate now = LocalDate.now();

        LocalDate firstDayOfMonth = now.withDayOfMonth(1);
        LocalDate lastDayOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        return reportRepository.getDaily(firstDayOfMonth, lastDayOfMonth);
    }

    public List<RevenueReportProjection> getWeeklyCurrentMonth() {

        LocalDate now = LocalDate.now();

        LocalDate firstDayOfMonth = now.withDayOfMonth(1);
        LocalDate lastDayOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        return reportRepository.getWeeklyOfMonth(firstDayOfMonth, lastDayOfMonth);
    }

    public List<RevenueReportProjection> getMonthlyInYear(int year) {
        return reportRepository.getMonthlyByYear(year);
    }

    public List<RevenueReportProjection> getQuarterlyInYear(int year) {
        return reportRepository.getQuarterlyByYear(year);
    }

    public List<RevenueReportProjection> getYearlyRevenue() {
        return reportRepository.getYearly();
    }
    public List<RevenueReportProjection> getRevenueByDateRange(
            LocalDate fromDate,
            LocalDate toDate
    ) {
        return reportRepository.getRevenueByDateRange(fromDate, toDate);
    }



}
