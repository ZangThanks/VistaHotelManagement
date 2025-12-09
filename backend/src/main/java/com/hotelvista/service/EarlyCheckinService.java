package com.hotelvista.service;

import com.hotelvista.model.Booking;
import com.hotelvista.model.EarlyCheckin;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.repository.BookingRepository;
import com.hotelvista.repository.EarlyCheckinRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EarlyCheckinService {

    @Autowired
    private EarlyCheckinRepository repo;
    @Autowired
    private BookingRepository bookingRepository;

    /** Lấy tất cả yêu cầu */
    public List<EarlyCheckin> findAll() {
        return repo.findAll();
    }

    /**
     * Tạo yêu cầu check-in sớm (PENDING)
     */
    public EarlyCheckin createPendingRequest(
            String bookingId,
            LocalDateTime requestTime,
            double roomPrice
    ) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) return null;

        EarlyCheckin ec = new EarlyCheckin();

        ec.setRequestID(generateRequestId());
        ec.setBooking(booking);
        ec.setRequestDate(LocalDateTime.now());
        ec.setRequestTime(requestTime);
        ec.setApprovalStatus(ApprovalStatus.PENDING);

        double fee = calculateAdditionalFee(requestTime.toLocalTime(), roomPrice);
        ec.setAdditionalFee(fee);

        return repo.save(ec);
    }

    /**
     * Cập nhật trạng thái APPROVED / REJECTED
     */
    public EarlyCheckin updateApprovalStatus(String requestId, ApprovalStatus status) {
        EarlyCheckin ec = repo.findById(requestId).orElse(null);
        if (ec == null) return null;

        ec.setApprovalStatus(status);
        return repo.save(ec);
    }

    /**
     * Tính phí theo đặc tả:
     * 05:00 – 09:00 → +50%
     * 09:00 – 13:30 → +30%
     */
    private double calculateAdditionalFee(LocalTime time, double roomPrice) {

        LocalTime start50 = LocalTime.of(5, 0);
        LocalTime end50 = LocalTime.of(9, 0);

        LocalTime end30 = LocalTime.of(13, 30);

        // 50% fee
        if (!time.isBefore(start50) && !time.isAfter(end50)) {
            return roomPrice * 0.5;
        }

        // 30% fee: sau 9:00 đến 13:30
        if (time.isAfter(end50) && !time.isAfter(end30)) {
            return roomPrice * 0.3;
        }

        return 0.0;
    }


    /**
     * Sinh mã ECOddMMyy0001
     */
    private String generateRequestId() {
        String prefix = "ECI" + LocalDate.now().format(DateTimeFormatter.ofPattern("ddMMyy"));

        String lastId = repo.findLastRequestId(prefix);

        int next = 1;
        if (lastId != null && lastId.length() > prefix.length()) {
            next = Integer.parseInt(lastId.substring(prefix.length())) + 1;
        }

        return prefix + String.format("%04d", next);
    }
}
