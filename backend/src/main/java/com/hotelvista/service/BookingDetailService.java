package com.hotelvista.service;

import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.Review;
import com.hotelvista.repository.BookingDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingDetailService {
    @Autowired
    private BookingDetailRepository repo;

    public List<BookingDetail> findAll() {
        return repo.findAll();
    }

    public boolean save(BookingDetail bookingDetail) {
        return repo.save(bookingDetail) != null;
    }

    public List<BookingDetail> findAllByBooking_BookingID(String bookingBookingID) {
        return repo.findAllByBooking_BookingID(bookingBookingID);
    }
}
