package com.hotelvista.controller;

import com.hotelvista.model.EarlyCheckin;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.service.EarlyCheckinService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/early-checkin")
public class EarlyCheckinController {

    @Autowired
    private EarlyCheckinService earlyCheckinService;

    /**
     * Gửi yêu cầu check-in sớm
     */
    @PostMapping("/request")
    public Map<String, Object> requestEarlyCheckin(@RequestBody Map<String, Object> payload) {

        String bookingId = (String) payload.get("bookingId");
        String requestTimeStr = (String) payload.get("requestTime");
        double roomPrice = Double.parseDouble(payload.get("roomPrice").toString());

        LocalDateTime requestTime = LocalDateTime.parse(requestTimeStr);

        EarlyCheckin ec = earlyCheckinService.createPendingRequest(
                bookingId,
                requestTime,
                roomPrice
        );

        if (ec == null) {
            return Map.of("success", false, "message", "Không tìm thấy booking");
        }

        return Map.of(
                "success", true,
                "message", "Yêu cầu check-in sớm đã được gửi",
                "data", ec
        );
    }

    /**
     * Duyệt hoặc từ chối yêu cầu check-in sớm
     */
    @PutMapping("/approve/{id}")
    public Map<String, Object> approveRequest(
            @PathVariable("id") String requestId,
            @RequestParam("status") String status,
            @RequestParam(value = "employeeId", required = false) String employeeId
    ) {
        ApprovalStatus approvalStatus = ApprovalStatus.valueOf(status.toUpperCase());

        EarlyCheckin ec = earlyCheckinService.updateApprovalStatus(
                requestId,
                approvalStatus,
                employeeId
        );

        if (ec == null) {
            return Map.of("success", false, "message", "Không tìm thấy yêu cầu");
        }

        return Map.of(
                "success", true,
                "message", "Cập nhật trạng thái thành công",
                "data", ec
        );
    }

    /**
     * Danh sách tất cả yêu cầu check-in sớm
     */
    @GetMapping
    public List<EarlyCheckin> getAll() {
        return earlyCheckinService.findAll();
    }
}
