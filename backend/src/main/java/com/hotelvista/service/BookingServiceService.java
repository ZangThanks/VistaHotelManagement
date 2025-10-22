package com.hotelvista.service;

import com.hotelvista.model.BookingService;
import com.hotelvista.repository.BookingServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceService {
    @Autowired
    private BookingServiceRepository repo;

    public List<BookingService> findAll() {
        return repo.findAll();
    }

    public boolean save(BookingService bookingService) {
        return repo.save(bookingService) != null;
    }

    public List<BookingService> findAllByBooking_BookingID(String bookingBookingID) {
        return repo.findAllByBooking_BookingID(bookingBookingID);
    }
}
