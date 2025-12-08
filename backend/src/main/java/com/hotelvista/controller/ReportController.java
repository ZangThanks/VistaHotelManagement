package com.hotelvista.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotelvista.dto.report.BookingReportDTO;
import com.hotelvista.dto.report.LoyaltyReportDTO;
import com.hotelvista.model.enums.ReportPeriod;
import com.hotelvista.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

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
