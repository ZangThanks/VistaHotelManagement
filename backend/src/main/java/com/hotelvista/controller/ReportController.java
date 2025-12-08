package com.hotelvista.controller;

import com.hotelvista.dto.ServiceReportDTO;
import com.hotelvista.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller xử lý các API liên quan đến báo cáo và thống kê
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

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
}
