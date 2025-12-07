package com.vistal.hotel.controller;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import com.vistal.hotel.dto.RevenueResponse;
import com.vistal.hotel.dto.ChartPoint;
import com.vistal.hotel.service.RevenueService;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/range")
    public RevenueResponse getRevenueRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "monthly") String period) {

        return revenueService.getRevenueWithSummary(startDate, endDate, period);
    }

    @GetMapping("/chart")
    public List<ChartPoint> getRevenueChart(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "monthly") String period) {

        return revenueService.getRevenueChartData(startDate, endDate, period);
    }
}

