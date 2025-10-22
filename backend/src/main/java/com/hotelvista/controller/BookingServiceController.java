package com.hotelvista.controller;

import com.hotelvista.model.BookingService;
import com.hotelvista.service.BookingServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking-services")
public class BookingServiceController {
    @Autowired
    private BookingServiceService service;

    @GetMapping("")
    public List<BookingService> findAll() {
        return service.findAll();
    }

    @PostMapping("/save")
    public boolean save(@RequestBody BookingService bookingService) {
        return service.save(bookingService);
    }

    //http://localhost:8080/booking-services/booking/BOOK001
    @GetMapping("/booking/{id}")
    public List<BookingService> findAllByBooking_BookingID(@PathVariable("id") String bookingBookingID) {
        return service.findAllByBooking_BookingID(bookingBookingID);
    }
}
