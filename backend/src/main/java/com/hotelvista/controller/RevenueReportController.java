package com.hotelvista.controller;

import com.hotelvista.dto.RevenueReportDTO;
import com.hotelvista.dto.RevenueReportProjection;
import com.hotelvista.service.RevenueReportService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/revenue")
public class RevenueReportController {
    private final RevenueReportService service;

    public RevenueReportController(RevenueReportService revenueReportService) {
        this.service = revenueReportService;
    }

//    @GetMapping()
//    public List<RevenueReportProjection> getRevenue(
//            @RequestParam String type,
//            @RequestParam LocalDate fromDate,
//            @RequestParam LocalDate toDate) {
//
//        return service.getRevenueByType(type, fromDate, toDate);
//    }

    @GetMapping("/daily-current-month")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<RevenueReportProjection> getDailyCurrentMonth() {
        return service.getDailyCurrentMonth();
    }
    @GetMapping("/weekly-current-month")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<RevenueReportProjection> getWeeklyCurrentMonth() {
        return service.getWeeklyCurrentMonth();
    }

    @GetMapping("/monthly")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<RevenueReportProjection> getMonthly(@RequestParam int year) {
        return service.getMonthlyInYear(year);
    }

    @GetMapping("/quarterly")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<RevenueReportProjection> getQuarterly(@RequestParam int year) {
        return service.getQuarterlyInYear(year);
    }

    @GetMapping("/yearly")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<RevenueReportProjection> getYearly() {
        return service.getYearlyRevenue();
    }
    @GetMapping("/by-date-range")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<RevenueReportProjection> getRevenueByDateRange(
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate
    ) {
        return service.getRevenueByDateRange(fromDate, toDate);
    }





}
