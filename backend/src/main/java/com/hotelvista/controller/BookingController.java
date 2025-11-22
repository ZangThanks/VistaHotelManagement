package com.hotelvista.controller;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.Customer;
import com.hotelvista.service.BookingDetailService;
import com.hotelvista.service.BookingService;
import com.hotelvista.util.QRGenerateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    @Autowired
    private BookingService service;

    @Autowired
    private BookingDetailService detailService;

    @GetMapping("")
    public List<Booking> findAll() {
        return service.findAll();
    }

    @PostMapping("/save")
    public boolean save(@RequestBody Booking booking) {
        return service.save(booking);
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
        String info = "The payment of " + bookingId;
        String qrUrl = QRGenerateUtil.buildVietQRUrl("MBBank", "0949770422", amount, info);
        byte[] qrImage = QRGenerateUtil.generateQrImage(qrUrl);
        return ResponseEntity.ok(qrImage);
    }

}