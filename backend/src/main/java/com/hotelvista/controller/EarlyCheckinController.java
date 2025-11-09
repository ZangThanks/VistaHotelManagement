package com.hotelvista.controller;

import com.hotelvista.model.Customer;
import com.hotelvista.model.EarlyCheckin;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.service.CustomerService;
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

    @Autowired
    private CustomerService customerService;

    /**
     * Khách hàng gửi yêu cầu nhận phòng sớm
     * @param payload
     * @return
     */
    @PostMapping("/request")
    public Map<String, Object> requestEarlyCheckin(@RequestBody Map<String, Object> payload) {
        String customerId = (String) payload.get("customerId");
        String requestTimeStr = (String) payload.get("requestTime");
        double roomPrice = Double.parseDouble(payload.get("roomPrice").toString());

        Customer customer = customerService.findById(customerId);
        if (customer == null) {
            return Map.of("success", false, "message", "Không tìm thấy khách hàng");
        }

        LocalDateTime requestTime = LocalDateTime.parse(requestTimeStr);
        EarlyCheckin ec = earlyCheckinService.createPendingRequest(customer, requestTime, roomPrice);

        return Map.of(
                "success", true,
                "message", "Yêu cầu check-in sớm đã được gửi. Vui lòng chờ nhân viên xác nhận.",
                "data", ec
        );
    }

    /**
     * Nhân viên duyệt hoặc từ chối yêu cầu nhận phòng sớm
     * @param requestId
     * @param status
     * @param staffName
     * @return
     */
    @PutMapping("/approve/{id}")
    public Map<String, Object> approveRequest(
            @PathVariable("id") String requestId,
            @RequestParam("status") String status,
            @RequestParam("staff") String staffName) {

        ApprovalStatus approvalStatus = ApprovalStatus.valueOf(status.toUpperCase());
        EarlyCheckin ec = earlyCheckinService.updateApprovalStatus(requestId, approvalStatus, staffName);

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
     * Lấy tất cả yêu cầu nhận phòng sớm
     * @return
     */
    @GetMapping("/all")
    public List<EarlyCheckin> getAll() {
        return earlyCheckinService.findAll();
    }
}
