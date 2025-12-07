package com.hotelvista.controller;

import com.hotelvista.dto.RevenueReportDTO;
import com.hotelvista.service.RevenueReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/revenue")
public class RevenueReportController {
    private final RevenueReportService service;

    public RevenueReportController(RevenueReportService revenueReportService) {
        this.service = revenueReportService;
    }

    @GetMapping("/monthly")
    public List<RevenueReportDTO> getRevenue() {
        return service.getMonthlyRevenue();
    }

}
