package com.hotelvista.service;

import com.hotelvista.dto.LateCheckoutDTO;
import com.hotelvista.model.Booking;
import com.hotelvista.model.LateCheckout;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.repository.BookingRepository;
import com.hotelvista.repository.LateCheckoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class LateCheckoutService {

    @Autowired
    private LateCheckoutRepository repo;

    @Autowired
    private BookingRepository bookingRepository;

    /** Lấy toàn bộ yêu cầu */
    public List<LateCheckout> findAll() {
        return repo.findAll();
    }

    /** Trả về DTO đầy đủ cho FE */
    public List<LateCheckoutDTO> getAllDTO() {

        return repo.findAll().stream().map(item -> {
            LateCheckoutDTO dto = new LateCheckoutDTO();

            dto.setRequestID(item.getRequestID());
            dto.setRequestTime(item.getRequestTime());
            dto.setRequestDate(item.getRequestDate());
            dto.setAdditionalFee(item.getAdditionalFee());
            dto.setApprovalStatus(item.getApprovalStatus().name());
            dto.setBookingId(item.getBooking().getBookingID());

            Booking booking = bookingRepository.findById(item.getBooking().getBookingID()).orElse(null);

            if (booking != null) {
                dto.setCustomerName(booking.getCustomer().getFullName());
                dto.setCustomerEmail(booking.getCustomer().getEmail());
                dto.setCheckInDate(booking.getCheckInDate().toString());
                dto.setCheckOutDate(booking.getCheckOutDate().toString());

                if (!booking.getBookingDetails().isEmpty()) {
                    var detail = booking.getBookingDetails().get(0);

                    dto.setRoomNumber(detail.getRoom().getRoomNumber());
                    dto.setRoomType(detail.getRoom().getRoomType().getTypeName());
                    dto.setRoomPrice(detail.getRoomPrice());
                }
            }

            return dto;
        }).toList();
    }

    /**
     * Tạo yêu cầu checkout muộn (PENDING)
     */
    public LateCheckout createPendingRequest(
            String bookingId,
            LocalDateTime requestTime,
            double roomPrice
    ) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            throw new IllegalArgumentException("Booking not found: " + bookingId);
        }

        // Không cho tạo 2 yêu cầu Late Checkout cho cùng 1 booking
        if (booking.getLateCheckout() != null) {
            throw new IllegalStateException("Late Checkout request already exists for this booking !!!");
        }

        // Checkout muộn phải sau checkout gốc
        if (requestTime.isBefore(booking.getCheckOutDate())) {
            throw new IllegalArgumentException("Late checkout time must be after the original checkout time !!!");
        }

        LateCheckout lc = new LateCheckout();

        lc.setRequestID(generateRequestId());
        lc.setBooking(booking);
        lc.setRequestDate(requestTime);
        lc.setRequestTime(requestTime);
        lc.setApprovalStatus(ApprovalStatus.PENDING);

        // Tính phí theo logic hệ thống
        double fee = calculateAdditionalFee(booking, requestTime.toLocalTime(), roomPrice);
        lc.setAdditionalFee(fee);

        return repo.save(lc);
    }

    /**
     * Cập nhật trạng thái APPROVED / REJECTED
     * UPDATE BOOKING + CỘNG PHÍ
     */
    public LateCheckout updateApprovalStatus(String requestId, ApprovalStatus status) {

        LateCheckout lc = repo.findById(requestId).orElse(null);
        if (lc == null) {
            throw new IllegalArgumentException("Late checkout request not found: " + requestId);
        }

        lc.setApprovalStatus(status);

        // Khi APPROVED: Gắn vào booking + cộng phí vào totalAmount
        if (status == ApprovalStatus.APPROVED) {
            Booking booking = lc.getBooking();

            // Gắn lateCheckout vào booking
            booking.setLateCheckout(lc);

            // Cộng phí vào tổng hóa đơn
            double fee = lc.getAdditionalFee();
            booking.setTotalAmount(booking.getTotalAmount() + fee);

            bookingRepository.save(booking);
        }

        return repo.save(lc);
    }

    /**
     * Tính phụ phí checkout muộn
     * - 12:00–13:00 → Bronze/Silver: 10%, Gold+: 0%
     * - 13:00–15:00 → +30%
     * - 15:00–18:00 → +50%
     * - Sau 18:00 → +100% (1 ngày)
     */
    private double calculateAdditionalFee(Booking booking, LocalTime time, double roomPrice) {

        LocalTime startFree = LocalTime.of(12, 0);
        LocalTime endFree   = LocalTime.of(13, 0);

        LocalTime start30   = LocalTime.of(13, 0);
        LocalTime end30     = LocalTime.of(15, 0);

        LocalTime start50   = LocalTime.of(15, 0);
        LocalTime end50     = LocalTime.of(18, 0);

        MemberShipLevel level = booking.getCustomer().getMemberShipLevel();

        boolean isGoldOrAbove =
                level == MemberShipLevel.GOLD ||
                        level == MemberShipLevel.PLATINUM;

        // 12:00 – 13:00
        if (!time.isBefore(startFree) && time.isBefore(endFree)) {
            return isGoldOrAbove ? 0.0 : roomPrice * 0.10;
        }

        // 13:00 – 15:00 → 30%
        if (!time.isBefore(start30)) {
            return roomPrice * 0.30;
        }

        // 15:00 – 18:00 → 50%
        if (!time.isBefore(start50) && time.isBefore(end50)) {
            return roomPrice * 0.50;
        }

        // Sau 18:00 → 100%
        if (time.isAfter(end50) || time.equals(end50)) {
            return roomPrice;
        }

        // Trước 12:00 → không phải checkout muộn
        return 0.0;
    }

    /**
     * Sinh ID dạng LCOddMMyy0001
     */
    private String generateRequestId() {
        String prefix = "LCO" + LocalDate.now().format(DateTimeFormatter.ofPattern("ddMMyy"));
        String lastId = repo.findLastRequestId(prefix);

        int next = 1;

        if (lastId != null && lastId.length() > prefix.length()) {
            try {
                next = Integer.parseInt(lastId.substring(prefix.length())) + 1;
            } catch (NumberFormatException ignored) {}
        }

        return prefix + String.format("%04d", next);
    }

    public double calculateFeeOnly(String bookingId, LocalDateTime requestTime, double roomPrice) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            throw new IllegalArgumentException("Booking not found: " + bookingId);
        }
        return calculateAdditionalFee(booking, requestTime.toLocalTime(), roomPrice);
    }

    public LateCheckoutDTO convertToDTO(LateCheckout item) {
        LateCheckoutDTO dto = new LateCheckoutDTO();

        dto.setRequestID(item.getRequestID());
        dto.setRequestTime(item.getRequestTime());
        dto.setRequestDate(item.getRequestDate());
        dto.setAdditionalFee(item.getAdditionalFee());
        dto.setApprovalStatus(item.getApprovalStatus().name());
        dto.setBookingId(item.getBooking().getBookingID());

        Booking booking = bookingRepository.findById(item.getBooking().getBookingID()).orElse(null);

        if (booking != null) {
            dto.setCustomerName(booking.getCustomer().getFullName());
            dto.setCustomerEmail(booking.getCustomer().getEmail());
            dto.setCheckInDate(booking.getCheckInDate().toString());
            dto.setCheckOutDate(booking.getCheckOutDate().toString());

            if (!booking.getBookingDetails().isEmpty()) {
                var detail = booking.getBookingDetails().get(0);

                dto.setRoomNumber(detail.getRoom().getRoomNumber());
                dto.setRoomType(detail.getRoom().getRoomType().getTypeName());
                dto.setRoomPrice(detail.getRoomPrice());
            }
        }

        return dto;
    }

}
