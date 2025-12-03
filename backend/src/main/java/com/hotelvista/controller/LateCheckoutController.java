package com.hotelvista.controller;

import com.hotelvista.dto.LateCheckoutDTO;
import com.hotelvista.model.LateCheckout;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.service.LateCheckoutService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/late-checkout")
public class LateCheckoutController {

    @Autowired
    private LateCheckoutService lateCheckoutService;


    /** Lấy danh sách yêu cầu checkout muộn (dạng DTO đầy đủ) */
    @GetMapping
    public List<LateCheckoutDTO> getAllLateCheckouts() {
        return lateCheckoutService.getAllDTO();
    }


    /** Gửi yêu cầu checkout muộn */
    @PostMapping("/request")
    public Map<String, Object> requestLateCheckout(@RequestBody Map<String, Object> payload) {
        try {
            String bookingId = (String) payload.get("bookingId");
            String requestTimeStr = (String) payload.get("requestTime");
            double roomPrice = Double.parseDouble(payload.get("roomPrice").toString());

            LocalDateTime requestTime = LocalDateTime.parse(requestTimeStr);

            LateCheckout lc = lateCheckoutService.createPendingRequest(
                    bookingId,
                    requestTime,
                    roomPrice
            );

            // ⭐ Trả về DTO để FE có đủ data hiển thị
            LateCheckoutDTO dto = lateCheckoutService.convertToDTO(lc);

            return Map.of(
                    "success", true,
                    "message", "Yêu cầu checkout muộn đã được gửi",
                    "data", dto
            );

        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "error", e.getMessage()
            );
        }
    }


    /** Duyệt hoặc từ chối yêu cầu checkout muộn */
    @PutMapping("/approve/{id}")
    public Map<String, Object> approveLateCheckout(
            @PathVariable("id") String requestId,
            @RequestParam("status") String status
    ) {
        try {
            ApprovalStatus approvalStatus = ApprovalStatus.valueOf(status.toUpperCase());

            // ⭐ Update + cộng tiền vào booking + attach LateCheckout vào booking
            LateCheckout lc = lateCheckoutService.updateApprovalStatus(requestId, approvalStatus);

            // ⭐ Trả về DTO sau khi update
            LateCheckoutDTO dto = lateCheckoutService.convertToDTO(lc);

            return Map.of(
                    "success", true,
                    "message", "Cập nhật trạng thái thành công",
                    "data", dto
            );

        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "error", e.getMessage()
            );
        }
    }


    /** API tính phí realtime cho FE */
    @GetMapping("/calculate-fee")
    public Map<String, Object> calculateLateCheckoutFee(
            @RequestParam("bookingId") String bookingId,
            @RequestParam("requestTime") String requestTimeStr,
            @RequestParam("roomPrice") double roomPrice
    ) {
        try {
            LocalDateTime requestTime = LocalDateTime.parse(requestTimeStr);

            double fee = lateCheckoutService.calculateFeeOnly(
                    bookingId,
                    requestTime,
                    roomPrice
            );

            return Map.of(
                    "success", true,
                    "fee", fee
            );

        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "error", e.getMessage()
            );
        }
    }
}
