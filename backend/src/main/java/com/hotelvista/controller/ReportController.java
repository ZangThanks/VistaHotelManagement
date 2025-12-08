package com.hotelvista.controller;

import com.hotelvista.dto.ServiceReportDTO;
import com.hotelvista.dto.report.BookingReportDTO;
import com.hotelvista.dto.report.DashboardStatsDTO;
import com.hotelvista.dto.report.LoyaltyReportDTO;
import com.hotelvista.model.enums.ReportPeriod;
import com.hotelvista.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {
    @Autowired
    private  ReportService reportService;

    /**
     * API lấy báo cáo dịch vụ
     * @param startDate ngày bắt đầu (format: yyyy-MM-dd)
     * @param endDate ngày kết thúc (format: yyyy-MM-dd)
     * @param period loại báo cáo: daily, weekly, monthly, quarterly, yearly
     * @return danh sách ServiceReportDTO
     */
    @GetMapping("/services")
    public List<ServiceReportDTO> getServiceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "monthly") String period
    ) {
        return reportService.getServiceReport(startDate, endDate, period);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(reportService.getDashboardStats());
    }

    @GetMapping("/loyalty")
    public ResponseEntity<List<LoyaltyReportDTO>> getLoyaltyReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "MONTHLY") ReportPeriod period
    ) {
        List<LoyaltyReportDTO> report = reportService.getLoyaltyReport(startDate, endDate, period);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/booking")
    public ResponseEntity<List<BookingReportDTO>> getBookingReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "MONTHLY") ReportPeriod period
    ) {
        List<BookingReportDTO> report = reportService.getBookingReport(startDate, endDate, period);
        return ResponseEntity.ok(report);
    }

}
