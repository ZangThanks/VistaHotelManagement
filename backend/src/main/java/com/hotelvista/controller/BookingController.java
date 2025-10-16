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

    @GetMapping("/booking-date")
    public List<Booking> findAllByBookingDateBetween(@RequestParam LocalDateTime dateAfter, @RequestParam LocalDateTime dateBefore) {
        return service.findAllByBookingDateBetween(dateAfter, dateBefore);
    }

    @GetMapping("/customer/{id}")
    public List<Booking> findAllByCustomer_Id(@PathVariable("id") String customerId) {
        return service.findAllByCustomer_Id(customerId);
    }
}
