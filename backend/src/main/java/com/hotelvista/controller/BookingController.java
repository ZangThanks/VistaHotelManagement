package com.hotelvista.controller;

import com.hotelvista.dto.BookingRequestDTO;
import com.hotelvista.dto.PaymentWebhookDTO;
import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.Customer;
import com.hotelvista.model.enums.BookingStatus;
import com.hotelvista.model.enums.PaymentStatus;
import com.hotelvista.service.BookingDetailService;
import com.hotelvista.service.BookingService;
import com.hotelvista.util.PaymentUtil;
import com.hotelvista.util.QRGenerateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    @Autowired
    private BookingService service;

    @Autowired
    private BookingDetailService bookingDetailService;

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

    // http://localhost:8080/bookings/search?keyword=BKG001
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
                amount = 0; // 0% - pay at checkout
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

            booking.setPaymentStatus(PaymentStatus.CANCELLED);
            booking.setStatus(BookingStatus.CANCELLED);
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
            if (booking.getPaymentStatus() == PaymentStatus.PAID) {
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

    @PutMapping("/{bookingId}/check-in")
    public Booking checkIn(@PathVariable String bookingId) {
        return service.checkIn(bookingId);
    }

    @GetMapping("/overlapping-bookings/{roomNumber}")
    public List<LocalDate> findOverlappingBookings(String roomNumber) {
        return bookingDetailService.findOverlappingBookings(roomNumber);
    }
}