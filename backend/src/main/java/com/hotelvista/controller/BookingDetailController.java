package com.hotelvista.controller;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.Room;
import com.hotelvista.service.BookingDetailService;
import com.hotelvista.service.BookingService;
import com.hotelvista.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking-details")
public class BookingDetailController {
    @Autowired
    private BookingDetailService service;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomService roomService;

    @GetMapping("/{bookingID}/{roomNumber}")
    public BookingDetail getById(@PathVariable String bookingID, @PathVariable String roomNumber) {
        Room room = roomService.findById(roomNumber);
        Booking booking = bookingService.findById(bookingID);
        BookingDetail.BookingDetailId id = new BookingDetail.BookingDetailId(room, booking);

        return service.findById(id);
    }

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
