package com.hotelvista.controller;

import com.hotelvista.model.Booking;
import com.hotelvista.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    @Autowired
    private BookingService service;

    @GetMapping("")
    public List<Booking> findAll() {
        return service.findAll();
    }

    @PostMapping("/save")
    public boolean save(@RequestBody Booking booking) {
        return service.save(booking);
    }

    @PutMapping("/edit/{id}")
    public boolean update(@RequestBody Booking booking, @PathVariable("id") String bookingId) {
        booking.setBookingID(bookingId);
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
}