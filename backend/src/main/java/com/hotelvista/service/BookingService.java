package com.hotelvista.service;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository repo;

    @Transactional(readOnly = true)
    public List<Booking> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public List<Booking> findAllByBookingDateBetween(LocalDateTime bookingDateAfter, LocalDateTime bookingDateBefore) {
        return repo.findAllByBookingDateBetween(bookingDateAfter, bookingDateBefore);
    }

    @Transactional(readOnly = true)
    public List<Booking> findAllByCustomer_Id(String customerId) {
        return repo.findAllByCustomer_Id(customerId);
    }

    @Transactional(readOnly = true)
    public List<Booking> searchBookings(String keyword) {
        return repo.searchBookings(keyword);
    }

    @Transactional
    public String generateBookingID() {
         LocalDate today = LocalDate.now();
         String prefix = "B" + today.format(DateTimeFormatter.ofPattern("ddMMyy")); // B110925
    
        Integer maxSequence = repo.findMaxSequenceForToday(prefix);
        int nextSequence = (maxSequence == null) ? 1 : maxSequence + 1;
    
        return prefix + String.format("%04d", nextSequence); // B1109250001
    }

    @Transactional(readOnly = true)
    public List<Booking> findAllByRoom_RoomNumber(String roomNumber) {
        return repo.findAllByRoom_RoomNumber(roomNumber);
    }
}
