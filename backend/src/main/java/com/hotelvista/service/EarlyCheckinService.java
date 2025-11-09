package com.hotelvista.service;

import com.hotelvista.model.Customer;
import com.hotelvista.model.EarlyCheckin;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.repository.EarlyCheckinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EarlyCheckinService {

    private final EarlyCheckinRepository repo;

    public List<EarlyCheckin> findAll() {
        return repo.findAll();
    }

    /**
     * Tạo yêu cầu nhận phòng sớm với trạng thái chờ duyệt
     * @param customer
     * @param requestTime
     * @param roomPrice
     * @return
     */
    public EarlyCheckin createPendingRequest(Customer customer, LocalDateTime requestTime, double roomPrice) {
        EarlyCheckin ec = new EarlyCheckin();
        ec.setRequestID(generateRequestId());
        ec.setCustomer(customer);
        ec.setRequestDate(LocalDateTime.now());
        ec.setRequestTime(requestTime);
        ec.setApprovalStatus(ApprovalStatus.PENDING);
        ec.setAdditionalFee(calculateAdditionalFee(requestTime.toLocalTime(), roomPrice));

        return repo.save(ec);
    }

    /**
     * Cập nhật trạng thái duyệt hoặc từ chối yêu cầu nhận phòng sớm
     * @param requestId
     * @param status
     * @param staffName
     * @return
     */
    public EarlyCheckin updateApprovalStatus(String requestId, ApprovalStatus status, String staffName) {
        EarlyCheckin ec = repo.findById(requestId).orElse(null);
        if (ec == null) return null;

        ec.setApprovalStatus(status);
        ec.setApproveBy(staffName);

        return repo.save(ec);
    }

    private double calculateAdditionalFee(LocalTime time, double roomPrice) {
        if (time.isAfter(LocalTime.of(5, 0)) && time.isBefore(LocalTime.of(9, 0))) {
            return roomPrice * 0.5;
        } else if (time.isBefore(LocalTime.of(13, 30))) {
            return roomPrice * 0.3;
        }
        return 0.0;
    }

    private String generateRequestId() {
        String prefix = "ECO" + LocalDate.now().format(DateTimeFormatter.ofPattern("ddMMyy"));
        String lastId = repo.findLastRequestId(prefix);
        int next = 1;
        if (lastId != null && lastId.length() > prefix.length()) {
            next = Integer.parseInt(lastId.substring(prefix.length())) + 1;
        }
        return prefix + String.format("%04d", next);
    }
}
