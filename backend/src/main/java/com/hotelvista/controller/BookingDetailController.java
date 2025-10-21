package com.hotelvista.controller;

import com.hotelvista.model.BookingDetail;
import com.hotelvista.service.BookingDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking-details")
public class BookingDetailController {
    @Autowired
    private BookingDetailService service;

    @GetMapping("")
    public List<BookingDetail> findAll() {
        return service.findAll();
    }

    @PostMapping("/save")
    public boolean save(@RequestBody BookingDetail bookingDetail) {
        return service.save(bookingDetail);
    }

    //http://localhost:8080/booking-details/booking/BOOK002
    @GetMapping("/booking/{id}")
    public List<BookingDetail> findAllByBooking_BookingID(@PathVariable("id") String bookingBookingID) {
        return service.findAllByBooking_BookingID(bookingBookingID);
    }
}
