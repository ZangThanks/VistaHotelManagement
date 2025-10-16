package com.hotelvista.service;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public boolean add(Booking booking) {
        try {
            Booking savedBooking = repo.save(booking);
            for (BookingDetail detail : savedBooking.getBookingDetails()) {
                detail.setBooking(booking);
            }
            for (com.hotelvista.model.BookingService bs : savedBooking.getBookingServices()) {
                bs.setBooking(booking);
            }
            repo.save(booking);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteById(String id) {
        repo.deleteById(id);
        return repo.findById(id).orElse(null) == null;
    }

    public List<Booking> findAllByBookingDateBetween(LocalDateTime bookingDateAfter, LocalDateTime bookingDateBefore) {
        return repo.findAllByBookingDateBetween(bookingDateAfter, bookingDateBefore);
    }

    public List<Booking> findAllByCustomer_Id(String customerId) {
        return repo.findAllByCustomer_Id(customerId);
    }
}
