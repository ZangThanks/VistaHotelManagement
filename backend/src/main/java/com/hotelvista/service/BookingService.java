package com.hotelvista.service;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository repo;

    public List<Booking> findAll() {
        return repo.findAll();
    }

    public Booking findById(String id) {
        return repo.findById(id).orElse(null);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean save(Booking booking) {
        try {
            Booking savedBooking = repo.save(booking);
            if (savedBooking.getBookingDetails() != null) {
                for (BookingDetail detail : savedBooking.getBookingDetails()) {
                    detail.setBooking(booking);
                }
            }
            if (savedBooking.getBookingServices() != null) {
                for (com.hotelvista.model.BookingService bs : savedBooking.getBookingServices()) {
                    bs.setBooking(booking);
                }
            }

            repo.save(booking);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Booking> findAllByBookingDateBetween(LocalDateTime bookingDateAfter, LocalDateTime bookingDateBefore) {
        return repo.findAllByBookingDateBetween(bookingDateAfter, bookingDateBefore);
    }

    public List<Booking> findAllByCustomer_Id(String customerId) {
        return repo.findAllByCustomer_Id(customerId);
    }

    public List<Booking> searchBookings(String keyword) {
        return repo.searchBookings(keyword);
    }

}
