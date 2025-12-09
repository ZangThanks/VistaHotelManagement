package com.hotelvista.controller;

import com.hotelvista.dto.BookingRequestDTO;
import com.hotelvista.dto.PaymentWebhookDTO;
import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingCancellation;
import com.hotelvista.model.Customer;
import com.hotelvista.model.enums.BookingStatus;
import com.hotelvista.model.enums.PaymentStatus;
import com.hotelvista.service.*;
import com.hotelvista.util.PaymentUtil;
import com.hotelvista.util.QRGenerateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    @Autowired
    private BookingService service;

    @Autowired
    private BookingDetailService bookingDetailService;

    @Autowired
    private BookingServiceService bookingServiceService;

    @Autowired
    private RoomService roomService;

    @GetMapping("")
    public List<Booking> findAll() {
        return service.findAll();
    }

    @PostMapping("/save")
    public boolean save(@RequestBody Booking booking) {
        return service.save(booking);
    }

    @PostMapping("/save-booking")
    public boolean saveBooking(@RequestBody BookingRequestDTO request) {
        return service.saveBooking(request.getBooking(), request.getBookingDetails(), request.getBookingServices());
    }

    @PutMapping("/edit")
    public boolean update(@RequestBody Booking booking) {
        return service.save(booking);
    }

    @GetMapping("/{id}")
    public Booking findById(@PathVariable("id") String id) {
        return service.findById(id);
    }

    //http://localhost:8080/bookings/booking-date?dateAfter=2024-06-10&dateBefore=2024-06-15
    @GetMapping("/booking-date")
    public List<Booking> findAllByBookingDateBetween(@RequestParam LocalDateTime dateAfter, @RequestParam LocalDateTime dateBefore) {
        return service.findAllByBookingDateBetween(dateAfter, dateBefore);
    }

    @GetMapping("/customer/{id}")
    public List<Booking> findAllByCustomer_Id(@PathVariable("id") String customerId) {
        return service.findAllByCustomer_Id(customerId);
    }
    
    @GetMapping("/search")
    public List<Booking> searchBookings(@RequestParam(required = false) String keyword) {
        return service.searchBookings(keyword);
    }

    @GetMapping("/create-booking-id")
    public String generateBookingID() {
        return service.generateBookingID();
    }

    @GetMapping("/room/{roomNumber}")
    public List<Booking> findAllByRoom_RoomNumber(@PathVariable("roomNumber") String roomNumber) {
        return service.findAllByRoom_RoomNumber(roomNumber);
    }

    @PutMapping("/{bookingId}/check-in")
    public Booking checkIn(@PathVariable String bookingId) {
        return service.checkIn(bookingId);
    }

    @GetMapping(value = "/payment-qr/{bookingId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getPaymentQr(@PathVariable String bookingId, @RequestParam(defaultValue = "0") int choice) throws IOException {
        Booking booking = service.findById(bookingId);
        Customer customer = booking.getCustomer();
        double amount = 0;
        if (customer.getReputationPoint() >= 0 && customer.getReputationPoint() <= 40) {
            amount = booking.getTotalAmount(); //thanh toán trước 100%
        } else if (customer.getReputationPoint() > 40 && customer.getReputationPoint() <= 80) {
            amount = booking.getTotalAmount() * 30 / 100; //thanh toán trước 30%
        } else if (customer.getReputationPoint() > 80 && customer.getReputationPoint() <= 100) {
            //Khách trên 80 điểm uy tín được lựa chọn thanh toán trước 0% hoặc 50% hoặc 100%
            if (choice == 1) {
                amount = booking.getTotalAmount(); // 100%
            } else if (choice == 2) {
                amount = booking.getTotalAmount() * 50 / 100; // 50%
            } else {
                amount = 0; // 0% - pay at checkout,
            }
        }

        System.out.println("Booking: " + booking + " - Amount: " + amount + " - Choice: " + choice + " - Reputation: " + customer.getReputationPoint());
        //String info = "The payment of " + bookingId;
        String qrUrl = QRGenerateUtil.buildVietQRUrl(bookingId, amount);
        byte[] qrImage = QRGenerateUtil.generateQrImage(qrUrl);
        return ResponseEntity.ok(qrImage);
    }

    @DeleteMapping("/remove/{id}")
    public boolean delete(@PathVariable("id") String id) {
        return service.deleteById(id);
    }

    @PutMapping("/cancel-payment/{bookingId}")
    public ResponseEntity<Booking> cancelBookingPayment(@PathVariable String bookingId) {
        try {
            Booking booking = service.findById(bookingId);
            if (booking == null) {
                return ResponseEntity.notFound().build();
            }

            // Chỉ cancel nếu status vẫn là PENDING
            if (booking.getStatus() == BookingStatus.PENDING) {
                booking.setPaymentStatus(PaymentStatus.CANCELLED);
                booking.setStatus(BookingStatus.CANCELLED);
            }
            boolean saved = service.save(booking);

            if (saved) {
                System.out.println("Booking " + bookingId + " payment cancelled due to timeout");
                return ResponseEntity.ok(booking);
            } else {
                return ResponseEntity.internalServerError().build();
            }
        } catch (Exception e) {
            System.err.println("Error cancelling booking payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/pay-callback")
    public ResponseEntity<String> handleSePayCallback(@RequestBody PaymentWebhookDTO data) {
        try {
            System.out.println("=== Payment Webhook Received ===");
            System.out.println("Gateway: " + data.getGateway());
            System.out.println("Account: " + data.getAccountNumber());
            System.out.println("Amount: " + data.getTransferAmount());
            System.out.println("Transfer Type: " + data.getTransferType());
            System.out.println("Content: " + data.getContent());
            System.out.println("Description: " + data.getDescription());
            System.out.println("Reference: " + data.getReferenceCode());
            System.out.println("Date: " + data.getTransactionDate());
            System.out.println("================================");

            // Valid transfer type không phải IN
            if (!"in".equalsIgnoreCase(data.getTransferType())) {
                System.out.println("Rejected: Not an incoming transfer");
                return ResponseEntity.badRequest().body("Invalid transfer type. Expected: in");
            }

            // Valid transfer amount
            if (data.getTransferAmount() == null || data.getTransferAmount() <= 0) {
                System.out.println("Rejected: Invalid transfer amount");
                return ResponseEntity.badRequest().body("Transfer amount must be greater than 0");
            }

            // Lấy booking ID từ content or description
            // Format: "Qafmgq4306 SEPAY7974 1 108444155680-B2411250004-CHUYEN TIEN-OQCH00042LgQ-MOMO108444155680MOMO"
            String content = data.getContent();
            String description = data.getDescription();
            String bookingId = PaymentUtil.extractBookingId(content, description);

            if (bookingId == null || bookingId.isEmpty()) {
                System.out.println("Rejected: Cannot extract booking ID");
                System.out.println("Content: " + content);
                System.out.println("Description: " + description);
                return ResponseEntity.badRequest().body("Cannot extract booking ID from payment");
            }

            System.out.println("Extracted Booking ID: " + bookingId);

            Booking booking = service.findById(bookingId);
            if (booking == null) {
                System.out.println("Rejected: Booking not found with ID: " + bookingId);
                return ResponseEntity.badRequest().body("Booking not found: " + bookingId);
            }

            // Check nếu đã paid
            if (booking.getPaymentStatus() == PaymentStatus.PAID && booking.getStatus() != BookingStatus.CHECKED_OUT
            ) {
                System.out.println("Warning: Booking " + bookingId + " is already paid");
                return ResponseEntity.ok("Booking already marked as paid");
            }

            // Xác định amount và status
            Customer customer = booking.getCustomer();
            double receivedAmount = data.getTransferAmount();
            double totalAmount = booking.getTotalAmount();
            
            PaymentStatus newStatus = PaymentUtil.determinePaymentStatus(receivedAmount, totalAmount, customer);
            
            // Log amount validation
            double expectedAmount = PaymentUtil.calculateExpectedPaymentAmount(booking, customer);
            if (expectedAmount > 0 && Math.abs(receivedAmount - expectedAmount) > 0.01) {
                System.out.println("Warning: Amount mismatch - Expected: " + expectedAmount + ", Received: " + receivedAmount);
            }

            // Update booking payment status
            booking.setPaymentStatus(newStatus);

            // Chuyển status sang PENDING khi đã thanh toán (bất kể %)
            if (booking.getStatus() == BookingStatus.WAITING) {
                booking.setStatus(BookingStatus.PENDING);
                System.out.println("Booking status changed from WAITING to PENDING");
            }
            
            boolean saved = service.save(booking);

            if (saved) {
                System.out.println("SUCCESS: Booking " + bookingId + " payment status updated to " + newStatus);
                System.out.println("Amount received: " + receivedAmount + " / Total: " + totalAmount);
                return ResponseEntity.ok("Payment confirmed for booking " + bookingId + ". Status: " + newStatus);
            } else {
                System.out.println("ERROR: Failed to save booking " + bookingId);
                return ResponseEntity.internalServerError().body("Failed to update booking status");
            }

        } catch (Exception e) {
            System.err.println("ERROR processing payment webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error processing payment: " + e.getMessage());
        }
    }

    /**
     * Lây bookings theo check-in date
     */
    @GetMapping("/check-in-date")
    public List<Booking> findAllByCheckInDate(@RequestParam String date) {
        LocalDate checkInDate = LocalDate.parse(date);
        LocalDateTime startOfDay = checkInDate.atStartOfDay();
        LocalDateTime endOfDay = checkInDate.atTime(23, 59, 59);
        return service.findAllByCheckInDateBetween(startOfDay, endOfDay);
    }

    /**
     * Lấy bookings khoảng thời gian
     */
    @GetMapping("/check-in-range")
    public List<Booking> findAllByCheckInDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);
        return service.findAllByCheckInDateBetween(startDateTime, endDateTime);
    }

    /**
     * Lấy bookings theo check-out date
     */
    @GetMapping("/check-out-date")
    public List<Booking> findAllByCheckOutDate(@RequestParam String date) {
        LocalDate checkOutDate = LocalDate.parse(date);
        LocalDateTime startOfDay = checkOutDate.atStartOfDay();
        LocalDateTime endOfDay = checkOutDate.atTime(23, 59, 59);
        return service.findAllByCheckOutDateBetween(startOfDay, endOfDay);
    }

    /**
     * Lấy bookings theo check-out date range
     */
    @GetMapping("/check-out-range")
    public List<Booking> findAllByCheckOutDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);
        return service.findAllByCheckOutDateBetween(startDateTime, endDateTime);
    }

    /**
     * Process checkout và thanh toán
     */
    @PostMapping("/{bookingId}/checkout")
    public ResponseEntity<?> processCheckout(
            @PathVariable String bookingId,
            @RequestBody String paymentMethod
    ) {
        try {
//            String paymentMethod = request.get("paymentMethod");
            Booking booking = service.findById(bookingId);

            if (booking == null) {
                return ResponseEntity.badRequest().body("Booking not found");
            }

//            if (booking.getStatus() != BookingStatus.CHECKED_IN) {
//                return ResponseEntity.badRequest().body("Booking must be checked in to checkout");
//            }

            if (booking.getPaymentStatus() != PaymentStatus.PAID) {
                double remainingAmount = calculateRemainingAmount(booking);

                if (remainingAmount > 0) {

                    booking.setPaymentStatus(PaymentStatus.PAID);
                }
            }

            // Cập nhật trạng thái booking sang CHECKED_OUT
            booking.setStatus(BookingStatus.CHECKED_OUT);
            booking.setCheckOutDate(LocalDateTime.now());

//            booking.getBookingDetails().forEach(r -> {
//                r.getRoom().setStatus(RoomStatus.CLEANING);
//                roomService.save(r.getRoom());
//            });

            boolean saved = service.save(booking);
            System.out.println("BOOKING ĐÃ CẬP NHẬT: " + saved);

            if (saved) {
                return ResponseEntity.ok(booking);
            } else {
                return ResponseEntity.internalServerError().body("Failed to process checkout");
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error processing checkout: " + e.getMessage());
        }
    }

    /**
     * Tính số tiền còn lại cần thanh toán
     */
    private double calculateRemainingAmount(Booking booking) {
        double totalAmount = booking.getTotalAmount();
        PaymentStatus status = booking.getPaymentStatus();

        switch (status) {
            case PAID:
                return 0;
            case PERCENTAGE_50:
                return totalAmount * 0.5;
            case PERCENTAGE_30:
                return totalAmount * 0.7;
            case PENDING:
                return totalAmount;
            default:
                return totalAmount;
        }
    }

    /**
     * Lấy thông tin checkout chi tiết
     */
    @GetMapping("/{bookingId}/checkout-details")
    public ResponseEntity<?> getCheckoutDetails(@PathVariable String bookingId) {
        try {
            Booking booking = service.findById(bookingId);

            if (booking == null) {
                return ResponseEntity.badRequest().body("Booking not found");
            }

            // Tính toán chi tiết thanh toán
            double totalAmount = booking.getTotalAmount();
            double paidAmount = calculatePaidAmount(booking);
            double remainingAmount = totalAmount - paidAmount;

            Map<String, Object> details = new HashMap<>();
            details.put("booking", booking);
            details.put("totalAmount", totalAmount);
            details.put("paidAmount", paidAmount);
            details.put("remainingAmount", remainingAmount);
            details.put("paymentStatus", booking.getPaymentStatus());

            return ResponseEntity.ok(details);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error getting checkout details: " + e.getMessage());
        }
    }

    /**
     * Tính số tiền đã thanh toán
     */
    private double calculatePaidAmount(Booking booking) {
        double totalAmount = booking.getTotalAmount();
        PaymentStatus status = booking.getPaymentStatus();

        switch (status) {
            case PAID:
                return totalAmount;
            case PERCENTAGE_50:
                return totalAmount * 0.5;
            case PERCENTAGE_30:
                return totalAmount * 0.3;
            case PENDING:
                return 0;
            default:
                return 0;
        }
    }
    @GetMapping("/overlapping-bookings/{roomNumber}")
    public List<LocalDateTime> findOverlappingBookings(@PathVariable("roomNumber") String roomNumber) {
        return bookingDetailService.findOverlappingBookings(roomNumber);
    }

    /**
     * Kiểm tra phòng có available trong khoảng thời gian không
     * Trả về danh sách các booking bị trùng lịch
     */
    @GetMapping("/check-availability")
    public ResponseEntity<?> checkRoomAvailability(
            @RequestParam String roomNumber,
            @RequestParam String checkInDate,
            @RequestParam String checkOutDate
    ) {
        try {
            // Xử lý ISO format: "2025-12-07T14:30:00.000Z"
            String cleanCheckIn = checkInDate.replace("Z", "");
            if (cleanCheckIn.contains(".")) {
                cleanCheckIn = cleanCheckIn.substring(0, cleanCheckIn.indexOf("."));
            }

            String cleanCheckOut = checkOutDate.replace("Z", "");
            if (cleanCheckOut.contains(".")) {
                cleanCheckOut = cleanCheckOut.substring(0, cleanCheckOut.indexOf("."));
            }

            LocalDateTime checkIn = LocalDateTime.parse(cleanCheckIn);
            LocalDateTime checkOut = LocalDateTime.parse(cleanCheckOut);

            if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
                return ResponseEntity.badRequest().body("Check-out must be after check-in");
            }

            List<Booking> conflicts = service.findConflictingBookings(roomNumber, checkIn, checkOut);
            return ResponseEntity.ok(conflicts);

        } catch (Exception e) {
            System.err.println("Error checking room availability: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error checking room availability: " + e.getMessage());
        }
    }

    /**
     * Xác nhận booking cho pay at checkout
     */
    @PutMapping("/{bookingId}/confirm-pay-at-checkout")
    public ResponseEntity<?> confirmPayAtCheckout(@PathVariable String bookingId) {
        try {
            Booking booking = service.findById(bookingId);
            if (booking == null) {
                return ResponseEntity.badRequest().body("Booking not found");
            }

            // Chuyển status sang WAITING to PENDING cho pay at checkout
            if (booking.getStatus() == BookingStatus.WAITING) {
                booking.setStatus(BookingStatus.PENDING);
                boolean saved = service.save(booking);
                
                if (saved) {
                    System.out.println("Booking " + bookingId + " confirmed for pay at checkout. Status: PLACE");
                    return ResponseEntity.ok(booking);
                } else {
                    return ResponseEntity.internalServerError().body("Failed to confirm booking");
                }
            }
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            System.err.println("Error confirming pay at checkout: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    /**
     * Hủy booking
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable String id,
            @RequestBody Map<String, Object> body
    ) {
        BookingCancellation cancellation = service.cancelBooking(id, body);
        return ResponseEntity.ok(cancellation);
    }

    @GetMapping("/status-and-date")
    public List<Booking> findAllByStatusAndBookingDate(BookingStatus status, LocalDateTime bookingDate) {
        return service.findAllByStatusAndBookingDate(BookingStatus.WAITING, LocalDateTime.now().minusMinutes(8));
    }

    @GetMapping("/remaining-payment-time/{bookingId}")
    public String getRemainingPaymentTime(@PathVariable("bookingId") String bookingId) {
        return service.getRemainingPaymentTime(bookingId);

    }
    
    @GetMapping(value = "/payment-qr-checkout/{bookingId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getPaymentQr(
            @PathVariable String bookingId
    ) {
        try {
            Booking booking = service.findById(bookingId);

            AtomicReference<Double> paymentAmount = new AtomicReference<>((double) 0);
            if(booking != null) {
                paymentAmount.set(calculateRemainingAmount(booking));
            }

            List<com.hotelvista.model.BookingService> listServiceDetail = bookingServiceService.findAllByBooking_BookingID(bookingId);
            if(listServiceDetail != null) {
                listServiceDetail.forEach((sd) -> {
                    paymentAmount.updateAndGet(v -> v + sd.getTotalAmount());
                    System.out.println(sd);
                });
            }
            System.out.println("===================================SO TIEN: " + paymentAmount.get());
            String qrUrl = QRGenerateUtil.buildVietQRUrl(bookingId, paymentAmount.get());
            byte[] qrImage = QRGenerateUtil.generateQrImage(qrUrl);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}