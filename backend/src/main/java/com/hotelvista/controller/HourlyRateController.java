package com.hotelvista.controller;

import com.hotelvista.dto.hourlyrate.HourlyRateCalculationDTO;
import com.hotelvista.dto.hourlyrate.HourlyRateRequestDTO;
import com.hotelvista.service.HourlyRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/hourly-rate")
public class HourlyRateController {

    @Autowired
    private HourlyRateService hourlyRateService;

    /**
     * Tính giá theo giờ
     * POST /hourly-rate/calculate
     */
    @PostMapping("/calculate")
    public ResponseEntity<HourlyRateCalculationDTO> calculateHourlyRate(
            @RequestBody HourlyRateRequestDTO request
    ) {
        try {
            if (request.getRoomTypeId() == null || request.getRoomTypeId().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getHours() == null || request.getHours() < 1) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getCheckInDateTime() == null) {
                return ResponseEntity.badRequest().build();
            }

            HourlyRateCalculationDTO result = hourlyRateService.calculateHourlyRate(
                    request.getRoomTypeId(),
                    request.getHours(),
                    request.getCheckInDateTime()
            );

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Tính giá theo giờ với giá tùy chỉnh
     * GET /hourly-rate/calculate-custom
     */
    @GetMapping("/calculate-custom")
    public ResponseEntity<HourlyRateCalculationDTO> calculateCustomHourlyRate(
            @RequestParam double basePrice,
            @RequestParam int hours,
            @RequestParam String checkInDateTime
    ) {
        try {
            if (hours < 1) {
                return ResponseEntity.badRequest().build();
            }

            java.time.LocalDateTime dateTime = java.time.LocalDateTime.parse(checkInDateTime);

            HourlyRateCalculationDTO result = hourlyRateService.calculateHourlyRateWithCustomPrice(
                    basePrice,
                    hours,
                    dateTime
            );

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy bảng giá theo giờ
     * GET /hourly-rate/rate-table
     */
    @GetMapping("/rate-table")
    public ResponseEntity<Map<String, Object>> getHourlyRateTable() {
        Map<String, Object> response = new HashMap<>();
        response.put("hourlyRateTable", hourlyRateService.getHourlyRateTable());
        response.put("weekendSurcharge", hourlyRateService.getWeekendSurcharge());

        return ResponseEntity.ok(response);
    }

    /**
     * Kiểm tra có phải cuối tuần không
     * GET /hourly-rate/check-weekend
     */
    @GetMapping("/check-weekend")
    public ResponseEntity<Map<String, Boolean>> checkWeekend(
            @RequestParam String dateTime
    ) {
        try {
            java.time.LocalDateTime dt = java.time.LocalDateTime.parse(dateTime);
            boolean isWeekend = hourlyRateService.isWeekend(dt);

            Map<String, Boolean> response = new HashMap<>();
            response.put("isWeekend", isWeekend);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
